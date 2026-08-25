const { LOT_01 } = await import('../src/slides/lot01.js');
function walk(node, path, idx) {
  if (!node || typeof node !== 'object') return;
  const st = node.props?.style || {};
  const kids = node.props?.children;
  if (node.type === 'div' && Array.isArray(kids) && kids.length > 1) {
    if (!['flex', 'contents', 'none'].includes(st.display)) {
      console.log(`[${idx}] ${path} -> div sans display:flex, ${kids.length} enfants :`, JSON.stringify(kids).slice(0, 140));
    }
  }
  if (Array.isArray(kids)) kids.forEach((k, i) => walk(k, `${path}.${i}`, idx));
  else if (kids && typeof kids === 'object') walk(kids, `${path}.c`, idx);
}
LOT_01.forEach((make, i) => walk(make(), 'root', i + 1));
console.log('validation terminée');
