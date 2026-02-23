# Development And CI

## Local Commands
Run from repo root:

```bash
pnpm --filter cli build
pnpm --filter cli test
pnpm --filter cli lint
pnpm --filter cli check-types
```

Cross-repo verification:

```bash
pnpm lint
pnpm check-types
```

## Local Build Output
- Binary output: `apps/cli/dist/weave`
- Go local caches: `apps/cli/.cache/go-build`, `apps/cli/.cache/go-mod`

`apps/cli/.cache/` is git-ignored.

## CI Workflow
- File: `.github/workflows/cli-ci.yml`
- Triggered on changes in `apps/cli/**` and on pushes to `master` with same path filter.
- Runs:
  - `go test ./...`
  - `go vet ./...`
  - `go build ./cmd/weave`

## Testing Strategy
- API client tests (`internal/api/client_test.go`) use `httptest` for request/response assertions.
- Command tests (`internal/cmd/*_test.go`) verify argument handling, payload behavior, alias behavior, and exit-code paths.
- Watch tests (`internal/watch/watcher_test.go`) verify status-change emission and timeout behavior.

## Common Pitfalls
- Running `./cmd/weave` directly: this is not a binary.
- Forgetting `--` in flag names (for example `--wallet-address`).
- Omitting `--receive-network` for multi-network receive tokens (`USDC`, `USDT`).
