import { S } from '../estado.js';
import { COLORS } from '../datos/fondos.js';
import { $ } from '../interfaz/dom.js';
import { varNames } from '../motor/nombres.js';
import { walk } from '../motor/recorrer.js';
import { ESCENARIO } from '../datos/textos.js';

export const cv = $('#cv'), ctx = cv.getContext('2d');

let K = 1, CW = 480, CH = 360, DPR = 1;

export const LS = (n, min) => Math.max(n*K, min*DPR);

export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

export const FONT = () => getComputedStyle(document.body).fontFamily;

export function fit(){
  const wrap = $('#stageWrap').getBoundingClientRect();
  let w = Math.min(wrap.width, (wrap.height - 6) * 4/3) - 6; w = Math.max(160, Math.floor(w));
  const h = Math.round(w * .75), box = $('#stageBox');
  box.style.width = (w + 6) + 'px'; box.style.height = (h + 6) + 'px';
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); CW = cv.width; CH = cv.height; K = CW / 480; DPR = dpr;
}

export const SX = x => CW/2 + x*K, SY = y => CH/2 - y*K;

export function updateXY(){
  const box = $('#xy');
  if (S.L.sprites){ const b = S.sprites[0]; box.innerHTML = `<span class="ax">x: ${Math.round(b.x)}</span><span class="ay">y: ${Math.round(b.y)}</span>`; return; }
  if (S.sprites.length > 1) box.innerHTML = S.sprites.map((s,i) => `<span>${'AB'[i]}: <span class="ax">x ${Math.round(s.x)}</span> <span class="ay">y ${Math.round(s.y)}</span></span>`).join('');
  else box.innerHTML = `<span class="ax">x: ${Math.round(S.sprites[0].x)}</span><span class="ay">y: ${Math.round(S.sprites[0].y)}</span>`;
}

export function burst(x, y, col){ for (let i = 0; i < 14; i++){ const a = Math.random()*Math.PI*2, v = 1.5 + Math.random()*3; S.particles.push({x, y, vx:Math.cos(a)*v, vy:Math.sin(a)*v, life:1, col}); } }

export function starPath(c, x, y, R, r, rot){
  c.beginPath();
  for (let i = 0; i < 10; i++){ const a = rot - Math.PI/2 + i*Math.PI/5, rr = i % 2 ? r : R; c.lineTo(x + Math.cos(a)*rr, y + Math.sin(a)*rr); }
  c.closePath();
}

export function drawStar(c, x, y, k, t, faded){
  const wob = reduce ? 0 : Math.sin(t/400 + x) * .12;
  c.save(); c.globalAlpha = faded ? .45 : 1;
  starPath(c, x, y, 13*k, 6*k, wob); c.fillStyle = '#FFC93C'; c.fill(); c.lineWidth = 2.2*k; c.strokeStyle = '#13202B'; c.stroke();
  if (faded){ c.fillStyle = '#13202B'; c.font = `700 ${14*k}px ${FONT()}`; c.textAlign = 'center'; c.fillText('?', x, y - 18*k); }
  c.restore();
}

export function drawBug(c, x, y, k, color, face, t, moving, cos){
  const bob = reduce ? 0 : (moving && !cos ? Math.sin(t/45) * 1.6*k : Math.sin(t/500) * .8*k);
  const r = 16*k; y += bob;
  const hurt = cos === 'dolor', happy = cos === 'feliz';
  c.save(); c.lineWidth = 2.4*k; c.strokeStyle = '#13202B';
  // antenas (en el festejo, más paradas; en el dolor, caídas)
  const tilt = happy ? -4 : hurt ? 5 : 0;
  for (const s of [-1, 1]){ c.beginPath(); c.moveTo(x + s*5*k, y - r + 3*k); c.quadraticCurveTo(x + s*9*k, y - r - 8*k + tilt*k, x + s*12*k, y - r - 9*k + tilt*k); c.stroke();
    c.beginPath(); c.arc(x + s*12*k, y - r - 9*k + tilt*k, 3*k, 0, Math.PI*2); c.fillStyle = color; c.fill(); c.stroke(); }
  // patitas: cada disfraz de caminar tiene un pie adelante
  const feet = cos === 'paso 1' ? [[-10, -2], [5, 1]] : cos === 'paso 2' ? [[-5, 1], [10, -2]] : happy ? [[-9, -3], [9, -3]] : [[-7, 0], [7, 0]];
  c.fillStyle = '#13202B'; for (const [fx, fy] of feet){ c.beginPath(); c.ellipse(x + fx*face*k, y + r - 1*k + fy*k, 5*k, 3.2*k, 0, 0, Math.PI*2); c.fill(); }
  c.beginPath(); c.arc(x, y, r, 0, Math.PI*2); c.fillStyle = hurt ? '#F59E8B' : color; c.fill(); c.stroke();
  c.beginPath(); c.arc(x - 5*k, y - 6*k, 4*k, 0, Math.PI*2); c.fillStyle = 'rgba(255,255,255,.35)'; c.fill();
  if (hurt){
    // ojos cerrados de dolor y gotita
    c.lineWidth = 2.2*k;
    for (const s of [-1, 1]){ const ex = x + s*6.5*k; c.beginPath(); c.moveTo(ex - 4*k, y - 4*k); c.lineTo(ex + 3*k, y - 1*k); c.lineTo(ex - 4*k, y + 1*k); c.stroke(); }
    c.beginPath(); c.arc(x, y + 9*k, 3*k, 1.15*Math.PI, 1.85*Math.PI); c.stroke();
    c.beginPath(); c.moveTo(x + 15*k, y - 12*k); c.quadraticCurveTo(x + 19*k, y - 6*k, x + 15*k, y - 4*k); c.quadraticCurveTo(x + 11*k, y - 6*k, x + 15*k, y - 12*k); c.fillStyle = '#7DD3FC'; c.fill(); c.lineWidth = 1.2*k; c.stroke();
  } else if (happy){
    c.lineWidth = 2.2*k;
    for (const s of [-1, 1]){ const ex = x + s*6.5*k; c.beginPath(); c.arc(ex, y - 1*k, 4*k, 1.1*Math.PI, 1.9*Math.PI); c.stroke(); }
    c.beginPath(); c.arc(x, y + 4*k, 6*k, .1*Math.PI, .9*Math.PI); c.fillStyle = '#13202B'; c.fill();
    c.fillStyle = 'rgba(255,120,120,.6)'; for (const s of [-1, 1]){ c.beginPath(); c.ellipse(x + s*11*k, y + 4*k, 3*k, 2*k, 0, 0, Math.PI*2); c.fill(); }
  } else {
    for (const s of [-1, 1]){
      const ex = x + s*6.5*k + face*1.5*k, ey = y - 2*k;
      c.beginPath(); c.arc(ex, ey, 6*k, 0, Math.PI*2); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 1.8*k; c.stroke();
      c.beginPath(); c.arc(ex + face*2.2*k, ey + .5*k, 3*k, 0, Math.PI*2); c.fillStyle = '#13202B'; c.fill();
    }
    c.beginPath(); c.arc(x + face*1.5*k, y + 7*k, 3.2*k, .15*Math.PI, .85*Math.PI); c.lineWidth = 1.8*k; c.stroke();
  }
  c.restore();
}

export function drawWasp(c, x, y, k, color, dir, t){
  const right = Math.sin((dir == null ? 90 : dir) * Math.PI / 180) >= -0.01 ? 1 : -1;
  const bob = reduce ? 0 : Math.sin(t/90) * 1.5*k, flap = reduce ? 0 : Math.sin(t/25);
  y += bob;
  c.save(); c.translate(x, y); c.scale(right, 1);
  c.lineWidth = 2.2*k; c.strokeStyle = '#13202B';
  // alas
  c.fillStyle = 'rgba(255,255,255,.8)';
  for (const off of [-4, 4]){ c.beginPath(); c.ellipse(off*k - 2*k, -15*k, 6*k, (10 + flap*2)*k, off < 0 ? -.4 : .4, 0, Math.PI*2); c.fill(); c.stroke(); }
  // aguijón
  c.fillStyle = '#13202B'; c.beginPath(); c.moveTo(-16*k, 0); c.lineTo(-23*k, 2*k); c.lineTo(-16*k, 5*k); c.fill();
  // cuerpo con rayas
  c.beginPath(); c.ellipse(0, 2*k, 17*k, 13*k, 0, 0, Math.PI*2); c.fillStyle = color; c.fill();
  c.save(); c.clip(); c.fillStyle = '#FFD84D'; for (const sx of [-10, -2]) c.fillRect(sx*k, -12*k, 4.5*k, 28*k); c.restore();
  c.stroke();
  // ojo enojado
  c.beginPath(); c.arc(8*k, -1*k, 5.5*k, 0, Math.PI*2); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 1.8*k; c.stroke();
  c.beginPath(); c.arc(9.5*k, 0, 2.6*k, 0, Math.PI*2); c.fillStyle = '#13202B'; c.fill();
  c.beginPath(); c.moveTo(3*k, -8*k); c.lineTo(13*k, -5*k); c.lineWidth = 2.2*k; c.stroke();
  // antenita
  c.beginPath(); c.moveTo(11*k, -9*k); c.quadraticCurveTo(15*k, -17*k, 19*k, -16*k); c.stroke();
  c.restore();
}

export const monitorPulse = {};

export function drawCostumes(c, t){
  const names = ['paso 1','paso 2','feliz','dolor'], bug = S.sprites.find(o => o.kind === 'bug');
  const w = LS(52, 44), h = LS(58, 50), gap = LS(6, 4), x0 = CW - names.length*(w + gap) - LS(10, 6), y0 = LS(10, 8);
  names.forEach((n, i) => {
    const x = x0 + i*(w + gap), on = bug && (bug.costume || 'paso 1') === n;
    c.save(); c.fillStyle = on ? '#EDE4FF' : 'rgba(255,255,255,.88)'; c.strokeStyle = on ? '#9966FF' : '#CBD5E1'; c.lineWidth = on ? 3 : 1.5;
    c.beginPath(); c.roundRect(x, y0, w, h, 8); c.fill(); c.stroke();
    drawBug(c, x + w/2, y0 + h*0.46, w/62, bug ? bug.color : '#E8553F', 1, t, false, n);
    c.fillStyle = on ? '#5B2DB5' : '#475569'; c.font = `700 ${LS(10.5, 9)}px ${FONT()}`; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    c.fillText(n, x + w/2, y0 + h - LS(5, 4)); c.restore();
  });
}

export function drawMonitors(c){
  let y = LS(38, 34);
  const keys = varNames().filter(k => k in S.VARS);
  for (const k of keys){
    const v = S.VARS[k], label = k === 'tiempo' ? ESCENARIO.tiempo : k, val = k === 'vidas' && v >= 0 && v <= 6 ? (v ? '❤'.repeat(v) : '0') : String(v);
    c.save(); c.font = `700 ${LS(12, 12)}px ${FONT()}`; c.textBaseline = 'middle';
    const lw = c.measureText(label).width, vw = Math.max(c.measureText(val).width, 16*DPR), h = LS(24, 22), pad = 8*DPR;
    const w = lw + vw + pad*3 + 6*DPR, x = 8*DPR;
    const pulse = monitorPulse[k] && performance.now() - monitorPulse[k] < 300;
    c.fillStyle = 'rgba(255,255,255,.95)'; c.strokeStyle = '#13202B'; c.lineWidth = 1.5*DPR;
    c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, 6*DPR) : c.rect(x, y, w, h); c.fill(); c.stroke();
    c.fillStyle = '#13202B'; c.fillText(label, x + pad, y + h/2);
    const bx = x + pad*2 + lw, bw = vw + pad + 6*DPR;
    c.fillStyle = pulse ? '#FFB347' : '#FF8C1A'; c.beginPath(); c.roundRect ? c.roundRect(bx, y + 3*DPR, bw, h - 6*DPR, 4*DPR) : c.rect(bx, y + 3*DPR, bw, h - 6*DPR); c.fill();
    c.fillStyle = '#fff'; c.textAlign = 'center'; c.fillText(val, bx + bw/2, y + h/2 + .5*DPR);
    c.restore();
    y += LS(24, 22) + 5*DPR;
  }
  if (!S.L.showEq) return;
  const qs = [];
  S.sprites.forEach(sp => !sp.isClone && sp.program.forEach(sc => walk(sc.body, b => { if (b.type === 'if' && b.cond && ['eq','gt','lt'].includes(b.cond.type)) qs.push(b.cond); })));
  for (const q of qs.slice(0, 3)){
    const val = Number(S.VARS[q.v] ?? 0), n = Number(q.n);
    const yes = q.type === 'eq' ? val === n : q.type === 'gt' ? val > n : val < n;
    const text = `¿${q.v} ${q.type === 'eq' ? '=' : q.type === 'gt' ? '>' : '<'} ${n}?`, ans = yes ? ESCENARIO.si : ESCENARIO.no;
    c.save(); c.font = `700 ${LS(12, 12)}px ${FONT()}`; c.textBaseline = 'middle';
    const tw = c.measureText(text).width, aw = c.measureText(ans).width, h = LS(24, 22), pad = 8*DPR;
    const w = tw + aw + pad*4, x = 8*DPR;
    c.fillStyle = '#59C059'; c.strokeStyle = '#389438'; c.lineWidth = 1.5*DPR;
    c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, h/2) : c.rect(x, y, w, h); c.fill(); c.stroke();
    c.fillStyle = '#fff'; c.fillText(text, x + pad, y + h/2);
    const bx = x + tw + pad*2;
    c.fillStyle = yes ? '#178A4B' : '#6B7280'; c.beginPath(); c.roundRect ? c.roundRect(bx, y + 3*DPR, aw + pad*1.5, h - 6*DPR, 4*DPR) : c.rect(bx, y + 3*DPR, aw + pad*1.5, h - 6*DPR); c.fill();
    c.fillStyle = '#fff'; c.textAlign = 'center'; c.fillText(ans, bx + (aw + pad*1.5)/2, y + h/2 + .5*DPR);
    c.restore();
    y += h + 5*DPR;
  }
}

export function drawSeed(c, x, y, k, dir){
  c.save(); c.translate(x, y); c.rotate(((dir ?? 0)) * Math.PI / 180);
  c.beginPath(); c.ellipse(0, 0, 5*k, 9*k, 0, 0, Math.PI*2); c.fillStyle = '#8B5A2B'; c.fill(); c.lineWidth = 1.8*k; c.strokeStyle = '#13202B'; c.stroke();
  c.beginPath(); c.ellipse(-1.5*k, -3*k, 1.6*k, 3*k, 0, 0, Math.PI*2); c.fillStyle = 'rgba(255,255,255,.45)'; c.fill();
  c.restore();
}

/* Burbuja grande y transparente: muestra hasta dónde alcanza (radio 50). */
export function drawBurbuja(c, x, y, k, t){
  c.save(); c.translate(x, y);
  const r = (46 + Math.sin(t/120) * 2) * k;
  c.beginPath(); c.arc(0, 0, r, 0, Math.PI*2);
  c.fillStyle = 'rgba(125,211,252,.22)'; c.fill();
  c.lineWidth = 3*k; c.strokeStyle = 'rgba(14,116,144,.75)'; c.stroke();
  c.beginPath(); c.arc(-r*0.35, -r*0.35, r*0.22, Math.PI*1.1, Math.PI*1.7); c.lineWidth = 4*k; c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineCap = 'round'; c.stroke();
  c.restore();
}

/* Nube seca: gris, con una gotita que tiembla. */
export function drawNube(c, x, y, k, t){
  c.save(); c.translate(x, y);
  c.beginPath();
  c.arc(-10*k, 2*k, 9*k, Math.PI*0.5, Math.PI*1.5); c.arc(-2*k, -6*k, 10*k, Math.PI, Math.PI*1.9);
  c.arc(10*k, -1*k, 9*k, Math.PI*1.3, Math.PI*0.5); c.closePath();
  c.fillStyle = '#CBD5E1'; c.fill(); c.lineWidth = 2*k; c.strokeStyle = '#13202B'; c.stroke();
  c.fillStyle = '#13202B'; c.beginPath(); c.arc(-5*k, -1*k, 1.6*k, 0, Math.PI*2); c.arc(5*k, -1*k, 1.6*k, 0, Math.PI*2); c.fill();
  c.beginPath(); c.moveTo(0, 16*k + Math.sin(t/90)*1.5*k); c.quadraticCurveTo(3*k, 21*k, 0, 22*k); c.quadraticCurveTo(-3*k, 21*k, 0, 16*k + Math.sin(t/90)*1.5*k);
  c.fillStyle = '#7DD3FC'; c.fill();
  c.restore();
}

export function drawBag(c, x, y, k){
  c.save(); c.translate(x, y);
  c.beginPath(); c.moveTo(-12*k, 12*k); c.quadraticCurveTo(-15*k, -4*k, -6*k, -8*k); c.lineTo(6*k, -8*k); c.quadraticCurveTo(15*k, -4*k, 12*k, 12*k); c.closePath();
  c.fillStyle = '#D6A35C'; c.fill(); c.lineWidth = 2*k; c.strokeStyle = '#13202B'; c.stroke();
  c.beginPath(); c.moveTo(-6*k, -8*k); c.lineTo(-3*k, -13*k); c.lineTo(3*k, -13*k); c.lineTo(6*k, -8*k); c.stroke();
  for (const [sx, sy] of [[-4,2],[3,4],[0,-2]]){ c.beginPath(); c.ellipse(sx*k, sy*k, 2*k, 3*k, .4, 0, Math.PI*2); c.fillStyle = '#8B5A2B'; c.fill(); }
  c.restore();
}

export function drawCoin(c, x, y, k, t){
  const sq = reduce ? 1 : Math.abs(Math.cos(t/400)) * .7 + .3;
  c.save(); c.translate(x, y); c.scale(sq, 1);
  c.beginPath(); c.arc(0, 0, 13*k, 0, Math.PI*2); c.fillStyle = '#F5B700'; c.fill(); c.lineWidth = 2.2*k; c.strokeStyle = '#13202B'; c.stroke();
  c.beginPath(); c.arc(0, 0, 8.5*k, 0, Math.PI*2); c.strokeStyle = '#B07D00'; c.lineWidth = 1.8*k; c.stroke();
  c.fillStyle = '#B07D00'; c.font = `700 ${11*k}px ${FONT()}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('1', 0, .5*k);
  c.restore();
}

export function drawHeart(c, x, y, k, t){
  const sc = reduce ? 1 : 1 + Math.sin(t/220) * .06;
  c.save(); c.translate(x, y); c.scale(sc*k, sc*k);
  c.beginPath(); c.moveTo(0, 12); c.bezierCurveTo(-18, 0, -14, -15, 0, -7); c.bezierCurveTo(14, -15, 18, 0, 0, 12); c.closePath();
  c.fillStyle = '#E11D48'; c.fill(); c.lineWidth = 2.2; c.strokeStyle = '#13202B'; c.stroke();
  c.beginPath(); c.ellipse(-6, -5, 3, 2, -.5, 0, Math.PI*2); c.fillStyle = 'rgba(255,255,255,.6)'; c.fill();
  c.restore();
}

export function drawCompass(c){
  const at = S.L.compassAt || {x:170, y:110}, cx_ = SX(at.x), cy_ = SY(at.y), r = 34*K;
  c.save(); c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.arc(cx_, cy_, r + 14*K, 0, Math.PI*2); c.fill();
  c.strokeStyle = '#13202B'; c.lineWidth = 1.5*DPR; c.stroke();
  c.font = `700 ${LS(10.5, 10)}px ${FONT()}`; c.textAlign = 'center'; c.textBaseline = 'middle';
  [[0,'0','#B2341F'],[90,'90','#2B66BF'],[180,'180','#B2341F'],[-90,'−90','#2B66BF']].forEach(([d, lab, col]) => {
    const a = d * Math.PI / 180, ex = cx_ + Math.sin(a)*r*.62, ey = cy_ - Math.cos(a)*r*.62;
    c.strokeStyle = col; c.lineWidth = 2.5*DPR; c.beginPath(); c.moveTo(cx_, cy_); c.lineTo(ex, ey); c.stroke();
    c.fillStyle = col; c.fillText(lab, cx_ + Math.sin(a)*(r + 4*K), cy_ - Math.cos(a)*(r + 4*K));
  });
  c.restore();
}

export function drawBubble(c, x, y, k, text){
  if (!text) return;
  c.save(); c.font = `700 ${13*k}px ${FONT()}`;
  const w = c.measureText(text).width + 16*k, h = 26*k;
  let bx = x + 10*k, by = y - 58*k;
  if (bx + w > CW - 4*k) bx = x - 10*k - w;
  if (by < 4*k) by = y + 26*k;
  c.fillStyle = '#fff'; c.strokeStyle = '#13202B'; c.lineWidth = 2*k;
  c.beginPath(); c.roundRect ? c.roundRect(bx, by, w, h, 10*k) : c.rect(bx, by, w, h); c.fill(); c.stroke();
  c.fillStyle = '#13202B'; c.textBaseline = 'middle'; c.fillText(text, bx + 8*k, by + h/2);
  c.restore();
}

export function drawRock(c, x, y, k){
  c.save(); c.beginPath(); c.ellipse(x, y, 13*k, 11*k, .3, 0, Math.PI*2); c.fillStyle = '#8C98A2'; c.fill(); c.lineWidth = 2*k; c.strokeStyle = '#13202B'; c.stroke();
  c.beginPath(); c.ellipse(x - 4*k, y - 3*k, 4*k, 2.5*k, .3, 0, Math.PI*2); c.fillStyle = '#AEB8C0'; c.fill(); c.restore();
}

export function drawMap(c, t){
  for (const m of S.L.map){
    const x = SX(m.x0), y = SY(m.y1), w = (m.x1 - m.x0)*K, h = (m.y1 - m.y0)*K;
    c.save();
    c.fillStyle = COLORS[m.c].hex; c.fillRect(x, y, w, h);
    c.beginPath(); c.rect(x, y, w, h); c.clip();
    if (m.c === 'wall'){
      c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 1.5*K;
      for (let yy = y; yy < y + h; yy += 12*K){ c.beginPath(); c.moveTo(x, yy); c.lineTo(x + w, yy); c.stroke(); }
    } else if (m.c === 'lava'){
      c.fillStyle = '#FF8A3D';
      const ph = reduce ? 0 : t/600;
      for (let i = 0; i < 6; i++){ const bx = x + ((i*37 + 11) % Math.max(1, w)), by = y + ((i*53 + 7) % Math.max(1, h)); c.beginPath(); c.arc(bx, by, (4 + 2*Math.sin(ph + i))*K, 0, Math.PI*2); c.fill(); }
    } else if (m.c === 'ice'){
      c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = 2*K;
      for (let i = -h; i < w; i += 28*K){ c.beginPath(); c.moveTo(x + i, y + h); c.lineTo(x + i + h*.35, y); c.stroke(); }
      c.fillStyle = '#1D6E8C'; c.font = `700 ${13*K}px ${FONT()}`; c.textAlign = 'center'; c.textBaseline = 'top';
      c.fillText('HIELO ▶▶', x + w/2, y + 8*K);
    } else if (m.c === 'mud'){
      c.fillStyle = 'rgba(60,35,15,.25)';
      for (let i = 0; i < 40; i++){ const bx = x + ((i*47 + 13) % Math.max(1, w)), by = y + ((i*71 + 29) % Math.max(1, h)); c.beginPath(); c.ellipse(bx, by, 6*K, 3*K, 0, 0, Math.PI*2); c.fill(); }
      c.fillStyle = 'rgba(255,255,255,.85)'; c.font = `700 ${13*K}px ${FONT()}`; c.textAlign = 'center'; c.textBaseline = 'top';
      c.fillText('BARRO', x + w/2, y + 8*K);
    } else if (m.c === 'goal'){
      const sq = 10*K; c.fillStyle = 'rgba(255,255,255,.28)';
      for (let i = 0; i * sq < w; i++) for (let j = 0; j * sq < h; j++) if ((i + j) % 2) c.fillRect(x + i*sq, y + j*sq, sq, sq);
      c.fillStyle = '#fff'; c.font = `700 ${13*K}px ${FONT()}`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('META', x + w/2, y + h/2);
    }
    c.restore();
    c.strokeStyle = '#13202B'; c.lineWidth = 2*K; c.strokeRect(x, y, w, h);
  }
}

export function pill(c, text, x, y, col, align){
  c.save(); c.font = `700 ${LS(11.5, 11)}px ${FONT()}`; c.textBaseline = 'middle';
  const w = c.measureText(text).width + LS(14, 12), h = LS(20, 19), x0 = align === 'right' ? x - w : x;
  c.fillStyle = col; c.beginPath(); c.roundRect ? c.roundRect(x0, y - h/2, w, h, h/2) : c.rect(x0, y - h/2, w, h); c.fill();
  c.fillStyle = '#fff'; c.textAlign = 'left'; c.fillText(text, x0 + LS(7, 6), y + .5*K);
  c.restore();
}

export function rulerGeom(withY){
  const hB = LS(24, 22), wR = withY ? LS(36, 32) : 0;
  return {hB, wR, yB: CH - hB, xR: CW - wR};
}

export function drawRulerX(c, g, mark){
  const font = FONT();
  c.save();
  c.fillStyle = 'rgba(255,255,255,.92)'; c.fillRect(0, g.yB, g.xR, g.hB);
  c.strokeStyle = '#13202B'; c.lineWidth = 1.5*DPR; c.beginPath(); c.moveTo(0, g.yB); c.lineTo(g.xR, g.yB); c.stroke();
  if (mark){ c.fillStyle = 'rgba(232,85,63,.22)'; const a = SX(Math.min(mark.a, mark.b)), b = SX(Math.max(mark.a, mark.b)); c.fillRect(a, g.yB, b - a, g.hB); }
  c.strokeStyle = '#2B66BF';
  for (let x = -240; x <= 240; x += 10){
    const X = SX(x); if (X > g.xR) break;
    const len = x % 100 === 0 ? .45 : x % 50 === 0 ? .3 : .18;
    c.lineWidth = (x % 100 === 0 ? 1.6 : 1) * DPR; c.beginPath(); c.moveTo(X, g.yB); c.lineTo(X, g.yB + g.hB*len); c.stroke();
  }
  c.fillStyle = '#2B66BF'; c.font = `700 ${LS(10, 10)}px ${font}`; c.textBaseline = 'bottom'; c.textAlign = 'center';
  const lw = c.measureText(ESCENARIO.menosX).width + 10*DPR, rw = c.measureText(ESCENARIO.masX).width + 10*DPR;
  for (const x of [-100, 0, 100]){
    const half = c.measureText(String(x)).width / 2 + 3*DPR, X = SX(x);
    if (X - half > lw && X + half < g.xR - rw) c.fillText(String(x), X, CH - 2*DPR);
  }
  c.textAlign = 'left'; c.fillText(ESCENARIO.menosX, 4*DPR, CH - 2*DPR);
  c.textAlign = 'right'; c.fillText(ESCENARIO.masX, g.xR - 4*DPR, CH - 2*DPR);
  c.restore();
}

export function drawRulerY(c, g){
  const font = FONT();
  c.save();
  c.fillStyle = 'rgba(255,255,255,.92)'; c.fillRect(g.xR, 0, g.wR, CH);
  c.strokeStyle = '#13202B'; c.lineWidth = 1.5*DPR; c.beginPath(); c.moveTo(g.xR, 0); c.lineTo(g.xR, CH); c.stroke();
  c.strokeStyle = '#B2341F';
  for (let y = -180; y <= 180; y += 10){
    const Y = SY(y), len = y % 100 === 0 ? .4 : y % 50 === 0 ? .26 : .15;
    c.lineWidth = (y % 100 === 0 ? 1.6 : 1) * DPR; c.beginPath(); c.moveTo(g.xR, Y); c.lineTo(g.xR + g.wR*len, Y); c.stroke();
  }
  c.fillStyle = '#B2341F'; c.font = `700 ${LS(10, 10)}px ${font}`; c.textBaseline = 'middle'; c.textAlign = 'right';
  for (const y of [-100, 0, 100]) c.fillText(String(y), CW - 3*DPR, SY(y));
  c.textAlign = 'center'; c.textBaseline = 'top'; c.fillText('▲', g.xR + g.wR/2, 3*DPR); c.fillText(ESCENARIO.mas, g.xR + g.wR/2, 3*DPR + LS(11, 11));
  c.textBaseline = 'bottom'; c.fillText(ESCENARIO.menos, g.xR + g.wR/2, CH - 3*DPR - LS(11, 11)); c.fillText('▼', g.xR + g.wR/2, CH - 3*DPR);
  c.restore();
}

export function dotted(c, x0, y0, x1, y1, col){
  c.save(); c.setLineDash([3*DPR, 4*DPR]); c.strokeStyle = col; c.lineWidth = 1.6*DPR;
  c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.restore();
}

export function markerX(c, g, X, col){ c.save(); c.fillStyle = col; c.beginPath(); c.moveTo(X, g.yB + 1); c.lineTo(X - 5*DPR, g.yB - 7*DPR); c.lineTo(X + 5*DPR, g.yB - 7*DPR); c.fill(); c.restore(); }

export function markerY(c, g, Y, col){ c.save(); c.fillStyle = col; c.beginPath(); c.moveTo(g.xR - 1, Y); c.lineTo(g.xR - 8*DPR, Y - 5*DPR); c.lineTo(g.xR - 8*DPR, Y + 5*DPR); c.fill(); c.restore(); }

export function drawMeasure(c){
  const s = S.sprites[0];
  const target = S.stars.filter(st => !st.got && !st.opt && Math.abs(st.y - s.y) < 1)[0];
  const g = rulerGeom(false);
  drawRulerX(c, g, target ? {a:s.x, b:target.x} : null);
  dotted(c, SX(s.x), SY(s.y) + 18*K, SX(s.x), g.yB, '#2B66BF'); markerX(c, g, SX(s.x), '#2B66BF');
  if (!target) return;
  dotted(c, SX(target.x), SY(target.y) + 14*K, SX(target.x), g.yB, '#B88A00'); markerX(c, g, SX(target.x), '#B88A00');
  const dist = Math.round(target.x - s.x);
  if (Math.abs(dist) < 10) return;
  const txt_ = `faltan ${Math.abs(dist)} pasos ${dist < 0 ? '◀' : '▶'}`;
  c.save(); c.font = `700 ${LS(12, 12)}px ${FONT()}`; c.textAlign = 'center'; c.textBaseline = 'bottom';
  const mx = (SX(s.x) + SX(target.x)) / 2, w = c.measureText(txt_).width + 10*DPR, y = g.yB - 10*DPR, h = LS(16, 16);
  c.fillStyle = 'rgba(255,255,255,.9)'; c.fillRect(mx - w/2, y - h, w, h);
  c.fillStyle = '#13202B'; c.fillText(txt_, mx, y);
  c.restore();
}

export function drawAxes(c){
  c.save();
  c.strokeStyle = '#E1ECE5'; c.lineWidth = 1;
  for (let x = -240; x <= 240; x += 40){ c.beginPath(); c.moveTo(SX(x), 0); c.lineTo(SX(x), CH); c.stroke(); }
  for (let y = -160; y <= 160; y += 40){ c.beginPath(); c.moveTo(0, SY(y)); c.lineTo(CW, SY(y)); c.stroke(); }
  c.lineWidth = 1.5*DPR; c.globalAlpha = .55;
  c.strokeStyle = '#2B66BF'; c.beginPath(); c.moveTo(0, SY(0)); c.lineTo(CW, SY(0)); c.stroke();
  c.strokeStyle = '#B2341F'; c.beginPath(); c.moveTo(SX(0), 0); c.lineTo(SX(0), CH); c.stroke();
  c.restore();
}

export function drawAxesRulers(c){
  const g = rulerGeom(true), s = S.sprites[0];
  drawRulerX(c, g); drawRulerY(c, g);
  if (S.sprites.length !== 1) return;
  dotted(c, SX(s.x), SY(s.y) + 18*K, SX(s.x), g.yB, '#2B66BF'); markerX(c, g, SX(s.x), '#2B66BF');
  dotted(c, SX(s.x) + 18*K, SY(s.y), g.xR, SY(s.y), '#B2341F'); markerY(c, g, SY(s.y), '#B2341F');
}

export function draw(t){
  const c = ctx; c.clearRect(0, 0, CW, CH);
  const bd = S.L.backdrops && S.L.backdrops[S.BACKDROP];
  c.fillStyle = bd ? bd.bg : '#F8FCF9'; c.fillRect(0, 0, CW, CH);
  if (bd){
    c.fillStyle = bd.dot; for (let x = -220; x <= 220; x += 40) for (let y = -160; y <= 160; y += 40){ c.beginPath(); c.arc(SX(x), SY(y), (bd.dark ? 1.2 : 2)*K, 0, Math.PI*2); c.fill(); }
    if (bd.dark){ c.fillStyle = '#FDE68A'; for (let i = 0; i < 14; i++){ const sx = (i*97 % 470) - 235, sy = (i*61 % 340) - 170; c.beginPath(); c.arc(SX(sx), SY(sy), 1.4*K, 0, Math.PI*2); c.fill(); } }
    c.save(); c.font = `700 ${LS(11.5, 11)}px ${FONT()}`; const fw = c.measureText(ESCENARIO.fondo(S.BACKDROP)).width + LS(14, 12); c.restore();
    pill(c, ESCENARIO.fondo(S.BACKDROP), CW/2 - fw/2, LS(18, 16), bd.dark ? '#475569' : '#64748B', 'left');
  }
  if (S.L.axes) drawAxes(c);
  else if (bd){}
  else { c.fillStyle = '#DCE8E0'; for (let x = -220; x <= 220; x += 40) for (let y = -160; y <= 160; y += 40){ c.beginPath(); c.arc(SX(x), SY(y), 1.6*K, 0, Math.PI*2); c.fill(); } }
  if (S.L.map) drawMap(c, t);
  if (S.L.mode === 'cierre' && S.sprites.length === 2 && !S.L.sprites){
    c.save(); c.setLineDash([8*K, 6*K]); c.strokeStyle = '#13202B'; c.lineWidth = 2*K; c.beginPath(); c.moveTo(0, SY(0)); c.lineTo(CW, SY(0)); c.stroke(); c.restore();
    c.font = `700 ${15*K}px ${FONT()}`; c.textAlign = 'right'; c.textBaseline = 'top';
    c.fillStyle = S.sprites[0].color; c.fillText(S.sprites[0].label, SX(232), SY(172));
    c.fillStyle = S.sprites[1].color; c.fillText(S.sprites[1].label, SX(232), SY(-6));
  }
  if (S.L.rocks) for (const r of S.L.rocks) drawRock(c, SX(r.x), SY(r.y), K);
  if (S.L.timeLimit){
    const left = S.R.stopOnGoal ? Math.max(0, S.L.timeLimit - (S.R.tEnd || 0)) : S.R.tStart == null ? S.L.timeLimit : Math.max(0, S.L.timeLimit - (S.engine.time - S.R.tStart));
    pill(c, ESCENARIO.segundos((left/1000).toFixed(1)), CW/2 - LS(36, 34), LS(22, 20), left < 350 ? '#C8332F' : '#13202B', 'left');
  }
  if (S.showRef && S.L.measure && !S.L.axes) drawMeasure(c);
  if (S.showRef && S.L.axes) drawAxesRulers(c);
  for (const s of S.stars) if (!s.got) drawStar(c, SX(s.x), SY(s.y), K, t, s.opt);
  for (const s of S.stars) if (!s.got && s.hold > 0){
    c.save(); c.strokeStyle = '#178A4B'; c.lineWidth = 4*K; c.lineCap = 'round';
    c.beginPath(); c.arc(SX(s.x), SY(s.y), 24*K, -Math.PI/2, -Math.PI/2 + Math.PI*2*Math.min(1, s.hold/30)); c.stroke(); c.restore();
  }
  if (S.L.compass && S.showRef) drawCompass(c);
  if (S.L.sprites && S.L.mode !== 'cierre' && S.sprites[S.curSp] && S.sprites[S.curSp].kind !== 'stage' && !(S.sprites[S.curSp].hidden && ['seed','bubble','cloud'].includes(S.sprites[S.curSp].kind))){
    const cs = S.sprites[S.curSp]; c.save(); c.setLineDash([4*DPR, 4*DPR]); c.strokeStyle = '#13202B'; c.lineWidth = 2*DPR;
    c.beginPath(); c.arc(SX(S.L.tween ? (cs.vx ?? cs.x) : cs.x), SY(S.L.tween ? (cs.vy ?? cs.y) : cs.y), 27*K, 0, Math.PI*2); c.stroke(); c.restore();
  }
  for (const s of S.sprites){
    if (S.L.tween){
      if (s.vx == null){ s.vx = s.x; s.vy = s.y; }
      const dx = s.x - s.vx, dy = s.y - s.vy, d = Math.hypot(dx, dy), step = 9;
      if (d <= step || reduce){ s.vx = s.x; s.vy = s.y; } else { s.vx += dx / d * step; s.vy += dy / d * step; }
    }
    const px = S.L.tween ? s.vx : s.x, py = S.L.tween ? s.vy : s.y;
    if (s.kind === 'stage') continue;
    if (s.hidden){
      if (s.isClone || s.kind === 'seed' || s.kind === 'bubble' || s.kind === 'cloud') continue;
      c.save(); c.globalAlpha = .18;
      if (S.L.noGhost) { c.restore(); continue; }
      if (s.kind === 'wasp') drawWasp(c, SX(px), SY(py), K, s.color, s.dir, t); else drawBug(c, SX(px), SY(py), K, s.color, s.face, t, false, s.costume);
      c.restore();
      c.save(); c.font = `700 ${LS(10, 10)}px ${FONT()}`; c.textAlign = 'center'; c.textBaseline = 'top'; c.fillStyle = '#43535F';
      c.fillText(ESCENARIO.escondida(s.name), SX(px), SY(py) + 22*K); c.restore();
      continue;
    }
    if (s.kind === 'seed'){ drawSeed(c, SX(px), SY(py), K, s.dir); continue; }
    if (s.kind === 'bubble'){ drawBurbuja(c, SX(px), SY(py), K, t); continue; }
    if (s.kind === 'cloud'){ drawNube(c, SX(px), SY(py), K, t); continue; }
    if (s.kind === 'bag'){ drawBag(c, SX(px), SY(py), K); }
    else
    if (s.kind === 'wasp'){ drawWasp(c, SX(px), SY(py), K, s.color, s.dir, t); if (S.L.tween) continue; }
    else if (s.kind === 'coin') drawCoin(c, SX(s.x), SY(s.y), K, t);
    else if (s.kind === 'heart') drawHeart(c, SX(s.x), SY(s.y), K, t);
    else drawBug(c, SX(s.x), SY(s.y), K, s.color, s.face, t, performance.now() - s.moved < 120, s.costume);
    if (S.L.sprites && S.sprites.length > 1 && !s.isClone){
      c.save(); c.font = `700 ${LS(10, 10)}px ${FONT()}`; c.textAlign = 'center'; c.textBaseline = 'top';
      const ty = SY(s.y) + 22*K, w = c.measureText(s.name).width + 8*DPR;
      c.fillStyle = 'rgba(255,255,255,.85)'; c.fillRect(SX(s.x) - w/2, ty, w, LS(13, 13));
      c.fillStyle = '#13202B'; c.fillText(s.name, SX(s.x), ty + 1*DPR); c.restore();
    }
  }
  for (const s of S.sprites) drawBubble(c, SX(s.x), SY(s.y), K, s.bubble);
  if (S.L.vars) drawMonitors(c);
  if (S.L.showCostumes) drawCostumes(c, t);
  for (const p of S.particles){ c.globalAlpha = Math.max(0, p.life); starPath(c, SX(p.x), SY(p.y), 5*K*p.life + 1, 2.2*K*p.life + .5, 0); c.fillStyle = p.col || '#FFC93C'; c.fill(); }
  c.globalAlpha = 1;
}

export function iniciarEscenario(){
  new ResizeObserver(fit).observe($('#stageWrap'));
}
