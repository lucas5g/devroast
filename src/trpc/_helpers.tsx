import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cache } from "react";
import { makeQueryClient } from "./query-client";

const getQueryClient = cache(makeQueryClient);

export function HydrateClient(props: { children: React.ReactNode }) {
	const queryClient = getQueryClient();
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			{props.children}
		</HydrationBoundary>
	);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prefetch(queryOptions: any) {
	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(queryOptions);
}
