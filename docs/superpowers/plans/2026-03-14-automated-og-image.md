# Automated OG Image Generation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement dynamic OpenGraph images for roast results using `@takumi-rs/image-response`.

**Architecture:** Use Next.js dynamic metadata and Takumi's JSX-to-image engine. Data is fetched directly from Drizzle for speed.

**Tech Stack:** `@takumi-rs/image-response`, Next.js 16, Drizzle ORM.

---

## Chunk 1: Setup & Assets

### Task 1: Install Dependencies
**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install `@takumi-rs/image-response`**
Run: `npm install @takumi-rs/image-response`

- [ ] **Step 2: Commit**
```bash
git add package.json
git commit -m "chore: adicionar @takumi-rs/image-response"
```

### Task 2: Font Asset
**Files:**
- Create: `public/fonts/JetBrainsMono-Bold.ttf`

- [ ] **Step 1: Download JetBrains Mono Bold font**
Run: `mkdir -p public/fonts && curl -L -o public/fonts/JetBrainsMono-Bold.ttf https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/ttf/JetBrainsMono-Bold.ttf`

- [ ] **Step 2: Commit**
```bash
git add public/fonts/JetBrainsMono-Bold.ttf
git commit -m "chore: adicionar fonte JetBrains Mono para OG images"
```

---

## Chunk 2: Image Generation

### Task 3: Implement OpenGraph Image Route
**Files:**
- Create: `src/app/roast/[id]/opengraph-image.tsx`

- [ ] **Step 1: Create the file with Takumi implementation**
> Note: Verify if Takumi uses `tw` (standard) or `className` for styles.

```tsx
import { ImageResponse } from "@takumi-rs/image-response";
import { db } from "@/db";
import { roasts } from "@/db/schema";
import { eq } from "drizzle-orm";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const alt = "DevRoast Result";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
	params,
}: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const [roast] = await db.select().from(roasts).where(eq(roasts.id, id));

	if (!roast) return null;


	const fontData = await fs.readFile(
		path.join(process.cwd(), "public/fonts/JetBrainsMono-Bold.ttf"),
	);

	const score = Number(roast.score);
	const color = score < 4 ? "#ef4444" : score < 7.5 ? "#f59e0b" : "#10b981";
	const lines = roast.code.split("\n").length;

	return new ImageResponse(
		(
			<div
				tw="flex flex-col items-center justify-center w-full h-full bg-[#0a0a0a] text-[#fafafa] p-16"
				style={{ fontFamily: "JetBrains Mono" }}
			>
				{/* Header */}
				<div tw="flex items-center gap-2 mb-12">
					<span tw="text-2xl font-bold text-[#10b981]">></span>
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

				{/* Meta */}
				<div tw="text-xl text-[#737373] mb-12">
					lang: {roast.language} · {lines} lines
				</div>

				{/* Quote */}
				<div tw="flex flex-col items-center text-center">
					<p tw="text-2xl leading-relaxed text-[#fafafa] max-w-[900px]">
						"{roast.roastText.length > 150 ? roast.roastText.slice(0, 150) + "..." : roast.roastText}"
					</p>
				</div>
			</div>
		),
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
```

- [ ] **Step 2: Commit**
```bash
git add src/app/roast/[id]/opengraph-image.tsx
git commit -m "feat: implementar geração dinâmica de imagem OG com Takumi"
```

---

## Chunk 3: Integration & Metadata

### Task 4: Update Roast Page Metadata
**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Dynamically generate metadata for the roast page**
Replace static `metadata` export with `generateMetadata` function to include OG image.

```tsx
export async function generateMetadata({
	params,
}: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const caller = await createCaller();
	const roast = await caller.getRoast({ id });

	if (!roast) return { title: "Roast Not Found" };

	return {
		title: `Roast Score: ${roast.score}/10 | DevRoast`,
		description: roast.roastTitle,
		openGraph: {
			title: `Roast Score: ${roast.score}/10 | DevRoast`,
			description: roast.roastTitle,
			type: "website",
			images: [`/roast/${id}/opengraph-image`],
		},
	};
}
```

- [ ] **Step 2: Commit**
```bash
git add src/app/roast/[id]/page.tsx
git commit -m "feat: atualizar metadados dinâmicos para suportar OG images"
```

---

## Chunk 4: Verification

### Task 5: Final Verification
- [ ] **Step 1: Verify the build passes**
Run: `npm run build`

- [ ] **Step 2: Check the image route (locally if possible or via simulation)**
Since it's a dynamic route, verify the file structure is correct for Next.js convention.

- [ ] **Step 3: Commit final adjustments if any**
```bash
git commit -m "chore: finalização da implementação de OG images"
```
