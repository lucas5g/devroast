export function MetricsSkeleton() {
	return (
		<section className="flex justify-center gap-6">
			<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
				<span className="animate-pulse">---</span> codes roasted
			</span>
			<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
				·
			</span>
			<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
				avg score: <span className="animate-pulse">-.-</span>/10
			</span>
		</section>
	);
}
