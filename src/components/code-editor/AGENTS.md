# Padrões Code Editor

## Estrutura

```
src/components/code-editor/
├── CodeEditor.tsx          # Componente principal
├── CodeDisplay.tsx        # Exibição com highlight
├── LanguageSelector.tsx   # Seletor de linguagem
├── index.ts              # Exports
├── utils/
│   └── languageMap.ts    # Mapeamento de linguagens
└── hooks/
    ├── useCodeHighlight.ts    # Hook para highlight
    └── useLanguageDetection.ts # Detecção automática
```

## Syntax Highlighting

Use Shiki com tema `vesper` (componente de servidor):

```tsx
import { codeToHtml } from "shiki";

const html = await codeToHtml(code, {
  lang: language,
  theme: "vesper",
});
```

## Estrutura de Hooks

Cada hook em arquivo separado em `hooks/`:

```typescript
// hooks/useCodeHighlight.ts
"use";

import { useMemo } from "react";

export function useCodeHighlight(code: string, language: string) {
  return useMemo(() => {
    // implementação
  }, [code, language]);
}
```
