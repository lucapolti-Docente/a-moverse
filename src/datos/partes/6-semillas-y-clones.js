import { BURBUJA, BUG, COIN, NUBE, SEED, WASPH } from '../personajes.js';
import { HIT_S, LIFE_S, MOVE_S, OVER_S, PATROL, SEED_CLONE, SEED_FLY } from '../programas.js';
import { chV, cloneB, cy, delB, fe, gotoB, gotoO, hatClone, hatFlag, hatKey, hatMsg, hideB, iff, mv, pdirB, ptoB, rndB, sendB, setV, showB, toO, waitB } from '../../motor/bloques.js';
import { corrida, progOf, ruleIn, condTargets, scan, vars } from '../../motor/reglas.js';

export const LEVELS6 = [
  {id:'p5-vuela', name:'La semilla vuela', short:'Vuela',
   intro:{title:'Un objeto que viaja',
     text:'La semilla es otro objeto. Para que vuele, mira para arriba (dirección 0) y, por siempre, mueve pasos. Cuando llega arriba, toca el borde: ahí se esconde, como si se fuera del escenario.',
     example:() => [hatFlag(showB(), pdirB(0), fe(mv(15), iff(toO('borde'), hideB())))], note:'“¿Tocando borde?” está en el menú ▾ de “¿tocando?”.'},
   goal:'Tocá la pestaña de la semilla. Adentro del “por siempre”: mover 15 pasos, y si ¿tocando borde? → esconder. Apretá la banderita y mirala volar.',
   palette:['move','if','toucho','hide'], resetOnFlag:true, start:{x:0,y:-140}, stars:[], selSprite:1,
   sprites:[BUG(0,-140, () => [MOVE_S()]), Object.assign(SEED(0, -110, () => [hatFlag(showB(), gotoB(0, -110), pdirB(0), fe())]), {hidden:false})],
   check:R => {
     if (R.semillaArriba) return true;
     if (R.semillaPegada) return 'Llegó arriba, pero se queda pegada en el borde. Adentro del “por siempre”: si ¿tocando borde? → esconder.';
     return false;
   },
   learn:'Un objeto puede viajar solo: apunta, mueve pasos por siempre y se esconde al llegar al borde.'},
  {id:'p5-dedonde', name:'¿De dónde sale la semilla?', short:'¿De dónde sale?',
   intro:{title:'Ir a otro objeto',
     text:'Cualquier objeto puede escuchar una tecla: la semilla tiene su propio “al presionar tecla espacio”. Si solo se muestra, aparece donde quedó la última vez (arriba de todo) y se esconde enseguida. “Ir a Bichito” la lleva justo adonde está el bichito; recién ahí se muestra y sale volando.',
     example:() => [hatKey('space', gotoO('Bichito'), showB())], note:'“Ir a” está en Movimiento. En su menú ▾ elegís a qué objeto ir.'},
   goal:'Apretá espacio: la semilla aparece arriba y desaparece. Tocá la pestaña de la semilla y poné “ir a Bichito” arriba del “mostrar”. Tirá 3 semillas desde el bichito.',
   palette:['gotoobj'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:2, selStart:true, defaultKey:'space', spaceBtn:true,
   sprites:[BUG(-190,-140, () => [MOVE_S()]), WASPH('Avispa', -100, 120, () => [PATROL(3)]),
     SEED(0, 164, () => [Object.assign(SEED_FLY(), {fold:'al empezar: esconderse; por siempre: volar para arriba'}), hatKey('space', showB())])],
   check:R => (R.shotsFromBug || 0) >= 3,
   learn:'Antes de mostrarse, la semilla va adonde está el bichito. Si no, aparece donde quedó la última vez.'},
  {id:'p5-pego', name:'¡Le llegó!', short:'Le llegó',
   intro:{title:'¿Me tocó la semilla?',
     text:'Para que la avispa vuelva a su panal cuando le llega una semilla, la avispa pregunta: ¿tocando Semilla? Si sí, se esconde y avisa con un mensaje.',
     example:() => [HIT_S()], note:'Va en la avispa. El bichito ya sabe sumar un punto cuando recibe “atrapada”.'},
   goal:'La semilla ya vuela. En la avispa: si ¿tocando Semilla? → esconder → enviar atrapada. Tirale una semilla.',
   palette:['if','toucho','hide','broadcast'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1, defaultKey:'space', spaceBtn:true,
   vars:{puntos:0}, varNames:['puntos'],
   sprites:[BUG(-190,-140, () => [MOVE_S(), Object.assign(hatFlag(setV('puntos', 0)), {fold:'puntos en 0'}), Object.assign(hatMsg('atrapada', chV('puntos', 1)), {fold:'al recibir atrapada: sumo un punto'})]),
     WASPH('Avispa', -100, 110, () => [PATROL(2), hatFlag(showB(), fe())]),
     SEED(-190, -140, () => [Object.assign(SEED_FLY(), {fold:'al empezar: esconderse; por siempre: volar para arriba'}), Object.assign(hatKey('space', gotoO('Bichito'), showB()), {fold:'con espacio: salir desde el bichito'})])],
   check:R => {
     if (vars().puntos >= 1) return true;
     if (R.waspHid) return 'Se escondió, pero no avisó: el bichito no sumó el punto. Falta “enviar atrapada” adentro del “si”.';
     return false;
   },
   learn:'Ahora es la avispa la que pregunta si la tocó la semilla. Cada personaje se ocupa de lo suyo y se avisan con mensajes.'},
  {id:'p5-queclon', name:'¿Qué es un clon?', short:'¿Qué es un clon?',
   intro:{title:'Un clon es una copia',
     text:'“Crear clon de mí mismo” hace una copia del objeto, con sus mismos programas y su mismo dibujo. La copia no arranca con la banderita: arranca con “al comenzar como clon”. Y cuando ya no la necesitás, “eliminar este clon” la borra.',
     example:() => [hatKey('space', cloneB('mí mismo')), hatClone(rndB(), showB(), waitB(3), delB())], note:'Cada vez que apretás espacio aparece una moneda nueva en otro lugar. A los 3 segundos, esa copia se borra. Los tres bloques son naranjas, de Control.'},
   goal:'Tocá la pestaña de la moneda. Abajo de “al presionar tecla espacio” poné “crear clon de mí mismo”. Apretá espacio varias veces: ¡tené 5 monedas a la vez!',
   palette:['clone'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1, defaultKey:'space', spaceBtn:true,
   sprites:[BUG(-190,-140, () => [MOVE_S()]),
     Object.assign(COIN(0, 0, () => [Object.assign(hatFlag(hideB()), {fold:'al empezar: la moneda original se esconde'}), hatKey('space'), hatClone(rndB(), showB(), waitB(3), delB())]), {hidden:true})],
   check:R => (R.maxClones || 0) >= 5,
   learn:'Un clon es una copia con los mismos programas. Arranca en “al comenzar como clon” y se borra con “eliminar este clon”.',
   extra:'Ahora, lo mismo con las semillas: así se pueden tirar muchas a la vez.'},
  {id:'p5-clones', name:'Muchas semillas', short:'Muchas semillas',
   intro:{title:'Clones de otro objeto',
     text:'Con una sola semilla no podés tirar otra hasta que llegue arriba. Pero el bichito puede crear clones de la semilla: “crear clon de Semilla”. Cada clon arranca en “al comenzar como clon”: va al bichito, se muestra y vuela. Cuando toca el borde, se borra.',
     example:() => [hatClone(gotoO('Bichito'), showB(), fe(mv(15), iff(toO('borde'), delB())))], note:'Si no se eliminan, los clones se quedan amontonados arriba para siempre.'},
   goal:'En el bichito: abajo de “al presionar tecla espacio” poné “crear clon de Semilla”. En la semilla: si toca el borde → eliminar este clon. Tené 3 semillas volando a la vez.',
   palette:['clone','delclone'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], defaultKey:'space', spaceBtn:true, selInIf:true,
   sprites:[BUG(-190,-140, () => [MOVE_S(), hatKey('space')]), WASPH('Avispa', -100, 120, () => [PATROL(3)]),
     SEED(-190, -140, () => [Object.assign(hatFlag(hideB(), pdirB(0)), {fold:'al empezar: esconderse y mirar para arriba'}), hatClone(gotoO('Bichito'), showB(), fe(mv(15), iff(toO('borde'))))])],
   check:R => {
     if ((R.maxSeeds || 0) < 3) return false;
     if (!scan(progOf('Semilla'), b => b.type === 'delclone')) return '¡Tres semillas volando! Pero los clones se quedan amontonados arriba. En la semilla: si toca el borde → eliminar este clon.';
     return true;
   },
   learn:'“Crear clon de” puede copiar a otro objeto. Cada clon arranca en “al comenzar como clon” y se borra con “eliminar este clon”.'},
  {id:'p5-nacen', name:'Nubes que nacen solas', short:'Nacen solas',
   intro:{title:'Clones adentro de “por siempre”',
     text:'Si “crear clon” está adentro de un “por siempre” con una espera, el objeto hace una copia nueva cada tanto, sin que toques nada. Así bajan muchas nubes, una atrás de otra.',
     example:() => [hatFlag(hideB(), fe(waitB(1), cloneB('mí mismo')))], note:'La nube original se esconde y queda arriba; cada segundo nace un clon.'},
   goal:'Tocá la pestaña de la nube. Al final del “por siempre”, poné “crear clon de mí mismo”. Hacé que bajen 5 nubes.',
   palette:['clone'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1, defaultKey:'space',
   sprites:[BUG(-190,-140, () => [MOVE_S()]),
     NUBE(0, 164, () => [hatFlag(hideB(), fe(waitB(1), rndB(), cy(400))), Object.assign(hatClone(showB(), pdirB(180), fe(mv(3), iff(toO('borde'), delB()))), {fold:'soy una nube: me muestro, bajo y al llegar abajo me borro'})])],
   check:R => (R.nubes || 0) >= 5,
   avisoSinClones:'La nube se mueve arriba pero no crea copias. Poné “crear clon de mí mismo” adentro del “por siempre”.',
   learn:'Con “crear clon” adentro de un “por siempre”, los clones nacen solos, uno atrás de otro.'},
  {id:'p5-espada', name:'La burbuja', short:'Burbuja',
   intro:{title:'Una burbuja que aparece un ratito',
     text:'La burbuja es otro objeto, como la semilla. Pero no viaja: cuando apretás espacio va adonde está el bichito, se muestra un ratito y se vuelve a esconder. Atrapa lo que está cerca.',
     example:() => [hatKey('space', gotoO('Bichito'), showB(), waitB(0.3), hideB())], note:'Aparece, espera tres décimas de segundo y se esconde.'},
   goal:'Tocá la pestaña de la burbuja. Abajo de “al presionar tecla espacio”: ir a Bichito → mostrar → esperar 0.3 segundos → esconder. Atrapá a la avispa 2 veces.',
   palette:['gotoobj','show','wait','hide'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:2, defaultKey:'space', spaceBtn:true,
   vars:{puntos:0}, varNames:['puntos'],
   sprites:[BUG(-190,-140, () => [MOVE_S(), Object.assign(hatFlag(setV('puntos', 0)), {fold:'puntos en 0'}), Object.assign(hatMsg('atrapada', chV('puntos', 1)), {fold:'al recibir atrapada: sumo un punto'})]),
     WASPH('Avispa', -60, -60, () => [PATROL(2), Object.assign(hatFlag(showB(), fe(iff(toO('Burbuja'), hideB(), sendB('atrapada'), waitB(1), rndB(), showB()))), {fold:'si me toca la burbuja, me escondo, aviso y vuelvo'})]),
     BURBUJA(-190, -140, () => [hatKey('space')])],
   check:R => {
     if (vars().puntos < 2) return (R.swings || 0) >= 3 && !scan(progOf('Burbuja'), b => b.type === 'gotoobj') ? 'La burbuja aparece, pero lejos del bichito. Poné “ir a Bichito” antes de “mostrar”.' : false;
     if (!scan(progOf('Burbuja'), b => b.type === 'hide')) return 'La atrapaste, pero la burbuja se queda afuera. Escondela después de esperar un ratito.';
     return true;
   },
   learn:'La burbuja aparece un ratito al lado del bichito y se esconde. Solo atrapa lo que está cerca.'},
  {id:'p5-cerca', name:'Cerca, pero no tanto', short:'Cerca',
   intro:{title:'Atrapar antes de que te toque',
     text:'La avispa te persigue. Si te toca, perdés una vida. La burbuja llega un poco más lejos que tu cuerpo: si apretás espacio cuando la avispa está cerca, la atrapás antes de que te toque. Falta que la avispa sepa que la atraparon.',
     example:() => [hatFlag(fe(iff(toO('Burbuja'), hideB(), sendB('atrapada'))))], note:'La avispa también recibe “atrapada”: espera un segundo y vuelve a aparecer en otro lugar.'},
   goal:'La burbuja ya funciona. En la avispa, en el programa vacío: si ¿tocando Burbuja? → esconder → enviar atrapada. Atrapala 3 veces sin quedarte sin vidas.',
   palette:['if','toucho','hide','broadcast'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1, defaultKey:'space', spaceBtn:true,
   vars:{puntos:0, vidas:3}, varNames:['puntos','vidas'],
   sprites:[BUG(-190,-140, () => [MOVE_S(), LIFE_S({wait:true}), Object.assign(hatFlag(setV('puntos', 0)), {fold:'puntos en 0'}), Object.assign(hatMsg('atrapada', chV('puntos', 1)), {fold:'al recibir atrapada: sumo un punto'}), OVER_S()]),
     WASPH('Avispa', 150, 120, () => [Object.assign(hatFlag(showB(), waitB(1), fe(ptoB('Bichito'), mv(2))), {fold:'te persigo'}), hatMsg('atrapada', waitB(1), rndB(), showB()), hatFlag(fe())]),
     BURBUJA(-190, -140, () => [Object.assign(hatKey('space', gotoO('Bichito'), showB(), waitB(0.3), hideB()), {fold:'con espacio: burbuja rápida'})])],
   check:R => {
     if (vars().puntos < 3) return false;
     if (vars().vidas <= 0) return 'Llegaste a 3, pero sin vidas. ¡Probá otra vez!';
     return true;
   },
   learn:'Con la burbuja hay que esperar a que la avispa esté cerca, pero atraparla antes de que te toque.'},
  {id:'p5-cierre-clones', name:'Cierre: semillas y clones', short:'Cierre', mode:'cierre', goal:'Mirá los programas de cada personaje y respondé.',
   palette:[], stars:[], start:{x:-190,y:-140}, resetOnFlag:true,
   sprites:[BUG(-190,-140, () => [MOVE_S(), hatKey('space', cloneB('Semilla'))]), WASPH('Avispa', -100, 120, () => [PATROL(3), HIT_S()]),
     SEED(-190, -140, () => SEED_CLONE())],
   quiz:[
     {q:'¿Por qué la semilla hace “ir a Bichito” antes de “mostrar”?', opts:[
       ['Para salir desde donde está el bichito.', true, 'Exacto. Si no, aparece donde quedó la última vez.'],
       ['Para ir más rápido.', false],
       ['Para esconderse.', false]]},
     {q:'¿Qué es un clon?', opts:[
       ['Un objeto nuevo sin programas.', false],
       ['Una copia del objeto, con sus mismos programas, que arranca en “al comenzar como clon”.', true, '¡Sí! Y se borra con “eliminar este clon”.'],
       ['Otro nombre de la semilla.', false]]},
     {q:'¿Qué pasa si los clones nunca se eliminan?', opts:[
       ['Se quedan amontonados y llenan el escenario.', true, 'Exacto. Por eso cada clon se borra cuando ya no sirve.'],
       ['Desaparecen solos.', false],
       ['Nada.', false]]},
   ],
   learn:'Objetos que viajan, copias que nacen y se borran: así se arman las semillas, las nubes y la burbuja.',
   extra:'Lo que viene: juntar semillas, comparar números y un juego completo.'},
];

export const FREE6 = {id:'libre-semillas', name:'Modo libre', short:'Libre', mode:'free', intro:{title:'Modo libre', text:'Armá tu juego de semillas: clones que vuelan, avispas que vuelven a su panal, mensajes y puntos.'},
  goal:'Armá tu juego de semillas.', vars:{puntos:0}, varNames:['puntos'], allowCreateVar:true, defaultKey:'space', spaceBtn:true, msgs:['atrapada','ganaste'],
  palette:['flag','key','whenmsg','whenclone','broadcast','forever','if','toucho','keyp','and','or','eq','move','bounce','pointdir','gotoobj','gorandom','hide','show','say','wait','clone','delclone','stop','setvar','changevar'],
  resetOnFlag:true, start:{x:-190,y:-140}, stars:[],
  sprites:[BUG(-190,-140, () => [MOVE_S(), hatKey('space', cloneB('Semilla')), hatMsg('atrapada', chV('puntos', 1))]),
    WASPH('Avispa', -150, 120, () => [PATROL(3), HIT_S()]), SEED(-190, -140, () => SEED_CLONE())]};

/* Ficha de la parte: ver el comentario de rasgos en 1-movimiento.js. */
export const PARTE = {rasgos:{avisarSiAfuera:true, puntosAlDetener:true, seguirClones:true, portada:'semillas'}, name:'Semillas y clones', desc:'Objetos que viajan, ir a otro objeto y clones', levels:LEVELS6, free:FREE6,
   tag:'Semillas que vuelan, copias que nacen y una burbuja.',
   teach:[
     ['La clase', '<p>Núcleo en 5.º; también 6.º y 7.º. En 4.º, con ayuda o como desafío. Una clase de 40 a 60 minutos. Se trabajan objetos que viajan (“mover” por siempre y esconderse en el borde), “ir a” otro objeto, y clones: copias con los mismos programas que se crean y se borran.</p><p>Diseño Curricular CABA, Tecnologías, Diseño y Programación (a verificar): objetos que se crean y se eliminan durante la ejecución; reutilizar un programa en muchas copias.</p>'],
     ['Antes, sin pantalla', '<ol><li>Una pelota de papel es la semilla: sale de la mano del bichito, vuela hasta la pared y “se esconde” (se guarda).</li><li>Fotocopias del mismo dibujo: cada copia es un clon, igual al original. Cuando ya no sirve, se tira al reciclaje (eliminar este clon).</li><li>Una burbuja de jabón solo atrapa lo que está cerca.</li></ol>'],
     ['Preguntas de cierre', '<ul><li>¿Qué tiene que hacer la semilla antes de mostrarse?</li><li>¿Qué tiene un clon del objeto original?</li><li>¿Por qué hay que borrar los clones?</li></ul>'],
   ]};
