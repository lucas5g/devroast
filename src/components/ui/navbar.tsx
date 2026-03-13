import Link from "next/link";

export function Navbar() {
	return (
		<header className="h-14 border-b border-border-primary bg-bg-page">
			<div className="flex h-full items-center justify-between px-10">
				<Link href="/" className="flex items-center gap-2">
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-xl font-bold text-accent-green">
						&gt;
					</span>
					<span className="font-[family-name:var(--font-jetbrains-mono)] text-lg font-medium text-text-primary">
						devroast
					</span>
				</Link>
				<Link
					href="/leaderboard"
					className="font-[family-name:var(--font-jetbrains-mono)] text-sm text-text-secondary"
				>
					leaderboard
				</Link>
			</div>
		</header>
	);
}
