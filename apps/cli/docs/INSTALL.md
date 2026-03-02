# Install

## Quick Install (Go, preferred)

```bash
go install github.com/AryanJ-NYC/weave-cash/apps/cli/cmd/weave@latest
```

## Fallback Install (npm)

```bash
npm i -g weave-cash-cli
```

## Install A Specific Version

Go:

```bash
go install github.com/AryanJ-NYC/weave-cash/apps/cli/cmd/weave@v0.1.0
```

npm:

```bash
npm i -g weave-cash-cli@0.1.0
```

## Verify Install

```bash
weave --help
```

## Uninstall

Go install:

```bash
rm -f "$(go env GOPATH)/bin/weave"
```

npm install:

```bash
npm uninstall -g weave-cash-cli
```

## Troubleshooting

### `weave: command not found`

For Go installs, ensure `$(go env GOPATH)/bin` is in `PATH`.

For npm installs, ensure your npm global bin path is in `PATH`:

```bash
npm bin -g
```

Then add that directory to your shell profile and restart your shell.

### Unsupported OS/arch

- Go install builds for host platforms supported by the local Go toolchain.
- npm package bundles binaries for:

- macOS: `amd64`, `arm64`
- Linux: `amd64`, `arm64`
