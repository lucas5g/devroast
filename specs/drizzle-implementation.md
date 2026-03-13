# Especificação: Implementação Drizzle ORM

## Visão Geral

Este documento especifica a implementação do Drizzle ORM com Docker Compose para PostgreSQL no projeto DevRoast.

## Stack de Banco de Dados

- **PostgreSQL** via Docker Compose
- **Drizzle ORM** como ORM
- **Drizzle Kit** para migrations

---

## Tabelas

### 1. `users`

Tabela de usuários registrados na plataforma.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, DEFAULT gen_random_uuid() | ID único do usuário |
| `username` | `varchar(50)` | UNIQUE, NOT NULL | Nome de usuário |
| `email` | `varchar(255)` | UNIQUE, NOT NULL | Email do usuário |
| `password_hash` | `varchar(255)` | NOT NULL | Hash da senha |
| `created_at` | `timestamp` | DEFAULT NOW() | Data de criação |
| `updated_at` | `timestamp` | DEFAULT NOW() | Data de atualização |

### 2. `code_submissions`

Tabela que armazena as submissões de código para roast.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, DEFAULT gen_random_uuid() | ID único da submissão |
| `user_id` | `uuid` | FK → users(id), NOT NULL | Usuário que submeteu (opcional se anônimo) |
| `code` | `text` | NOT NULL | Código submetido |
| `language` | `varchar(20)` | NOT NULL | Linguagem do código |
| `is_anonymous` | `boolean` | DEFAULT false | Se a submissão é anônima |
| `created_at` | `timestamp` | DEFAULT NOW() | Data da submissão |

### 3. `roasts`

Tabela que armazena os resultados dos roasts.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, DEFAULT gen_random_uuid() | ID único do roast |
| `submission_id` | `uuid` | FK → code_submissions(id), NOT NULL | Submissão relacionada |
| `score` | `decimal(3,1)` | NOT NULL | Nota do roast (0-10) |
| `roast_text` | `text` | NOT NULL | Texto sarcástico do roast |
| `roast_mode` | `roast_mode_enum` | DEFAULT 'normal' | Modo do roast (normal/spicy) |
| `created_at` | `timestamp` | DEFAULT NOW() | Data do roast |

### 4. `leaderboard_entries`

Tabela para o leaderboard (pré-calculado para performance).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, DEFAULT gen_random_uuid() | ID único |
| `submission_id` | `uuid` | FK → code_submissions(id), NOT NULL | Submissão no ranking |
| `rank` | `integer` | NOT NULL | Posição no ranking |
| `score` | `decimal(3,1)` | NOT NULL | Score para ordenação |
| `language` | `varchar(20)` | NOT NULL | Linguagem |
| `code_preview` | `varchar(100)` | NOT NULL | Preview do código (primeiros 100 chars) |
| `created_at` | `timestamp` | DEFAULT NOW() | Data de entrada no ranking |

---

## Enums

### `roast_mode_enum`

```sql
CREATE TYPE roast_mode_enum AS ENUM ('normal', 'spicy');
```

---

## Estrutura de Arquivos

```
src/
├── db/
│   ├── index.ts          # Conexão com o banco
│   ├── schema.ts         # Definição das tabelas
│   └── migrations/       # Migrations do Drizzle
├── lib/
│   └── auth.ts           # Funções de autenticação
```

---

## Docker Compose

### `docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## To-Dos de Implementação

### Fase 1: Setup Docker e PostgreSQL
- [ ] Criar arquivo `docker-compose.yml` na raiz
- [ ] Configurar variáveis de ambiente (`.env`)
- [ ] Adicionar dependências: `drizzle-orm`, `postgres`, `drizzle-kit`
- [ ] Criar arquivo de configuração do Drizzle (`drizzle.config.ts`)

### Fase 2: Schema e Migrations
- [ ] Criar `src/db/schema.ts` com todas as tabelas e enums
- [ ] Criar migration inicial com `drizzle-kit push`
- [ ] Criar arquivo `src/db/index.ts` com conexão

### Fase 3: Autenticação
- [ ] Implementar funções de hash de senha (bcrypt)
- [ ] Criar utilitários de autenticação em `src/lib/auth.ts`
- [ ] Implementar registro e login de usuários

### Fase 4: Integração com API
- [ ] Criar API routes para submissions (POST /api/submit)
- [ ] Criar API routes para roasts (POST /api/roast)
- [ ] Criar API routes para leaderboard (GET /api/leaderboard)
- [ ] Criar API routes para auth (POST /api/auth/register, POST /api/auth/login)

### Fase 5: Integração com Frontend
- [ ] Conectar componentes de submissão com API
- [ ] Exibir resultados do roast
- [ ] Atualizar leaderboard com dados do banco

---

## Variáveis de Ambiente

```env
# Database
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast

# Auth
AUTH_SECRET=sua-chave-secreta-aqui
```

---

## Scripts NPM

Adicionar ao `package.json`:

```json
"db:generate": "drizzle-kit generate",
"db:push": "drizzle-kit push",
"db:migrate": "drizzle-kit migrate",
"db:studio": "drizzle-kit studio"
```

---

## Referências

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
