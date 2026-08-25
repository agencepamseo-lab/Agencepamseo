// ---------------------------------------------------------------------------
// FOLO — LOT N° 3 : slides 21 à 30 — « Édition mobile » de la séquence 1.1
// Structure inspirée des exemples fournis ; textes et charte 100 % FOLO.
// ---------------------------------------------------------------------------
import { readFileSync } from 'node:fs';
import { d } from '../el.js';
import { C, F, T } from '../theme.js';
import { slide, kicker, panel, progressBar } from '../ds.js';
import { icon, triStrip, dotGrid, arcs } from '../icons.js';
import { MC, lightCard, centerTitle, button, buttonOutline, dots, timerBadge, bigNum } from '../dsm.js';

const ORANGE = C.orange;
const CRUMB = 'Module 1.1 · Sources d\u2019opportunités';
const SEQ1 = { n: 1, total: 4 };

const fatouBuf = readFileSync(new URL('../../assets/fatou.jpg', import.meta.url));
const FATOU = 'data:image/jpeg;base64,' + fatouBuf.toString('base64');

/* ------------------------------------------------------------------ */
/* SLIDE 21 — Ouverture de séquence (mobile)                           */
/* ------------------------------------------------------------------ */
export function slide21() {
  return slide({
    page: 21,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    bgExtras: [d({ position: 'absolute', top: 140, right: 80 }, dotGrid(7, 6, 28, 2.4, 'rgba(255,255,255,0.06)'))],
    children: [
      d({ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }, kicker('Séquence 1.1 · Env. 15 minutes')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 26 }, centerTitle('Sources d\u2019opportunités', 84)),
      d({ fontFamily: F.body, fontWeight: 400, fontSize: 34, lineHeight: 1.5, color: C.grey, textAlign: 'center', maxWidth: 1200, marginTop: 24, alignSelf: 'center' },
        'Trois endroits précis où se cachent les bonnes idées de projet.'),

      d({ ...lightCard(), display: 'flex', flexDirection: 'column', gap: 30, padding: '46px 56px', marginTop: 52, width: 1180, alignSelf: 'center' }, [
        d({ fontFamily: F.body, fontWeight: 800, fontSize: 25, letterSpacing: 3, color: MC.inkSoft, lineHeight: 1 },
          'À LA FIN DE CETTE SÉQUENCE, VOUS AUREZ :'),
        d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }, [
          icon('check', 34, ORANGE, 2.6),
          d({ fontFamily: F.body, fontWeight: 600, fontSize: 36, color: MC.ink, lineHeight: 1.4 }, 'Identifié 3 sources d\u2019opportunités autour de vous.'),
        ]),
        d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }, [
          icon('check', 34, ORANGE, 2.6),
          d({ fontFamily: F.body, fontWeight: 600, fontSize: 36, color: MC.ink, lineHeight: 1.4 }, 'Noté 5 idées de projets potentielles.'),
        ]),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 28, marginTop: 56, alignSelf: 'center' }, [
        dots(1, 4),
        d({ fontFamily: F.body, fontWeight: 700, fontSize: 30, letterSpacing: 1.5, color: C.grey, lineHeight: 1 }, '25 % DU MODULE'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 22 — Accroche citation (mobile)                               */
/* ------------------------------------------------------------------ */
export function slide22() {
  return slide({
    page: 22,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    bgExtras: [d({ position: 'absolute', top: 200, left: 620 }, arcs(660, [0.42, 0.58, 0.74, 0.9], 'rgba(249,123,44,0.10)', 1.6))],
    children: [
      d({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 44 }, [
        kicker('Le départ de tout projet'),
        centerTitle('« Les meilleures opportunités naissent des problèmes non résolus. »', 62),
        d({ width: 90, height: 6, borderRadius: 3, background: ORANGE }),
        d({ fontFamily: F.display, fontWeight: 700, fontSize: 48, lineHeight: 1.3, color: ORANGE, textAlign: 'center' },
          'Et vous, qu\u2019est-ce qui vous fruste chaque jour ?'),
        d({ fontFamily: F.body, fontWeight: 400, fontSize: 32, color: C.grey, lineHeight: 1.4 },
          'Prenez 30 secondes pour y penser, maintenant.'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 23 — Source 1 : mécanisme + micro-exemples                    */
/* ------------------------------------------------------------------ */
export function slide23() {
  const maillon = (txt, last = false) =>
    d({
      ...(last ? { background: C.orangeGrad } : lightCard()),
      borderRadius: 24,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '30px 48px', width: 980,
    },
      d({
        fontFamily: F.display, fontWeight: 800, fontSize: 41, letterSpacing: 1, lineHeight: 1.1,
        color: last ? '#FFFFFF' : MC.ink, textAlign: 'center',
      }, txt));

  return slide({
    page: 23,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Source 1')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('Les problèmes du quotidien', 74)),

      d({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, marginTop: 44 }, [
        maillon('FRUSTRATIONS PERSONNELLES'),
        icon('arrowDown', 46, ORANGE, 2.4),
        maillon('BESOINS NON SATISFAITS'),
        icon('arrowDown', 46, ORANGE, 2.4),
        maillon('OPPORTUNITÉ D\u2019AFFAIRES', true),
      ]),

      d({ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 46 }, [
        d({ ...panel(), display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14, padding: '18px 30px', borderRadius: 999 }, [
          icon('alert', 28, ORANGE, 2.2),
          d({ fontFamily: F.body, fontWeight: 500, fontSize: 29, color: C.grey, lineHeight: 1.3 }, 'Coupures d\u2019électricité → solutions solaires'),
        ]),
        d({ ...panel(), display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14, padding: '18px 30px', borderRadius: 999 }, [
          icon('alert', 28, ORANGE, 2.2),
          d({ fontFamily: F.body, fontWeight: 500, fontSize: 29, color: C.grey, lineHeight: 1.3 }, 'Transport difficile → services de livraison'),
        ]),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 24 — Exercice : 3 cartes + minuteur + bouton                  */
/* ------------------------------------------------------------------ */
export function slide24() {
  const card = (num, ic, title, sub) =>
    d({ ...lightCard(), flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '32px 30px', textAlign: 'center' }, [
      bigNum(num),
      d({ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 110, height: 110, borderRadius: 55, background: 'rgba(249,123,44,0.12)' },
        icon(ic, 52, ORANGE, 1.8)),
      d({ fontFamily: F.display, fontWeight: 800, fontSize: 34, lineHeight: 1.2, color: MC.ink, textAlign: 'center' }, title),
      d({ fontFamily: F.body, fontWeight: 500, fontSize: 29, lineHeight: 1.45, color: MC.inkSoft, textAlign: 'center' }, sub),
    ]);

  return slide({
    page: 24,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Exercice pratique')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('Identifiez 3 problèmes', 74)),
      d({ fontFamily: F.body, fontWeight: 400, fontSize: 34, color: C.grey, textAlign: 'center', marginTop: 18, alignSelf: 'center' },
        'Identifiez 3 problèmes autour de vous :'),

      d({ display: 'flex', flexDirection: 'row', gap: 30, marginTop: 32, alignItems: 'stretch' }, [
        card('01', 'alert', 'CE QUI VOUS ÉNERVE', 'Un problème que vous affrontez presque chaque jour.'),
        card('02', 'home', 'CE QUI MANQUE DANS VOTRE QUARTIER', 'Un produit ou un service absent autour de vous.'),
        card('03', 'users', 'CE QUE VOS PROCHES RECHERCHENT', 'Ce qu\u2019ils veulent obtenir sans jamais le trouver.'),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22 }, [
        timerBadge('3', 'MINUTES'),
        d({ ...lightCard(), flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '22px 26px 22px 44px', marginLeft: 40, borderRadius: 999 }, [
          d({ fontFamily: F.display, fontWeight: 800, fontSize: 39, color: MC.ink, lineHeight: 1 }, 'À VOUS DE JOUER'),
          button('Télécharger la fiche exercice'),
        ]),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 25 — Source 2 : tendances + grande flèche                     */
/* ------------------------------------------------------------------ */
export function slide25() {
  const row = (ic, txt) =>
    d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 24 }, [
      icon(ic, 40, ORANGE, 2),
      d({ fontFamily: F.body, fontWeight: 600, fontSize: 38, color: 'rgba(255,255,255,0.95)', lineHeight: 1.3 }, txt),
    ]);

  return slide({
    page: 25,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    bgExtras: [d({ position: 'absolute', top: 170, right: 130 }, arcs(520, [0.45, 0.65, 0.85], 'rgba(255,255,255,0.05)', 1.4))],
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Source 2')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('Les tendances émergentes', 74)),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 60, flex: 1, marginTop: 30 }, [
        d({ display: 'flex', flexDirection: 'column', gap: 34, flex: 1 }, [
          row('rocket', 'Digitalisation croissante'),
          row('leaf', 'Économie verte et locale'),
          row('users', 'Services collaboratifs'),
          row('gradcap', 'Formation en ligne'),
          row('coins', 'Mobile money'),
        ]),
        icon('trendUp', 379, ORANGE, 1.6),
      ]),

      d({ display: 'flex', justifyContent: 'center', alignItems: 'center', background: C.orangeGrad, borderRadius: 20, padding: '26px 40px' },
        d({ fontFamily: F.display, fontWeight: 700, fontSize: 36, color: '#FFFFFF', lineHeight: 1.3, textAlign: 'center' },
          'Une opportunité, c\u2019est anticiper les besoins de demain.')),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 26 — Quiz express (mobile)                                    */
/* ------------------------------------------------------------------ */
export function slide26() {
  const opt = (letter, txt) =>
    d({ ...lightCard(), flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20, padding: '26px 32px' }, [
      d({
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: 58, height: 58, borderRadius: 29, background: C.orangeGrad, flexShrink: 0,
        fontFamily: F.display, fontWeight: 800, fontSize: 30, color: '#FFFFFF', lineHeight: 1,
      }, letter),
      d({ fontFamily: F.body, fontWeight: 600, fontSize: 32, color: MC.ink, lineHeight: 1.3 }, txt),
    ]);

  return slide({
    page: 26,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Quiz express')),
      d({ ...panel({ border: `2px solid rgba(255,255,255,0.35)`, borderRadius: 32 }), display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 60px', marginTop: 40 },
        d({ fontFamily: F.display, fontWeight: 800, fontSize: 60, lineHeight: 1.25, color: C.white, textAlign: 'center' },
          'Quelle tendance impacte le plus votre secteur ?')),

      d({ display: 'flex', flexDirection: 'column', gap: 26, marginTop: 44 }, [
        d({ display: 'flex', flexDirection: 'row', gap: 26 }, [opt('A', 'La digitalisation'), opt('B', 'L\u2019économie verte')]),
        d({ display: 'flex', flexDirection: 'row', gap: 26 }, [opt('C', 'Les services collaboratifs'), opt('D', 'Une autre, que vous savez nommer')]),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 46 }, [
        icon('clock', 39, ORANGE, 2.2),
        d({ fontFamily: F.body, fontWeight: 700, fontSize: 33, color: 'rgba(255,255,255,0.92)', lineHeight: 1.3 },
          '10 secondes pour répondre mentalement.'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 27 — Source 3 : compétences (mobile)                          */
/* ------------------------------------------------------------------ */
export function slide27() {
  const maillon = (txt) =>
    d({ ...lightCard(), display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '26px 40px', borderRadius: 24, width: 860 },
      d({ fontFamily: F.display, fontWeight: 800, fontSize: 36, letterSpacing: 0.8, color: MC.ink, textAlign: 'center', lineHeight: 1.15 }, txt));

  return slide({
    page: 27,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Source 3')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('Vos compétences uniques', 74)),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 44, flex: 1, marginTop: 16 }, [
        d({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }, [
          maillon('CE QUE VOUS SAVEZ FAIRE'),
          icon('arrowDown', 41, ORANGE, 2.4),
          maillon('CE QUE VOUS AIMEZ FAIRE'),
          icon('arrowDown', 41, ORANGE, 2.4),
          maillon('CE DONT LE MARCHÉ A BESOIN'),
        ]),
        icon('arrowRight', 60, ORANGE, 2.2),
        d({
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8,
          width: 430, height: 430, borderRadius: 215, background: C.orangeGrad,
        }, [
          d({ fontFamily: F.display, fontWeight: 800, fontSize: 46, lineHeight: 1.05, color: '#FFFFFF', textAlign: 'center' }, 'VOTRE'),
          d({ fontFamily: F.display, fontWeight: 800, fontSize: 46, lineHeight: 1.05, color: '#FFFFFF', textAlign: 'center' }, 'OPPORTUNITÉ'),
          d({ fontFamily: F.display, fontWeight: 800, fontSize: 46, lineHeight: 1.05, color: '#FFFFFF', textAlign: 'center' }, 'EN OR'),
        ]),
      ]),

      d({ display: 'flex', justifyContent: 'center', marginTop: 26 }, buttonOutline('Template : fiche d\u2019évaluation des compétences', 'download')),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 28 — Étude de cas Fatou (photo + carte claire)                */
/* ------------------------------------------------------------------ */
export function slide28() {
  const line = (ic, label, txt) =>
    d({ display: 'flex', flexDirection: 'column', gap: 10 }, [
      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14 }, [
        icon(ic, 26, ORANGE, 2.2),
        d({ fontFamily: F.body, fontWeight: 800, fontSize: 25, letterSpacing: 2.6, color: MC.inkSoft, lineHeight: 1 }, label),
      ]),
      d({ fontFamily: F.body, fontWeight: 500, fontSize: 32, lineHeight: 1.45, color: MC.ink }, txt),
    ]);

  return slide({
    page: 28,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Étude de cas · Ouagadougou')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('Fatou et les mangues perdues', 68)),

      d({ display: 'flex', flexDirection: 'row', gap: 40, flex: 1, alignItems: 'stretch', marginTop: 40 }, [
        d({
          width: 470, height: 470, borderRadius: 28, overflow: 'hidden',
          border: `3px solid ${C.orangeBorder}`, alignSelf: 'center',
        }, { type: 'img', props: { src: FATOU, width: 464, height: 464, style: { borderRadius: 25 } } }),
        d({ ...lightCard(), flex: 1, display: 'flex', flexDirection: 'column', gap: 26, padding: '40px 46px' }, [
          d({ fontFamily: F.display, fontWeight: 800, fontSize: 39, color: MC.ink, lineHeight: 1.1 }, 'Fatou · Ouagadougou'),
          line('alert', 'PROBLÈME', 'Après la récolte, 40 % des mangues perdaient leur valeur.'),
          line('bulb', 'SOLUTION', 'Une unité de séchage transforme les fruits en mangues sèches.'),
          line('trendUp', 'RÉSULTATS', '15 emplois créés · export régional · 25 millions de FCFA de chiffre d\u2019affaires.'),
        ]),
      ]),

      d({ display: 'flex', justifyContent: 'center', alignItems: 'center', background: C.orangeGrad, borderRadius: 20, padding: '24px 40px', marginTop: 34 },
        d({ fontFamily: F.display, fontWeight: 700, fontSize: 34, color: '#FFFFFF', lineHeight: 1.3, textAlign: 'center' },
          'Leçon : observer les pertes, c\u2019est observer des opportunités.')),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 29 — Synthèse : 3 cercles + action                            */
/* ------------------------------------------------------------------ */
export function slide29() {
  const circle = (num, ic, l1, l2) =>
    d({
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12,
      width: 430, height: 430, borderRadius: 215, background: C.orangeGrad,
    }, [
      d({ fontFamily: F.display, fontWeight: 800, fontSize: 64, color: '#FFFFFF', lineHeight: 1 }, num),
      icon(ic, 44, '#FFFFFF', 2),
      d({ fontFamily: F.display, fontWeight: 700, fontSize: 33, lineHeight: 1.2, color: '#FFFFFF', textAlign: 'center' }, l1),
      d({ fontFamily: F.display, fontWeight: 700, fontSize: 33, lineHeight: 1.2, color: '#FFFFFF', textAlign: 'center' }, l2),
    ]);

  return slide({
    page: 29,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 10 }, kicker('Synthèse de la séquence')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 26 }, centerTitle('Ce que vous retenez', 78)),

      d({ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 60, marginTop: 60 }, [
        circle('1', 'alert', 'Problèmes', 'du quotidien'),
        circle('2', 'trendUp', 'Tendances', 'émergentes'),
        circle('3', 'target', 'Vos', 'compétences'),
      ]),

      d({ ...lightCard(), display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 20px 44px', borderRadius: 999, marginTop: 64 }, [
        d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18 }, [
          icon('flag', 34, MC.ink, 2.2),
          d({ fontFamily: F.body, fontWeight: 700, fontSize: 33, color: MC.ink, lineHeight: 1.3 }, 'Action : notez 5 idées de projets.'),
        ]),
        button('Grille d\u2019idéation'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 30 — Félicitations + transition                               */
/* ------------------------------------------------------------------ */
export function slide30() {
  return slide({
    page: 30,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    bgExtras: [
      d({ position: 'absolute', top: 150, left: 210 }, triStrip(3, 14, 14, 'rgba(249,123,44,0.55)')),
      d({ position: 'absolute', top: 260, right: 240 }, triStrip(3, 12, 12, 'rgba(255,255,255,0.35)')),
      d({ position: 'absolute', bottom: 260, left: 300 }, triStrip(3, 12, 12, 'rgba(255,255,255,0.25)')),
      d({ position: 'absolute', bottom: 210, right: 300 }, triStrip(3, 14, 14, 'rgba(249,123,44,0.45)')),
    ],
    children: [
      d({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 34 }, [
        centerTitle('Félicitations !', 92),
        icon('trophy', 172, ORANGE, 1.5),
        d({ fontFamily: F.display, fontWeight: 700, fontSize: 41, color: C.white, lineHeight: 1.2 }, 'Séquence 1.1 terminée'),
        dots(1, 4),
        d({ ...lightCard(), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, padding: '34px 54px', borderRadius: 28, marginTop: 8 }, [
          d({ fontFamily: F.body, fontWeight: 700, fontSize: 33, color: MC.ink, lineHeight: 1.3 },
            'Prochaine séquence : Techniques de créativité · 20 min'),
          d({ display: 'flex', flexDirection: 'row', gap: 22 }, [
            button('Continuer', 'arrowRight'),
            buttonOutline('Ressources', 'download'),
          ]),
        ]),
      ]),
    ],
  });
}

export const LOT_03 = [slide21, slide22, slide23, slide24, slide25, slide26, slide27, slide28, slide29, slide30];
