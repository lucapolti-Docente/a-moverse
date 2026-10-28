import { S } from '../estado.js';
import { $ } from './dom.js';

let fbTimer = 0;

let lastMsgAt = 0;

export function say(msg, good){
  const now = performance.now();
  if (msg === S.lastMsg && now - lastMsgAt < 3500) return;
  S.lastMsg = msg; lastMsgAt = now;
  const fb = $('#fb'); fb.textContent = msg; fb.classList.toggle('good', !!good); fb.hidden = false;
  clearTimeout(fbTimer); fbTimer = setTimeout(() => fb.hidden = true, 7000);
}

export function iniciarAviso(){
  $('#fb').onclick = () => $('#fb').hidden = true;
}
