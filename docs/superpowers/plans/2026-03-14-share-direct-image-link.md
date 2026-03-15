# Share Direct Image Link Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Atualizar o botão de compartilhamento para que o link gerado aponte diretamente para a imagem OG do roast.

**Architecture:** Modificação do componente client-side `ShareButton` para alterar a construção da URL de compartilhamento.

**Tech Stack:** React, Next.js, Tailwind CSS.

---

### Task 1: Update ShareButton Logic

**Files:**
- Modify: `src/components/share-button.tsx`

- [ ] **Step 1: Read the current implementation**

Read: `src/components/share-button.tsx`

- [ ] **Step 2: Update shareUrl to point to the image endpoint**

Substituir a construção da `shareUrl` para incluir `/opengraph-image`.

```tsx
// old
const shareUrl = `${window.location.origin}/roast/${roastId}`;
// new
const shareUrl = `${window.location.origin}/roast/${roastId}/opengraph-image`;
```

- [ ] **Step 3: Update imageUrl to use the new shareUrl**

Como a `shareUrl` agora é a mesma que a `imageUrl`, simplificar a lógica.

```tsx
const shareUrl = `${window.location.origin}/roast/${roastId}/opengraph-image`;
const imageUrl = shareUrl;
```

- [ ] **Step 4: Verify clipboard and share API usage**

Garantir que tanto `navigator.clipboard.writeText(shareUrl)` quanto `navigator.share({ url: shareUrl })` usem a nova URL.

- [ ] **Step 5: Commit changes**

```bash
git add src/components/share-button.tsx
git commit -m "feat: atualizar botão de compartilhamento para apontar para o link direto da imagem OG"
```

### Task 2: Verification

- [ ] **Step 1: Run build or lint to ensure no regressions**

Run: `npm run lint:biome`

- [ ] **Step 2: Manual verification (Mental check as local execution is limited)**
Verificar se a URL gerada no navegador seria `http://localhost:3000/roast/[id]/opengraph-image`.
