// ---------------------------------------------------------------------------
// FOLO — Verrou glyphes (v2)
// Bannit les caractères non couverts par les polices embarquées (Sora/Inter,
// sous-ensemble latin) de tout TEXTE RENDU des slides. Incident réel : « ≈ ».
// Ne scanne que les chaînes des sources, après retrait des commentaires.
// ---------------------------------------------------------------------------
import { readFileSync } from 'node:fs';

const BANNIS = ['≈', '≠', '≤', '≥', 'œ', 'Œ', '→', '←', '↑', '↓', '⇒', '★', '☆', '€', '£', '¥', '✓', '✗'];
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;

const files = ['lot01', 'lot02', 'lot03', 'lot04', 'lot05', 'mod001'].map((l) => `src/slides/${l}.js`);
let fails = 0;
for (const f of files) {
  let s = readFileSync(f, 'utf8');
  s = s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, ''); // commentaires hors rendu
  for (const c of BANNIS) {
    if (s.includes(c)) { console.log(`[GLYPHE BANNI] ${f} contient « ${c} »`); fails++; }
  }
  const m = s.match(EMOJI);
  if (m) { console.log(`[EMOJI] ${f} contient ${m[0]}`); fails++; }
  if (/[A-ZÀ-Ý0-9']-[ ]/.test(s)) { console.log(`[TRAIT D'UNION + ESPACE en capitales] ${f}`); fails++; }
}
if (fails) { console.log(`\nGLYPHES : ${fails} anomalie(s).`); process.exit(1); }
console.log('GLYPHES : OK — aucun caractère à risque dans les textes rendus.');
