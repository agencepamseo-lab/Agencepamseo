// ---------------------------------------------------------------------------
// FOLO — LOT N° 4 : slides 31 à 40 — Séquence 1.2 « Techniques de créativité »
// Édition mobile (standard +15 %).
// ---------------------------------------------------------------------------
import { d } from '../el.js';
import { C, F } from '../theme.js';
import { slide, kicker, panel } from '../ds.js';
import { icon, dotGrid, arcs } from '../icons.js';
import { MC, lightCard, centerTitle, button, buttonOutline, dots, timerBadge } from '../dsm.js';

const ORANGE = C.orange;
const CRUMB = 'Module 1.2 · Techniques de créativité';
const SEQ2 = { n: 2, total: 3 };

/* ------------------------------------------------------------------ */
/* SLIDE 31 — Ouverture de la séquence 1.2                             */
/* ------------------------------------------------------------------ */
export function slide31() {
  return slide({
    page: 31,
    headerOpts: { crumb: CRUMB, seq: SEQ2 },
    bgExtras: [d({ position: 'absolute', top: 140, right: 80 }, dotGrid(7, 6, 28, 2.4, 'rgba(255,255,255,0.06)'))],
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 8 }, kicker('Séquence 1.2 · Env. 20 minutes')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 26 }, centerTitle('Techniques de créativité', 84)),
      d({ fontFamily: F.body, fontWeight: 400, fontSize: 34, lineHeight: 1.5, color: C.grey, textAlign: 'center', maxWidth: 1250, marginTop: 24, alignSelf: 'center' },
        'Deux méthodes simples pour produire des idées en quantité, puis garder les meilleures.'),

      d({ ...lightCard(), display: 'flex', flexDirection: 'column', gap: 26, padding: '46px 56px', marginTop: 52, width: 1180, alignSelf: 'center' }, [
        d({ fontFamily: F.body, fontWeight: 800, fontSize: 25, letterSpacing: 3, color: MC.inkSoft, lineHeight: 1 }, 'OBJECTIF DE LA SÉQUENCE'),
        d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }, [
          icon('bulb', 34, ORANGE, 2.2),
          d({ fontFamily: F.body, fontWeight: 600, fontSize: 35, color: MC.ink, lineHeight: 1.4 }, 'Générer 10 idées de solutions avec 2 méthodes.'),
        ]),
      ]),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 28, marginTop: 56, alignSelf: 'center' }, [
        dots(2, 3),
        d({ fontFamily: F.body, fontWeight: 700, fontSize: 30, letterSpacing: 1.5, color: C.grey, lineHeight: 1 }, '67 % DU MODULE'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 32 — Méthode 1 : brainstorming structuré                      */
/* ------------------------------------------------------------------ */
export function slide32() {
  const phase = (num, title, time, txt) =>
    d({ ...lightCard(), flex: 1, display: 'flex', flexDirection: 'column', gap: 18, padding: '38px 42px' }, [
      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, [
        d({ fontFamily: F.display, fontWeight: 800, fontSize: 62, color: ORANGE, lineHeight: 1 }, num),
        d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, border: `2px solid rgba(12,27,49,0.15)`, borderRadius: 999, padding: '10px 22px' }, [
          icon('clock', 22, MC.inkSoft, 2.4),
          d({ fontFamily: F.body, fontWeight: 800, fontSize: 22, color: MC.inkSoft, lineHeight: 1 }, time),
        ]),
      ]),
      d({ fontFamily: F.display, fontWeight: 800, fontSize: 36, color: MC.ink, lineHeight: 1.1 }, title),
      d({ fontFamily: F.body, fontWeight: 500, fontSize: 29, lineHeight: 1.5, color: MC.inkSoft }, txt),
    ]);

  return slide({
    page: 32,
    headerOpts: { crumb: CRUMB, seq: SEQ2 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Méthode 1')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('Le brainstorming structuré', 76)),

      d({ display: 'flex', justifyContent: 'center', alignItems: 'center', background: C.orangeGrad, borderRadius: 20, padding: '24px 44px', marginTop: 40 },
        d({ fontFamily: F.display, fontWeight: 700, fontSize: 33, color: '#FFFFFF', lineHeight: 1.3, textAlign: 'center' },
          'Règle d\u2019or : aucun jugement pendant la génération.')),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: 30, flex: 1, marginTop: 44 }, [
        phase('1', 'DIVERGER', '10 MIN', 'Notez TOUTES les idées. La quantité d\u2019abord, la qualité ensuite.'),
        d({ display: 'flex', justifyContent: 'center', alignItems: 'center' }, icon('arrowRight', 52, ORANGE, 2.4)),
        phase('2', 'CONVERGER', '5 MIN', 'Regroupez les idées similaires, puis sélectionnez les meilleures.'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 33 — Exercice guidé : 10 minutes, 10 idées                    */
/* ------------------------------------------------------------------ */
export function slide33() {
  return slide({
    page: 33,
    headerOpts: { crumb: CRUMB, seq: SEQ2 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Exercice guidé')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('10 minutes, 10 idées', 80)),
      d({ fontFamily: F.body, fontWeight: 400, fontSize: 33, lineHeight: 1.5, color: C.grey, textAlign: 'center', maxWidth: 1300, marginTop: 20, alignSelf: 'center' },
        'Prenez un problème identifié en 1.1 et générez un maximum d\u2019idées de solutions.'),

      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 56, flex: 1 }, [
        timerBadge('10', 'MINUTES'),
        d({ ...lightCard(), display: 'flex', flexDirection: 'column', gap: 24, padding: '40px 48px', maxWidth: 1000 }, [
          d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18 }, [
            icon('bulb', 32, ORANGE, 2.2),
            d({ fontFamily: F.body, fontWeight: 800, fontSize: 26, letterSpacing: 2.6, color: MC.inkSoft, lineHeight: 1 }, 'ASTUCE'),
          ]),
          d({ fontFamily: F.body, fontWeight: 500, fontSize: 31, lineHeight: 1.5, color: MC.ink },
            'Les idées « folles » sont les bienvenues : elles cachent souvent les meilleures.'),
        ]),
      ]),

      d({ display: 'flex', justifyContent: 'center', alignItems: 'center', background: C.orangeGrad, borderRadius: 999, padding: '24px 56px', marginTop: 10 },
        d({ fontFamily: F.display, fontWeight: 800, fontSize: 33, color: '#FFFFFF', lineHeight: 1.2 }, 'Objectif : 10 idées notées')),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 34 — Méthode 2 : design thinking simplifié                    */
/* ------------------------------------------------------------------ */
export function slide34() {
  const step = (num, ic, txt) =>
    d({ ...lightCard(), display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 26, padding: '17px 36px' }, [
      d({
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: 62, height: 62, borderRadius: 31, background: C.orangeGrad, flexShrink: 0,
        fontFamily: F.display, fontWeight: 800, fontSize: 29, color: '#FFFFFF', lineHeight: 1,
      }, num),
      icon(ic, 36, ORANGE, 2),
      d({ fontFamily: F.body, fontWeight: 700, fontSize: 32, color: MC.ink, lineHeight: 1.3 }, txt),
    ]);

  return slide({
    page: 34,
    headerOpts: { crumb: CRUMB, seq: SEQ2 },
    bgExtras: [d({ position: 'absolute', bottom: -160, right: -140 }, arcs(440, [0.5, 0.72, 0.94], 'rgba(249,123,44,0.10)', 1.4))],
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Méthode 2')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('Le design thinking simplifié (1/2)', 64)),

      d({ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 36 }, [
        step('1', 'users', 'Comprendre l\u2019utilisateur'),
        step('2', 'target', 'Définir le problème'),
        step('3', 'bulb', 'Idéer des solutions'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* SLIDE 35 — Design thinking : étapes 4-5                             */
/* ------------------------------------------------------------------ */
export function slide34b() {
  const step = (num, ic, txt) =>
    d({ ...lightCard(), display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 26, padding: '26px 36px' }, [
      d({
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: 62, height: 62, borderRadius: 31, background: C.orangeGrad, flexShrink: 0,
        fontFamily: F.display, fontWeight: 800, fontSize: 29, color: '#FFFFFF', lineHeight: 1,
      }, num),
      icon(ic, 36, ORANGE, 2),
      d({ fontFamily: F.body, fontWeight: 700, fontSize: 32, color: MC.ink, lineHeight: 1.3 }, txt),
    ]);

  return slide({
    page: 35,
    headerOpts: { crumb: CRUMB, seq: SEQ2 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Méthode 2 · suite')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('Le design thinking simplifié (2/2)', 64)),
      d({ display: 'flex', flexDirection: 'column', gap: 26, marginTop: 56 }, [
        step('4', 'pencil', 'Prototyper rapidement'),
        step('5', 'trendUp', 'Tester et améliorer'),
      ]),
      d({ display: 'flex', justifyContent: 'center', alignItems: 'center', background: C.orangeGrad, borderRadius: 20, padding: '24px 44px', marginTop: 60 },
        d({ fontFamily: F.display, fontWeight: 700, fontSize: 33, color: '#FFFFFF', lineHeight: 1.3 }, 'Une approche centrée sur l\u2019humain.')),
    ],
  });
}

/* SLIDE 35 — Exemple : le design thinking à Bamako                    */
/* ------------------------------------------------------------------ */
export function slide35() {
  const line = (ic, title, txt) =>
    d({ display: 'flex', flexDirection: 'column', gap: 10 }, [
      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }, [
        icon(ic, 30, ORANGE, 2.2),
        d({ fontFamily: F.display, fontWeight: 800, fontSize: 30, color: MC.ink, lineHeight: 1.2 }, title),
      ]),
      d({ fontFamily: F.body, fontWeight: 500, fontSize: 29, lineHeight: 1.5, color: MC.inkSoft }, txt),
    ]);

  return slide({
    page: 36,
    headerOpts: { crumb: CRUMB, seq: SEQ2 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Exemple · Bamako')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('Le design thinking sur le terrain', 68)),
      d({ fontFamily: F.body, fontWeight: 400, fontSize: 32, lineHeight: 1.5, color: C.grey, textAlign: 'center', maxWidth: 1300, marginTop: 18, alignSelf: 'center' },
        'Un service de livraison né de l\u2019observation, pas d\u2019une intuition.'),

      d({ ...lightCard(), display: 'flex', flexDirection: 'column', gap: 30, padding: '44px 52px', marginTop: 44, alignSelf: 'center', width: 1300 }, [
        line('search', 'Observation terrain', 'Comprendre vraiment le besoin, sur place, avant de créer quoi que ce soit.'),
        line('rocket', 'Tests rapides', 'Essayer petit et vite, avant d\u2019investir son argent.'),
        line('trendUp', 'Améliorations continues', 'Corriger le service à chaque retour des clients.'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 36 — Quiz : première étape du design thinking                 */
/* ------------------------------------------------------------------ */
export function slide36() {
  const opt = (letter, txt) =>
    d({ ...lightCard(), flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20, padding: '24px 30px' }, [
      d({
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: 62, height: 62, borderRadius: 31, background: C.orangeGrad, flexShrink: 0,
        fontFamily: F.display, fontWeight: 800, fontSize: 28, color: '#FFFFFF', lineHeight: 1,
      }, letter),
      d({ fontFamily: F.body, fontWeight: 600, fontSize: 31, color: MC.ink, lineHeight: 1.3 }, txt),
    ]);

  return slide({
    page: 37,
    headerOpts: { crumb: CRUMB, seq: SEQ2 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Quiz express')),
      d({ ...panel({ border: `2px solid rgba(255,255,255,0.35)`, borderRadius: 32 }), display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '38px 56px', marginTop: 36 },
        d({ fontFamily: F.display, fontWeight: 800, fontSize: 54, lineHeight: 1.25, color: C.white, textAlign: 'center' },
          'Quelle est la première étape du design thinking ?')),

      d({ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 40 }, [
        d({ display: 'flex', flexDirection: 'row', gap: 26 }, [opt('A', 'Prototyper'), opt('B', 'Comprendre l\u2019utilisateur')]),
        d({ display: 'flex', flexDirection: 'row', gap: 26 }, [opt('C', 'Idéer des solutions'), opt('D', 'Tester')]),
      ]),

      d({ display: 'flex', justifyContent: 'center', alignItems: 'center', background: C.orangeSoft, border: `1.5px solid ${C.orangeBorder}`, borderRadius: 20, padding: '24px 44px', marginTop: 42 },
        d({ fontFamily: F.body, fontWeight: 600, fontSize: 30, color: 'rgba(255,255,255,0.94)', lineHeight: 1.4, textAlign: 'center' },
          'Réponse : B — sans le besoin réel, on risque de créer un produit inutile.')),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 37 — Application : votre tour                                 */
/* ------------------------------------------------------------------ */
export function slide37() {
  const step = (num, time, txt) =>
    d({ ...lightCard(), flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: '34px 32px', textAlign: 'center' }, [
      d({ fontFamily: F.display, fontWeight: 800, fontSize: 66, color: ORANGE, lineHeight: 1 }, num),
      d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, border: `2px solid rgba(12,27,49,0.15)`, borderRadius: 999, padding: '10px 22px' }, [
        icon('clock', 22, MC.inkSoft, 2.4),
        d({ fontFamily: F.body, fontWeight: 800, fontSize: 22, color: MC.inkSoft, lineHeight: 1 }, time),
      ]),
      d({ fontFamily: F.body, fontWeight: 600, fontSize: 29, lineHeight: 1.45, color: MC.ink, textAlign: 'center' }, txt),
    ]);

  return slide({
    page: 38,
    headerOpts: { crumb: CRUMB, seq: SEQ2 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Votre tour')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('Appliquez le design thinking', 72)),

      d({ display: 'flex', flexDirection: 'row', gap: 30, marginTop: 52, alignItems: 'stretch' }, [
        step('1', '5 MIN', 'Interviewez une personne sur son problème.'),
        step('2', '3 MIN', 'Définissez clairement le problème, en une phrase.'),
        step('3', '7 MIN', 'Générez 5 solutions possibles.'),
      ]),

      d({ display: 'flex', justifyContent: 'center', marginTop: 54 }, button('Télécharger le guide d\u2019entretien')),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 38 — Ressources                                               */
/* ------------------------------------------------------------------ */
export function slide38() {
  const res = (txt) =>
    d({ ...lightCard(), display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '24px 40px', borderRadius: 999 }, [
      d({ fontFamily: F.body, fontWeight: 700, fontSize: 31, color: MC.ink, lineHeight: 1.3 }, txt),
      icon('download', 32, ORANGE, 2.4),
    ]);

  return slide({
    page: 39,
    headerOpts: { crumb: CRUMB, seq: SEQ2 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Ressources')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('Vos outils pour aller plus loin', 72)),

      d({ display: 'flex', flexDirection: 'column', gap: 26, marginTop: 52, alignSelf: 'center', width: 1300 }, [
        res('Grille de brainstorming'),
        res('Canvas design thinking'),
        res('Guide d\u2019entretien utilisateur'),
      ]),

      d({ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, marginTop: 50 }, [
        icon('gradcap', 32, ORANGE, 2),
        d({ fontFamily: F.body, fontWeight: 600, fontSize: 30, color: C.grey, lineHeight: 1.4 },
          'Lecture recommandée : « Design thinking pour l\u2019Afrique ».'),
      ]),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 39 — Validation de la séquence                                */
/* ------------------------------------------------------------------ */
export function slide39() {
  const check = (txt) =>
    d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 24 }, [
      d({
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: 52, height: 52, borderRadius: 26, border: `3px solid ${ORANGE}`, flexShrink: 0,
      }, icon('check', 26, ORANGE, 3)),
      d({ fontFamily: F.body, fontWeight: 600, fontSize: 32, color: MC.ink, lineHeight: 1.35 }, txt),
    ]);

  return slide({
    page: 40,
    headerOpts: { crumb: CRUMB, seq: SEQ2 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Validation')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('Avez-vous bien tout fait ?', 76)),

      d({ ...lightCard(), display: 'flex', flexDirection: 'column', gap: 30, padding: '46px 56px', marginTop: 48, alignSelf: 'center', width: 1300 }, [
        check('Noté au moins 10 idées'),
        check('Testé 2 techniques différentes'),
        check('Téléchargé les templates'),
        check('Partagé 1 idée avec un proche ou sur le forum'),
      ]),

      d({ display: 'flex', justifyContent: 'center', marginTop: 50 }, button('J\u2019ai terminé', 'check')),
    ],
  });
}

/* ------------------------------------------------------------------ */
/* SLIDE 40 — Progression + transition 1.3                             */
/* ------------------------------------------------------------------ */
export function slide40() {
  const row = (label, pct, done) =>
    d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 22 }, [
      done
        ? d({ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 46, height: 46, borderRadius: 23, background: C.orangeGrad }, icon('check', 23, '#FFFFFF', 3))
        : d({ width: 46, height: 46, borderRadius: 23, background: 'rgba(12,27,49,0.12)' }),
      d({ fontFamily: F.body, fontWeight: 700, fontSize: 31, color: done ? MC.ink : MC.inkSoft, lineHeight: 1.3, flex: 1 }, label),
      d({ fontFamily: F.display, fontWeight: 800, fontSize: 31, color: done ? ORANGE : 'rgba(12,27,49,0.35)', lineHeight: 1 }, pct),
    ]);

  return slide({
    page: 41,
    headerOpts: { crumb: CRUMB, seq: SEQ2 },
    children: [
      d({ display: 'flex', justifyContent: 'center', marginTop: 4 }, kicker('Progression')),
      d({ display: 'flex', justifyContent: 'center', marginTop: 24 }, centerTitle('Séquence 1.2 terminée', 78)),

      d({ ...lightCard(), display: 'flex', flexDirection: 'column', gap: 26, padding: '42px 54px', marginTop: 44, alignSelf: 'center', width: 1300 }, [
        row('Séquence 1.1 · Sources d\u2019opportunités', '25 %', true),
        row('Séquence 1.2 · Techniques de créativité', '50 %', true),
        row('Séquence 1.3 · Critères de sélection', '75 %', false),
        row('Séquence 1.4 · Du problème au test', '100 %', false),
      ]),

      d({ ...lightCard(), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, padding: '32px 54px', borderRadius: 28, marginTop: 40, alignSelf: 'center' }, [
        d({ fontFamily: F.body, fontWeight: 700, fontSize: 32, color: MC.ink, lineHeight: 1.3, textAlign: 'center' },
          'Prochaine séquence : Critères de sélection · 15 min'),
        d({ display: 'flex', flexDirection: 'row', gap: 22 }, [
          button('Continuer', 'arrowRight'),
          buttonOutline('Ressources', 'download'),
        ]),
      ]),
    ],
  });
}

export const LOT_04 = [slide31, slide32, slide33, slide34, slide34b, slide35, slide36, slide37, slide38, slide39, slide40];
