"use client";

import { forwardRef, type HTMLAttributes, useEffect } from "react";

export interface CodeDisplayProps extends HTMLAttributes<HTMLDivElement> {
	code: string;
	language: string;
	showLineNumbers?: boolean;
	highlightFn?: (code: string, language: string) => void;
}

const codeDisplayStyles = {
	container: "relative overflow-hidden rounded-lg border border-border-primary",
	header:
		"flex items-center justify-between px-4 py-2 border-b border-border-primary bg-bg-surface",
	windowDots: "flex items-center gap-1.5",
	dot: "h-3 w-3 rounded-full",
	content: "relative overflow-x-auto p-4 bg-bg-primary",
	lineNumbers:
		"absolute left-0 top-0 bottom-0 w-12 flex flex-col items-end pr-3 pt-4 border-r border-border-primary bg-bg-surface font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-tertiary select-none",
	code: "font-[family-name:var(--font-jetbrains-mono)] text-sm leading-relaxed",
	loading: "flex items-center justify-center p-8 text-text-secondary text-sm",
	error: "flex items-center justify-center p-8 text-accent-red text-sm",
};

export const CodeDisplay = forwardRef<HTMLDivElement, CodeDisplayProps>(
	(
		{
			code,
			language,
			showLineNumbers = false,
			highlightFn,
			className,
			...props
		},
		ref,
	) => {
		const lines = code.split("\n");

		useEffect(() => {
			if (highlightFn && code && language) {
				highlightFn(code, language);
			}
		}, [code, language, highlightFn]);

		return (
			<div
				ref={ref}
				className={`${codeDisplayStyles.container} ${className ?? ""}`}
				{...props}
			>
				<div className={codeDisplayStyles.header}>
					<div className={codeDisplayStyles.windowDots}>
						<span className={`${codeDisplayStyles.dot} bg-accent-red`} />
						<span className={`${codeDisplayStyles.dot} bg-accent-amber`} />
						<span className={`${codeDisplayStyles.dot} bg-accent-green`} />
					</div>
				</div>
				<div className={codeDisplayStyles.content}>
					{showLineNumbers && (
						<div className={codeDisplayStyles.lineNumbers}>
							{lines.map((_, index) => (
								<span key={index}>{index + 1}</span>
							))}
						</div>
					)}
					<pre className={codeDisplayStyles.code}>
						<code>{code}</code>
					</pre>
				</div>
			</div>
		);
	},
);

CodeDisplay.displayName = "CodeDisplay";
