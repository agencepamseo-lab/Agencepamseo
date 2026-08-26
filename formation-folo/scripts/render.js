// ---------------------------------------------------------------------------
// FOLO — Rendu d'un lot de slides en PNG 1920×1080 (exploitation vidéo)
// Usage : node scripts/render.js [lot]   (défaut : lot01)
// ---------------------------------------------------------------------------
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { W, H } from '../src/theme.js';

const SORA = (w) => readFileSync(`node_modules/@fontsource/sora/files/sora-latin-${w}-normal.woff`);
const INTER = (w) => readFileSync(`node_modules/@fontsource/inter/files/inter-latin-${w}-normal.woff`);

export const fonts = [
  { name: 'Sora', data: SORA(600), weight: 600, style: 'normal' },
  { name: 'Sora', data: SORA(700), weight: 700, style: 'normal' },
  { name: 'Sora', data: SORA(800), weight: 800, style: 'normal' },
  { name: 'Inter', data: INTER(400), weight: 400, style: 'normal' },
  { name: 'Inter', data: INTER(500), weight: 500, style: 'normal' },
  { name: 'Inter', data: INTER(600), weight: 600, style: 'normal' },
  { name: 'Inter', data: INTER(700), weight: 700, style: 'normal' },
];

export async function renderSlide(tree, outPath) {
  const svg = await satori(tree, { width: W, height: H, fonts });
  const png = new Resvg(svg, { background: '#0A1626', fitTo: { mode: 'width', value: W } }).render().asPng();
  writeFileSync(outPath, png);
  return png.length;
}

const lotName = process.argv[2] || 'lot01';
const startNum = Number(process.argv[3] || 1);
const slides = lotName === 'lot02'
  ? (await import('../src/slides/lot02.js')).LOT_02
  : lotName === 'lot03'
    ? (await import('../src/slides/lot03.js')).LOT_03
    : lotName === 'lot04'
      ? (await import('../src/slides/lot04.js')).LOT_04
    : lotName === 'lot05'
      ? (await import('../src/slides/lot05.js')).LOT_05
      : lotName === 'mod001'
        ? (await import('../src/slides/mod001.js')).LOT_MOD001
        : (await import('../src/slides/lot01.js')).LOT_01;

mkdirSync(`renders/${lotName}`, { recursive: true });
let i = startNum;
for (const make of slides) {
  const t0 = Date.now();
  try {
    const bytes = await renderSlide(make(), `renders/${lotName}/${String(i).padStart(2, '0')}.png`);
    console.log(`SLIDE ${String(i).padStart(2, '0')}  →  renders/${lotName}/${String(i).padStart(2, '0')}.png  (${(bytes / 1024).toFixed(0)} Ko, ${Date.now() - t0} ms)`);
  } catch (e) {
    console.log(`SLIDE ${String(i).padStart(2, '0')}  →  ÉCHEC : ${String(e.message).slice(-140)}`);
  }
  i++;
}
console.log(`\nLot ${lotName} terminé : ${slides.length} slides.`);
