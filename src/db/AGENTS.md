# Padrões Database

## Schema

Use `pgTable` para tabelas PostgreSQL:

```typescript
import { pgTable, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const roasts = pgTable("roasts", {
  id: uuid().defaultGenRandomUUID().config("id"),
  code: text().notNull().config("code"),
  language: varchar(20).notNull().config("language"),
  score: integer().notNull().config("score"),
  createdAt: timestamp().notNull().defaultNow().config("created_at"),
});
```

### Nomes de Colunas

Use `.config("nome_coluna")` para definir o nome da coluna no banco:

```typescript
id: uuid().defaultGenRandomUUID().config("id"),
username: varchar(50).notNull().unique().config("username"),
```

## Queries

### Select

```typescript
import { db } from "@/db";
import { users } from "@/db/schema";

const result = await db.select().from(users);
```

### Agregação

```typescript
import { sql } from "drizzle-orm";

const result = await db
  .select({
    count: sql`count(*)`,
    avgScore: sql`avg(${roasts.score})`,
  })
  .from(roasts);
```

## Scripts

- `npm run db:generate` - Gerar migrations
- `npm run db:push` - Enviar schema para o banco
- `npm run db:migrate` - Executar migrations
- `npm run db:studio` - Abrir Drizzle Studio
