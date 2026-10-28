/* Cada nivel se gana con su solución guardada (tests/soluciones.js), y también con las otras formas válidas. */
import { describe, it, expect } from 'vitest';
import { NIVELES, jugar } from './ayudante/jugar.js';
import { SOLUCIONES, ALTERNATIVAS } from './soluciones.js';

/* Bugs del original que se arreglan en la Etapa 3: el chequeo rechaza un programa que funciona. */
const BUGS_CONOCIDOS = {
  'p3-5': 'la velocidad de la avispa se mide con el último “mover”, no con la suma',
  'p5-balas': 'restar la semilla antes de crear el clon cuenta como disparo sin semillas'
};

describe.each(NIVELES.map(n => [`P${n.parte.n} ${n.nivel.id} · ${n.nivel.name}`, n]))('%s', (_, { parte, i, nivel }) => {
  if (nivel.mode === 'sandbox'){
    it('es modo libre: no tiene victoria', () => expect(SOLUCIONES[nivel.id]).toBeUndefined());
    return;
  }
  it('gana con su solución', () => {
    const sol = SOLUCIONES[nivel.id];
    expect(sol, 'falta la solución en tests/soluciones.js').toBeTruthy();
    const r = jugar(parte, i, sol);
    expect(r.gana, 'no ganó. Último mensaje: ' + r.ultimo).toBe(true);
  });
  if (ALTERNATIVAS[nivel.id]){
    const prueba = BUGS_CONOCIDOS[nivel.id] ? it.fails : it;
    prueba('gana con otra forma válida' + (BUGS_CONOCIDOS[nivel.id] ? ' (bug: ' + BUGS_CONOCIDOS[nivel.id] + ')' : ''), () => {
      const r = jugar(parte, i, ALTERNATIVAS[nivel.id]);
      expect(r.gana, 'no ganó. Último mensaje: ' + r.ultimo).toBe(true);
    });
  }
});
