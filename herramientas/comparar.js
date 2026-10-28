/* Compara píxel a píxel las capturas de dos carpetas (por ejemplo pruebas/base y pruebas/nuevo).
   Uso: node herramientas/comparar.js pruebas/base pruebas/nuevo */
import { chromium } from 'playwright';
import { readdirSync, readFileSync, existsSync } from 'node:fs';

const [a = 'pruebas/base', b = 'pruebas/nuevo'] = process.argv.slice(2);
const nombres = readdirSync(a).filter(f => f.endsWith('.png'));
const nav = await chromium.launch();
const pag = await nav.newPage();
const filas = [];
for (const n of nombres) {
  if (!existsSync(`${b}/${n}`)) { filas.push([n, 'falta']); continue; }
  const uri = f => 'data:image/png;base64,' + readFileSync(f).toString('base64');
  const r = await pag.evaluate(async ([x, y]) => {
    const carga = src => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.src = src; });
    const [i1, i2] = await Promise.all([carga(x), carga(y)]);
    if (i1.width !== i2.width || i1.height !== i2.height) return { distinto: -1 };
    const c = document.createElement('canvas'); c.width = i1.width; c.height = i1.height;
    const g = c.getContext('2d');
    g.drawImage(i1, 0, 0); const d1 = g.getImageData(0, 0, c.width, c.height).data;
    g.drawImage(i2, 0, 0); const d2 = g.getImageData(0, 0, c.width, c.height).data;
    let n = 0; for (let k = 0; k < d1.length; k += 4) if (Math.abs(d1[k] - d2[k]) + Math.abs(d1[k + 1] - d2[k + 1]) + Math.abs(d1[k + 2] - d2[k + 2]) > 30) n++;
    return { distinto: n, total: d1.length / 4 };
  }, [uri(`${a}/${n}`), uri(`${b}/${n}`)]);
  filas.push([n, r.distinto === 0 ? 'igual' : r.distinto < 0 ? 'otro tamaño' : (100 * r.distinto / r.total).toFixed(2) + '% distinto']);
}
await nav.close();
const malas = filas.filter(f => f[1] !== 'igual');
console.log(`${filas.length - malas.length} de ${filas.length} iguales.`);
malas.forEach(f => console.log('  ' + f.join(' · ')));
