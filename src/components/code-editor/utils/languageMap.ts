export interface LanguageOption {
	value: string;
	label: string;
	category?: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
	{ value: "plaintext", label: "Plain Text", category: "Other" },
	{ value: "javascript", label: "JavaScript", category: "Web" },
	{ value: "typescript", label: "TypeScript", category: "Web" },
	{ value: "html", label: "HTML", category: "Web" },
	{ value: "css", label: "CSS", category: "Web" },
	{ value: "json", label: "JSON", category: "Data" },
	{ value: "yaml", label: "YAML", category: "Data" },
	{ value: "xml", label: "XML", category: "Data" },
	{ value: "markdown", label: "Markdown", category: "Other" },
	{ value: "python", label: "Python", category: "Backend" },
	{ value: "rust", label: "Rust", category: "Backend" },
	{ value: "go", label: "Go", category: "Backend" },
	{ value: "java", label: "Java", category: "Backend" },
	{ value: "kotlin", label: "Kotlin", category: "Backend" },
	{ value: "scala", label: "Scala", category: "Backend" },
	{ value: "csharp", label: "C#", category: "Backend" },
	{ value: "cpp", label: "C++", category: "Systems" },
	{ value: "c", label: "C", category: "Systems" },
	{ value: "ruby", label: "Ruby", category: "Backend" },
	{ value: "php", label: "PHP", category: "Web" },
	{ value: "swift", label: "Swift", category: "Mobile" },
	{ value: "sql", label: "SQL", category: "Database" },
	{ value: "bash", label: "Bash/Shell", category: "DevOps" },
	{ value: "dockerfile", label: "Dockerfile", category: "DevOps" },
	{ value: "r", label: "R", category: "Data Science" },
	{ value: "perl", label: "Perl", category: "Scripting" },
	{ value: "lua", label: "Lua", category: "Scripting" },
];

export function getLanguageLabel(value: string): string {
	const option = LANGUAGE_OPTIONS.find((opt) => opt.value === value);
	return option?.label || value;
}

export function getLanguageCategory(value: string): string | undefined {
	const option = LANGUAGE_OPTIONS.find((opt) => opt.value === value);
	return option?.category;
}
