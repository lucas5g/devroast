import { createHighlighter, type Highlighter } from "shiki";
import { twMerge } from "tailwind-merge";

let highlighter: Highlighter | null = null;

async function getHighlighterInstance() {
	if (!highlighter) {
		highlighter = await createHighlighter({
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
	return highlighter;
}

export interface CodeBlockProps {
	code: string;
	language?: string;
	filename?: string;
	showLineNumbers?: boolean;
	codeAreaClassName?: string;
}

export async function CodeBlock({
	code,
	language = "javascript",
	filename,
	showLineNumbers = false,
	codeAreaClassName,
}: CodeBlockProps) {
	const hl = await getHighlighterInstance();
	const html = hl.codeToHtml(code, {
		lang: language,
		theme: "vesper",
	});

	const lines = code.split("\n");
	const lineOccurrences = new Map<string, number>();
	const numberedLines = lines.map((line, index) => {
		const occurrence = (lineOccurrences.get(line) ?? 0) + 1;
		lineOccurrences.set(line, occurrence);

		return {
			key: `${line}-${occurrence}`,
			lineNumber: index + 1,
		};
	});

	return (
		<div className="rounded-none border border-border-primary bg-bg-input overflow-hidden font-[family-name:var(--font-jetbrains-mono)] text-xs">
			{(filename || showLineNumbers) && (
				<div className="flex items-center gap-3 px-4 py-2.5 border-b border-border-primary">
					<span className="h-2.5 w-2.5 rounded-full bg-accent-red" />
					<span className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
					<span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
					<span className="flex-1" />
					{filename && <span className="text-text-tertiary">{filename}</span>}
				</div>
			)}
			<div
				className={twMerge("flex min-w-0 overflow-y-auto", codeAreaClassName)}
			>
				{showLineNumbers && (
					<div className="flex flex-col items-end gap-0 border-r border-border-primary bg-bg-surface px-3 py-3 min-w-[40px]">
						{numberedLines.map(({ key, lineNumber }) => (
							<span
								key={key}
								className="font-[family-name:var(--font-jetbrains-mono)] text-xs leading-[18px] text-text-tertiary h-[18px]"
							>
								{lineNumber}
							</span>
						))}
					</div>
				)}
				<div
					className="min-w-0 flex-1 overflow-x-auto p-3 [&_pre]:min-w-max [&_pre]:w-fit"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output is safe
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</div>
		</div>
	);
}
