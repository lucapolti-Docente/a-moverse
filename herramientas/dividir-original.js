/* Parte el script del original en módulos ES, sin cambiar lo que hace. Se usó UNA vez para arrancar la Etapa 1;
   después los módulos se ordenaron a mano. Queda como registro de cómo se hizo la división.
   - Cada declaración de primer nivel va al módulo que dice REPARTO (por número de línea del original).
   - Las variables `let` que usan varios módulos pasan a un objeto compartido: S.nombre (src/estado.js).
   - Las sentencias sueltas de un módulo quedan dentro de `iniciar…()`, que main.js llama en el orden original.
   Uso: node herramientas/dividir-original.js */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, relative, posix } from 'node:path';
import * as acorn from 'acorn';

const html = readFileSync('original/a-moverse.html', 'utf8');
const ini = html.indexOf('<script>') + 8, fin = html.lastIndexOf('</script>');
const codigo = html.slice(ini, fin);
const base = html.slice(0, ini).split('\n').length - 1;
const ast = acorn.parse(codigo, { ecmaVersion: 2022, locations: true });
const linea = n => n.loc.start.line + base;

/* [desde la línea, módulo]: cada declaración va al último tramo que empieza antes que ella */
const TRAMOS = [
  [481, 'motor/motor'], [615, 'motor/bloques'], [659, 'datos/bloques'], [665, 'datos/fondos'], [666, 'datos/bloques'],
  [708, 'estado'], [709, 'motor/nombres'], [713, 'datos/partes/1-movimiento'],
  [831, 'datos/programas'], [837, 'datos/fondos'], [839, 'datos/programas'], [842, 'datos/partes/2-choques'],
  [849, 'datos/programas'], [853, 'motor/reglas'], [869, 'datos/partes/2-choques'],
  [1022, 'datos/programas'], [1024, 'datos/personajes'], [1026, 'motor/reglas'], [1033, 'datos/partes/3-enemigos'],
  [1168, 'datos/personajes'], [1170, 'datos/programas'], [1176, 'motor/reglas'], [1180, 'datos/partes/4-vidas-y-puntos'],
  [1384, 'datos/personajes'], [1389, 'datos/programas'], [1393, 'motor/reglas'], [1394, 'datos/partes/5-atacar'],
  [1615, 'datos/fondos'], [1620, 'datos/personajes'], [1622, 'datos/partes/6-niveles'], [1623, 'datos/programas'],
  [1626, 'datos/partes/6-niveles'], [1742, 'datos/personajes'], [1743, 'datos/programas'], [1745, 'datos/partes/7-animaciones'],
  [1843, 'datos/fondos'], [1844, 'datos/bloques'], [1849, 'datos/partes/8-crea-tu-juego'], [1862, 'datos/partes/index'],
  [1922, 'interfaz/dom'], [1923, 'estado'], [1927, 'guardado'], [1930, 'motor/partida'],
  [1934, 'sonido'], [1960, 'interfaz/aviso'], [1971, 'motor/recorrer'], [1978, 'interfaz/edicion'],
  [2063, 'interfaz/vista-bloques'], [2341, 'interfaz/editor'], [2459, 'interfaz/explorar-cierre'],
  [2519, 'motor/partida'], [2520, 'interfaz/editor'], [2521, 'motor/partida'], [2597, 'interfaz/ventanas'],
  [2619, 'motor/partida'], [2893, 'interfaz/controles'], [2963, 'interfaz/menu'], [2966, 'dibujo/escenario'],
  [3387, 'interfaz/bucle'], [3422, 'dibujo/portada'], [3487, 'interfaz/menu'], [3536, 'main']
];
/* excepciones por nombre */
const POR_NOMBRE = {
  msgNames: 'motor/nombres', cosNames: 'motor/nombres', bdNames: 'motor/nombres',
  KEYS: 'datos/bloques', DIR: 'datos/textos', DOMKEY: 'interfaz/controles', domKey: 'interfaz/controles',
  ARROWS: 'motor/bloques', WASD: 'motor/bloques', TWIN: 'motor/bloques',
  CIERRE_A: 'datos/partes/1-movimiento', CIERRE_B: 'datos/programas',
  el: 'interfaz/dom', txt: 'interfaz/dom', stopEv: 'interfaz/dom', FLAG_SVG: 'interfaz/dom', X_SVG: 'interfaz/dom', LOCK_SVG: 'interfaz/dom',
  newRun: 'motor/partida', go: 'interfaz/menu', burst: 'dibujo/escenario',
  uid: 'motor/bloques', programs: 'estado', createdVars: 'estado'
};
const modDe = n => {
  const nombres = declarados(n);
  for (const x of nombres) if (POR_NOMBRE[x]) return POR_NOMBRE[x];
  let m = null; for (const [l, mod] of TRAMOS) if (linea(n) >= l) m = mod; return m;
};
function declarados(n) {
  if (n.type === 'FunctionDeclaration') return [n.id.name];
  if (n.type === 'VariableDeclaration') return n.declarations.map(d => d.id.name);
  return [];
}

/* ---------- análisis de alcance: qué identificadores son referencias a nombres globales ---------- */
const globales = new Map(); // nombre -> {mod, kind, nodo}
for (const n of ast.body) for (const x of declarados(n)) globales.set(x, { mod: modDe(n), kind: n.type === 'FunctionDeclaration' ? 'function' : n.kind, nodo: n });

function nombresDePatron(p, out = []) {
  if (!p) return out;
  if (p.type === 'Identifier') out.push(p.name);
  else if (p.type === 'ObjectPattern') p.properties.forEach(q => nombresDePatron(q.type === 'RestElement' ? q.argument : q.value, out));
  else if (p.type === 'ArrayPattern') p.elements.forEach(e => nombresDePatron(e, out));
  else if (p.type === 'RestElement') nombresDePatron(p.argument, out);
  else if (p.type === 'AssignmentPattern') nombresDePatron(p.left, out);
  return out;
}
function declsDeBloque(cuerpo, conVar) {
  const s = new Set();
  const mirar = (st, hondo) => {
    if (!st) return;
    if (st.type === 'VariableDeclaration' && (st.kind !== 'var' ? !hondo : conVar)) st.declarations.forEach(d => nombresDePatron(d.id).forEach(x => s.add(x)));
    if (st.type === 'FunctionDeclaration' && !hondo) s.add(st.id.name);
    if (st.type === 'ClassDeclaration' && !hondo) s.add(st.id.name);
    if (conVar) for (const k of ['body', 'consequent', 'alternate', 'block', 'handler', 'finalizer']) {
      const h = st[k]; if (!h) continue;
      if (Array.isArray(h)) h.forEach(x => mirar(x, true)); else if (h.type === 'BlockStatement') h.body.forEach(x => mirar(x, true)); else if (h.body) mirar(h.body, true);
    }
    if (conVar && (st.type === 'ForStatement') && st.init && st.init.type === 'VariableDeclaration' && st.init.kind === 'var') st.init.declarations.forEach(d => nombresDePatron(d.id).forEach(x => s.add(x)));
  };
  cuerpo.forEach(st => mirar(st, false));
  return s;
}
/* devuelve las referencias a globales: [{start, end, name, escritura, abreviada}] */
function referencias(nodo) {
  const refs = [];
  const visitar = (n, padre, clave, alcance) => {
    if (!n || typeof n.type !== 'string') return;
    let a = alcance;
    const nuevo = set => { a = [...alcance, set]; };
    if (n.type === 'FunctionDeclaration' || n.type === 'FunctionExpression' || n.type === 'ArrowFunctionExpression') {
      const s = new Set(); n.params.forEach(p => nombresDePatron(p).forEach(x => s.add(x)));
      if (n.type === 'FunctionExpression' && n.id) s.add(n.id.name);
      if (n.body.type === 'BlockStatement') declsDeBloque(n.body.body, true).forEach(x => s.add(x));
      nuevo(s);
      n.params.forEach(p => visitarPatron(p, a));
      visitar(n.body, n, 'body', a); return;
    }
    if (n.type === 'BlockStatement' || n.type === 'Program') { nuevo(declsDeBloque(n.body, false)); }
    if (n.type === 'ForStatement' || n.type === 'ForOfStatement' || n.type === 'ForInStatement') {
      const d = n.init || n.left; if (d && d.type === 'VariableDeclaration') nuevo(new Set(d.declarations.flatMap(x => nombresDePatron(x.id))));
    }
    if (n.type === 'CatchClause' && n.param) nuevo(new Set(nombresDePatron(n.param)));
    if (n.type === 'Identifier') {
      const esProp = (padre.type === 'MemberExpression' && clave === 'property' && !padre.computed) ||
        ((padre.type === 'Property' || padre.type === 'MethodDefinition' || padre.type === 'PropertyDefinition') && clave === 'key' && !padre.computed && !padre.shorthand) ||
        padre.type === 'LabeledStatement' || padre.type === 'BreakStatement' || padre.type === 'ContinueStatement';
      if (esProp) return;
      if (globales.has(n.name) && !a.some(s => s.has(n.name))) {
        const escritura = (padre.type === 'AssignmentExpression' && clave === 'left') || padre.type === 'UpdateExpression';
        refs.push({ start: n.start, end: n.end, name: n.name, escritura, abreviada: padre.type === 'Property' && padre.shorthand });
      }
      return;
    }
    if (n.type === 'VariableDeclarator') { visitarPatron(n.id, a, true); visitar(n.init, n, 'init', a); return; }
    if (n.type === 'Property' && n.shorthand && padre.type === 'ObjectExpression') { visitar(n.value, n, 'value', a); return; }
    for (const k of Object.keys(n)) {
      if (k === 'loc' || k === 'type' || k === 'start' || k === 'end') continue;
      const v = n[k];
      if (Array.isArray(v)) v.forEach(x => x && typeof x.type === 'string' && visitar(x, n, k, a));
      else if (v && typeof v.type === 'string') visitar(v, n, k, a);
    }
  };
  // en patrones (parámetros, declaraciones) solo cuentan los valores por defecto
  const visitarPatron = (p, a) => {
    if (!p) return;
    if (p.type === 'AssignmentPattern') { visitarPatron(p.left, a); visitar(p.right, p, 'right', a); }
    else if (p.type === 'ObjectPattern') p.properties.forEach(q => visitarPatron(q.type === 'RestElement' ? q.argument : q.value, a));
    else if (p.type === 'ArrayPattern') p.elements.forEach(e => visitarPatron(e, a));
    else if (p.type === 'RestElement') visitarPatron(p.argument, a);
  };
  if (nodo.type === 'VariableDeclaration') nodo.declarations.forEach(d => { visitarPatron(d.id, []); visitar(d.init, d, 'init', []); });
  else if (nodo.type === 'FunctionDeclaration') {
    const s = new Set(); nodo.params.forEach(p => nombresDePatron(p).forEach(x => s.add(x))); declsDeBloque(nodo.body.body, true).forEach(x => s.add(x));
    nodo.params.forEach(p => visitarPatron(p, [s])); visitar(nodo.body, nodo, 'body', [s]);
  } else visitar(nodo, { type: 'Program' }, 'body', []);
  return refs;
}

/* ---------- qué `let` se comparten ---------- */
const usosPorNombre = new Map();
const refsPorNodo = new Map();
for (const n of ast.body) {
  const r = referencias(n); refsPorNodo.set(n, r);
  const m = modDe(n);
  for (const x of r) { if (!usosPorNombre.has(x.name)) usosPorNombre.set(x.name, new Set()); usosPorNombre.get(x.name).add(m); }
}
const compartida = new Set();
for (const [x, g] of globales) {
  if (g.kind !== 'let') continue;
  const usos = usosPorNombre.get(x) || new Set();
  if ([...usos].some(m => m !== g.mod) || g.mod === 'estado') compartida.add(x);
}

/* ---------- armado de cada módulo ---------- */
const modulos = new Map(); // mod -> {partes:[], importa: Map(mod->Set), usaS, inicio:[]}
const mod = m => { if (!modulos.has(m)) modulos.set(m, { partes: [], importa: new Map(), usaS: false, inicio: [] }); return modulos.get(m); };
const estadoInicial = [];
const PARTS_NODO = ast.body.find(n => declarados(n).includes('PARTS'));

function reescribir(n, desde, hasta, m) {
  let txt = codigo.slice(desde, hasta);
  const refs = refsPorNodo.get(n).filter(r => r.start >= desde && r.end <= hasta).sort((a, b) => b.start - a.start);
  const M = mod(m);
  for (const r of refs) {
    const g = globales.get(r.name);
    let rep = null;
    if (compartida.has(r.name)) { rep = 'S.' + r.name; M.usaS = true; }
    else if (g.mod !== m) { if (!M.importa.has(g.mod)) M.importa.set(g.mod, new Set()); M.importa.get(g.mod).add(r.name); }
    if (rep) txt = txt.slice(0, r.start - desde) + (r.abreviada ? r.name + ': ' + rep : rep) + txt.slice(r.end - desde);
  }
  return txt;
}

for (const n of ast.body) {
  const m = modDe(n);
  if (n === PARTS_NODO) continue;
  const nombres = declarados(n);
  if (n.type === 'VariableDeclaration' && n.kind === 'let' && nombres.some(x => compartida.has(x))) {
    for (const d of n.declarations) {
      const x = d.id.name;
      const valor = d.init ? reescribir(n, d.init.start, d.init.end, 'estado') : 'undefined';
      if (compartida.has(x)) estadoInicial.push(`  ${x}: ${valor}`);
      else mod(m).partes.push(`let ${x}${d.init ? ' = ' + reescribir(n, d.init.start, d.init.end, m) : ''};`);
    }
    continue;
  }
  const txt = reescribir(n, n.start, n.end, m);
  if (nombres.length) mod(m).partes.push((n.type === 'VariableDeclaration' && n.kind === 'let' ? '' : 'export ') + txt);
  else mod(m).inicio.push(txt);
}

/* PARTS: un archivo por parte (su ficha), y la lista en partes/index */
const ARCH = ['1-movimiento', '2-choques', '3-enemigos', '4-vidas-y-puntos', '5-atacar', '6-niveles', '7-animaciones', '8-crea-tu-juego'];
const lista = PARTS_NODO.declarations[0].init.elements;
lista.forEach((e, i) => {
  const m = 'datos/partes/' + ARCH[i];
  mod(m).partes.push('export const PARTE = ' + reescribir(PARTS_NODO, e.start, e.end, m) + ';');
});
mod('datos/partes/index').partes.push(
  ARCH.map((a, i) => `import { PARTE as P${i + 1} } from './${a}.js';`).join('\n') +
  '\n\n/* Las partes del juego, en orden. Para sumar una parte: crear su archivo y agregarla a esta lista. */\nexport const PARTS = [' + ARCH.map((_, i) => 'P' + (i + 1)).join(', ') + '];');

/* exportar lo que otros importan, aunque sea `let` local (no debería pasar) */
const rel = (de, a) => { let r = posix.relative(posix.dirname(de), a); if (!r.startsWith('.')) r = './' + r; return r + '.js'; };
const salida = {};
for (const [m, M] of modulos) {
  if (m === 'estado') continue;
  const cab = [];
  if (M.usaS) cab.push(`import { S } from '${rel(m, 'estado')}';`);
  for (const [o, nombres] of [...M.importa].sort()) {
    if (o === m) continue;
    cab.push(`import { ${[...nombres].sort().join(', ')} } from '${rel(m, o)}';`);
  }
  let cuerpo = M.partes.join('\n\n');
  if (M.inicio.length) {
    const nom = 'iniciar' + m.split('/').pop().replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());
    cuerpo += `\n\nexport function ${nom}(){\n${M.inicio.map(t => '  ' + t.replace(/\n/g, '\n  ')).join('\n')}\n}`;
    M.nombreInicio = nom;
  }
  salida[m] = (cab.length ? cab.join('\n') + '\n\n' : '') + cuerpo + '\n';
}
// estado: valores compartidos + objetos const que viven ahí
const est = modulos.get('estado');
salida['estado'] = '/* Estado compartido del juego: lo que cambia mientras se juega. */\n' +
  (est && est.importa.size ? [...est.importa].map(([o, n]) => `import { ${[...n].join(', ')} } from '${rel('estado', o)}';`).join('\n') + '\n' : '') +
  `export const S = {\n${estadoInicial.join(',\n')}\n};\n\n` + (est ? est.partes.join('\n\n') + '\n' : '');

// main: llama a los iniciar en el orden en que aparecían las sentencias en el original
const orden = [];
for (const n of ast.body) { const m = modDe(n); if (!declarados(n).length && m !== 'main' && !orden.includes(m)) orden.push(m); }
const main = modulos.get('main');
salida['main'] = orden.filter(m => modulos.get(m).nombreInicio).map(m => `import { ${modulos.get(m).nombreInicio} } from '${rel('main', m)}';`).join('\n') +
  '\n' + salida['main'].replace(/^export function iniciarMain\(\)\{\n/m, '').replace(/\n\}\n$/, '\n').replace(/^  /gm, '') ;
salida['main'] = salida['main'].replace(/(\n\n)/, '$1' + orden.filter(m => modulos.get(m).nombreInicio).map(m => modulos.get(m).nombreInicio + '();').join('\n') + '\n');

for (const [m, t] of Object.entries(salida)) {
  const f = 'src/' + m + '.js'; mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, t);
}
console.log('Módulos:', Object.keys(salida).length, '· Compartidas en S:', [...compartida].join(', '));
console.log('Orden de inicio:', orden.join(' → '));
