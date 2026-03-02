# Install

## Quick Install (npm)

```bash
npm i -g weave-cash-cli
```

## Install A Specific Version

```bash
npm i -g weave-cash-cli@0.1.0
```

## Verify Install

```bash
weave --help
```

## Uninstall

```bash
npm uninstall -g weave-cash-cli
```

## Troubleshooting

### `weave: command not found`

Ensure your npm global bin path is in `PATH`:

```bash
npm bin -g
```

Then add that directory to your shell profile and restart your shell.

### Unsupported OS/arch

Current release targets:

- macOS: `amd64`, `arm64`
- Linux: `amd64`, `arm64`
