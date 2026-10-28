/* Carga el motor del juego original (original/a-moverse.html, entre ENGINE-START y ENGINE-END) tal cual, sin copiarlo.
   Sirve para comparar: el motor nuevo tiene que hacer lo mismo. */
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../original/a-moverse.html', import.meta.url), 'utf8');
const codigo = html.split('// ENGINE-START')[1].split('// ENGINE-END')[0];

export const createEngineOriginal = new Function(codigo + '\nreturn createEngine;')();
