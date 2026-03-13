import { forwardRef, type HTMLAttributes, useState } from "react";
import { LanguageSelector } from "@/components/code-editor/LanguageSelector";

const codeEditorStyles = {
	container:
		"rounded-none border border-border-primary bg-bg-input overflow-hidden",
	windowHeader:
		"flex items-center justify-between flex-wrap gap-2 px-4 py-2.5 border-b border-border-primary",
	windowDots: "flex items-center gap-2",
	windowDot: "h-3 w-3 rounded-full",
	lineNumbers:
		"flex flex-col items-end gap-2 px-3 py-4 border-r border-border-primary bg-bg-surface font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary",
	codeArea:
		"flex-1 p-4 font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-secondary",
};

export interface CodeEditorProps extends HTMLAttributes<HTMLDivElement> {
	lines?: number;
	placeholder?: string;
}

export const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>(
	({ className, lines = 16, placeholder, ...props }, ref) => {
		const [language, setLanguage] = useState("javascript");
		const lineNumbers = Array.from({ length: lines }, (_, i) => i + 1);

		return (
			<div
				className={`${codeEditorStyles.container} ${className ?? ""}`}
				ref={ref}
				{...props}
			>
				<div className={codeEditorStyles.windowHeader}>
					<div className={codeEditorStyles.windowDots}>
						<span className={`${codeEditorStyles.windowDot} bg-accent-red`} />
						<span className={`${codeEditorStyles.windowDot} bg-accent-amber`} />
						<span className={`${codeEditorStyles.windowDot} bg-accent-green`} />
					</div>
					<LanguageSelector
						value={language}
						onChange={setLanguage}
						showLabel={false}
					/>
				</div>
				<div className="flex h-[360px]">
					<div className={codeEditorStyles.lineNumbers}>
						{lineNumbers.map((num) => (
							<span key={num}>{num}</span>
						))}
					</div>
					<div className={codeEditorStyles.codeArea}>
						{placeholder ?? `// paste your code here...`}
					</div>
				</div>
			</div>
		);
	},
);

CodeEditor.displayName = "CodeEditor";
