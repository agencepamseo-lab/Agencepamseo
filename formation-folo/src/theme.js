// ---------------------------------------------------------------------------
// FOLO — Charte graphique (tokens de design)
// Style : premium · moderne · professionnel · pédagogique · africain contemporain
// ---------------------------------------------------------------------------

export const W = 1920;
export const H = 1080;

export const C = {
  // Fond : bleu nuit profond (dégradé signature)
  bg: 'linear-gradient(135deg, #060D1A 0%, #0B1B33 48%, #0A1626 100%)',
  bgFlat: '#0A1626',

  // Accent : orange chaud (jamais en remplissage inutile)
  orange: '#F97B2C',
  orangeSoft: 'rgba(249, 123, 44, 0.10)',
  orangeBorder: 'rgba(249, 123, 44, 0.55)',
  orangeGrad: 'linear-gradient(120deg, #FBA14B 0%, #F97B2C 55%, #E85D04 100%)',

  // Textes
  white: '#FFFFFF',
  grey: '#C7D2E0',      // texte secondaire
  greyDim: '#8FA1B8',   // tertiaire / méta
  hairline: 'rgba(255,255,255,0.10)',
  panel: 'rgba(255,255,255,0.035)',
  panelSolid: '#0E2140',
};

export const F = {
  display: 'Sora',   // titres
  body: 'Inter',     // corps de texte
};

// Échelle typographique (3 niveaux maximum par slide)
export const T = {
  displayXL: { fontFamily: F.display, fontWeight: 800, fontSize: 96, lineHeight: 1.06, color: C.white },
  display: { fontFamily: F.display, fontWeight: 800, fontSize: 68, lineHeight: 1.12, color: C.white },
  h1: { fontFamily: F.display, fontWeight: 700, fontSize: 54, lineHeight: 1.16, color: C.white },
  h2: { fontFamily: F.display, fontWeight: 700, fontSize: 40, lineHeight: 1.22, color: C.white },
  body: { fontFamily: F.body, fontWeight: 400, fontSize: 30, lineHeight: 1.5, color: C.grey },
  bodyBig: { fontFamily: F.body, fontWeight: 400, fontSize: 34, lineHeight: 1.45, color: C.grey },
  label: { fontFamily: F.body, fontWeight: 600, fontSize: 22, letterSpacing: 4, color: C.orange },
  labelGrey: { fontFamily: F.body, fontWeight: 600, fontSize: 20, letterSpacing: 4, color: C.greyDim },
};

// Marges cadres — zones de sécurité mobile : 10 % latéraux (192 px sur 1920)
export const PAD_X = 192;
export const PAD_TOP = 76;
