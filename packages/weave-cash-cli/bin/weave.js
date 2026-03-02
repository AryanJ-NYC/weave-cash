#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const BINARY_NAME = 'weave';

const PLATFORM_MAP = {
  darwin: 'darwin',
  linux: 'linux',
};

const ARCH_MAP = {
  x64: 'amd64',
  arm64: 'arm64',
};

function main() {
  const platform = PLATFORM_MAP[process.platform];
  const arch = ARCH_MAP[process.arch];

  if (!platform || !arch) {
    fail(
      `Unsupported platform/arch: ${process.platform}/${process.arch}. ` +
        'Supported: darwin/linux + x64/arm64.'
    );
  }

  const binaryPath = path.join(
    __dirname,
    '..',
    'vendor',
    `${platform}-${arch}`,
    BINARY_NAME
  );

  ensureReadable(binaryPath);

  const result = spawnSync(binaryPath, process.argv.slice(2), {
    stdio: 'inherit',
    env: process.env,
  });

  if (result.error) {
    fail(`Failed to run bundled binary: ${result.error.message}`);
  }

  if (typeof result.status === 'number') {
    process.exit(result.status);
  }

  process.exit(1);
}

function ensureReadable(binaryPath) {
  try {
    fs.accessSync(binaryPath, fs.constants.R_OK | fs.constants.X_OK);
  } catch {
    fail(
      `Bundled binary not found or not executable at ${binaryPath}. ` +
        'Try reinstalling weave-cash-cli.'
    );
  }
}

function fail(message) {
  console.error(`[weave-cash-cli] ${message}`);
  process.exit(1);
}

main();
