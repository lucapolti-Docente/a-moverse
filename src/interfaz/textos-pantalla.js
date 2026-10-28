/* Completa los textos fijos de index.html con los de datos/textos.js. */
import { PANTALLA } from '../datos/textos.js';

export function ponerTextos(){
  document.querySelectorAll('[data-t]').forEach(e => { e.textContent = PANTALLA[e.dataset.t]; });
  document.querySelectorAll('[data-ta]').forEach(e => e.setAttribute('aria-label', PANTALLA[e.dataset.ta]));
  document.querySelectorAll('[data-tt]').forEach(e => { e.title = PANTALLA[e.dataset.tt]; });
}
