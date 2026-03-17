"use client";

import Editor from "@monaco-editor/react";
import { useMemo } from "react";

export interface CodeViewerProps {
	code: string;
	language?: string;
	maxHeight?: number;
	minHeight?: number;
}

const codeViewerStyles = {
	container:
		"overflow-hidden rounded-lg border border-border-primary bg-bg-input",
	header:
		"flex items-center justify-between border-b border-border-primary bg-bg-surface px-4 py-2",
	windowDots: "flex items-center gap-1.5",
	dot: "h-3 w-3 rounded-full",
	meta: "font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary",
};

const MONACO_LANGUAGE_MAP: Record<string, string> = {
	plaintext: "plaintext",
	javascript: "javascript",
	typescript: "typescript",
	html: "html",
	css: "css",
	json: "json",
	yaml: "yaml",
	xml: "xml",
	markdown: "markdown",
	python: "python",
	rust: "rust",
	go: "go",
	java: "java",
	kotlin: "kotlin",
	scala: "scala",
	csharp: "csharp",
	cpp: "cpp",
	c: "c",
	ruby: "ruby",
	php: "php",
	swift: "swift",
	sql: "sql",
	bash: "shell",
	shell: "shell",
	dockerfile: "dockerfile",
	r: "r",
	perl: "perl",
	lua: "lua",
};

export function CodeViewer({
	code,
	language = "plaintext",
	maxHeight = 672,
	minHeight = 220,
}: CodeViewerProps) {
	const lineCount = code.split("\n").length;
	const editorHeight = useMemo(() => {
		const estimatedHeight = lineCount * 22 + 32;
		return Math.min(Math.max(estimatedHeight, minHeight), maxHeight);
	}, [lineCount, maxHeight, minHeight]);

	const monacoLanguage = MONACO_LANGUAGE_MAP[language] || "plaintext";

	return (
		<div className={codeViewerStyles.container}>
			<div className={codeViewerStyles.header}>
				<div className={codeViewerStyles.windowDots}>
					<span className={`${codeViewerStyles.dot} bg-accent-red`} />
					<span className={`${codeViewerStyles.dot} bg-accent-amber`} />
					<span className={`${codeViewerStyles.dot} bg-accent-green`} />
				</div>
				<span className={codeViewerStyles.meta}>{language}</span>
			</div>
			<Editor
				height={`${editorHeight}px`}
				language={monacoLanguage}
				value={code}
				theme="vs-dark"
				options={{
					readOnly: true,
					fontSize: 14,
					fontFamily: "var(--font-jetbrains-mono)",
					fontLigatures: true,
					minimap: { enabled: false },
					scrollBeyondLastLine: false,
					lineNumbers: "on",
					renderLineHighlight: "none",
					automaticLayout: true,
					tabSize: 2,
					insertSpaces: true,
					wordWrap: "on",
					padding: { top: 16, bottom: 16 },
					smoothScrolling: true,
					cursorBlinking: "solid",
					cursorStyle: "line",
					cursorWidth: 0,
					bracketPairColorization: { enabled: true },
					guides: { indentation: false },
					folding: false,
					lineDecorationsWidth: 12,
					lineNumbersMinChars: 3,
					overviewRulerLanes: 0,
					occurrencesHighlight: "off",
					selectionHighlight: false,
					matchBrackets: "always",
					stickyScroll: { enabled: false },
					scrollbar: {
						verticalScrollbarSize: 10,
						horizontalScrollbarSize: 10,
						alwaysConsumeMouseWheel: false,
					},
				}}
				loading={
					<div className="flex h-full items-center justify-center text-text-secondary">
						Loading editor...
					</div>
				}
			/>
		</div>
	);
}
