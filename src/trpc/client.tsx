"use client";

import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import { makeQueryClient } from "./query-client";
import type { AppRouter } from "./routers/_app";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;

function getQueryClient() {
	if (typeof window === "undefined") {
		return makeQueryClient();
	}
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}

function getUrl() {
	const isBrowser = typeof window !== "undefined";

	if (isBrowser) {
		return "/api/trpc";
	}

	const vercelUrl =
		process.env.VERCEL_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL;
	const base = vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000";
	const url = `${base}/api/trpc`;

	console.log(
		"[tRPC] URL:",
		url,
		"VERCEL_URL:",
		process.env.VERCEL_URL,
		"NEXT_PUBLIC_VERCEL_URL:",
		process.env.NEXT_PUBLIC_VERCEL_URL,
	);

	return url;
}

export function TRPCReactProvider(
	props: Readonly<{ children: React.ReactNode }>,
) {
	const queryClient = getQueryClient();
	const [trpcClient] = useState(() =>
		createTRPCClient<AppRouter>({
			links: [
				httpBatchLink({
					url: getUrl(),
				}),
			],
		}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				{props.children}
			</TRPCProvider>
		</QueryClientProvider>
	);
}
