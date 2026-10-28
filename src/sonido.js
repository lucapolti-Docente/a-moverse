import { S } from './estado.js';

let AC = null;

let lastTick = 0;

export function ac(){
  if (!AC){ try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){ return null; } }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}

export function tone(f, d, type='sine', v=.12, delay=0, to=null){
  if (S.muted) return; const a = ac(); if (!a) return;
  const t0 = a.currentTime + delay, o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t0); if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + d);
  g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(v, t0 + .01); g.gain.exponentialRampToValueAtTime(.0008, t0 + d);
  o.connect(g).connect(a.destination); o.start(t0); o.stop(t0 + d + .02);
}

export const SND = {
  pop(){ tone(620,.07,'triangle',.09); },
  flag(){ tone(523,.09,'triangle',.1); tone(784,.12,'triangle',.1,.08); },
  star(){ tone(988,.09,'sine',.14); tone(1480,.16,'sine',.12,.07); },
  bump(){ tone(180,.22,'square',.06,0,80); },
  thud(){ const n = performance.now(); if (n - lastTick < 160) return; lastTick = n; tone(140,.06,'triangle',.07); },
  lava(){ tone(300,.3,'sawtooth',.06,0,90); },
  oops(){ tone(392,.12,'sine',.08); tone(311,.18,'sine',.08,.11); },
  win(){ [523,659,784,1047].forEach((f,i) => tone(f,.18,'triangle',.12,i*.1)); },
  tick(){ const n = performance.now(); if (n - lastTick < 110) return; lastTick = n; tone(260 + Math.random()*60,.035,'triangle',.035); },
};
