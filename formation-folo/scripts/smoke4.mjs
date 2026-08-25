import satori from 'satori';
import { readFileSync, writeFileSync } from 'node:fs';
const fonts = [
  { name: 'Inter', data: readFileSync('node_modules/@fontsource/inter/files/inter-latin-400-normal.woff'), weight: 400, style: 'normal' },
  { name: 'Inter', data: readFileSync('node_modules/@fontsource/inter/files/inter-latin-600-normal.woff'), weight: 600, style: 'normal' },
];
// long mixed inline paragraph in a NARROW container to force wrapping
const kids = [];
for (let i = 0; i < 6; i++) {
  kids.push(`Un morceau de texte numéro ${i} qui continue encore et encore, `);
  kids.push({ type: 'span', props: { style: { color: '#F97B2C', fontWeight: 600 }, children: `mot-clé ${i}` } });
  kids.push(' puis du texte normal ');
}
const cases = {
  noFlex: { type:'div', props:{ style:{width:'700px',height:'500px',fontFamily:'Inter',fontSize:'30px',lineHeight:1.5,color:'#fff',background:'#0B1B33'}, children: kids } },
  flex: { type:'div', props:{ style:{display:'flex',width:'700px',height:'500px',fontFamily:'Inter',fontSize:'30px',lineHeight:1.5,color:'#fff',background:'#0B1B33'}, children: kids } },
};
for (const [k, tree] of Object.entries(cases)) {
  try {
    const svg = await satori(tree, { width: 700, height: 500, fonts });
    writeFileSync(`scripts/smoke4-${k}.png`, new (await import('@resvg/resvg-js')).Resvg(svg).render().asPng());
    console.log(k, 'OK');
  } catch (e) { console.log(k, 'FAIL:', String(e.message).slice(-100)); }
}
