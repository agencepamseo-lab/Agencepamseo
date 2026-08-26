// ---------------------------------------------------------------------------
// FOLO — PACK SLIDES MOD-001 v01 (33 écrans)
// 01        : couverture packaging MOD-001 (aucune matière pédagogique nouvelle)
// 02-32     : slides existantes 21-51 CONSERVÉES (aucune réécriture)
// 33        : slide 52 ADAPTÉE en clôture MOD-001 (zéro contenu Lot 6 / 1.4)
// Numérotation pack 01-33 via setPageOverride (outil), sources inchangées.
// ---------------------------------------------------------------------------
import { d } from '../el.js';
import { C, F } from '../theme.js';
import { slide, kicker, setPageOverride, setSeqOverride } from '../ds.js';
import { icon, dotGrid } from '../icons.js';
import { MC, lightCard, centerTitle, button, dots } from '../dsm.js';
import { LOT_03 } from './lot03.js';
import { LOT_04 } from './lot04.js';
import { LOT_05 } from './lot05.js';

const ORANGE = C.orange;

/* ------------------------------------------------------------------ */
/* ÉCRAN 01 — Couverture MOD-001 (packaging uniquement)                */
/* ------------------------------------------------------------------ */
function cover() {
  const seq = (num, txt) =>
    d({ ...lightCard(), flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18, padding: '22px 28px' }, [
      d({
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: 54, height: 54, borderRadius: 27, background: C.orangeGrad, flexShrink: 0,
        fontFamily: F.display, fontWeight: 800, fontSize: 24, color: '#FFFFFF', lineHeight: 1,
      }, num),
      d({ fontFamily: F.body, fontWeight: 700, fontSize: 27, color: MC.ink, lineHeight: 1.25 }, txt),
    ]);

  const chip = (ic, txt) =>
    d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, border: `2px solid rgba(12,27,49,0.12)`, borderRadius: 999, padding: '12px 26px', background: 'rgba(12,27,49,0.04)' }, [
      icon(ic, 24, MC.inkSoft, 2.4),
      d({ fontFamily: F.body, fontWeight: 700, fontSize: 22, letterSpacing: 1.5, color: MC.inkSoft, lineHeight: 1 }, txt),
    ]);

  return slide({
    page: 1,
    headerOpts: { crumb: 'MOD-001 · Entrepreneuriat', rightText: 'MODULE · 15 000 FCFA' },
    bgExtras: [d({ position: 'absolute', top: 140, right: 80 }, dotGrid(7, 6, 28, 2.4, 'rgba(255,255,255,0.06)'))],
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 6 }, kicker('Formation FOLO · Parcours entrepreneuriat')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 26 },
        centerTitle('Identifier et sélectionner ses opportunités d\u2019affaires', 66)),
      d({ fontFamily: F.body, fontWeight: 400, fontSize: 31, lineHeight: 1.5, color: C.grey, textAlign: 'center', maxWidth: 1300, marginTop: 22, alignSelf: 'center' },
        'Passez de problèmes observés à 2 idées d\u2019affaires sélectionnées et scorées avec la grille FOLO.'),

      d({ ...lightCard(), display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 22, padding: '30px 40px', marginTop: 40, alignSelf: 'center', width: 1300 }, [
        icon('check', 34, ORANGE, 2.6),
        d({ fontFamily: F.body, fontWeight: 600, fontSize: 30, lineHeight: 1.4, color: MC.ink },
          'À la fin du module, vous repartez avec 2 idées sélectionnées et scorées.'),
      ]),

      d({ display: 'flex', flexDirection: 'row', gap: 24, marginTop: 36 }, [
        seq('1.1', 'Repérer les opportunités'),
        seq('1.2', 'Générer des idées'),
        seq('1.3', 'Évaluer et sélectionner'),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 22, marginTop: 40 }, [
        chip('clock', 'ENV. 1 H 40'),
        chip('flag', '3 SÉQUENCES'),
        chip('coins', '15 000 FCFA'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* ÉCRAN 33 — Clôture MOD-001 (adaptation F2 de la slide 52)           */
/* Aucune référence 1.4 / Lot 6. Formulation neutre : évaluation       */
/* finale verrouillée (quiz ≥ 70 % + short-list) et suite du parcours. */
/* ------------------------------------------------------------------ */
function close52() {
  const row = (label) =>
    d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 22 }, [
      d({ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 46, height: 46, borderRadius: 23, background: C.orangeGrad },
        icon('check', 23, '#FFFFFF', 3)),
      d({ fontFamily: F.body, fontWeight: 700, fontSize: 31, color: MC.ink, lineHeight: 1.3, flex: 1 }, label),
    ]);

  return slide({
    page: 33,
    headerOpts: { crumb: 'MOD-001 · Entrepreneuriat', seq: { n: 3, total: 3 } },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Fin du module')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('MOD-001 terminé', 80)),

      d({ ...lightCard(), display: 'flex', flexDirection: 'column', gap: 26, padding: '40px 54px', marginTop: 40, alignSelf: 'center', width: 1300 }, [
        row('Séquence 1.1 · Repérer les opportunités'),
        row('Séquence 1.2 · Générer des idées'),
        row('Séquence 1.3 · Évaluer et sélectionner'),
        d({ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTop: `2px solid rgba(12,27,49,0.12)`, paddingTop: 24 }, [
          d({ fontFamily: F.display, fontWeight: 800, fontSize: 32, color: MC.ink, lineHeight: 1 }, 'MODULE COMPLÉTÉ'),
          d({ fontFamily: F.display, fontWeight: 800, fontSize: 36, color: ORANGE, lineHeight: 1 }, '100 %'),
        ]),
      ]),

      d({ ...lightCard(), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '32px 54px', borderRadius: 28, marginTop: 36, alignSelf: 'center' }, [
        d({ fontFamily: F.body, fontWeight: 700, fontSize: 30, color: MC.ink, lineHeight: 1.4, textAlign: 'center' },
          'Prochaine étape : l\u2019évaluation finale — quiz et livrable « Ma short-list FOLO ».'),
        d({ fontFamily: F.body, fontWeight: 500, fontSize: 26, color: MC.inkSoft, lineHeight: 1.4, textAlign: 'center' },
          'Consolidez vos 2 idées sélectionnées et scorées, puis poursuivez le parcours FOLO.'),
        d({ display: 'flex', flexDirection: 'row', gap: 22 }, [button('Continuer', 'arrowRight')]),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* Assemblage du pack : 1 + 10 + 11 + 10 conservées + 1 adaptée = 33   */
/* ------------------------------------------------------------------ */
const builders = [
  cover,
  ...LOT_03,                       // écrans 02-11 (slides 21-30 conservées)
  ...LOT_04,                       // écrans 12-22 (slides 31-41 conservées)
  ...LOT_05.slice(0, 10),          // écrans 23-32 (slides 42-51 conservées)
  close52,                         // écran 33 (adaptation F2)
];

export const LOT_MOD001 = builders.map((fn, i) => () => {
  setPageOverride(i + 1);
  setSeqOverride(i === 0 ? null : i <= 10 ? { n: 1, total: 3 } : i <= 21 ? { n: 2, total: 3 } : { n: 3, total: 3 });
  try {
    return fn();
  } finally {
    setPageOverride(null);
    setSeqOverride(null);
  }
});
