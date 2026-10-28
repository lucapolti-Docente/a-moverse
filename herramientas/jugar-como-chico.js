/* Juega tocando los botones, como un chico (sin llamar funciones del juego), y saca capturas en cada paso.
   Uso: node herramientas/jugar-como-chico.js <archivo.html> <carpeta> [ancho alto]
   Recorre: menú → parte 1 → nivel 1 (arma el programa y gana) → parte 4 → crear variable → parte 3 (pestañas y dirección). */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [archivo, carpeta, ancho = '1366', alto = '768'] = process.argv.slice(2);
mkdirSync(carpeta, { recursive: true });
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: +ancho, height: +alto }, reducedMotion: 'reduce' });
await ctx.addInitScript('let s=12345;Math.random=()=>(s=(s*16807)%2147483647,(s-1)/2147483646);');
const pag = await ctx.newPage();
const errores = [];
pag.on('pageerror', e => errores.push(e.message));
pag.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
await pag.goto(pathToFileURL(resolve(archivo)).href);
const tam = +ancho < 600 ? 'celu' : 'compu';
let paso = 0;
const foto = async nombre => { await pag.waitForTimeout(300); await pag.screenshot({ path: `${carpeta}/${String(++paso).padStart(2, '0')}-${nombre}-${tam}.png` }); };
const tocar = async sel => { await pag.locator(sel).first().scrollIntoViewIfNeeded(); await pag.locator(sel).first().click(); };

// parte 1, nivel 1: armar "al hacer clic en bandera → mover 10 pasos" y apretar la banderita hasta ganar
await tocar('#pgrid .pcard.p1');
await foto('parte1');
await tocar('#lgrid .lbtn >> nth=0');
await foto('nivel1');
await tocar('#introBtn'); await foto('pista'); await tocar('#introGo');
await tocar('#palette button.blk.ev'); await foto('puso-evento');
await tocar('#palette button.blk.mo'); await foto('puso-mover');
for (let i = 0; i < 8 && !(await pag.isVisible('#winModal')); i++){ await tocar('#flagBtn'); await pag.waitForTimeout(700); }
await pag.waitForTimeout(900);
await foto('gano');
const gano = await pag.isVisible('#winModal');
await tocar('#winNext'); await foto('nivel2');

// parte 4, crear variable
await tocar('#home'); await tocar('#backParts');
await tocar('#pgrid .pcard.p4');
await tocar('#lgrid .lbtn >> nth=2');
await tocar('#palette .mkvar'); await foto('crear-variable');
await pag.fill('#mkName', 'monedas'); await tocar('#mkOk'); await foto('variable-creada');

// parte 3: pestañas de personajes y elegir dirección
await tocar('#home'); await tocar('#backParts');
await tocar('#pgrid .pcard.p3');
await tocar('#lgrid .lbtn >> nth=3');
await tocar('#program .dirpick'); await foto('elegir-direccion');
await tocar('.dp-opt >> nth=4'); await foto('direccion-elegida');
await tocar('#refBtn'); await foto('sin-reglas'); await tocar('#refBtn');

await nav.close();
console.log(`${paso} capturas en ${carpeta} · ganó el nivel 1: ${gano ? 'sí' : 'NO'} · errores: ${errores.length}`);
errores.forEach(e => console.log('  ' + e));
