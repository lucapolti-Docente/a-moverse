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
  picoSinPasar: '¡Te picó la avispa y no pasó nada! En el bichito: si ¿tocando Avispa? → que pase algo.',
  avispaSinProgramas: 'La avispa no tiene programas todavía. Tocá su pestaña, arriba del programa.',

  // variables
  monedaSinPuntos: '¡La moneda saltó! Pero el cartel de puntos no subió. Agregá “sumar a puntos 1” adentro del “si”.',
  puntosArrancan: n => 'Fijate el cartel: los puntos arrancan en ' + n + ', no en 0. La cajita se acuerda de antes.',
  sinVidas: '¡Te quedaste sin vidas! Apretá la banderita para jugar otra vez.',
  seAcaboTiempo: '¡Se acabó el tiempo! Tu reloj funciona: el juego terminó justo en 0.',
  relojVuela: '¡El reloj vuela! Suma 30 por segundo porque el “por siempre” da 30 vueltas por segundo. Poné “esperar 1 segundos” antes de sumar.',
  relojSube: '¡El reloj sube! Para que cuente para atrás, cambiá “sumar a tiempo 1” por −1.',
  tiempoPasoCero: '¡El tiempo ya pasó el 0 y el juego sigue! Falta la regla: si tiempo = 0 → decir “Se acabó el tiempo” → detener todos.',
  vidasDeGolpe: '¡Perdiste un montón de vidas de golpe! El “por siempre” resta en cada vuelta mientras la avispa te toca. Poné “esperar 1 segundos” después de restar.',
  sinVidasSigue: '¡Te quedaste sin vidas y el juego sigue como si nada! Falta la regla: si vidas = 0 → decir “Perdiste” → detener todos.',
  pasastePuntos: '¡Pasaste los 10 puntos y el juego sigue! Falta la regla: si puntos = 10 → decir “¡Ganaste!” → detener todos.',

  // atacar
  semillaArriba: 'La semilla apareció arriba, donde había quedado, y se escondió enseguida. Tiene que salir desde el bichito: poné “ir a Bichito” arriba del “mostrar”.',
  sinSemillas: '¡Disparaste sin tener semillas! Envolvé “crear clon” con “si semillas > 0”.',
  semillasAmontonadas: 'Las semillas se quedan amontonadas arriba: son clones que nunca se borran. En la semilla: si toca el borde → eliminar este clon.',
  avispaEscondida: 'La avispa sigue escondida de la vez anterior. Poné “mostrar” arriba de su “por siempre”.',
  sinEspacio: 'Se escondió sin apretar espacio. Falta el “y”: ¿tocando Bichito? y ¿tecla espacio presionada?',

  // niveles
  gotoSuelto: 'El bichito no se puede mover: hay un “ir a x: y:” suelto adentro del “por siempre”, y lo manda al inicio todo el tiempo. Ponelo adentro del “si”.',
  paredNivelNuevo: '¡Quedó adentro de una pared del nivel nuevo! Después de cambiar el fondo, mandalo al inicio: ir a x: −200 y: −150.',
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
