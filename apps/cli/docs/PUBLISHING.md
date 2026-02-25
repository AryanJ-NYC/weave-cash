# Publishing

This document describes how to publish `weave` and distribute it via a hosted install script.

## Release Model

- Release artifacts are created by GoReleaser.
- GitHub Releases are published from `AryanJ-NYC/weave-cash`.
- Users install with:

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://www.weavecash.com/install.sh | bash
```

- Installer script location in this repo: `/Users/aryanjabbari/Documents/projects/weave-cash/apps/web/public/install.sh`

## Files In This Repo

- GoReleaser config: `/Users/aryanjabbari/Documents/projects/weave-cash/.goreleaser.yaml`
- Release workflow: `/Users/aryanjabbari/Documents/projects/weave-cash/.github/workflows/release-cli.yml`
- Installer script: `/Users/aryanjabbari/Documents/projects/weave-cash/apps/web/public/install.sh`
- Install guide: `/Users/aryanjabbari/Documents/projects/weave-cash/apps/cli/docs/INSTALL.md`

## One-Time Setup

### 1) Ensure installer is deployed from web app

`install.sh` must be reachable at:

- `https://www.weavecash.com/install.sh`

Because the script lives in `apps/web/public/install.sh`, it will be served at `/install.sh` by Next.js after deployment.

### 2) Ensure CLI is release-ready

From repo root:

```bash
pnpm --filter cli test
pnpm --filter cli build
```

## Publishing A Release

### 1) Create and push a semver tag

From repo root:

```bash
git tag v0.1.0
git push origin v0.1.0
```

### 2) What the workflow does

Workflow: `.github/workflows/release-cli.yml`

- Trigger: tag push matching `v*`
- Runs GoReleaser with `.goreleaser.yaml`
- Publishes archives and `checksums.txt` to the GitHub Release

## Installer Behavior Contract

`install.sh` performs these steps:

1. Resolves version (`WEAVE_VERSION` override or latest GitHub release tag)
2. Detects OS/arch (`darwin|linux` + `amd64|arm64`)
3. Downloads matching tarball and `checksums.txt`
4. Verifies SHA-256 checksum
5. Installs binary to `WEAVE_INSTALL_DIR`, `/usr/local/bin`, or `$HOME/.local/bin`

## Dry-Run Before Tagging (Optional)

If `goreleaser` is installed locally:

```bash
goreleaser release --snapshot --clean --config .goreleaser.yaml
```

This validates packaging locally without publishing a real release.

## Troubleshooting

### Tag pushed but no release

- Confirm tag matches `v*` pattern.
- Confirm workflow run started in Actions tab.

### Installer fails to find release assets

- Confirm release artifacts include expected names:
  - `weave_<version>_darwin_amd64.tar.gz`
  - `weave_<version>_darwin_arm64.tar.gz`
  - `weave_<version>_linux_amd64.tar.gz`
  - `weave_<version>_linux_arm64.tar.gz`
  - `checksums.txt`
- Confirm release tag format is `vX.Y.Z`.

### `install.sh` URL is not reachable

- Confirm latest web deployment includes `/public/install.sh`.
- Visit `https://www.weavecash.com/install.sh` directly and verify it returns script text.

## Notes

- Binary name is `weave`.
- GoReleaser currently builds darwin/linux for amd64/arm64.
