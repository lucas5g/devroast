import { forwardRef, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const tableRowStyles = {
	base: "flex items-center gap-6 px-5 py-4 border-b border-border-primary",
	rank: "w-10 text-text-tertiary font-[family-name:var(--font-jetbrains-mono)] text-xs",
	score:
		"w-15 text-accent-red font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold",
	code: "flex-1 text-text-tertiary font-[family-name:var(--font-jetbrains-mono)] text-xs truncate",
	lang: "w-24 text-text-tertiary font-[family-name:var(--font-jetbrains-mono)] text-xs text-right",
};

export interface TableRowProps extends HTMLAttributes<HTMLDivElement> {
	rank: string | number;
	score: string | number;
	code: string;
	language: string;
}

export const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
	({ className, rank, score, code, language, ...props }, ref) => {
		return (
			<div
				className={twMerge(tableRowStyles.base, className)}
				ref={ref}
				{...props}
			>
				<span className={tableRowStyles.rank}>#{rank}</span>
				<span className={tableRowStyles.score}>{score}</span>
				<span className={tableRowStyles.code}>{code}</span>
				<span className={tableRowStyles.lang}>{language}</span>
			</div>
		);
	},
);

TableRow.displayName = "TableRow";
