import { type ButtonHTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
	base: "inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-[family-name:var(--font-jetbrains-mono)]",
	variants: {
		variant: {
			default: "bg-accent-green text-text-primary hover:bg-accent-green/90",
			destructive: "bg-accent-red text-white hover:bg-accent-red/90",
			outline:
				"border border-border-primary bg-transparent text-text-primary hover:bg-bg-surface",
			secondary: "bg-bg-surface text-text-primary hover:bg-border-primary",
			ghost: "hover:bg-bg-surface text-text-primary",
			link: "text-accent-green underline-offset-4 hover:underline",
		},
		size: {
			default: "px-6 py-2.5",
			sm: "px-3 py-1.5 text-xs",
			lg: "px-8 py-3 text-base",
			icon: "p-2.5",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof button> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, ...props }, ref) => {
		return (
			<button
				className={button({ variant, size, className })}
				ref={ref}
				{...props}
			/>
		);
	},
);

Button.displayName = "Button";
