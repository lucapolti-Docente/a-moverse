import { S } from '../estado.js';
import { cv, draw, updateXY } from '../dibujo/escenario.js';
import { drawHero } from '../dibujo/portada.js';
import { $ } from './dom.js';
import { selectSprite } from './editor.js';
import { DT } from '../motor/motor.js';
import { afterStep } from '../motor/partida.js';
import { SND } from '../sonido.js';

let acc = 0, prevT = performance.now();

export function loop(now){
  const dt = Math.min(200, now - prevT); prevT = now;
  if ($('#startScreen').hidden){
    if (S.engine && S.L.mode !== 'explore'){
      // modo lento: un cuarto de la velocidad; en pausa solo avanza con el botón Paso
      acc += S.velocidad === 'lento' ? dt / 4 : S.velocidad === 'pausa' ? 0 : dt; let n = 0;
      while (acc >= DT && n < 6){ S.engine.step(); afterStep(); acc -= DT; n++; }
      if (n === 6) acc = 0;
      if (n && S.velocidad !== 'normal') resaltar();
    }
    for (const p of S.particles){ p.x += p.vx; p.y += p.vy; p.vy -= .12; p.life -= .03; }
    S.particles = S.particles.filter(p => p.life > 0);
    updateXY(); draw(now);
  } else drawHero(now);
  requestAnimationFrame(loop);
}

/* Una vuelta: todos los programas avanzan hasta su próxima espera. */
export function pasoUnaVuelta(){
  if (!S.engine || S.L.mode === 'explore') return;
  S.engine.step(); afterStep(); resaltar();
}

/* Marca los bloques que corrieron en la última vuelta y las pestañas de los personajes que tienen programas andando. */
export function resaltar(){
  const corrieron = S.velocidad !== 'normal' && S.engine && S.engine.recorrido || new Set();
  document.querySelectorAll('#program [data-id]').forEach(b => b.classList.toggle('corriendo', corrieron.has(b.dataset.id)));
  const andan = new Set(S.velocidad !== 'normal' && S.engine ? S.engine.threads.map(t => t.sprite.name) : []);
  document.querySelectorAll('#program .tab[data-sp]').forEach(tb => tb.classList.toggle('anda', andan.has(S.sprites[tb.dataset.sp].name)));
}

export function toStage(e){ const r = cv.getBoundingClientRect(); return {x:(e.clientX - r.left) / r.width * 480 - 240, y:180 - (e.clientY - r.top) / r.height * 360}; }

export function iniciarBucle(){
  cv.addEventListener('pointerdown', e => {
    if (S.L.sprites && S.L.mode !== 'cierre'){
      const p = toStage(e); const i = S.sprites.findIndex(o => !o.isClone && o.kind !== 'stage' && Math.hypot(p.x - o.x, p.y - o.y) < 30);
      if (i >= 0 && i !== S.curSp){ selectSprite(i); SND.pop(); }
      return;
    }
    if (S.L.mode !== 'explore') return;
    const p = toStage(e), s = S.sprites[0];
    if (Math.hypot(p.x - s.x, p.y - s.y) < 40){ S.dragging = true; cv.setPointerCapture(e.pointerId); }
  });
  cv.addEventListener('pointermove', e => {
    if (!S.dragging) return; const p = toStage(e), s = S.sprites[0];
    const nx = Math.round(Math.max(-224, Math.min(224, p.x))), ny = Math.round(Math.max(-164, Math.min(164, p.y)));
    if (nx !== s.x) s.face = Math.sign(nx - s.x); s.x = nx; s.y = ny; s.moved = performance.now();
  });
  cv.addEventListener('pointerup', () => S.dragging = false);
  cv.addEventListener('pointercancel', () => S.dragging = false);
}
