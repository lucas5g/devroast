import { createCaller } from "@/trpc/server";

export const metadata = {
	title: "Shame Leaderboard | DevRoast",
	description: "The most roasted code on the internet",
};

export default async function LeaderboardPage() {
	const caller = await createCaller();
	const [{ entries, totalCount }, metrics] = await Promise.all([
		caller.leaderboard(),
		caller.metrics(),
	]);

	const avgScore = metrics.avgScore.toFixed(1);

	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center bg-bg-page">
			<div className="flex w-full max-w-[960px] flex-col gap-10 px-10 py-12">
				<section className="flex flex-col gap-4">
					<div className="flex items-center gap-3">
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-[32px] font-bold text-accent-green">
							{">"}_
						</span>
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-[28px] font-bold text-text-primary">
							shame_leaderboard
						</span>
					</div>
					<p className="font-[family-name:var(--font-jetbrains-mono)] text-sm text-text-secondary">
						{"// the most roasted code on the internet"}
					</p>
					<div className="flex items-center gap-2">
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
							{totalCount.toLocaleString()} submissions
						</span>
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
							·
						</span>
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
							avg score: {avgScore}/10
						</span>
					</div>
				</section>

				<section className="flex flex-col gap-5">
					{entries.map((entry) => (
						<LeaderboardEntry key={entry.rank} entry={entry} />
					))}
				</section>
			</div>
		</main>
	);
}

function LeaderboardEntry({
	entry,
}: {
	entry: {
		rank: number;
		score: number;
		language: string;
		code: string;
		createdAt: string;
	};
}) {
	const lines = (entry.code ?? "").split("\n");
	const date = new Date(entry.createdAt).toISOString().split("T")[0];

	return (
		<div className="flex flex-col rounded border border-border-primary">
			<div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
				<div className="flex items-center gap-4">
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-text-tertiary">
						#{entry.rank}
					</span>
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
						/
					</span>
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-accent-red">
						{entry.score.toFixed(1)}/10
					</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-secondary uppercase">
						{entry.language}
					</span>
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
						{date}
					</span>
				</div>
			</div>
			<div className="flex h-[120px] overflow-hidden bg-bg-input">
				<div className="flex flex-col items-end gap-[6px] border-r border-border-primary bg-bg-surface px-[10px] py-3 pr-3">
					{lines.map((line, i) => (
						<span
							key={`${entry.rank}-${line}`}
							className="font-[family-name:var(--font-jetbrains-mono)] text-xs leading-[18px] text-text-tertiary"
						>
							{i + 1}
						</span>
					))}
				</div>
				<pre className="flex-1 overflow-x-auto p-4 font-[family-name:var(--font-jetbrains-mono)] text-xs leading-[18px] text-text-secondary">
					<code>{entry.code}</code>
				</pre>
			</div>
		</div>
	);
}
