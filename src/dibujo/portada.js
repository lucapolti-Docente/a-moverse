import { S } from '../estado.js';
import { FONT, drawBug, drawCoin, drawHeart, drawSeed, drawStar, drawWasp, reduce } from './escenario.js';
import { $ } from '../interfaz/dom.js';

export const heroCv = $('#heroCv'), partCv = $('#partCv');

export function drawHero(t){
  const showingPart = !$('#partView').hidden;
  const cvs = showingPart ? partCv : heroCv, c = cvs.getContext('2d'), W = cvs.width, H = cvs.height, k = W/480;
  c.clearRect(0, 0, W, H); c.fillStyle = '#F8FCF9'; c.fillRect(0, 0, W, H);
  c.fillStyle = '#DCE8E0'; for (let x = 20; x < W; x += 40*k) for (let y = 20; y < H; y += 40*k){ c.beginPath(); c.arc(x, y, 1.6, 0, 7); c.fill(); }
  const a = reduce ? 0 : t/1400;
  if (showingPart && S.P.rasgos.portada === 'animaciones'){
    const cos = ['paso 1','paso 2','feliz','dolor'];
    cos.forEach((n, i) => { const x = (70 + i*113)*k; drawBug(c, x, 150*k, k*1.7, '#E8553F', 1, t, false, n);
      c.save(); c.font = `700 ${15*k}px ${FONT()}`; c.textAlign = 'center'; c.fillStyle = '#5B2DB5'; c.fillText(n, x, 215*k); c.restore(); });
    const ph = reduce ? 0 : Math.floor(t/180) % 2, bx = (60 + ((t/12) % 360))*k;
    drawBug(c, bx, 290*k, k*1.6, '#E8553F', 1, t, false, ph ? 'paso 2' : 'paso 1');
    return;
  }
  if (showingPart && S.P.rasgos.portada === 'crear'){
    c.fillStyle = '#E8F5DD'; c.fillRect(0, 0, W, H);
    c.fillStyle = '#55606E'; c.fillRect(200*k, 120*k, 26*k, 200*k); c.fillStyle = '#22B04B'; c.fillRect(400*k, 30*k, 60*k, 60*k);
    drawCoin(c, 120*k, 80*k, k*1.6, t); drawHeart(c, 330*k, 270*k, k*1.6, t);
    drawWasp(c, (300 + Math.cos(a*1.5)*120)*k, 90*k, k*1.8, '#7A4DD8', Math.cos(a*1.5) > 0 ? -90 : 90, t);
    drawBug(c, (110 + Math.sin(a)*60)*k, 250*k, k*1.9, '#E8553F', 1, t, false, Math.floor(t/180) % 2 ? 'paso 2' : 'paso 1');
    return;
  }
  if (showingPart && S.P.rasgos.portada === 'niveles'){
    const cols = ['#E8F5DD','#F8ECCF','#1F2A44'];
    cols.forEach((col, i) => { c.fillStyle = col; c.fillRect(i*W/3, 0, W/3, H); });
    const ph = reduce ? 0 : (t/2500) % 3, bx = (ph * W/3) + W/6;
    drawBug(c, bx, H*0.55, k*2, '#E8553F', 1, t, true);
    c.save(); c.font = `700 ${16*k}px ${FONT()}`; c.textAlign = 'center'; ['pasto','arena','noche'].forEach((n, i) => { c.fillStyle = i === 2 ? '#E2E8F0' : '#13202B'; c.fillText(n, (i + .5)*W/3, 40*k); }); c.restore();
    return;
  }
  if (showingPart && S.P.rasgos.portada === 'avisar'){
    // la avispa aparece y desaparece; el bichito la busca
    const bx = (240 + Math.sin(a) * 150) * k, ver = Math.floor(t/900) % 2 === 0;
    drawBug(c, bx, 260*k, k*2, '#E8553F', 1, t, true);
    if (ver) drawWasp(c, (240 + Math.cos(a*1.4) * 150) * k, 90*k, k*2, '#7A4DD8', Math.cos(a*1.4) > 0 ? -90 : 90, t);
    return;
  }
  if (showingPart && S.P.rasgos.portada === 'semillas'){
    const bx = (240 + Math.sin(a) * 150) * k;
    drawBug(c, bx, 270*k, k*2, '#E8553F', 1, t, true);
    for (let i = 0; i < 3; i++){ const sy = 240 - ((t/6 + i*80) % 240); drawSeed(c, bx, sy*k, k*2, 0); }
    drawWasp(c, (240 + Math.cos(a*1.4) * 170) * k, 60*k, k*2, '#7A4DD8', Math.cos(a*1.4) > 0 ? -90 : 90, t);
    return;
  }
  if (showingPart && S.P.rasgos.portada === 'variables'){
    const bx = (240 + Math.cos(a*1.1) * 140) * k, by = (170 + Math.sin(a*2.2) * 70) * k;
    drawCoin(c, 120*k, 90*k, k*1.6, t); drawCoin(c, 360*k, 250*k, k*1.6, t); drawHeart(c, 380*k, 80*k, k*1.6, t);
    drawBug(c, bx, by, k*2, '#E8553F', 1, t, true);
    c.save(); c.font = `700 ${18*k}px ${FONT()}`; c.fillStyle = '#FF8C1A'; c.fillRect(20*k, 280*k, 130*k, 32*k); c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.fillText('puntos: 7', 30*k, 296*k); c.restore();
    return;
  }
  if (showingPart && S.P.rasgos.portada === 'enemigos'){
    const bx = (240 + Math.cos(a*1.3) * 150) * k, by = (170 + Math.sin(a*2.6) * 80) * k;
    const wx = bx - Math.cos(a*1.3 - .5) * 90*k, wy = by - Math.sin(a*2.6 - .5) * 50*k;
    drawBug(c, bx, by, k*2, '#E8553F', 1, t, true);
    drawWasp(c, wx, wy, k*2, '#7A4DD8', bx > wx ? 90 : -90, t);
    return;
  }
  if (showingPart && S.P.rasgos.portada === 'choques'){
    // mini laberinto
    const box = (x0,y0,x1,y1,col) => { c.fillStyle = col; c.fillRect(x0*k, y0*k, (x1-x0)*k, (y1-y0)*k); c.strokeStyle = '#13202B'; c.lineWidth = 2; c.strokeRect(x0*k, y0*k, (x1-x0)*k, (y1-y0)*k); };
    box(150, 0, 180, 250, '#55606E'); box(300, 110, 330, 360, '#55606E'); box(40, 280, 120, 330, '#E5322D'); box(370, 30, 450, 100, '#22B04B');
    c.fillStyle = '#fff'; c.font = `700 ${16*k}px ${FONT()}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('META', 410*k, 65*k);
    const bx = (230 + Math.sin(a*1.6) * 40) * k, by = (180 + Math.cos(a) * 110) * k;
    drawBug(c, bx, by, k*2.2, '#E8553F', 1, t, true);
    return;
  }
  const bx = W/2 + Math.cos(a) * 140*k, by = H/2 + Math.sin(a*2) * 70*k;
  [[60,60],[380,90],[100,260],[400,270]].forEach(([x,y]) => drawStar(c, x*k, y*k, k*1.3, t, false));
  drawBug(c, bx, by, k*2.4, '#E8553F', -Math.sign(Math.sin(a)) || 1, t, true);
}
