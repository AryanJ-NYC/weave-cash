# AGENTS.md

## Mission & Product Truth

- Weave Cash is a crypto-to-crypto payment platform.
- Product promise: merchants choose what crypto they want to receive, customers can pay with other supported crypto, and conversion happens behind the scenes.
- This repository is crypto-to-crypto only. Do not introduce fiat assumptions, fiat conversions, or fiat-denominated product behavior unless the user explicitly asks for it.

## Source-of-Truth Order

1. Codebase implementation (current behavior in source files)
2. `/Users/aryanjabbari/Documents/projects/weave-cash/CLAUDE.md`
3. `docs/` and `README.md`

- If sources conflict, follow the higher-precedence source and explicitly call out the conflict in the final handoff.
- Known drift: `/Users/aryanjabbari/Documents/projects/weave-cash/README.md` is template-era and not canonical for product behavior.

## Repo Map

- App: `/Users/aryanjabbari/Documents/projects/weave-cash/apps/web` (Next.js App Router frontend/API routes)
- Database package: `/Users/aryanjabbari/Documents/projects/weave-cash/packages/database` (Prisma + PostgreSQL)
- Shared config packages: `/Users/aryanjabbari/Documents/projects/weave-cash/packages/eslint-config`, `/Users/aryanjabbari/Documents/projects/weave-cash/packages/typescript-config`

Critical modules to check first for common tasks:

- `/Users/aryanjabbari/Documents/projects/weave-cash/apps/web/lib/env.ts`
- `/Users/aryanjabbari/Documents/projects/weave-cash/apps/web/lib/invoice/*`
- `/Users/aryanjabbari/Documents/projects/weave-cash/apps/web/lib/near-intents/*`
- `/Users/aryanjabbari/Documents/projects/weave-cash/packages/database/prisma/schema.prisma`

## Non-Negotiable Engineering Rules

1. Use `type` aliases over `interface`.
2. Use `_components/` (not `components/`) for app-local shared UI.
3. Never edit shadcn base components in `/Users/aryanjabbari/Documents/projects/weave-cash/apps/web/_components/ui/`; customize via composition or call-site `className`.
4. Put shared domain types in `lib/` modules. Avoid barrel `index.ts` files for domain directories.
5. Use `import { clsx } from 'clsx'` (not `clsx/lite`).
6. Do not auto-commit or auto-push. Prepare work for PR handoff and let the user choose git integration actions.

## Workflow: Required Execution Loop

1. Preflight

- Restate task scope and detect touched layer(s): `ui`, `api`, `db`, `integration`, `docs`.
- Map impacted files before editing.

2. Implement

- Make the smallest safe change set.
- Preserve current patterns and repository conventions.

3. Verify

- Run targeted checks for touched areas.
- Report exact command(s) and outcome(s).

4. Handoff

- Report what changed.
- Report what was verified.
- Report remaining risk, untested paths, and known assumptions.

## Task Playbooks

### UI playbook

- Follow existing styling conventions in `/Users/aryanjabbari/Documents/projects/weave-cash/docs/STYLING.md`.
- Preserve accessibility states (focus visibility, keyboard usage, readable contrast, reduced-motion awareness).
- Avoid visual redesign drift unless requested.

### API playbook

- Update validation and route logic together.
- Keep strict request validation with zod schemas.
- Ensure response/error shapes remain coherent with caller expectations.

### DB/Prisma playbook

- When schema changes, include required Prisma generate/migration steps.
- Use commands from `/Users/aryanjabbari/Documents/projects/weave-cash/packages/database`.
- Remember Prisma env loading caveat documented in `/Users/aryanjabbari/Documents/projects/weave-cash/docs/TROUBLESHOOTING.md` (env resolution relative to `schema.prisma`).

### Near-intents playbook

- Treat external SDK/API calls as failure-prone.
- Preserve or improve graceful fallback behavior and error handling.
- Never expose auth tokens while debugging integration issues.

### Docs-only playbook

- Avoid unrelated code edits.
- Keep docs aligned with source-of-truth ordering and call out mismatches.

## Verification Matrix

- Cross-cutting changes
- Run `pnpm lint` and/or `pnpm check-types` from repo root.

- Web-only changes
- Run `pnpm --filter web lint`.
- Run `pnpm --filter web check-types`.

- DB changes
- From `/Users/aryanjabbari/Documents/projects/weave-cash/packages/database`, run relevant commands:
- `pnpm db:generate`
- `pnpm db:migrate` when a migration is required
- any additional schema-related command needed for the task

- If checks are skipped
- State exactly what was skipped and why in handoff.

- Current baseline
- No established automated test suite is present in this repo today.
- For behavior changes, include manual smoke-path notes in handoff.

## Secrets & Safety Policy

1. Never print raw secrets, JWTs, or credential-bearing URLs.
2. Redact sensitive values in logs, diffs, command output, and examples.
3. Never commit `.env` files or generated secret artifacts.
4. For auth/integration debugging, describe token presence/shape and config state, not literal values.

## Handoff Format

Use this exact structure in completion summaries:

1. `Changes made`

- List modified files using absolute paths and what changed.

2. `Verification run`

- List each command and pass/fail outcome.
- If skipped, include reason.

3. `Risks / follow-ups`

- List remaining edge cases, manual checks, or deferred work.

4. `Open questions`

- List unresolved product or technical decisions (if any).

Keep handoff concise, auditable, and path-specific.

## Fast Context for New Agents

Core commands:

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm check-types`

Database command location:

- Run Prisma/database commands from `/Users/aryanjabbari/Documents/projects/weave-cash/packages/database`.

Required environment variables:

- `DATABASE_URL`
- `DEFUSE_JWT_TOKEN`

### AGENTS Quality Scenarios

1. Invoice validation change

- Expected behavior: update zod validation and any coupled route logic, then run targeted web verification commands.

2. UI button style tweak

- Expected behavior: do not edit shadcn base files; apply style changes at call sites or wrappers.

3. Doc/code conflict

- Expected behavior: follow code, then `CLAUDE.md`, and document the conflict in handoff.

4. Near-intents auth debugging

- Expected behavior: redact token values and report safe diagnostics only.

5. Completion claim

- Expected behavior: include exact verification commands and outcomes, or an explicit skip rationale.

### Assumptions and Defaults

1. Primary objective is execution guardrails.
2. Verification policy: always run targeted checks.
3. Source precedence: code > `CLAUDE.md` > docs/README.
4. Document style: operational checklist.
5. Git default: prepare for PR; no auto-commit/push.
6. Secrets policy: hard-block on exposure.
7. Structure: strict layered playbook.
