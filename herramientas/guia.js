/* Arma la guía docente desde los datos del juego: public/docentes/index.html y guia-docente.pdf.
   Uso: node herramientas/guia.js   (volver a correrlo si cambian las notas de una parte o el glosario) */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { PARTS } from '../src/datos/partes/index.js';
import { GLOSARIO } from '../src/datos/glosario.js';
import { CATS, ETIQUETAS, PAL } from '../src/datos/bloques.js';

const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const COLOR = { ev: '#FFBF00', mo: '#4C97FF', ap: '#9966FF', co: '#FFAB19', se: '#5CB1D6', op: '#59C059', va: '#FF8C1A' };

// en qué parte aparece cada bloque por primera vez en una paleta
const primera = {};
for (const p of PARTS) for (const l of p.levels) for (const b of l.palette || []) if (!primera[b]) primera[b] = p;
const filasGlosario = Object.keys(PAL).sort((a, b) => (primera[a]?.n || 99) - (primera[b]?.n || 99)).map(k => {
  const g = GLOSARIO[k], cat = PAL[k].cat;
  return `<tr><td><span class="blk" style="background:${COLOR[cat]}">${esc(ETIQUETAS[k].join(' … '))}</span></td><td>${CATS[cat][0]}</td><td>${esc(g.scratch)}</td><td>${g.latam ? esc(g.latam) : '—'}</td><td>${primera[k] ? primera[k].n + '. ' + esc(primera[k].name) : 'Creá tu juego'}${g.nota ? `<br><small>${esc(g.nota)}</small>` : ''}</td></tr>`;
}).join('\n');

const partes = PARTS.map(p => {
  const notas = Object.fromEntries(p.teach.map(([t, h]) => [t, h]));
  const niveles = p.levels.map(l => `<li><b>${esc(l.name)}</b>${l.mode === 'cierre' ? ' (preguntas de cierre)' : ''}${typeof l.learn === 'string' ? ` — ${esc(l.learn)}` : ''}</li>`).join('');
  return `<section class="parte">
  <h2>${p.n}. ${esc(p.name)}</h2>
  <p class="desc">${esc(p.desc)}. ${esc(p.tag)}</p>
  <h3>La clase</h3>${notas['La clase'] || ''}
  <h3>Antes, sin pantalla</h3>${notas['Antes, sin pantalla'] || ''}
  <h3>Preguntas de cierre</h3>${notas['Preguntas de cierre'] || ''}
  <details open><summary>Niveles y qué descubren</summary><ol>${niveles}</ol></details>
</section>`;
}).join('\n');

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>¡A Moverse! · Guía docente</title>
<style>
:root{--ink:#13202B;--muted:#43535F;--line:#C3D2DC;--bg:#F4F8FA;--accent:#E8553F}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,"Segoe UI",sans-serif}
main{max-width:900px;margin:0 auto;padding:24px 16px 60px}
h1{font-size:34px;margin:0 0 4px}h1 span{color:var(--accent)}
h2{font-size:24px;margin:28px 0 6px;border-bottom:3px solid var(--ink);padding-bottom:4px}
h3{font-size:17px;margin:14px 0 4px;color:var(--muted)}
.parte{background:#fff;border:2px solid var(--line);border-radius:14px;padding:4px 18px 14px;margin:18px 0;break-inside:avoid-page}
.desc{font-weight:600}
.aviso{background:#FFF4D6;border:2px solid #E0A100;border-radius:12px;padding:10px 14px}
table{border-collapse:collapse;width:100%;background:#fff;font-size:14px}
th,td{border:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}
th{background:#E6EEF3}
.blk{display:inline-block;color:#111;font-weight:700;border-radius:8px;padding:3px 8px;font-size:13px}
a.btn{display:inline-block;background:var(--accent);color:#fff;font-weight:700;text-decoration:none;border-radius:12px;padding:10px 16px;margin:6px 8px 0 0}
small{color:var(--muted)}
@media print{body{background:#fff}a.btn{display:none}.parte{border:none;padding:0}details>summary{list-style:none}}
</style></head>
<body><main>
<h1>¡A <span>Moverse!</span> · Guía docente</h1>
<p><a class="btn" href="../">Abrir el juego</a><a class="btn" href="guia-docente.pdf">Bajar la guía en PDF</a></p>
<p><b>Qué hacen los chicos:</b> arman programas con bloques iguales a los de Scratch 3 (mismos nombres y colores) para mover un bichito y, parte por parte, construir un juego de verdad: moverse, chocar, enemigos, puntos y vidas, mensajes, clones, niveles y animaciones. Es un puente hacia Scratch.</p>
<p><b>Para quién:</b> núcleo en 4.º y 5.º grado; repaso en 6.º y 7.º antes de pasar a Scratch. Las partes 6 a 8 conviene trabajarlas desde 5.º (en 4.º, con ayuda).</p>
<p><b>Cómo se usa:</b> cada parte es una clase de 40 a 60 minutos (Vidas y puntos, dos). Primero la actividad sin pantalla, después los niveles paso a paso (cada nivel tiene una pista con ejemplo) y al final las preguntas de cierre. Cada parte tiene un modo libre. Botón 🐢 para ver más despacio qué bloque se ejecuta y ▶ Paso para avanzar de a una vuelta (útil en el proyector). Se puede saltar cualquier nivel. El avance se guarda en el navegador de cada compu, sin cuentas. Anda sin internet: la versión para pendrive es un solo archivo que se abre con doble clic.</p>
<p class="aviso"><b>Diseño Curricular:</b> Tecnologías, Diseño y Programación (CABA), eje de Diseño y programación: eventos, secuencias, repeticiones, condicionales, variables, comunicación entre objetos y depuración. <b>Las referencias a contenidos e indicadores del Diseño Curricular están sin verificar contra el documento oficial</b> (las marcadas “a verificar” y también el resto).</p>
${partes}
<h2>Equivalencias con Scratch</h2>
<p>Cada bloque del juego, cómo se llama en Scratch 3 (Español) y en el Scratch en Español Latinoamericano cuando cambia, y en qué parte aparece por primera vez. Nombres verificados con la traducción oficial de Scratch (scratch-l10n).</p>
<table><thead><tr><th>En el juego</th><th>Categoría en Scratch</th><th>En Scratch (Español)</th><th>Español Latinoamericano</th><th>Aparece en</th></tr></thead>
<tbody>
${filasGlosario}
</tbody></table>
</main></body></html>
`;

mkdirSync('public/docentes', { recursive: true });
writeFileSync('public/docentes/index.html', html);
const nav = await chromium.launch();
const pag = await nav.newPage();
await pag.goto(pathToFileURL(resolve('public/docentes/index.html')).href);
await pag.pdf({ path: 'public/docentes/guia-docente.pdf', format: 'A4', printBackground: true, margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' } });
await nav.close();
console.log('Guía lista: public/docentes/index.html y guia-docente.pdf');
