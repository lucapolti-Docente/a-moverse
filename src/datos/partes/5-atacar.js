import { R_ } from '../fondos.js';
import { BAG, BUG, COIN, SEED, SHIP, SWORD, WASPH } from '../personajes.js';
import { HIT_S, LIFE_S, MOVE_S, OVER_S, PATROL, SEED_CLONE, SEED_FLY } from '../programas.js';
import { andB, chV, cloneB, cx, cy, delB, eqB, fe, gotoO, gtB, hatClone, hatFlag, hatKey, hatMsg, hideB, iff, kp, ltB, mv, pdirB, ptoB, rndB, sayB, sendB, setV, showB, stopB, tc, toO, waitB } from '../../motor/bloques.js';
import { andHas, condTargets, corrida, progOf, ruleIn, scan, vars } from '../../motor/reglas.js';
import { registrarRecord } from '../../guardado.js';

export const LEVELS5 = [
  {id:'p5-aplasta', name:'¡Aplastala!', short:'Aplastala',
   intro:{title:'Esconder',
     text:'“Esconder” hace que un personaje desaparezca del escenario. No se borra: sigue ahí, con sus programas, pero no se ve y no lo podés tocar. Es la forma más simple de que un enemigo “desaparezca”.',
     example:() => [hatFlag(fe(iff(toO('Bichito'), hideB())))], note:'Este programa va en la avispa: si la toca el Bichito, se esconde.'},
   goal:'Tocá la pestaña de la avispa. En su programa vacío: si ¿tocando Bichito? → esconder. Después andá a aplastarla.',
   palette:['if','toucho','hide'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1,
   sprites:[BUG(-190,-140, () => [MOVE_S()]), WASPH('Avispa', -100, 0, () => [PATROL(3), hatFlag(fe())])],
   check:R => R.waspHid && ruleIn('Avispa', b => b.type === 'if' && condTargets(b.cond).includes('Bichito') && b.body.some(x => x.type === 'hide')),
   learn:'“Esconder” hace desaparecer a un personaje. Sigue existiendo, pero no se ve ni se puede tocar.',
   extra:'Apretá la banderita otra vez… ¿la avispa vuelve a aparecer?'},
  {id:'p5-mostrar', name:'Volver a aparecer', short:'Mostrar',
   intro:{title:'Mostrar al empezar',
     text:'Un personaje escondido se queda escondido, aunque apretes la banderita de nuevo. Por eso, al empezar, los juegos lo muestran: “mostrar”. Es lo mismo que “dar a puntos el valor 0”: preparar todo para empezar.',
     example:() => [hatFlag(showB(), fe(iff(toO('Bichito'), hideB())))], note:'Primero se muestra, y después espera a que la aplasten.'},
   goal:'La avispa quedó escondida de la vez anterior (la ves transparente). Hacé que al empezar se muestre: poné “mostrar” arriba del “por siempre”. Después aplastala.',
   palette:['show'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1, selStart:true, showGhost:true,
   sprites:[BUG(-190,-140, () => [MOVE_S()]), WASPH('Avispa', -100, 0, () => [PATROL(3), hatFlag(fe(iff(toO('Bichito'), hideB())))], true)],
   check:R => R.waspShown && R.waspHid,
   learn:'Al empezar, todo se prepara: los personajes se muestran y las variables vuelven a 0.'},
  {id:'p5-espacio', name:'Con la tecla espacio', short:'Espacio',
   intro:{title:'El bloque “y”',
     text:'“y” junta dos preguntas, pero las dos tienen que ser sí. ¿Me toca el bichito Y está apretado el espacio? Si falta una, la respuesta es no. Es lo contrario de “o”, donde alcanza con una.',
     example:() => [hatFlag(showB(), fe(iff(andB(toO('Bichito'), kp('space')), hideB())))], note:'Solo se esconde si la tocás mientras apretás espacio.'},
   goal:'Ahora la avispa solo cae si la tocás Y apretás espacio. En la avispa: tocá la pregunta “¿tocando Bichito?” y después el bloque “y”; en el otro hueco va “¿tecla espacio presionada?”.',
   palette:['and','keyp'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1, defaultKey:'space', spaceBtn:true,
   sprites:[BUG(-190,-140, () => [MOVE_S()]), WASPH('Avispa', -100, 0, () => [PATROL(3), hatFlag(showB(), fe(iff(toO('Bichito'), hideB())))])],
   check:R => {
     if (!R.waspHid) return false;
     const ok = ruleIn('Avispa', b => b.type === 'if' && andHas(b.cond, x => x.type === 'keyp' && x.key === 'space') && condTargets(b.cond).includes('Bichito'));
     if (!ok || !R.hidWithSpace) return 'Se escondió sin apretar espacio. La pregunta tiene que ser: ¿tocando Bichito? y ¿tecla espacio presionada?';
     return true;
   },
   learn:'“y” necesita que las dos preguntas sean sí. “o” se conforma con una.'},
  {id:'p5-mensaje', name:'Avisale al bichito', short:'Mensajes',
   intro:{title:'Enviar un mensaje',
     text:'Un personaje le puede avisar algo a los demás: “enviar mensaje atrapada”. El que quiera enterarse usa “al recibir atrapada”, y ahí abajo hace lo suyo. Es como gritar “¡la atrapé!” para que el bichito sume un punto.',
     example:() => [hatMsg('atrapada', chV('puntos', 1))], note:'Este programa va en el bichito: cuando recibe el mensaje “atrapada”, suma un punto.'},
   goal:'Cuando la avispa cae, tiene que avisar. En la avispa: “enviar mensaje atrapada” adentro del “si”. En el bichito: “sumar a puntos 1” abajo de “al recibir atrapada”. Atrapala 3 veces.',
   palette:['broadcast','changevar'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1, selInIf:true, defaultKey:'space', spaceBtn:true,
   vars:{puntos:0}, varNames:['puntos'],
   sprites:[BUG(-190,-140, () => [MOVE_S(), hatFlag(setV('puntos', 0)), hatMsg('atrapada')]),
     WASPH('Avispa', -100, 0, () => [PATROL(3), hatFlag(showB(), fe(iff(andB(toO('Bichito'), kp('space')), hideB(), waitB(1), rndB(), showB())))])],
   check:R => {
     if (vars().puntos < 3) return false;
     return scan(progOf('Avispa'), b => b.type === 'broadcast') && progOf('Bichito').some(sc => sc.hat === 'msg' && sc.body.some(x => x.type === 'changevar'));
   },
   learn:'“Enviar mensaje” avisa a todos los personajes. El que tiene “al recibir” ese mensaje, hace lo que tiene abajo.'},
  {id:'p5-dedonde', name:'¿De dónde sale la semilla?', short:'¿De dónde sale?',
   intro:{title:'La semilla tiene que ir al bichito',
     text:'La semilla es otro objeto: está escondida y vuela para arriba. Si solo la mostrás, aparece donde había quedado la última vez (arriba de todo) y se vuelve a esconder enseguida. Para que salga desde el bichito, primero tiene que ir adonde está él: “ir a Bichito”, y después “mostrar”.',
     example:() => [hatKey('space', gotoO('Bichito'), showB())], note:'“Ir a Bichito” la pone justo donde está el bichito. Recién ahí se muestra y sale volando.'},
   goal:'Apretá espacio: la semilla aparece arriba y desaparece, porque sale de donde había quedado. Tocá la pestaña de la semilla y poné “ir a Bichito” arriba del “mostrar”. Disparala 3 veces desde el bichito.',
   palette:['gotoobj'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:2, selStart:true, defaultKey:'space', spaceBtn:true,
   sprites:[BUG(-190,-140, () => [MOVE_S()]), WASPH('Avispa', -100, 120, () => [PATROL(3)]),
     SEED(0, 164, () => [Object.assign(SEED_FLY(), {fold:'al empezar: esconderse; por siempre: volar para arriba'}), hatKey('space', showB())])],
   check:R => (R.shotsFromBug || 0) >= 3,
   learn:'Antes de mostrarse, la semilla va adonde está el bichito. Si no, aparece donde quedó la última vez.'},
  {id:'p5-pego', name:'¡Le pegó!', short:'Le pegó',
   intro:{title:'¿Me tocó la semilla?',
     text:'Para que la avispa caiga cuando le pega la semilla, la avispa pregunta: ¿tocando Semilla? Si sí, se esconde y avisa con un mensaje.',
     example:() => [HIT_S()], note:'Va en la avispa. El bichito ya sabe sumar un punto cuando recibe “atrapada”.'},
   goal:'La semilla ya vuela. En la avispa: si ¿tocando Semilla? → esconder → enviar mensaje atrapada. Pegale una vez.',
   palette:['if','toucho','hide','broadcast'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1, defaultKey:'space', spaceBtn:true,
   vars:{puntos:0}, varNames:['puntos'],
   sprites:[BUG(-190,-140, () => [MOVE_S(), Object.assign(hatFlag(setV('puntos', 0)), {fold:'puntos en 0'}), Object.assign(hatMsg('atrapada', chV('puntos', 1)), {fold:'sumo un punto'})]),
     WASPH('Avispa', -100, 110, () => [PATROL(2), hatFlag(showB(), fe())]),
     SEED(-190, -140, () => [Object.assign(SEED_FLY(), {fold:'al empezar: esconderse; por siempre: volar para arriba'}), Object.assign(hatKey('space', gotoO('Bichito'), showB()), {fold:'con espacio: salir desde el bichito'})])],
   check:R => vars().puntos >= 1 && ruleIn('Avispa', b => b.type === 'if' && condTargets(b.cond).includes('Semilla') && b.body.some(x => x.type === 'hide')),
   learn:'Ahora es la avispa la que pregunta si la tocó la semilla. Cada personaje se ocupa de lo suyo y se avisan con mensajes.'},
  {id:'p5-queclon', name:'¿Qué es un clon?', short:'¿Qué es un clon?',
   intro:{title:'Un clon es una copia',
     text:'“Crear clon de mí mismo” hace una copia del objeto, con sus mismos programas y su mismo dibujo. La copia no arranca con la banderita: arranca con “al comenzar como clon”. Y cuando ya no la necesitás, “eliminar este clon” la borra.',
     example:() => [hatKey('space', cloneB('mí mismo')), hatClone(rndB(), showB(), waitB(3), delB())], note:'Cada vez que apretás espacio aparece una moneda nueva en otro lugar. A los 3 segundos, esa copia se borra.'},
   goal:'Tocá la pestaña de la moneda. Abajo de “al presionar tecla espacio” poné “crear clon de mí mismo”. Apretá espacio varias veces: ¡tené 5 monedas a la vez!',
   palette:['clone'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1, defaultKey:'space', spaceBtn:true,
   sprites:[BUG(-190,-140, () => [MOVE_S()]),
     Object.assign(COIN(0, 0, () => [Object.assign(hatFlag(hideB()), {fold:'al empezar: la moneda original se esconde'}), hatKey('space'), hatClone(rndB(), showB(), waitB(3), delB())]), {hidden:true})],
   check:R => (R.maxClones || 0) >= 5,
   learn:'Un clon es una copia con los mismos programas. Arranca en “al comenzar como clon” y se borra con “eliminar este clon”.',
   extra:'Ahora, lo mismo con las semillas: así se pueden tirar muchas a la vez.'},
  {id:'p5-clones', name:'Muchas semillas: clones', short:'Clones',
   intro:{title:'Clones',
     text:'Con una sola semilla no podés tirar otra hasta que llegue arriba. Un clon es una copia de un objeto, con sus mismos programas. Cada vez que apretás espacio, el bichito crea un clon de la semilla. El clon empieza con “al comenzar como clon”, y cuando toca el borde se borra: “eliminar este clon”.',
     example:() => [hatClone(gotoO('Bichito'), showB(), fe(mv(10), iff(toO('borde'), delB())))], note:'Si no se eliminan, los clones se quedan amontonados arriba para siempre.'},
   goal:'Hacé que se puedan tirar muchas semillas. En el bichito: abajo de “al presionar tecla espacio” poné “crear clon de Semilla”. En la semilla: si el clon toca el borde → “eliminar este clon”. Tené 3 semillas volando a la vez.',
   palette:['clone','delclone'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], defaultKey:'space', spaceBtn:true, selInIf:true,
   sprites:[BUG(-190,-140, () => [MOVE_S(), hatKey('space')]), WASPH('Avispa', -100, 120, () => [PATROL(3)]),
     SEED(-190, -140, () => [Object.assign(hatFlag(hideB(), pdirB(0)), {fold:'al empezar: esconderse y mirar para arriba'}), hatClone(gotoO('Bichito'), showB(), fe(mv(15), iff(toO('borde'))))])],
   check:R => {
     if ((R.maxSeeds || 0) < 3) return false;
     if (!scan(progOf('Semilla'), b => b.type === 'delclone')) return '¡Tres semillas volando! Pero los clones se quedan amontonados arriba. En la semilla: si toca el borde → eliminar este clon.';
     return true;
   },
   learn:'Un clon es una copia con los mismos programas. Se crea con “crear clon de”, arranca en “al comenzar como clon” y se borra con “eliminar este clon”.'},
  {id:'p5-mayor', name:'¿Mayor o menor?', short:'Mayor y menor',
   intro:{title:'Mayor que y menor que',
     text:'Además de “=”, hay dos preguntas para comparar números. “>” es MAYOR QUE: ¿semillas > 3? es sí con 4, 5, 6… “<” es MENOR QUE: ¿semillas < 1? es sí solo con 0. Truco: la boca abierta del símbolo mira al número más grande.',
     example:() => [hatFlag(fe(iff(gtB('semillas', 3), sayB('¡Muchas!')), iff(ltB('semillas', 1), sayB('¡No tengo!'))))], note:'Con 0 semillas dice “¡No tengo!”. Con 4 o más dice “¡Muchas!”. Con 1, 2 o 3 no dice nada nuevo.'},
   goal:'Cada bolsa da 1 semilla. En el programa vacío del bichito: si semillas < 1 → decir “¡No tengo!”; si semillas > 3 → decir “¡Muchas!”. Mirá el cartel verde: contesta SÍ o NO. Juntá 4 semillas.',
   palette:['if','gt','lt','say'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], showEq:true,
   vars:{semillas:0}, varNames:['semillas'],
   sprites:[BUG(-190,-140, () => [MOVE_S(), Object.assign(hatFlag(setV('semillas', 0)), {fold:'al empezar: 0 semillas'}), hatFlag(fe())]),
     BAG(60, 40, () => [Object.assign(hatFlag(fe(iff(toO('Bichito'), chV('semillas', 1), rndB()))), {fold:'si me toca el bichito, le doy 1 semilla y salto'})])],
   check:R => {
     if ((vars().semillas ?? 0) < 4) return false;
     if (!R.saidLt) return 'Tenés ' + vars().semillas + ', pero falta: si semillas < 1 → decir “¡No tengo!”. Apretá la banderita para probar desde 0.';
     if (!R.saidGt) return (vars().semillas ?? 0) >= 5 ? 'Tenés más de 3, pero falta: si semillas > 3 → decir “¡Muchas!”.' : false;
     return true;
   },
   learn:'“>” es mayor que y “<” es menor que. Igual que “=”, adentro del “si” son preguntas que se contestan sí o no.'},
  {id:'p5-balas', name:'Juntá semillas', short:'Munición',
   intro:{title:'Sin semillas no hay disparo',
     text:'Una variable “semillas” cuenta cuántas te quedan. Las bolsas son objetos que te dan semillas. Para disparar preguntás: ¿semillas > 0? (“>” es “mayor que”: ¿hay más de 0?). Si hay, disparás y restás una.',
     example:() => [hatKey('space', iff(gtB('semillas', 0), cloneB('Semilla'), chV('semillas', -1)))], note:'Si no te quedan semillas, la pregunta dice que no y no sale nada.'},
   goal:'Ahora disparás sin límite. Hacé que necesites semillas: en el bichito, envolvé “crear clon” con “si semillas > 0” y agregá “sumar a semillas −1”. Juntá bolsas y disparalas.',
   palette:['if','gt','changevar'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selStart:true, defaultKey:'space', spaceBtn:true,
   vars:{semillas:0}, varNames:['semillas'],
   sprites:[BUG(-190,-140, () => [MOVE_S(), Object.assign(hatFlag(setV('semillas', 0)), {fold:'al empezar: 0 semillas'}), hatKey('space', cloneB('Semilla'))]),
     BAG(60, 40, () => [Object.assign(hatFlag(fe(iff(toO('Bichito'), chV('semillas', 3), rndB()))), {fold:'si me toca el bichito, le doy 3 semillas y salto'})]),
     SEED(-190, -140, () => SEED_CLONE())],
   check:R => {
     const ok = scan(progOf('Bichito'), b => b.type === 'if' && b.cond && b.cond.type === 'gt' && b.cond.v === 'semillas' && b.body.some(x => x.type === 'clone') && b.body.some(x => x.type === 'changevar' && Number(x.n) < 0));
     if ((R.legitShots || 0) < 3) return false;
     if (!ok) return 'Disparaste, pero falta la regla: si semillas > 0 → crear clon → sumar a semillas −1.';
     if (R.freeShot) return 'En algún momento disparaste sin tener semillas. Arreglalo y apretá la banderita.';
     return true;
   },
   learn:'“>” pregunta si un número es mayor que otro. Con “¿semillas > 0?” solo disparás si te quedan.'},
  {id:'p5-espada', name:'La espada', short:'Espada',
   intro:{title:'Una espada no viaja',
     text:'La espada es otro objeto, como la semilla. Pero no sale volando: cuando apretás espacio va adonde está el bichito, se muestra un ratito y se vuelve a esconder. Solo pega a lo que está cerca.',
     example:() => [hatKey('space', gotoO('Bichito'), showB(), waitB(0.3), hideB())], note:'Aparece, espera tres décimas de segundo y se esconde: un golpe rápido.'},
   goal:'Tocá la pestaña de la espada. Abajo de “al presionar tecla espacio”: ir a Bichito → mostrar → esperar 0.3 segundos → esconder. Pegale a la avispa 2 veces.',
   palette:['gotoobj','show','wait','hide'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:2, defaultKey:'space', spaceBtn:true,
   vars:{puntos:0}, varNames:['puntos'],
   sprites:[BUG(-190,-140, () => [MOVE_S(), Object.assign(hatFlag(setV('puntos', 0)), {fold:'puntos en 0'}), Object.assign(hatMsg('atrapada', chV('puntos', 1)), {fold:'sumo un punto'})]),
     WASPH('Avispa', -60, -60, () => [PATROL(2), Object.assign(hatFlag(showB(), fe(iff(toO('Espada'), hideB(), sendB('atrapada'), waitB(1), rndB(), showB()))), {fold:'si me toca la espada, me escondo, aviso y vuelvo'})]),
     SWORD(-190, -140, () => [hatKey('space')])],
   check:R => {
     if (vars().puntos < 2) return false;
     if (!scan(progOf('Espada'), b => b.type === 'hide')) return 'Le pegaste, pero la espada se queda afuera. Escondela después de esperar un ratito.';
     return true;
   },
   learn:'La espada aparece un ratito al lado del bichito y se esconde. Solo le pega a lo que está cerca.'},
  {id:'p5-cerca', name:'Cerca, pero no tanto', short:'Cerca',
   intro:{title:'Pegar antes de que te toque',
     text:'La avispa te persigue. Si te toca, perdés una vida. Con la espada le podés pegar cuando está cerca… pero antes de que llegue a tocarte. Falta que la avispa sepa que le pegaron.',
     example:() => [hatFlag(fe(iff(toO('Espada'), hideB(), sendB('atrapada'))))]},
   goal:'La espada ya funciona. En la avispa, en el programa vacío: si ¿tocando Espada? → esconder → enviar mensaje atrapada. Pegale 3 veces sin quedarte sin vidas.',
   palette:['if','toucho','hide','broadcast'], resetOnFlag:true, start:{x:-190,y:-140}, stars:[], selSprite:1, defaultKey:'space', spaceBtn:true,
   vars:{puntos:0, vidas:3}, varNames:['puntos','vidas'],
   sprites:[BUG(-190,-140, () => [MOVE_S(), LIFE_S({wait:true}), Object.assign(hatFlag(setV('puntos', 0)), {fold:'puntos en 0'}), Object.assign(hatMsg('atrapada', chV('puntos', 1)), {fold:'sumo un punto'}), OVER_S()]),
     WASPH('Avispa', 150, 120, () => [Object.assign(hatFlag(showB(), waitB(1), fe(ptoB('Bichito'), mv(2))), {fold:'te persigo'}), Object.assign(hatMsg('atrapada', waitB(1), rndB(), showB()), {fold:'si me atraparon: espero y vuelvo a aparecer'}), hatFlag(fe())]),
     SWORD(-190, -140, () => [Object.assign(hatKey('space', gotoO('Bichito'), showB(), waitB(0.3), hideB()), {fold:'con espacio: golpe rápido'})])],
   check:R => {
     if (vars().puntos < 3) return false;
     if (vars().vidas <= 0) return 'Llegaste a 3, pero sin vidas. ¡Probá otra vez!';
     return true;
   },
   learn:'Con la espada hay que esperar a que el enemigo esté cerca, pero pegarle antes de que te toque.'},
  {id:'p5-lluvia', name:'Lluvia de navecitas', short:'Navecitas',
   intro:{title:'Un juego de verdad',
     text:'Las navecitas son clones que bajan desde arriba. Vos te movés solo para los costados y disparás semillas (si te quedan). Si una nave te toca o llega al suelo rojo, perdés una vida. Cada nave tiene su propio programa de clon: falta que sepa qué hacer cuando la toca una semilla.',
     example:() => [hatClone(fe(iff(toO('Semilla'), sendB('atrapada'), delB())))], note:'Si a la nave (que es un clon) la toca una semilla: avisa y se elimina.'},
   goal:'¡Juego final! Tocá la pestaña de la nave. Adentro del “por siempre” de su clon: si ¿tocando Semilla? → enviar mensaje atrapada → eliminar este clon. Juntá bolsas de semillas y hacé 10 puntos.',
   palette:['if','toucho','broadcast','delclone'], resetOnFlag:true, start:{x:0,y:-140}, stars:[], selSprite:1, selInIf:false, defaultKey:'space', spaceBtn:true,
   vars:{vidas:3, puntos:0, semillas:10}, varNames:['vidas','puntos','semillas'], msgs:['atrapada','daño'],
   map:[R_(-240,-180,240,-170,'lava')],
   sprites:[BUG(0,-140, () => [Object.assign(hatFlag(fe(iff(kp('right'), cx(10)), iff(kp('left'), cx(-10)))), {fold:'moverse solo para los costados'}),
       Object.assign(hatFlag(setV('vidas', 3), setV('puntos', 0), setV('semillas', 10)), {fold:'al empezar: 3 vidas, 0 puntos, 10 semillas'}),
       Object.assign(hatKey('space', iff(gtB('semillas', 0), cloneB('Semilla'), chV('semillas', -1))), {fold:'con espacio: disparar si quedan semillas'}),
       Object.assign(hatMsg('daño', chV('vidas', -1)), {fold:'si recibo daño, pierdo una vida'}),
       Object.assign(hatMsg('atrapada', chV('puntos', 1)), {fold:'si cae una nave, sumo un punto'}),
       Object.assign(hatFlag(fe(iff(eqB('vidas', 0), sayB('Perdiste'), stopB()), iff(eqB('puntos', 10), sayB('¡Ganaste!'), stopB()))), {fold:'reglas: perder con 0 vidas, ganar con 10 puntos'})]),
     SHIP(0, 164, () => [Object.assign(hatFlag(hideB(), fe(waitB(1.2), rndB(), cy(400), cloneB('mí mismo'))), {fold:'cada tanto: crear una nave nueva arriba'}),
       hatClone(showB(), pdirB(180), fe(mv(3), iff(toO('Bichito'), sendB('daño'), delB()), iff(tc('lava'), sendB('daño'), delB())))]),
     SEED(0, -140, () => SEED_CLONE()),
     BAG(120, -164, () => [Object.assign(hatFlag(fe(iff(toO('Bichito'), chV('semillas', 5), rndB(), cy(-400)))), {fold:'si me toca el bichito, le doy 5 semillas y salto'})])],
   check:R => {
     if (R.stopPts == null) return false;
     const ok = scan(progOf('Nave'), b => b.type === 'if' && condTargets(b.cond).includes('Semilla') && b.body.some(x => x.type === 'delclone'));
     if (!ok) return false;
     if (R.stopPts >= 10) return true;
     if (R.stopPts >= 5) return true;
     return 'Hiciste ' + R.stopPts + ' puntos. ¡Probá llegar a 5 o más!';
   },
   learn:() => corrida().stopPts >= 10 ? '¡Ganaste! Un juego de verdad: clones que bajan, disparos con munición, vidas, puntos y reglas para ganar y perder.' : '¡Bien jugado! Llegaste a ' + corrida().stopPts + ' puntos. Tu programa funciona: cada nave clon se elimina cuando la toca una semilla. Si querés, quedate y probá llegar a 10.'},
  {id:'p5-cierre', name:'Lluvia infinita', short:'Juego infinito', mode:'arcade',
   intro:{title:'Jugá todo lo que quieras',
     text:'Este es el juego completo, ya programado. No termina: las navecitas siguen bajando hasta que te quedes sin vidas. Mirá los programas de cada personaje y cambiá números para hacerlo más fácil o más difícil: la velocidad de las naves, cada cuánto aparecen, cuántas semillas da la bolsa.'},
   goal:'¡Juego infinito! Movete para los costados, disparale a las navecitas, juntá bolsas de semillas y aguantá todo lo que puedas. ¿Cuál es tu récord?',
   palette:[], resetOnFlag:true, start:{x:0,y:-140}, stars:[], defaultKey:'space', spaceBtn:true,
   vars:{vidas:3, puntos:0, semillas:10}, varNames:['vidas','puntos','semillas'], msgs:['atrapada','daño'],
   map:[R_(-240,-180,240,-170,'lava')],
   sprites:[BUG(0,-140, () => [Object.assign(hatFlag(fe(iff(kp('right'), cx(10)), iff(kp('left'), cx(-10)))), {fold:'moverse solo para los costados'}),
       Object.assign(hatFlag(setV('vidas', 3), setV('puntos', 0), setV('semillas', 10)), {fold:'al empezar: 3 vidas, 0 puntos, 10 semillas'}),
       Object.assign(hatKey('space', iff(gtB('semillas', 0), cloneB('Semilla'), chV('semillas', -1))), {fold:'con espacio: disparar si quedan semillas'}),
       Object.assign(hatMsg('daño', chV('vidas', -1)), {fold:'si recibo daño, pierdo una vida'}),
       Object.assign(hatMsg('atrapada', chV('puntos', 1)), {fold:'si cae una nave, sumo un punto'}),
       Object.assign(OVER_S(), {fold:'si me quedo sin vidas, se termina'})]),
     SHIP(0, 164, () => [Object.assign(hatFlag(hideB(), fe(waitB(1), rndB(), cy(400), cloneB('mí mismo'))), {fold:'cada segundo: crear una nave nueva arriba'}),
       Object.assign(hatClone(showB(), pdirB(180), fe(mv(3), iff(toO('Bichito'), sendB('daño'), delB()), iff(tc('lava'), sendB('daño'), delB()), iff(toO('Semilla'), sendB('atrapada'), delB()))), {fold:'soy una nave: bajo; si me tocan, aviso y me borro'})]),
     SEED(0, -140, () => SEED_CLONE().map(sc => Object.assign(sc, {fold: sc.fold || 'soy una semilla: salgo del bichito y vuelo para arriba'}))),
     BAG(120, -164, () => [Object.assign(hatFlag(fe(iff(toO('Bichito'), chV('semillas', 5), rndB(), cy(-400)))), {fold:'si me toca el bichito, le doy 5 semillas y salto'})])],
   check:R => R.stopPts != null,
   learn:() => {
     const pts = corrida().stopPts || 0, { anterior: best, nuevo } = registrarRecord(pts);
     return nuevo ? `¡Nuevo récord: ${pts} navecitas! Apretá la banderita para jugar otra vez.` : `Hiciste ${pts} puntos. Tu récord es ${best}. ¡Apretá la banderita y superalo!`;
   }},
];

export const FREE5 = {id:'libre5', name:'Modo libre', short:'Libre', mode:'free', intro:{title:'Modo libre', text:'Armá tu juego de disparos: semillas con clones, avispas que caen, mensajes y puntos.'},
  goal:'Armá tu juego de disparos.', vars:{puntos:0}, varNames:['puntos'], allowCreateVar:true, defaultKey:'space', spaceBtn:true, msgs:['atrapada','ganaste'],
  palette:['flag','key','whenmsg','whenclone','broadcast','forever','if','toucho','keyp','and','or','eq','gt','move','bounce','pointdir','gotoobj','gorandom','hide','show','say','wait','clone','delclone','stop','setvar','changevar'],
  resetOnFlag:true, start:{x:-190,y:-140}, stars:[],
  sprites:[BUG(-190,-140, () => [MOVE_S(), hatKey('space', cloneB('Semilla')), hatMsg('atrapada', chV('puntos', 1))]),
    WASPH('Avispa', -150, 120, () => [PATROL(3), HIT_S()]), SEED(-190, -140, () => SEED_CLONE())]};

export const PARTE = {n:5, name:'Atacar', desc:'Esconder, mensajes, disparos y clones', levels:LEVELS5, free:FREE5,
   tag:'Aplastar, avisar y disparar semillas.',
   teach:[
     ['La clase', '<p>Núcleo en 6.º y 7.º; partes en 5.º. Una o dos clases. Esconder y mostrar, el operador “y”, mensajes entre objetos y clones. Los clones son lo más difícil: se puede dejar para una segunda clase.</p>'],
     ['Antes, sin pantalla', '<ol><li>Un chico es la avispa: si lo tocan, se agacha (esconder). ¿Se vuelve a parar en la próxima ronda?</li><li>“¡Atrapada!”: alguien grita y el que lleva los puntos anota uno (mensajes).</li><li>Cada vez que aplaudo, sale un chico nuevo corriendo; cuando llega a la pared, se sienta (clones).</li></ol>'],
     ['Preguntas de cierre', '<ul><li>¿Qué diferencia hay entre esconder y borrar?</li><li>¿Para qué sirven los mensajes?</li><li>¿Por qué hay que eliminar los clones?</li></ul>'],
   ]};
