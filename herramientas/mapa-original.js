/* Lista las declaraciones de primer nivel del script del original, con su línea. Sirve para repartirlo en módulos. */
import { readFileSync } from 'node:fs';
import * as acorn from 'acorn';
const html = readFileSync('original/a-moverse.html', 'utf8');
const ini = html.indexOf('<script>') + 8, fin = html.lastIndexOf('</script>');
const codigo = html.slice(ini, fin);
const base = html.slice(0, ini).split('\n').length - 1;
const ast = acorn.parse(codigo, { ecmaVersion: 2022, locations: true });
const mut = new Set();
for (const n of ast.body) {
  const l = n.loc.start.line + base;
  if (n.type === 'FunctionDeclaration') console.log(l, 'fn', n.id.name);
  else if (n.type === 'VariableDeclaration') console.log(l, n.kind, n.declarations.map(d => d.id.name || '{…}').join(','));
  else console.log(l, n.type, codigo.slice(n.start, Math.min(n.end, n.start + 60)).replace(/\n/g, ' '));
}
