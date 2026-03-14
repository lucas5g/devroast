# Create Roast Feature - Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir que usuários submetam código para análise da IA com resultado exibido na mesma página (same-page), com modos "normal" (construtivo) e "spicy" (sarcástico).

**Architecture:** Backend mutation via tRPC que chama LLM e salva no banco. Frontend exibe resultado embaixo do editor com score, issues e suggested fix.

**Tech Stack:** Next.js 16, tRPC, Drizzle ORM, LLM (provider a definir)

---

## Chunk 1: Schema do Banco + Migration

### Task 1: Atualizar schema existente

**Files:**
- Modify: `src/db/schema.ts`

- [ ] **Step 1: Verificar schema atual**

Run: `cat src/db/schema.ts`
Verificar tabela `roasts` existente

- [ ] **Step 2: Atualizar tabela codeSubmissions para permitir anonymous**

Tornar userId opcional:

```typescript
// Em src/db/schema.ts, tabela codeSubmissions:
userId: uuid("user_id")
  .references(() => users.id, { onDelete: "cascade" }), // REMOVER .notNull()
// Manter isAnonymous
isAnonymous: boolean("is_anonymous").default(true), // Mudar default para true
```

- [ ] **Step 3: Atualizar tabela roasts**

Adicionar campos necessários (usar roastText existente):

```typescript
// Em src/db/schema.ts, atualizar tabela roasts:
export const roasts = pgTable(
  "roasts",
  {
    id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
    submissionId: uuid("submission_id")
      .references(() => codeSubmissions.id, { onDelete: "cascade" })
      .notNull(),
    score: decimal("score", { precision: 3, scale: 1 }).notNull(),
    roastText: text("roast_text").notNull(), // JA EXISTE - usar para headline
    roastMode: roastModeEnum("roast_mode").default("normal"),
    // NOVOS CAMPOS:
    code: text("code").notNull(),           // Código original
    language: varchar("language", { length: 20 }).notNull(), // Linguagem
    verdict: varchar("verdict", { length: 50 }).notNull(), // needs_help/decent/good/excellent
    createdAt: timestamp("created_at").defaultNow(),
  },
  // ... índices existentes
);
```

- [ ] **Step 4: Criar tabela roast_issues**

```typescript
export const roastIssues = pgTable("roast_issues", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  roastId: uuid("roast_id")
    .references(() => roasts.id, { onDelete: "cascade" })
    .notNull(),
  type: varchar("type", { length: 20 }).notNull(), // critical/warning/good
  title: text("title").notNull(),
  description: text("description").notNull(),
});
```

- [ ] **Step 5: Criar tabela roast_fixes**

```typescript
export const roastFixes = pgTable("roast_fixes", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  roastId: uuid("roast_id")
    .references(() => roasts.id, { onDelete: "cascade" })
    .notNull(),
  diff: text("diff").notNull(), // Unified diff
});
```

- [ ] **Step 6: Gerar migration**

Run: `npm run db:generate`

- [ ] **Step 7: Executar migration**

Run: `npm run db:migrate`

- [ ] **Step 8: Commit**

```bash
git add src/db/schema.ts drizzle/
git commit -m "feat(db): add roast schema fields and new tables"
```

---

## Chunk 2: tRPC Router - Mutation

### Task 2: Criar mutation createRoast

**Files:**
- Modify: `src/trpc/routers/_app.ts`

- [ ] **Step 1: Adicionar imports**

```typescript
import { z } from "zod";
import { roastIssues, roastFixes, codeSubmissions, roasts, roastModeEnum } from "@/db/schema";
```

- [ ] **Step 2: Adicionar mutation createRoast**

```typescript
createRoast: baseProcedure
  .input(z.object({
    code: z.string().min(1).max(100000),
    language: z.string().optional(),
    roastMode: z.enum(["normal", "spicy"]),
  }))
  .mutation(async ({ input }) => {
    const { code, language, roastMode } = input;
    
    // 1. Detectar linguagem se não informada (simplificado por agora)
    const detectedLanguage = language || "plaintext";
    
    // 2. Construir prompt baseado no modo
    const systemPrompt = roastMode === "spicy"
      ? `Você é um avaliador de código sarcástico e implacável. Analise o código com humor de dev, mas seja técnico.`
      : `Você é um avaliador de código construtivo. Forneça feedback profissional e objetivo.`;
    
    const userPrompt = `Analise este código em ${detectedLanguage}. Forneça JSON válido (apenas o JSON, sem markdown):
{
  "score": <número entre 0 e 10>,
  "verdict": "needs_help|decent|good|excellent",
  "roastTitle": "headline",
  "issues": [
    {"type": "critical|warning|good", "title": "...", "description": "..."}
  ],
  "fix": "unified diff"
}`;

    // 3. Chamar LLM (mock por agora para testar o fluxo)
    // TODO: integrar com provedor real
    const mockLLMResponse = {
      score: 5.5,
      verdict: "needs_help",
      roastTitle: `"Este código precisa de ajuda... mas todo mundo começa de algum lugar."`,
      issues: [
        { type: "warning", title: "Falta validação", description: "O código não valida inputs." },
        { type: "good", title: "Boa nomenclatura", description: "Nomes claros e descritivos." },
      ],
      fix: `+function validateInput(input) {\n+  if (!input) throw new Error('invalid');\n+  return input;\n+}\n-return input;`
    };

    // 4. Salvar no banco
    // Criar submission primeiro
    const [submission] = await db.insert(codeSubmissions).values({
      code,
      language: detectedLanguage,
      isAnonymous: true,
    }).returning();

    // Criar roast - usar roastText para headline
    const [roast] = await db.insert(roasts).values({
      submissionId: submission.id,
      code,
      language: detectedLanguage,
      roastMode,
      score: mockLLMResponse.score.toString(),
      roastText: mockLLMResponse.roastTitle, // headline
      verdict: mockLLMResponse.verdict,
    }).returning();

    // Criar issues
    for (const issue of mockLLMResponse.issues) {
      await db.insert(roastIssues).values({
        roastId: roast.id,
        type: issue.type,
        title: issue.title,
        description: issue.description,
      });
    }

    // Criar fix
    await db.insert(roastFixes).values({
      roastId: roast.id,
      diff: mockLLMResponse.fix,
    });

    // Retornar resultado completo
    return {
      id: roast.id,
      code,
      language: detectedLanguage,
      roastMode,
      score: mockLLMResponse.score,
      verdict: mockLLMResponse.verdict,
      roastTitle: mockLLMResponse.roastTitle,
      issues: mockLLMResponse.issues,
      fix: mockLLMResponse.fix,
    };
  }),
```

- [ ] **Step 3: Commit**

```bash
git add src/trpc/routers/_app.ts
git commit -m "feat(trpc): add createRoast mutation"
```

---

## Chunk 3: UI - Home Page

### Task 3: Atualizar CodeEditor para expor código

**Files:**
- Modify: `src/components/code-editor/CodeEditor.tsx`

- [ ] **Step 1: Verificar CodeEditor atual**

Run: `cat src/components/code-editor/CodeEditor.tsx`

- [ ] **Step 2: Expor código via onSubmit callback**

Modificar para que o CodeEditor receba um `onSubmit` callback que é chamado quando o usuário quer submeter:

```typescript
interface CodeEditorProps {
  onLimitChange?: (isOver: boolean) => void;
  onSubmit?: (code: string, language: string) => void; // NOVO
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/code-editor/CodeEditor.tsx
git commit -m "feat(code-editor): add onSubmit callback"
```

### Task 4: Atualizar home-content.tsx

**Files:**
- Modify: `src/components/home-content.tsx`

- [ ] **Step 1: Verificar home-content atual**

Run: `cat src/components/home-content.tsx`

- [ ] **Step 2: Adicionar estados e lógica**

```typescript
"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
// ... imports existentes

type RoastResult = {
  id: string;
  code: string;
  language: string;
  roastMode: "normal" | "spicy";
  score: number;
  verdict: string;
  roastTitle: string;
  issues: Array<{
    type: "critical" | "warning" | "good";
    title: string;
    description: string;
  }>;
  fix: string;
};

export function HomeContent() {
  const [isOverLimit, setIsOverLimit] = useState(false);
  const [submittedCode, setSubmittedCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [roastMode, setRoastMode] = useState<"normal" | "spicy">("normal");
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createRoast = trpc.createRoast.useMutation();

  const handleSubmit = async (code: string, language: string) => {
    setSubmittedCode(code);
    setSelectedLanguage(language);
    setError(null);
    setResult(null);

    try {
      const roastResult = await createRoast.mutateAsync({
        code,
        language: language || undefined,
        roastMode,
      });
      setResult(roastResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar");
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-10 pt-20">
      <div className="flex w-full max-w-[960px] flex-col gap-8">
        {/* ... seção do header ... */}

        <section>
          <CodeEditor 
            onLimitChange={setIsOverLimit} 
            onSubmit={handleSubmit}
          />
        </section>

        <section className="flex items-center justify-between">
          <Toggle 
            pressed={roastMode === "spicy"} 
            onPressedChange={(pressed) => setRoastMode(pressed ? "spicy" : "normal")}
          >
            roast mode
          </Toggle>
          <Button 
            disabled={isOverLimit || createRoast.isPending}
            onClick={() => {
              // TODO: obter código do editor
            }}
          >
            {createRoast.isPending ? "$ processando..." : "$ roast_my_code"}
          </Button>
        </section>

        {/* Resultado */}
        {result && (
          <RoastResult result={result} submittedCode={submittedCode} />
        )}

        {/* Erro */}
        {error && (
          <div className="rounded border border-accent-red bg-accent-red/10 p-4">
            <p className="text-accent-red">{error}</p>
            <Button onClick={() => handleSubmit(submittedCode, selectedLanguage)}>
              Tentar novamente
            </Button>
          </div>
        )}

        {/* ... resto do conteúdo ... */}
      </div>
    </main>
  );
}

function RoastResult({ 
  result, 
  submittedCode 
}: { 
  result: RoastResult; 
  submittedCode: string; 
}) {
  // Renderizar: score hero, código, issues, fix
  // Ver src/app/roast/[id]/page.tsx para referência de UI
  return (
    <div className="flex flex-col gap-8">
      {/* Score Hero */}
      <section className="flex items-center gap-12">
        <ScoreRing score={result.score} verdict={result.verdict} />
        <div>
          <p className="text-xl">{result.roastTitle}</p>
          <p className="text-sm text-text-tertiary">
            {result.language} • {result.roastMode}
          </p>
        </div>
      </section>

      {/* Código submetido */}
      <CodeDisplay code={submittedCode} />

      {/* Issues */}
      <IssuesList issues={result.issues} />

      {/* Suggested Fix */}
      <DiffDisplay diff={result.fix} />
    </div>
  );
}
```

- [ ] **Step 3: Criar componentes auxiliares (se necessário)**

Criar `src/components/roast-result.tsx` com componentes:
- `ScoreRing`
- `CodeDisplay`
- `IssuesList`  
- `DiffDisplay`

- [ ] **Step 4: Commit**

```bash
git add src/components/home-content.tsx src/components/roast-result.tsx
git commit -m "feat(ui): add roast result display on home page"
```

---

## Chunk 4: UI - CodeEditor + Integração

### Task 3: Atualizar CodeEditor

**Files:**
- Modify: `src/components/code-editor/CodeEditor.tsx`
- Modify: `src/components/home-content.tsx`

- [ ] **Step 1: Verificar CodeEditor atual**

Run: `cat src/components/code-editor/CodeEditor.tsx`

- [ ] **Step 2: Modificar CodeEditor para integrar submit**

O CodeEditor precisa:
1. Manter estado interno do código
2. Expor código e linguagem via props ou callback
3. Ser usado pelo home-content para obter os valores

Modificar interface:

```typescript
interface CodeEditorProps {
  onLimitChange?: (isOver: boolean) => void;
  // Para integração com submit:
  initialCode?: string;
  initialLanguage?: string;
}
```

No home-content, usar ref ou state para obter o código do editor.

- [ ] **Step 3: Atualizar home-content para conectar tudo**

```typescript
// No componente HomeContent:
const [code, setCode] = useState("");
const [selectedLanguage, setSelectedLanguage] = useState("");

// Passar para CodeEditor
<CodeEditor 
  onLimitChange={setIsOverLimit}
  initialCode={code}
  initialLanguage={selectedLanguage}
  onCodeChange={setCode}
  onLanguageChange={setSelectedLanguage}
/>

// Botão de submit
<Button 
  disabled={isOverLimit || createRoast.isPending}
  onClick={() => handleSubmit(code, selectedLanguage)}
>
  {createRoast.isPending ? "$ processando..." : "$ roast_my_code"}
</Button>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/code-editor/CodeEditor.tsx src/components/home-content.tsx
git commit -m "feat(integration): connect submit button to createRoast"
```

---

## Chunk 5: Testing

### Task 4: Testar fluxo completo

- [ ] **Step 1: Iniciar servidor**

Run: `npm run dev`

- [ ] **Step 2: Testar manualmente**

1. Acessar http://localhost:3000
2. Escrever código no editor
3. Selecionar linguagem
4. Clicar em "roast_my_code"
5. Ver resultado embaixo do editor

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: manual testing complete"
```
