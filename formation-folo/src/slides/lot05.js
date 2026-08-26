// ---------------------------------------------------------------------------
// FOLO — LOT N° 5 : slides 41 à 50 — Séquence 1.3 « Critères de sélection »
// Édition mobile (standard +15 %).
// ---------------------------------------------------------------------------
import { d } from '../el.js';
import { C, F } from '../theme.js';
import { slide, kicker, panel } from '../ds.js';
import { icon, dotGrid } from '../icons.js';
import { MC, lightCard, centerTitle, button, dots, timerBadge } from '../dsm.js';

const ORANGE = C.orange;
const CRUMB = 'Module 1.3 · Critères de sélection';
const SEQ3 = { n: 3, total: 3 };

/* ------------------------------------------------------------------ */
/* SLIDE 41 — Ouverture de la séquence 1.3                             */
/* ------------------------------------------------------------------ */
export function slide41() {
  return slide({
    page: 42,
    headerOpts: { crumb: CRUMB, seq: SEQ3 },
    bgExtras: [d({ position: 'absolute', top: 140, right: 80 }, dotGrid(7, 6, 28, 2.4, 'rgba(255,255,255,0.06)'))],
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 8 }, kicker('Séquence 1.3 · Env. 15 minutes')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 26 }, centerTitle('Critères de sélection', 84)),
      d({ fontFamily: F.body, fontWeight: 400, fontSize: 34, lineHeight: 1.5, color: C.grey, textAlign: 'center', maxWidth: 1250, marginTop: 24, alignSelf: 'center' },
        'Toutes vos idées ne méritent pas votre énergie. Apprenez à choisir avec des critères, pas à l\u2019instinct.'),

      d({ ...lightCard(), display: 'flex', flexDirection: 'column', gap: 26, padding: '46px 56px', marginTop: 52, width: 1180, alignSelf: 'center' }, [
        d({ fontFamily: F.body, fontWeight: 800, fontSize: 25, letterSpacing: 3, color: MC.inkSoft, lineHeight: 1 }, 'OBJECTIF DE LA SÉQUENCE'),
        d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }, [
          icon('check', 34, ORANGE, 2.4),
          d({ fontFamily: F.body, fontWeight: 600, fontSize: 35, color: MC.ink, lineHeight: 1.4 }, 'Noter 5 idées et retenir les 2 meilleures.'),
        ]),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 28, marginTop: 56, alignSelf: 'center' }, [
        dots(3, 3),
        d({ fontFamily: F.body, fontWeight: 700, fontSize: 30, letterSpacing: 1.5, color: C.grey, lineHeight: 1 }, '100 % DU MODULE'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 42 — Pourquoi choisir                                         */
/* ------------------------------------------------------------------ */
export function slide42() {
  const card = (ic, title, txt) =>
    d({ ...lightCard(), flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: '34px 30px', textAlign: 'center' }, [
      d({ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 96, height: 96, borderRadius: 48, background: 'rgba(249,123,44,0.12)' },
        icon(ic, 48, ORANGE, 2)),
      d({ fontFamily: F.display, fontWeight: 800, fontSize: 32, color: MC.ink, lineHeight: 1.1 }, title),
      d({ fontFamily: F.body, fontWeight: 500, fontSize: 27, lineHeight: 1.45, color: MC.inkSoft, textAlign: 'center' }, txt),
    ]);

  return slide({
    page: 43,
    headerOpts: { crumb: CRUMB, seq: SEQ3 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Pourquoi choisir')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('Choisir, c\u2019est protéger votre projet', 68)),

      d({ display: 'flex', flexDirection: 'row', gap: 30, marginTop: 52, alignItems: 'stretch' }, [
        card('clock', 'LE TEMPS', 'Vous n\u2019avez que quelques heures par semaine à investir.'),
        card('coins', 'L\u2019ARGENT', 'Chaque franc doit aller à une seule idée, pas à cinq.'),
        card('target', 'LA CONCENTRATION', 'Deux projets à la fois, ce sont deux projets fragiles.'),
      ]),

      d({ display: 'flex', justifyContent: 'center', alignItems: 'center', background: C.orangeGrad, borderRadius: 20, padding: '24px 44px', marginTop: 50 },
        d({ fontFamily: F.display, fontWeight: 700, fontSize: 32, color: '#FFFFFF', lineHeight: 1.3, textAlign: 'center' },
          'Une idée non choisie, c\u2019est de l\u2019énergie gaspillée.')),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 43 — Les 5 critères FOLO                                      */
/* ------------------------------------------------------------------ */
export function slide43() {
  const crit = (num, ic, title, txt) =>
    d({ ...lightCard(), display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 24, padding: '18px 36px' }, [
      d({
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: 60, height: 60, borderRadius: 30, background: C.orangeGrad, flexShrink: 0,
        fontFamily: F.display, fontWeight: 800, fontSize: 28, color: '#FFFFFF', lineHeight: 1,
      }, num),
      icon(ic, 34, ORANGE, 2),
      d({ display: 'flex', flexDirection: 'column', gap: 4 }, [
        d({ fontFamily: F.display, fontWeight: 800, fontSize: 29, color: MC.ink, lineHeight: 1.15 }, title),
        d({ fontFamily: F.body, fontWeight: 500, fontSize: 25, color: MC.inkSoft, lineHeight: 1.3 }, txt),
      ]),
    ]);

  return slide({
    page: 44,
    headerOpts: { crumb: CRUMB, seq: SEQ3 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Les 5 critères FOLO')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('La check-list qui décide pour vous (1/2)', 60)),

      d({ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 44 }, [
        crit('1', 'target', 'PROBLÈME RÉEL', 'Le problème existe, il est vécu, pas supposé.'),
        crit('2', 'users', 'CLIENTS CAPABLES', 'Des personnes qui peuvent payer, près de vous.'),
        crit('3', 'coins', 'RESSOURCES ACCESSIBLES', 'Ce qu\u2019il faut existe autour de vous, sans ruine.'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* SLIDE 45 — Critères FOLO 4-5                                        */
/* ------------------------------------------------------------------ */
export function slide43b() {
  const crit = (num, ic, title, txt) =>
    d({ ...lightCard(), display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 24, padding: '26px 36px' }, [
      d({
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: 60, height: 60, borderRadius: 30, background: C.orangeGrad, flexShrink: 0,
        fontFamily: F.display, fontWeight: 800, fontSize: 28, color: '#FFFFFF', lineHeight: 1,
      }, num),
      icon(ic, 34, ORANGE, 2),
      d({ display: 'flex', flexDirection: 'column', gap: 4 }, [
        d({ fontFamily: F.display, fontWeight: 800, fontSize: 29, color: MC.ink, lineHeight: 1.15 }, title),
        d({ fontFamily: F.body, fontWeight: 500, fontSize: 25, color: MC.inkSoft, lineHeight: 1.3 }, txt),
      ]),
    ]);

  return slide({
    page: 45,
    headerOpts: { crumb: CRUMB, seq: SEQ3 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Les 5 critères FOLO · suite')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('La check-list qui décide pour vous (2/2)', 58)),
      d({ display: 'flex', flexDirection: 'column', gap: 26, marginTop: 60 }, [
        crit('4', 'pencil', 'VOS COMPÉTENCES', 'Vous savez faire, ou vous apprenez vite.'),
        crit('5', 'flag', 'ENVIE DURABLE', 'Vous tiendrez sur la durée, même les jours difficiles.'),
      ]),
      d({ display: 'flex', justifyContent: 'center', alignItems: 'center', background: C.orangeSoft, border: `1.5px solid ${C.orangeBorder}`, borderRadius: 20, padding: '24px 44px', marginTop: 60 },
        d({ fontFamily: F.body, fontWeight: 600, fontSize: 30, color: 'rgba(255,255,255,0.94)', lineHeight: 1.4, textAlign: 'center' },
          'Une idée doit cocher les 5 cases pour viser « FONCEZ ».')),
    ],
  });
}

/* SLIDE 44 — La grille, mode d'emploi                                 */
/* ------------------------------------------------------------------ */
export function slide44() {
  const seuil = (range, verdict, strong) =>
    d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 26 }, [
      d({
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: 150, height: 74, borderRadius: 18,
        background: strong ? C.orangeGrad : 'rgba(12,27,49,0.08)',
        fontFamily: F.display, fontWeight: 800, fontSize: 32, lineHeight: 1,
        color: strong ? '#FFFFFF' : MC.inkSoft,
      }, range),
      d({ fontFamily: F.display, fontWeight: 800, fontSize: 34, lineHeight: 1.2, color: strong ? ORANGE : MC.inkSoft }, verdict),
    ]);

  return slide({
    page: 46,
    headerOpts: { crumb: CRUMB, seq: SEQ3 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('La méthode')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('La grille FOLO, mode d\u2019emploi', 68)),

      d({ ...lightCard(), display: 'flex', flexDirection: 'column', gap: 34, padding: '46px 56px', marginTop: 48, alignSelf: 'center', width: 1300 }, [
        d({ fontFamily: F.body, fontWeight: 600, fontSize: 33, lineHeight: 1.45, color: MC.ink },
          'Notez chaque critère de 1 à 5, puis additionnez. Sur 25 points :'),
        seuil('20 À 25', 'FONCEZ.', true),
        seuil('15 À 19', 'À AFFINER AVANT D\u2019AGIR.', false),
        seuil('MOINS DE 15', 'À ABANDONNER SANS REGRET.', false),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 45 — Exemple corrigé : 22/25                                  */
/* ------------------------------------------------------------------ */
export function slide45() {
  const row = (label, score) =>
    d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 22 }, [
      d({ fontFamily: F.body, fontWeight: 600, fontSize: 29, color: MC.ink, lineHeight: 1.3, flex: 1 }, label),
      d({
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: 62, height: 62, borderRadius: 16, background: 'rgba(249,123,44,0.12)',
        fontFamily: F.display, fontWeight: 800, fontSize: 30, color: ORANGE, lineHeight: 1,
      }, String(score)),
    ]);

  return slide({
    page: 47,
    headerOpts: { crumb: CRUMB, seq: SEQ3 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Exemple corrigé')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('La chambre froide solaire, notée', 64)),

      d({ ...lightCard(), display: 'flex', flexDirection: 'column', gap: 24, padding: '42px 54px', marginTop: 44, alignSelf: 'center', width: 1300 }, [
        row('Problème réel', 5),
        row('Clients capables', 4),
        row('Ressources accessibles', 4),
        row('Vos compétences', 4),
        row('Envie durable', 5),
        d({ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTop: `2px solid rgba(12,27,49,0.12)`, paddingTop: 26 }, [
          d({ fontFamily: F.display, fontWeight: 800, fontSize: 36, color: MC.ink, lineHeight: 1 }, 'TOTAL'),
          d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }, [
            d({ fontFamily: F.display, fontWeight: 800, fontSize: 40, color: ORANGE, lineHeight: 1 }, '22 / 25'),
            d({ display: 'flex', justifyContent: 'center', alignItems: 'center', background: C.orangeGrad, borderRadius: 999, padding: '14px 30px' },
              d({ fontFamily: F.display, fontWeight: 800, fontSize: 26, color: '#FFFFFF', lineHeight: 1 }, 'FONCEZ')),
          ]),
        ]),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 46 — Exercice : notez vos 5 idées                             */
/* ------------------------------------------------------------------ */
export function slide46() {
  return slide({
    page: 48,
    headerOpts: { crumb: CRUMB, seq: SEQ3 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Exercice')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('Notez vos 5 idées', 80)),
      d({ fontFamily: F.body, fontWeight: 400, fontSize: 33, lineHeight: 1.5, color: C.grey, textAlign: 'center', maxWidth: 1300, marginTop: 20, alignSelf: 'center' },
        'Utilisez la grille FOLO pour noter vos 5 idées de la séquence 1.2, puis retenez les 2 meilleures.'),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 56, flex: 1 }, [
        timerBadge('10', 'MINUTES'),
        d({ ...lightCard(), display: 'flex', flexDirection: 'column', gap: 22, padding: '38px 46px', maxWidth: 1000 }, [
          d({ fontFamily: F.body, fontWeight: 600, fontSize: 31, lineHeight: 1.5, color: MC.ink },
            'Soyez sévère : une note généreuse aujourd\u2019hui, c\u2019est une déception demain.'),
        ]),
      ]),

      d({ display: 'flex', justifyContent: 'center', marginTop: 10 }, button('Télécharger la grille FOLO')),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 47 — Posture : savoir abandonner                              */
/* ------------------------------------------------------------------ */
export function slide47() {
  return slide({
    page: 49,
    headerOpts: { crumb: CRUMB, seq: SEQ3 },
    children: [
      d({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 44 }, [
        kicker('L\u2019état d\u2019esprit'),
        centerTitle('Abandonner 3 idées, ce n\u2019est pas échouer. C\u2019est protéger la meilleure.', 60),
        d({ width: 90, height: 6, borderRadius: 3, background: ORANGE }),
        d({ fontFamily: F.body, fontWeight: 400, fontSize: 31, color: C.grey, lineHeight: 1.5, textAlign: 'center', maxWidth: 1100 },
          'Les entrepreneurs qui réussissent ne font pas plus de choses : ils en font moins, mais mieux.'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 48 — Quiz : idée à 12/25                                      */
/* ------------------------------------------------------------------ */
export function slide48() {
  const opt = (letter, txt) =>
    d({ ...lightCard(), flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20, padding: '24px 30px' }, [
      d({
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: 62, height: 62, borderRadius: 31, background: C.orangeGrad, flexShrink: 0,
        fontFamily: F.display, fontWeight: 800, fontSize: 28, color: '#FFFFFF', lineHeight: 1,
      }, letter),
      d({ fontFamily: F.body, fontWeight: 600, fontSize: 30, color: MC.ink, lineHeight: 1.35 }, txt),
    ]);

  return slide({
    page: 50,
    headerOpts: { crumb: CRUMB, seq: SEQ3 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Quiz express')),
      d({ ...panel({ border: `2px solid rgba(255,255,255,0.35)`, borderRadius: 32 }), display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '38px 56px', marginTop: 36 },
        d({ fontFamily: F.display, fontWeight: 800, fontSize: 54, lineHeight: 1.25, color: C.white, textAlign: 'center' },
          'Votre idée score 12/25. Que faites-vous ?')),

      d({ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 44 }, [
        opt('A', 'Vous abandonnez tout, définitivement.'),
        opt('B', 'Vous foncez quand même, on verra bien.'),
        opt('C', 'Vous améliorez les points faibles, puis vous re-notez.'),
      ]),

      d({ display: 'flex', justifyContent: 'center', alignItems: 'center', background: C.orangeSoft, border: `1.5px solid ${C.orangeBorder}`, borderRadius: 20, padding: '24px 44px', marginTop: 44 },
        d({ fontFamily: F.body, fontWeight: 600, fontSize: 30, color: 'rgba(255,255,255,0.94)', lineHeight: 1.4, textAlign: 'center' },
          'Réponse : C — un score faible est un diagnostic, pas une condamnation.')),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 49 — Synthèse 1.3                                             */
/* ------------------------------------------------------------------ */
export function slide49() {
  const rap = (n, txt) =>
    d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 28 }, [
      d({
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: 58, height: 58, borderRadius: 17, background: C.orangeGrad, flexShrink: 0,
        fontFamily: F.display, fontWeight: 700, fontSize: 27, color: '#FFFFFF', lineHeight: 1,
      }, String(n)),
      d({ fontFamily: F.body, fontWeight: 500, fontSize: 32, lineHeight: 1.4, color: 'rgba(255,255,255,0.95)' }, txt),
    ]);

  return slide({
    page: 51,
    headerOpts: { crumb: CRUMB, seq: SEQ3 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Synthèse de la séquence')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('Ce que vous retenez', 78)),

      d({ display: 'flex', flexDirection: 'column', gap: 36, marginTop: 52 }, [
        rap(1, 'Choisir protège votre temps, votre argent, votre énergie.'),
        rap(2, '5 critères notés de 1 à 5 : la grille décide pour vous.'),
        rap(3, 'Deux idées seulement continuent vers la suite.'),
      ]),

      d({ display: 'flex', justifyContent: 'center', alignItems: 'center', background: C.orangeSoft, border: `1px solid ${C.orangeBorder}`, borderRadius: 18, padding: '26px 40px', marginTop: 54 }, [
        icon('flag', 30, ORANGE, 2),
        d({ fontFamily: F.body, fontWeight: 500, fontSize: 30, color: 'rgba(255,255,255,0.94)', lineHeight: 1.4 },
          'Action : complétez votre grille FOLO aujourd\u2019hui.'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 50 — Progression + transition 1.4                             */
/* ------------------------------------------------------------------ */
export function slide50() {
  const row = (label, pct, done) =>
    d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 22 }, [
      done
        ? d({ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 46, height: 46, borderRadius: 23, background: C.orangeGrad }, icon('check', 23, '#FFFFFF', 3))
        : d({ width: 46, height: 46, borderRadius: 23, background: 'rgba(12,27,49,0.12)' }),
      d({ fontFamily: F.body, fontWeight: 700, fontSize: 31, color: done ? MC.ink : MC.inkSoft, lineHeight: 1.3, flex: 1 }, label),
      d({ fontFamily: F.display, fontWeight: 800, fontSize: 31, color: done ? ORANGE : 'rgba(12,27,49,0.35)', lineHeight: 1 }, pct),
    ]);

  return slide({
    page: 52,
    headerOpts: { crumb: CRUMB, seq: SEQ3 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Progression')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('Séquence 1.3 terminée', 78)),

      d({ ...lightCard(), display: 'flex', flexDirection: 'column', gap: 26, padding: '42px 54px', marginTop: 44, alignSelf: 'center', width: 1300 }, [
        row('Séquence 1.1 · Sources d\u2019opportunités', '25 %', true),
        row('Séquence 1.2 · Techniques de créativité', '50 %', true),
        row('Séquence 1.3 · Critères de sélection', '75 %', true),
        row('Séquence 1.4 · Du problème au test', '100 %', false),
      ]),

      d({ ...lightCard(), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, padding: '32px 54px', borderRadius: 28, marginTop: 40, alignSelf: 'center' }, [
        d({ fontFamily: F.body, fontWeight: 700, fontSize: 32, color: MC.ink, lineHeight: 1.3, textAlign: 'center' },
          'Prochaine séquence : Du problème au test · 20 min'),
        d({ display: 'flex', flexDirection: 'row', gap: 22 }, [button('Continuer', 'arrowRight')]),
      ]),
    ],
  });
}

export const LOT_05 = [slide41, slide42, slide43, slide43b, slide44, slide45, slide46, slide47, slide48, slide49, slide50];
