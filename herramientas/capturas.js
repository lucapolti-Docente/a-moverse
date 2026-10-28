/* Saca las mismas capturas del juego (original o nuevo) para compararlas.
   Uso: node herramientas/capturas.js <archivo.html> <carpeta>
   Ejemplo: node herramientas/capturas.js original/a-moverse.html pruebas/base */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [archivo = 'original/a-moverse.html', carpeta = 'pruebas/base'] = process.argv.slice(2);
const url = pathToFileURL(resolve(archivo)).href;
mkdirSync(carpeta, { recursive: true });

const PANTALLAS = { compu: { width: 1366, height: 768 }, celu: { width: 360, height: 620 } };
const AZAR = 'let s=12345;Math.random=()=>(s=(s*16807)%2147483647,(s-1)/2147483646);';

const navegador = await chromium.launch();
const informe = { archivo, errores: [], pantallas: [] };

for (const [tam, viewport] of Object.entries(PANTALLAS)) {
  const ctx = await navegador.newContext({ viewport, reducedMotion: 'reduce' });
  await ctx.addInitScript(AZAR);
  const pag = await ctx.newPage();
  pag.on('pageerror', e => informe.errores.push(tam + ': ' + e.message));
  pag.on('console', m => { if (m.type() === 'error') informe.errores.push(tam + ': ' + m.text()); });
  await pag.goto(url);
  await pag.waitForTimeout(400);

  const foto = async nombre => {
    await pag.waitForTimeout(250);
    await pag.screenshot({ path: `${carpeta}/${nombre}-${tam}.png` });
    informe.pantallas.push(`${nombre}-${tam}`);
  };

  // el original tiene todo global; la versión nueva lo expone en window.amoverse
  await pag.evaluate(() => { const a = window.amoverse; if (a) Object.assign(window, { PARTS: a.PARTS, go: a.go, showPart: a.showPart, showParts: a.showParts }); });
  await foto('menu-partes');
  const partes = await pag.evaluate(() => PARTS.map(p => ({ n: p.n, niveles: p.levels.length, cierre: p.levels.findIndex(l => l.mode === 'cierre') })));
  for (const p of partes) {
    await pag.evaluate(n => showPart(PARTS[n - 1]), p.n);
    await foto(`p${p.n}-menu`);
    const juegos = p.cierre > 0 ? p.cierre : p.niveles;
    const elegidos = [...new Set([0, Math.floor(juegos / 2), juegos - 1])];
    for (const i of elegidos) {
      await pag.evaluate(([n, i]) => { showPart(PARTS[n - 1]); document.querySelector('#startScreen').hidden = true; go(i); }, [p.n, i]);
      const nom = `p${p.n}-n${String(i + 1).padStart(2, '0')}`;
      await foto(nom);
      // la introducción se abre con su botón
      if (await pag.isVisible('#introBtn')) {
        await pag.click('#introBtn');
        await foto(nom + '-intro');
        await pag.evaluate(() => { document.querySelector('#introModal').hidden = true; });
      }
    }
    await pag.evaluate(n => { showPart(PARTS[n - 1]); document.querySelector('#goFree').click(); }, p.n);
    await foto(`p${p.n}-libre`);
  }
  await ctx.close();
}
await navegador.close();
writeFileSync(`${carpeta}/informe.json`, JSON.stringify(informe, null, 2));
console.log(informe.pantallas.length + ' capturas en ' + carpeta + '. Errores: ' + informe.errores.length);
informe.errores.slice(0, 10).forEach(e => console.log('  ' + e));
