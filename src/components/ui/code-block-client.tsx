"use client";

import { useEffect, useState } from "react";
import { createHighlighter, type Highlighter } from "shiki";
import { twMerge } from "tailwind-merge";

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighterInstance() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ["vesper"],
			langs: [
				"javascript",
				"typescript",
				"jsx",
				"tsx",
				"json",
				"html",
				"css",
				"python",
				"go",
				"java",
				"rust",
				"c",
				"cpp",
				"csharp",
				"ruby",
				"php",
				"sql",
				"bash",
				"shell",
				"yaml",
				"xml",
			],
		});
	}
	return highlighterPromise;
}

export interface CodeBlockClientProps {
	code: string;
	language?: string;
	filename?: string;
	codeAreaClassName?: string;
}

export function CodeBlockClient({
	code,
	language = "javascript",
	filename,
	codeAreaClassName,
}: CodeBlockClientProps) {
	const [html, setHtml] = useState<string>("");

	useEffect(() => {
		getHighlighterInstance().then((hl) => {
			const result = hl.codeToHtml(code, {
				lang: language,
				theme: "vesper",
			});
			setHtml(result);
		});
	}, [code, language]);

	if (!html) {
		return (
			<div className="rounded-none border border-border-primary bg-bg-input overflow-hidden font-[family-name:var(--font-jetbrains-mono)] text-xs p-4">
				Loading...
			</div>
		);
	}

	return (
		<div className="rounded-none border border-border-primary bg-bg-input overflow-hidden font-[family-name:var(--font-jetbrains-mono)] text-xs">
			{filename && (
				<div className="flex items-center gap-3 px-4 py-2.5 border-b border-border-primary">
					<span className="h-2.5 w-2.5 rounded-full bg-accent-red" />
					<span className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
					<span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
					<span className="flex-1" />
					<span className="text-text-tertiary">{filename}</span>
				</div>
			)}
			<div
				className={twMerge(
					"min-w-0 overflow-y-auto overflow-x-hidden [&_pre]:min-w-max [&_pre]:w-fit [&_.shiki]:overflow-x-auto",
					codeAreaClassName,
				)}
				// biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output is safe
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
}
