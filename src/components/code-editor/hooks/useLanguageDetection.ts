"use client";

import hljs from "highlight.js";
import { useCallback, useState } from "react";

export type DetectionStatus =
	| "idle"
	| "detecting"
	| "detected"
	| "manual"
	| "error";

const COMMON_LANGUAGES = [
	"javascript",
	"typescript",
	"python",
	"rust",
	"go",
	"java",
	"cpp",
	"c",
	"csharp",
	"html",
	"css",
	"json",
	"sql",
	"bash",
	"shell",
	"markdown",
	"yaml",
	"xml",
	"php",
	"ruby",
	"swift",
	"kotlin",
	"scala",
	"r",
	"perl",
	"lua",
	"dockerfile",
];

export interface UseLanguageDetectionResult {
	language: string;
	status: DetectionStatus;
	confidence: number;
	detectLanguage: (code: string) => void;
	setLanguage: (language: string) => void;
}

export function useLanguageDetection(): UseLanguageDetectionResult {
	const [language, setLanguageState] = useState<string>("plaintext");
	const [status, setStatus] = useState<DetectionStatus>("idle");
	const [confidence, setConfidence] = useState<number>(0);

	const detectLanguage = useCallback((code: string) => {
		if (!code || code.trim().length === 0) {
			setLanguageState("plaintext");
			setStatus("idle");
			setConfidence(0);
			return;
		}

		setStatus("detecting");

		try {
			const result = hljs.highlightAuto(code, COMMON_LANGUAGES);

			if (result.language) {
				setLanguageState(result.language);
				setConfidence(result.relevance || 0);
				setStatus("detected");
			} else {
				setLanguageState("plaintext");
				setConfidence(0);
				setStatus("error");
			}
		} catch {
			setLanguageState("plaintext");
			setConfidence(0);
			setStatus("error");
		}
	}, []);

	const setLanguage = useCallback((lang: string) => {
		setLanguageState(lang);
		setStatus("manual");
		setConfidence(0);
	}, []);

	return {
		language,
		status,
		confidence,
		detectLanguage,
		setLanguage,
	};
}

export { COMMON_LANGUAGES };
