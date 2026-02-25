import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';

const thisFilePath = fileURLToPath(import.meta.url);
const thisDirPath = path.dirname(thisFilePath);
const installScriptPath = path.join(thisDirPath, 'install.sh');

describe('install.sh', () => {
  it('resolves latest release without requiring GITHUB_TOKEN', () => {
    const tempDirPath = mkdtempSync(path.join(tmpdir(), 'weave-install-test-'));
    const binDirPath = path.join(tempDirPath, 'bin');
    mkdirSync(binDirPath, { recursive: true });

    const curlPath = path.join(binDirPath, 'curl');
    writeFileSync(
      curlPath,
      '#!/usr/bin/env bash\ncat <<\'JSON\'\n{\n  "tag_name": "v9.9.9"\n}\nJSON\n'
    );
    chmodSync(curlPath, 0o755);

    const tarPath = path.join(binDirPath, 'tar');
    writeFileSync(tarPath, '#!/usr/bin/env bash\nexit 0\n');
    chmodSync(tarPath, 0o755);

    const result = spawnSync('bash', [installScriptPath], {
      env: {
        ...process.env,
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        PATH: `${binDirPath}:${process.env.PATH ?? ''}`,
        WEAVE_INSTALL_DRY_RUN: '1',
      },
      encoding: 'utf8',
    });

    rmSync(tempDirPath, { recursive: true, force: true });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('[weave-install] resolved version: v9.9.9');
  });

  it('installs successfully without exit trap unbound-variable errors', () => {
    const tempDirPath = mkdtempSync(path.join(tmpdir(), 'weave-install-full-test-'));
    const binDirPath = path.join(tempDirPath, 'bin');
    const payloadDirPath = path.join(tempDirPath, 'payload');
    const installDirPath = path.join(tempDirPath, 'install-bin');
    mkdirSync(binDirPath, { recursive: true });
    mkdirSync(payloadDirPath, { recursive: true });
    mkdirSync(installDirPath, { recursive: true });

    const archiveName = 'weave_9.9.9_linux_amd64.tar.gz';
    const archivePath = path.join(tempDirPath, archiveName);
    const binaryPath = path.join(payloadDirPath, 'weave');
    writeFileSync(binaryPath, '#!/usr/bin/env bash\necho "weave test binary"\n');
    chmodSync(binaryPath, 0o755);

    const tarResult = spawnSync('tar', ['-czf', archivePath, '-C', payloadDirPath, 'weave'], {
      encoding: 'utf8',
    });
    if (tarResult.status !== 0) {
      rmSync(tempDirPath, { recursive: true, force: true });
      throw new Error(`failed to create test archive: ${tarResult.stderr}`);
    }

    const archiveChecksum = createHash('sha256')
      .update(readFileSync(archivePath))
      .digest('hex');

    const curlPath = path.join(binDirPath, 'curl');
    writeFileSync(
      curlPath,
      `#!/usr/bin/env bash
set -euo pipefail
output=""
url=""
while [[ "$#" -gt 0 ]]; do
  case "$1" in
    -o)
      output="$2"
      shift 2
      ;;
    *)
      url="$1"
      shift
      ;;
  esac
done
if [[ "$url" == *"/releases/latest" ]]; then
  cat <<'JSON'
{
  "tag_name": "v9.9.9"
}
JSON
  exit 0
fi
if [[ "$url" == *"/checksums.txt" ]]; then
  printf '%s  %s\\n' "$WEAVE_TEST_ARCHIVE_SHA" "$WEAVE_TEST_ARCHIVE_NAME" > "$output"
  exit 0
fi
if [[ "$url" == *".tar.gz" ]]; then
  cp "$WEAVE_TEST_ARCHIVE_PATH" "$output"
  exit 0
fi
echo "unexpected url: $url" >&2
exit 1
`
    );
    chmodSync(curlPath, 0o755);

    const unamePath = path.join(binDirPath, 'uname');
    writeFileSync(
      unamePath,
      '#!/usr/bin/env bash\nif [[ "$1" == "-s" ]]; then echo "Linux"; exit 0; fi\nif [[ "$1" == "-m" ]]; then echo "x86_64"; exit 0; fi\necho "Linux"\n'
    );
    chmodSync(unamePath, 0o755);

    const result = spawnSync('bash', [installScriptPath], {
      env: {
        ...process.env,
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        PATH: `${binDirPath}:${process.env.PATH ?? ''}`,
        WEAVE_INSTALL_DIR: installDirPath,
        WEAVE_TEST_ARCHIVE_NAME: archiveName,
        WEAVE_TEST_ARCHIVE_PATH: archivePath,
        WEAVE_TEST_ARCHIVE_SHA: archiveChecksum,
      },
      encoding: 'utf8',
    });

    const installedBinaryPath = path.join(installDirPath, 'weave');
    const installedBinaryExists = existsSync(installedBinaryPath);

    rmSync(tempDirPath, { recursive: true, force: true });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('[weave-install] installed weave to');
    expect(result.stderr).not.toContain('unbound variable');
    expect(installedBinaryExists).toBe(true);
  });
});
