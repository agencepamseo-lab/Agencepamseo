// ---------------------------------------------------------------------------
// FOLO — Verrou d'intégrité de production
// Vérifie : fichiers PNG attendus vs présents (trous + orphelins),
// numéros `page:` des sources vs plages master, noms de fichiers vs numéros.
// Sort en code 1 si anomalie. À exécuter après chaque lot / renumérotation.
// ---------------------------------------------------------------------------
import { readdirSync, readFileSync } from 'node:fs';

const MASTER = [
  // [lot, premier fichier, dernier fichier, premier page: dans les sources]
  // (la couverture 01 ne porte pas de propriété page:)
  ['lot01', 1, 10, 2],
  ['lot02', 11, 20, 11],
  ['lot03', 21, 30, 21],
  ['lot04', 31, 41, 31],
  ['lot05', 42, 52, 42],
];

let fails = 0;
const pad = (n) => String(n).padStart(2, '0');

for (const [lot, a, b, p0] of MASTER) {
  const expected = new Set();
  for (let n = a; n <= b; n++) expected.add(`${pad(n)}.png`);

  // 1. Fichiers présents
  const present = new Set(readdirSync(`renders/${lot}`).filter((f) => f.endsWith('.png')));
  for (const f of [...present]) {
    if (!expected.has(f)) { console.log(`[ORPHELIN] renders/${lot}/${f}`); fails++; }
  }
  for (const f of [...expected]) {
    if (!present.has(f)) { console.log(`[MANQUANT] renders/${lot}/${f}`); fails++; }
  }

  // 2. Numéros page: des sources
  const src = readFileSync(`src/slides/${lot}.js`, 'utf8');
  const pages = [...src.matchAll(/page: (\d+),/g)].map((m) => Number(m[1]));
  const dup = pages.filter((p, i) => pages.indexOf(p) !== i);
  if (dup.length) { console.log(`[DOUBLON page:] ${lot} → ${dup.join(',')}`); fails++; }
  for (const p of pages) {
    if (p < p0 || p > b) { console.log(`[HORS PLAGE] ${lot} page ${p} (attendu ${p0}-${b})`); fails++; }
  }
  if (pages.length !== b - p0 + 1) {
    console.log(`[COMPTE] ${lot}: ${pages.length} slides source pour ${b - p0 + 1} attendues`); fails++;
  }
}

if (fails) { console.log(`\nINTÉGRITÉ : ${fails} anomalie(s).`); process.exit(1); }
console.log('INTÉGRITÉ : OK — aucune anomalie (fichiers, orphelins, numéros, plages).');
