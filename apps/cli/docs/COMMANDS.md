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
| `--receive-token` | Any supported token listed by `weave tokens` |
| `--amount` | Positive numeric string |
| `--wallet-address` | Wallet receiving funds |

### Conditionally required flag
| Flag | Rule |
|---|---|
| `--receive-network` | Required when the selected token supports more than one network (see `weave tokens`); optional for single-network tokens |

Network values accept full names and shorthands (case-insensitive):
- `Bitcoin` or `BTC`
- `Ethereum` or `ETH`
- `Solana` or `SOL`
- `Tron` or `TRX`
- `Zcash` or `ZEC`
- `Base`

Use `Base` for the Base network. `ETH` remains the Ethereum alias.

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

`--pay-token` must be one of the supported tokens listed by `weave tokens`.

`--pay-network` accepts the same supported network names and shorthands as `weave create`, including `Bitcoin|BTC`, `Ethereum|ETH`, `Solana|SOL`, `Tron|TRX`, `Zcash|ZEC`, and `Base`. Use `Base` for Base; `ETH` still maps to Ethereum.

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

## `weave tokens`
List supported tokens and networks from the shared source of truth.

### Example (JSON default)
```bash
./apps/cli/dist/weave tokens
```

### Example (`--human`)
```bash
./apps/cli/dist/weave tokens --human
```
