# Contributing to Weave Cash

Thanks for your interest in contributing.

Weave Cash is a crypto-to-crypto payments platform, and we welcome bug fixes, UX improvements, docs updates, and feature work aligned with that scope.

## First-Time Setup

Follow the full local setup in `/Users/aryanjabbari/Documents/projects/weave-cash/README.md`.

Quick version:

```bash
pnpm install
cp apps/web/.env.example apps/web/.env
docker-compose up -d
cd packages/database
pnpm db:generate
pnpm db:migrate
cd ../..
pnpm dev
```

## Scope and Product Guardrails

- Crypto-to-crypto only (no fiat behavior unless explicitly requested by maintainers)
- Keep user-facing behavior consistent with current app flows
- Prefer focused PRs over broad refactors

## Development Workflow

1. Open or find a GitHub issue describing the change.
2. Make focused changes in the smallest safe diff.
3. Run verification commands locally.
4. Open a PR with context, screenshots (for UI), and testing notes.

## Verification Checklist

From repository root:

```bash
pnpm lint
pnpm check-types
```

For database changes (from `packages/database`):

```bash
pnpm db:generate
pnpm db:migrate
```

If you skip a check, explain why in the PR description.

## Coding Conventions

- Use `type` aliases over `interface`
- Use `_components/` (not `components/`) for app-local shared components
- Do not edit generated shadcn base components under `apps/web/_components/ui/`; style at call sites or wrappers
- Keep shared domain types under `apps/web/lib/`
- Use `import { clsx } from 'clsx'` (not `clsx/lite`)

## Pull Request Guidelines

Include:

- What changed and why
- Any screenshots or short recordings for UI changes
- Verification commands you ran and their results
- Follow-up work or known risks

## Security

- Never commit `.env` files, JWTs, private keys, or credential-bearing URLs
- Redact sensitive values in logs, screenshots, and issue/PR text

If you discover a security issue, please avoid public disclosure in a GitHub issue. Contact maintainers privately first.

## License

By contributing, you agree that your contributions are licensed under the repository’s GNU Affero General Public License v3.0 (AGPL-3.0).
