import { createHighlighter, type Highlighter } from "shiki";

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
				"rust",
				"go",
				"sql",
				"php",
				"bash",
				"shell",
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
}

export async function CodeBlock({
	code,
	language = "javascript",
	filename,
	showLineNumbers = false,
}: CodeBlockProps) {
	const hl = await getHighlighterInstance();
	const html = hl.codeToHtml(code, {
		lang: language,
		theme: "vesper",
	});

	const lines = code.split("\n");
	const htmlLines = html.match(/<span class="line">([\s\S]*?)<\/span>/g) || [];

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
			<div className="flex overflow-auto">
				{showLineNumbers && (
					<div className="flex flex-col items-end gap-0 border-r border-border-primary bg-bg-surface px-3 py-3 min-w-[40px]">
						{lines.map((_, i) => (
							<span
								key={i}
								className="font-[family-name:var(--font-jetbrains-mono)] text-xs leading-[18px] text-text-tertiary h-[18px]"
							>
								{i + 1}
							</span>
						))}
					</div>
				)}
				<div
					className="flex-1 overflow-x-auto p-3"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output is safe
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</div>
		</div>
	);
}
