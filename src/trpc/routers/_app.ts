import { sql } from "drizzle-orm";
import { db } from "@/db";
import { roasts } from "@/db/schema";
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
});

export type AppRouter = typeof appRouter;
