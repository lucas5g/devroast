import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { codeSubmissions, roastIssues, roastFixes, roasts } from "@/db/schema";
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

			const mockLLMResponse = {
				score: 5.5,
				verdict: "needs_help",
				roastTitle:
					'"Este código precisa de ajuda... mas todo mundo começa de algum lugar."',
				issues: [
					{
						type: "warning",
						title: "Falta validação",
						description: "O código não valida inputs.",
					},
					{
						type: "good",
						title: "Boa nomenclatura",
						description: "Nomes claros e descritivos.",
					},
				],
				fix: `+function validateInput(input) {\n+  if (!input) throw new Error('invalid');\n+  return input;\n+}\n-return input;`,
			};

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
					score: mockLLMResponse.score.toString(),
					roastText: mockLLMResponse.roastTitle,
					verdict: mockLLMResponse.verdict,
				})
				.returning();

			for (const issue of mockLLMResponse.issues) {
				await db.insert(roastIssues).values({
					roastId: roast.id,
					type: issue.type,
					title: issue.title,
					description: issue.description,
				});
			}

			await db.insert(roastFixes).values({
				roastId: roast.id,
				diff: mockLLMResponse.fix,
			});

			return {
				id: roast.id,
				code,
				language: detectedLanguage,
				roastMode,
				score: mockLLMResponse.score,
				verdict: mockLLMResponse.verdict,
				roastTitle: mockLLMResponse.roastTitle,
				issues: mockLLMResponse.issues,
				fix: mockLLMResponse.fix,
			};
		}),
});

export type AppRouter = typeof appRouter;
