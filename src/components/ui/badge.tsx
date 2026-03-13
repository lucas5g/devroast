import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badge = tv({
	base: "inline-flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-xs",
	variants: {
		variant: {
			critical: "text-accent-red",
			warning: "text-accent-amber",
			good: "text-accent-green",
			verdict: "text-accent-red",
		},
	},
	defaultVariants: {
		variant: "good",
	},
});

const badgeDot = tv({
	base: "h-2 w-2 rounded-full",
	variants: {
		variant: {
			critical: "bg-accent-red",
			warning: "bg-accent-amber",
			good: "bg-accent-green",
			verdict: "bg-accent-red",
		},
	},
	defaultVariants: {
		variant: "good",
	},
});

export interface BadgeProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badge> {}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
	({ className, variant, children, ...props }, ref) => {
		return (
			<div className={badge({ variant, className })} ref={ref} {...props}>
				<span className={badgeDot({ variant })} />
				<span>{children}</span>
			</div>
		);
	},
);

Badge.displayName = "Badge";
