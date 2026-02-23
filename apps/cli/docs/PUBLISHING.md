# Publishing

This document describes how to publish `weave` releases and install via Homebrew.

## Release Model

- Release artifacts are created by GoReleaser.
- GitHub Releases are published from this repo (`AryanJ-NYC/weave-cash`).
- Homebrew formula updates are pushed to tap repo (`AryanJ-NYC/homebrew-tap`).

## Files In This Repo

- GoReleaser config: `/Users/aryanjabbari/Documents/projects/weave-cash/.goreleaser.yaml`
- Release workflow: `/Users/aryanjabbari/Documents/projects/weave-cash/.github/workflows/release-cli.yml`

## One-Time Setup

### 1) Create Homebrew tap repository

Create: `https://github.com/AryanJ-NYC/homebrew-tap`

Expected layout in tap repo after first release:

```text
homebrew-tap/
  Formula/
    weave.rb
```

### 2) Add GitHub Actions secret

In `AryanJ-NYC/weave-cash` repo settings:

- Secret name: `HOMEBREW_TAP_GITHUB_TOKEN`
- Value: a PAT that can push to `AryanJ-NYC/homebrew-tap`

Recommended token permissions:

- Repository contents: Read and write (for tap repo)

### 3) Ensure CLI is release-ready

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
- Publishes binaries/checksums to GitHub Release
- Commits/updates `Formula/weave.rb` in `AryanJ-NYC/homebrew-tap`

## Install Via Homebrew

```bash
brew tap AryanJ-NYC/tap
brew install weave
weave --help
```

Upgrade:

```bash
brew update
brew upgrade weave
```

## Dry-Run Before Tagging (Optional)

If `goreleaser` is installed locally:

```bash
goreleaser release --snapshot --clean --config .goreleaser.yaml
```

This validates packaging locally without publishing a real release.

## Troubleshooting

### Homebrew formula not updated

- Verify `HOMEBREW_TAP_GITHUB_TOKEN` exists and has write access to tap repo.
- Check release workflow logs for GoReleaser brew publishing errors.

### Tag pushed but no release

- Confirm tag matches `v*` pattern.
- Confirm workflow run started in Actions tab.

### `brew install weave` fails

- Run `brew update`.
- Confirm tap is added: `brew tap` should include `AryanJ-NYC/tap`.
- Confirm latest formula exists in tap repo: `Formula/weave.rb`.

## Notes

- Binary name is `weave`.
- GoReleaser currently builds darwin/linux for amd64/arm64.
- If formula name collisions appear in wider ecosystems, migrate name in `.goreleaser.yaml` and docs together.
