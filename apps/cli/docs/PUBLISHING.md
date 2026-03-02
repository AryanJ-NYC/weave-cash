# Publishing

This document describes how to publish `weave` and distribute it through npm as `weave-cash-cli`.

## Release Model

- Local publish script builds platform archives, stages `packages/weave-cash-cli/vendor/*`, and publishes `weave-cash-cli` directly to npm (no git tag required).
- GoReleaser-based GitHub Releases are still available for tag-driven CI releases.
- Users install with:

```bash
npm i -g weave-cash-cli
```

## Files In This Repo

- GoReleaser config: `/Users/aryanjabbari/Documents/projects/weave-cash/.goreleaser.yaml`
- Release workflow: `/Users/aryanjabbari/Documents/projects/weave-cash/.github/workflows/release-cli.yml`
- npm package: `/Users/aryanjabbari/Documents/projects/weave-cash/packages/weave-cash-cli`
- npm package staging script: `/Users/aryanjabbari/Documents/projects/weave-cash/apps/cli/scripts/stage-npm-package.sh`
- local npm publish script: `/Users/aryanjabbari/Documents/projects/weave-cash/apps/cli/scripts/publish-npm-local.sh`
- Install guide: `/Users/aryanjabbari/Documents/projects/weave-cash/apps/cli/docs/INSTALL.md`

## One-Time Setup

1. Ensure npm auth exists on your machine:

```bash
npm login
```

2. Ensure CLI is publish-ready:

```bash
pnpm --filter cli test
pnpm --filter cli build
```

## Publish Locally Without A Tag

Run from repo root:

```bash
bash apps/cli/scripts/publish-npm-local.sh --dry-run 0.1.0
```

Then publish:

```bash
bash apps/cli/scripts/publish-npm-local.sh 0.1.0
```

What this script does:

1. Generates CLI token map.
2. Builds darwin/linux binaries for amd64/arm64.
3. Stages binaries into a temporary npm package copy.
4. Publishes `weave-cash-cli` from that temporary directory.

No git tag is created.

## CI Tag-Driven Release (Optional)

If you want GitHub Releases + npm publish from CI, use `.github/workflows/release-cli.yml`.

### 1) Create and push a semver tag

```bash
git tag v0.1.0
git push origin v0.1.0
```

### 2) What the workflow does

1. Trigger: tag push matching `v*` (or manual dispatch with `version` input)
2. Runs GoReleaser with `.goreleaser.yaml`
3. Stages npm package binaries from `dist/`
4. Publishes `weave-cash-cli` to npm

## NPM Package Behavior Contract

`weave-cash-cli` includes:

1. Node launcher (`bin/weave.js`)
2. Bundled binaries for:
   - `darwin-amd64`
   - `darwin-arm64`
   - `linux-amd64`
   - `linux-arm64`

The launcher selects the matching bundled binary and forwards all CLI args.

## Troubleshooting

### Local publish fails with npm auth

- Run `npm whoami` and confirm it prints your npm username.
- Run `npm login` if needed.

### npm publish fails

- Confirm package name `weave-cash-cli` is available and not blocked.
- Confirm version is incremented and unpublished.
- Confirm staged package version was set correctly (for example `v0.1.0` -> `0.1.0`).

### Staging script fails to find release assets

- Confirm release artifacts include:
  - `weave_<version>_darwin_amd64.tar.gz`
  - `weave_<version>_darwin_arm64.tar.gz`
  - `weave_<version>_linux_amd64.tar.gz`
  - `weave_<version>_linux_arm64.tar.gz`
- Confirm version format is `X.Y.Z` or `vX.Y.Z`.

## Notes

- Binary name is `weave`.
- GoReleaser currently builds darwin/linux for amd64/arm64.
