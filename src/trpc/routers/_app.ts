import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import {
	codeSubmissions,
	leaderboardEntries,
	roastFixes,
	roastIssues,
	roasts,
} from "@/db/schema";
import { generateRoast } from "@/lib/llm";
import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
	metrics: baseProcedure.query(async () => {
		try {
			const result = await db
				.select({
					count: sql`count(*)`,
					avgScore: sql`avg(${roasts.score})`,
				})
				.from(roasts);

			const count = Number(result[0]?.count ?? 0);
			const avgScore = result[0]?.avgScore
				? Math.round(Number(result[0].avgScore) * 10) / 10
				: 0;

			return { count, avgScore };
		} catch {
			return { count: 0, avgScore: 0 };
		}
	}),

	leaderboard: baseProcedure.query(async () => {
		try {
			const [entriesResult, countResult] = await Promise.all([
				db
					.select({
						rank: sql`row_number() over (order by ${roasts.score} desc)`.as(
							"rank",
						),
						score: roasts.score,
						language: roasts.language,
						code: roasts.code,
						createdAt: roasts.createdAt,
					})
					.from(roasts)
					.orderBy(sql`${roasts.score} desc`)
					.limit(10),
				db
					.select({
						count: sql`count(*)`,
					})
					.from(roasts),
			]);

			const entries = entriesResult.map((e, idx) => ({
				...e,
				rank: idx + 1,
				score: Number(e.score),
				createdAt: e.createdAt?.toISOString() ?? new Date().toISOString(),
			}));
			const totalCount = Number(countResult[0]?.count ?? 0);

			return { entries, totalCount };
		} catch {
			return { entries: [], totalCount: 0 };
		}
	}),

	getRoast: baseProcedure
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ input }) => {
			try {
				const [roastResult] = await db
					.select({
						id: roasts.id,
						score: roasts.score,
						roastText: roasts.roastText,
						verdict: roasts.verdict,
						language: roasts.language,
						code: roasts.code,
						roastMode: roasts.roastMode,
						createdAt: roasts.createdAt,
					})
					.from(roasts)
					.where(sql`${roasts.id} = ${input.id}`);

				if (!roastResult) {
					return null;
				}

				const issues = await db
					.select({
						type: roastIssues.type,
						title: roastIssues.title,
						description: roastIssues.description,
					})
					.from(roastIssues)
					.where(sql`${roastIssues.roastId} = ${input.id}`);

				const [fixResult] = await db
					.select({
						diff: roastFixes.diff,
					})
					.from(roastFixes)
					.where(sql`${roastFixes.roastId} = ${input.id}`);

				const lines = roastResult.code.split("\n").length;

				return {
					id: roastResult.id,
					score: Number(roastResult.score),
					verdict: roastResult.verdict,
					roastTitle: roastResult.roastText,
					language: roastResult.language,
					lines,
					code: roastResult.code,
					issues: issues.map((i) => ({
						type: i.type,
						title: i.title,
						description: i.description,
					})),
					fix: fixResult?.diff ?? "",
				};
			} catch {
				return null;
			}
		}),

	shameLeaderboard: baseProcedure.query(async () => {
		try {
			const [entriesResult, countResult] = await Promise.all([
				db
					.select({
						rank: leaderboardEntries.rank,
						score: leaderboardEntries.score,
						language: leaderboardEntries.language,
						code: leaderboardEntries.codePreview,
					})
					.from(leaderboardEntries)
					.orderBy(sql`${leaderboardEntries.score} DESC`)
					.limit(3),
				db
					.select({
						count: sql`count(*)`,
					})
					.from(leaderboardEntries),
			]);

			const entries = entriesResult.map((e) => ({
				...e,
				score: Number(e.score),
			}));
			const totalCount = Number(countResult[0]?.count ?? 0);

			return { entries, totalCount };
		} catch {
			return { entries: [], totalCount: 0 };
		}
	}),

	createRoast: baseProcedure
		.input(
			z.object({
				code: z.string().min(1).max(100000),
				language: z.string().optional(),
				roastMode: z.enum(["normal", "spicy"]),
			}),
		)
		.mutation(async ({ input }) => {
			const { code, language, roastMode } = input;

			const detectedLanguage = language || "plaintext";

			let llmResponse: Awaited<ReturnType<typeof generateRoast>>;
			try {
				llmResponse = await generateRoast(code, detectedLanguage, roastMode);
			} catch (error) {
				console.error("LLM error:", error);
				throw new Error("Failed to generate roast");
			}

			const [submission] = await db
				.insert(codeSubmissions)
				.values({
					code,
					language: detectedLanguage,
					isAnonymous: true,
				})
				.returning();

			const [roast] = await db
				.insert(roasts)
				.values({
					submissionId: submission.id,
					code,
					language: detectedLanguage,
					roastMode,
					score: llmResponse.score.toString(),
					roastText: llmResponse.roastTitle,
					verdict: llmResponse.verdict,
				})
				.returning();

			for (const issue of llmResponse.issues) {
				await db.insert(roastIssues).values({
					roastId: roast.id,
					type: issue.type,
					title: issue.title,
					description: issue.description,
				});
			}

			await db.insert(roastFixes).values({
				roastId: roast.id,
				diff: llmResponse.fix,
			});

			return {
				id: roast.id,
				code,
				language: detectedLanguage,
				roastMode,
				score: llmResponse.score,
				verdict: llmResponse.verdict,
				roastTitle: llmResponse.roastTitle,
				issues: llmResponse.issues,
				fix: llmResponse.fix,
			};
		}),
});

export type AppRouter = typeof appRouter;
