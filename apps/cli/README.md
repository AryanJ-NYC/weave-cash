# weave CLI

`weave` is an agent-first Go CLI for Weave Cash invoice flows.

## Full Documentation

- Docs index: `docs/README.md`
- Context and decisions: `docs/CONTEXT.md`
- Commands and flags: `docs/COMMANDS.md`
- Output contracts: `docs/OUTPUT-CONTRACT.md`
- Errors and exit codes: `docs/ERRORS-AND-EXIT-CODES.md`
- Architecture: `docs/ARCHITECTURE.md`
- Development and CI: `docs/DEVELOPMENT.md`
- Install guide: `docs/INSTALL.md`
- Publishing and releases: `docs/PUBLISHING.md`

## Product Model
- Auth-free API (no API keys)
- No invoice enumeration/list endpoint
- Invoice UUID acts as capability access
- Stateless CLI (no local config files)

## Default Behavior
- Output defaults to JSON
- Use `--human` for readable text output
- Default API URL: `https://www.weavecash.com`
- Override target with `--api-url`

## Commands

## Running the CLI

`./cmd/weave` is a source directory, not an executable binary.

From repo root (`/Users/aryanjabbari/Documents/projects/weave-cash`):

```bash
pnpm --filter cli build
./apps/cli/dist/weave --help
```

Or run without building:

```bash
cd apps/cli
go run ./cmd/weave --help
```

### Create invoice
```bash
./apps/cli/dist/weave create \
  --receive-token BTC \
  --amount 0.01 \
  --wallet-address bc1q...
```

Token/network behavior:
- For tokens with one valid network (`BTC`, `ETH`, `SOL`), `--receive-network` is optional and auto-inferred.
- For tokens with multiple networks (`USDC`, `USDT`), `--receive-network` is required.
- Network flags accept full names or shorthands: `Bitcoin|BTC`, `Ethereum|ETH`, `Solana|SOL` (case-insensitive).
- If you provide an invalid token/network pair, the CLI fails before making an API request.

Example for a multi-network token:

```bash
./apps/cli/dist/weave create \
  --receive-token USDC \
  --receive-network Ethereum \
  --amount 5 \
  --wallet-address 0x...
```

### Quote invoice by UUID
```bash
./apps/cli/dist/weave quote <invoice-id> \
  --pay-token USDC \
  --pay-network Ethereum \
  --refund-address 0x...
```

### Read status once
```bash
./apps/cli/dist/weave status <invoice-id>
# or alias
./apps/cli/dist/weave get <invoice-id>
```

### Poll status
```bash
./apps/cli/dist/weave status <invoice-id> --watch
```

### List supported tokens/networks
```bash
./apps/cli/dist/weave tokens
./apps/cli/dist/weave tokens --human
```

Polling defaults:
- `--interval-seconds 5`
- `--timeout-seconds 900`

Exit codes:
- `0`: success (including any terminal status in watch mode)
- `1`: command/API/network/validation failure
- `2`: watch timed out before terminal status

## Development
```bash
pnpm --filter cli build
pnpm --filter cli test
pnpm --filter cli lint
pnpm --filter cli check-types
```
