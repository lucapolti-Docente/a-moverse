/* Cómo el motor le avisa a la pantalla lo que pasa, sin tocar el DOM.
   La interfaz reemplaza estas funciones al arrancar (interfaz/conectar.js); en los tests quedan así, mudas. */
export const avisos = {
  decir(texto, bien){},            // mensaje al chico
  sonar(nombre){},                 // efecto de sonido con nombre (SND.nombre)
  tono(frec, dur, forma, vol, demora, hasta){},
  chispas(x, y, color){},          // explosión de partículas en el escenario
  variable(nombre){},              // cambió una variable: el cartel late
  teclas(){},                      // cambiaron las teclas apretadas: actualizar el pad
  nivelCargado(){},                // se cargó un nivel: mostrar todo
  reiniciado(){},                  // volvió todo a su lugar
  gano(){}                         // se ganó el nivel
};
