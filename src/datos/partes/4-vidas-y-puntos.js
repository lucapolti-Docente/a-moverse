import { BUG, COIN, HEART, WASP } from '../personajes.js';
import { COIN_S, HEART_S, LIFE_S, MOVE_S, OVER_S, PATROL, WIN_S } from '../programas.js';
import { chV, eqB, fe, gotoB, hatFlag, iff, mv, ptoB, rndB, sayB, setV, stopB, toO, waitB } from '../../motor/bloques.js';
import { condTargets, corrida, creadas, hasEqRule, hasEqSay, hasVarChange, progOf, ruleIn, scan, scanF, vars } from '../../motor/reglas.js';
import { walk } from '../../motor/recorrer.js';

export const LEVELS4 = [
  {id:'p4-obj', name:'La moneda también es un objeto', short:'Objetos',
   intro:{title:'Objetos que no se mueven solos',
     text:'En Scratch, todo lo que está en el escenario es un “objeto”: el bichito, la avispa… y también una moneda o un corazón. No hace falta que caminen: igual tienen sus propios programas. “Ir a posición aleatoria” (Movimiento) lo manda a un lugar cualquiera, al azar.',
     example:() => [hatFlag(fe(iff(toO('Bichito'), rndB())))], note:'Este programa va en la moneda: si la toca el Bichito, salta a otro lugar.'},
   goal:'Tocá la pestaña de la moneda y programala: si ¿tocando Bichito? → ir a posición aleatoria. Agarrala 3 veces.',
   palette:['if','toucho','gorandom'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1,
   sprites:[BUG(-190,-140, () => [MOVE_S()]), COIN(60, 40, () => [hatFlag(fe())])],
   check:R => (R.coinJumps || 0) >= 3,
   learn:'Una moneda también es un objeto con sus propios programas. Pregunta si la toca el bichito y, si sí, salta a otro lugar.',
   extra:'Pero ¿quién cuenta cuántas agarraste? Para eso hace falta una cajita que guarde un número.'},
  {id:'p4-pts', name:'La cajita de puntos', short:'Puntos',
   intro:{title:'¿Qué es una variable?',
     text:'Una variable es una cajita con nombre que guarda un número. “puntos” empieza en 0. “Sumar a puntos 1” le agrega 1 a lo que ya tenía. En el escenario, el cartel naranja te muestra cuánto vale.',
     example:() => [hatFlag(fe(iff(toO('Bichito'), chV('puntos', 1), rndB())))], note:'Cada vez que el bichito toca la moneda: un punto más, y la moneda salta.'},
   goal:'La moneda ya salta, pero el cartel de puntos no sube. En el programa de la moneda, agregá “sumar a puntos 1” adentro del “si”. Juntá 5 puntos.',
   palette:['changevar'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1, selInIf:true, vars:{puntos:0},
   sprites:[BUG(-190,-140, () => [MOVE_S()]), COIN(60, 40, () => [COIN_S(false)])],
   check:R => vars().puntos >= 5,
   learn:'Una variable guarda un número. “Sumar a puntos 1” le suma uno cada vez: así se cuentan los puntos.'},
  {id:'p4-crear', name:'Creá tu propia cajita', short:'Crear variable',
   intro:{title:'Cómo se crea una variable',
     text:'En Scratch: en la categoría Variables tocás “Crear una variable”, le escribís un nombre y tocás Aceptar. Aparece el cartel en el escenario y los bloques naranjas ya te dejan elegirla en el menú ▾. El nombre tiene que decir qué guarda: “monedas”, “vidas”, “tiempo”.',
     example:() => [hatFlag(fe(iff(toO('Bichito'), chV('monedas', 1), rndB())))], note:'Con una variable llamada “monedas”: cada vez que la tocás, una moneda más.'},
   goal:'Esta vez no hay ninguna variable. Creá la tuya: en Variables tocá “Crear una variable” y llamala “monedas”. Después usala en la moneda: sumar a monedas 1. Juntá 5.',
   palette:['changevar'], allowCreateVar:true, resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1, selInIf:true, vars:{},
   sprites:[BUG(-190,-140, () => [MOVE_S()]), COIN(60, 40, () => [COIN_S(false)])],
   check:R => {
     const mine = creadas() || [];
     if (mine.length && (corrida().coinJumps || 0) >= 2 && !mine.some(n => scan(progOf('Moneda'), b => b.type === 'changevar' && b.v === n))) return 'Creaste “' + mine[0] + '”, pero la moneda no la suma. En la moneda: sumar a ' + mine[0] + ' 1, adentro del “si”.';
     if (!mine.length && (corrida().coinJumps || 0) >= 3) return 'Todavía no creaste tu variable. En Variables tocá “Crear una variable”.';
     const v = mine.find(n => (vars()[n] || 0) >= 5 && scan(progOf('Moneda'), b => b.type === 'changevar' && b.v === n));
     return !!v;
   },
   learn:'Para crear una variable: Variables → “Crear una variable” → nombre → Aceptar. Un buen nombre dice qué guarda.'},
  {id:'p4-cero', name:'Empezar de cero', short:'Desde cero',
   intro:{title:'La cajita se acuerda',
     text:'Una variable se queda con su número aunque apretes la banderita de nuevo. Por eso los juegos, al empezar, la ponen en 0: “dar a puntos el valor 0”.',
     example:() => [hatFlag(setV('puntos', 0), fe(iff(toO('Bichito'), chV('puntos', 1), rndB())))], note:'Primero pone los puntos en 0 y después empieza a contar.'},
   goal:'El cartel arranca en 12: quedó de una partida anterior. Para ganar tenés que juntar 5 en esta partida. Hacé que al empezar los puntos vuelvan a 0.',
   palette:['setvar'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1, selStart:true, vars:{puntos:12}, needReset:true,
   sprites:[BUG(-190,-140, () => [MOVE_S()]), COIN(60, 40, () => [COIN_S(true)])],
   check:R => {
     if (vars().puntos < 5) return false;
     if (!R.startedZero) return 'Tenés ' + vars().puntos + ' puntos, pero no empezaste de 0: venían de antes. Poné “dar a puntos el valor 0” abajo de la banderita, arriba del “por siempre” de la moneda.';
     return true;
   },
   learn:'Las variables se acuerdan del número. Por eso al empezar se ponen en 0 con “dar a … el valor”.'},
  {id:'p4-vidas', name:'Vidas', short:'Vidas',
   intro:{title:'Restar también es sumar',
     text:'“Sumar a vidas −1” le resta uno. Un número negativo en “sumar” es restar, igual que con x e y.',
     example:() => [hatFlag(setV('vidas', 3), fe(iff(toO('Avispa'), chV('vidas', -1), gotoB(-190, -140))))], note:'Empieza con 3 vidas. Si la avispa te pica, pierde una y vuelve al inicio.'},
   goal:'En el bichito: si ¿tocando Avispa? → sumar a vidas −1 → ir al inicio. Ya empieza con 3 vidas. Juntá 5 monedas.',
   palette:['if','toucho','changevar','goto'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], enemyMatters:true, vars:{puntos:0, vidas:3}, varNames:['vidas','puntos'],
   sprites:[BUG(-190,-140, () => [MOVE_S(), hatFlag(setV('vidas', 3), fe())]), WASP('Avispa', -150, 10, () => [PATROL(5)]), COIN(60, 90, () => [COIN_S(true, true)])],
   check:R => {
     if (vars().puntos < 5) return false;
     if (!hasVarChange('Bichito', 'Avispa', 'vidas', -1)) return 'Juntaste 5, pero si te pica la avispa no perdés vidas. Agregá “sumar a vidas −1” adentro del “si ¿tocando Avispa?”.';
     if (R.enemyIgnored) return 'En algún momento te picó y no pasó nada. Arreglalo y apretá la banderita.';
     return true;
   },
   learn:'“Sumar a vidas −1” resta una vida. Un número negativo en “sumar” es restar.'},
  {id:'p4-golpe', name:'¡Perdí todas de golpe!', short:'De golpe',
   intro:{title:'Un ratito de ventaja',
     text:'El “por siempre” pregunta 30 veces por segundo. Si la avispa te sigue tocando, en un segundo te resta 30 vidas. Los juegos lo arreglan así: después de perder una vida, esperan un ratito antes de volver a preguntar.',
     example:() => [hatFlag(setV('vidas', 3), fe(iff(toO('Avispa'), chV('vidas', -1), waitB(1))))], note:'Pierde una vida y espera un segundo: así no pierde todas de golpe.'},
   goal:'Ahora la avispa te persigue y la regla no te manda al inicio. Mirá qué pasa con las vidas cuando te pica. Arreglalo para perder de a una. Juntá 5 monedas sin quedarte sin vidas.',
   palette:['wait'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selInIf:true, vars:{puntos:0, vidas:3}, varNames:['vidas','puntos'],
   sprites:[BUG(-190,-140, () => [MOVE_S(), LIFE_S({open:true})]), WASP('Avispa', 190, 140, () => [hatFlag(waitB(1), fe(ptoB('Bichito'), mv(3)))]), COIN(60, -60, () => [COIN_S(true, true)])],
   check:R => {
     if (vars().puntos < 5) return false;
     if (!ruleIn('Bichito', b => b.type === 'if' && condTargets(b.cond).includes('Avispa') && b.body.some(x => x.type === 'wait'))) return 'Juntaste 5, pero sin esperar perdés todas las vidas de golpe. Poné “esperar 1 segundos” después de restar.';
     if (vars().vidas <= 0) return 'Juntaste 5, pero te quedaste sin vidas. ¡Probá otra vez!';
     return true;
   },
   learn:'Después de perder una vida, “esperar” da un ratito de ventaja. Así no se pierden todas juntas.'},
  {id:'p4-igual', name:'¿Es igual?', short:'¿Es igual?',
   intro:{title:'El “=” como pregunta',
     text:'En matemática, “2 + 3 = 5” es una cuenta y el 5 es el resultado. Acá adentro del “si”, el “=” es una pregunta: ¿puntos es igual a 5? Se contesta con sí o con no. Mientras tengas 0, 1, 2, 3 o 4 puntos, la respuesta es NO. Cuando tenés 5, es SÍ. El “=” es un bloque verde de Operadores.',
     example:() => [hatFlag(fe(iff(eqB('puntos', 5), sayB('¡Tengo 5!'))))], note:'El “por siempre” pregunta todo el tiempo: ¿puntos = 5? No… no… no… ¡sí! Y ahí dice “¡Tengo 5!”. En Scratch, el nombre de la variable es una bolita naranja que se arrastra al hueco de la izquierda.'},
   goal:'Adentro del “si”, el “=” es una pregunta: ¿puntos es igual a 5? Hacé que el bichito diga “¡Tengo 5!” justo cuando tenga 5 puntos. Mirá el cartel de la pregunta en el escenario: contesta SÍ o NO.',
   palette:['if','eq','say'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], vars:{puntos:0}, varNames:['puntos'], showEq:true,
   sprites:[BUG(-190,-140, () => [MOVE_S(), hatFlag(fe())]), COIN(60, -60, () => [Object.assign(COIN_S(true, true), {fold:'si me toca el bichito, suma un punto y salto'})])],
   check:R => {
     if (!R.said5) return false;
     if (!hasEqSay('puntos', 5)) return 'Dijo algo con 5 puntos, pero falta la pregunta “¿puntos = 5?” en el “si”.';
     return true;
   },
   learn:'Adentro de un “si”, el “=” no es una cuenta: es una pregunta que se contesta sí o no. Con 5 puntos la respuesta es sí.',
   extra:'Con la misma pregunta se arma el final de un juego: ¿vidas = 0? Si sí, perdiste.'},
  {id:'p4-over', name:'Game over', short:'Game over',
   intro:{title:'¿Vidas igual a 0?',
     text:'Con el “=” también se arma el final del juego: “¿vidas = 0?” se contesta sí o no. Si es sí, el juego termina.',
     example:() => [hatFlag(fe(iff(eqB('vidas', 0), sayB('¡Se terminó!'), stopB())))], note:'Si las vidas llegan a 0: dice “¡Se terminó!” y se termina todo.'},
   goal:'Con 0 vidas el juego sigue como si nada. Programá el final en el programa vacío del bichito: si vidas = 0 → decir “¡Se terminó!” → detener todos. Probalo: dejate picar 3 veces.',
   palette:['if','eq','say','stop'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], vars:{puntos:0, vidas:3}, varNames:['vidas','puntos'], showEq:true,
   sprites:[BUG(-190,-140, () => [MOVE_S(), LIFE_S({wait:true}), hatFlag(fe())]), WASP('Avispa', 190, 140, () => [hatFlag(waitB(1), fe(ptoB('Bichito'), mv(4)))]), COIN(60, -60, () => [COIN_S(true, true)])],
   check:R => R.gameOver && hasEqRule('vidas', 0),
   learn:'“=” compara dos números. “Si vidas = 0” es el final del juego: game over.'},
  {id:'p4-reloj', name:'Cronómetro', short:'Cronómetro',
   intro:{title:'Un reloj es una variable',
     text:'Un reloj también es una cajita con un número: “tiempo”. Arranca en 0 y, cada segundo, le sumás 1. Para eso sirve “esperar 1 segundos”: sin esperar, el “por siempre” sumaría 30 por segundo.',
     example:() => [hatFlag(setV('tiempo', 0), fe(waitB(1), chV('tiempo', 1)))], note:'Pone el tiempo en 0. Después, para siempre: espera un segundo y suma uno.'},
   goal:'Armá un cronómetro en el programa vacío del bichito: adentro del “por siempre”, esperar 1 segundos y sumar a tiempo 1. Juntá 5 monedas y mirá cuánto tardaste.',
   palette:['wait','changevar'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], vars:{puntos:0, tiempo:0}, varNames:['tiempo','puntos'],
   sprites:[BUG(-190,-140, () => [MOVE_S(), Object.assign(hatFlag(fe(iff(eqB('puntos', 5), sayB('¡Listo!'), stopB()))), {fold:'si junto 5 monedas, termina'}), hatFlag(setV('tiempo', 0), fe())]),
     COIN(60, -60, () => [Object.assign(COIN_S(true, true), {fold:'si me toca el bichito, suma un punto y salto'})])],
   check:R => {
     if (!(R.stopPts >= 5)) return false;
     // un "por siempre" que espere 1 segundo y sume 1 al tiempo
     const ok = progOf('Bichito').some(sc => { let si = false; walk(sc.body, b => { if (b.type === 'forever' && b.body.some(x => x.type === 'wait' && Number(x.n) === 1) && b.body.some(x => x.type === 'changevar' && x.v === 'tiempo' && Number(x.n) === 1)) si = true; }); return si; });
     if (!ok) return 'Juntaste 5, pero el reloj no cuenta bien. Adentro del “por siempre”: esperar 1 segundos y sumar a tiempo 1.';
     return true;
   },
   learn:() => `¡Tardaste ${vars().tiempo} segundos! Un cronómetro es una variable que suma 1 cada segundo: esperar 1 y sumar 1, por siempre.`,
   extra:'¿Podés hacerlo más rápido? Y si el reloj contara para atrás…'},
  {id:'p4-regresiva', name:'Cuenta regresiva', short:'Regresiva',
   intro:{title:'Un reloj para atrás',
     text:'Una cuenta regresiva arranca en un número, por ejemplo 10, y cada segundo le resta 1: sumar a tiempo −1. Cuando llega a 0, se acabó el tiempo.',
     example:() => [hatFlag(setV('tiempo', 10), fe(waitB(1), chV('tiempo', -1)))], note:'Y otra regla: si tiempo = 0 → “Se acabó el tiempo” → detener todos.'},
   goal:'El reloj sube en vez de bajar: hacé que cuente para atrás. Y sumá la regla: si tiempo = 0 → decir “Se acabó el tiempo” → detener todos.',
   palette:['if','eq','say','stop'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], vars:{puntos:0, tiempo:10}, varNames:['tiempo','puntos'], showEq:true,
   sprites:[BUG(-190,-140, () => [MOVE_S(), hatFlag(setV('tiempo', 10), fe(waitB(1), chV('tiempo', 1))),
       Object.assign(hatFlag(fe(iff(eqB('puntos', 8), sayB('¡Ganaste!'), stopB()))), {fold:'si junto 8 monedas, gano'}), hatFlag(fe())]),
     COIN(60, -60, () => [Object.assign(COIN_S(true, true), {fold:'si me toca el bichito, suma un punto y salto'})])],
   check:R => {
     if (!(R.stopPts >= 8) && !R.timeUp) return false;
     if (!scanF(progOf('Bichito'), b => b.type === 'changevar' && b.v === 'tiempo' && Number(b.n) < 0)) return (R.timeUp ? 'Se terminó' : 'Ganaste') + ', pero el reloj no cuenta para atrás. Cambiá “sumar a tiempo 1” por −1.';
     if (!hasEqRule('tiempo', 0)) return (R.timeUp ? 'Se terminó' : 'Ganaste') + ', pero falta la regla: si tiempo = 0 → “Se acabó el tiempo” → detener todos.';
     return true;
   },
   learn:() => corrida().timeUp
     ? '¡Se te acabó el tiempo… y eso quiere decir que tu reloj funciona! Cuenta para atrás y, cuando llega a 0, termina el juego. Si querés, quedate y probá juntar las 8 antes.'
     : '¡Llegaste a 8 antes de que se acabe el tiempo! Una cuenta regresiva resta 1 por segundo, y con “¿tiempo = 0?” el juego sabe cuándo se terminó.'},
  {id:'p4-todo', name:'Todo junto', short:'Todo junto',
   intro:{title:'Las reglas del juego',
     text:'Igual que con las vidas, también se gana con una variable: si puntos = 10, ganaste. Las dos reglas pueden ir en el mismo “por siempre”.',
     example:() => [hatFlag(fe(iff(eqB('vidas', 0), sayB('¡Se terminó!'), stopB()), iff(eqB('puntos', 10), sayB('¡Ganaste!'), stopB())))]},
   goal:'Moneda, corazón y avispa ya están programados. Armá las reglas del juego en el bichito: si vidas = 0, se termina; si puntos = 10, ganaste. ¡Y ganá!',
   palette:['if','eq','say','stop'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], vars:{puntos:0, vidas:3}, varNames:['vidas','puntos'], showEq:true,
   sprites:[BUG(-190,-140, () => [MOVE_S(), LIFE_S({wait:true}), hatFlag(fe())]),
     WASP('Avispa', 190, 140, () => [hatFlag(waitB(2), fe(ptoB('Bichito'), mv(3)))]), WASP('Avispa 2', -150, 30, () => [PATROL(4)], 90, '#C2410C'),
     COIN(60, -60, () => [Object.assign(COIN_S(true, true), {fold:'si me toca el bichito, suma un punto y salto'})]),
     HEART(-60, 110, () => [Object.assign(HEART_S(), {fold:'si me toca el bichito, suma una vida y salto'})])],
   check:R => {
     if (!R.wonByPoints) return false;
     if (!hasEqRule('puntos', 10) || !hasEqRule('vidas', 0)) return '¡Ganaste! Pero faltan reglas: tienen que estar las dos, la de perder y la de ganar.';
     return true;
   },
   learn:'Un juego completo: objetos que dan puntos y vidas, enemigos que las quitan, y reglas que dicen cuándo ganás y cuándo perdés.'},
  {id:'p4-cierre', name:'Cierre: vidas y puntos', short:'Cierre', mode:'cierre', goal:'Mirá los programas de cada personaje y respondé.',
   palette:[], stars:[], start:{x:-190,y:-140}, resetOnFlag:true, vars:{puntos:0, vidas:3},
   sprites:[BUG(-190,-140, () => [MOVE_S(), LIFE_S({wait:true}), hatFlag(fe(iff(eqB('vidas', 0), sayB('¡Se terminó!'), stopB()), iff(eqB('puntos', 10), sayB('¡Ganaste!'), stopB())))]),
     WASP('Avispa', 190, 140, () => [hatFlag(waitB(2), fe(ptoB('Bichito'), mv(3)))]), COIN(60, -60, () => [COIN_S(true, true)]), HEART(-60, 110, () => [HEART_S()])],
   quiz:[
     {q:'¿Qué es una variable?', opts:[
       ['Un personaje que se mueve.', false],
       ['Una cajita con nombre que guarda un número, como “puntos” o “vidas”.', true, 'Exacto. Se puede dar un valor, sumarle, restarle y preguntar cuánto vale.'],
       ['Un color del escenario.', false]]},
     {q:'Con 3 vidas, ¿qué contesta “¿vidas = 0?”?', opts:[
       ['Sí.', false],
       ['No: 3 no es igual a 0.', true, 'Exacto. Recién cuando las vidas llegan a 0 contesta sí, y ahí termina el juego.'],
       ['3.', false]]},
     {q:'¿Por qué al empezar se pone “dar a puntos el valor 0”?', opts:[
       ['Porque la cajita se acuerda del número de la partida anterior.', true, '¡Sí! Si no la ponés en 0, arrancás con los puntos de antes.'],
       ['Porque si no, la moneda no salta.', false],
       ['No hace falta.', false]]},
     {q:'¿Por qué se perdían todas las vidas de golpe?', opts:[
       ['Porque la avispa era muy grande.', false],
       ['Porque “por siempre” pregunta 30 veces por segundo y restaba en cada vuelta mientras te tocaba.', true, 'Exacto. Con “esperar 1 segundos” después de restar, se pierde de a una.'],
       ['Porque las vidas eran negativas.', false]]},
     {q:'¿La moneda es un personaje?', opts:[
       ['No, porque no camina.', false],
       ['Sí: en Scratch todo lo del escenario es un objeto con sus propios programas, aunque no se mueva solo.', true, '¡Eso! Moneda, corazón, avispa y bichito: todos son objetos.']]},
     {q:'¿Por qué el reloj necesita “esperar 1 segundos”?', opts:[
       ['Porque sin esperar, el “por siempre” suma 30 por segundo y el reloj vuela.', true, 'Exacto. Esperar 1 segundo entre cada suma hace que cuente de a un segundo.'],
       ['Para que el bichito camine más lento.', false],
       ['No hace falta.', false]]},
   ],
   learn:'Las variables guardan números: con ellas se cuentan puntos y vidas, y se decide cuándo ganás o perdés.',
   extra:'Lo que viene: niveles, pasar de un mapa a otro.'},
];

export const FREE4 = {id:'libre4', name:'Modo libre', short:'Libre', mode:'free', intro:{title:'Modo libre', text:'Armá tu propio juego: monedas que suman, corazones que dan vidas, avispas que quitan, y las reglas para ganar y perder.'},
  goal:'Armá tu juego con puntos y vidas.', vars:{puntos:0, vidas:3}, varNames:['puntos','vidas'], allowCreateVar:true,
  palette:['flag','forever','if','toucho','eq','or','move','bounce','pointto','gorandom','goto','say','wait','stop','setvar','changevar'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[],
  sprites:[BUG(-190,-140, () => [MOVE_S(), LIFE_S({wait:true}), OVER_S()]), WASP('Avispa', 190, 140, () => [hatFlag(waitB(2), fe(ptoB('Bichito'), mv(3)))]),
    COIN(60, -60, () => [COIN_S(true, true)]), HEART(-60, 110, () => [hatFlag(fe())])]};

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
export const PARTE = {rasgos:{avisarSiAfuera:true, finPorVariables:true, portada:'variables'}, name:'Vidas y puntos', desc:'Objetos, variables, ganar y perder', levels:LEVELS4, free:FREE4,
   tag:'Monedas, corazones y una cajita que cuenta.',
   teach:[
     ['La clase', '<p>Núcleo en 4.º y 5.º; también 6.º y 7.º. Dos clases de 40 a 60 minutos: la primera hasta “Game over”; la segunda, reloj, cuenta regresiva y las reglas del juego. Primero, la idea de que todo lo del escenario es un objeto con programas. Después, variables: dar un valor, sumar, restar y comparar con “=”.</p><p>Diferencia con Scratch: acá el lado izquierdo del “=” es un menú con la variable; en Scratch se arrastra la bolita naranja de la variable al hueco.</p>'],
     ['Antes, sin pantalla', '<ol><li>Una caja con un papel que dice “puntos: 0”. Cada vez que alguien toca la “moneda”, se tacha y se escribe uno más.</li><li>¿Qué pasa si la próxima ronda no borramos el papel? (dar a puntos el valor 0)</li><li>Tres vidas en la pizarra: si llega a 0, “game over”.</li></ol>'],
     ['Preguntas de cierre', '<ul><li>¿Qué guarda una variable?</li><li>¿Por qué se pone en 0 al empezar?</li><li>¿Cómo sabe el juego que ganaste o que perdiste?</li></ul>'],
   ]};
