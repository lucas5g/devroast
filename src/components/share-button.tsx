"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
	roastId: string;
}

export function ShareButton({ roastId }: ShareButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleShare = async () => {
		const shareUrl = `${window.location.origin}/roast/${roastId}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: "DevRoast Result",
					text: "Check out my code roast result!",
					url: shareUrl,
				});
				return;
			} catch (err) {
				// User might have cancelled or browser doesn't support sharing this specific content
				if ((err as Error).name !== "AbortError") {
					console.error("Error sharing:", err);
				}
			}
		}

		// Fallback to clipboard
		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	return (
		<Button
			variant="outline"
			size="sm"
			className="flex items-center gap-2"
			onClick={handleShare}
		>
			{copied ? (
				<>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-3.5 w-3.5"
						aria-hidden="true"
					>
						<title>Check</title>
						<path d="M20 6 9 17l-5-5" />
					</svg>
					<span>copied!</span>
				</>
			) : (
				<>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-3.5 w-3.5"
						aria-hidden="true"
					>
						<title>Share</title>
						<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
						<polyline points="16 6 12 2 8 6" />
						<line x1="12" x2="12" y1="2" y2="15" />
					</svg>
					<span>share_roast</span>
				</>
			)}
		</Button>
	);
}
