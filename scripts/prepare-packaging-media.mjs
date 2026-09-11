import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const input = process.argv[2];
if (!input) throw new Error('Usage: node scripts/prepare-packaging-media.mjs <source-directory>');
const ffmpeg = resolve('studio/node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
const output = resolve('public/media/paketleme');
const temporary = resolve('tmp/home-refresh');
mkdirSync(output, { recursive: true });
mkdirSync(temporary, { recursive: true });

for (const clip of [
  { source: 'pomelli_photoshoot_video_9_16_0902 (2).mp4', name: 'novella-kutu', crop: '720:900:0:190' },
  // The decorative handwritten envelope below the box is outside this crop.
  { source: 'pomelli_photoshoot_video_9_16_0902 (3).mp4', name: 'novella-kutu-icerigi', crop: '720:900:0:0' },
]) {
  const video = resolve(output, `${clip.name}.mp4`);
  execFileSync(ffmpeg, ['-v', 'error', '-i', resolve(input, clip.source), '-an', '-vf', `crop=${clip.crop}`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '25', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-y', video]);
  const frame = resolve(temporary, `${clip.name}.png`);
  execFileSync(ffmpeg, ['-v', 'error', '-ss', '2', '-i', video, '-frames:v', '1', '-y', frame]);
  await sharp(frame).webp({ quality: 82 }).toFile(resolve(output, `${clip.name}.webp`));
  console.log(`Prepared ${clip.name}: 720x900, 8 seconds, H.264, faststart, WebP poster.`);
}
