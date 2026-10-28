import { R_ } from '../fondos.js';
import { BAG, BUG, NUBE, SEED } from '../personajes.js';
import { MOVE_S, OVER_S, SEED_CLONE } from '../programas.js';
import { chV, cloneB, cx, cy, delB, eqB, fe, gtB, hatClone, hatFlag, hatKey, hatMsg, hideB, iff, kp, ltB, mv, pdirB, rndB, sayB, sendB, setV, showB, stopB, tc, toO, waitB } from '../../motor/bloques.js';
import { corrida, progOf, scan, vars } from '../../motor/reglas.js';
import { walk } from '../../motor/recorrer.js';
import { registrarRecord } from '../../guardado.js';

/* el bichito de la lluvia: costados, semillas, vidas y puntos */
const BICHO_LLUVIA = (reglas) => BUG(0,-140, () => [Object.assign(hatFlag(fe(iff(kp('right'), cx(10)), iff(kp('left'), cx(-10)))), {fold:'moverse solo para los costados'}),
  Object.assign(hatFlag(setV('vidas', 3), setV('puntos', 0), setV('semillas', 10)), {fold:'al empezar: 3 vidas, 0 puntos, 10 semillas'}),
  Object.assign(hatKey('space', iff(gtB('semillas', 0), cloneB('Semilla'), chV('semillas', -1))), {fold:'con espacio: tirar una semilla si quedan'}),
  Object.assign(hatMsg('ay', chV('vidas', -1)), {fold:'al recibir ay: pierdo una vida'}),
  Object.assign(hatMsg('florecí', chV('puntos', 1)), {fold:'al recibir florecí: sumo un punto'}),
  reglas]);
const NUBE_GENERADOR = () => hatFlag(hideB(), fe(waitB(1.2), rndB(), cy(400), cloneB('mí mismo')));
const BOLSA_LLUVIA = () => BAG(120, -164, () => [Object.assign(hatFlag(fe(iff(toO('Bichito'), chV('semillas', 5), rndB(), cy(-400)))), {fold:'si me toca el bichito, le doy 5 semillas y salto'})]);
const SUELO = [R_(-240,-180,240,-170,'lava')];

export const LEVELS7 = [
  {id:'p5-mayor', name:'¿Mayor o menor?', short:'Mayor y menor',
   intro:{title:'Mayor que y menor que',
     text:'Además de “=”, hay dos preguntas para comparar números (Operadores, verde). “>” es MAYOR QUE: ¿semillas > 3? es sí con 4, 5, 6… “<” es MENOR QUE: ¿semillas < 3? es sí con 0, 1 y 2. Truco: la boca abierta del símbolo mira al número más grande.',
     example:() => [hatFlag(fe(iff(ltB('semillas', 3), sayB('¡Pocas!')), iff(gtB('semillas', 3), sayB('¡Muchas!'))))], note:'Con 0, 1 o 2 dice “¡Pocas!”. Con 4 o más dice “¡Muchas!”. Con 3 justo, ninguna de las dos es sí.'},
   goal:'Cada bolsa da 1 semilla. En el programa vacío del bichito: si semillas < 3 → decir “¡Pocas!”; si semillas > 3 → decir “¡Muchas!”. Mirá el cartel verde: contesta SÍ o NO. Juntá 4 semillas.',
   palette:['if','gt','lt','say'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], showEq:true,
   vars:{semillas:0}, varNames:['semillas'],
   sprites:[BUG(-190,-140, () => [MOVE_S(), Object.assign(hatFlag(setV('semillas', 0)), {fold:'al empezar: 0 semillas'}), hatFlag(fe())]),
     BAG(60, 40, () => [Object.assign(hatFlag(fe(iff(toO('Bichito'), chV('semillas', 1), rndB()))), {fold:'si me toca el bichito, le doy 1 semilla y salto'})])],
   check:R => {
     if ((vars().semillas ?? 0) < 4) return false;
     if (!R.saidLt) return 'Tenés ' + vars().semillas + ', pero falta: si semillas < 3 → decir “¡Pocas!”. Apretá la banderita para probar desde 0.';
     if (!R.saidGt) return 'Tenés más de 3, pero falta: si semillas > 3 → decir “¡Muchas!”.';
     return true;
   },
   learn:'“>” es mayor que y “<” es menor que. Igual que “=”, adentro del “si” son preguntas que se contestan sí o no.'},
  {id:'p5-balas', name:'Semillas en la bolsa', short:'La bolsa',
   intro:{title:'Sin semillas, no se tira',
     text:'La variable “semillas” cuenta cuántas te quedan. Las bolsas te dan más. Antes de tirar, preguntás si te quedan: ¿semillas > 0? Si sí, creás el clon y restás una.',
     example:() => [hatKey('space', iff(gtB('semillas', 0), cloneB('Semilla'), chV('semillas', -1)))], note:'Si no te quedan, la pregunta dice que no y no sale nada.'},
   goal:'Ahora tirás semillas sin límite. Hacé que necesites tenerlas: en el bichito, envolvé “crear clon” con “si semillas > 0” y agregá “sumar a semillas −1”. Juntá una bolsa y tirá 3.',
   palette:['if','gt','changevar'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selStart:true, defaultKey:'space', spaceBtn:true,
   vars:{semillas:0}, varNames:['semillas'],
   sprites:[BUG(-190,-140, () => [MOVE_S(), Object.assign(hatFlag(setV('semillas', 0)), {fold:'al empezar: 0 semillas'}), hatKey('space', cloneB('Semilla'))]),
     BAG(60, 40, () => [Object.assign(hatFlag(fe(iff(toO('Bichito'), chV('semillas', 3), rndB()))), {fold:'si me toca el bichito, le doy 3 semillas y salto'})]),
     SEED(-190, -140, () => SEED_CLONE())],
   check:R => {
     if ((R.legitShots || 0) < 3) return false;
     if (R.freeShot) return 'En algún momento tiraste sin tener semillas. Envolvé “crear clon” con “si semillas > 0” y apretá la banderita.';
     const resta = scan(progOf('Bichito'), b => b.type === 'changevar' && b.v === 'semillas' && Number(b.n) < 0);
     if (!resta) return 'Tiraste, pero las semillas no bajan. Agregá “sumar a semillas −1” adentro del “si”.';
     return true;
   },
   learn:'Con “¿semillas > 0?” solo tirás si te quedan. Cada vez que tirás, restás una.'},
  {id:'p5-lluvia', name:'Lluvia de nubes', short:'Lluvia de nubes',
   intro:{title:'Un juego de verdad',
     text:'Las nubes secas son clones que bajan. La nube original está escondida arriba y, por siempre: espera, salta a un lugar de arriba y crea un clon. Cada clon baja; si te toca o llega al suelo rojo, envía “ay” y perdés una vida. Vos te movés de costado y tirás semillas (si te quedan). Falta que la nube florezca cuando le llega una semilla.',
     example:() => [hatClone(fe(iff(toO('Semilla'), sendB('florecí'), delB())))], note:'Si al clon de la nube lo toca una semilla: envía “florecí” (el bichito suma un punto) y se borra.'},
   goal:'Tocá la pestaña de la nube. Adentro del “por siempre” de su clon: si ¿tocando Semilla? → enviar florecí → eliminar este clon. Juntá bolsas y llegá a 5 puntos.',
   palette:['if','toucho','broadcast','delclone'], resetOnFlag:true, start:{x:0,y:-140}, stars:[], selSprite:1, selInIf:false, defaultKey:'space', spaceBtn:true,
   vars:{vidas:3, puntos:0, semillas:10}, varNames:['vidas','puntos','semillas'], msgs:['florecí','ay'],
   map:SUELO,
   sprites:[BICHO_LLUVIA(Object.assign(hatFlag(fe(iff(eqB('vidas', 0), sayB('¡Se terminó!'), stopB()), iff(eqB('puntos', 10), sayB('¡Ganaste!'), stopB()))), {fold:'reglas: con 0 vidas se termina; con 10 puntos, ganaste'})),
     NUBE(0, 164, () => [NUBE_GENERADOR(), hatClone(showB(), pdirB(180), fe(mv(3), iff(toO('Bichito'), sendB('ay'), delB()), iff(tc('lava'), sendB('ay'), delB())))]),
     SEED(0, -140, () => SEED_CLONE()), BOLSA_LLUVIA()],
   check:R => {
     const florece = scan(progOf('Nube'), b => b.type === 'if' && b.cond && b.cond.type === 'toucho' && b.cond.target === 'Semilla' && (() => { let d = false; walk(b.body, x => { if (x.type === 'delclone') d = true; }); return d; })());
     if (R.stopPts == null) return false;
     if (!florece) return 'Se terminó, pero ninguna nube floreció. En el clon de la nube: si ¿tocando Semilla? → enviar florecí → eliminar este clon.';
     if (R.stopPts >= 5) return true;
     return 'Hiciste ' + R.stopPts + ' puntos. ¡Apretá la banderita y probá llegar a 5!';
   },
   learn:() => corrida().stopPts >= 10 ? '¡Ganaste! Un juego de verdad: clones que bajan, semillas que se gastan, vidas, puntos y reglas para ganar y para terminar.' : '¡Bien jugado! Llegaste a ' + corrida().stopPts + ' puntos. Cada nube florece cuando le llega una semilla. Si querés, quedate y probá llegar a 10.'},
  {id:'p5-cierre', name:'Lluvia infinita', short:'Juego infinito', mode:'arcade',
   intro:{title:'Jugá todo lo que quieras',
     text:'Este es el juego completo, ya programado. No termina: las nubes siguen bajando hasta que te quedes sin vidas. Mirá los programas de cada personaje y cambiá números para hacerlo más fácil o más difícil: la velocidad de las nubes, cada cuánto aparecen, cuántas semillas da la bolsa.'},
   goal:'¡Juego infinito! Movete para los costados, hacé florecer las nubes, juntá bolsas de semillas y aguantá todo lo que puedas. ¿Cuál es tu récord?',
   palette:[], resetOnFlag:true, start:{x:0,y:-140}, stars:[], defaultKey:'space', spaceBtn:true,
   vars:{vidas:3, puntos:0, semillas:10}, varNames:['vidas','puntos','semillas'], msgs:['florecí','ay'],
   map:SUELO,
   sprites:[BICHO_LLUVIA(Object.assign(OVER_S(), {fold:'si me quedo sin vidas, se termina'})),
     NUBE(0, 164, () => [Object.assign(hatFlag(hideB(), fe(waitB(1), rndB(), cy(400), cloneB('mí mismo'))), {fold:'cada segundo: crear una nube nueva arriba'}),
       Object.assign(hatClone(showB(), pdirB(180), fe(mv(3), iff(toO('Bichito'), sendB('ay'), delB()), iff(tc('lava'), sendB('ay'), delB()), iff(toO('Semilla'), sendB('florecí'), delB()))), {fold:'soy una nube: bajo; si me toca algo, aviso y me borro'})]),
     SEED(0, -140, () => SEED_CLONE().map(sc => Object.assign(sc, {fold: sc.fold || 'soy una semilla: salgo del bichito y vuelo para arriba'}))),
     BOLSA_LLUVIA()],
   check:R => R.stopPts != null,
   learn:() => {
     const pts = corrida().stopPts || 0, { anterior: best, nuevo } = registrarRecord(pts);
     return nuevo ? `¡Nuevo récord: ${pts} nubes florecidas! Apretá la banderita para jugar otra vez.` : `Hiciste ${pts} puntos. Tu récord es ${best}. ¡Apretá la banderita y superalo!`;
   }},
];

export const FREE7 = {id:'libre-comparar', name:'Modo libre', short:'Libre', mode:'free', intro:{title:'Modo libre', text:'Armá tu juego: bolsas de semillas, nubes que bajan, comparaciones y puntos.'},
  goal:'Armá tu juego con semillas y comparaciones.', vars:{puntos:0, semillas:5}, varNames:['puntos','semillas'], allowCreateVar:true, defaultKey:'space', spaceBtn:true, msgs:['florecí','ay'],
  palette:['flag','key','whenmsg','whenclone','broadcast','forever','if','toucho','keyp','and','or','eq','gt','lt','move','gotoobj','gorandom','hide','show','say','wait','clone','delclone','stop','setvar','changevar'],
  resetOnFlag:true, start:{x:-190,y:-140}, stars:[],
  sprites:[BUG(-190,-140, () => [MOVE_S(), hatKey('space', iff(gtB('semillas', 0), cloneB('Semilla'), chV('semillas', -1)))]),
    SEED(-190, -140, () => SEED_CLONE()), BAG(60, 40, () => [hatFlag(fe(iff(toO('Bichito'), chV('semillas', 3), rndB())))])]};

/* Ficha de la parte: ver el comentario de rasgos en 1-movimiento.js. */
export const PARTE = {rasgos:{avisarSiAfuera:true, puntosAlDetener:true, seguirClones:true, portada:'variables'}, name:'Juntar y comparar', desc:'Mayor y menor, semillas que se gastan y un juego completo', levels:LEVELS7, free:FREE7,
   tag:'Juntá semillas, compará números y hacé florecer las nubes.',
   teach:[
     ['La clase', '<p>Núcleo en 5.º; también 6.º y 7.º. En 4.º, con ayuda. Una clase de 40 a 60 minutos. Se trabajan los operadores “mayor que” y “menor que”, una variable que se gasta y se recarga, y un juego completo con clones, mensajes, vidas y puntos.</p><p>Diseño Curricular CABA, Tecnologías, Diseño y Programación (a verificar): comparación de valores; uso de variables para controlar el comportamiento de un programa.</p>'],
     ['Antes, sin pantalla', '<ol><li>Cada chico tiene 3 porotos (semillas). Solo puede tirar uno a la caja si le queda alguno: “¿porotos > 0?”.</li><li>“¿Tenés menos de 3? Decí ¡pocas!”</li><li>Una bolsa del centro da 5 porotos más.</li></ol>'],
     ['Preguntas de cierre', '<ul><li>¿Qué contesta “¿semillas > 0?” cuando te quedan 0?</li><li>¿Por qué el bichito pregunta antes de tirar?</li><li>En la lluvia, ¿quién avisa y quién suma los puntos?</li></ul>'],
   ]};
