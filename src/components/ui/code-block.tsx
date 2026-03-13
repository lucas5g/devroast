import { createHighlighter, type Highlighter } from "shiki";

let highlighter: Highlighter | null = null;

async function getHighlighterInstance() {
	if (!highlighter) {
		highlighter = await createHighlighter({
			themes: ["vesper"],
			langs: ["javascript", "typescript", "jsx", "tsx", "json", "html", "css"],
		});
	}
	return highlighter;
}

export interface CodeBlockProps {
	code: string;
	language?: string;
	filename?: string;
}

export async function CodeBlock({
	code,
	language = "javascript",
	filename,
}: CodeBlockProps) {
	const hl = await getHighlighterInstance();
	const html = hl.codeToHtml(code, {
		lang: language,
		theme: "vesper",
	});

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
				className="overflow-x-auto"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output is safe
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
}
