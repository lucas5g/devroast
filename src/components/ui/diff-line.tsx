import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const diffLine = tv({
	base: "flex font-[family-name:var(--font-jetbrains-mono)] text-xs px-4 py-2",
	variants: {
		type: {
			removed: "bg-accent-red/10",
			added: "bg-accent-green/10",
			context: "bg-transparent",
		},
	},
	defaultVariants: {
		type: "context",
	},
});

const diffPrefix = tv({
	base: "w-4 flex-shrink-0",
	variants: {
		type: {
			removed: "text-accent-red",
			added: "text-accent-green",
			context: "text-text-tertiary",
		},
	},
	defaultVariants: {
		type: "context",
	},
});

const diffCode = tv({
	base: "flex-1 whitespace-pre-wrap break-all",
	variants: {
		type: {
			removed: "text-text-secondary",
			added: "text-text-primary",
			context: "text-text-secondary",
		},
	},
	defaultVariants: {
		type: "context",
	},
});

export interface DiffLineProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof diffLine> {
	prefix: string;
	code: string;
}

export const DiffLine = forwardRef<HTMLDivElement, DiffLineProps>(
	({ className, type, prefix, code, ...props }, ref) => {
		return (
			<div className={diffLine({ type, className })} ref={ref} {...props}>
				<span className={diffPrefix({ type })}>{prefix}</span>
				<span className={diffCode({ type })}>{code}</span>
			</div>
		);
	},
);

DiffLine.displayName = "DiffLine";
