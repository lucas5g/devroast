import { forwardRef, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const cardStyles = {
	base: "rounded-none border border-border-primary bg-bg-page p-5",
	header: "flex items-center gap-2",
	title:
		"font-[family-name:var(--font-jetbrains-mono)] text-sm font-medium text-text-primary",
	description:
		"font-[family-name:var(--font-jetbrains-mono)] text-xs text-text-secondary leading-relaxed",
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export interface CardDescriptionProps
	extends HTMLAttributes<HTMLParagraphElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div className={twMerge(cardStyles.base, className)} ref={ref} {...props}>
				{children}
			</div>
		);
	},
);

Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div
				className={twMerge(cardStyles.header, className)}
				ref={ref}
				{...props}
			>
				{children}
			</div>
		);
	},
);

CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
	({ className, children, ...props }, ref) => {
		return (
			<h3 className={twMerge(cardStyles.title, className)} ref={ref} {...props}>
				{children}
			</h3>
		);
	},
);

CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<
	HTMLParagraphElement,
	CardDescriptionProps
>(({ className, children, ...props }, ref) => {
	return (
		<p
			className={twMerge(cardStyles.description, className)}
			ref={ref}
			{...props}
		>
			{children}
		</p>
	);
});

CardDescription.displayName = "CardDescription";
