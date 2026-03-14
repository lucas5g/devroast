"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { LeaderboardList } from "@/components/leaderboard-list";
import { useTRPC } from "@/trpc/client";

export function LeaderboardListWrapper() {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(trpc.leaderboard.queryOptions());

	return (
		<LeaderboardList entries={data.entries} totalCount={data.totalCount} />
	);
}
