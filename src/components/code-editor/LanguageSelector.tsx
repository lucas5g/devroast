import { forwardRef, type SelectHTMLAttributes } from "react";
import { LANGUAGE_OPTIONS, type LanguageOption } from "./utils/languageMap";

export interface LanguageSelectorProps
	extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
	value: string;
	onChange: (value: string) => void;
	showLabel?: boolean;
}

const languageSelectorStyles = {
	container: "flex items-center gap-2",
	label: "text-xs text-text-secondary font-medium",
	select: `
    px-2 py-1 rounded border border-transparent 
    bg-bg-surface text-text-secondary text-xs font-medium
    hover:bg-bg-hover cursor-pointer transition-colors
    focus:outline-none focus:ring-1 focus:ring-accent-primary/50
  `,
};

export const LanguageSelector = forwardRef<
	HTMLSelectElement,
	LanguageSelectorProps
>(({ value, onChange, showLabel = true, className, ...props }, ref) => {
	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onChange(e.target.value);
	};

	const groupedOptions = LANGUAGE_OPTIONS.reduce<
		Record<string, LanguageOption[]>
	>((acc: Record<string, LanguageOption[]>, option: LanguageOption) => {
		const category = option.category || "Other";
		if (!acc[category]) {
			acc[category] = [];
		}
		acc[category].push(option);
		return acc;
	}, {});

	return (
		<div className={`${languageSelectorStyles.container} ${className ?? ""}`}>
			{showLabel && (
				<span className={languageSelectorStyles.label}>Language:</span>
			)}
			<select
				ref={ref}
				value={value}
				onChange={handleChange}
				className={languageSelectorStyles.select}
				{...props}
			>
				{Object.entries(groupedOptions).map(([category, options]) => (
					<optgroup key={category} label={category}>
						{options.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</optgroup>
				))}
			</select>
		</div>
	);
});

LanguageSelector.displayName = "LanguageSelector";
