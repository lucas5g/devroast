"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createHighlighter, type Highlighter } from "shiki";

export type Theme = "dark" | "light" | "system";

const LANGUAGES = [
	"javascript",
	"typescript",
	"python",
	"rust",
	"go",
	"java",
	"cpp",
	"c",
	"csharp",
	"html",
	"css",
	"json",
	"sql",
	"bash",
	"shell",
	"markdown",
	"yaml",
	"xml",
	"php",
	"ruby",
	"swift",
	"kotlin",
	"scala",
	"r",
	"perl",
	"lua",
	"dockerfile",
	"plaintext",
];

const THEMES = {
	dark: "github-dark",
	light: "github-light",
};

interface UseCodeHighlightResult {
	html: string;
	isLoading: boolean;
	error: string | null;
	highlighter: Highlighter | null;
	highlight: (code: string, language: string) => void;
}

export function useCodeHighlight(): UseCodeHighlightResult {
	const [html, setHtml] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const highlighterRef = useRef<Highlighter | null>(null);
	const [theme, setTheme] = useState<"dark" | "light">("dark");

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		setTheme(mediaQuery.matches ? "dark" : "light");

		const handler = (e: MediaQueryListEvent) => {
			setTheme(e.matches ? "dark" : "light");
		};

		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, []);

	useEffect(() => {
		async function initHighlighter() {
			try {
				const highlighter = await createHighlighter({
					themes: Object.values(THEMES),
					langs: LANGUAGES,
				});
				highlighterRef.current = highlighter;
				setIsLoading(false);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Failed to initialize highlighter",
				);
				setIsLoading(false);
			}
		}

		initHighlighter();
	}, []);

	const highlight = useCallback(
		(code: string, language: string) => {
			if (!highlighterRef.current || !code) {
				setHtml("");
				return;
			}

			try {
				const mappedLang = mapLanguage(language);
				const htmlResult = highlighterRef.current.codeToHtml(code, {
					lang: mappedLang,
					theme: THEMES[theme],
				});
				setHtml(htmlResult);
				setError(null);
			} catch (err) {
				const plainText = escapeHtml(code);
				setHtml(`<pre><code>${plainText}</code></pre>`);
				setError(err instanceof Error ? err.message : "Highlight failed");
			}
		},
		[theme],
	);

	return {
		html,
		isLoading,
		error,
		highlighter: highlighterRef.current,
		highlight,
	};
}

function mapLanguage(lang: string): string {
	const mapping: Record<string, string> = {
		csharp: "csharp",
		cpp: "cpp",
		shell: "bash",
	};
	return mapping[lang] || lang;
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

export { LANGUAGES, THEMES };
