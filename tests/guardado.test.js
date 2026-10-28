/* Lo guardado usa las mismas claves que el original y no se rompe si el navegador no deja guardar. */
import { it, expect, beforeEach } from 'vitest';
import { S } from '../src/estado.js';
import { iniciarGuardado, saveDone, registrarRecord, leerRef, guardarRef, leerSilencio, guardarSilencio } from '../src/guardado.js';

let caja;
beforeEach(() => { caja = {}; globalThis.localStorage = { getItem: k => (k in caja ? caja[k] : null), setItem: (k, v) => { caja[k] = String(v); } }; });

it('amoverse-done guarda los ids de los niveles ganados', () => {
  S.done = new Set([1, 'p2-3']); saveDone();
  expect(JSON.parse(caja['amoverse-done'])).toEqual([1, 'p2-3']);
  S.done = new Set(); iniciarGuardado();
  expect([...S.done]).toEqual([1, 'p2-3']);
});

it('amoverse-record solo cambia con un récord nuevo', () => {
  expect(registrarRecord(5)).toEqual({ anterior: 0, nuevo: true });
  expect(registrarRecord(3)).toEqual({ anterior: 5, nuevo: false });
  expect(caja['amoverse-record']).toBe('5');
});

it('amoverse-ref prendido por defecto, y se apaga con off', () => {
  expect(leerRef()).toBe(true);
  guardarRef(false); expect(caja['amoverse-ref']).toBe('off'); expect(leerRef()).toBe(false);
});

it('sin localStorage no se rompe', () => {
  globalThis.localStorage = { getItem(){ throw new Error('bloqueado'); }, setItem(){ throw new Error('bloqueado'); } };
  expect(() => { saveDone(); registrarRecord(9); guardarRef(true); iniciarGuardado(); }).not.toThrow();
  expect(leerRef()).toBe(true);
});

it('amoverse-sonido recuerda el sonido apagado', () => {
  expect(leerSilencio()).toBe(false);
  guardarSilencio(true); expect(caja['amoverse-sonido']).toBe('off'); expect(leerSilencio()).toBe(true);
});
