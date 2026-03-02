#!/usr/bin/env bash
set -euo pipefail

print_usage() {
  cat <<'EOF'
Usage:
  bash apps/cli/scripts/stage-npm-package.sh <version> [dist_dir] [package_dir]

Examples:
  bash apps/cli/scripts/stage-npm-package.sh v0.1.4
  bash apps/cli/scripts/stage-npm-package.sh 0.1.4 dist packages/weave-cash-cli

Defaults:
  dist_dir    dist
  package_dir packages/weave-cash-cli
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  print_usage
  exit 0
fi

if [[ $# -lt 1 || $# -gt 3 ]]; then
  print_usage
  exit 1
fi

version_input="$1"
dist_dir="${2:-dist}"
package_dir="${3:-packages/weave-cash-cli}"

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd -- "${script_dir}/../../.." && pwd)"
if [[ "${dist_dir}" = /* ]]; then
  dist_path="${dist_dir}"
else
  dist_path="${repo_root}/${dist_dir}"
fi

if [[ "${package_dir}" = /* ]]; then
  package_path="${package_dir}"
else
  package_path="${repo_root}/${package_dir}"
fi
release_version="${version_input#v}"

if [[ ! "${release_version}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Error: version must be semver (for example 0.1.4 or v0.1.4)." >&2
  exit 1
fi

if [[ ! -d "${dist_path}" ]]; then
  echo "Error: dist directory not found: ${dist_path}" >&2
  exit 1
fi

if [[ ! -f "${package_path}/package.json" ]]; then
  echo "Error: package.json not found in ${package_path}" >&2
  exit 1
fi

if ! command -v tar >/dev/null 2>&1; then
  echo "Error: tar is required." >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Error: node is required to update package.json version." >&2
  exit 1
fi

tmp_dir="$(mktemp -d)"
trap 'rm -rf "${tmp_dir}"' EXIT

rm -rf "${package_path}/vendor"
mkdir -p "${package_path}/vendor"

stage_binary() {
  local archive_suffix="$1"
  local vendor_subdir="$2"
  local archive_name="weave_${release_version}_${archive_suffix}.tar.gz"
  local archive_file="${dist_path}/${archive_name}"
  local unpack_dir="${tmp_dir}/${archive_suffix}"
  local binary_file
  local target_dir="${package_path}/vendor/${vendor_subdir}"

  if [[ ! -f "${archive_file}" ]]; then
    echo "Error: expected archive not found: ${archive_file}" >&2
    exit 1
  fi

  mkdir -p "${unpack_dir}" "${target_dir}"
  tar -xzf "${archive_file}" -C "${unpack_dir}"

  binary_file="$(find "${unpack_dir}" -type f -name weave | head -n 1 || true)"
  if [[ -z "${binary_file}" ]]; then
    echo "Error: weave binary not found after extracting ${archive_name}" >&2
    exit 1
  fi

  install -m 0755 "${binary_file}" "${target_dir}/weave"
}

stage_binary "darwin_amd64" "darwin-amd64"
stage_binary "darwin_arm64" "darwin-arm64"
stage_binary "linux_amd64" "linux-amd64"
stage_binary "linux_arm64" "linux-arm64"

node -e '
const fs = require("node:fs");
const filePath = process.argv[1];
const version = process.argv[2];
const pkg = JSON.parse(fs.readFileSync(filePath, "utf8"));
pkg.version = version;
fs.writeFileSync(filePath, `${JSON.stringify(pkg, null, 2)}\n`);
' "${package_path}/package.json" "${release_version}"

echo "Staged weave-cash-cli package:"
echo "  version: ${release_version}"
echo "  dist: ${dist_path}"
echo "  package: ${package_path}"
