/* Prueba que "Creá tu juego" guarde el proyecto: arma algo, recarga y mira que siga ahí. Uso: node herramientas/probar-crea.js */
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1366, height: 768 } }); const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
const url = pathToFileURL(resolve('dist-pendrive/a-moverse.html')).href;
await p.goto(url);
await p.click('#pgrid .pcard.p10'); await p.click('#goSteps'); await p.waitForTimeout(300);
await p.click('#program .tab >> nth=1');                    // pestaña Avispa
await p.click('#palette button.blk.mo >> nth=0');           // un bloque de movimiento
await p.locator('.terminado summary').click(); await p.locator('.terminado input >> nth=0').check();
const antes = await p.locator('#program .blk.mo').count();
await p.screenshot({ path: 'pruebas/etapa3/crea-antes.png' });
await p.reload(); await p.click('#pgrid .pcard.p10'); await p.click('#goSteps'); await p.waitForTimeout(300);
await p.click('#program .tab >> nth=1');
const despues = await p.locator('#program .blk.mo').count();
await p.locator('.terminado summary').click();
const tilde = await p.locator('.terminado input >> nth=0').isChecked();
await p.click('#introBtn'); await p.waitForTimeout(200); await p.screenshot({ path: 'pruebas/etapa3/crea-recetas.png' });
console.log({ antes, despues, tilde, errs });
await b.close();
