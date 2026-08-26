// ---------------------------------------------------------------------------
// FOLO — Système de slides : chrome (en-tête, progression, pied de page),
// composants réutilisables. Identité identique de bout en bout.
// ---------------------------------------------------------------------------
import { d, span } from './el.js';
import { C, F, T, W, H, PAD_X, PAD_TOP } from './theme.js';
import { logoMark, triStrip } from './icons.js';

/** Segments de progression (élégants, cohérents sur toute la formation). */
export function progressBar(active, total, segW = 44, segH = 8) {
  return d(
    { display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center' },
    Array.from({ length: total }, (_, i) =>
      d({
        width: segW,
        height: segH,
        borderRadius: 4,
        background: i < active ? C.orangeGrad : 'rgba(255,255,255,0.12)',
      })
    )
  );
}

/** Mot « FOLO » (wordmark). */
export function wordmark(size = 30) {
  return d(
    { fontFamily: F.display, fontWeight: 800, fontSize: size, letterSpacing: 6, color: C.white, lineHeight: 1 },
    'FOLO'
  );
}

/** En-tête standard : marque + contexte à gauche, progression à droite. */
export function header({ crumb, seq: seqArg = null, module = null, rightText = null }) {
  const seq = SEQ_OVERRIDE ?? seqArg;
  const left = d(
    { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 22 },
    [
      logoMark(38),
      d({ display: 'flex', flexDirection: 'column', gap: 5 }, [
        wordmark(22),
        crumb
          ? d(
              { fontFamily: F.body, fontWeight: 600, fontSize: 15, letterSpacing: 3.4, color: C.greyDim, lineHeight: 1 },
              crumb.toUpperCase()
            )
          : d({ width: 1, height: 1 }),
      ]),
    ]
  );

  let right;
  if (seq) {
    right = d({ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }, [
      d(
        { fontFamily: F.body, fontWeight: 600, fontSize: 16, letterSpacing: 3, color: C.greyDim, lineHeight: 1 },
        `SÉQUENCE ${seq.n} SUR ${seq.total}`.toUpperCase()
      ),
      progressBar(seq.n, seq.total),
    ]);
  } else if (module) {
    right = d({ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }, [
      d(
        { fontFamily: F.body, fontWeight: 600, fontSize: 16, letterSpacing: 3, color: C.greyDim, lineHeight: 1 },
        `MODULE ${module.n} SUR ${module.total}`.toUpperCase()
      ),
      progressBar(module.n, module.total, 30),
    ]);
  } else if (rightText) {
    right = d(
      { fontFamily: F.body, fontWeight: 600, fontSize: 16, letterSpacing: 3, color: C.greyDim, lineHeight: 1 },
      rightText.toUpperCase()
    );
  } else {
    right = d({ width: 1, height: 1 });
  }

  return d(
    { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' },
    [left, right]
  );
}

/** Pied de page standard. */
let PAGE_OVERRIDE = null;
/** Permet au packaging (pack MOD-001) de renuméroter les écrans
    sans réécrire les slides sources conservées. Null = comportement inchangé. */
export const setPageOverride = (v) => { PAGE_OVERRIDE = v; };

let SEQ_OVERRIDE = null;
/** Permet au packaging d'ajuster le dénominateur de séquence
    (MOD-001 v01 = 3 séquences ; l'existant affiche 4). Null = inchangé. */
export const setSeqOverride = (v) => { SEQ_OVERRIDE = v; };

export function footer(page) {
  return d(
    { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 34 },
    [
      d(
        { fontFamily: F.body, fontWeight: 500, fontSize: 16, letterSpacing: 3, color: 'rgba(143,161,184,0.65)', lineHeight: 1 },
        'FORMATION FOLO · DE L\u2019IDÉE À L\u2019ACTION'
      ),
      d(
        { fontFamily: F.display, fontWeight: 700, fontSize: 20, color: 'rgba(143,161,184,0.75)', lineHeight: 1 },
        String(page).padStart(2, '0')
      ),
    ]
  );
}

/** Kicker (surtitre orange) + triangles signature. */
export function kicker(text) {
  return d({ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20 }, [
    triStrip(4, 11, 9),
    d({ ...T.label, lineHeight: 1 }, text.toUpperCase()),
  ]);
}

/**
 * Cadre de slide complet : fond bleu nuit + chrome.
 * bgExtras : éléments positionnés en absolu (motifs) derrière le contenu.
 */
export function slide({ page, headerOpts = null, bgExtras = [], children, padTop = PAD_TOP }) {
  const content = [
    ...(bgExtras || []),
    d(
      {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
        paddingTop: padTop,
        paddingBottom: 56,
        boxSizing: 'border-box',
      },
      [
        ...(headerOpts ? [d({ marginBottom: 44 }, header(headerOpts))] : []),
        d({ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }, children),
        footer(PAGE_OVERRIDE ?? page),
      ]
    ),
  ];
  return d(
    { display: 'flex', flexDirection: 'column', width: W, height: H, background: C.bg, position: 'relative', overflow: 'hidden' },
    content
  );
}

/** Carte panneau (fond translucide + filet). */
export function panel(style = {}) {
  return {
    background: C.panel,
    border: `1px solid ${C.hairline}`,
    borderRadius: 24,
    ...style,
  };
}

/** Pastille / pill. */
export function pill(text, opts = {}) {
  return d({
    fontFamily: F.body,
    fontWeight: 600,
    fontSize: opts.size ?? 18,
    letterSpacing: 2.6,
    color: opts.color ?? C.grey,
    border: `1px solid ${opts.border ?? C.hairline}`,
    borderRadius: 999,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 24,
    paddingRight: 24,
    background: opts.bg ?? 'rgba(255,255,255,0.03)',
    lineHeight: 1,
  }, text.toUpperCase());
}

/** Mot mis en évidence (orange) dans un paragraphe. */
export const hi = (t) => span({ color: C.orange, fontWeight: 600 }, t);
