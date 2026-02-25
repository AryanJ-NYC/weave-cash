# weave CLI Documentation

This folder is the canonical CLI documentation set for `/apps/cli`.

## Start Here
- Product and decision context: `CONTEXT.md`
- Command usage and flags: `COMMANDS.md`
- Output contracts (JSON/NDJSON): `OUTPUT-CONTRACT.md`
- Exit codes and error payloads: `ERRORS-AND-EXIT-CODES.md`
- Architecture and internals: `ARCHITECTURE.md`
- Development and CI workflow: `DEVELOPMENT.md`
- Install guide: `INSTALL.md`
- Publishing and release process: `PUBLISHING.md`

## Scope
This docs set covers the Go binary `weave` only.

It does not redefine web/API behavior; it documents how the CLI calls the existing Weave Cash API.

## Source of Truth
When docs and implementation disagree, implementation wins:
- `cmd/weave/main.go`
- `internal/cmd/*`
- `internal/api/*`
- `internal/watch/*`
