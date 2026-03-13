import { HomeContent } from "@/components/home-content";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function Home() {
	prefetch(trpc.metrics.queryOptions());

	return (
		<HydrateClient>
			<HomeContent />
		</HydrateClient>
	);
}
