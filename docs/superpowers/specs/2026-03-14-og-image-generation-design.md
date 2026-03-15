# Spec: Automated OG Image Generation for Roast Shares

## 1. Overview
This specification describes the implementation of dynamic OpenGraph (OG) images for DevRoast shareable links. When a roast result is shared, social platforms (Discord, Twitter, etc.) will display a customized image showing the roast's score, verdict, and a sarcastic quote, following the project's "failed code" aesthetic.

## 2. Technical Stack
- **Library:** `@takumi-rs/image-response`
- **Framework:** Next.js 16 (App Router)
- **Data Access:** Drizzle ORM (direct database query for performance)
- **Styling:** Tailwind CSS (via Takumi's `tw` attribute)
- **Fonts:** JetBrains Mono (monospaced), loaded as a font buffer in `ImageResponse`.
- **Schema Standards:** New schema modifications must use `.config("column_name")` as per `AGENTS.md`.

## 3. Design Specification
Based on the "Screen 4 - OG Image" frame in the project design:
- **Dimensions:** 1200x630px
- **Background:** `#0a0a0a` (Dark mode default)
- **Layout:** Vertical flex container with centered elements
- **Elements:**
    - **Logo:** `> devroast` (Top, Green prompt)
    - **Score:** Large numeric score (e.g., `3.5`) with `/10` suffix.
    - **Verdict:** Status dot + verdict text (e.g., `● needs_serious_help`).
    - **Meta Info:** `lang: <language> · <lines> lines`.
    - **Quote:** Sarcastic roast title centered at the bottom, wrapped in quotes.

### 3.1 Dynamic Color Mapping
- **Score < 4.0:** Red (`#ef4444`)
- **Score 4.0 - 7.5:** Amber (`#f59e0b`)
- **Score > 7.5:** Green (`#10b981`)

## 4. Architecture & Data Flow
- **Route:** `src/app/roast/[id]/opengraph-image.tsx`
- **Process:**
    1. Extract `id` from URL params.
    2. Query `roasts` table for `score`, `verdict`, `roastText`, `language`, and `code`.
    3. Calculate `<lines>` by splitting `code` by `\n`.
    4. Map database values to JSX components. `roastText` is used for the "Quote".
    5. Return `ImageResponse` with `format: 'png'` or `'webp'`.

## 5. Performance & Error Handling
- **Caching:** Leverage Next.js built-in OG image caching.
- **Error State:** Fallback to a generic "DevRoast" brand image if the roast ID is invalid or database query fails.
- **Latency:** Takumi's Rust-based engine ensures sub-50ms generation times.

## 6. Testing
- Verify metadata embedding in social platform debuggers (Twitter Card Validator, OpenGraph.xyz).
- Test with different scores to ensure color mapping logic works correctly.
- Ensure font loading doesn't delay image generation significantly.
