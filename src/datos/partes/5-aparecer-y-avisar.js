import { BUG, WASPH } from '../personajes.js';
import { MOVE_S, MOVEW_S, PATROL } from '../programas.js';
import { R_ } from '../fondos.js';
import { andB, chV, fe, gotoB, hatFlag, hatKey, hatMsg, hideB, iff, kp, rndB, sendB, setV, showB, toO, waitB } from '../../motor/bloques.js';
import { condTargets, ruleIn, starsDone, vars } from '../../motor/reglas.js';

/* Un pasillo angosto: la avispa patrulla adentro y no se la puede esquivar. */
const PASILLO = [R_(-240,40,240,180,'wall'), R_(-240,-180,240,-40,'wall')];

export const LEVELS5 = [
  {id:'p5-aplasta', name:'¡Atrapala!', short:'Atrapala',
   intro:{title:'Esconder',
     text:'“Esconder” (Apariencia, violeta) hace que un personaje desaparezca del escenario. No se borra: sigue ahí, con sus programas, pero no se ve y no lo podés tocar.',
     example:() => [hatFlag(fe(iff(toO('Bichito'), hideB())))], note:'Este programa va en la avispa: si la toca el bichito, se esconde y vuelve a su panal.'},
   goal:'Tocá la pestaña de la avispa. En su programa vacío: si ¿tocando Bichito? → esconder. Después andá a atraparla.',
   palette:['if','toucho','hide'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1,
   sprites:[BUG(-190,-140, () => [MOVE_S()]), WASPH('Avispa', -100, 0, () => [PATROL(3), hatFlag(fe())])],
   check:R => R.waspHid && ruleIn('Avispa', b => b.type === 'if' && condTargets(b.cond).includes('Bichito') && b.body.some(x => x.type === 'hide')),
   learn:'“Esconder” hace desaparecer a un personaje. Sigue existiendo, pero no se ve ni se puede tocar.',
   extra:'Apretá la banderita otra vez… ¿la avispa vuelve a aparecer?'},
  {id:'p5-mostrar', name:'Volver a aparecer', short:'Mostrar',
   intro:{title:'Mostrar al empezar',
     text:'Un personaje escondido se queda escondido, aunque apretes la banderita de nuevo. Por eso, al empezar, los juegos lo muestran: “mostrar”. Es como “dar a puntos el valor 0”: preparar todo para empezar.',
     example:() => [hatFlag(showB(), fe(iff(toO('Bichito'), hideB())))], note:'Primero se muestra, y después espera a que la atrapes.'},
   goal:'La avispa quedó escondida de la vez anterior (la ves transparente). Hacé que al empezar se muestre: poné “mostrar” arriba del “por siempre”. Después atrapala.',
   palette:['show'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1, selStart:true, showGhost:true,
   sprites:[BUG(-190,-140, () => [MOVE_S()]), WASPH('Avispa', -100, 0, () => [PATROL(3), hatFlag(fe(iff(toO('Bichito'), hideB())))], true)],
   check:R => R.waspShown && R.waspHid,
   learn:'Al empezar, todo se prepara: los personajes se muestran y las variables vuelven a 0.'},
  {id:'p5-tecla', name:'La tecla espacio', short:'Tecla espacio',
   intro:{title:'La tecla espacio',
     text:'La tecla espacio es la barra larga del teclado. Se usa como las flechas: “al presionar tecla espacio” arranca un programa cada vez que la apretás. En el celular está el botón “espacio”.',
     example:() => [hatKey('space', hideB(), waitB(1), showB())], note:'Al apretar espacio, el bichito se esconde un segundo y vuelve a aparecer. Escondido, la avispa no lo puede tocar.'},
   goal:'La avispa cuida el pasillo. Armá en el bichito: al presionar tecla espacio → esconder → esperar 1 → mostrar. Escondete cuando pasa y llegá a la estrella.',
   palette:['key','hide','wait','show'], defaultKey:'space', spaceBtn:true, resetOnFlag:true, start:{x:-200,y:0}, map:PASILLO, stars:[{x:200,y:0}],
   sprites:[BUG(-200,0, () => [MOVEW_S(), Object.assign(hatFlag(fe(iff(toO('Avispa'), gotoB(-200, 0)))), {fold:'si me toca la avispa, vuelvo al inicio'})]),
     WASPH('Avispa', 60, 0, () => [PATROL(4)])],
   check:R => starsDone(),
   learn:'La tecla espacio es un evento, igual que las flechas. Escondido, nadie te puede tocar.'},
  {id:'p5-espacio', name:'Atrapar con espacio', short:'El bloque “y”',
   intro:{title:'El bloque “y”',
     text:'“y” (Operadores, verde) junta dos preguntas, pero las dos tienen que ser sí. ¿Me toca el bichito Y está apretado el espacio? Si falta una, la respuesta es no. Es lo contrario de “o”, donde alcanza con una.',
     example:() => [hatFlag(showB(), fe(iff(andB(toO('Bichito'), kp('space')), hideB())))], note:'Solo se esconde si la tocás mientras apretás espacio.'},
   goal:'Ahora la avispa solo se va si la tocás Y apretás espacio. En la avispa: tocá la pregunta “¿tocando Bichito?” y después el bloque “y”; en el otro hueco va “¿tecla espacio presionada?”.',
   palette:['and','keyp'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1, defaultKey:'space', spaceBtn:true,
   sprites:[BUG(-190,-140, () => [MOVE_S()]), WASPH('Avispa', -100, 0, () => [PATROL(3), hatFlag(showB(), fe(iff(toO('Bichito'), hideB())))])],
   check:R => {
     if (R.hidSinEspacio) return 'Se escondió sin apretar espacio. Falta el “y”: ¿tocando Bichito? y ¿tecla espacio presionada? Arreglalo y apretá la banderita.';
     return !!R.hidWithSpace;
   },
   learn:'“y” necesita que las dos preguntas sean sí. “o” se conforma con una.'},
  {id:'p5-mensaje', name:'Avisale al bichito', short:'Mensajes',
   intro:{title:'Enviar y recibir',
     text:'Un personaje le puede avisar algo a los demás: “enviar atrapada”. El que quiera enterarse usa “al recibir atrapada”, y abajo pone lo que hace. Es como gritar “¡la atrapé!” para que el bichito sume un punto.',
     example:() => [hatMsg('atrapada', chV('puntos', 1))], note:'Este programa va en el bichito: cuando recibe “atrapada”, suma un punto. Los dos bloques son amarillos, de Eventos.'},
   goal:'Cuando la avispa se esconde, tiene que avisar. En la avispa: “enviar atrapada” adentro del “si”. En el bichito: “al recibir atrapada” → sumar a puntos 1. Atrapala 3 veces.',
   palette:['broadcast','whenmsg','changevar'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1, selInIf:true,
   vars:{puntos:0}, varNames:['puntos'],
   sprites:[BUG(-190,-140, () => [MOVE_S(), hatFlag(setV('puntos', 0))]),
     WASPH('Avispa', -100, 0, () => [PATROL(3), hatFlag(showB(), fe(iff(toO('Bichito'), hideB(), waitB(1), rndB(), showB())))])],
   check:R => vars().puntos >= 3,
   learn:'“Enviar” avisa a todos los personajes. El que tiene “al recibir” ese mensaje, hace lo que tiene abajo.'},
  {id:'p5-meaviso', name:'Me aviso a mí también', short:'Me aviso',
   intro:{title:'El mensaje le llega a todos',
     text:'Un mensaje le llega a todos los objetos, también al que lo envió. Así, la avispa puede avisar “atrapada” y ella misma, al recibirlo, volver a aparecer en otro lugar.',
     example:() => [hatMsg('atrapada', waitB(1), rndB(), showB())], note:'Va en la avispa: espera un segundo, salta a otro lugar y se muestra.'},
   goal:'La avispa se esconde y no vuelve más. En la avispa: al recibir atrapada → esperar 1 → ir a posición aleatoria → mostrar. Atrapala 3 veces.',
   palette:['whenmsg','wait','gorandom','show'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1,
   vars:{puntos:0}, varNames:['puntos'],
   sprites:[BUG(-190,-140, () => [MOVE_S(), Object.assign(hatFlag(setV('puntos', 0)), {fold:'puntos en 0'}), Object.assign(hatMsg('atrapada', chV('puntos', 1)), {fold:'al recibir atrapada: sumo un punto'})]),
     WASPH('Avispa', -100, 0, () => [PATROL(3), hatFlag(showB(), fe(iff(toO('Bichito'), hideB(), sendB('atrapada'))))])],
   check:R => vars().puntos >= 3,
   avisoEscondida:'La avispa se escondió y no vuelve. En la avispa: al recibir atrapada → esperar 1 → ir a posición aleatoria → mostrar.',
   learn:'Un mensaje le llega a todos, también al que lo envía. Cada objeto decide qué hace cuando lo recibe.'},
  {id:'p5-cierre-avisar', name:'Cierre: aparecer y avisar', short:'Cierre', mode:'cierre', goal:'Mirá los programas de cada personaje y respondé.',
   palette:[], stars:[], start:{x:-190,y:-140}, resetOnFlag:true, vars:{puntos:0},
   sprites:[BUG(-190,-140, () => [MOVE_S(), hatFlag(setV('puntos', 0)), hatMsg('atrapada', chV('puntos', 1))]),
     WASPH('Avispa', -100, 0, () => [PATROL(3), hatFlag(showB(), fe(iff(andB(toO('Bichito'), kp('space')), hideB(), sendB('atrapada')))), hatMsg('atrapada', waitB(1), rndB(), showB())])],
   quiz:[
     {q:'¿Qué pasa con un personaje escondido?', opts:[
       ['Se borra para siempre.', false],
       ['Sigue ahí con sus programas, pero no se ve y no se puede tocar.', true, 'Exacto. Por eso al empezar se usa “mostrar”.'],
       ['Se va a otro nivel.', false]]},
     {q:'¿Cuándo contesta sí “¿tocando Bichito? y ¿tecla espacio presionada?”?', opts:[
       ['Cuando pasa una de las dos.', false],
       ['Cuando pasan las dos a la vez.', true, '¡Sí! Con “y” tienen que ser sí las dos. Con “o” alcanza con una.'],
       ['Nunca.', false]]},
     {q:'La avispa envía “atrapada”. ¿Quién lo recibe?', opts:[
       ['Solo el bichito.', false],
       ['Todos los objetos que tengan “al recibir atrapada”, también la avispa.', true, 'Exacto. Un mensaje le llega a todos.'],
       ['Nadie.', false]]},
   ],
   learn:'Esconder, mostrar, “y” y mensajes: los personajes aparecen, desaparecen y se avisan cosas.',
   extra:'Lo que viene: semillas que vuelan y copias de objetos, los clones.'},
];

export const FREE5 = {id:'libre5', name:'Modo libre', short:'Libre', mode:'free', intro:{title:'Modo libre', text:'Armá un juego de atrapar: avispas que aparecen y se esconden, mensajes y puntos.'},
  goal:'Armá tu juego de atrapar avispas.', vars:{puntos:0}, varNames:['puntos'], allowCreateVar:true, defaultKey:'space', spaceBtn:true, msgs:['atrapada','ganaste'],
  palette:['flag','key','whenmsg','broadcast','forever','if','toucho','keyp','and','or','eq','move','bounce','gorandom','hide','show','say','wait','stop','setvar','changevar'],
  resetOnFlag:true, start:{x:-190,y:-140}, stars:[],
  sprites:[BUG(-190,-140, () => [MOVE_S(), hatMsg('atrapada', chV('puntos', 1))]),
    WASPH('Avispa', -150, 120, () => [PATROL(3), hatFlag(showB(), fe(iff(toO('Bichito'), hideB(), sendB('atrapada'))))])]};

/* Ficha de la parte: ver el comentario de rasgos en 1-movimiento.js. */
export const PARTE = {rasgos:{avisarSiAfuera:true, seguirClones:true, portada:'avisar'}, name:'Aparecer y avisar', desc:'Esconder, mostrar, “y” y mensajes', levels:LEVELS5, free:FREE5,
   tag:'Los personajes aparecen, desaparecen y se avisan cosas.',
   teach:[
     ['La clase', '<p>Núcleo en 4.º y 5.º; también 6.º y 7.º. Una clase de 40 a 60 minutos. Se trabajan la apariencia (esconder y mostrar), preparar todo al empezar, la tecla espacio como evento, el operador “y” y la comunicación entre objetos con mensajes.</p><p>Diseño Curricular CABA, Tecnologías, Diseño y Programación (a verificar): eventos, condiciones compuestas y comunicación entre objetos que se ejecutan a la vez.</p>'],
     ['Antes, sin pantalla', '<ol><li>Un chico es la avispa: si alguien lo toca, se tapa los ojos y se agacha (esconder). Al empezar la ronda, se para (mostrar).</li><li>“Solo te vas si te toco Y digo ¡ya!” (y).</li><li>Cuando la avispa se agacha grita “¡atrapada!” y la maestra anota un punto (enviar y recibir).</li></ol>'],
     ['Preguntas de cierre', '<ul><li>¿Por qué hace falta “mostrar” al empezar?</li><li>¿Qué diferencia hay entre “y” y “o”?</li><li>¿Para qué sirve un mensaje si los dos personajes están en el mismo juego?</li></ul>'],
   ]};
