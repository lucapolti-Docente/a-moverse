/* Prueba lo de la Etapa 4 en el navegador: modo lento, paso a paso, efectos y silencio recordado.
   Uso: node herramientas/probar-etapa4.js   (deja capturas en pruebas/etapa4) */
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const url = pathToFileURL(resolve('dist-pendrive/a-moverse.html')).href;
const b = await chromium.launch();
const errs = [], res = {};
for (const [w, h, tam] of [[1366, 768, 'compu'], [360, 620, 'celu']]){
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(tam + ': ' + e.message));
  await p.goto(url);
  const abrir = async (parte, id) => { await p.evaluate(([parte, id]) => { const a = window.amoverse; a.showPart(a.PARTS[parte - 1]); document.querySelector('#startScreen').hidden = true; a.go(a.PARTS[parte - 1].levels.findIndex(l => l.id === id)); }, [parte, id]); await p.waitForTimeout(250); };
  // modo lento en "La pregunta": se resalta el "si" y el "sumar" mientras se aprieta la flecha
  await abrir(1, 'p1-wasd');
  await p.click('#lentoBtn'); await p.click('#flagBtn'); await p.keyboard.down('ArrowRight'); await p.waitForTimeout(700);
  res['resaltados-' + tam] = await p.locator('#program .corriendo').count();
  await p.screenshot({ path: `pruebas/etapa4/lento-${tam}.png` });
  await p.keyboard.up('ArrowRight');
  // paso a paso
  await p.click('#pasoBtn'); const x0 = await p.evaluate(() => window.amoverse.S.sprites[0].x);
  await p.keyboard.down('ArrowRight'); await p.click('#pasoBtn'); await p.click('#pasoBtn'); await p.keyboard.up('ArrowRight');
  const x1 = await p.evaluate(() => window.amoverse.S.sprites[0].x);
  res['paso-' + tam] = x1 - x0;
  await p.click('#lentoBtn'); await p.click('#lentoBtn');   // pausa → lento → normal
  // +1, sobrecito y avispa al panal en "Me aviso a mí también"
  await abrir(5, 'p5-meaviso');
  await p.click('#flagBtn'); await p.waitForTimeout(200);
  await p.evaluate(() => { const S = window.amoverse.S; const bi = S.sprites[0]; const av = S.sprites.find(o => o.name === 'Avispa'); bi.x = av.x; bi.y = av.y; });
  await p.waitForTimeout(120); await p.screenshot({ path: `pruebas/etapa4/efectos-${tam}.png` });
  res['efectos-' + tam] = await p.evaluate(() => window.amoverse.S.efectos.map(e => e.tipo).join(','));
  // sacudida: un mensaje de error
  await abrir(3, 'p3-5'); await p.click('#flagBtn'); await p.waitForTimeout(100);
  await p.evaluate(() => { const S = window.amoverse.S; S.sprites[1].x = S.sprites[0].x; S.sprites[1].y = S.sprites[0].y; });
  await p.waitForTimeout(120); res['sacude-' + tam] = await p.evaluate(() => document.querySelector('#fb').classList.contains('sacudir'));
  // festejo al ganar el nivel 1
  await abrir(1, 1); await p.click('#palette button.blk.ev'); await p.click('#palette button.blk.mo');
  for (let i = 0; i < 4; i++){ await p.click('#flagBtn'); await p.waitForTimeout(150); }
  await p.waitForTimeout(250); await p.screenshot({ path: `pruebas/etapa4/festejo-${tam}.png` });
  // silencio recordado
  await p.evaluate(() => { document.querySelector('#winModal').hidden = true; });
  await p.click('#snd'); await p.reload(); await p.waitForTimeout(300);
  res['silencio-' + tam] = await p.evaluate(() => window.amoverse.S.muted);
  await ctx.close();
}
await b.close();
console.log(res, 'errores:', errs);
