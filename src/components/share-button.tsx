"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
	roastId: string;
}

export function ShareButton({ roastId }: ShareButtonProps) {
	const [copied, setCopied] = useState(false);
	const [sharing, setSharing] = useState(false);

	const handleShare = async () => {
		const shareUrl = `${window.location.origin}/roast/${roastId}/opengraph-image`;

		if (navigator.share) {
			setSharing(true);
			try {
				// Fetch the actual OG image file
				const response = await fetch(shareUrl);
				const blob = await response.blob();
				const file = new File([blob], `roast-${roastId}.png`, {
					type: "image/png",
				});

				// Check if sharing files is supported
				if (navigator.canShare?.({ files: [file] })) {
					await navigator.share({
						title: "DevRoast Result",
						text: "Veja o roast do meu código!",
						url: shareUrl,
						files: [file],
					});
					return;
				}

				// Fallback to sharing just the URL if file sharing is not supported
				await navigator.share({
					title: "DevRoast Result",
					text: "Veja o roast do meu código!",
					url: shareUrl,
				});
			} catch (err) {
				if ((err as Error).name !== "AbortError") {
					console.error("Error sharing:", err);
				}
			} finally {
				setSharing(false);
			}
			return;
		}

		// Fallback to clipboard (URL) if navigator.share is not available
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
			className="flex items-center gap-2 min-w-[120px]"
			onClick={handleShare}
			disabled={sharing}
		>
			{sharing ? (
				<>
					<svg
						className="animate-spin h-3.5 w-3.5"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<title>Loading</title>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
					<span>sharing...</span>
				</>
			) : copied ? (
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
