import { R_ } from '../fondos.js';
import { BUG, WASP } from '../personajes.js';
import { GOAL_S, LOSE_S, MOVE4W, MOVE_S, PATROL } from '../programas.js';
import { bounceB, cx, fe, gotoB, hatFlag, iff, mv, orB, pdirB, ptoB, sayB, stopB, toO, waitB } from '../../motor/bloques.js';
import { chaseSpeed, enemyRule, enemyRuleOnce, progOf, scan, starsDone } from '../../motor/reglas.js';

export const LEVELS3 = [
  {id:'p3-1', name:'Otro personaje', intro:{title:'Cada personaje tiene sus programas',
     text:'Ahora hay dos personajes: el bichito y una avispa. Arriba del programa hay una pestaña para cada uno. Tocás la pestaña y armás los programas de ese personaje. En Scratch es igual: cada objeto tiene los suyos.',
     example:() => [hatFlag(fe(cx(5)))], note:'Este programa, puesto en la avispa, la hace volar sola hacia la derecha.'},
   goal:'Tocá la pestaña “Avispa” y armale un programa para que vuele sola: al hacer clic en bandera → por siempre → sumar a x 5.',
   palette:['flag','forever','cx'], resetOnFlag:true, start:{x:-180,y:-120}, stars:[],
   sprites:[BUG(-180,-120, () => [MOVE_S()]), WASP('Avispa', -180, 80, () => [])],
   check:R => R.waspEdge,
   learn:'Cada personaje tiene sus propios programas y corren todos a la vez con la misma banderita.',
   extra:'Pero llegó al borde y se quedó pegada. ¿Cómo hacemos que vuelva?'},
  {id:'p3-2', name:'Ir y volver', intro:{title:'Rebotar',
     text:'“Rebotar si toca un borde” da vuelta al personaje cuando llega al borde: si miraba a la derecha, ahora mira a la izquierda. Pero ojo: cambia hacia dónde mira, no los números de x.',
     example:() => [hatFlag(fe(mv(5), bounceB()))], note:'“Mover pasos” va hacia donde mira. Por eso, cuando rebota, vuelve.'},
   goal:'Hacé que la avispa vaya y vuelva. Probá “rebotar si toca un borde”. ¿Funciona con “sumar a x”?',
   palette:['move','cx','bounce'], resetOnFlag:true, start:{x:-180,y:-120}, stars:[], selSprite:1,
   sprites:[BUG(-180,-120, () => [MOVE_S()]), WASP('Avispa', -180, 80, () => [hatFlag(fe(cx(5)))])],
   check:R => R.waspBack,
   learn:'“Rebotar” da vuelta hacia dónde mira el personaje. “Sumar a x” no mira para ningún lado, pero “mover pasos” sí. Por eso para ir y volver se usa “mover pasos”.'},
  {id:'p3-3', name:'¡Me tocó!', intro:{title:'¿Tocando un personaje?',
     text:'Además de preguntar por un color, podés preguntar si tocás a otro personaje: “¿tocando Avispa?”. Es la misma idea que con la lava.',
     example:() => [hatFlag(fe(iff(toO('Avispa'), gotoB(-190,-140))))], note:'Este programa va en el bichito: si lo toca la avispa, vuelve al inicio.'},
   goal:'La avispa va y viene. Tocá la pestaña “Bichito” y armale un programa: si ¿tocando Avispa? → ir a x: y: del inicio. Juntá las estrellas sin que te pique.',
   palette:['flag','forever','if','toucho','goto'], resetOnFlag:true, start:{x:-190,y:-140}, enemyMatters:true,
   stars:[{x:-100,y:10},{x:30,y:10},{x:160,y:10}],
   sprites:[BUG(-190,-140, () => [MOVE_S()]), WASP('Avispa', -150, 10, () => [PATROL(5)])],
   check:R => {
     if (!starsDone()) return false;
     if (!enemyRule('Avispa', b => b.type === 'goto' || b.type === 'stop')) return enemyRuleOnce('Avispa')
       ? 'Juntaste todo, pero tu “si ¿tocando Avispa?” no está adentro de un “por siempre”: pregunta una sola vez, al principio, y después nunca más. Ponelo adentro de un “por siempre”.'
       : 'Juntaste todo, pero si te pica la avispa no pasa nada. En el bichito: si ¿tocando Avispa? → ir al inicio.';
     if (R.enemyIgnored) return 'En algún momento te picó y no pasó nada. Arreglalo y apretá la banderita.';
     return true;
   },
   learn:'“¿Tocando Avispa?” pregunta por un personaje, no por un color. El bichito tiene sus programas y la avispa los suyos.'},
  {id:'p3-dir', name:'¿Para dónde miro?', short:'Direcciones',
   intro:{title:'Las direcciones, en grados',
     text:'La dirección es un número, como en una brújula. 0 es arriba, 90 es derecha, 180 es abajo y −90 es izquierda. Los del medio son diagonales: 45 es arriba a la derecha, 135 abajo a la derecha, −135 abajo a la izquierda y −45 arriba a la izquierda. (360 es una vuelta entera: igual que 0.)',
     example:() => [hatFlag(pdirB(180), mv(130), waitB(1), gotoB(0, 0))], note:'Apunta para abajo (180), avanza 130 pasos, espera un segundo y vuelve al medio para la próxima prueba.'},
   goal:'La avispa sale siempre del medio: apunta, avanza 130 pasos, espera un segundo y vuelve al medio. Tocá la dirección, elegí una flecha y apretá la banderita. Juntá las 4 estrellas.',
   palette:['pointdir'], tween:true, resetOnFlag:true, keepStars:true, start:{x:-190,y:-140}, compass:true, compassAt:{x:-175, y:-115}, waspStars:true,
   stars:[{x:0,y:130},{x:130,y:0},{x:0,y:-130},{x:-130,y:0},{x:92,y:92,opt:true}],
   sprites:[WASP('Avispa', 0, 0, () => [hatFlag(pdirB(90), mv(130), waitB(1), gotoB(0, 0))])],
   check:R => starsDone(),
   learn:'0 arriba, 90 derecha, 180 abajo, −90 izquierda. 360 es una vuelta entera: lo mismo que 0.',
   extra:'¿Probaste 45? Es la diagonal: hay una estrella escondida ahí.'},
  {id:'p3-4', name:'Arriba y abajo', intro:{title:'Cada avispa con su dirección',
     text:'Las dos avispas tienen el mismo programa: apuntar, y por siempre mover y rebotar. Lo único que cambia es el número de la dirección. Con 90 o −90 va y viene de costado. Con 0 o 180, de arriba a abajo.',
     example:() => [hatFlag(pdirB(0), fe(mv(5), bounceB()))], note:'Mira para arriba, avanza y rebota en el borde de arriba y en el de abajo.'},
   goal:'La Avispa tiene que ir de izquierda a derecha. La Avispa 2, de arriba a abajo. Cambiá sus direcciones para que lo logren.',
   palette:['pointdir'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1, compass:true,
   sprites:[BUG(-190,-140, () => [MOVE_S()]), WASP('Avispa', -100, -40, () => [hatFlag(pdirB(45), fe(mv(5), bounceB()))]), WASP('Avispa 2', 60, 0, () => [hatFlag(pdirB(45), fe(mv(5), bounceB()))], 90, '#C2410C')],
   check:R => {
     const h = (R.hBounce || 0) >= 2, v = (R.vBounce || 0) >= 2;
     if (h && !v) return '¡La Avispa ya va de costado! Ahora la Avispa 2: tocá su pestaña y hacé que vaya de arriba a abajo.';
     if (v && !h) return '¡La Avispa 2 ya va de arriba a abajo! Ahora la Avispa: tocá su pestaña y hacé que vaya de costado.';
     return h && v;
   },
   learn:'El mismo programa hace cosas distintas con otra dirección: 90 o −90 de costado, 0 o 180 de arriba a abajo.'},
  {id:'p3-5', name:'Te persigue', intro:{title:'Apuntar hacia otro personaje',
     text:'“Apuntar hacia Bichito” hace que la avispa mire justo hacia el bichito, esté donde esté. Si después mueve pasos, va hacia él. Adentro de un “por siempre”, te persigue.',
     example:() => [hatFlag(fe(ptoB('Bichito'), mv(3)))], note:'El número de pasos es la velocidad. Probá cuál es justo: ni imposible ni aburrido.'},
   goal:'Hacé que la avispa te persiga: “apuntar hacia Bichito” y “mover pasos”. Probá distintos números. Juntá las estrellas sin que te alcance.',
   palette:['pointto','move'], resetOnFlag:true, start:{x:-190,y:-140}, selSprite:1, enemyMatters:true,
   stars:[{x:-170,y:120},{x:10,y:-110},{x:170,y:-10}],
   sprites:[BUG(-190,-140, () => [MOVE_S(), LOSE_S()]), WASP('Avispa', 190, 140, () => [hatFlag(fe())])],
   loseMsg:() => { const n = chaseSpeed(); return n > 6 ? '¡Te atrapó! Con ' + n + ' pasos la avispa es muy rápida. Probá que se mueva menos: cambiá el número de “mover pasos” por uno más chico, como 3.' : '¡Te atrapó la avispa! Apretá la banderita y probá otra vez.'; },
   check:R => {
     if (!starsDone()) return false;
     const n = chaseSpeed(), chases = scan(progOf('Avispa'), b => b.type === 'pointto');
     if (!chases || n == null) return 'Juntaste todo, pero la avispa no te persigue. Ponele “apuntar hacia Bichito” y “mover pasos”.';
     if (n < 2) return 'Juntaste todo, pero con ' + n + ' pasos la avispa casi no se mueve. ¡Así no da miedo! Probá un número más grande.';
     if (n > 7) return 'Uy, con ' + n + ' es demasiado rápida para un juego justo. Probá entre 2 y 6.';
     return true;
   },
   learn:'“Apuntar hacia” mira al otro personaje y “mover pasos” va para donde mira. El número de pasos es la velocidad: así se ajusta qué tan difícil es un juego.'},
  {id:'p3-6', name:'Ventaja', intro:{title:'Esperar',
     text:'“Esperar 2 segundos” frena ese programa un ratito antes de seguir con el bloque de abajo. Los otros programas siguen andando.',
     example:() => [hatFlag(waitB(2), fe(ptoB('Bichito'), mv(4)))], note:'La avispa espera 2 segundos y recién ahí empieza a perseguir.'},
   goal:'Estás en un pasillo con la avispa enfrente, y la salida está justo antes de llegar a ella. Si sale enseguida, te agarra. Dale ventaja: que espere antes de perseguirte. Juntá las estrellas de arriba.',
   palette:['wait'], resetOnFlag:true, start:{x:-190,y:-140}, selSprite:1, selStart:true, enemyMatters:true,
   stars:[{x:-160,y:110},{x:0,y:130},{x:170,y:110}],
   map:[R_(-240,-90,-30,-60,'wall'), R_(70,-90,240,-60,'wall')],
   sprites:[BUG(-190,-140, () => [Object.assign(hatFlag(MOVE4W()), {fold:'moverse con las flechas (frena en las paredes)'}), LOSE_S()]),
     WASP('Avispa', 80, -140, () => [hatFlag(fe(ptoB('Bichito'), mv(4)))])],
   loseMsg:() => scan(progOf('Avispa'), b => b.type === 'wait' && Number(b.n) >= 1) ? '¡Te atrapó! Apretá la banderita y probá otra vez.' : '¡Te atrapó enseguida! Dale ventaja: poné “esperar” arriba del “por siempre” de la avispa.',
   check:R => {
     if (!starsDone()) return false;
     if (!scan(progOf('Avispa'), b => b.type === 'wait' && Number(b.n) >= 1)) return 'Falta que la avispa espere antes de salir.';
     return true;
   },
   learn:'“Esperar” frena un programa un ratito. Puesto antes del “por siempre”, le da ventaja al jugador.'},
  {id:'p3-7', name:'Todo junto', intro:{title:'Dos avispas, una pregunta',
     text:'Para preguntar por las dos avispas a la vez, usá “o”: si ¿tocando Avispa? o ¿tocando Avispa 2?, perdés. Así no repetís el programa dos veces.',
     example:() => [hatFlag(fe(iff(orB(toO('Avispa'), toO('Avispa 2')), sayB('¡Ay!'), stopB())))]},
   goal:'Una avispa patrulla y la otra te persigue. Armale al bichito un programa: si lo toca cualquiera de las dos, dice “¡Ay!” y se detiene todo. Llegá a la meta.',
   palette:['flag','forever','if','toucho','or','say','stop'], resetOnFlag:true, start:{x:-200,y:-150}, stars:[], enemyMatters:true,
   map:[R_(166,106,236,176,'goal')],
   sprites:[BUG(-200,-150, () => [MOVE_S(), Object.assign(GOAL_S(true), {fold:'meta: decir y detener'})]),
     WASP('Avispa', -60, 20, () => [PATROL(5)]),
     WASP('Avispa 2', 200, -150, () => [hatFlag(waitB(2), fe(ptoB('Bichito'), mv(3)))], 90, '#C2410C')],
   check:R => {
     if (!R.stopOnGoal) return false;
     const any = b => b.type === 'stop' || b.type === 'goto';
     if (!enemyRule('Avispa', any) || !enemyRule('Avispa 2', any)) return 'Llegaste, pero falta que el bichito pierda si lo toca alguna de las dos avispas.';
     if (R.enemyIgnored) return 'En el camino te picaron y no pasó nada. Arreglalo y apretá la banderita.';
     return true;
   },
   learn:'Un juego con enemigos: unos patrullan solos, otros te persiguen, y el jugador pregunta todo el tiempo si lo tocaron.'},
  {id:'p3-8', name:'Cierre: enemigos', short:'Cierre', mode:'cierre', goal:'Mirá los programas de cada personaje y respondé.',
   palette:[], stars:[], start:{x:-190,y:-140}, resetOnFlag:true,
   sprites:[BUG(-190,-140, () => [MOVE_S(), LOSE_S(['Avispa','Avispa 2'])]), WASP('Avispa', -150, 20, () => [PATROL(5)]),
     WASP('Avispa 2', 190, 140, () => [hatFlag(waitB(2), fe(ptoB('Bichito'), mv(3)))], 90, '#C2410C')],
   quiz:[
     {q:'¿Por qué “rebotar” no funcionaba con “sumar a x”?', opts:[
       ['Porque rebotar está roto.', false],
       ['Porque rebotar da vuelta hacia dónde mira, y “sumar a x” no mira: siempre suma para el mismo lado.', true, 'Exacto. “Mover pasos” sí va hacia donde mira, por eso con él la avispa vuelve.'],
       ['Porque faltaba la banderita.', false]]},
     {q:'¿Qué diferencia hay entre “¿tocando el color?” y “¿tocando Avispa?”', opts:[
       ['Uno pregunta por un color del escenario y el otro por un personaje.', true, '¡Sí! Los dos son Sensores, celestes, y se usan igual: adentro de un “si”.'],
       ['Ninguna.', false],
       ['“¿Tocando Avispa?” solo funciona en la avispa.', false]]},
     {q:'¿Para qué sirve “esperar 2 segundos” antes del “por siempre” de la avispa?', opts:[
       ['Para que vuele más rápido.', false],
       ['Para que nunca se mueva.', false],
       ['Para darle ventaja al jugador antes de que empiece a perseguir.', true, 'Exacto. Ese programa espera, y los demás siguen andando.']]},
   ],
   learn:'Cada personaje tiene sus programas. Los enemigos se mueven solos con “mover pasos”, “rebotar” y “apuntar hacia”, y el jugador pregunta si lo tocaron.',
   extra:'Lo que viene: vidas y puntos, con variables.'},
];

export const FREE3 = {id:'libre3', name:'Modo libre', short:'Libre', mode:'free', intro:{title:'Modo libre', text:'Cada personaje tiene su pestaña. Probá armar tus propios enemigos: que patrullen, que persigan, que esperen.'},
  goal:'Armá tus enemigos y juntá estrellas sin que te alcancen.',
  palette:['flag','forever','if','keyp','toucho','or','cx','cy','move','bounce','pointdir','pointto','goto','say','wait','stop'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[],
  sprites:[BUG(-190,-140, () => [MOVE_S(), LOSE_S(['Avispa','Avispa 2'])]), WASP('Avispa', -150, 60, () => [PATROL(4)]), WASP('Avispa 2', 190, 140, () => [hatFlag(fe())], 90, '#C2410C')]};

/* Ficha de la parte. El número lo pone la lista (partes/index.js) según el orden.
   rasgos: cómo se comporta el juego en esta parte (ver motor/partida.js):
     alCargar             mensaje al entrar a un nivel (clave de AL_CARGAR en textos.js)
     avisarSiAfuera       avisa si un “si” quedó afuera del “por siempre”
     avisarPorSiempreVacio, avisarDetuvoAntes, avisoAtrapo   otros avisos al chico
     finPorVariables      al detenerse mira vidas = 0 o puntos ≥ 10
     puntosAlDetener      al detenerse guarda los puntos (para el chequeo)
     seguirClones         cuenta clones y semillas en vuelo
     finPorNivel          al detenerse guarda la variable “nivel”; mapaCallado: no avisa paredes ni lava
     animaciones          sigue la cara de dolor del bichito
     portada              qué animación se ve en la portada de la parte */
export const PARTE = {rasgos:{alCargar:'pestanas', avisarSiAfuera:true, avisarDetuvoAntes:true, avisoAtrapo:true, portada:'enemigos'}, name:'Enemigos', desc:'Personajes que se mueven solos y te persiguen', levels:LEVELS3, free:FREE3,
   tag:'Aparece otro personaje, con sus propios programas.',
   teach:[
     ['La clase', '<p>Núcleo en 5.º, 6.º y 7.º. Una clase de 40 a 60 minutos. Cada personaje tiene sus programas, como los objetos de Scratch. Se trabajan dirección, rebote, persecución y espera.</p><p>Diseño Curricular: “Problemas de programación … que impliquen la interpretación de representaciones de objetos o situaciones desde diferentes puntos de vista”.</p>'],
     ['Antes, sin pantalla', '<ol><li>Un chico es la avispa: camina hasta la pared, se da vuelta y vuelve (rebotar).</li><li>Otro es el perseguidor: “siempre mirá al bichito y da un paso” (apuntar hacia + mover).</li><li>“Contá hasta 3 antes de salir” (esperar).</li></ol>'],
     ['Preguntas de cierre', '<ul><li>¿Por qué rebotar necesita “mover pasos”?</li><li>¿Qué cambia si el perseguidor da 1 paso o 10?</li><li>¿Qué programas tiene cada personaje?</li></ul>'],
   ]};
