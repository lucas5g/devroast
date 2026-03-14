import { CollapsibleCodeRow } from "@/components/ui/collapsible-code-row";

export interface ShameLeaderboardEntry {
	rank: number;
	score: number;
	language: string;
	code: string;
}

export interface ShameLeaderboardProps {
	entries: ShameLeaderboardEntry[];
	totalCount: number;
}

export function ShameLeaderboard({
	entries,
	totalCount,
}: ShameLeaderboardProps) {
	const formattedCount = totalCount.toLocaleString("en-US", {
		notation: "standard",
	});

	return (
		<>
			<div className="flex flex-col border border-border-primary">
				<div className="flex h-10 items-center gap-6 border-b border-border-primary bg-bg-surface px-5">
					<span className="w-10 font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
						#
					</span>
					<span className="w-[60px] font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
						score
					</span>
					<span className="flex-1 font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
						code
					</span>
					<span className="w-24 text-right font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
						lang
					</span>
				</div>
				{entries.map((entry) => (
					<CollapsibleCodeRow
						key={entry.rank}
						rank={entry.rank}
						score={entry.score}
						language={entry.language}
						code={entry.code}
					/>
				))}
			</div>
			<p className="text-center font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
				{`showing top 3 of ${formattedCount} · view full leaderboard >>`}
			</p>
		</>
	);
}
