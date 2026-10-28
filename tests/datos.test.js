/* Los datos de las partes están completos y bien armados. */
import { describe, it, expect } from 'vitest';
import { PARTS } from '../src/datos/partes/index.js';
import { PAL } from '../src/datos/bloques.js';

// la parte 8 usa el mismo nivel como paso a paso y como libre: se cuenta una vez
const niveles = [...new Set(PARTS.flatMap(p => [...p.levels, p.free]))];

it('los ids de los niveles no se repiten', () => {
  const ids = niveles.map(l => String(l.id));
  expect(new Set(ids).size).toBe(ids.length);
});

it('las partes van numeradas de 1 en adelante', () => {
  expect(PARTS.map(p => p.n)).toEqual(PARTS.map((_, i) => i + 1));
});

describe.each(PARTS.map(p => [p.n + '. ' + p.name, p]))('Parte %s', (_, p) => {
  it('tiene nombre, descripción, frase y notas docentes', () => {
    for (const k of ['name', 'desc', 'tag']) expect(p[k]).toBeTruthy();
    expect(p.teach.length).toBeGreaterThan(0);
  });
  it('tiene modo libre', () => expect(p.free).toBeTruthy());
  it('cada nivel tiene nombre, objetivo y algo que aprender', () => {
    for (const l of p.levels){
      expect(l.name, l.id).toBeTruthy();
      expect(l.goal, l.id).toBeTruthy();
      if (l.mode !== 'sandbox') expect(l.learn, l.id).toBeTruthy();
    }
  });
  it('la paleta de cada nivel solo usa bloques que existen', () => {
    for (const l of [...p.levels, p.free]) for (const b of l.palette) expect(PAL[b], l.id + ': ' + b).toBeTruthy();
  });
});
