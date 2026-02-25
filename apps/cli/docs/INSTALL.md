# Install

## Quick Install (Latest)

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://www.weavecash.com/install.sh | bash
```

## Install A Specific Version

```bash
WEAVE_VERSION=v0.1.0 curl -fsSL --proto '=https' --tlsv1.2 https://www.weavecash.com/install.sh | bash
```

Version values without `v` also work (for example `0.1.0`).

## Custom Install Directory

```bash
WEAVE_INSTALL_DIR="$HOME/bin" curl -fsSL --proto '=https' --tlsv1.2 https://www.weavecash.com/install.sh | bash
```

Default install directory resolution:

1. `/usr/local/bin` if writable
2. `$HOME/.local/bin` otherwise

## Verify Install

```bash
weave --help
```

## Safe/Inspectable Install Flow

```bash
curl -fsSL --proto '=https' --tlsv1.2 -o /tmp/weave-install.sh https://www.weavecash.com/install.sh
less /tmp/weave-install.sh
bash /tmp/weave-install.sh
```

## Uninstall

Delete the binary from where it was installed:

```bash
rm -f /usr/local/bin/weave
# or
rm -f "$HOME/.local/bin/weave"
# or your custom WEAVE_INSTALL_DIR path
```

## Troubleshooting

### `weave: command not found`

Add install directory to PATH. Example:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

Then restart your shell.

### Unsupported OS/arch

Current release targets:

- macOS: `amd64`, `arm64`
- Linux: `amd64`, `arm64`
