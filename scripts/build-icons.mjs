// Generate every browser/search icon from the checked-in, original Schechter S.
// No WordPress archive or template favicon is needed for a regular build.
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import sharp from 'sharp';

const publicDir = path.resolve(import.meta.dirname, '../public');

export async function buildIcons() {
  const mark = await sharp(path.join(publicDir, 'media/brand/s-mark.png')).resize({height: 360}).png().toBuffer();
  const icon = async size => {
    const inner = await sharp(mark).resize({height: Math.round(size * .7)}).png().toBuffer();
    return sharp({create: {width: size, height: size, channels: 4, background: '#404040'}})
      .composite([{input: inner, gravity: 'center'}]).png().toBuffer();
  };
  for (const [size, filename] of [[32, 'favicon-32.png'], [96, 'favicon-96.png'], [180, 'apple-touch-icon.png'], [512, 'icon-512.png']]) {
    await fs.writeFile(path.join(publicDir, filename), await icon(size));
  }

  // ICO directory with embedded PNG frames, supported by modern browsers.
  const sizes = [16, 32, 48, 64];
  const frames = await Promise.all(sizes.map(icon));
  const directory = Buffer.alloc(6 + 16 * sizes.length);
  directory.writeUInt16LE(1, 2);
  directory.writeUInt16LE(sizes.length, 4);
  let offset = directory.length;
  frames.forEach((frame, i) => {
    const entry = 6 + i * 16;
    directory[entry] = directory[entry + 1] = sizes[i];
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(frame.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += frame.length;
  });
  await fs.writeFile(path.join(publicDir, 'favicon.ico'), Buffer.concat([directory, ...frames]));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await buildIcons();
  console.log('Browser and search icons: original Schechter S.');
}
