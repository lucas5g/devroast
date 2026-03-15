import { HomeContent } from "@/components/home-content";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function Home() {
	prefetch(trpc.metrics.queryOptions());

	return (
		<HydrateClient>
			<HomeContent />
		</HydrateClient>
	);
}
