# Architecture

## High-Level Flow
1. Cobra parses command + flags in `internal/cmd`.
2. Command builds request payloads and performs local validation.
3. `internal/api/client.go` calls Weave Cash HTTP endpoints.
4. `internal/output/output.go` renders JSON (default) or human text.
5. `cmd/weave/main.go` maps errors to process exit codes.

## Package Layout
- `cmd/weave/main.go`: program entrypoint.
- `internal/cmd/`: command definitions (`create`, `quote`, `status`, `get` alias).
- `internal/api/`: HTTP client and API DTOs.
- `internal/watch/`: polling engine and status-change event generation.
- `internal/output/`: output rendering policy.
- `internal/exit/`: typed exit errors and code mapping.

## Watcher Semantics
- Polling interval and timeout are configured by flags.
- Event emission is edge-triggered on status changes.
- Terminal statuses are defined by a fixed set:
  - `COMPLETED`
  - `FAILED`
  - `REFUNDED`
  - `EXPIRED`

## Compatibility Notes
- CLI does not implement or assume invoice listing.
- CLI does not implement auth token handling.
- API response contracts are consumed as-is from web API routes.
