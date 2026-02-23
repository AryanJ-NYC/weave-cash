# Errors And Exit Codes

## Exit Codes
| Code | Meaning |
|---|---|
| `0` | Success. In `status --watch`, any terminal status (`COMPLETED`, `FAILED`, `REFUNDED`, `EXPIRED`) |
| `1` | Command, validation, API, or network failure |
| `2` | `status --watch` timed out before terminal status |

## Error Output Shape
Errors are emitted as JSON objects to stderr.

Common shape:

```json
{
  "error": "message"
}
```

API-derived shape:

```json
{
  "error": "api message",
  "status": 409,
  "details": {
    "error": "Invoice is not in PENDING status"
  }
}
```

Watch-timeout shape:

```json
{
  "error": "status watch timed out",
  "status": "AWAITING_DEPOSIT",
  "timeoutSeconds": 900
}
```

## Local Validation Failures
The CLI fails before network calls for:
- Missing required flags.
- Empty `--api-url`.
- Unsupported `--receive-token`.
- Missing `--receive-network` for multi-network receive tokens.
- Invalid receive token/network combinations.

## API Failure Handling
When API returns non-2xx:
- CLI preserves HTTP status in error JSON (`status`).
- CLI includes decoded API payload in `details` when JSON is parseable.
- CLI exits with code `1`.
