#!/usr/bin/env bash
set -euo pipefail

print_usage() {
  cat <<'EOF'
Usage:
  bash apps/cli/scripts/publish-npm-local.sh [--dry-run] <version>

Examples:
  bash apps/cli/scripts/publish-npm-local.sh 0.1.4
  bash apps/cli/scripts/publish-npm-local.sh v0.1.4
  bash apps/cli/scripts/publish-npm-local.sh --dry-run 0.1.4

Notes:
  - Publishes npm package "weave-cash-cli" without creating a git tag.
  - Builds darwin/linux binaries for amd64/arm64 locally, stages a temporary
    package, and publishes from that temporary directory.
EOF
}

dry_run=0
version_input=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      dry_run=1
      shift
      ;;
    -h|--help)
      print_usage
      exit 0
      ;;
    -*)
      echo "Error: unknown option: $1" >&2
      print_usage
      exit 1
      ;;
    *)
      if [[ -n "${version_input}" ]]; then
        echo "Error: version provided more than once." >&2
        print_usage
        exit 1
      fi
      version_input="$1"
      shift
      ;;
  esac
done

if [[ -z "${version_input}" ]]; then
  print_usage
  exit 1
fi

release_version="${version_input#v}"
if [[ ! "${release_version}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Error: version must be semver (for example 0.1.4 or v0.1.4)." >&2
  exit 1
fi

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd -- "${script_dir}/../../.." && pwd)"
stage_script="${repo_root}/apps/cli/scripts/stage-npm-package.sh"

require_cmd() {
  local cmd="$1"
  if ! command -v "${cmd}" >/dev/null 2>&1; then
    echo "Error: required command not found: ${cmd}" >&2
    exit 1
  fi
}

require_cmd go
require_cmd pnpm
require_cmd npm
require_cmd tar
require_cmd node
require_cmd bash

if [[ ! -x "${stage_script}" ]]; then
  echo "Error: staging script not found or not executable: ${stage_script}" >&2
  exit 1
fi

tmp_root="$(mktemp -d)"
trap 'rm -rf "${tmp_root}"' EXIT

dist_dir="${tmp_root}/dist"
pkg_workdir="${tmp_root}/weave-cash-cli"
npm_cache_dir="${tmp_root}/npm-cache"
mkdir -p "${dist_dir}" "${pkg_workdir}" "${npm_cache_dir}"

if [[ "${dry_run}" == "0" ]]; then
  if ! NPM_CONFIG_CACHE="${npm_cache_dir}" npm whoami >/dev/null 2>&1; then
    echo "Error: npm auth not detected. Run 'npm login' first." >&2
    exit 1
  fi
fi

echo "Step 1/5: Generate CLI token map"
(cd "${repo_root}" && pnpm --filter @repo/invoice-config generate:cli)

build_archive() {
  local goos="$1"
  local goarch="$2"
  local suffix="${goos}_${goarch}"
  local build_dir="${tmp_root}/build/${suffix}"
  local archive_path="${dist_dir}/weave_${release_version}_${suffix}.tar.gz"

  mkdir -p "${build_dir}"

  (
    cd "${repo_root}/apps/cli"
    mkdir -p .cache/go-build .cache/go-mod
    GOCACHE="$(pwd)/.cache/go-build" \
    GOMODCACHE="$(pwd)/.cache/go-mod" \
    CGO_ENABLED=0 \
    GOOS="${goos}" \
    GOARCH="${goarch}" \
    go build -buildvcs=false -o "${build_dir}/weave" ./cmd/weave
  )

  tar -czf "${archive_path}" -C "${build_dir}" weave
}

echo "Step 2/5: Build release archives"
build_archive "darwin" "amd64"
build_archive "darwin" "arm64"
build_archive "linux" "amd64"
build_archive "linux" "arm64"

echo "Step 3/5: Prepare temporary npm package"
cp -R "${repo_root}/packages/weave-cash-cli/." "${pkg_workdir}/"

echo "Step 4/5: Stage binaries into npm package"
bash "${stage_script}" "${release_version}" "${dist_dir}" "${pkg_workdir}"

echo "Step 5/5: Publish npm package"
if [[ "${dry_run}" == "1" ]]; then
  (
    cd "${pkg_workdir}"
    NPM_CONFIG_CACHE="${npm_cache_dir}" npm publish --access public --dry-run
  )
  echo "Dry run complete. No package was published."
else
  (
    cd "${pkg_workdir}"
    NPM_CONFIG_CACHE="${npm_cache_dir}" npm publish --access public
  )
  echo "Published weave-cash-cli@${release_version} to npm."
fi
