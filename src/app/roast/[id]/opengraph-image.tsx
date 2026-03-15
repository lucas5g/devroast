import { ImageResponse } from "@takumi-rs/image-response";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { roasts } from "@/db/schema";

export const runtime = "nodejs";
export const alt = "DevRoast Result";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FONT_URL =
	"https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff2";

let fontBuffer: Uint8Array | null = null;

async function getFont() {
	if (!fontBuffer) {
		const response = await fetch(FONT_URL);
		if (!response.ok) {
			throw new Error("Failed to fetch font");
		}
		const arrayBuffer = await response.arrayBuffer();
		fontBuffer = new Uint8Array(arrayBuffer);
	}
	return fontBuffer;
}

export default async function Image({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const [roast] = await db.select().from(roasts).where(eq(roasts.id, id));

	if (!roast) return null;

	const fontData = await getFont();

	const score = Number(roast.score);
	// Using hex values from src/app/globals.css @theme
	const color =
		score < 4.0
			? "#ef4444" // accent-red
			: score < 7.5
				? "#f59e0b" // accent-amber
				: "#10b981"; // accent-green

	const lines = roast.code.split("\n").length;

	return new ImageResponse(
		<div
			tw="flex flex-col items-center justify-center w-full h-full bg-[#0a0a0a] text-[#fafafa] p-16"
			style={{ fontFamily: "JetBrains Mono" }}
		>
			{/* Header */}
			<div tw="flex items-center gap-2 mb-12">
				<span tw="text-2xl font-bold text-[#10b981]">{">"}</span>
				<span tw="text-2xl font-medium">devroast</span>
			</div>

			{/* Score */}
			<div tw="flex items-end gap-4 mb-4">
				<span tw="text-[160px] font-black leading-none" style={{ color }}>
					{score.toFixed(1)}
				</span>
				<span tw="text-6xl font-normal text-[#737373] mb-4">/10</span>
			</div>

			{/* Verdict */}
			<div tw="flex items-center gap-3 mb-8">
				<div tw="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
				<span tw="text-2xl font-normal" style={{ color }}>
					verdict: {roast.verdict}
				</span>
			</div>

			{/* Meta Info */}
			<div tw="text-xl text-[#737373] mb-12">
				lang: {roast.language} · {lines} lines
			</div>

			{/* Quote */}
			<div tw="flex flex-col items-center text-center">
				<p tw="text-2xl leading-relaxed text-[#fafafa] max-w-[900px]">
					"
					{roast.roastText.length > 150
						? `${roast.roastText.slice(0, 150)}...`
						: roast.roastText}
					"
				</p>
			</div>
		</div>,
		{
			...size,
			fonts: [
				{
					name: "JetBrains Mono",
					data: fontData,
					style: "normal",
				},
			],
		},
	);
}
