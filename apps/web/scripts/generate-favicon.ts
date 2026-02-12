import sharp from 'sharp';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INPUT = resolve(__dirname, '../public/logo-no-name.png');
const FAVICON_OUT = resolve(__dirname, '../app/favicon.ico');
const ICON_OUT = resolve(__dirname, '../app/icon.png');

async function main() {
  await Promise.all([
    sharp(INPUT).resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(FAVICON_OUT),
    sharp(INPUT).resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(ICON_OUT),
  ]);

  console.log('Generated favicon.ico (48x48) and icon.png (192x192)');
}

main();
