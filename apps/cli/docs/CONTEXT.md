# Context And Decisions

## Product Context
`weave` is an agent-first CLI for Weave Cash invoice flows in a crypto-to-crypto system.

Core product truths:
- Weave Cash is auth-free by design.
- There is no invoice list/enumeration endpoint.
- Invoice UUID acts as capability access.

## Why This CLI Exists
The CLI gives agents and scripts a stable automation interface for:
1. Creating invoices.
2. Generating quotes for existing invoice IDs.
3. Reading/polling invoice status.

## Locked v1 Decisions
- Language/runtime: Go.
- Binary name: `weave`.
- Output default: JSON.
- Human-friendly output: `--human` opt-in.
- API URL default: `https://www.weavecash.com`.
- Override target instance with: `--api-url`.
- Stateless CLI: no local config files.
- `get` is an alias of `status`.
- `status --watch` exits `0` on any terminal invoice status.
- `status --watch` timeout exit code is `2`.

## Watch Defaults
- `--interval-seconds 5`
- `--timeout-seconds 900`

## Related Issues
- CLI spec: [Issue #43](https://github.com/AryanJ-NYC/weave-cash/issues/43)
- Auth-free decision: [Issue #41 comment](https://github.com/AryanJ-NYC/weave-cash/issues/41#issuecomment-3923646654)
- No list endpoint: [Issue #39](https://github.com/AryanJ-NYC/weave-cash/issues/39)
- Canonical invoice read endpoint: [Issue #40](https://github.com/AryanJ-NYC/weave-cash/issues/40)
