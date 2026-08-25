import satori from 'satori';
import { readFileSync } from 'node:fs';
const fonts = [
  { name: 'Inter', data: readFileSync('node_modules/@fontsource/inter/files/inter-latin-400-normal.woff'), weight: 400, style: 'normal' },
  { name: 'Inter', data: readFileSync('node_modules/@fontsource/inter/files/inter-latin-700-normal.woff'), weight: 700, style: 'normal' },
];
const cases = {
  A: { type:'div', props:{ style:{display:'flex',width:'400px',height:'200px',fontFamily:'Inter'}, children:['hello world'] } },
  B: { type:'div', props:{ style:{display:'flex',width:'400px',height:'200px',fontFamily:'Inter'}, children:['aaa ', {type:'span',props:{style:{color:'red'},children:'bbb'}}] } },
  C: { type:'div', props:{ style:{display:'flex',width:'400px',height:'200px',fontFamily:'Inter'}, children:[{type:'div',props:{style:{fontSize:'20px'},children:'x'}}] } },
  D: { type:'div', props:{ style:{display:'flex',width:'400px',height:'200px',fontFamily:'Inter'}, children:[{type:'div',props:{style:{width:'10px',height:'10px',background:'#fff'},children:[]}}] } },
};
for (const [k, tree] of Object.entries(cases)) {
  try { await satori(tree, { width: 400, height: 200, fonts }); console.log(k, 'OK'); }
  catch (e) { console.log(k, 'FAIL:', String(e.message).slice(-120)); }
}
