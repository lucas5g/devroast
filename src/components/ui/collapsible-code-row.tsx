"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { useState } from "react";
import { CodeBlockClient } from "@/components/ui/code-block-client";

export interface CollapsibleCodeRowProps {
	rank: number;
	score: number;
	language: string;
	code: string;
}

export function CollapsibleCodeRow({
	rank,
	score,
	language,
	code,
}: CollapsibleCodeRowProps) {
	const [isOpen, setIsOpen] = useState(false);
	const codeLines = code.split("\n");
	const shouldTruncate = codeLines.length > 3;

	return (
		<Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
			<Collapsible.Trigger asChild>
				<div className="group flex cursor-pointer items-center gap-6 border-b border-border-primary px-5 py-4 hover:bg-bg-surface/50">
					<span className="w-10 font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
						#{rank}
					</span>
					<span className="w-[60px] font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-accent-red">
						{score.toFixed(1)}
					</span>
					<span className="flex-1 font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary truncate">
						{shouldTruncate ? codeLines.slice(0, 3).join("\n") : code}
					</span>
					<span className="w-24 text-right font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary">
						{language}
					</span>
				</div>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<div className="border-b border-border-primary bg-bg-input p-4">
					<CodeBlockClient code={code} language={language} />
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	);
}
