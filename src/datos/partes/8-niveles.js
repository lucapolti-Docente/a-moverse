import { BD } from '../fondos.js';
import { BUGW, STAGE, WASPH } from '../personajes.js';
import { BACK_BUG, GOAL_S, NEXT_BUG, PATROL, STAGE_START } from '../programas.js';
import { V, bdB, bounceB, chV, eqB, fe, gotoB, hatBd, hatFlag, hatMsg, hideB, iff, mv, sayB, sendB, setV, showB, stopB, tc, toO, waitB } from '../../motor/bloques.js';
import { corrida, fondo, hasEqRule, progOf, scan, scanF } from '../../motor/reglas.js';

export const P6 = {backdrops:BD, bdOrder:['pasto','arena','noche'], start:{x:-200,y:-150}, resetOnFlag:true, stars:[]};

/* En esta parte la lava manda al inicio desde el primer nivel (regla ya armada). */
const LAVA_S = () => Object.assign(hatFlag(fe(iff(tc('lava'), gotoB(-200, -150)))), {fold:'si toco la lava, vuelvo al inicio'});

export const LEVELS8 = [
  Object.assign({}, P6, {id:'p6-escenario', name:'El escenario también programa', short:'Escenario',
   intro:{title:'El escenario es un objeto',
     text:'En Scratch, el escenario también tiene su pestaña y sus programas. No se mueve ni tiene dibujo propio: tiene fondos. Con “cambiar fondo a” elige cuál se ve. En este juego, cada fondo trae su propio mapa: paredes, lava y meta.',
     example:() => [hatFlag(bdB('arena'))], note:'Al apretar la banderita, el escenario cambia al fondo arena.'},
   goal:'Tocá la pestaña del Escenario. Abajo de la banderita poné “cambiar fondo a” y elegí “arena” en el menú ▾. Apretá la banderita y mirá cómo cambia todo el mapa.',
   palette:['switchbd'], selSprite:1, startBackdrop:'pasto', defaultBd:'pasto',
   sprites:[BUGW([LAVA_S()]), STAGE(() => [hatFlag()])],
   check:R => fondo() === 'arena' && scan(progOf('Escenario'), b => b.type === 'switchbd'),
   learn:'El escenario es un objeto más: tiene programas y elige el fondo. Cada fondo puede ser un nivel distinto.'}),
  Object.assign({}, P6, {id:'p6-inicio', name:'Empezar siempre en el nivel 1', short:'Desde el 1',
   intro:{title:'El fondo se queda como estaba',
     text:'El fondo se queda donde quedó la última vez, aunque aprietes la banderita. Igual que con las variables y con “mostrar”, al empezar hay que preparar todo: cambiar fondo al primero.',
     example:() => [hatFlag(bdB('pasto'))]},
   goal:'El juego quedó en el fondo noche, de una partida anterior. Hacé que siempre empiece en el pasto: en el Escenario, “cambiar fondo a pasto” abajo de la banderita. Después llegá a la meta.',
   palette:['switchbd'], selSprite:1, startBackdrop:'noche', defaultBd:'pasto',
   sprites:[BUGW([LAVA_S(), Object.assign(GOAL_S(true), {fold:'meta: decir y detener'})]), STAGE(() => [hatFlag()])],
   check:R => R.stopOnGoal && R.goalBd === 'pasto' && scan(progOf('Escenario'), b => b.type === 'switchbd' && b.bd === 'pasto'),
   learn:'Al empezar, todo vuelve a su lugar: el fondo, las variables y los personajes.'}),
  Object.assign({}, P6, {id:'p6-pasar', name:'Pasar de nivel', short:'Pasar',
   intro:{title:'Al pasar, volver al inicio',
     text:'Cuando el bichito toca la meta, el fondo cambia y aparece el mapa nuevo. Pero el bichito sigue parado donde estaba… ¡y en el mapa nuevo ahí puede haber una pared! Por eso, al pasar de nivel, hay que mandarlo al inicio.',
     example:() => [hatFlag(fe(iff(tc('goal'), bdB('arena'), gotoB(-200, -150))))]},
   goal:'Llegá a la meta del pasto: el fondo cambia a arena… y el bichito queda adentro de una pared. Arreglalo: después de “cambiar fondo a arena”, poné “ir a x: −200 y: −150”. Después llegá a la meta de la arena.',
   palette:['goto'], selInIf:true, startBackdrop:'pasto',
   sprites:[BUGW([LAVA_S(), hatFlag(fe(iff(tc('goal'), bdB('arena'))))]), STAGE(() => [STAGE_START()])],
   check:R => R.arenaGoal && scan(progOf('Bichito'), b => b.type === 'goto'),
   learn:'Pasar de nivel es cambiar el fondo y acomodar a los personajes: el bichito vuelve al inicio.'}),
  Object.assign({}, P6, {id:'p6-aviso', name:'Un aviso para todos', short:'Aviso',
   intro:{title:'Un mensaje para pasar de nivel',
     text:'Como en “Aparecer y avisar”: uno envía un mensaje y los demás lo reciben. Mejor que el bichito no cambie el fondo él mismo. Que avise “siguiente nivel” y cada objeto haga lo suyo: el escenario pasa al siguiente fondo y el bichito vuelve al inicio. “Siguiente fondo” va al que sigue en la lista: pasto → arena → noche, y después de la noche vuelve al pasto.',
     example:() => [hatMsg('siguiente nivel', bdB('siguiente fondo'))], note:'Va en el escenario.'},
   goal:'El bichito ya avisa “siguiente nivel” al tocar la meta, y vuelve al inicio. Falta el escenario: “al recibir siguiente nivel” → “cambiar fondo a siguiente fondo”. Pasá los 3 fondos.',
   palette:['whenmsg','switchbd'], selSprite:1, startBackdrop:'pasto', msgs:['siguiente nivel'], defaultBd:'siguiente fondo',
   sprites:[BUGW([LAVA_S(), NEXT_BUG(), BACK_BUG()]), STAGE(() => [STAGE_START()])],
   check:R => !!R.finishedNoche,
   learn:'Con un mensaje, cada objeto se ocupa de lo suyo: el bichito avisa, el escenario cambia el fondo y el bichito vuelve al inicio.'}),
  Object.assign({}, P6, {id:'p6-enviar', name:'Avisar vos', short:'Avisar vos',
   intro:{title:'El bichito avisa',
     text:'Ahora el aviso lo armás vos. Cuando el bichito toca la meta, envía “siguiente nivel”. Después espera un ratito: así no avisa muchas veces seguidas mientras todavía está arriba de la meta.',
     example:() => [hatFlag(fe(iff(tc('goal'), sendB('siguiente nivel'), waitB(0.5))))], note:'El escenario y el bichito ya saben qué hacer cuando reciben el mensaje.'},
   goal:'En el programa vacío del bichito: si ¿tocando el color verde? → enviar siguiente nivel → esperar 0.5. Pasá los 3 fondos.',
   palette:['if','touchc','broadcast','wait'], colors:['goal'], startBackdrop:'pasto', msgs:['siguiente nivel'],
   avisoMeta:'Llegó a la meta y no pasó nada. Falta: si ¿tocando el color verde? → enviar siguiente nivel.',
   sprites:[BUGW([LAVA_S(), BACK_BUG(), hatFlag(fe())]), STAGE(() => [STAGE_START(), Object.assign(hatMsg('siguiente nivel', bdB('siguiente fondo')), {fold:'al recibir siguiente nivel: siguiente fondo'})])],
   check:R => !!R.finishedNoche,
   learn:'El bichito avisa y cada uno hace lo suyo. Así se pasa de nivel en Scratch.'}),
  Object.assign({}, P6, {id:'p6-nivel', name:'¿En qué nivel estoy?', short:'Variable nivel',
   intro:{title:'Una variable para el nivel',
     text:'Una variable “nivel” cuenta en qué nivel estás: empieza en 1 y cada vez que pasás, suma 1. Como son 3 fondos, cuando nivel llega a 4 quiere decir que pasaste los tres.',
     example:() => [hatMsg('siguiente nivel', bdB('siguiente fondo'), chV('nivel', 1)), hatFlag(fe(iff(eqB('nivel', 4), sayB('¡Ganaste!'), stopB())))]},
   goal:'En el Escenario: abajo de “al recibir siguiente nivel”, agregá “sumar a nivel 1”. En el programa vacío del bichito: si nivel = 4 → decir “¡Ganaste!” → detener todos.',
   palette:['changevar','if','eq','say','stop'], selSprite:1, startBackdrop:'pasto', msgs:['siguiente nivel'], vars:{nivel:1}, varNames:['nivel'], showEq:true,
   sprites:[BUGW([LAVA_S(), NEXT_BUG(), BACK_BUG(), hatFlag(fe())]), STAGE(() => [STAGE_START([setV('nivel', 1)]), hatMsg('siguiente nivel', bdB('siguiente fondo'))])],
   check:R => {
     if (R.stopNivel == null) return false;
     if (R.stopNivel < 4) return 'Paraste en el nivel ' + R.stopNivel + ': todavía no pasaste los tres fondos. Cuando terminás la noche, ¿cuánto vale la variable nivel?';
     return hasEqRule('nivel', 4);
   },
   learn:'La variable “nivel” cuenta los niveles. Con “si nivel = 4” el juego sabe que terminaste.'}),
  Object.assign({}, P6, {id:'p6-cadauno', name:'Cada nivel con lo suyo', short:'Por fondo',
   intro:{title:'Cuando el fondo cambie',
     text:'“Cuando el fondo cambie a arena” es un evento: arranca cuando el escenario cambia a ese fondo. Así cada personaje sabe qué hacer en cada nivel: la avispa aparece en la arena y se esconde en los otros.',
     example:() => [hatBd('arena', showB()), hatBd('noche', hideB())]},
   goal:'La avispa tiene que aparecer solo en la arena. En la avispa: “cuando el fondo cambie a arena → mostrar” y “cuando el fondo cambie a noche → esconder”. Pasá los 3 fondos.',
   palette:['whenbd','show','hide'], selSprite:1, startBackdrop:'pasto', msgs:['siguiente nivel'],
   sprites:[BUGW([LAVA_S(), NEXT_BUG(), BACK_BUG(), Object.assign(hatFlag(fe(iff(toO('Avispa'), gotoB(-200, -150)))), {fold:'si me pica la avispa, vuelvo al inicio'})]),
     WASPH('Avispa', -40, 140, () => [PATROL(4), Object.assign(hatFlag(hideB()), {fold:'al empezar: esconderme'})], true),
     STAGE(() => [STAGE_START(), Object.assign(hatMsg('siguiente nivel', bdB('siguiente fondo')), {fold:'al recibir siguiente nivel: siguiente fondo'})])],
   check:R => {
     if (!R.finishedNoche) return false;
     if (!R.waspInArena) return 'Pasaste todo, pero la avispa no apareció en la arena. “Cuando el fondo cambie a arena → mostrar”.';
     if (R.waspInNoche) return 'Pasaste todo, pero la avispa siguió en la noche. “Cuando el fondo cambie a noche → esconder”.';
     return true;
   },
   learn:'“Cuando el fondo cambie a” arranca cuando aparece ese nivel. Así cada personaje sabe qué hacer en cada uno.'}),
  Object.assign({}, P6, {id:'p6-dificil', name:'Cada vez más difícil', short:'Más difícil', varInNum:true,
   intro:{title:'Una variable adentro de un número',
     text:'En el hueco de un número también podés poner una variable. “Mover (velocidad) pasos” mueve lo que valga “velocidad” en ese momento. Si la velocidad sube en cada nivel, la avispa va cada vez más rápido.',
     example:() => [hatFlag(fe(mv(V('velocidad')), bounceB()))], note:'En Scratch se arrastra la bolita naranja de la variable adentro del hueco blanco.'},
   goal:'La velocidad sube en cada nivel (mirá el cartel), pero la avispa vuela siempre igual. En la avispa, tocá “＋ variable” en “mover 3 pasos” y elegí “velocidad”. Pasá los 3 fondos.',
   palette:[], selSprite:1, startBackdrop:'pasto', msgs:['siguiente nivel'], vars:{velocidad:2}, varNames:['velocidad'],
   sprites:[BUGW([LAVA_S(), NEXT_BUG(), BACK_BUG(), Object.assign(hatFlag(fe(iff(toO('Avispa'), gotoB(-200, -150)))), {fold:'si me pica la avispa, vuelvo al inicio'})]),
     WASPH('Avispa', -40, 140, () => [hatFlag(showB(), fe(mv(3), bounceB()))]),
     STAGE(() => [STAGE_START([setV('velocidad', 2)]), Object.assign(hatMsg('siguiente nivel', bdB('siguiente fondo'), chV('velocidad', 3)), {fold:'al recibir siguiente nivel: siguiente fondo y +3 de velocidad'})])],
   check:R => {
     if (!R.finishedNoche) return false;
     if (!scan(progOf('Avispa'), b => b.type === 'move' && b.n && typeof b.n === 'object')) return 'Pasaste todo, pero la avispa voló siempre igual. Poné la variable “velocidad” en “mover pasos”.';
     return true;
   },
   learn:'Una variable adentro de un número cambia cómo se mueve: con “mover (velocidad) pasos”, cada nivel es más difícil.'}),
  Object.assign({}, P6, {id:'p6-juego', name:'Mi juego de 3 niveles', short:'3 niveles',
   intro:{title:'Todo junto',
     text:'Un juego completo: 3 fondos, avispa cada vez más rápida, vidas y ganar al terminar el nivel 3. Falta lo de la lava: que te saque una vida y te mande al inicio.',
     example:() => [hatFlag(fe(iff(tc('lava'), chV('vidas', -1), gotoB(-200, -150))))]},
   goal:'Falta la lava. En el programa vacío del bichito: si ¿tocando el color rojo? → sumar a vidas −1 → ir a x: −200 y: −150. ¡Y ganá los 3 niveles!',
   palette:['if','touchc','changevar','goto'], colors:['lava'], startBackdrop:'pasto', msgs:['siguiente nivel'], vars:{nivel:1, vidas:3, velocidad:2}, varNames:['vidas','nivel','velocidad'],
   sprites:[BUGW([NEXT_BUG(), BACK_BUG(),
       Object.assign(hatFlag(setV('vidas', 3), fe(iff(toO('Avispa'), chV('vidas', -1), gotoB(-200, -150), waitB(1)))), {fold:'si me pica la avispa: −1 vida y al inicio'}),
       Object.assign(hatFlag(fe(iff(eqB('vidas', 0), sayB('¡Se terminó!'), stopB()), iff(eqB('nivel', 4), sayB('¡Ganaste!'), stopB()))), {fold:'reglas: perder con 0 vidas, ganar con nivel 4'}),
       hatFlag(fe())]),
     WASPH('Avispa', -40, 140, () => [Object.assign(hatFlag(showB(), fe(mv(V('velocidad')), bounceB())), {fold:'vuelo con la velocidad del nivel'})]),
     STAGE(() => [STAGE_START([setV('nivel', 1), setV('velocidad', 2)]), Object.assign(hatMsg('siguiente nivel', bdB('siguiente fondo'), chV('nivel', 1), chV('velocidad', 3)), {fold:'al recibir siguiente nivel: siguiente fondo, +1 nivel, +3 velocidad'})])],
   check:R => {
     if (R.stopNivel == null) return false;
     if (!scanF(progOf('Bichito'), b => b.type === 'if' && b.cond && b.cond.type === 'touchc' && b.cond.color === 'lava' && b.body.some(x => x.type === 'changevar' && Number(x.n) < 0) && b.body.some(x => x.type === 'goto'))) return 'Falta la regla de la lava: si toca el rojo → sumar a vidas −1 → ir al inicio.';
     if (R.stopNivel >= 4) return true;
     return 'Te quedaste sin vidas en el nivel ' + R.stopNivel + '. ¡Apretá la banderita y probá otra vez!';
   },
   learn:'¡Hiciste un juego de 3 niveles! Fondos, mensajes, variables y enemigos que se ponen más difíciles.'}),
  Object.assign({}, P6, {id:'p6-cierre', name:'Juego libre: 3 niveles', short:'Juego libre', mode:'arcade',
   intro:{title:'Jugalo y cambialo',
     text:'El juego completo, ya programado. Jugalo todas las veces que quieras. Abrí los programas y cambiá números: las vidas, la velocidad de la avispa, cuánto sube en cada nivel.'},
   goal:'¡Tu juego de 3 niveles! Pasá el pasto, la arena y la noche sin quedarte sin vidas. Después abrí los programas y hacelo más fácil o más difícil.',
   palette:[], startBackdrop:'pasto', msgs:['siguiente nivel'], vars:{nivel:1, vidas:3, velocidad:2}, varNames:['vidas','nivel','velocidad'],
   sprites:[BUGW([NEXT_BUG(), BACK_BUG(),
       Object.assign(hatFlag(setV('vidas', 3), fe(iff(toO('Avispa'), chV('vidas', -1), gotoB(-200, -150), waitB(1)))), {fold:'si me pica la avispa: −1 vida y al inicio'}),
       Object.assign(hatFlag(fe(iff(tc('lava'), chV('vidas', -1), gotoB(-200, -150), waitB(0.5)))), {fold:'si toco la lava: −1 vida y al inicio'}),
       Object.assign(hatFlag(fe(iff(eqB('vidas', 0), sayB('¡Se terminó!'), stopB()), iff(eqB('nivel', 4), sayB('¡Ganaste!'), stopB()))), {fold:'reglas: perder con 0 vidas, ganar con nivel 4'})]),
     WASPH('Avispa', -40, 140, () => [Object.assign(hatFlag(showB(), fe(mv(V('velocidad')), bounceB())), {fold:'vuelo con la velocidad del nivel'})]),
     STAGE(() => [STAGE_START([setV('nivel', 1), setV('velocidad', 2)]), Object.assign(hatMsg('siguiente nivel', bdB('siguiente fondo'), chV('nivel', 1), chV('velocidad', 3)), {fold:'al recibir siguiente nivel: siguiente fondo, +1 nivel, +3 velocidad'})])],
   check:R => R.stopNivel != null,
   learn:() => (corrida().stopNivel >= 4) ? '¡Ganaste los 3 niveles! Apretá la banderita para jugar otra vez, o cambiá números en los programas para hacerlo más difícil.' : 'Llegaste al nivel ' + corrida().stopNivel + '. ¡Apretá la banderita y probá otra vez!'}),
];

export const FREE8 = Object.assign({}, P6, {id:'libre6', name:'Modo libre', short:'Libre', mode:'free', intro:{title:'Modo libre', text:'Armá tu propio juego con niveles: fondos, mensajes, variables, enemigos.'},
  goal:'Armá tu juego con niveles. La variable adentro de un número sirve en “mover pasos”.', vars:{nivel:1}, varNames:['nivel'], allowCreateVar:true, varInNum:true, msgs:['siguiente nivel','atrapada'], startBackdrop:'pasto', colors:['wall','lava','goal'],
  palette:['flag','key','whenmsg','whenbd','broadcast','switchbd','forever','if','touchc','toucho','keyp','and','or','eq','gt','lt','move','bounce','pointdir','pointto','goto','gorandom','hide','show','say','wait','stop','setvar','changevar'],
  sprites:[BUGW([NEXT_BUG(), BACK_BUG()]), WASPH('Avispa', -40, 140, () => [PATROL(3)]), STAGE(() => [STAGE_START([setV('nivel', 1)]), hatMsg('siguiente nivel', bdB('siguiente fondo'), chV('nivel', 1))])]});

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
export const PARTE = {rasgos:{avisarSiAfuera:true, finPorNivel:true, mapaCallado:true, portada:'niveles'}, name:'Niveles', desc:'Fondos, escenario y niveles', levels:LEVELS8, free:FREE8,
   tag:'El escenario cambia de fondo y cada fondo es un nivel.',
   teach:[
     ['La clase', '<p>Núcleo en 5.º; también 6.º y 7.º. En 4.º, con ayuda. Una clase de 40 a 60 minutos. El escenario como objeto, fondos, mensajes para coordinar, la variable “nivel” y una variable adentro de un bloque.</p>'],
     ['Antes, sin pantalla', '<ol><li>Tres hojas en el piso: pasto, arena y noche. Cuando alguien llega a la meta, grita “¡siguiente nivel!”.</li><li>El que hace de escenario cambia la hoja; el que juega vuelve a la largada.</li><li>En la arena aparece un compañero que hace de avispa; en la noche se va.</li></ol>'],
     ['Preguntas de cierre', '<ul><li>¿Por qué el bichito vuelve al inicio al pasar de nivel?</li><li>¿Quién cambia el fondo y por qué?</li><li>¿Qué pasa si ponés una variable adentro de “mover pasos”?</li></ul>'],
   ]};
