export function ShameLeaderboardSkeleton() {
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
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="flex items-center gap-6 border-b border-border-primary px-5 py-4"
					>
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
				))}
			</div>
			<p className="text-center font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
				<span className="animate-pulse">loading...</span>
			</p>
		</>
	);
}
