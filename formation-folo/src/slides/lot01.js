// ---------------------------------------------------------------------------
// FOLO — LOT N° 1 : slides 01 à 10
// Introduction générale (01-03) + Module 1 « COMPRENDRE », séquences 1-2 (04-10)
// Règle : une idée = un slide.
// ---------------------------------------------------------------------------
import { d } from '../el.js';
import { C, F, T, W, H } from '../theme.js';
import { slide, kicker, panel, pill, progressBar } from '../ds.js';
import { icon, triStrip, dotGrid, arcs, logoMark } from '../icons.js';

const ORANGE = C.orange;
const GREY = C.grey;
const DIM = C.greyDim;

/* ------------------------------------------------------------------ */
/* SLIDE 01 — Ouverture : couverture de la formation                   */
/* ------------------------------------------------------------------ */
export function slide01() {
  return d(
    { display: 'flex', flexDirection: 'column', width: W, height: H, background: C.bg, position: 'relative', overflow: 'hidden' },
    [
      // Motifs (subtils, jamais derrière le texte)
      d({ position: 'absolute', top: 96, right: 110 }, dotGrid(9, 9, 30, 2.6, 'rgba(255,255,255,0.10)')),
      d({ position: 'absolute', bottom: -190, right: -160 }, arcs(660, [0.42, 0.58, 0.74, 0.9], 'rgba(249,123,44,0.15)', 1.6)),
      d({ position: 'absolute', bottom: -190, left: -260 }, arcs(520, [0.5, 0.72, 0.94], 'rgba(255,255,255,0.05)', 1.4)),

      d(
        {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          paddingLeft: 192,
          paddingRight: 192,
          boxSizing: 'border-box',
        },
        [
          // Surtitre
          d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 22 }, [
            triStrip(4, 11, 9),
            d({ fontFamily: F.body, fontWeight: 600, fontSize: 22, letterSpacing: 5, color: ORANGE, lineHeight: 1 },
              'FORMATION PROFESSIONNELLE · ÉDITION 2026'),
          ]),

          // Marque FOLO
          d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 48, marginTop: 44 }, [
            logoMark(132),
            d({ display: 'flex', flexDirection: 'row', alignItems: 'baseline', lineHeight: 1 }, [
              d({ fontFamily: F.display, fontWeight: 800, fontSize: 236, lineHeight: 1, letterSpacing: 2, color: C.white }, 'FOLO'),
              d({ fontFamily: F.display, fontWeight: 800, fontSize: 236, lineHeight: 1, color: ORANGE }, '.'),
            ]),
          ]),

          // Baseline
          d({ fontFamily: F.display, fontWeight: 600, fontSize: 58, lineHeight: 1.2, color: C.white, marginTop: 36 },
            'De l\u2019idée à l\u2019action.'),

          // Promesse
          d({ ...T.body, fontSize: 32, lineHeight: 1.55, maxWidth: 1260, marginTop: 26 },
            'La méthode complète pour transformer les problèmes qui vous entourent en opportunités, puis en projets concrets et rentables.'),

          // Repères
          d({ display: 'flex', flexDirection: 'row', gap: 16, marginTop: 62 }, [
            pill('8 modules progressifs'),
            pill('Pratique, orientée résultats'),
            pill('Contexte : Afrique de l\u2019Ouest'),
          ]),
        ]
      ),
    ]
  );
}

/* ------------------------------------------------------------------ */
/* SLIDE 02 — Promesse : avant / après (comparaison)                   */
/* ------------------------------------------------------------------ */
export function slide02() {
  const avant = [
    'Des idées en tête, mais aucune méthode pour les concrétiser.',
    'La peur de vous tromper et de perdre votre argent.',
    'L\u2019impression de tourner en rond, sans savoir par où commencer.',
  ];
  const apres = [
    'Une méthode simple pour repérer de vraies opportunités.',
    'Une idée choisie, testée et validée sur le terrain.',
    'Un projet prêt à lancer, construit étape par étape.',
  ];
  const item = (txt, iconName, iconColor) =>
    d({ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 20 }, [
      d({ marginTop: 5 }, icon(iconName, 24, iconColor, 2.2)),
      d({ fontFamily: F.body, fontWeight: 400, fontSize: 27, lineHeight: 1.5, color: GREY, flex: 1 }, txt),
    ]);

  return slide({
    page: 2,
    headerOpts: { crumb: 'Introduction', rightText: 'Parcours en 8 modules' },
    bgExtras: [d({ position: 'absolute', top: 120, right: -180 }, arcs(460, [0.5, 0.72, 0.94], 'rgba(255,255,255,0.05)', 1.4))],
    children: [
      kicker('La promesse FOLO'),
      d({ ...T.display, marginTop: 26 }, 'Ce que cette formation va changer'),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: 34, flex: 1, marginTop: 46, marginBottom: 34 }, [
        // AVANT
        d({ ...panel(), flex: 1, display: 'flex', flexDirection: 'column', gap: 30, padding: 50 }, [
          d({ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, [
            d({ fontFamily: F.body, fontWeight: 700, fontSize: 20, letterSpacing: 3.2, color: DIM, lineHeight: 1 }, 'AVANT LA FORMATION'),
            icon('x', 26, 'rgba(143,161,184,0.8)', 2.2),
          ]),
          ...avant.map((t) => item(t, 'x', 'rgba(143,161,184,0.85)')),
        ]),
        // Flèche
        d({ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }, [
          d({
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: 104, height: 104, borderRadius: 52,
            background: C.orangeSoft, border: `2px solid ${C.orangeBorder}`,
          }, icon('arrowRight', 46, ORANGE, 2.2)),
        ]),
        // APRÈS
        d({ ...panel({ background: C.orangeSoft, border: `1.5px solid ${C.orangeBorder}` }), flex: 1, display: 'flex', flexDirection: 'column', gap: 30, padding: 50 }, [
          d({ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, [
            d({ fontFamily: F.body, fontWeight: 700, fontSize: 20, letterSpacing: 3.2, color: ORANGE, lineHeight: 1 }, 'APRÈS LA FORMATION'),
            icon('check', 26, ORANGE, 2.4),
          ]),
          ...apres.map((t) => item(t, 'check', ORANGE)),
        ]),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 22 }, [
        d({ width: 6, height: 44, borderRadius: 3, background: ORANGE }),
        d({ fontFamily: F.body, fontWeight: 500, fontSize: 28, color: 'rgba(255,255,255,0.92)', lineHeight: 1.4 },
          'Pas de théorie inutile : chaque module vous fait produire un résultat concret.'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 03 — Progression : le parcours en 8 étapes                    */
/* ------------------------------------------------------------------ */
export function slide03() {
  const steps = [
    ['COMPRENDRE', 'Voir les opportunités', 'eye'],
    ['OBSERVER', 'Écouter votre entourage', 'search'],
    ['IDENTIFIER', 'Trouver les problèmes qui comptent', 'target'],
    ['IMAGINER', 'Inventer des solutions', 'bulb'],
    ['SÉLECTIONNER', 'Choisir la meilleure idée', 'check'],
    ['TESTER', 'Valider auprès des clients', 'users'],
    ['CONSTRUIRE', 'Bâtir un projet rentable', 'map'],
    ['AGIR', 'Lancer et ajuster', 'rocket'],
  ];
  const node = ([word, sub, ic], i) => {
    const active = i === 0;
    return d({
      ...panel(active ? { background: C.orangeSoft, border: `1.5px solid ${C.orangeBorder}` } : {}),
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      padding: 32,
    }, [
      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, [
        d({
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          width: 48, height: 48, borderRadius: 12,
          background: active ? C.orangeGrad : 'rgba(255,255,255,0.08)',
          fontFamily: F.display, fontWeight: 700, fontSize: 24, color: C.white, lineHeight: 1,
        }, String(i + 1)),
        icon(ic, 30, active ? ORANGE : 'rgba(199,210,224,0.5)', 2),
      ]),
      d({ fontFamily: F.display, fontWeight: 700, fontSize: 29, letterSpacing: 1, color: C.white, lineHeight: 1.1 }, word),
      d({ fontFamily: F.body, fontWeight: 400, fontSize: 21, lineHeight: 1.4, color: DIM }, sub),
    ]);
  };

  return slide({
    page: 3,
    headerOpts: { crumb: 'Introduction', rightText: 'Votre feuille de route' },
    bgExtras: [d({ position: 'absolute', bottom: -160, right: -140 }, arcs(440, [0.5, 0.72, 0.94], 'rgba(249,123,44,0.10)', 1.4))],
    children: [
      kicker('Le parcours FOLO'),
      d({ ...T.display, marginTop: 26 }, 'Huit étapes pour passer de l\u2019idée à l\u2019action'),

      d({ display: 'flex', flexDirection: 'column', gap: 24, flex: 1, marginTop: 44, marginBottom: 30 }, [
        d({ display: 'flex', flexDirection: 'row', gap: 24 }, steps.slice(0, 4).map((s, i) => node(s, i))),
        d({ display: 'flex', flexDirection: 'row', gap: 24 }, steps.slice(4).map((s, i) => node(s, i + 4))),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 22 }, [
        icon('flag', 26, ORANGE, 2),
        d({ fontFamily: F.body, fontWeight: 400, fontSize: 25, color: GREY, lineHeight: 1.45 },
          'Chaque module s\u2019appuie sur le précédent et se termine par un livrable concret. Vous avancez pas à pas, sans brûler d\u2019étape.'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 04 — Ouverture du module 1                                    */
/* ------------------------------------------------------------------ */
export function slide04() {
  return slide({
    page: 4,
    headerOpts: { crumb: 'Module 1 · Comprendre', module: { n: 1, total: 8 } },
    bgExtras: [d({ position: 'absolute', top: 110, left: 560 }, dotGrid(7, 7, 30, 2.4, 'rgba(255,255,255,0.07)'))],
    children: [
      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1, gap: 60 }, [
        d({ display: 'flex', flexDirection: 'column', flex: 1 }, [
          kicker('Module 1 — Comprendre'),
          d({ fontFamily: F.display, fontWeight: 800, fontSize: 92, lineHeight: 1.08, color: C.white, marginTop: 34, maxWidth: 1040 },
            'Les opportunités sont partout'),
          d({ ...T.body, fontSize: 32, lineHeight: 1.55, maxWidth: 960, marginTop: 34 },
            'Apprenez à voir les problèmes du quotidien comme le point de départ de tous les projets qui réussissent.'),
          d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 26, marginTop: 64 }, [
            pill('Séquence 1 sur 4', { color: C.white }),
            progressBar(1, 4),
          ]),
        ]),
        // Composition décorative : le numéro du module
        d({ display: 'flex', position: 'relative', width: 560, height: 720, marginRight: 20 }, [
          d({ position: 'absolute', top: 80, left: 60 }, arcs(440, [0.42, 0.58, 0.74, 0.9], 'rgba(249,123,44,0.20)', 1.8)),
          d({
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
          },
            d({ fontFamily: F.display, fontWeight: 800, fontSize: 330, lineHeight: 1, color: 'rgba(255,255,255,0.10)' }, '01')),
          d({ position: 'absolute', bottom: 46, left: 0, right: 0, display: 'flex', justifyContent: 'center' },
            triStrip(5, 13, 11)),
        ]),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 05 — Objectifs du module 1                                    */
/* ------------------------------------------------------------------ */
export function slide05() {
  const objectives = [
    'Découvrir ce qu\u2019est vraiment une opportunité d\u2019affaires — et ce qu\u2019elle n\u2019est pas.',
    'Comprendre la différence entre une simple idée et une vraie opportunité.',
    'Adopter le réflexe FOLO : partir du problème, jamais de l\u2019idée.',
  ];
  return slide({
    page: 5,
    headerOpts: { crumb: 'Module 1 · Comprendre', seq: { n: 1, total: 4 } },
    children: [
      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, [
        kicker('Objectifs du module'),
        d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, border: `1px solid ${C.hairline}`, borderRadius: 999, padding: '11px 22px', background: 'rgba(255,255,255,0.03)' }, [
          icon('clock', 19, DIM, 2.2),
          d({ fontFamily: F.body, fontWeight: 600, fontSize: 16, letterSpacing: 2.6, color: DIM, lineHeight: 1 }, 'ENV. 15 MIN'),
        ]),
      ]),
      d({ ...T.display, marginTop: 28 }, 'Dans ce module, vous allez…'),

      d({ display: 'flex', flexDirection: 'column', flex: 1, marginTop: 34 }, objectives.map((txt, i) =>
        d({
          display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 34,
          paddingTop: 38, paddingBottom: 38,
          ...(i === 0 ? {} : { borderTop: `1px solid ${C.hairline}` }),
        }, [
          d({
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: 62, height: 62, borderRadius: 16, background: C.orangeGrad, flexShrink: 0,
            fontFamily: F.display, fontWeight: 700, fontSize: 28, color: C.white, lineHeight: 1,
          }, String(i + 1)),
          d({ fontFamily: F.body, fontWeight: 400, fontSize: 31, lineHeight: 1.45, color: 'rgba(255,255,255,0.94)', maxWidth: 1420 }, txt),
        ])
      )),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 4 }, [
        icon('check', 24, ORANGE, 2.4),
        d({ fontFamily: F.body, fontWeight: 400, fontSize: 24, color: DIM, lineHeight: 1.4 },
          'Chaque objectif sera repris dans la synthèse finale du module.'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 06 — Concept : définition de l'opportunité                    */
/* ------------------------------------------------------------------ */
export function slide06() {
  const mini = (ic, title, sub) =>
    d({ ...panel(), flex: 1, display: 'flex', flexDirection: 'column', gap: 18, padding: 34 }, [
      d({ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 56, height: 56, borderRadius: 14, background: C.orangeSoft },
        icon(ic, 28, ORANGE, 2)),
      d({ fontFamily: F.display, fontWeight: 700, fontSize: 25, letterSpacing: 0.6, color: ORANGE, lineHeight: 1.15 }, title),
      d({ fontFamily: F.body, fontWeight: 400, fontSize: 22, lineHeight: 1.45, color: C.grey }, sub),
    ]);

  return slide({
    page: 6,
    headerOpts: { crumb: 'Module 1 · Comprendre', seq: { n: 1, total: 4 } },
    bgExtras: [d({ position: 'absolute', top: 150, right: 70 }, dotGrid(6, 6, 28, 2.4, 'rgba(255,255,255,0.06)'))],
    children: [
      kicker('Notion essentielle'),
      d({ ...T.display, marginTop: 26 }, 'Qu\u2019est-ce qu\u2019une opportunité d\u2019affaires ?'),

      // Définition
      d({ ...panel(), display: 'flex', flexDirection: 'column', gap: 26, padding: '52px 64px', marginTop: 40 }, [
        d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18 }, [
          d({ width: 44, height: 4, borderRadius: 2, background: ORANGE }),
          d({ fontFamily: F.body, fontWeight: 700, fontSize: 19, letterSpacing: 3.4, color: DIM, lineHeight: 1 }, 'DÉFINITION'),
        ]),
        d({ fontFamily: F.body, fontWeight: 500, fontSize: 42, lineHeight: 1.48, color: C.white, maxWidth: 1560 },
          'Une opportunité d\u2019affaires est un problème réel, vécu par des personnes prêtes à payer pour une solution.'),
      ]),

      // Les trois piliers
      d({ display: 'flex', flexDirection: 'row', gap: 28, marginTop: 36, flex: 1, alignItems: 'stretch' }, [
        mini('target', 'UN PROBLÈME RÉEL', 'Concret, observé autour de vous — pas une supposition.'),
        mini('bulb', 'UNE SOLUTION UTILE', 'Une réponse simple qui améliore vraiment la situation.'),
        mini('coins', 'DES CLIENTS QUI PAIENT', 'Des personnes prêtes à payer, dès maintenant.'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 07 — Méthode : le réflexe FOLO                                */
/* ------------------------------------------------------------------ */
export function slide07() {
  const step = (num, ic, title, body) =>
    d({ ...panel(), flex: 1, display: 'flex', flexDirection: 'column', gap: 22, padding: '46px 42px' }, [
      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, [
        d({ fontFamily: F.display, fontWeight: 800, fontSize: 42, color: ORANGE, lineHeight: 1 }, num),
        icon(ic, 34, 'rgba(199,210,224,0.55)', 2),
      ]),
      d({ fontFamily: F.display, fontWeight: 700, fontSize: 34, color: C.white, lineHeight: 1.1 }, title),
      d({ fontFamily: F.body, fontWeight: 400, fontSize: 25, lineHeight: 1.55, color: GREY }, body),
    ]);
  const arrow = () =>
    d({ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 44 },
      icon('arrowRight', 40, ORANGE, 2.2));

  return slide({
    page: 7,
    headerOpts: { crumb: 'Module 1 · Comprendre', seq: { n: 1, total: 4 } },
    bgExtras: [d({ position: 'absolute', bottom: -170, left: -170 }, arcs(430, [0.5, 0.72, 0.94], 'rgba(255,255,255,0.05)', 1.4))],
    children: [
      kicker('La méthode'),
      d({ ...T.display, marginTop: 26 }, 'Le réflexe FOLO'),
      d({ ...T.body, fontSize: 30, maxWidth: 1250, marginTop: 20 },
        'Tous les projets qui durent suivent le même chemin, dans le même ordre.'),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: 26, flex: 1, marginTop: 46, marginBottom: 36 }, [
        step('01', 'alert', 'LE PROBLÈME', 'Des personnes perdent de l\u2019argent, du temps ou de l\u2019énergie à cause d\u2019une situation précise.'),
        arrow(),
        step('02', 'bulb', 'LA SOLUTION', 'Une réponse simple qui règle cette situation mieux que ce qui existe déjà.'),
        arrow(),
        step('03', 'coins', 'LE CLIENT', 'Des personnes prêtes à payer pour cette réponse, dès aujourd\u2019hui.'),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 22, background: C.orangeSoft, border: `1px solid ${C.orangeBorder}`, borderRadius: 18, padding: '26px 36px' }, [
        icon('target', 28, ORANGE, 2),
        d({ fontFamily: F.body, fontWeight: 500, fontSize: 27, color: 'rgba(255,255,255,0.94)', lineHeight: 1.4 },
          'Retenez l\u2019ordre : le problème d\u2019abord, l\u2019idée ensuite. C\u2019est le secret de toute la formation.'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 08 — Exemple contextualisé : Ouagadougou                      */
/* ------------------------------------------------------------------ */
export function slide08() {
  const block = (ic, label, txt, divider = true) =>
    d({ display: 'flex', flexDirection: 'column', gap: 16, ...(divider ? { borderBottom: `1px solid ${C.hairline}`, paddingBottom: 30 } : {}) }, [
      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14 }, [
        icon(ic, 22, ORANGE, 2.2),
        d({ fontFamily: F.body, fontWeight: 700, fontSize: 18, letterSpacing: 3.2, color: ORANGE, lineHeight: 1 }, label),
      ]),
      d({ fontFamily: F.body, fontWeight: 400, fontSize: 27, lineHeight: 1.5, color: 'rgba(255,255,255,0.93)' }, txt),
    ]);

  return slide({
    page: 8,
    headerOpts: { crumb: 'Module 1 · Comprendre', seq: { n: 1, total: 4 } },
    bgExtras: [d({ position: 'absolute', top: 130, right: 60 }, dotGrid(6, 5, 28, 2.4, 'rgba(255,255,255,0.06)'))],
    children: [
      kicker('Exemple concret · Ouagadougou'),
      d({ ...T.display, marginTop: 26 }, 'Quand un problème devient une affaire'),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: 36, flex: 1, marginTop: 42 }, [
        // Le récit
        d({ ...panel(), flex: 1.3, display: 'flex', flexDirection: 'column', gap: 30, padding: '48px 54px' }, [
          block('alert', 'LE PROBLÈME', 'Au grand marché de Ouagadougou, les vendeuses de légumes perdent une partie de leur marchandise, faute de chambre froide.'),
          block('bulb', 'L\u2019IDÉE', 'Un jeune entrepreneur installe une chambre froide solaire, partagée entre les vendeuses et payée à l\u2019usage.'),
          block('trendUp', 'LE RÉSULTAT', 'Les pertes diminuent, les vendeuses gagnent davantage, et le service se paie facilement.', false),
        ]),
        // La leçon
        d({ display: 'flex', flexDirection: 'column', gap: 28, flex: 1 }, [
          d({ ...panel({ background: C.orangeSoft, border: `1.5px solid ${C.orangeBorder}` }), display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26, padding: '46px 46px', flex: 1 }, [
            d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18 }, [
              d({ fontFamily: F.body, fontWeight: 700, fontSize: 19, letterSpacing: 3.4, color: ORANGE, lineHeight: 1 }, 'LA LEÇON'),
              triStrip(3, 10, 8),
            ]),
            d({ fontFamily: F.display, fontWeight: 600, fontSize: 33, lineHeight: 1.38, color: C.white },
              'Le marché existe depuis des années. Seul le regard a changé : quelqu\u2019un a vu le problème avant les autres.'),
          ]),
          d({ ...panel(), display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18, padding: '26px 32px' }, [
            icon('map', 26, DIM, 2),
            d({ fontFamily: F.body, fontWeight: 400, fontSize: 21, lineHeight: 1.4, color: DIM },
              'Cas inspiré d\u2019initiatives réelles de froid solaire en Afrique de l\u2019Ouest.'),
          ]),
        ]),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 09 — Comparaison : idée ≠ opportunité                         */
/* ------------------------------------------------------------------ */
export function slide09() {
  const card = ({ label, labelColor, ic, icBg, quote, verdict, accent }) =>
    d({
      ...panel(accent ? { background: C.orangeSoft, border: `1.5px solid ${C.orangeBorder}` } : {}),
      flex: 1, display: 'flex', flexDirection: 'column', gap: 30, padding: '48px 52px',
    }, [
      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }, [
        d({ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 52, height: 52, borderRadius: 14, background: icBg },
          icon(ic, 26, accent ? ORANGE : 'rgba(143,161,184,0.9)', 2.2)),
        d({ fontFamily: F.body, fontWeight: 700, fontSize: 21, letterSpacing: 3.2, color: labelColor, lineHeight: 1 }, label),
      ]),
      d({ fontFamily: F.body, fontWeight: 400, fontSize: 32, lineHeight: 1.5, color: 'rgba(255,255,255,0.95)', flex: 1 }, quote),
      d({ borderTop: `1px solid ${C.hairline}`, paddingTop: 24, fontFamily: F.body, fontWeight: 500, fontSize: 24, lineHeight: 1.4, color: accent ? 'rgba(255,255,255,0.88)' : DIM }, verdict),
    ]);

  return slide({
    page: 9,
    headerOpts: { crumb: 'Module 1 · Comprendre', seq: { n: 2, total: 4 } },
    bgExtras: [d({ position: 'absolute', bottom: -180, right: -150 }, arcs(460, [0.5, 0.72, 0.94], 'rgba(249,123,44,0.10)', 1.4))],
    children: [
      kicker('La distinction clé'),
      d({ ...T.display, marginTop: 26 }, 'Une idée n\u2019est pas une opportunité'),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: 36, flex: 1, marginTop: 42, marginBottom: 34 }, [
        card({
          label: 'UNE SIMPLE IDÉE', labelColor: DIM, ic: 'x', icBg: 'rgba(255,255,255,0.07)',
          quote: '« Je veux ouvrir un maquis, parce que j\u2019aime cuisiner. »',
          verdict: 'Une envie personnelle, qui reste à vérifier.',
          accent: false,
        }),
        card({
          label: 'UNE PISTE D\u2019OPPORTUNITÉ', labelColor: ORANGE, ic: 'target', icBg: 'rgba(249,123,44,0.16)',
          quote: '« Près du chantier de Zongo, des centaines d\u2019ouvriers n\u2019ont aucun point de restauration abordable le midi. »',
          verdict: 'Un besoin observé, précis, qui touche beaucoup de monde.',
          accent: true,
        }),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 22 }, [
        d({ width: 6, height: 48, borderRadius: 3, background: ORANGE }),
        d({ fontFamily: F.display, fontWeight: 600, fontSize: 32, color: C.white, lineHeight: 1.3 },
          'La différence ? L\u2019idée part de vous. L\u2019opportunité part des autres.'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 10 — Question : pause de réflexion                            */
/* ------------------------------------------------------------------ */
export function slide10() {
  return slide({
    page: 10,
    headerOpts: { crumb: 'Module 1 · Comprendre', seq: { n: 2, total: 4 } },
    bgExtras: [
      d({ position: 'absolute', top: 190, left: 640 }, arcs(640, [0.42, 0.58, 0.74, 0.9], 'rgba(249,123,44,0.10)', 1.6)),
      d({ position: 'absolute', top: 140, left: 140 }, dotGrid(6, 6, 30, 2.4, 'rgba(255,255,255,0.06)')),
      d({ position: 'absolute', bottom: 150, right: 130 }, dotGrid(6, 6, 30, 2.4, 'rgba(255,255,255,0.06)')),
    ],
    children: [
      d({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 40 }, [
        d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }, [
          triStrip(4, 11, 9),
          d({ fontFamily: F.body, fontWeight: 600, fontSize: 22, letterSpacing: 5, color: ORANGE, lineHeight: 1 }, 'À VOUS DE RÉFLÉCHIR'),
          triStrip(4, 11, 9),
        ]),
        d({
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          width: 116, height: 116, borderRadius: 58,
          background: C.orangeSoft, border: `2px solid ${C.orangeBorder}`, marginTop: 6,
        }, icon('question', 54, ORANGE, 2)),
        d({
          fontFamily: F.display, fontWeight: 700, fontSize: 60, lineHeight: 1.3, color: C.white,
          textAlign: 'center', maxWidth: 1520, marginTop: 6,
        }, 'Et vous, autour de vous, qui perd de l\u2019argent, du temps ou de l\u2019énergie chaque jour ?'),
        d({ fontFamily: F.body, fontWeight: 400, fontSize: 29, lineHeight: 1.5, color: GREY, textAlign: 'center', maxWidth: 1080 },
          'Notez votre première réponse, même imparfaite : elle vous servira dès la prochaine séquence.'),
        pill('Prochaine séquence : les problèmes, des trésors cachés', { size: 17 }),
      ]),
    ],
  });
}

export const LOT_01 = [slide01, slide02, slide03, slide04, slide05, slide06, slide07, slide08, slide09, slide10];
