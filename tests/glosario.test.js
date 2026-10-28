/* Cada bloque del juego tiene su entrada en el glosario, y dice lo mismo que Scratch 3 (es). */
import { it, expect } from 'vitest';
import { GLOSARIO } from '../src/datos/glosario.js';
import { ETIQUETAS, PAL } from '../src/datos/bloques.js';

it('todos los bloques de la paleta están en el glosario', () => {
  for (const k of Object.keys(PAL)) expect(GLOSARIO[k], k).toBeTruthy();
});

it('las palabras de cada bloque aparecen en el nombre de Scratch, en el mismo orden', () => {
  for (const [k, partes] of Object.entries(ETIQUETAS)){
    const sc = GLOSARIO[k].scratch; let desde = 0;
    for (const p of partes){ const i = sc.indexOf(p.replace(' ▾', ''), desde); expect(i, `${k}: “${p}” en “${sc}”`).toBeGreaterThanOrEqual(0); desde = i + 1; }
  }
});
