# Padrões App Router

## Estrutura

```
src/app/
├── page.tsx              # Home page
├── layout.tsx            # Root layout
├── globals.css          # Tailwind theme + variáveis
├── api/trpc/[trpc]/    # API route tRPC
├── roast/[id]/          # Dynamic route
└── components/          # Página de demo
```

## Theme

O theme usa variáveis CSS no Tailwind v4:

```css
@theme {
  --color-accent-green: #10b981;
  --color-accent-red: #ef4444;
  --color-bg-page: #0a0a0a;
  --color-bg-input: #171717;
  --color-bg-surface: #262626;
  --color-border-primary: #404040;
  --color-text-primary: #fafafa;
  --color-text-secondary: #a3a3a3;
  --color-text-tertiary: #737373;
}
```

## Variáveis CSS

Use as variáveis em classes Tailwind:

- Backgrounds: `bg-bg-page`, `bg-bg-input`, `bg-bg-surface`
- Bordas: `border-border-primary`
- Texto: `text-text-primary`, `text-text-secondary`, `text-text-tertiary`

## Fonte Monospaced

Defina em `layout.tsx` com `next/font/google`:

```tsx
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });
```

Use com:

```tsx
className="font-[family-name:var(--font-jetbrains-mono)]"
```

## Server Components

- Shiki (syntax highlighting): componente de servidor
- tRPC: use `trpc-server` para server components
