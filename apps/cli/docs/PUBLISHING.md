# Publishing

This document describes how to publish `weave` and distribute it through npm as `weave-cash-cli`.

## Release Model

- GoReleaser builds release archives and publishes GitHub Releases from `AryanJ-NYC/weave-cash`.
- The CLI release workflow stages platform binaries into `packages/weave-cash-cli/vendor/*`.
- The workflow publishes `weave-cash-cli` to npm.
- Users install with:

```bash
npm i -g weave-cash-cli
```

## Files In This Repo

- GoReleaser config: `/Users/aryanjabbari/Documents/projects/weave-cash/.goreleaser.yaml`
- Release workflow: `/Users/aryanjabbari/Documents/projects/weave-cash/.github/workflows/release-cli.yml`
- npm package: `/Users/aryanjabbari/Documents/projects/weave-cash/packages/weave-cash-cli`
- npm package staging script: `/Users/aryanjabbari/Documents/projects/weave-cash/apps/cli/scripts/stage-npm-package.sh`
- Install guide: `/Users/aryanjabbari/Documents/projects/weave-cash/apps/cli/docs/INSTALL.md`

## One-Time Setup

1. Add npm publish token:

- Repository secret: `NPM_TOKEN`
- Token must have permission to publish `weave-cash-cli`.

2. Ensure CLI is release-ready:

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

- Trigger: tag push matching `v*` (or manual dispatch with `version` input)
- Runs GoReleaser with `.goreleaser.yaml`
- Stages npm package binaries from `dist/`
- Publishes `weave-cash-cli` to npm

## NPM Package Behavior Contract

`weave-cash-cli` includes:

1. Node launcher (`bin/weave.js`)
2. Bundled binaries for:
   - `darwin-amd64`
   - `darwin-arm64`
   - `linux-amd64`
   - `linux-arm64`

The launcher selects the matching bundled binary and forwards all CLI args.

## Dry-Run Before Tagging (Optional)

If `goreleaser` is installed locally:

```bash
goreleaser release --snapshot --clean --config .goreleaser.yaml
```

Then stage package artifacts locally:

```bash
bash apps/cli/scripts/stage-npm-package.sh v0.1.0
```

## Troubleshooting

### Tag pushed but no release

- Confirm tag matches `v*` pattern.
- Confirm workflow run started in Actions tab.

### npm publish fails

- Confirm `NPM_TOKEN` is present and valid.
- Confirm package name `weave-cash-cli` is available and not blocked.
- Confirm staged package version was set correctly from tag (for example `v0.1.0` -> `0.1.0`).

### Staging script fails to find release assets

- Confirm release artifacts include:
  - `weave_<version>_darwin_amd64.tar.gz`
  - `weave_<version>_darwin_arm64.tar.gz`
  - `weave_<version>_linux_amd64.tar.gz`
  - `weave_<version>_linux_arm64.tar.gz`
- Confirm release tag format is `vX.Y.Z`.

## Notes

- Binary name is `weave`.
- GoReleaser currently builds darwin/linux for amd64/arm64.
