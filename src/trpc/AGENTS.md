# Padrões tRPC

## Estrutura

```
src/trpc/
├── init.ts            # Configuração base (t, createTRPCRouter, createCallerFactory)
├── server.tsx         # Servidor tRPC para client
├── client.tsx         # Client tRPC
├── query-client.ts    # Query client config
└── routers/
    └── _app.ts        # Router principal
```

## Padrões de Implementação

### 1. Procedures

Use `baseProcedure` do `init.ts`:

```typescript
import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  endpoint: baseProcedure.query(async () => {
    // implementação
    return data;
  }),
});
```

### 2. Queries com Drizzle

Use `db.select()` para queries:

```typescript
import { db } from "@/db";
import { table } from "@/db/schema";
import { sql } from "drizzle-orm";

const result = await db
  .select({
    field: table.column,
    agg: sql`aggregate_function(${table.column})`,
  })
  .from(table);
```

### 3. Queries Paralelas

Use `Promise.all` para executar múltiplas queries em paralelo:

```typescript
const [entriesResult, countResult] = await Promise.all([
  db.select({ ... }).from(table1).limit(3),
  db.select({ count: sql`count(*)` }).from(table1),
]);

const entries = entriesResult;
const totalCount = Number(countResult[0]?.count ?? 0);
```

### 4. Tipos

Exporte o tipo do router:

```typescript
export type AppRouter = typeof appRouter;
```

## Client

O client já está configurado em `client.tsx` e `query-client.ts`. Use:

```typescript
import { trpc } from "@/trpc/client";
import { trpc as trpcServer } from "@/trpc/server";

trpc.endpoint.use();
trpcServer.endpoint.query();
```
