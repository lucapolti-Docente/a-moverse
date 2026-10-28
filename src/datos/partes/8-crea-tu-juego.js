import { ALL_BLOCKS } from '../bloques.js';
import { BD_FREE } from '../fondos.js';
import { BUGC, COIN, HEART, SEED, STAGE, WASPH } from '../personajes.js';
import { MOVE_S } from '../programas.js';
import { bdB, hatFlag, hideB } from '../../motor/bloques.js';

export const SANDBOX = {id:'p8-crea', name:'Creá tu juego', short:'Creá tu juego', mode:'sandbox',
  intro:{title:'Tu propio juego',
    text:'Acá tenés todo: los personajes (bichito, avispas, moneda, corazón, semilla), el escenario con sus fondos y todos los bloques que aprendiste. Podés crear variables con “Crear una variable”. Pensá un juego, armalo de a poco y probalo con la banderita. Ideas: juntar monedas antes de que se acabe el tiempo; esquivar avispas que caen; un laberinto de 3 niveles.'},
  goal:'¡Creá tu juego! Elegí un personaje en las pestañas y armale sus programas. Probá con la banderita, cambiá cosas y volvé a probar.',
  palette:ALL_BLOCKS, allowCreateVar:true, varInNum:true, resetOnFlag:true, start:{x:-190,y:-140}, stars:[], defaultKey:'space', spaceBtn:true,
  vars:{puntos:0}, varNames:['puntos'], msgs:['mensaje1','atrapada','siguiente nivel','ganaste'],
  backdrops:BD_FREE, bdOrder:['vacío','pasto','arena','noche'], startBackdrop:'vacío', colors:['wall','lava','goal','mud','ice'],
  sprites:[BUGC(-190, -140, () => [Object.assign(MOVE_S(), {open:true}), hatFlag()]),
    WASPH('Avispa', 120, 100, () => [hatFlag()]), WASPH('Avispa 2', -100, 120, () => [hatFlag()], false, '#C2410C'),
    COIN(60, -40, () => [hatFlag()]), HEART(-60, 40, () => [hatFlag()]), SEED(-190, -140, () => [hatFlag(hideB())]),
    STAGE(() => [hatFlag(bdB('vacío'))])]};

export const LEVELS8 = [SANDBOX];

export const PARTE = {n:8, name:'Creá tu juego', desc:'Todos los bloques, todos los personajes', levels:LEVELS8, free:SANDBOX,
   tag:'Un espacio libre para armar tu propio juego.',
   teach:[
     ['La clase', '<p>Proyecto final, una o varias clases. Cada chico o pareja piensa un juego, lo arma con lo aprendido y lo prueba. Después, pasan a Scratch para hacerlo de verdad.</p>'],
     ['Antes, sin pantalla', '<ol><li>Dibujar el juego en papel: ¿quién es el jugador? ¿qué tiene que hacer? ¿cómo se gana y cómo se pierde?</li><li>Listar los personajes y qué programa necesita cada uno.</li></ol>'],
     ['Preguntas de cierre', '<ul><li>¿Qué hace cada personaje de tu juego?</li><li>¿Qué variable usaste y para qué?</li><li>¿Qué cambiarías si lo hicieras en Scratch?</li></ul>'],
   ]};
