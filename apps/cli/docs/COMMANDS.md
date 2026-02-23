# Commands

## Running The CLI
From repo root:

```bash
pnpm --filter cli build
./apps/cli/dist/weave --help
```

Or without building:

```bash
cd apps/cli
go run ./cmd/weave --help
```

`./cmd/weave` is a source directory, not an executable file.

## Global Flags
| Flag | Type | Default | Description |
|---|---|---|---|
| `--api-url` | string | `https://www.weavecash.com` | Base URL for API requests |
| `--human` | bool | `false` | Render human-readable output instead of JSON |

## `weave create`
Create a new invoice via `POST /api/invoices`.

### Required flags
| Flag | Notes |
|---|---|
| `--receive-token` | One of `USDC`, `USDT`, `ETH`, `BTC`, `SOL` |
| `--amount` | Positive numeric string |
| `--wallet-address` | Wallet receiving funds |

### Conditionally required flag
| Flag | Rule |
|---|---|
| `--receive-network` | Required for multi-network tokens (`USDC`, `USDT`); optional for single-network tokens (`BTC`, `ETH`, `SOL`) |

### Optional flags
- `--description`
- `--buyer-name`
- `--buyer-email`
- `--buyer-address`

### Examples
Single-network token (network inferred):

```bash
./apps/cli/dist/weave create \
  --receive-token BTC \
  --amount 0.01 \
  --wallet-address bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
```

Multi-network token (network required):

```bash
./apps/cli/dist/weave create \
  --receive-token USDC \
  --receive-network Ethereum \
  --amount 5 \
  --wallet-address 0x1234...
```

## `weave quote <invoice-id>`
Generate payment instructions via `POST /api/invoices/[id]/quote`.

### Required flags
- `--pay-token`
- `--pay-network`
- `--refund-address`

### Example
```bash
./apps/cli/dist/weave quote 9c74e9a6-... \
  --pay-token USDC \
  --pay-network Ethereum \
  --refund-address 0xabcd...
```

## `weave status <invoice-id>`
Read the invoice snapshot via `GET /api/invoices/[id]`.

### Flags
| Flag | Type | Default | Description |
|---|---|---|---|
| `--watch` | bool | `false` | Poll until terminal status or timeout |
| `--interval-seconds` | int | `5` | Poll interval in watch mode |
| `--timeout-seconds` | int | `900` | Poll timeout in watch mode |

### Examples
One-shot read:

```bash
./apps/cli/dist/weave status 9c74e9a6-...
```

Polling mode:

```bash
./apps/cli/dist/weave status 9c74e9a6-... --watch
```

## `weave get <invoice-id>`
Alias of `status` (same behavior and flags).
