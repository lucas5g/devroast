"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { Metrics } from "@/components/metrics";
import { MetricsSkeleton } from "@/components/metrics-skeleton";
import { Button } from "@/components/ui/button";
import { TableRow } from "@/components/ui/table-row";
import { Toggle } from "@/components/ui/toggle";

export function HomeContent() {
	const [isOverLimit, setIsOverLimit] = useState(false);

	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-10 pt-20">
			<div className="flex w-full max-w-[960px] flex-col gap-8">
				<section className="flex flex-col gap-3">
					<div className="flex items-center gap-3">
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-2xl font-bold text-accent-green">
							&gt;_
						</span>
						<span className="font-[family-name:var(--font-jetbrains-mono)] text-2xl font-bold text-text-primary">
							code review
						</span>
					</div>
					<p className="font-[family-name:var(--font-jetbrains-mono)] text-sm text-text-secondary">
						{`// drop your code below and we'll rate it — brutally honest or full roast mode`}
					</p>
				</section>

				<section>
					<CodeEditor onLimitChange={setIsOverLimit} />
				</section>

				<section className="flex items-center justify-between">
					<Toggle>roast mode</Toggle>
					<Button disabled={isOverLimit}>$ roast_my_code</Button>
				</section>

				<Suspense fallback={<MetricsSkeleton />}>
					<Metrics />
				</Suspense>

				<section className="flex flex-col gap-6 pt-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-accent-green">
								{`//`}
							</span>
							<span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-text-primary">
								shame_leaderboard
							</span>
						</div>
						<Link
							href="/leaderboard"
							className="flex items-center gap-1 rounded-none border border-border-primary px-3 py-1.5 font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-secondary"
						>
							{`$ view_all >>`}
						</Link>
					</div>
					<p className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
						{`// the worst code on the internet, ranked by shame`}
					</p>
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
						<TableRow
							rank={1}
							score={1.2}
							code="var total = 0; for (var i = 0; i < items.length; i++) {"
							language="javascript"
						/>
						<TableRow
							rank={2}
							score={2.8}
							code="function add(a,b) { return a+b; } var result = add(1,"
							language="javascript"
						/>
						<TableRow
							rank={3}
							score={3.1}
							code="const getData = async () => { return await fetch('/api"
							language="typescript"
						/>
					</div>
					<p className="text-center font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
						showing top 3 of 2,847 · view full leaderboard &gt;&gt;
					</p>
				</section>
			</div>
		</main>
	);
}
