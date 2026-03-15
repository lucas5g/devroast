"use client";

import * as TogglePrimitive from "@radix-ui/react-toggle";
import { forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const toggle = tv({
	base: "inline-flex items-center gap-3 font-[family-name:var(--font-jetbrains-mono)] text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
	variants: {
		variant: {
			default: "",
			roast: "",
		},
		size: {
			default: "",
			sm: "",
			lg: "",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

const toggleTrack = tv({
	base: "relative h-[22px] w-[40px] rounded-full p-[3px] transition-colors",
	variants: {
		variant: {
			default: "bg-border-primary",
			roast: "bg-accent-green",
		},
	},
});

const toggleThumb = tv({
	base: "block h-4 w-4 rounded-full bg-bg-page shadow-lg transition-transform",
	variants: {
		variant: {
			default: "translate-x-0",
			roast: "translate-x-[18px]",
		},
	},
});

export interface ToggleProps
	extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
		VariantProps<typeof toggle> {}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
	({ className, variant, size, children, ...props }, ref) => {
		return (
			<TogglePrimitive.Root
				className={toggle({ variant, size, className })}
				ref={ref}
				{...props}
			>
				<span
					className={toggleTrack({
						variant: props.pressed ? "roast" : "default",
					})}
				>
					<span
						className={toggleThumb({
							variant: props.pressed ? "roast" : "default",
						})}
					/>
				</span>
				<span
					className={props.pressed ? "text-accent-green" : "text-text-tertiary"}
				>
					{children}
				</span>
			</TogglePrimitive.Root>
		);
	},
);

Toggle.displayName = "Toggle";
