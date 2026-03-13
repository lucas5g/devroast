"use client";

import NumberFlow from "@number-flow/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function Metrics() {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(trpc.metrics.queryOptions());

	return (
		<section className="flex justify-center gap-6">
			<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
				<NumberFlow value={data.count} format={{ notation: "standard" }} />{" "}
				codes roasted
			</span>
			<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
				·
			</span>
			<span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
				avg score:{" "}
				<NumberFlow
					value={data.avgScore}
					format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
				/>
				/10
			</span>
		</section>
	);
}
