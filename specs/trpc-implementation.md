# tRPC Implementation

## Problema
Necesitamos uma camada de API type-safe no nosso projeto Next.js para comunicação entre frontend e backend, integrada com SSR/server components.

## Solução
Implementar tRPC com TanStack React Query, suportando:
- Server Components: prefetch com hydration
- Client Components: hooks com React Query

## Escopo
- Escopo: fullstack (Next.js App Router)
- Dependências: `@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query`, `@tanstack/react-query`, `zod`, `client-only`, `server-only`

## Estrutura de Arquivos

```
trpc/
├── init.ts              # initTRPC, context, router helpers
├── query-client.ts      # QueryClient factory
├── client.tsx           # TRPCProvider para client components
├── server.tsx           # server caller + prefetch helpers
└── routers/
    └── _app.ts          # AppRouter type export
app/api/trpc/[trpc]/
└── route.ts             # API handler (fetch adapter)
```

## Implementação

1. **Instalar deps**: `npm install @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query zod client-only server-only`

2. **Criar `trpc/init.ts`**: initTRPC, createTRPCContext, createTRPCRouter, baseProcedure

3. **Criar `trpc/routers/_app.ts`**: AppRouter com procedures, exportar tipo `AppRouter`

4. **Criar `app/api/trpc/[trpc]/route.ts`**: fetchRequestHandler

5. **Criar `trpc/query-client.ts`**: makeQueryClient com staleTime e shouldDehydrateQuery

6. **Criar `trpc/client.tsx`**: TRPCReactProvider com QueryClientProvider

7. **Criar `trpc/server.tsx`**: getQueryClient, trpc proxy, caller, HydrateClient helper

8. **Wrap layout**: `<TRPCReactProvider>` em `app/layout.tsx`

## Uso

**Server Component** (prefetch + hydration):
```tsx
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

prefetch(trpc.example.queryOptions());
return <HydrateClient><Page /></HydrateClient>;
```

**Client Component** (hooks):
```tsx
const trpc = useTRPC();
const data = useQuery(trpc.example.queryOptions());
```

## Critérios de aceite
1. API route respondendo em `/api/trpc/*`
2. Server Components fazem prefetch com dados hydrated
3. Client Components usam hooks type-safe
4. Validação de input com Zod
5. Tipos compartilhados entre server e client
