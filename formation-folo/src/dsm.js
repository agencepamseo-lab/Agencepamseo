// ---------------------------------------------------------------------------
// FOLO — Composants « Édition mobile » (cartes claires, gros boutons, badges)
// Voir docs/06-charte-mobile.md
// ---------------------------------------------------------------------------
import { d } from './el.js';
import { C, F } from './theme.js';
import { icon } from './icons.js';

export const MC = {
  cardBg: '#F7F9FC',
  ink: '#0C1B31',
  inkSoft: '#46536B',
};

/** Carte claire (fond blanc cassé) pour lecture mobile. */
export const lightCard = (style = {}) => ({
  background: MC.cardBg,
  borderRadius: 28,
  ...style,
});

/** Titre centré blanc. */
export const centerTitle = (txt, size = 78) =>
  d({
    fontFamily: F.display, fontWeight: 800, fontSize: size, lineHeight: 1.12,
    color: C.white, textAlign: 'center',
  }, txt);

/** Bouton plein orange (cible tactile généreuse). */
export function button(label, iconName = 'download', iconColor = '#FFFFFF') {
  return d({
    display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16,
    background: C.orangeGrad, borderRadius: 999,
    paddingTop: 20, paddingBottom: 20, paddingLeft: 40, paddingRight: 40,
  }, [
    icon(iconName, 26, iconColor, 2.4),
    d({ fontFamily: F.body, fontWeight: 700, fontSize: 26, color: '#FFFFFF', lineHeight: 1 }, label),
  ]);
}

/** Bouton contour orange. */
export function buttonOutline(label, iconName) {
  const kids = [];
  if (iconName) kids.push(icon(iconName, 24, C.orange, 2.4));
  kids.push(d({ fontFamily: F.body, fontWeight: 700, fontSize: 26, color: C.orange, lineHeight: 1 }, label));
  return d({
    display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14,
    border: `2px solid ${C.orangeBorder}`, borderRadius: 999,
    paddingTop: 18, paddingBottom: 18, paddingLeft: 38, paddingRight: 38,
    background: C.orangeSoft,
  }, kids);
}

/** Points de progression (mobile). */
export function dots(active, total) {
  return d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 22 },
    Array.from({ length: total }, (_, i) =>
      i < active
        ? d({
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: 40, height: 40, borderRadius: 20, background: C.orangeGrad,
          }, icon('check', 20, '#FFFFFF', 3))
        : d({ width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.22)' })
    ));
}

/** Badge circulaire temps. */
export function timerBadge(line1, line2) {
  return d({
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6,
    width: 148, height: 148, borderRadius: 74, background: C.orangeGrad,
  }, [
    icon('clock', 40, '#FFFFFF', 2.2),
    d({ fontFamily: F.display, fontWeight: 800, fontSize: 30, color: '#FFFFFF', lineHeight: 1 }, line1),
    d({ fontFamily: F.body, fontWeight: 700, fontSize: 16, letterSpacing: 2, color: 'rgba(255,255,255,0.9)', lineHeight: 1 }, line2),
  ]);
}

/** Numéro géant orange (repère de scan). */
export const bigNum = (n) =>
  d({ fontFamily: F.display, fontWeight: 800, fontSize: 62, lineHeight: 1, color: C.orange }, n);
