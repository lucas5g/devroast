import { HomeContent } from "@/components/home-content";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function Home() {
	prefetch(trpc.metrics.queryOptions());
	console.log('release 0.0.1')
	return (
		<HydrateClient>
			<HomeContent />
		</HydrateClient>
	);
}
