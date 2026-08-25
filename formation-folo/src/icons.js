// ---------------------------------------------------------------------------
// FOLO — Icônes & motifs géométriques (un seul style : trait 2px, coins ronds)
// Motifs contemporains inspirés de l'Afrique : triangles, arcs, grilles de points.
// Jamais de clichés, jamais de décoration gratuite.
// ---------------------------------------------------------------------------
import { img, svgUri } from './el.js';

const P = {
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3.2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20.5 20.5-4.6-4.6"/>',
  target: '<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="5.8"/><circle cx="12" cy="12" r="2"/>',
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  check: '<path d="M20 6.5 9.3 17.5 4 12"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  arrowRight: '<path d="M4 12h16"/><path d="m13 5 7 7-7 7"/>',
  arrowDown: '<path d="M12 4v16"/><path d="m5 13 7 7 7-7"/>',
  coins: '<circle cx="8.5" cy="8.5" r="6"/><path d="M17.8 10.2A6 6 0 1 1 10 18.1"/><path d="M7 6.5h1.5v4"/><path d="m16.4 13.9.7.7-2.8 2.8"/>',
  trendUp: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14"/><path d="M15 6v14"/>',
  flag: '<path d="M4.5 15.5s1.2-1 4-1 4.8 2 7.5 2 3.5-1 3.5-1v-11s-1.2 1-4 1-4.7-2-7.5-2-3.5 1-3.5 1Z"/><path d="M4.5 22v-6.5"/>',
  clock: '<circle cx="12" cy="12" r="9.5"/><path d="M12 6.5V12l3.5 2"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6.5a4 4 0 0 0-4 4v2"/><circle cx="9.2" cy="7.5" r="3.8"/><path d="M21.5 21v-2a4 4 0 0 0-3-3.85"/><path d="M15.5 3.6a3.8 3.8 0 0 1 0 7.3"/>',
  pencil: '<path d="M17.3 3.7a2.4 2.4 0 0 1 3.4 3.4L8 19.8 3.5 20.5l.7-4.5L17.3 3.7Z"/><path d="m15 6 3 3"/>',
  alert: '<path d="M10.3 3.9 2.4 17.6a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4.5"/><path d="M12 17.2h.01"/>',
  question: '<circle cx="12" cy="12" r="9.5"/><path d="M9.3 9.2a2.8 2.8 0 0 1 5.4 1c0 1.9-2.7 2.4-2.7 4"/><path d="M12 17.5h.01"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1Z"/><path d="m12 15-3-3a22 22 0 0 1 2-4A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2Z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0"/><path d="M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>',
  compass: '<circle cx="12" cy="12" r="9.5"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3 6.3-2.1Z"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12"/>',
  gradcap: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>',
};

/** Icône <img> au style unique de la charte (trait, coins ronds). */
export function icon(name, size = 40, color = '#FFFFFF', strokeWidth = 2) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" ` +
    `fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">` +
    (P[name] || '') + '</svg>';
  return img(svgUri(svg), size, size);
}

/** Bande de triangles (motif signature, discret). */
export function triStrip(n = 5, s = 12, gap = 10, color = 'rgba(249,123,44,0.9)') {
  const w = n * s + (n - 1) * gap;
  let tris = '';
  for (let i = 0; i < n; i++) {
    const x = i * (s + gap);
    tris += `<path d="M${x} ${s} L${x + s / 2} 0 L${x + s} ${s} Z" fill="${color}"/>`;
  }
  return img(svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${s}">${tris}</svg>`), w, s);
}

/** Grille de points (motif de fond, très discret). */
export function dotGrid(cols = 8, rows = 5, gap = 26, r = 2.4, color = 'rgba(255,255,255,0.16)') {
  const w = (cols - 1) * gap + r * 2;
  const h = (rows - 1) * gap + r * 2;
  let dots = '';
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++)
      dots += `<circle cx="${r + i * gap}" cy="${r + j * gap}" r="${r}" fill="${color}"/>`;
  return img(svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${dots}</svg>`), w, h);
}

/** Arcs concentriques (motif de fond). */
export function arcs(size = 420, rings = [0.35, 0.52, 0.69, 0.86], color = 'rgba(249,123,44,0.16)', sw = 1.6) {
  let c = '';
  for (const k of rings) c += `<circle cx="${size / 2}" cy="${size / 2}" r="${(size / 2) * k}" stroke="${color}" stroke-width="${sw}" fill="none"/>`;
  return img(svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">${c}</svg>`), size, size);
}

/** Logo FOLO (marque carrée orange + F). */
export function logoMark(size = 56) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 56 56">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="#FBA14B"/><stop offset="1" stop-color="#E85D04"/></linearGradient></defs>` +
    `<rect width="56" height="56" rx="13" fill="url(#g)"/>` +
    `<path d="M18 14h22v6.5H26.5v5.5H36v6.5h-9.5V42H18V14Z" fill="#0A1626"/>` +
    `</svg>`;
  return img(svgUri(svg), size, size);
}
