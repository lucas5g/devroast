export function LeaderboardListSkeleton() {
	return (
		<section className="flex flex-col gap-5">
			<div className="flex items-center gap-2">
				<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
					<span className="animate-pulse">---</span> submissions
				</span>
			</div>
			{[1, 2, 3, 4, 5].map((i) => (
				<div
					key={i}
					className="flex flex-col rounded border border-border-primary"
				>
					<div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
						<div className="flex items-center gap-4">
							<span className="inline-block h-4 w-8 animate-pulse rounded bg-bg-surface" />
							<span className="inline-block h-4 w-4 animate-pulse rounded bg-bg-surface" />
							<span className="inline-block h-4 w-12 animate-pulse rounded bg-bg-surface" />
						</div>
						<div className="flex items-center gap-3">
							<span className="inline-block h-3 w-16 animate-pulse rounded bg-bg-surface" />
							<span className="inline-block h-3 w-20 animate-pulse rounded bg-bg-surface" />
						</div>
					</div>
					<div className="flex items-center gap-6 border-b border-border-primary px-5 py-4">
						<span className="w-10">
							<span className="inline-block h-3 w-4 animate-pulse rounded bg-bg-surface" />
						</span>
						<span className="w-[60px]">
							<span className="inline-block h-4 w-8 animate-pulse rounded bg-bg-surface" />
						</span>
						<span className="flex-1">
							<span className="inline-block h-3 w-32 animate-pulse rounded bg-bg-surface" />
						</span>
						<span className="w-24 text-right">
							<span className="inline-block h-3 w-10 animate-pulse rounded bg-bg-surface" />
						</span>
					</div>
				</div>
			))}
		</section>
	);
}
