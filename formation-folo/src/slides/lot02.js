// ---------------------------------------------------------------------------
// FOLO — LOT N° 2 : slides 11 à 20
// Module 1 · Séquence 1.1 « Sources d'opportunités » (script client de référence)
// ---------------------------------------------------------------------------
import { d } from '../el.js';
import { C, F, T } from '../theme.js';
import { slide, kicker, panel, pill, progressBar } from '../ds.js';
import { icon, triStrip, dotGrid, arcs } from '../icons.js';

const ORANGE = C.orange;
const GREY = C.grey;
const DIM = C.greyDim;
const CRUMB = 'Module 1.1 · Sources d\u2019opportunités';
const SEQ1 = { n: 1, total: 4 };

/* ------------------------------------------------------------------ */
/* SLIDE 11 — Ouverture de la séquence 1.1                             */
/* ------------------------------------------------------------------ */
export function slide11() {
  const livrable = (txt) =>
    d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }, [
      icon('check', 26, ORANGE, 2.4),
      d({ fontFamily: F.body, fontWeight: 400, fontSize: 29, lineHeight: 1.45, color: 'rgba(255,255,255,0.94)' }, txt),
    ]);

  return slide({
    page: 11,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    bgExtras: [d({ position: 'absolute', top: 130, right: 70 }, dotGrid(7, 6, 28, 2.4, 'rgba(255,255,255,0.06)'))],
    children: [
      kicker('Séquence 1.1 · Env. 15 minutes'),
      d({ fontFamily: F.display, fontWeight: 800, fontSize: 88, lineHeight: 1.08, color: C.white, marginTop: 30, maxWidth: 1200 },
        'Sources d\u2019opportunités'),
      d({ ...T.body, fontSize: 31, maxWidth: 1150, marginTop: 28 },
        'Où se cachent les bonnes idées de projet ? Dans cette séquence, vous apprenez à les repérer à trois endroits précis.'),

      d({ ...panel(), display: 'flex', flexDirection: 'column', gap: 30, padding: '46px 54px', marginTop: 46, maxWidth: 1180 }, [
        d({ fontFamily: F.body, fontWeight: 700, fontSize: 20, letterSpacing: 3.2, color: ORANGE, lineHeight: 1 },
          'À LA FIN DE CETTE SÉQUENCE, VOUS AUREZ :'),
        livrable('Identifié 3 sources d\u2019opportunités autour de vous.'),
        livrable('Noté 5 idées de projets potentielles.'),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 26, marginTop: 52 }, [
        progressBar(1, 4, 64),
        d({ fontFamily: F.body, fontWeight: 600, fontSize: 22, letterSpacing: 2, color: DIM, lineHeight: 1 }, '25 % DU MODULE'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 12 — Accroche : la question qui déclenche                     */
/* ------------------------------------------------------------------ */
export function slide12() {
  return slide({
    page: 12,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    bgExtras: [
      d({ position: 'absolute', top: 210, left: 620 }, arcs(660, [0.42, 0.58, 0.74, 0.9], 'rgba(249,123,44,0.10)', 1.6)),
      d({ position: 'absolute', bottom: 150, right: 120 }, dotGrid(6, 5, 30, 2.4, 'rgba(255,255,255,0.06)')),
    ],
    children: [
      d({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 42 }, [
        kicker('Le départ de tout projet'),
        d({
          fontFamily: F.display, fontWeight: 700, fontSize: 62, lineHeight: 1.3, color: C.white,
          textAlign: 'center', maxWidth: 1460,
        }, '« Les meilleures opportunités naissent des problèmes non résolus. »'),
        d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }, [
          d({ width: 56, height: 4, borderRadius: 2, background: ORANGE }),
        ]),
        d({ fontFamily: F.display, fontWeight: 600, fontSize: 40, lineHeight: 1.35, color: ORANGE, textAlign: 'center', maxWidth: 1200 },
          'Et vous, qu\u2019est-ce qui vous fruste dans votre quotidien ?'),
        d({ fontFamily: F.body, fontWeight: 400, fontSize: 26, color: DIM, lineHeight: 1.4 },
          'Prenez 30 secondes pour y penser, maintenant.'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 13 — Source 1 : le mécanisme problème → opportunité           */
/* ------------------------------------------------------------------ */
export function slide13() {
  const maillon = (txt, last = false) =>
    d({
      ...(last ? { background: C.orangeSoft, border: `1.5px solid ${C.orangeBorder}` } : { background: C.panel, border: `1px solid ${C.hairline}` }),
      borderRadius: 22,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '30px 40px',
    },
      d({
        fontFamily: F.display, fontWeight: 700, fontSize: 34, letterSpacing: 1, lineHeight: 1.1,
        color: last ? ORANGE : C.white, textAlign: 'center',
      }, txt));

  return slide({
    page: 13,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    bgExtras: [d({ position: 'absolute', bottom: -160, left: -160 }, arcs(430, [0.5, 0.72, 0.94], 'rgba(255,255,255,0.05)', 1.4))],
    children: [
      kicker('Source 1'),
      d({ ...T.display, marginTop: 26 }, 'Les problèmes du quotidien'),

      d({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, flex: 1, justifyContent: 'center', marginTop: 10, marginBottom: 16 }, [
        maillon('FRUSTRATIONS PERSONNELLES'),
        icon('arrowDown', 38, ORANGE, 2.2),
        maillon('BESOINS NON SATISFAITS'),
        icon('arrowDown', 38, ORANGE, 2.2),
        maillon('OPPORTUNITÉ D\u2019AFFAIRES', true),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 22 }, [
        d({ width: 6, height: 44, borderRadius: 3, background: ORANGE }),
        d({ fontFamily: F.body, fontWeight: 500, fontSize: 28, color: 'rgba(255,255,255,0.92)', lineHeight: 1.4 },
          'Chaque frustration que vous vivez est peut-être vécue par des centaines de personnes.'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 14 — Source 1 : deux exemples concrets                        */
/* ------------------------------------------------------------------ */
export function slide14() {
  const ex = (probleme, solution) =>
    d({ ...panel(), flex: 1, display: 'flex', flexDirection: 'column', gap: 26, padding: '44px 48px' }, [
      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }, [
        icon('alert', 24, DIM, 2.2),
        d({ fontFamily: F.body, fontWeight: 700, fontSize: 19, letterSpacing: 3, color: DIM, lineHeight: 1 }, 'PROBLÈME OBSERVÉ'),
      ]),
      d({ fontFamily: F.body, fontWeight: 500, fontSize: 32, lineHeight: 1.4, color: 'rgba(255,255,255,0.95)' }, probleme),
      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }, icon('arrowDown', 32, ORANGE, 2.2)),
      d({ fontFamily: F.body, fontWeight: 500, fontSize: 32, lineHeight: 1.4, color: ORANGE }, solution),
    ]);

  return slide({
    page: 14,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    bgExtras: [d({ position: 'absolute', top: 140, right: 60 }, dotGrid(6, 5, 28, 2.4, 'rgba(255,255,255,0.06)'))],
    children: [
      kicker('Source 1 · Exemples'),
      d({ ...T.display, marginTop: 26 }, 'Chaque problème cache une piste'),

      d({ display: 'flex', flexDirection: 'row', gap: 36, flex: 1, alignItems: 'stretch', marginTop: 46 }, [
        ex('Des coupures d\u2019électricité trop fréquentes.', 'Des solutions solaires locales, accessibles.'),
        ex('Se déplacer en ville reste compliqué.', 'Des services de livraison et de mobilité malins.'),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 22, marginTop: 40 }, [
        icon('bulb', 28, ORANGE, 2),
        d({ fontFamily: F.body, fontWeight: 500, fontSize: 27, color: GREY, lineHeight: 1.4 },
          'Ne dites plus « c\u2019est énervant ». Dites : « tiens, une opportunité ». '),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 15 — Exercice : identifier 3 problèmes                        */
/* ------------------------------------------------------------------ */
export function slide15() {
  const item = (n, txt) =>
    d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 30 }, [
      d({
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: 58, height: 58, borderRadius: 16, background: C.orangeGrad, flexShrink: 0,
        fontFamily: F.display, fontWeight: 700, fontSize: 26, color: C.white, lineHeight: 1,
      }, String(n)),
      d({ fontFamily: F.body, fontWeight: 400, fontSize: 31, lineHeight: 1.45, color: 'rgba(255,255,255,0.94)' }, txt),
    ]);

  return slide({
    page: 15,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    children: [
      kicker('Exercice pratique'),
      d({ ...T.display, marginTop: 26 }, 'Identifiez 3 problèmes'),
      d({ ...T.body, fontSize: 29, maxWidth: 1300, marginTop: 20 },
        'Prenez un papier, un crayon, et notez dès maintenant :'),

      d({ display: 'flex', flexDirection: 'column', gap: 40, marginTop: 48 }, [
        item(1, 'Ce qui vous énerve chez vous, presque chaque jour.'),
        item(2, 'Ce qui manque dans votre quartier.'),
        item(3, 'Ce que vos proches recherchent sans trouver.'),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }, [
        d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14, border: `1px solid ${C.hairline}`, borderRadius: 999, padding: '13px 26px', background: 'rgba(255,255,255,0.03)' }, [
          icon('clock', 20, DIM, 2.2),
          d({ fontFamily: F.body, fontWeight: 600, fontSize: 17, letterSpacing: 2.6, color: DIM, lineHeight: 1 }, 'TEMPS : 3 MINUTES'),
        ]),
        d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14, border: `1.5px solid ${C.orangeBorder}`, borderRadius: 999, padding: '13px 26px', background: C.orangeSoft }, [
          icon('download', 20, ORANGE, 2.2),
          d({ fontFamily: F.body, fontWeight: 600, fontSize: 17, letterSpacing: 2.2, color: ORANGE, lineHeight: 1 }, 'TÉLÉCHARGER LA FICHE EXERCICE'),
        ]),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 16 — Source 2 : les tendances émergentes                      */
/* ------------------------------------------------------------------ */
export function slide16() {
  const trend = (ic, txt) =>
    d({ ...panel(), flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18, padding: '26px 30px' }, [
      icon(ic, 30, ORANGE, 2),
      d({ fontFamily: F.body, fontWeight: 500, fontSize: 25, lineHeight: 1.3, color: 'rgba(255,255,255,0.93)' }, txt),
    ]);

  return slide({
    page: 16,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    bgExtras: [d({ position: 'absolute', bottom: -170, right: -150 }, arcs(450, [0.5, 0.72, 0.94], 'rgba(249,123,44,0.10)', 1.4))],
    children: [
      kicker('Source 2'),
      d({ ...T.display, marginTop: 26 }, 'Les tendances émergentes'),

      d({ display: 'flex', flexDirection: 'column', gap: 24, flex: 1, marginTop: 48 }, [
        d({ display: 'flex', flexDirection: 'row', gap: 24 }, [
          trend('rocket', 'Digitalisation croissante'),
          trend('leaf', 'Économie verte et locale'),
        ]),
        d({ display: 'flex', flexDirection: 'row', gap: 24 }, [
          trend('users', 'Services collaboratifs'),
          trend('gradcap', 'Formation en ligne'),
        ]),
        d({ display: 'flex', flexDirection: 'row', gap: 24 }, [
          trend('coins', 'Mobile money et paiements simples'),
          d({ flex: 1 }),
        ]),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 22, background: C.orangeSoft, border: `1px solid ${C.orangeBorder}`, borderRadius: 18, padding: '26px 36px' }, [
        icon('trendUp', 28, ORANGE, 2),
        d({ fontFamily: F.body, fontWeight: 500, fontSize: 27, color: 'rgba(255,255,255,0.94)', lineHeight: 1.4 },
          'Une opportunité, c\u2019est anticiper ce dont les gens auront besoin demain.'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 17 — Quiz express : appliquer la source 2 à soi               */
/* ------------------------------------------------------------------ */
export function slide17() {
  const opt = (letter, txt) =>
    d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 26 }, [
      d({
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: 54, height: 54, borderRadius: 27, border: `1.5px solid ${C.hairline}`,
        background: 'rgba(255,255,255,0.04)', flexShrink: 0,
        fontFamily: F.display, fontWeight: 700, fontSize: 24, color: ORANGE, lineHeight: 1,
      }, letter),
      d({ fontFamily: F.body, fontWeight: 400, fontSize: 30, lineHeight: 1.4, color: 'rgba(255,255,255,0.93)' }, txt),
    ]);

  return slide({
    page: 17,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    bgExtras: [d({ position: 'absolute', top: 130, left: 640 }, dotGrid(7, 5, 30, 2.4, 'rgba(255,255,255,0.05)'))],
    children: [
      kicker('Quiz express'),
      d({ ...T.display, marginTop: 26, maxWidth: 1400 }, 'Quelle tendance impacte le plus votre secteur ?'),

      d({ display: 'flex', flexDirection: 'column', gap: 34, marginTop: 52 }, [
        opt('A', 'La digitalisation'),
        opt('B', 'L\u2019économie verte'),
        opt('C', 'Les services collaboratifs'),
        opt('D', 'Une autre tendance, que vous savez nommer'),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 48 }, [
        icon('clock', 24, ORANGE, 2.2),
        d({ fontFamily: F.body, fontWeight: 500, fontSize: 26, color: GREY, lineHeight: 1.4 },
          '10 secondes pour répondre mentalement. Il n\u2019y a pas de mauvais choix : il y a un choix lucide.'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 18 — Source 3 : vos compétences uniques                       */
/* ------------------------------------------------------------------ */
export function slide18() {
  const maillon = (txt) =>
    d({ ...panel(), display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '26px 36px', borderRadius: 20 },
      d({ fontFamily: F.display, fontWeight: 700, fontSize: 29, letterSpacing: 0.8, color: C.white, textAlign: 'center', lineHeight: 1.15 }, txt));

  return slide({
    page: 18,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    bgExtras: [d({ position: 'absolute', top: 150, right: 60 }, dotGrid(6, 6, 28, 2.4, 'rgba(255,255,255,0.06)'))],
    children: [
      kicker('Source 3'),
      d({ ...T.display, marginTop: 26 }, 'Vos compétences uniques'),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 34, flex: 1, marginTop: 8 }, [
        d({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }, [
          maillon('CE QUE VOUS SAVEZ FAIRE'),
          icon('arrowDown', 34, ORANGE, 2.2),
          maillon('CE QUE VOUS AIMEZ FAIRE'),
          icon('arrowDown', 34, ORANGE, 2.2),
          maillon('CE DONT LE MARCHÉ A BESOIN'),
        ]),
        icon('arrowRight', 44, ORANGE, 2.2),
        d({
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6,
          background: C.orangeSoft, border: `1.5px solid ${C.orangeBorder}`, borderRadius: 24,
          padding: '40px 52px',
        }, [
          d({ fontFamily: F.display, fontWeight: 800, fontSize: 36, lineHeight: 1.1, color: ORANGE, textAlign: 'center' }, 'VOTRE'),
          d({ fontFamily: F.display, fontWeight: 800, fontSize: 36, lineHeight: 1.1, color: ORANGE, textAlign: 'center' }, 'OPPORTUNITÉ'),
          d({ fontFamily: F.display, fontWeight: 800, fontSize: 36, lineHeight: 1.1, color: ORANGE, textAlign: 'center' }, 'EN OR'),
        ]),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14, alignSelf: 'flex-start', border: `1.5px solid ${C.orangeBorder}`, borderRadius: 999, padding: '13px 26px', background: C.orangeSoft, marginTop: 10 }, [
        icon('download', 20, ORANGE, 2.2),
        d({ fontFamily: F.body, fontWeight: 600, fontSize: 17, letterSpacing: 2.2, color: ORANGE, lineHeight: 1 }, 'TEMPLATE : FICHE D\u2019ÉVALUATION DES COMPÉTENCES'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 19 — Étude de cas : Fatou, Ouagadougou                        */
/* ------------------------------------------------------------------ */
export function slide19() {
  const block = (ic, label, txt, divider = true) =>
    d({ display: 'flex', flexDirection: 'column', gap: 14, ...(divider ? { borderBottom: `1px solid ${C.hairline}`, paddingBottom: 26 } : {}) }, [
      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14 }, [
        icon(ic, 22, ORANGE, 2.2),
        d({ fontFamily: F.body, fontWeight: 700, fontSize: 18, letterSpacing: 3.2, color: ORANGE, lineHeight: 1 }, label),
      ]),
      d({ fontFamily: F.body, fontWeight: 400, fontSize: 26, lineHeight: 1.5, color: 'rgba(255,255,255,0.93)' }, txt),
    ]);

  return slide({
    page: 19,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    bgExtras: [d({ position: 'absolute', bottom: -170, left: -160 }, arcs(430, [0.5, 0.72, 0.94], 'rgba(255,255,255,0.05)', 1.4))],
    children: [
      kicker('Étude de cas · Ouagadougou'),
      d({ ...T.display, marginTop: 26 }, 'Fatou et les mangues perdues'),

      d({ display: 'flex', flexDirection: 'row', gap: 36, flex: 1, alignItems: 'stretch', marginTop: 40 }, [
        d({ ...panel(), flex: 1.3, display: 'flex', flexDirection: 'column', gap: 26, padding: '42px 50px' }, [
          block('alert', 'LE PROBLÈME', 'Après la récolte, 40 % des mangues perdaient leur valeur, faute de transformation.'),
          block('bulb', 'LA SOLUTION', 'Fatou crée une unité de séchage : les fruits deviennent des mangues sèches, prêtes à vendre.'),
          block('trendUp', 'LE RÉSULTAT, UN AN PLUS TARD', '15 emplois créés, des exports vers les pays voisins, 25 millions de FCFA de chiffre d\u2019affaires.', false),
        ]),
        d({ ...panel({ background: C.orangeSoft, border: `1.5px solid ${C.orangeBorder}` }), flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26, padding: '44px 44px' }, [
          d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18 }, [
            d({ fontFamily: F.body, fontWeight: 700, fontSize: 19, letterSpacing: 3.4, color: ORANGE, lineHeight: 1 }, 'LA LEÇON'),
            triStrip(3, 10, 8),
          ]),
          d({ fontFamily: F.display, fontWeight: 600, fontSize: 33, lineHeight: 1.38, color: C.white },
            'Observer les pertes, c\u2019est observer des opportunités de transformation.'),
        ]),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 20 — Synthèse + action immédiate                              */
/* ------------------------------------------------------------------ */
export function slide20() {
  const rap = (n, txt) =>
    d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 28 }, [
      d({
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: 56, height: 56, borderRadius: 16, background: C.orangeGrad, flexShrink: 0,
        fontFamily: F.display, fontWeight: 700, fontSize: 25, color: C.white, lineHeight: 1,
      }, String(n)),
      d({ fontFamily: F.body, fontWeight: 500, fontSize: 31, lineHeight: 1.4, color: 'rgba(255,255,255,0.95)' }, txt),
    ]);

  return slide({
    page: 20,
    headerOpts: { crumb: CRUMB, seq: SEQ1 },
    children: [
      kicker('Synthèse de la séquence'),
      d({ ...T.display, marginTop: 26 }, 'Ce que vous retenez'),

      d({ display: 'flex', flexDirection: 'column', gap: 36, marginTop: 46 }, [
        rap(1, 'Les problèmes du quotidien'),
        rap(2, 'Les tendances émergentes'),
        rap(3, 'Vos compétences uniques'),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 22, background: C.orangeSoft, border: `1px solid ${C.orangeBorder}`, borderRadius: 18, padding: '26px 36px', marginTop: 50 }, [
        icon('flag', 28, ORANGE, 2),
        d({ fontFamily: F.body, fontWeight: 500, fontSize: 27, color: 'rgba(255,255,255,0.94)', lineHeight: 1.4 },
          'Action immédiate : notez 5 idées de projets issues de ces 3 sources.'),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 40 }, [
        d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14, border: `1.5px solid ${C.orangeBorder}`, borderRadius: 999, padding: '13px 26px', background: C.orangeSoft }, [
          icon('download', 20, ORANGE, 2.2),
          d({ fontFamily: F.body, fontWeight: 600, fontSize: 17, letterSpacing: 2.2, color: ORANGE, lineHeight: 1 }, 'TÉLÉCHARGER LA GRILLE D\u2019IDÉATION'),
        ]),
        d({ fontFamily: F.body, fontWeight: 600, fontSize: 18, letterSpacing: 2.4, color: DIM, lineHeight: 1 },
          'PROCHAINE SÉQUENCE : TECHNIQUES DE CRÉATIVITÉ'),
      ]),
    ],
  });
}

export const LOT_02 = [slide11, slide12, slide13, slide14, slide15, slide16, slide17, slide18, slide19, slide20];
