// ---------------------------------------------------------------------------
// FOLO — primitives d'éléments pour Satori (arbre d'éléments sans JSX)
// Règle critique : ne JAMAIS passer children: [] (satori le rejette).
// ---------------------------------------------------------------------------

/**
 * Div. children optionnel (string, élément, ou tableau).
 * Règle satori : TOUT div avec enfants (même un seul) exige un display explicite.
 * On impose donc display:flex par défaut.
 */
export const d = (style, children) => {
  const st = { display: 'flex', ...style };
  const props = { style: st };
  if (children !== undefined && !(Array.isArray(children) && children.length === 0)) {
    props.children = children;
  }
  return { type: 'div', props };
};

/** Span inline (mots mis en évidence dans un paragraphe). */
export const span = (style, children) => ({ type: 'span', props: { style, children } });

/** Image (souvent un SVG encodé en data-URI). */
export const img = (src, width, height, style) => {
  const props = { src, width, height };
  if (style) props.style = style;
  return { type: 'img', props };
};

/** Encode un SVG en data-URI base64 pour <img>. */
export const svgUri = (svg) => 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
