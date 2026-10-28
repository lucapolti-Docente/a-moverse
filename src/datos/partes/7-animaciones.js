import { R_ } from '../fondos.js';
import { BUGC, WASP } from '../personajes.js';
import { MOVE_S, PATROL, WALK_BODY, WALK_S } from '../programas.js';
import { chV, eqB, fe, hatFlag, hatKey, hideB, iff, kp, nextCos, orB, repB, sayB, setCos, setV, showB, stopB, tc, toO, waitB } from '../../motor/bloques.js';
import { progOf, scan, scanF } from '../../motor/reglas.js';

export const LEVELS7 = [
  {id:'p7-disfraces', name:'Disfraces', short:'Disfraces',
   intro:{title:'Un objeto, varios dibujos',
     text:'Cada objeto puede tener varios dibujos: se llaman disfraces. El bichito tiene cuatro: paso 1, paso 2, feliz y dolor (los ves arriba del escenario). “Siguiente disfraz” pasa al que sigue en la lista; “cambiar disfraz a” elige uno por su nombre.',
     example:() => [hatKey('space', nextCos())], note:'Cada vez que apretás espacio, pasa al siguiente: paso 1, paso 2, feliz, dolor… y vuelve a empezar.'},
   goal:'Abajo de “al presionar tecla espacio” poné “siguiente disfraz” y apretá espacio varias veces: mirá la lista de arriba. Después, abajo de “flecha arriba”, poné “cambiar disfraz a feliz”.',
   palette:['nextcos','setcos'], resetOnFlag:true, start:{x:0,y:-40}, stars:[], defaultKey:'space', spaceBtn:true, showCostumes:true,
   sprites:[BUGC(0, -40, () => [hatKey('space'), hatKey('up')])],
   check:R => (R.cosChanges || 0) >= 4 && R.happyShown,
   learn:'“Siguiente disfraz” va al que sigue en la lista, en orden. “Cambiar disfraz a” elige uno por su nombre.'},
  {id:'p7-raras', name:'¿Caras raras?', short:'Caras raras',
   intro:{title:'Animar es cambiar rápido',
     text:'Una animación es cambiar de disfraz una y otra vez, con un ratito de espera. Este programa ya está armado: mientras apretás la flecha, “siguiente disfraz” y esperar 0.15. Probalo… ¿camina bien?',
     example:() => [hatFlag(fe(iff(kp('right'), nextCos(), waitB(0.15))))]},
   goal:'Caminá para la derecha y mirá la cara del bichito (y la lista de disfraces arriba). ¿Qué disfraces aparecen mientras camina?',
   palette:[], resetOnFlag:true, start:{x:-190,y:-60}, stars:[], showCostumes:true,
   sprites:[BUGC(-190, -60, () => [MOVE_S(), Object.assign(hatFlag(fe(iff(kp('right'), nextCos(), waitB(0.15)))), {open:true})])],
   check:R => (R.oddWhileWalk || 0) >= 2 && (R.walkSwaps || 0) >= 6,
   learn:'¡Pone caras de feliz y de dolor mientras camina! “Siguiente disfraz” pasa por TODOS los disfraces. Para caminar solo queremos paso 1 y paso 2.'},
  {id:'p7-caminar', name:'Paso 1, paso 2', short:'Caminar',
   intro:{title:'Elegir los disfraces',
     text:'Para que camine sin caras raras, elegimos los disfraces por su nombre: cambiar disfraz a paso 1, esperar, cambiar disfraz a paso 2, esperar. Así solo usa los dos pasos.',
     example:() => [hatFlag(fe(iff(kp('right'), ...WALK_BODY())))], note:'Es un programa aparte: el movimiento sigue en el suyo.'},
   goal:'Adentro del “si ¿flecha derecha?”, armá: cambiar disfraz a paso 1 → esperar 0.15 → cambiar disfraz a paso 2 → esperar 0.15. Caminá un rato para la derecha.',
   palette:['setcos','wait'], defaultCos:'paso 1', resetOnFlag:true, start:{x:-190,y:-60}, stars:[], showCostumes:true, selInIf:true,
   sprites:[BUGC(-190, -60, () => [MOVE_S(), Object.assign(hatFlag(fe(iff(kp('right')))), {open:true})])],
   check:R => {
     if ((R.walkSwaps || 0) < 6) return false;
     if (R.oddWhileWalk) return 'Sigue poniendo caras raras: usá solo “paso 1” y “paso 2” en los “cambiar disfraz a”.';
     const body = (() => { let r = null; scanF(progOf('Bichito'), b => { if (b.type === 'if' && b.body.some(x => x.type === 'setcos')) r = b.body; return false; }); return r || []; })();
     const names = new Set(body.filter(x => x.type === 'setcos').map(x => x.cos));
     if (!(names.has('paso 1') && names.has('paso 2'))) return 'Casi: hacen falta los dos, “paso 1” y “paso 2”. Tocá el ▾ del segundo y elegí paso 2.';
     if (body.filter(x => x.type === 'wait' && Number(x.n) > 0 && Number(x.n) <= 0.6).length < 2) return '¡Camina! Pero las patitas van muy rápido (o muy lento). Poné “esperar 0.15” después de cada “cambiar disfraz”.';
     return true;
   },
   learn:'Para animar elegimos los disfraces por su nombre y esperamos un ratito entre uno y otro. Un programa mueve y otro anima.'},
  {id:'p7-dolor', name:'¡Ay, me dolió!', short:'Dolor',
   intro:{title:'Una cara para cada momento',
     text:'Cuando te pica la avispa, el bichito puede poner cara de dolor un ratito y después volver a la normal: “cambiar disfraz a dolor”, esperar, “cambiar disfraz a paso 1”.',
     example:() => [hatFlag(fe(iff(toO('Avispa'), setCos('dolor'), chV('vidas', -1), waitB(1), setCos('paso 1'))))]},
   goal:'En la regla de la avispa: poné “cambiar disfraz a dolor” al principio del “si”, y “cambiar disfraz a paso 1” al final, después de esperar. Dejate picar una vez para ver la cara.',
   palette:['setcos'], defaultCos:'dolor', resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selInIf:true, vars:{vidas:3}, varNames:['vidas'], showCostumes:true,
   sprites:[BUGC(-190, -140, () => [MOVE_S(), WALK_S(), hatFlag(setV('vidas', 3), fe(iff(toO('Avispa'), chV('vidas', -1), waitB(1))))]),
     WASP('Avispa', 60, -60, () => [PATROL(3)])],
   check:R => {
     if (!R.hurtShown) return false;
     if (!R.recovered) return (R.hurtLong ? 'Puso cara de dolor… ¡y se quedó así! Al final del “si”, después de esperar: “cambiar disfraz a paso 1”.' : false);
     return true;
   },
   learn:'Cada momento puede tener su disfraz: caminar, dolor, festejo. Después de un ratito, se vuelve al normal.'},
  {id:'p7-parpadeo', name:'Parpadeo', short:'Parpadeo',
   intro:{title:'Repetir',
     text:'“Repetir 5 veces” hace lo de adentro 5 veces y sigue. Con esconder y mostrar, el bichito parpadea: así muestran los juegos que te lastimaron. Pero entre esconder y mostrar tiene que haber esperas, si no, pasa tan rápido que no se ve.',
     example:() => [repB(5, hideB(), waitB(0.1), showB(), waitB(0.1))], note:'Se esconde, espera, se muestra, espera… cinco veces.'},
   goal:'Cuando te pica, el bichito tiene que parpadear. El “repetir 5 veces” ya está, pero no se ve: falta una espera. Agregá “esperar 0.1 segundos” después de “mostrar”. Dejate picar.',
   palette:['wait'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selInIf:true, vars:{vidas:3}, varNames:['vidas'], noGhost:true,
   sprites:[BUGC(-190, -140, () => [MOVE_S(), WALK_S(), hatFlag(setV('vidas', 3), fe(iff(toO('Avispa'), setCos('dolor'), chV('vidas', -1), repB(5, hideB(), waitB(0.1), showB()), setCos('paso 1'))))]),
     WASP('Avispa', 60, -60, () => [PATROL(3)])],
   check:R => {
     if ((R.bugBlinks || 0) < 5) return false;
     const ok = scanF(progOf('Bichito'), b => b.type === 'repeat' && b.body.filter(x => x.type === 'wait').length >= 2);
     if (!ok) return 'Te picó, pero el parpadeo no se ve: falta “esperar 0.1 segundos” después de “mostrar”, adentro del “repetir”.';
     return true;
   },
   learn:'“Repetir” hace algo varias veces. Con esperas entre esconder y mostrar, el parpadeo se ve.'},
  {id:'p7-festejo', name:'Festejo', short:'Festejo',
   intro:{title:'¡Llegué!',
     text:'Al llegar a la meta, el bichito puede festejar: “cambiar disfraz a feliz” antes de decir “¡Llegué!” y detener todo.',
     example:() => [hatFlag(fe(iff(tc('goal'), setCos('feliz'), sayB('¡Llegué!'), stopB())))]},
   goal:'En la regla de la meta: poné “cambiar disfraz a feliz” antes del “decir”. Llegá a la meta y mirá el festejo.',
   palette:['setcos'], resetOnFlag:true, start:{x:-190,y:-60}, stars:[], selInIf:true, showCostumes:true,
   map:[R_(160,-40,236,40,'goal')],
   sprites:[BUGC(-190, -60, () => [MOVE_S(), WALK_S(), hatFlag(fe(iff(tc('goal'), sayB('¡Llegué!'), stopB())))])],
   check:R => R.stopOnGoal && R.happyShown,
   learn:'Con disfraces, el personaje muestra lo que siente: camina, se duele y festeja.'},
  {id:'p7-todo', name:'Todo junto', short:'Todo junto',
   intro:{title:'Caminar para los dos lados',
     text:'La animación solo funciona con la flecha derecha. Con “o” podés preguntar por las dos flechas: si ¿derecha? o ¿izquierda? → paso 1, esperar, paso 2, esperar.',
     example:() => [hatFlag(fe(iff(orB(kp('right'), kp('left')), ...WALK_BODY())))]},
   goal:'Juego completo: avispa, vidas, parpadeo y festejo. Pero las patitas solo se mueven yendo a la derecha. Hacé que también caminen para la izquierda: usá “o”. ¡Y llegá a la meta!',
   palette:['or','keyp'], resetOnFlag:true, start:{x:0,y:-140}, stars:[], vars:{vidas:3}, varNames:['vidas'], noGhost:true, showCostumes:false,
   map:[R_(-236,20,-160,96,'goal')],
   sprites:[BUGC(0, -140, () => [MOVE_S(), Object.assign(hatFlag(fe(iff(kp('right'), ...WALK_BODY()))), {open:true}),
       Object.assign(hatFlag(setV('vidas', 3), fe(iff(toO('Avispa'), setCos('dolor'), chV('vidas', -1), repB(5, hideB(), waitB(0.1), showB(), waitB(0.1)), setCos('paso 1')))), {fold:'si me pica: dolor, −1 vida y parpadeo'}),
       Object.assign(hatFlag(fe(iff(tc('goal'), setCos('feliz'), sayB('¡Llegué!'), stopB()), iff(eqB('vidas', 0), sayB('Perdiste'), stopB()))), {fold:'meta: festejo; sin vidas: perdiste'})]),
     WASP('Avispa', -60, 20, () => [PATROL(4)])],
   check:R => {
     if (!R.stopOnGoal) return false;
     if (!scan(progOf('Bichito'), b => b.type === 'if' && b.cond && b.cond.type === 'or' && b.body.some(x => x.type === 'setcos'))) return 'Llegaste, pero las patitas solo se mueven para la derecha. Tocá “¿tecla flecha derecha?” y después “o”.';
     return true;
   },
   learn:'Movimiento, animación, daño y festejo: cada cosa en su programa, todas a la vez.'},
];

export const FREE7 = {id:'libre7', name:'Modo libre', short:'Libre', mode:'free', intro:{title:'Modo libre', text:'Probá disfraces, repetir y animaciones con el bichito.'},
  goal:'Animá al bichito como quieras.', palette:['flag','key','forever','repeat','if','keyp','toucho','or','nextcos','setcos','hide','show','say','wait','move','cx','cy'], resetOnFlag:true, start:{x:0,y:-60}, stars:[], showCostumes:true, noGhost:true,
  sprites:[BUGC(0, -60, () => [MOVE_S(), WALK_S()]), WASP('Avispa', 60, 60, () => [PATROL(3)])]};

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
export const PARTE = {rasgos:{avisarSiAfuera:true, animaciones:true, portada:'animaciones'}, name:'Animaciones', desc:'Disfraces, caminar, daño y festejo', levels:LEVELS7, free:FREE7,
   tag:'Que el bichito camine, se duela y festeje.',
   teach:[
     ['La clase', '<p>Para todos los grados, de 4.º a 7.º. Una clase. Disfraces, “siguiente disfraz”, “cambiar disfraz a”, animar con esperas y el bloque “repetir”.</p>'],
     ['Antes, sin pantalla', '<ol><li>Un “flip book”: dos dibujos del bichito con las patitas distintas; pasarlos rápido hace que camine.</li><li>¿Qué pasa si los pasamos muy rápido o muy lento? (esperar)</li><li>Si mezclamos en la pila el dibujo “feliz” y el de “dolor”, ¿sigue caminando bien? (siguiente disfraz pasa por todos)</li><li>Hacer “dolor” con la cara: esconder la cara con las manos 5 veces (repetir).</li></ol>'],
     ['Preguntas de cierre', '<ul><li>¿Qué es un disfraz?</li><li>¿Por qué “siguiente disfraz” no sirvió para caminar?</li><li>¿Por qué la animación necesita esperar?</li><li>¿Qué diferencia hay entre “repetir” y “por siempre”?</li></ul>'],
   ]};
