/* Los textos que el juego le dice al chico mientras juega (los de cada nivel están en partes/).
   Voseo, frases cortas y sin retar: dicen qué pasó y qué revisar. Para corregir una palabra, se toca solo acá. */
import { KEYS } from './bloques.js';

export const DIR = {right:'la derecha', left:'la izquierda', up:'arriba', down:'abajo'};

/* Lo que se dice al cargar un nivel, según el modo. */
export const AL_CARGAR = {
  explore: 'Agarrá al bichito con el dedo o el mouse y movelo por el escenario.',
  sandbox: '¡Tu juego! Elegí un personaje en las pestañas, armá sus programas y apretá la banderita.',
  libreAnimar: 'Modo libre: animá al bichito como quieras.',
  libre: 'Modo libre: armá el programa que quieras y juntá estrellas.',
  movimientoArmado: 'Apretá la banderita y movete con las flechas. El movimiento ya está programado.',
  pestanas: 'Cada personaje tiene su pestaña arriba del programa. El bichito ya se mueve con las flechas.'
};

/* Mensajes mientras corre el programa. Los que dependen de algo son funciones. */
export const MSJ = {
  // movimiento
  moverIzquierda: 'Apretaste la flecha izquierda, pero “mover 10 pasos” va para donde mira el bichito: la derecha. ¿Qué número lo haría ir para atrás?',
  moverArribaAbajo: '“Mover pasos” siempre va hacia donde mira el bichito. Para subir o bajar no alcanza: falta otra idea.',
  rebotoSumarX: 'Rebotó: ahora mira para el otro lado… pero “sumar a x” siempre suma para la derecha. Cambialo por “mover 5 pasos”, que va para donde mira.',
  piedra: '¡Uy, tocaste una piedra! Volvés al principio. Probá ir en diagonal, con dos flechas a la vez.',
  conBanderita: 'Llegaste con la banderita, de golpe. En este desafío lo tenés que manejar vos con las flechas.',
  conFlechas: 'Lo moviste con las flechas. En este desafío tiene que ser con W A S D: cambiá las teclas en los bloques celestes ▾.',
  ahiEsta: '¡Ahí está! Soltá la flecha y quedate quieto arriba de la estrella.',
  sePaso: 'Se pasó. Soltá la flecha justo arriba de la estrella.',
  sePasoDeLargo: 'Se pasó de largo: el “por siempre” lo hace caminar sin parar. ¿Qué pregunta tiene que hacer para moverse solo cuando apretás la flecha?',
  salteo: '¡Saltó de golpe y se salteó estrellas! Usá “repetir” para que vaya de a poco y pase por todas.',
  faltanPasos: n => `Quedó corto: faltan ${n} pasos. ¿Cuántas vueltas más tiene que dar?`,
  unaSolaVez: 'Se movió una sola vez y se quedó. ¿Qué bloque de Control lo hace repetir? Tocá “por siempre”.',
  rondas: n => `¡Juntaste todas! Van ${n} rondas. Ahí vienen más.`,
  siSinPregunta: 'A tu “si” le falta la pregunta. Poné un bloque celeste en el hueco.',

  // colores
  paredSinRegla: '¡Atravesó la pared! Las paredes grises frenan. Programá: si toca el gris, volvé un paso para atrás.',
  paredSeMetio: dir => `Se metió en la pared: chocó yendo para ${DIR[dir] || 'un costado'}. ¿Tu “si” deshace justo ese paso?`,
  paredOtraVez: 'Se volvió a meter. Pista: mirá cómo está hecha la flecha derecha y hacé lo mismo en las otras: adentro de cada una, si toca el gris, el paso al revés.',
  lava: '¡Pisó la lava y no pasó nada! Programá: si toca el rojo, ir a x: y: del inicio.',
  lavaConVidas: '¡Pisó la lava y no pasó nada! Falta: si toca el rojo → sumar a vidas −1 → ir al inicio.',
  hieloOtraVez: '¡Se acabó el tiempo! Probá de nuevo, sin soltar la flecha.',
  hieloFalta: '¡Se acabó el tiempo! Caminando normal no llegás. Adentro de la flecha derecha: si tocás el celeste, sumá 10 más.',
  barroResbala: '¡Se resbala para atrás aunque no apretás nada! Tu pregunta del barro se hace todo el tiempo. Ponela adentro de la flecha derecha: así solo pregunta cuando caminás.',
  metaSinDecir: 'Llegó al verde y no pasó nada. Poné “si ¿tocando el color verde? entonces decir” adentro del “por siempre”.',
  metaSinDetener: 'Dijo “¡Llegué!” pero el juego sigue. ¿Qué bloque de Control termina todo?',
  detuvoAntes: 'El programa se detuvo antes de la meta. ¿El “detener todos” está adentro del “si toca el verde”?',

  // enemigos
  atrapo: '¡Te atrapó la avispa! Apretá la banderita y probá otra vez.',
  picoSinPasar: '¡Te tocó la avispa y no pasó nada! En el bichito: si ¿tocando Avispa? → que pase algo.',
  avispaSinProgramas: 'La avispa no tiene programas todavía. Tocá su pestaña, arriba del programa.',

  // variables
  monedaSinPuntos: '¡La moneda saltó! Pero el cartel de puntos no subió. Agregá “sumar a puntos 1” adentro del “si”.',
  puntosArrancan: n => 'Fijate el cartel: los puntos arrancan en ' + n + ', no en 0. La cajita se acuerda de antes.',
  sinVidas: '¡Te quedaste sin vidas! Apretá la banderita para jugar otra vez.',
  seAcaboTiempo: '¡Se acabó el tiempo! Tu reloj funciona: el juego terminó justo en 0.',
  relojVuela: '¡El reloj vuela! Suma 30 por segundo porque el “por siempre” da 30 vueltas por segundo. Poné “esperar 1 segundos” antes de sumar.',
  relojSube: '¡El reloj sube! Para que cuente para atrás, cambiá “sumar a tiempo 1” por −1.',
  tiempoPasoCero: '¡El tiempo ya pasó el 0 y el juego sigue! Falta la regla: si tiempo = 0 → decir “Se acabó el tiempo” → detener todos.',
  vidasDeGolpe: '¡¡Se terminó! un montón de vidas de golpe! El “por siempre” resta en cada vuelta mientras la avispa te toca. Poné “esperar 1 segundos” después de restar.',
  sinVidasSigue: '¡Te quedaste sin vidas y el juego sigue como si nada! Falta la regla: si vidas = 0 → decir “¡Se terminó!” → detener todos.',
  reglaSinDetener: 'Tu regla dice algo, pero el juego sigue. Falta “detener todos” adentro del “si”.',
  pasastePuntos: '¡Pasaste los 10 puntos y el juego sigue! Falta la regla: si puntos = 10 → decir “¡Ganaste!” → detener todos.',

  // atacar
  semillaArriba: 'La semilla apareció arriba, donde había quedado, y se escondió enseguida. Tiene que salir desde el bichito: poné “ir a Bichito” arriba del “mostrar”.',
  sinSemillas: '¡Tiraste sin tener semillas! Envolvé “crear clon” con “si semillas > 0”.',
  semillasAmontonadas: 'Las semillas se quedan amontonadas arriba: son clones que nunca se borran. En la semilla: si toca el borde → eliminar este clon.',
  avispaEscondida: 'La avispa sigue escondida de la vez anterior. Poné “mostrar” arriba de su “por siempre”.',
  sinEspacio: 'Se escondió sin apretar espacio. Falta el “y”: ¿tocando Bichito? y ¿tecla espacio presionada?',

  // niveles
  gotoSuelto: 'El bichito no se puede mover: hay un “ir a x: y:” suelto adentro del “por siempre”, y lo manda al inicio todo el tiempo. Ponelo adentro del “si”.',
  paredNivelNuevo: '¡Quedó adentro de una pared del nivel nuevo! Después de cambiar el fondo, mandalo al inicio: ir a x: −200 y: −150.',
  gotoLejos: 'Quedó adentro de una pared del nivel nuevo. El “ir a x: −200 y: −150” tiene que ir justo abajo de “cambiar fondo a arena”, adentro del mismo “si”.',
  fondoFijo: f => `El escenario cambió a “${f}” y se queda ahí. Para avanzar de a uno, elegí “siguiente fondo” en el menú ▾.`,
  nocheVieja: 'Seguís en la noche, de la partida anterior. En el Escenario: “cambiar fondo a pasto” abajo de la banderita.',

  // banderita y teclas
  programaVacio: 'Tu programa está vacío. Elegí un bloque amarillo de Eventos para empezar.',
  sinBanderita: 'Ningún bloque arranca con la banderita. Probá con “al hacer clic en bandera”.',
  sinBanderitaTeclas: 'Tu programa no usa la banderita: arranca con las flechas. ¡Probalas!',
  banderitaVacia: 'Tu “al hacer clic en bandera” no tiene nada abajo. Sumale un bloque.',
  siAfuera: 'Uno de tus “si” no está adentro de un “por siempre”: va a preguntar una sola vez, al principio.',
  porSiempreVacio: 'Tenés un “por siempre” vacío. Ponele adentro un “si” con su pregunta.',
  detenido: 'El programa se detuvo. Apretá la banderita para jugar otra vez.',
  noArranco: 'Tu programa todavía no arrancó. Apretá la banderita primero.',
  siUnaVez: 'Tu “si” preguntó una sola vez, cuando apretaste la banderita. ¿Cómo hacés que pregunte todo el tiempo?',
  nadieEscucha: k => `Ningún bloque escucha la ${KEYS[k]}. Usá “al presionar tecla”.`,
  eventoVacio: k => `Tu evento de la ${KEYS[k]} está vacío. Ponele un bloque azul abajo.`,
  teclaSinSi: (k, esLetra) => `Apretaste ${esLetra ? 'la ' + k.toUpperCase() : 'la ' + KEYS[k]}, pero ningún “si” pregunta por esa tecla. Cambiala en el bloque celeste ▾.`
};

/* Nivel de explorar (adivinar x e y) y preguntas de cierre. */
export const EXPLORAR = {
  todas: '¡Encontraste las dos estrellas!',
  falta: n => `¡Ya encontraste una! Falta ${n}. ¿En qué x y en qué y está?`,
  elegi: 'Elegí cualquier estrella, la que quieras. ¿En qué x y en qué y está?',
  pista: 'Pista: llevá al bichito arriba de la estrella y mirá los números de arriba a la izquierda.',
  comprobar: 'Comprobar',
  si: (x, y) => `¡Sí! Está en x: ${x}, y: ${y}.`,
  ningunaBien: 'Todavía no. Mirá: ¿la estrella está a la derecha (más) o a la izquierda (menos) del centro?',
  xMal: 'La y está bien. La x no: x es para los costados. Derecha es más, izquierda es menos.',
  yMal: 'La x está bien. La y no: y es arriba y abajo. Arriba es más, abajo es menos.'
};
export const CIERRE = { mal: 'Mmm, no. Mirá el programa y probá otra.' };

/* Textos fijos de la pantalla (index.html los toma de acá: data-t, data-ta para aria-label, data-tt para title). */
export const PANTALLA = {
  ariaInicio: 'Volver al menú de la parte',
  ariaAnterior: 'Nivel anterior',
  ariaSiguiente: 'Nivel siguiente',
  ariaSonido: 'Sonido',
  ariaEscenario: 'Escenario',
  ariaBanderita: 'Banderita: arrancar el programa',
  ariaParar: 'Parar',
  ariaReiniciar: 'Volver a empezar el nivel',
  ariaPad: 'Flechas',
  ariaBloques: 'Bloques',
  ariaPrograma: 'Programa',
  ariaEspacio: 'Tecla espacio',
  espacio: 'espacio',
  ariaFlechaArriba: 'Flecha arriba',
  ariaFlechaIzquierda: 'Flecha izquierda',
  ariaFlechaAbajo: 'Flecha abajo',
  ariaFlechaDerecha: 'Flecha derecha',
  tituloReglas: 'Referencias: reglas y flechitas',
  reglas: 'Reglas',
  desafio: 'Desafío',
  pista: '💡 Pista',
  padFlechas: 'Pad: flechas',
  banderita: 'Banderita',
  parar: 'Parar',
  lema: 'Cada idea funciona… hasta que un desafío la rompe.',
  elegiParte: 'Elegí una parte',
  lemaPartes: 'Paso a paso armamos un juego de verdad.',
  partes: 'Partes',
  pasoAPaso: 'Paso a paso',
  libre: 'Libre',
  todosLosBloques: 'Todos los bloques',
  elegiNivel: 'Elegí un nivel',
  paraDocente: 'Para el docente',
  pistaTitulo: 'Pista',
  ejemplo: 'Ejemplo',
  entendido: 'Entendido',
  loLograste: '¡Lo lograste!',
  queDescubriste: 'Qué descubriste',
  quedarme: 'Quedarme acá',
  siguienteNivel: 'Siguiente nivel'
};

/* Textos de la interfaz que arma el juego (menú, ventanas, editor, controles). */
export const UI = {
  // menú de partes y niveles
  parte: n => 'Parte ' + n,
  ariaParte: (n, nombre) => `Parte ${n}: ${nombre}`,
  proximamente: 'Próximamente',
  cuenta: (h, t) => `${h} de ${t}`,
  parteHecha: '¡Hecha! ✓',
  seguiAca: 'Seguí acá',
  nivelesYCierre: n => `${n} niveles y un cierre`,
  niveles: n => n === 1 ? '1 nivel' : `${n} niveles`,
  ariaNivel: i => `Nivel ${i}: `,
  hecho: ' (hecho)',
  // barra de arriba
  barraLibre: p => `Parte ${p} · Libre`,
  barraCierre: p => `Parte ${p} · Cierre`,
  barraNivel: (p, i, n) => `Parte ${p} · ${i} / ${n}`,
  prefijoCierre: 'Cierre: ',
  // ventana de victoria
  loLograste: '¡Lo lograste!',
  terminaste: p => `¡Terminaste la parte ${p}!`,
  siguienteNivel: 'Siguiente nivel',
  volverAlMenu: 'Volver al menú',
  // controles
  padWasd: 'Pad: W A S D',
  padFlechas: 'Pad: flechas',
  ariaTecla: k => 'Tecla ' + k,
  ariaFlecha: {up:'Flecha arriba', left:'Flecha izquierda', down:'Flecha abajo', right:'Flecha derecha'},
  ariaRefOcultar: 'Ocultar referencias (reglas y flechitas)',
  ariaRefMostrar: 'Mostrar referencias (reglas y flechitas)',
  tituloRefOcultar: 'Ocultar reglas y flechitas',
  tituloRefMostrar: 'Mostrar reglas y flechitas',
  refPrendidas: 'Referencias prendidas: reglas y flechitas.',
  refApagadas: 'Referencias apagadas. Las prendés con el botón “Reglas”.',
  sonido: 'Sonido',
  sonidoApagado: 'Sonido apagado',
  // editor
  tuPrograma: 'Tu programa',
  programasDe: nombre => 'Programas de ' + nombre,
  volverComoEstaba: 'Volver a como estaba',
  programaVacio: 'Tocá un bloque amarillo de Eventos para empezar. Los bloques que toques aparecen acá.',
  paletaTitulo: 'Bloques (tocá para sumar)',
  crearVariable: 'Crear una variable',
  nuevaVariable: { titulo: 'Nueva variable', nombre: 'Nombre de la variable:', ejemplo: 'por ejemplo: monedas', todos: '● Para todos los objetos', este: '○ Solo para este objeto', cancelar: 'Cancelar', aceptar: 'Aceptar' },
  varSinNombre: 'Escribí un nombre. Por ejemplo: monedas.',
  varRepetida: 'Ya hay una variable con ese nombre.',
  varCreada: n => `¡Creaste la variable “${n}”! Ya aparece el cartel en el escenario y los bloques naranjas para usarla.`,
  bloqueO: '“o”',
  bloqueY: '“y”',
  operadorSinSi: nm => 'El bloque ' + nm + ' va en el hueco de un “si”. Primero poné un “si”.',
  siYaTiene: nm => 'Ese “si” ya tiene un ' + nm + '. Tocá otra pregunta celeste.',
  siLleno: 'Todos tus “si” ya tienen su pregunta. Para juntar dos preguntas, tocá primero el bloque verde “o”.',
  sensorSinSi: 'Los bloques celestes van en el hueco de un “si”. Primero poné un “si”.',
  primeroEvento: 'Primero poné un evento amarillo: el programa necesita saber cuándo arrancar.',
  terminadoTitulo: '¿Mi juego está terminado?',
  terminadoListo: '¡Juego terminado! Mostráselo a alguien y pedile que lo pruebe.',
  empezarDeCero: 'Empezar de cero',
  empezarDeCeroSeguro: '¿Borrar todo tu juego y empezar de cero?',
  empezaPrograma: 'Empezá un programa nuevo: tocá “al hacer clic en bandera”.'
};

/* Textos del armado de programas: flechitas de dirección, menús y botones de los bloques. */
export const EDITOR = {
  dir: { derecha: 'derecha', izquierda: 'izquierda', arriba: 'arriba', abajo: 'abajo', adelante: 'adelante', atras: 'para atrás' },
  mas: 'más: ',
  menos: 'menos: ',
  suma: n => 'suma ' + n,
  resta: n => 'resta ' + n,
  apuntar: {'0':'▲ arriba', '90':'derecha ▶', '180':'▼ abajo', '-90':'◀ izquierda', '45':'↗ diagonal', '135':'↘ diagonal', '-135':'↙ diagonal', '-45':'↖ diagonal'},
  enDiagonal: 'en diagonal ↗',
  diagonal: 'diagonal',
  paraDonde: '¿para<br>dónde?',
  elegiDireccion: 'Elegí una dirección',
  ariaDireccion: n => 'Dirección ' + n + '. Tocá para elegir',
  cursor: '▸ acá va el próximo bloque',
  plegadoFijo: f => '▸ ' + f.charAt(0).toUpperCase() + f.slice(1) + ' (ya armado)',
  esconder: f => '▾ Esconder: ' + f,
  yaArmado: f => '▸ Ya armado: ' + f + ' (tocá para ver)',
  masVariable: '＋ variable',
  ariaMasVariable: 'Poner una variable en este hueco',
  volverANumero: '↩ número',
  // nombres para lectores de pantalla
  numero: 'número', texto: 'texto', tecla: 'tecla', disfraz: 'disfraz', fondo: 'fondo', queClonar: 'qué clonar',
  variable: 'variable', variableONumero: 'variable o número', personaje: 'personaje', mensaje: 'mensaje',
  color: n => 'color ' + n,
  ariaColorCambiar: n => `color ${n}. Tocá para cambiar`,
  tituloColorCambiar: n => n + ' (tocá para cambiar)',
  sacarBloque: 'Sacar bloque',
  sacarOperador: o => 'Sacar “' + o + '”',
  sacarComparacion: 'Sacar comparación',
  sacarSensor: 'Sacar sensor',
  huecoPregunta: 'hueco para una pregunta',
  huecoSensor: 'hueco para un sensor'
};

/* Lo que se escribe adentro del escenario: reglas, carteles de variables y preguntas. */
export const ESCENARIO = {
  menosX: '◀ menos', masX: 'más ▶', menos: 'menos', mas: 'más',
  tiempo: '⏱ tiempo',
  si: 'SÍ', no: 'NO',
  fondo: f => '🖼 fondo: ' + f,
  segundos: s => '⏱ ' + s + ' s',
  escondida: n => n + ' (escondida)'
};
