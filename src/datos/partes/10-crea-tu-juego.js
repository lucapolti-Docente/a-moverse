import { ALL_BLOCKS } from '../bloques.js';
import { BD_FREE } from '../fondos.js';
import { BUGC, COIN, HEART, SEED, STAGE, WASPH } from '../personajes.js';
import { MOVE_S } from '../programas.js';
import { bdB, hatFlag, hideB } from '../../motor/bloques.js';

export const SANDBOX = {id:'p8-crea', name:'Creá tu juego', short:'Creá tu juego', mode:'sandbox',
  intro:{title:'Tu propio juego',
    text:'Acá tenés todo: los personajes (bichito, avispas, moneda, corazón, semilla), el escenario con sus fondos y todos los bloques que aprendiste. Ya están las variables puntos, vidas y tiempo, y podés crear otras. Pensá un juego, armalo de a poco y probalo con la banderita. Tu juego se guarda solo en esta compu.',
    recetas:[
      'Monedas contra reloj — Moneda: si la toca el bichito, sumar a puntos 1 e ir a posición aleatoria (Vidas y puntos). Bichito: cuenta regresiva con tiempo y una regla de fin (Vidas y puntos).',
      'Avispas que caen — Avispa: apuntar en dirección 180, por siempre mover, y si toca el borde, ir arriba (Enemigos). Bichito: si lo toca, sumar a vidas −1 (Vidas y puntos).',
      'Laberinto de 3 niveles — Escenario: fondos y “al recibir siguiente nivel” (Niveles). Bichito: paredes, lava y meta con mensaje (Choques y metas, Niveles).',
      'Bichito con vida — Disfraces para caminar, dolor y festejo (Animaciones).'
    ]},
  goal:'¡Creá tu juego! Elegí un personaje en las pestañas y armale sus programas. Probá con la banderita, cambiá cosas y volvé a probar.',
  palette:ALL_BLOCKS, allowCreateVar:true, varInNum:true, resetOnFlag:true, start:{x:-190,y:-140}, stars:[], defaultKey:'space', spaceBtn:true,
  vars:{puntos:0, vidas:3, tiempo:0}, varNames:['puntos','vidas','tiempo'], msgs:['mensaje1','atrapada','siguiente nivel','ganaste'],
  terminado:['Se mueve con el teclado.', 'Se puede ganar.', 'Se puede perder o terminar.', 'Tiene puntos, vidas o tiempo.', 'Tiene una animación o un sonido de festejo.', 'Lo probó otra persona.'],
  backdrops:BD_FREE, bdOrder:['vacío','pasto','arena','noche'], startBackdrop:'vacío', colors:['wall','lava','goal','mud','ice'],
  sprites:[BUGC(-190, -140, () => [Object.assign(MOVE_S(), {open:true}), hatFlag()]),
    WASPH('Avispa', 120, 100, () => [hatFlag()]), WASPH('Avispa 2', -100, 120, () => [hatFlag()], false, '#C2410C'),
    COIN(60, -40, () => [hatFlag()]), HEART(-60, 40, () => [hatFlag()]), SEED(-190, -140, () => [hatFlag(hideB())]),
    STAGE(() => [hatFlag(bdB('vacío'))])]};

export const LEVELS10 = [SANDBOX];

/* Ficha de la parte: ver el comentario de rasgos en 1-movimiento.js. */
export const PARTE = {rasgos:{avisarSiAfuera:true, portada:'crear'}, name:'Creá tu juego', desc:'Todos los bloques, todos los personajes', levels:LEVELS10, free:SANDBOX,
   tag:'Un espacio libre para armar tu propio juego.',
   teach:[
     ['La clase', '<p>Proyecto final, una o varias clases. Cada chico o pareja piensa un juego, lo arma con lo aprendido y lo prueba. El proyecto se guarda en el navegador de esa compu. La pista trae recetas con los bloques que usa cada idea, y la lista “¿Mi juego está terminado?” sirve de guía para la evaluación. Después, pasan a Scratch para hacerlo de verdad.</p>'],
     ['Antes, sin pantalla', '<ol><li>Dibujar el juego en papel: ¿quién es el jugador? ¿qué tiene que hacer? ¿cómo se gana y cómo se pierde?</li><li>Listar los personajes y qué programa necesita cada uno.</li></ol>'],
     ['Preguntas de cierre', '<ul><li>¿Qué hace cada personaje de tu juego?</li><li>¿Qué variable usaste y para qué?</li><li>¿Qué cambiarías si lo hicieras en Scratch?</li></ul>'],
   ]};
