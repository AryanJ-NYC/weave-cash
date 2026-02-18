# Weave Cash

Accept crypto payments in the token you want. Your customer pays with what they have.

Weave Cash is an open-source crypto-to-crypto payments platform. Merchants create an invoice with a target settlement token/network, customers choose how they want to pay, and swap/execution happens through NEAR intents.

## Important Scope

- Crypto-to-crypto only
- No fiat support (USD, EUR, etc.) unless explicitly introduced in future roadmap work

## What Exists Today

- Landing and product pages (`/`, `/about`, `/blogs/web3-payments`)
- Invoice creation flow (`/create`)
- Invoice payment flow (`/invoice/[id]`) with status updates
- Invoice API route (`/api/invoices`)
- Prisma-backed `Invoice` model in PostgreSQL

## Tech Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4 + shadcn/ui
- Prisma ORM + PostgreSQL 16
- Turborepo + pnpm workspaces
- Zod validation + `@t3-oss/env-nextjs`

## Repository Layout

```text
weave-cash/
├── apps/
│   └── web/                  # Next.js app (UI + API routes)
├── packages/
│   ├── database/             # Prisma schema + DB client
│   ├── eslint-config/        # Shared ESLint config
│   └── typescript-config/    # Shared TS config
└── docs/                     # Product, styling, and troubleshooting docs
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- Docker (for local PostgreSQL)
- Defuse/NEAR 1-Click JWT token

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create app env file:

```bash
cp apps/web/.env.example apps/web/.env
```

Set values in `apps/web/.env`:

```env
DATABASE_URL="postgresql://weave:weave@localhost:5432/weave_cash"
DEFUSE_JWT_TOKEN="<your-defuse-jwt-token>"
```

Also create Prisma env file (Prisma resolves env relative to `schema.prisma`):

```bash
cat > packages/database/prisma/.env <<'ENV'
DATABASE_URL="postgresql://weave:weave@localhost:5432/weave_cash"
ENV
```

### 3. Start PostgreSQL

```bash
docker-compose up -d
```

### 4. Prepare database

```bash
cd packages/database
pnpm db:generate
pnpm db:migrate
cd ../..
```

### 5. Start development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Common Commands

From repository root:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm check-types
pnpm format
```

From `packages/database`:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:push
pnpm db:studio
```

## Good To Know Before Contributing

- Use `type` aliases over `interface`
- Keep shared domain types in `apps/web/lib/`
- Use `_components/` for app-local shared components
- Do not edit generated shadcn base components in `apps/web/_components/ui/`; style at call sites
- Use `import { clsx } from 'clsx'` (not `clsx/lite`)

## Troubleshooting

- Prisma says `Environment variable not found: DATABASE_URL`:
  - Make sure `packages/database/prisma/.env` exists with `DATABASE_URL`
- App fails env validation at boot:
  - Ensure both `DATABASE_URL` and `DEFUSE_JWT_TOKEN` are present in `apps/web/.env`

More detail: see [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md).

## Contributing

Contributions are welcome.

- Open an issue for bugs, ideas, or roadmap discussion
- Submit focused pull requests with clear descriptions
- Run `pnpm lint` and `pnpm check-types` before opening a PR
- For UI changes, include screenshots or short recordings when possible

## Security

Do not commit secrets (`.env`, JWTs, private keys, credential-bearing URLs). Redact sensitive values in logs and issue reports.

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See `/Users/aryanjabbari/Documents/projects/weave-cash/LICENSE`.
