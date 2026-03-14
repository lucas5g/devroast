import { CollapsibleCodeRow } from "@/components/ui/collapsible-code-row";

export interface LeaderboardEntry {
	rank: number;
	score: number;
	language: string;
	code: string;
	createdAt: string;
}

export interface LeaderboardListProps {
	entries: LeaderboardEntry[];
	totalCount: number;
}

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
}

export function LeaderboardList({ entries, totalCount }: LeaderboardListProps) {
	const formattedCount = totalCount.toLocaleString("en-US", {
		notation: "standard",
	});

	return (
		<section className="flex flex-col gap-5">
			<div className="flex items-center gap-2">
				<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
					{formattedCount} submissions
				</span>
			</div>
			{entries.map((entry) => (
				<LeaderboardEntryCard key={entry.rank} entry={entry} />
			))}
		</section>
	);
}

function LeaderboardEntryCard({ entry }: { entry: LeaderboardEntry }) {
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
						{formatDate(entry.createdAt)}
					</span>
				</div>
			</div>
			<CollapsibleCodeRow
				rank={entry.rank}
				score={entry.score}
				language={entry.language}
				code={entry.code}
			/>
		</div>
	);
}
