import { R_ } from '../fondos.js';
import { GOAL_S, MOVE_FULL, MOVE_S, MOVEW_S } from '../programas.js';
import { cx, cy, fe, gotoB, hatFlag, iff, kp, sayB, stopB, tc } from '../../motor/bloques.js';
import { lavaRule, starsDone, wallRule } from '../../motor/reglas.js';

export const MAP_L3 = [R_(-140,-180,-60,60,'lava'), R_(20,-60,110,180,'lava'), R_(160,100,234,174,'goal')];

export const MAP_L4 = [R_(40,-180,70,180,'wall')];
// pared a los dos lados: el freno aparte de p2-4 falla yendo a la izquierda
export const MAP_L4B = [R_(40,-180,70,180,'wall'), R_(-130,-180,-100,180,'wall')];
// barro y después hielo, hasta la meta
export const MAP_HIELO = [R_(-150,-180,-100,180,'mud'), R_(-60,-180,160,180,'ice'), R_(185,-40,236,40,'goal')];

export const MAP_L5 = [R_(-160,40,240,70,'wall'), R_(-40,-180,-10,-30,'wall'), R_(60,-60,240,-30,'wall')];

export const MAP_L6 = [R_(40,-180,130,-10,'ice'), R_(160,-100,240,30,'mud'),
  R_(-110,-180,-80,80,'wall'), R_(10,-80,40,180,'wall'), R_(130,-180,160,80,'wall'),
  R_(-80,-40,-40,10,'lava'), R_(100,0,130,50,'lava'), R_(130,80,160,108,'lava'), R_(172,-176,236,-110,'goal')];

export const LEVELS2 = [
  {id:'p2-1', name:'¿Qué estoy tocando?', intro:{title:'¿Tocando el color?', text:'“¿Tocando el color?” es una pregunta: el bichito ¿toca ese color, sí o no? Adentro de un “por siempre”, se pregunta todo el tiempo. “Decir” (Apariencia, violeta) le pone un globito al bichito. Un objeto puede tener varios programas que andan a la vez: uno lo mueve y otro mira qué toca.', example:() => [hatFlag(fe(iff(tc('goal'), sayB('¡Llegué!'))))]}, goal:'El movimiento ya está armado (arriba, cerrado). Abajo tenés un programa nuevo: hacé que diga “¡Llegué!” cuando toca el verde.',
   palette:['if','touchc','say'], colors:['goal'], resetOnFlag:true, start:{x:-180,y:0}, stars:[],
   map:[R_(150,-50,234,50,'goal')], goalSayHint:true,
   program:() => [MOVE_S(), hatFlag(fe())],
   check:R => R.saidOnGoal,
   learn:'Puedo preguntar si el personaje toca un color. Como la pregunta está adentro del “por siempre”, se hace todo el tiempo.',
   extra:'Fijate: el bichito tiene dos programas a la vez. Uno lo mueve y el otro mira si llegó. Cada uno se ocupa de una sola cosa.'},
  {id:'p2-2', name:'La meta', intro:{title:'Detener todos', text:'“Detener todos” para todos los programas a la vez. Ponelo adentro del “si” del verde, abajo del “decir”.', example:() => [GOAL_S(true)]}, goal:'Cuando llega a la meta, que el juego termine: el bichito no se tiene que mover más.',
   palette:['if','touchc','say','stop'], colors:['goal'], resetOnFlag:true, start:{x:-180,y:-120}, stars:[],
   map:[R_(150,90,234,174,'goal')], needStop:true,
   program:() => [MOVE_S(), GOAL_S(false)],
   check:R => R.stopOnGoal,
   learn:'“Detener todos” termina el programa. Tocar un color y detener todo: así se hace una meta.'},
  {id:'p2-3', name:'¡Cuidado, lava!', intro:{title:'Volver al inicio', text:'“Ir a x: y:” lleva al bichito a un lugar exacto. Si le ponés los números del inicio, vuelve a empezar.', example:() => [hatFlag(fe(iff(tc('lava'), gotoB(-195,-140))))]}, goal:'Si toca el rojo, que vuelva al inicio. Probalo: pisá la lava una vez. Después llegá al verde.',
   palette:['flag','forever','if','touchc','goto'], colors:['lava','goal'], resetOnFlag:true, start:{x:-195,y:-140}, stars:[],
   map:MAP_L3,
   program:() => [MOVE_S(), GOAL_S(true)],
   check:R => {
     if (!R.stopOnGoal) return false;
     if (!R.lavaFunciona) return lavaRule() ? 'Llegaste. Ahora probá la lava: pisala y fijate que vuelva al inicio.' : 'Llegaste, pero si alguien pisa la lava no pasa nada. Armá un programa nuevo: si toca el rojo, ir a x: −195 y: −140.';
     if (R.lavaIgnored) return 'En el camino pisaste la lava y no pasó nada. Arreglá el programa y apretá la banderita.';
     return true;
   },
   learn:'Tocar un color también puede castigar. “Ir a x: y:” manda al personaje a un lugar exacto: el inicio.'},
  {id:'p2-4', name:'La pared',
   intro:{title:'Chocar es deshacer el paso',
     text:'Para que el bichito no atraviese la pared, cuando la toca tiene que volver el paso que dio. Si sumó 10 a x, resta 10. Así queda pegado a la pared, sin meterse.',
     example:() => [hatFlag(fe(iff(tc('wall'), cx(-10))))],
     note:'Este es un programa aparte: pregunta todo el tiempo si toca el gris.'},
   goal:'La pared gris no se atraviesa. Armá un programa nuevo: si toca el gris, que vuelva un pasito para atrás. Juntá las estrellas.',
   palette:['flag','forever','if','touchc','cx','cy'], colors:['wall'], resetOnFlag:true, start:{x:-180,y:0},
   stars:[{x:5,y:130},{x:5,y:-10},{x:5,y:-140}], map:MAP_L4,
   program:() => [MOVE_S()],
   check:R => {
     if (!starsDone()) return false;
     if (R.inside) return 'Juntaste todo, pero en algún momento se metió en la pared. Arreglalo y apretá la banderita.';
     if (!wallRule()) return 'Juntaste todo, pero ¿qué pasa si choca la pared? Programá: si toca el gris, sumar a x −10.';
     return true;
   },
   learn:'Si toca el gris, deshace el paso: suma −10 y queda pegado a la pared. Así se programa un choque.',
   extra:'Acá funcionó porque solo chocás yendo a la derecha. Ahora vas a ver otra forma: la pregunta adentro de la flecha.'},
  {id:'p2-dentro', name:'Una pregunta adentro', short:'Pregunta adentro',
   intro:{title:'Una pregunta adentro de otra',
     text:'Un “si” puede tener otro “si” adentro. La pregunta de adentro solo se hace cuando la de afuera dijo que sí. Como en casa: si suena el timbre, entonces… si es la abuela, abro la puerta.',
     example:() => [hatFlag(fe(iff(kp('right'), cx(10), iff(tc('wall'), cx(-10)))))],
     note:'Si apretás la flecha derecha, suma 10. Y ahí adentro pregunta: ¿toqué la pared? Si sí, resta 10 y no avanza. Así cada flecha deshace su propio paso.'},
   goal:'El freno de la pared resta 10 siempre, y yendo a la izquierda te metés en la pared. Poné la pregunta del gris adentro de cada flecha, con el paso al revés. Juntá las estrellas.',
   palette:['if','touchc','cx'], colors:['wall'], resetOnFlag:true, start:{x:-20,y:0},
   stars:[{x:5,y:120},{x:-75,y:-120}], map:MAP_L4B,
   program:() => [MOVE_S(true), hatFlag(fe(iff(tc('wall'), cx(-10))))],
   check:R => {
     if (!starsDone()) return false;
     if (R.inside) return 'Juntaste todo, pero en algún momento se metió en la pared. Arreglalo y apretá la banderita.';
     return true;
   },
   learn:'La pregunta de adentro solo se hace cuando la de afuera dijo que sí: si caminás a la izquierda y tocás gris, volvés 10 a la derecha. Cada flecha deshace su propio paso.'},
  {id:'p2-5', name:'Paredes por todos lados', goal:'Ahora chocás desde todos lados. La flecha derecha ya frena. Completá las otras tres: adentro de cada una, una pregunta por el gris que deshaga su paso.',
   intro:{title:'Cada flecha deshace su paso',
     text:'Si subiste y tocaste la pared, tenés que bajar. Si fuiste a la izquierda, volvés a la derecha. Cada flecha tiene su propia pregunta adentro, con el número al revés.',
     example:() => [hatFlag(fe(iff(kp('up'), cy(10), iff(tc('wall'), cy(-10)))))],
     note:'Para la flecha de arriba: suma 10 a y; si toca el gris, resta 10 a y.'},
   palette:['if','touchc','cx','cy'], colors:['wall'], resetOnFlag:true, start:{x:-195,y:-140},
   stars:[{x:-200,y:140},{x:100,y:130},{x:190,y:3},{x:190,y:-130}], map:MAP_L5,
   program:() => [Object.assign(hatFlag(fe(
     iff(kp('right'), cx(10), iff(tc('wall'), cx(-10))), iff(kp('left'), cx(-10)), iff(kp('up'), cy(10)), iff(kp('down'), cy(-10)))),
     {fold:'moverse con las flechas', open:true})],
   check:R => {
     if (!starsDone()) return false;
     if (R.inside) return 'Juntaste todo, pero en algún momento se metió en la pared. Arreglalo y apretá la banderita.';
     return true;
   },
   learn:'Cada flecha deshace su propio paso: si fui a la derecha y toqué gris, vuelvo a la izquierda. Si subí, bajo.',
   extra:'Casi siempre conviene un programa aparte para cada cosa. Pero a veces, como acá, la pregunta tiene que ir adentro de otra.'},
  {id:'p2-barro', name:'Barro y hielo', short:'Barro y hielo',
   intro:{title:'Un color cambia la velocidad',
     text:'Tocar un color no solo sirve para chocar: también cambia cómo te movés. En el barro marrón, el bichito suma 10 y le resta 5: va a la mitad. En el hielo celeste podría sumar 10 más: iría el doble de rápido.',
     example:() => [hatFlag(fe(iff(kp('right'), cx(10), iff(tc('ice'), cx(10)))))],
     note:'Es igual que el barro, pero con un número positivo: en vez de frenar, acelera.'},
   goal:'Tenés poco tiempo para llegar a la meta y el barro te frena. Hacé que en el hielo celeste vaya más rápido. Mirá cómo está hecho el barro en la flecha derecha.',
   palette:['if','touchc','cx'], colors:['ice'], resetOnFlag:true, start:{x:-215,y:0},
   stars:[], map:MAP_HIELO, timeLimit:1350,
   program:() => [Object.assign(hatFlag(fe(iff(kp('right'), cx(10), iff(tc('mud'), cx(-5))), iff(kp('left'), cx(-10)), iff(kp('up'), cy(10)), iff(kp('down'), cy(-10)))), {open:true}), GOAL_S(true)],
   check:R => R.stopOnGoal === true,
   learn:'Tocar un color puede hacer de todo: ganar (meta), volver al inicio (lava), chocar (pared), ir más lento (barro) o más rápido (hielo).',
   extra:'Ahora, el laberinto final con todo junto.'},
  {id:'p2-6', name:'El laberinto', intro:{title:'Todo junto', text:'El programa de moverse ya tiene todo: frena en las paredes, patina rápido en el hielo y va lento en el barro. Vos armá programas aparte: uno para la lava (ir al inicio) y otro para la meta (decir y detener todos). Ojo: en el hielo patinás, ¡no te pases hacia la lava!'}, goal:'El movimiento ya frena en paredes, patina en el hielo y va lento en el barro. Armá dos programas nuevos, uno para la lava y otro para la meta, y llegá al verde.',
   palette:['flag','forever','if','touchc','goto','say','stop'], colors:['lava','goal'], resetOnFlag:true, start:{x:-200,y:-150}, stars:[], goalSayHint:true, needStop:true,
   map:MAP_L6,
   program:() => [Object.assign(hatFlag(MOVE_FULL()), {fold:'moverse: paredes, hielo y barro'})],
   check:R => {
     if (!R.stopOnGoal) return false;
     if (!lavaRule()) return 'Llegaste, pero la lava no hace nada. Programá: si toca el rojo, ir al inicio.';
     if (R.lavaIgnored) return 'En el camino pisaste la lava y no pasó nada. Arreglalo y apretá la banderita.';
     if (R.inside) return 'En algún momento te metiste en una pared. Arreglalo y apretá la banderita.';
     return true;
   },
   learn:'Paredes, lava y meta son la misma idea: preguntar todo el tiempo qué color toca y decidir qué pasa.'},
  {id:'p2-7', name:'Cierre: choques', short:'Cierre', mode:'cierre', goal:'Este es todo el juego metido en un solo programa gigante. Manejalo con las flechas y después respondé.',
   palette:[], stars:[], map:MAP_L6, start:{x:-200,y:-150}, resetOnFlag:true,
   demo:() => [{x:-200, y:-150, color:'#E8553F', label:'Todo junto en un solo programa', program:[hatFlag(
     fe(...MOVE_FULL().body, iff(tc('lava'), gotoB(-200,-150)), iff(tc('goal'), sayB('¡Llegué!'), stopB())))]}],
   quiz:[
     {q:'¿Por qué el “si ¿tocando el color gris?” va adentro de cada flecha?', opts:[
       ['Porque así es más rápido.', false],
       ['Para deshacer justo el paso que acaba de dar.', true, 'Exacto. Si subió y tocó la pared, baja. Si fue a la derecha, vuelve a la izquierda. Cada flecha deshace lo suyo.'],
       ['Porque el gris solo funciona adentro.', false]]},
     {q:'¿Qué números van en “ir a x: y:” para volver al inicio?', opts:[
       ['Los del lugar donde empieza el bichito.', true, 'Exacto. Mirá dónde arranca (x e y) y poné esos números.'],
       ['Siempre 0 y 0.', false],
       ['Los de la meta.', false]]},
     {q:'¿Qué diferencia hay entre la lava y la pared?', opts:[
       ['La lava te manda al inicio con “ir a x: y:”; la pared solo te frena.', true, '¡Sí! Las dos se programan preguntando por un color. Lo que cambia es qué hacés cuando lo tocás.'],
       ['Ninguna, son iguales.', false],
       ['La pared te manda al inicio.', false]]},
     {q:'En Scratch, ¿dónde está “¿tocando el color?”', opts:[
       ['En Movimiento, azul.', false],
       ['En Eventos, amarillo.', false],
       ['En Sensores, celeste.', true, 'Exacto. Y “detener todos” está en Control, naranja, como “si” y “por siempre”.']]},
     {q:'Este programa tiene todo junto en un bloque gigante. ¿Funciona igual que con programas separados?', opts:[
       ['No, se rompe.', false],
       ['Sí, hace lo mismo. Separado es más fácil de leer y de arreglar.', true, '¡Eso! Los dos funcionan. En los juegos grandes conviene separar: un programa para moverse, otro para la meta, otro para la lava.'],
       ['Solo funciona si es gigante.', false]]},
   ],
   learn:'Un juego pregunta todo el tiempo qué está tocando: la meta termina, la lava castiga y la pared frena.',
   extra:'Lo que viene: enemigos que se mueven solos y te persiguen.'},
];

export const FREE2 = {id:'libre2', name:'Modo libre', short:'Libre', mode:'free', intro:{title:'Modo libre', text:'Armá los programas que quieras. La meta y la lava pueden ir en programas aparte; el freno de las paredes va adentro de cada flecha.'}, goal:'Armá tu programa: paredes, lava y meta. Juntá las estrellas.',
  palette:['flag','key','move','cx','cy','goto','say','repeat','forever','if','stop','keyp','touchc','or'], colors:['wall','lava','goal','ice','mud'], resetOnFlag:true,
  start:{x:-200,y:-150}, stars:[], map:MAP_L6, program:() => [MOVEW_S()]};

/* Ficha de la parte: ver el comentario de rasgos en 1-movimiento.js. */
export const PARTE = {rasgos:{alCargar:'movimientoArmado', avisarSiAfuera:true, avisarPorSiempreVacio:true, avisarDetuvoAntes:true, portada:'choques'}, name:'Choques y metas', desc:'Tocar colores: meta, lava y paredes', levels:LEVELS2, free:FREE2,
   tag:'El movimiento ya está. Ahora el juego pregunta qué estás tocando.',
   teach:[
     ['La clase', '<p>Núcleo en 4.º y 5.º; también 6.º y 7.º. Una clase de 40 a 60 minutos. El movimiento llega armado: se trabaja el condicional adentro de la repetitiva y el sensor “¿tocando el color?”.</p><p>Indicador de 5.º: “Identifica errores y corrige secuencias simples de programación para la mejora de resultados”. Se ve en “Una pregunta adentro”: el freno aparte funciona yendo a la derecha, pero yendo a la izquierda el bichito se mete en la pared, y la pregunta del gris pasa adentro de cada flecha. Después, barro y hielo muestran que tocar un color también puede cambiar la velocidad.</p><p>Bloques nuevos: “¿tocando el color?” (Sensores), “decir” (Apariencia), “detener todos” (Control) e “ir a x: y:” (Movimiento). Un objeto puede tener varios programas andando a la vez.</p>'],
     ['Antes, sin pantalla', '<ol><li>Cinta verde en el piso: si la pisás, decís “¡Llegué!” y te quedás quieto (meta).</li><li>Papel rojo: si lo pisás, volvés a la largada (lava).</li><li>Línea gris: si la pisás, das un paso atrás, el mismo que diste (pared).</li><li>Zona de barro: pasos cortitos. Zona de hielo: pasos largos.</li></ol>'],
     ['Preguntas de cierre', '<ul><li>¿Por qué el “si toca gris” va adentro de cada flecha?</li><li>¿Qué diferencia hay entre volver al inicio y frenar?</li><li>¿Cómo sabe un juego que llegaste a la meta?</li></ul>'],
   ]};
