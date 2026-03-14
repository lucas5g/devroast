# Create Roast Feature - Design

**Date:** 2026-03-14  
**Status:** Pending Review

## 1. Visão Geral

Permitir que usuários submetam trechos de código para análise pela IA, com resultado exibido na mesma página (same-page). Suporta dois modos: "normal" (construtivo) e "spicy" (roast/sarcástico).

## 2. Arquitetura

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│   CodeEditor   │────▶│  tRPC Router │────▶│  IA (LLM)  │
│  (Home Page)   │     │  mutation    │     │  Streaming │
└─────────────────┘     └──────────────┘     └─────────────┘
                              │                      │
                              ▼                      ▼
                       ┌──────────────┐       ┌─────────────┐
                       │   Database   │◀──────│  Save Roast │
                       │   (Drizzle)  │       │             │
                       └──────────────┘       └─────────────┘
```

**Fluxo:**
1. Usuário escreve código + seleciona linguagem + escolhe roast mode
2. Submit → tRPC mutation `createRoast`
3. Backend detecta linguagem (se não selecionada), chama LLM com prompt apropriado
4. Streaming: chunks voltam em tempo real para o cliente
5. Completo → salva no banco e exibe resultado embaixo do editor

## 3. Schema do Banco

### Tabela: `roasts` (existente, atualizar campos)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| code | text | Código original submetido |
| language | varchar(20) | Linguagem detectada/selecionada |
| roastMode | enum | normal/spicy |
| score | decimal(3,1) | Score 0-10 |
| verdict | varchar(50) | needs_help/decent/good/excellent |
| roastTitle | text | Headline do roast |
| createdAt | timestamp | Data de criação |

**Nota:** userId é opcional (anonimamente por agora).future implementação de auth vai adicionar referência.

### Nova tabela: `roast_issues`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| roastId | uuid | FK → roasts.id |
| type | varchar(20) | critical/warning/good |
| title | text | Título do issue |
| description | text | Descrição detalhada |

### Nova tabela: `roast_fixes`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| roastId | uuid | FK → roasts.id |
| diff | text | Unified diff da sugestão |

## 4. tRPC Router

### Mutation: `createRoast`

```typescript
createRoast: publicProcedure
  .input(z.object({
    code: z.string().max(100000), // ~500 linhas
    language: z.string().optional(),
    roastMode: z.enum(["normal", "spicy"]),
  }))
  .mutation(async ({ input, ctx }) => {
    // 1. Detectar linguagem se não informada
    // 2. Chamar LLM com prompt baseado em roastMode
    // 3. Salvar no banco
    // 4. Retornar roast completo
  })
```

**Streaming:** Usar streaming do tRPC para exibir resultado em tempo real.

## 5. UI - Home Page

**Local:** `src/components/home-content.tsx`

**Estados:**
- `idle`: Editor pronto para input
- `submitting`: Loading state durante submit
- `success`: Resultado exibido embaixo do editor
- `error`: Mensagem de erro com retry

**Resultado exibido:**
- Score hero (número 0-10 + verdict)
- Código submetido
- Lista de issues (cards com severity: critical/warning/good)
- Suggested fix (diff com cores)

## 6. Prompts para LLM

### Instruções de Parsing
- O JSON retornado DEVE ser válido
- Use `json_mode` ou equivalente do provider
- Retry automático 1x se parsing falhar
- Se falhar 2x, retornar erro amigável

**Valores válidos:**
- `verdict`: apenas "needs_help", "decent", "good", "excellent"
- `type` em issues: apenas "critical", "warning", "good"

### Modo Normal (construtivo)

Analise este código em {language}. Forneça JSON válido (apenas o JSON, sem markdown):
```json
{
  "score": <número entre 0 e 10>,
  "verdict": "needs_help|decent|good|excellent",
  "roastTitle": "headline construtiva",
  "issues": [
    {"type": "critical|warning|good", "title": "...", "description": "..."}
  ],
  "fix": "unified diff"
}
```
Tom: profissional, construtivo, objetivo.

### Modo Spicy (roast mode)

Analise este código em {language}. Forneça JSON válido (apenas o JSON, sem markdown):
```json
{
  "score": <número entre 0 e 10>,
  "verdict": "needs_help|decent|good|excellent",
  "roastTitle": "headline sarcástica",
  "issues": [
    {"type": "critical|warning|good", "title": "...", "description": "..."}
  ],
  "fix": "unified diff"
}
```
Tom: sarcástico, troll, humor negro de dev.

## 7. Error Handling

| Cenário | Handling |
|---------|----------|
| Código vazio | Validação cliente + servidor |
| Linguagem não detectada | Fallback "plaintext" + warning |
| JSON malformado do LLM | Retry 1x, depois erro amigável |
| LLM fora do ar | Erro amigável + retry |
| Timeout (30s) | Cancelar + "tente novamente" |
| Banco falhar | Log + retry 1x + erro |

## 8. Limites

- **Linhas de código:** 500 máximo
- **Linguagem:** Detecção automática ou dropdown manual
- **Modo:** Normal (construtivo) ou Spicy (roast/sarcástico)

## 9. Fora do Escopo

- Share roast
- Autenticação/usuário (anonimamente por agora)
- Histórico de roasts
- Ranking automático
