"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ShameLeaderboard } from "@/components/shame-leaderboard";
import { useTRPC } from "@/trpc/client";

export function ShameLeaderboardWrapper() {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(trpc.shameLeaderboard.queryOptions());

	return (
		<ShameLeaderboard entries={data.entries} totalCount={data.totalCount} />
	);
}
