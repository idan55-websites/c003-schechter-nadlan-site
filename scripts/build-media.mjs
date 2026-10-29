// Derives optimized web media from the recovered originals.
// Usage: npm run media            (skips outputs that already exist)
//        npm run media -- --force (rebuilds everything)
import sharp from 'sharp';
import ffmpeg from 'ffmpeg-static';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {images, emblems, clips, film} from './media.config.mjs';
import {buildIcons} from './build-icons.mjs';

const root = path.resolve(import.meta.dirname, '..');
const originals = path.join(root, 'recovery/wp-originals');
const out = path.join(root, 'public/media');
const force = process.argv.includes('--force');
const refreshNames = new Set(process.argv.filter(a => a.startsWith('--refresh=')).flatMap(a => a.slice(10).split(',')));
const WIDTHS = [480, 800, 1200, 1600, 2400, 3200, 3840];
const manifestPath = path.join(root, 'src/data/media.json');
const previous = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
const resolve = src => src.startsWith('prev:') ? path.join(root, 'recovery/previous-build-images', src.slice(5)) : path.join(originals, src);
const fresh = file => !force && fs.existsSync(file);
for (const dir of ['img', 'brand', 'video']) fs.mkdirSync(path.join(out, dir), {recursive: true});

const hex = ({r, g, b}) => '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
const manifest = {};

for (const [name, {src, kind, alpha}] of Object.entries(images)) {
  const file = resolve(src);
  const meta = await sharp(file).metadata();
  const sourceHash = createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  const changed = refreshNames.has(name) || (previous[name]?.sourceHash && previous[name].sourceHash !== sourceHash);
  const {dominant} = await sharp(file).stats();
  // Never upscale: the largest variant is the source width.
  const widths = [...new Set(WIDTHS.filter(w => w < meta.width).concat(Math.min(meta.width, 3840)))];
  for (const w of widths) {
    const base = path.join(out, 'img', `${name}-${w}`);
    const pipeline = () => sharp(file).rotate().resize({width: w, withoutEnlargement: true})[alpha ? 'ensureAlpha' : 'flatten'](alpha ? 1 : {background: '#ffffff'});
    if (changed || !fresh(`${base}.avif`)) await pipeline().avif({quality: 52, effort: 6}).toFile(`${base}.avif`);
    if (changed || !fresh(`${base}.webp`)) await pipeline().webp({quality: 76, effort: 6}).toFile(`${base}.webp`);
  }
  const width = Math.min(meta.width, 3840);
  manifest[name] = {w: width, h: Math.round(meta.height * width / meta.width), widths, kind, color: alpha ? 'transparent' : hex(dominant), sourceHash};
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest));
console.log(`images: ${Object.keys(manifest).length}`);
if (process.argv.includes('--images-only')) process.exit(0);

// Brand: original logo (dark and white), and the S mark converted to an alpha mask.
const brand = (name, file, width) => sharp(path.join(originals, file)).resize({width, withoutEnlargement: true});
// Highest-resolution logo files, from the client's local copy of the 2022 uploads folder.
await brand('logo-dark', 'local-2022/logo-dark-1019.png', 720).png({compressionLevel: 9}).toFile(path.join(out, 'brand/logo-dark.png'));
await brand('logo-light', 'local-2022/logo-light-489.png', 489).png({compressionLevel: 9}).toFile(path.join(out, 'brand/logo-light.png'));
// 3658 is a white S on a graphite field: luminance becomes alpha, so CSS can tint it.
{
  const {data, info} = await sharp(path.join(originals, 'media/3658.png')).flatten({background: '#404040'}).greyscale().raw().toBuffer({resolveWithObject: true});
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const a = Math.max(0, Math.min(255, (data[i] - 64) * 255 / (255 - 64)));
    rgba[i * 4] = rgba[i * 4 + 1] = rgba[i * 4 + 2] = 255; rgba[i * 4 + 3] = a;
  }
  const mark = sharp(rgba, {raw: {width: info.width, height: info.height, channels: 4}}).trim();
  await mark.clone().png({compressionLevel: 9}).toFile(path.join(out, 'brand/s-mark.png'));
  await buildIcons();
}
for (const [name, file] of Object.entries(emblems)) {
  const target = path.join(out, 'brand', `emblem-${name}.webp`);
  if (!fresh(target)) await sharp(path.join(originals, file)).trim().resize({height: 400, withoutEnlargement: true}).webp({quality: 88, alphaQuality: 90}).toFile(target);
}
// Social sharing card: original Galil Yam rendering with the original white logo.
{
  const cover = await sharp(path.join(originals, 'media/960.jpg')).resize(1200, 630, {fit: 'cover', position: 'attention'}).modulate({brightness: .82}).toBuffer();
  const shade = Buffer.from('<svg width="1200" height="630"><defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#0f1314" stop-opacity=".88"/><stop offset=".6" stop-color="#0f1314" stop-opacity="0"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>');
  const logo = await sharp(path.join(originals, 'local-2022/logo-light-489.png')).resize({width: 380}).png().toBuffer();
  await sharp(cover).composite([{input: shade}, {input: logo, left: 760, top: 500}]).jpeg({quality: 84, mozjpeg: true}).toFile(path.join(root, 'public/og-image.jpg'));
}
console.log('brand: done');

// Video: H.264 (universal) + VP9 WebM, muted, faststart, with posters.
const run = args => execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], {stdio: 'inherit'});
// maxrate caps the bitrate of the noisy aerial footage; VP9 targets ~25% below the H.264 cap.
function encode(input, name, filter, {crf264 = 23, crf9 = 35, maxrate = 3000} = {}) {
  const base = path.join(out, 'video', name);
  if (!fresh(`${base}.mp4`)) run(['-i', input, '-an', '-vf', filter, '-c:v', 'libx264', '-preset', 'slower', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', String(crf264), '-maxrate', `${maxrate}k`, '-bufsize', `${maxrate * 2}k`, '-movflags', '+faststart', `${base}.mp4`]);
  if (!fresh(`${base}.webm`)) run(['-i', input, '-an', '-vf', filter, '-c:v', 'libvpx-vp9', '-crf', String(crf9), '-b:v', `${Math.round(maxrate * .75)}k`, '-maxrate', `${maxrate}k`, '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', `${base}.webm`]);
}
async function poster(input, name, at, filter) {
  const tmp = path.join(out, 'video', `${name}.png`);
  run(['-ss', String(at), '-i', input, '-frames:v', '1', '-vf', filter, tmp]);
  await sharp(tmp).avif({quality: 55}).toFile(path.join(out, 'video', `${name}.avif`));
  await sharp(tmp).webp({quality: 78}).toFile(path.join(out, 'video', `${name}.webp`));
  fs.rmSync(tmp);
}
const master = path.join(originals, film);
// Wide cinemascope film at native 1904 px, a 1280 px variant, and a centred 4:3 crop for phones.
encode(master, 'film-wide', 'scale=1904:-2,fps=25', {crf264: 25, crf9: 38, maxrate: 2200});
encode(master, 'film-1280', 'scale=1280:-2,fps=25', {crf264: 25, crf9: 38, maxrate: 1300});
encode(master, 'film-mobile', 'crop=840:630:(iw-840)/2:0,scale=720:540,fps=25', {crf264: 26, crf9: 40, maxrate: 650});
await poster(master, 'film-wide-poster', 0.6, 'scale=1904:-2');
await poster(master, 'film-mobile-poster', 0.6, 'crop=840:630:(iw-840)/2:0,scale=720:540');
for (const [name, file] of Object.entries(clips)) {
  const input = path.join(originals, file);
  encode(input, `location-${name}`, 'scale=640:640', {crf264: 26, crf9: 40, maxrate: 600});
  await poster(input, `location-${name}-poster`, 1.92, 'scale=640:640');
}
console.log('video: done');
