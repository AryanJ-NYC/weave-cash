# Output Contract

Default output mode is machine-oriented JSON.

In watch mode, output is newline-delimited JSON events (NDJSON) written to stdout.

## `create`
Shape:

```json
{
  "id": "inv_123",
  "invoiceUrl": "https://www.weavecash.com/invoice/inv_123"
}
```

## `quote`
Shape mirrors `POST /api/invoices/[id]/quote` response.

```json
{
  "depositAddress": "0x...",
  "depositMemo": "memo-if-any",
  "amountIn": "10",
  "amountOut": "0.01",
  "timeEstimate": "2m",
  "expiresAt": "2026-02-21T00:00:00.000Z"
}
```

## `status` / `get` (one-shot)
Shape mirrors `GET /api/invoices/[id]` normalized response.

```json
{
  "id": "inv_123",
  "status": "PENDING",
  "invoice": {
    "id": "inv_123",
    "amount": "0.01",
    "receiveToken": "BTC",
    "receiveNetwork": "Bitcoin",
    "walletAddress": "bc1q...",
    "description": null,
    "buyerName": null,
    "buyerEmail": null,
    "buyerAddress": null,
    "createdAt": "2026-02-20T00:00:00.000Z",
    "updatedAt": "2026-02-20T00:00:00.000Z"
  },
  "paymentInstructions": {
    "payToken": null,
    "payNetwork": null,
    "depositAddress": null,
    "depositMemo": null,
    "amountIn": null,
    "expiresAt": null,
    "paidAt": null
  },
  "timeline": {
    "currentStatus": "PENDING",
    "isTerminal": false,
    "createdAt": "2026-02-20T00:00:00.000Z",
    "quotedAt": null,
    "expiresAt": null,
    "paidAt": null,
    "completedAt": null,
    "failedAt": null,
    "refundedAt": null,
    "expiredAt": null,
    "lastStatusChangeAt": "2026-02-20T00:00:00.000Z"
  }
}
```

## `status --watch` events (NDJSON)
A JSON line is emitted only on status change, then terminal or timeout.

Status change event:

```json
{
  "event": "status_change",
  "status": "PROCESSING",
  "invoice": { "...": "..." },
  "observedAt": "2026-02-20T00:00:00Z"
}
```

## `tokens`
Lists available token/network combinations and network shorthands.

```json
{
  "tokens": ["BTC", "ETH", "SOL", "USDC", "USDT"],
  "networks": ["Bitcoin", "Ethereum", "Solana"],
  "tokenNetworkMap": {
    "BTC": ["Bitcoin"],
    "ETH": ["Ethereum"],
    "SOL": ["Solana"],
    "USDC": ["Ethereum", "Solana"],
    "USDT": ["Ethereum", "Solana"]
  },
  "networkAliases": {
    "Bitcoin": ["btc"],
    "Ethereum": ["eth"],
    "Solana": ["sol"]
  }
}
```

Terminal event:

```json
{
  "event": "terminal",
  "status": "COMPLETED",
  "invoice": { "...": "..." },
  "observedAt": "2026-02-20T00:02:00Z"
}
```

Timeout event:

```json
{
  "event": "timeout",
  "status": "AWAITING_DEPOSIT",
  "invoice": { "...": "..." },
  "observedAt": "2026-02-20T00:15:00Z",
  "timeoutSeconds": 900
}
```

## Human Mode
When `--human` is provided, output is concise text intended for terminal usage, not contract-stable machine parsing.
