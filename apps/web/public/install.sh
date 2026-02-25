#!/usr/bin/env bash
set -euo pipefail

readonly OWNER="AryanJ-NYC"
readonly REPO="weave-cash"
readonly BINARY_NAME="weave"
readonly RELEASES_BASE_URL="https://github.com/${OWNER}/${REPO}/releases/download"
readonly LATEST_RELEASE_API_URL="https://api.github.com/repos/${OWNER}/${REPO}/releases/latest"

main() {
  require_command curl
  require_command tar

  local os
  local arch
  local version
  local install_dir
  local archive
  local archive_url
  local checksums_url
  local temp_dir
  local archive_path
  local checksums_path
  local extracted_binary

  os="$(detect_os)"
  arch="$(detect_arch)"
  version="$(resolve_version)"
  install_dir="$(resolve_install_dir)"

  archive="${BINARY_NAME}_${version#v}_${os}_${arch}.tar.gz"
  archive_url="${RELEASES_BASE_URL}/${version}/${archive}"
  checksums_url="${RELEASES_BASE_URL}/${version}/checksums.txt"

  if [[ "${WEAVE_INSTALL_DRY_RUN:-0}" == "1" ]]; then
    log_info "dry run mode"
    log_info "resolved version: ${version}"
    log_info "resolved os/arch: ${os}/${arch}"
    log_info "archive url: ${archive_url}"
    log_info "checksums url: ${checksums_url}"
    log_info "install dir: ${install_dir}"
    exit 0
  fi

  temp_dir="$(mktemp -d)"
  trap "rm -rf '${temp_dir}'" EXIT

  archive_path="${temp_dir}/${archive}"
  checksums_path="${temp_dir}/checksums.txt"

  log_info "downloading ${archive}"
  download_file "${archive_url}" "${archive_path}"

  log_info "downloading checksums"
  download_file "${checksums_url}" "${checksums_path}"

  log_info "verifying checksum"
  verify_checksum "${archive}" "${archive_path}" "${checksums_path}"

  tar -xzf "${archive_path}" -C "${temp_dir}"
  extracted_binary="$(find "${temp_dir}" -type f -name "${BINARY_NAME}" -perm -u+x | head -n 1 || true)"

  if [[ -z "${extracted_binary}" ]]; then
    fail "unable to find extracted ${BINARY_NAME} binary"
  fi

  mkdir -p "${install_dir}"
  install_binary "${extracted_binary}" "${install_dir}/${BINARY_NAME}"

  log_success "installed ${BINARY_NAME} to ${install_dir}/${BINARY_NAME}"
  print_path_hint "${install_dir}"
}

require_command() {
  local command_name="$1"
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    fail "missing required command: ${command_name}"
  fi
}

resolve_version() {
  if [[ -n "${WEAVE_VERSION:-}" ]]; then
    normalize_version "${WEAVE_VERSION}"
    return
  fi

  resolve_latest_version
}

normalize_version() {
  local version="$1"
  if [[ "${version}" == v* ]]; then
    echo "${version}"
  else
    echo "v${version}"
  fi
}

resolve_latest_version() {
  local response

  if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    response="$(curl -fsSL --proto '=https' --tlsv1.2 -H "Authorization: Bearer ${GITHUB_TOKEN}" "${LATEST_RELEASE_API_URL}")"
  else
    response="$(curl -fsSL --proto '=https' --tlsv1.2 "${LATEST_RELEASE_API_URL}")"
  fi

  local version
  version="$(printf '%s\n' "${response}" | sed -nE 's/^[[:space:]]*"tag_name"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/p' | head -n 1)"

  if [[ -z "${version}" ]]; then
    fail "failed to resolve latest release version"
  fi

  normalize_version "${version}"
}

resolve_install_dir() {
  if [[ -n "${WEAVE_INSTALL_DIR:-}" ]]; then
    echo "${WEAVE_INSTALL_DIR}"
    return
  fi

  if is_writable_directory "/usr/local/bin"; then
    echo "/usr/local/bin"
    return
  fi

  echo "${HOME}/.local/bin"
}

is_writable_directory() {
  local directory="$1"

  if [[ -d "${directory}" && -w "${directory}" ]]; then
    return 0
  fi

  local parent
  parent="$(dirname "${directory}")"
  [[ -d "${parent}" && -w "${parent}" ]]
}

detect_os() {
  case "$(uname -s)" in
    Darwin)
      echo "darwin"
      ;;
    Linux)
      echo "linux"
      ;;
    *)
      fail "unsupported operating system: $(uname -s)"
      ;;
  esac
}

detect_arch() {
  case "$(uname -m)" in
    x86_64 | amd64)
      echo "amd64"
      ;;
    arm64 | aarch64)
      echo "arm64"
      ;;
    *)
      fail "unsupported architecture: $(uname -m)"
      ;;
  esac
}

download_file() {
  local url="$1"
  local output_path="$2"

  curl -fsSL --proto '=https' --tlsv1.2 --retry 3 --retry-delay 1 --retry-connrefused -o "${output_path}" "${url}"
}

verify_checksum() {
  local archive_name="$1"
  local archive_path="$2"
  local checksums_path="$3"

  local expected_checksum
  expected_checksum="$(grep -E "[[:space:]]${archive_name}$" "${checksums_path}" | awk '{print $1}' | head -n 1)"

  if [[ -z "${expected_checksum}" ]]; then
    fail "failed to find checksum for ${archive_name}"
  fi

  local actual_checksum
  actual_checksum="$(sha256_file "${archive_path}")"

  if [[ "${actual_checksum}" != "${expected_checksum}" ]]; then
    fail "checksum verification failed for ${archive_name}"
  fi
}

sha256_file() {
  local file_path="$1"

  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "${file_path}" | awk '{print $1}'
    return
  fi

  if command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "${file_path}" | awk '{print $1}'
    return
  fi

  if command -v openssl >/dev/null 2>&1; then
    openssl dgst -sha256 "${file_path}" | awk '{print $NF}'
    return
  fi

  fail "no SHA-256 utility found (sha256sum, shasum, or openssl required)"
}

install_binary() {
  local source_path="$1"
  local destination_path="$2"

  if command -v install >/dev/null 2>&1; then
    install -m 0755 "${source_path}" "${destination_path}"
    return
  fi

  cp "${source_path}" "${destination_path}"
  chmod 0755 "${destination_path}"
}

print_path_hint() {
  local install_dir="$1"

  case ":${PATH}:" in
    *":${install_dir}:"*)
      return
      ;;
  esac

  cat <<HINT
Add ${install_dir} to PATH in your shell profile:
  export PATH="${install_dir}:\$PATH"
HINT
}

log_info() {
  echo "[weave-install] $*"
}

log_success() {
  echo "[weave-install] $*"
}

fail() {
  echo "[weave-install] error: $*" >&2
  exit 1
}

main "$@"
