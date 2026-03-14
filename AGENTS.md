# DevRoast

## Visão Geral

Plataforma de code review sarcástica que avalia código de forma implacável.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Radix UI (primitives)
- Shiki (syntax highlighting)
- tRPC (API)

## Estrutura

```
src/
├── app/              # Next.js App Router
│   ├── components/   # Página de demo de componentes
│   ├── globals.css   # Tailwind theme + variáveis
│   └── layout.tsx    # Root layout (Navbar)
├── components/ui/    # Componentes genéricos reutilizáveis
├── db/               # Database (Drizzle ORM)
│   ├── index.ts
│   └── schema.ts
└── trpc/             # tRPC API
    ├── init.ts
    ├── routers/
    └── client.tsx
```

## Padrões de Componentes

### tv() + twMerge

```tsx
// Use tv() para variantes
const button = tv({ base: "...", variants: {...} });

// Use twMerge para objetos de estilo
import { twMerge } from "tailwind-merge";
<div className={twMerge(styles.base, className)} />
```

### Comportamento

- Componentes com estado: `@radix-ui/react-*`
- forwardRef para todas as refs
- Named exports apenas
- Props estendem atributos nativos

### Estilização

- Variáveis Tailwind: `bg-bg-page`, `text-text-primary`, etc.
- Fonte monospaced: `font-[family-name:var(--font-jetbrains-mono)]`
- Tema escuro por padrão (hardcoded no @theme)

## Scripts

- `npm run dev` - Desenvolvimento
- `npm run build` - Build
- `npm run lint:biome` - Lint

## Banco de Dados

### Stack

- PostgreSQL 16 (via Docker Compose)
- Drizzle ORM
- Drizzle Kit (migrations)

### Estrutura

```
src/
├── db/
│   ├── index.ts      # Conexão com o banco
│   └── schema.ts     # Definição das tabelas
```

### Config

Use `.config("nome_coluna")` para definir o nome da coluna no banco:

```typescript
export const users = pgTable("users", {
  id: uuid().defaultGenRandomUUID().config("id"),
  username: varchar(50).notNull().unique().config("username"),
});
```

### Queries

Queries usam `db.select()` com Drizzle ORM:

```typescript
import { db } from "@/db";
import { users } from "@/db/schema";

const result = await db.select().from(users);
```

Para agregações, use `sql\``:

```typescript
import { sql } from "drizzle-orm";

const result = await db
  .select({
    count: sql`count(*)`,
  })
  .from(users);
```

### Scripts DB

- `npm run db:generate` - Gerar migrations
- `npm run db:push` - Enviar schema para o banco
- `npm run db:migrate` - Executar migrations
- `npm run db:studio` - Abrir Drizzle Studio
