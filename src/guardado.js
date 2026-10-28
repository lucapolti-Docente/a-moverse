/* Lo que se guarda en el navegador. Las claves son las del juego original y no cambian:
   amoverse-done (ids de niveles ganados), amoverse-record (récord de la lluvia infinita) y amoverse-ref (reglas a la vista). */
import { S } from './estado.js';

const leer = (clave, def) => { try { const v = localStorage.getItem(clave); return v == null ? def : v; } catch(e){ return def; } };
const escribir = (clave, valor) => { try { localStorage.setItem(clave, valor); } catch(e){} };

export const saveDone = () => escribir('amoverse-done', JSON.stringify([...S.done]));

/* Guarda el récord si es nuevo. Devuelve el récord anterior y si se superó. */
export function registrarRecord(pts){
  const anterior = Number(leer('amoverse-record', 0)) || 0, nuevo = pts > anterior;
  if (nuevo) escribir('amoverse-record', String(pts));
  return { anterior, nuevo };
}

/* El sonido apagado se recuerda en amoverse-sonido. */
export const leerSilencio = () => leer('amoverse-sonido', 'on') === 'off';
export const guardarSilencio = apagado => escribir('amoverse-sonido', apagado ? 'off' : 'on');

export const leerRef = () => leer('amoverse-ref', 'on') !== 'off';
export const guardarRef = on => escribir('amoverse-ref', on ? 'on' : 'off');

/* Creá tu juego: el proyecto se guarda en amoverse-crea (programas, variables creadas y lista de terminado). */
export function leerCreacion(){ try { return JSON.parse(leer('amoverse-crea', 'null')); } catch(e){ return null; } }
export const guardarCreacion = datos => escribir('amoverse-crea', JSON.stringify(datos));
export const borrarCreacion = () => { try { localStorage.removeItem('amoverse-crea'); } catch(e){} };

export function iniciarGuardado(){
  try { S.done = new Set(JSON.parse(leer('amoverse-done', '[]'))); } catch(e){}
}
