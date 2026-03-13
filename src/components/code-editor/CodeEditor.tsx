"use client";

import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	type DetectionStatus,
	useLanguageDetection,
} from "./hooks/useLanguageDetection";
import { LanguageSelector } from "./LanguageSelector";
import { getLanguageLabel } from "./utils/languageMap";

export interface CodeEditorProps {
	initialCode?: string;
	onCodeChange?: (code: string, language: string) => void;
	onLimitChange?: (isOverLimit: boolean) => void;
	showLanguageSelector?: boolean;
	defaultLanguage?: string;
	height?: string;
	maxCharacters?: number;
}

const codeEditorStyles = {
	container: "flex flex-col gap-4",
	editorContainer:
		"rounded-lg border border-border-primary overflow-hidden relative",
	header:
		"flex items-center justify-between px-4 py-2 border-b border-border-primary bg-bg-surface",
	windowDots: "flex items-center gap-1.5",
	dot: "h-3 w-3 rounded-full",
	statusBadge:
		"inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
	detectedBadge: "bg-accent-green/10 text-accent-green",
	manualBadge: "bg-accent-blue/10 text-accent-blue",
	loadingBadge: "bg-accent-amber/10 text-accent-amber",
	errorBadge: "bg-accent-red/10 text-accent-red",
	characterCounter:
		"absolute bottom-2 right-3 text-xs font-[family-name:var(--font-jetbrains-mono)]",
	characterCounterNormal: "text-text-tertiary",
	characterCounterWarning: "text-accent-amber",
	characterCounterError: "text-accent-red",
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

export function CodeEditor({
	initialCode = "",
	onCodeChange,
	onLimitChange,
	showLanguageSelector = true,
	defaultLanguage,
	height = "400px",
	maxCharacters = 2000,
}: CodeEditorProps) {
	const [code, setCode] = useState(initialCode);
	const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark");
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

	const characterCount = code.length;
	const isOverLimit = characterCount > maxCharacters;
	const characterPercentage = (characterCount / maxCharacters) * 100;

	const { language, status, confidence, detectLanguage, setLanguage } =
		useLanguageDetection();

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		setTheme(mediaQuery.matches ? "vs-dark" : "light");

		const handler = (e: MediaQueryListEvent) => {
			setTheme(e.matches ? "vs-dark" : "light");
		};

		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, []);

	useEffect(() => {
		if (defaultLanguage) {
			setLanguage(defaultLanguage);
		}
	}, [defaultLanguage, setLanguage]);

	useEffect(() => {
		if (code && code.trim().length > 0 && status !== "manual") {
			const timeoutId = setTimeout(() => {
				detectLanguage(code);
			}, 500);
			return () => clearTimeout(timeoutId);
		}
	}, [code, detectLanguage, status]);

	useEffect(() => {
		onLimitChange?.(isOverLimit);
	}, [isOverLimit, onLimitChange]);

	const handleEditorMount: OnMount = (editor) => {
		editorRef.current = editor;
	};

	const handleCodeChange = useCallback(
		(value: string | undefined) => {
			const newCode = value || "";
			setCode(newCode);
			onCodeChange?.(newCode, language);
		},
		[language, onCodeChange],
	);

	const handleLanguageChange = useCallback(
		(newLanguage: string) => {
			setLanguage(newLanguage);
			onCodeChange?.(code, newLanguage);
		},
		[setLanguage, code, onCodeChange],
	);

	const getStatusBadge = () => {
		const statusConfig: Record<
			DetectionStatus,
			{ class: string; label: string }
		> = {
			idle: { class: "", label: "" },
			detecting: {
				class: codeEditorStyles.loadingBadge,
				label: "Detecting...",
			},
			detected: {
				class: codeEditorStyles.detectedBadge,
				label: `Detected: ${getLanguageLabel(language)}${confidence > 0 ? ` (${Math.round(confidence * 100)}%)` : ""}`,
			},
			manual: {
				class: codeEditorStyles.manualBadge,
				label: `Manual: ${getLanguageLabel(language)}`,
			},
			error: {
				class: codeEditorStyles.errorBadge,
				label: "Detection failed",
			},
		};

		const config = statusConfig[status];
		if (!config.label) return null;

		return (
			<span className={`${codeEditorStyles.statusBadge} ${config.class}`}>
				{config.label}
			</span>
		);
	};

	const monacoLanguage = MONACO_LANGUAGE_MAP[language] || "plaintext";

	return (
		<div className={codeEditorStyles.container}>
			<div className={codeEditorStyles.editorContainer} style={{ height }}>
				<div className={codeEditorStyles.header}>
					<div className={codeEditorStyles.windowDots}>
						<span className={`${codeEditorStyles.dot} bg-accent-red`} />
						<span className={`${codeEditorStyles.dot} bg-accent-amber`} />
						<span className={`${codeEditorStyles.dot} bg-accent-green`} />
					</div>
					<div className="flex items-center gap-3">
						{getStatusBadge()}
						{showLanguageSelector && (
							<LanguageSelector
								value={language}
								onChange={handleLanguageChange}
								showLabel={false}
								className="text-xs"
							/>
						)}
					</div>
				</div>
				<Editor
					height={`calc(${height} - 44px)`}
					language={monacoLanguage}
					value={code}
					onChange={handleCodeChange}
					onMount={handleEditorMount}
					theme={theme}
					options={{
						fontSize: 14,
						fontFamily: "var(--font-jetbrains-mono)",
						fontLigatures: true,
						minimap: { enabled: false },
						scrollBeyondLastLine: false,
						lineNumbers: "on",
						renderLineHighlight: "all",
						automaticLayout: true,
						tabSize: 2,
						insertSpaces: true,
						wordWrap: "on",
						padding: { top: 16, bottom: 16 },
						smoothScrolling: true,
						cursorBlinking: "smooth",
						cursorSmoothCaretAnimation: "on",
						bracketPairColorization: { enabled: true },
						autoClosingBrackets: "always",
						autoClosingQuotes: "always",
						formatOnPaste: true,
						suggestOnTriggerCharacters: true,
						quickSuggestions: true,
						acceptSuggestionOnEnter: "on",
						accessibilitySupport: "auto",
					}}
					loading={
						<div className="flex items-center justify-center h-full text-text-secondary">
							Loading editor...
						</div>
					}
				/>
				{characterCount > 0 && (
					<div
						className={`${codeEditorStyles.characterCounter} ${
							characterPercentage > 100
								? codeEditorStyles.characterCounterError
								: characterPercentage > 80
									? codeEditorStyles.characterCounterWarning
									: codeEditorStyles.characterCounterNormal
						}`}
					>
						{characterCount.toLocaleString()} / {maxCharacters.toLocaleString()}
					</div>
				)}
			</div>
		</div>
	);
}
