import { CIERRE_B } from '../programas.js';
import { cx, cy, fe, hatFlag, hatKey, iff, kp, mv, orB } from '../../motor/bloques.js';
import { starsDone } from '../../motor/reglas.js';

export function rocksDiagonal(){
  const r = [], off = 52 / Math.SQRT2;
  for (let t = -260; t <= 200; t += 26){
    for (const s of [-1, 1]){
      const x = t + s*(-off), y = t + 40 + s*off;
      if (x > -236 && x < 236 && y > -176 && y < 176) r.push({x, y});
    }
  }
  return r;
}

export const CIERRE_A = () => [hatKey('right', cx(10)), hatKey('left', cx(-10)), hatKey('up', cy(10)), hatKey('down', cy(-10))];

export const LEVELS1 = [
  {id:1, name:'La banderita', intro:{title:'La banderita', text:'Un programa arranca con un evento. “Al hacer clic en bandera” espera a que toques la banderita verde y ahí corre los bloques de abajo, de arriba hacia abajo.', example:() => [hatFlag(mv(10))], note:'Cada clic en la banderita: 10 pasos más.'}, goal:'Armá “al hacer clic en bandera → mover 10 pasos”. Apretá la banderita hasta llegar a la estrella.',
   palette:['flag','move'], start:{x:-150,y:0}, stars:[{x:-100,y:0}], program:() => [],
   learn:'Un programa arranca con un evento. Cada clic en la banderita lo arranca una vez: el bichito avanza 10 pasos y se queda quieto.'},
  {id:2, name:'La estrella lejana', intro:{title:'¿Cuántos pasos faltan?', text:'Mirá la regla de abajo: dice cuántos pasos faltan hasta la estrella. Cada “mover 10 pasos” avanza 10. ¿Cuántos bloques necesitás? También podés cambiar el número del bloque.'}, goal:'Mirá la regla: ¿cuántos pasos faltan hasta la estrella? Hacé que llegue con un solo clic en la banderita. Podés sumar bloques o cambiar el número.', measure:true,
   palette:['flag','move'], start:{x:-180,y:0}, stars:[{x:120,y:0}], resetOnFlag:true, program:() => [hatFlag(mv(10))],
   learn:'¡Llegó de golpe! La banderita corre todo el programa junto y vos no lo manejás.',
   extra:'¿Y si quiero moverlo cuando yo quiera, como en un juego? Eso es lo que vamos a descubrir.'},
  {id:3, name:'Una tecla', intro:{title:'Una tecla es un evento', text:'“Al presionar tecla” arranca el programa cada vez que apretás esa tecla. Si la dejás apretada, se repite solo.', example:() => [hatKey('right', mv(10))]}, measure:true, goal:'Manejalo vos: “al presionar tecla flecha derecha → mover 10 pasos”. Llegá a la estrella con la flecha.',
   palette:['key','move'], start:{x:-180,y:0}, stars:[{x:150,y:0}], collectFrom:'key', program:() => [],
   learn:'Una tecla también es un evento. Apretás la tecla (entrada) y el bichito se mueve (salida).'},
  {id:4, name:'Para atrás y para arriba', intro:{title:'Números negativos', text:'“Mover pasos” va hacia donde mira el bichito, y mira a la derecha. Con un número negativo, como −10, va para atrás.', example:() => [hatKey('left', mv(-10))]}, measure:true, goal:'Llevá al bichito a la estrella de la izquierda con la flecha izquierda. ¿Y la de arriba?',
   palette:['key','move'], start:{x:0,y:-40}, stars:[{x:-160,y:-40},{x:0,y:120,opt:true}], collectFrom:'key',
   program:() => [hatKey('right', mv(10))],
   learn:'“Mover pasos” va hacia donde mira el bichito, y mira a la derecha. Con −10 va para atrás.',
   extra:'Pero para subir, “mover pasos” no alcanza. Necesitamos otra idea: x e y.'},
  {id:5, name:'¿Dónde está?', intro:{title:'x e y', text:'x mide los costados: derecha es más, izquierda es menos. y mide arriba y abajo: arriba es más, abajo es menos. En el centro, x e y valen 0.'}, mode:'explore', goal:'Arrastrá al bichito y mirá cómo cambian x e y. Después adiviná dónde está cada estrella.',
   palette:[], axes:true, start:{x:0,y:0}, stars:[{x:120,y:90},{x:-90,y:-60}],
   learn:'x es para los costados e y es para arriba y abajo. El centro es 0. “Menos” es izquierda o abajo.'},
  {id:6, name:'Las cuatro flechas', intro:{title:'Sumar a x, sumar a y', text:'“Sumar a x” mueve a los costados y “sumar a y” mueve arriba y abajo. Necesitás un programa por cada flecha.', example:() => [hatKey('up', cy(10)), hatKey('down', cy(-10))]}, goal:'Juntá todas las estrellas con las cuatro flechas. Usá “sumar a x” y “sumar a y” con 10 y −10.',
   palette:['key','cx','cy'], axes:true, start:{x:-180,y:-120},
   stars:[{x:-180,y:60},{x:60,y:60},{x:60,y:-120},{x:-60,y:-120}], collectFrom:'key',
   program:() => [hatKey('right', cx(10))],
   learn:'Sumar va a la derecha o arriba; restar, a la izquierda o abajo.',
   extra:'Funciona, pero fijate: arranca con un saltito, se traba cuando cambiás de flecha y no puede ir en diagonal.'},
  {id:'p1-siempre', name:'Por siempre', short:'Por siempre',
   intro:{title:'¿Qué es “por siempre”?',
     text:'“Por siempre” repite lo que tiene adentro una y otra vez, sin parar: 30 veces por segundo. Es como una calesita: da vueltas y vueltas hasta que alguien la apaga.',
     example:() => [hatFlag(fe(cx(10)))],
     note:'Este programa suma 10 a x… y otra vez… y otra vez. El bichito camina solo, sin que toques nada.'},
   goal:'Con un solo clic en la banderita, hacé que el bichito camine solo hasta la estrella. Usá “por siempre”.',
   palette:['flag','forever','cx'], axes:true, start:{x:-180,y:0}, stars:[{x:150,y:0}], collectFrom:'flag', resetOnFlag:true, selStart:true,
   program:() => [hatFlag(cx(10))], foreverHint:true,
   learn:'“Por siempre” repite sin parar. El bichito camina solo… ¡y no frena nunca! Para frenarlo está el botón Parar.',
   extra:'Pero en un juego el personaje camina cuando vos querés. Para eso le vamos a hacer una pregunta.'},
  {id:'p1-pregunta', name:'La pregunta', short:'La pregunta',
   intro:{title:'¿Qué es “si … entonces”?',
     text:'“Si” hace una pregunta que se contesta con sí o con no. Si la respuesta es sí, hace lo que tiene adentro. Si es no, no hace nada. Como en la esquina: si el semáforo está en rojo, entonces frenás.',
     example:() => [hatFlag(fe(iff(kp('right'), cx(10))))],
     note:'La pregunta celeste es “¿tecla flecha derecha presionada?”. Como está adentro del “por siempre”, se pregunta todo el tiempo: si apretás, avanza; si soltás, se queda quieto.'},
   goal:'Ahora camina sin parar y se pasa. Hacé que camine solo mientras apretás la flecha derecha, y dejalo quieto un ratito arriba de la estrella.',
   palette:['if','keyp','cx'], axes:true, start:{x:-180,y:0}, stars:[{x:60,y:0}], holdStar:true, collectFrom:'flag', resetOnFlag:true, selInside:true,
   program:() => [hatFlag(fe(cx(10)))],
   learn:'La pregunta “¿tecla presionada?” se contesta sí o no. Adentro del “por siempre” se pregunta todo el tiempo: apretás y camina, soltás y frena.',
   extra:'Ahora fijate qué pasa si te olvidás del “por siempre”.'},
  {id:7, name:'Preguntar todo el tiempo', intro:{title:'Una sola vez o todo el tiempo', text:'“Si” pregunta una sola vez, en el momento en que corre. Para que pregunte todo el tiempo, tiene que estar adentro de un “por siempre”.', example:() => [hatFlag(fe(iff(kp('right'), cx(10))))]}, goal:'Apretá la banderita y después la flecha derecha. ¿No pasa nada? Arreglalo y llegá a la estrella.',
   palette:['flag','forever','if','keyp','cx'], axes:true, start:{x:-180,y:0}, stars:[{x:150,y:0}], collectFrom:'flag', selStart:true,
   program:() => [hatFlag(iff(kp('right'), cx(10)))],
   learn:'El “si” pregunta una sola vez. Con “por siempre” pregunta todo el tiempo: 30 veces por segundo.'},
  {id:8, name:'Entre las piedras', intro:{title:'Dos flechas a la vez', text:'Con “por siempre + si”, cada flecha se pregunta por separado, todo el tiempo. Por eso podés apretar dos a la vez y moverte en diagonal.'}, goal:'Armá las cuatro flechas con “por siempre” y “si”. Pasá en diagonal entre las piedras sin tocarlas.',
   palette:['flag','forever','if','keyp','cx','cy'], axes:true, start:{x:-190,y:-150}, rocks:rocksDiagonal(),
   stars:[{x:-120,y:-80},{x:-40,y:0},{x:40,y:80},{x:110,y:150}], collectFrom:'flag',
   program:() => [hatFlag(fe(iff(kp('right'), cx(10))))],
   learn:'Así se mueven los personajes de los juegos de verdad: suave, sin trabarse y en diagonal.'},
  {id:'p1-wasd', name:'Otras teclas: W A S D', short:'W A S D',
   intro:{title:'Las teclas W A S D',
     text:'Muchos juegos de compu se manejan con W A S D: W es arriba, A es izquierda, S es abajo y D es derecha. Están juntas como las flechas, y así la otra mano queda libre para el mouse.',
     example:() => [hatFlag(fe(iff(kp('d'), cx(10)), iff(kp('a'), cx(-10)), iff(kp('w'), cy(10)), iff(kp('s'), cy(-10))))],
     note:'Es el mismo programa de siempre: lo único que cambia es qué tecla pregunta cada “si”.'},
   goal:'Cambiá las teclas del programa para manejar al bichito con W A S D. Juntá las estrellas solo con esas letras.',
   palette:['keyp'], axes:true, start:{x:0,y:0}, pad:'wasd', needWasd:true,
   stars:[{x:-150,y:110},{x:130,y:120},{x:160,y:-110},{x:-90,y:-120}], collectFrom:'flag',
   program:() => CIERRE_B(),
   learn:'El programa no sabe de flechas ni de letras: pregunta por la tecla que vos le digas. Cambiás la tecla y cambia el control.',
   extra:'¿Y si alguien quiere jugar con las flechas y otro con W A S D? Para eso existe “o”.'},
  {id:'p1-o', name:'Una u otra: el bloque “o”', short:'El bloque “o”',
   intro:{title:'¿Qué es “o”?',
     text:'“o” junta dos preguntas en una. La respuesta es sí cuando cualquiera de las dos es sí. Como cuando decís: si llueve o hace frío, me pongo campera. Alcanza con una de las dos.',
     example:() => [hatFlag(fe(iff(orB(kp('right'), kp('d')), cx(10))))],
     note:'Si está apretada la flecha derecha o la D, el bichito va a la derecha. Lo encontrás en Operadores, de color verde.'},
   goal:'Que se mueva con las flechas y también con W A S D. Tocá una pregunta celeste y después el bloque “o”. Juntá estrellas usando las dos formas.',
   palette:['or','keyp'], axes:true, start:{x:0,y:0}, padToggle:true, needBoth:true,
   stars:[{x:-160,y:100},{x:150,y:110},{x:150,y:-120},{x:-130,y:-110},{x:0,y:140}], collectFrom:'flag',
   program:() => CIERRE_B(),
   check:R => {
     if (!starsDone()) return false;
     if (!R.movedArrow) return 'Juntaste todo con W A S D. ¡Probalo también con las flechas! Apretá la banderita y otra vez.';
     if (!R.movedWasd) return 'Juntaste todo con las flechas. ¡Probalo también con W A S D! Apretá la banderita y otra vez.';
     return true;
   },
   learn:'“o” responde sí cuando alguna de las dos preguntas es sí. Por eso ahora se maneja con flechas o con W A S D, como prefieras.'},
  {id:9, name:'Cierre: ¿cuál se mueve mejor?', short:'Cierre', mode:'cierre', goal:'Apretá la banderita y manejá con las flechas. Los dos reciben las mismas teclas. Después respondé.',
   palette:[], stars:[{x:150,y:130,owner:0},{x:150,y:-50,owner:1}],
   demo:() => [
     {x:-190, y:60, color:'#E8553F', label:'A · eventos de tecla', program:CIERRE_A(), bounds:{x0:-224, x1:224, y0:16, y1:164}},
     {x:-190, y:-120, color:'#7A4DD8', label:'B · por siempre + si', program:CIERRE_B(), bounds:{x0:-224, x1:224, y0:-164, y1:-16}},
   ],
   quiz:[
     {q:'¿Por qué el B se mueve mejor?', opts:[
       ['Porque pregunta todo el tiempo si la tecla está apretada.', true, 'Exacto. El B pregunta 30 veces por segundo, así que no espera al teclado y puede atender dos flechas a la vez.'],
       ['Porque es de otro color.', false],
       ['Porque la banderita lo hace más rápido.', false]]},
     {q:'¿Para qué sirve entonces “mover pasos”?', opts:[
       ['Para nada, mejor no usarlo.', false],
       ['Para cuando el personaje gira y avanza hacia donde mira, como un autito.', true, '¡Sí! “Mover pasos” avanza hacia donde mira el personaje. Eso lo vamos a usar cuando aprendamos a girar.'],
       ['Para ir siempre para arriba.', false]]},
   ],
   learn:'“Al presionar tecla” espera a que el teclado repita. “Por siempre + si” pregunta todo el tiempo, por eso es suave y va en diagonal.',
   extra:'En Scratch vas a encontrar estos bloques con los mismos colores: Eventos amarillo, Movimiento azul, Control naranja y Sensores celeste.'},
];

export const FREE1 = {id:'libre1', name:'Modo libre', short:'Libre', mode:'free', intro:{title:'Modo libre', text:'Podés usar todos los bloques. Probá armar el movimiento con “por siempre + si”.'}, goal:'Armá tu programa con todos los bloques y juntá las estrellas.',
  palette:['flag','key','move','cx','cy','forever','if','keyp'], axes:true, start:{x:0,y:0}, stars:[], program:() => []};

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
export const PARTE = {rasgos:{avisarDetuvoAntes:true}, name:'Movimiento', desc:'Eventos, x e y, por siempre + si', levels:LEVELS1, free:FREE1,
   tag:'De la banderita a moverse suave y en diagonal.',
   teach:[
     ['La clase', '<p>Núcleo en 4.º y 5.º. Sirve en 3.º con ayuda y en 6.º y 7.º como repaso antes de Scratch. Una clase de 40 a 60 minutos. Se juega con las flechas del teclado o con el pad en pantalla.</p><p>Diseño Curricular CABA, Tecnologías, Diseño y Programación: eventos que inician acciones, estructuras de control, entrada y salida.</p>'],
     ['Antes, sin pantalla', '<ol><li>“Cuando digo YA, das 3 pasos.” (bandera)</li><li>“Cada vez que levanto la mano derecha, un paso a la derecha.” (tecla)</li><li>“Mirame todo el tiempo: si tengo la mano arriba, avanzás.” (por siempre + si)</li></ol>'],
     ['Preguntas de cierre', '<ul><li>¿Qué diferencia hay entre “al presionar tecla” y “si tecla presionada”?</li><li>¿Qué cambia en x y qué cambia en y?</li><li>¿Dónde vas a encontrar cada bloque en Scratch?</li></ul>'],
   ]};
