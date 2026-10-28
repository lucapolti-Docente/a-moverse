# ¡A Moverse!: guía para trabajar en el proyecto

Puente hacia Scratch para primaria (núcleo en 4.º y 5.º; repaso en 6.º y 7.º). Se arman programas con bloques iguales a los de Scratch 3 (mismos nombres y colores por categoría) para mover un personaje y armar un juego por partes: Movimiento, Choques y metas, Enemigos, Vidas y puntos, Aparecer y avisar, Semillas y clones, Juntar y comparar, Niveles, Animaciones y Creá tu juego. Lo usa el docente en clase.

Este CLAUDE.md manda por sobre el general de `juegos-docente/`: acá sí hay npm + Vite + Vitest, igual que en La Gran Máquina y Planta Reci.

## Contexto de uso
- Se juega en netbooks viejas (1366×768, colores lavados) y en celulares.
- Se publica en GitHub Pages (lucapolti-Docente/a-moverse) y también se usa sin internet desde un pendrive con `npm run build:pendrive` (un solo HTML que anda con doble clic).
- `original/a-moverse.html` es el juego de partida. No se edita: es la referencia para comparar.

## Decisiones que no hay que cambiar
- Sin cuentas ni login. Lo guardado va en localStorage con try/catch (`src/guardado.js`), con las claves del original: `amoverse-done` (ids de niveles ganados), `amoverse-record` y `amoverse-ref`, más `amoverse-crea` (el proyecto de “Creá tu juego”). Los ids de nivel no cambian aunque el nivel cambie de parte (por eso hay `p5-…` en las partes 6 y 7); si alguna vez cambia uno, se migra `amoverse-done`.
- Español rioplatense con voseo, frases cortas. Los mensajes dicen qué pasó y qué revisar, sin retar.
- Siempre se puede pasar de nivel y saltar niveles. Cada parte tiene modo libre.
- Personajes originales (bichito, avispas, moneda…), sin derechos de autor ni personas reales. Sin armas ni violencia: la avispa se atrapa con una burbuja y vuelve al panal; las semillas hacen florecer nubes secas. Nunca “Perdiste”: “¡Se terminó!”.
- Bloques con los mismos nombres y colores que Scratch 3 en español (es). Los rótulos están en `src/datos/bloques.js` (ETIQUETAS) y se verifican contra `src/datos/glosario.js` (que tiene también los del Scratch latinoamericano).
- El chequeo de un nivel mira lo que pasó, no la forma exacta del programa: no puede rechazar un programa que funciona.

## Arquitectura
- `src/motor/` es lógica pura, sin DOM: el intérprete de bloques (`motor.js`), la partida (`partida.js`: cargar nivel, ganchos, chequeos) y las reglas que usan los niveles (`reglas.js`). Le avisa a la pantalla por `avisos.js`.
- `src/datos/` tiene todo el contenido: un archivo por parte en `partes/` (niveles, textos, notas docentes y rasgos), `partes/index.js` (la lista), `textos.js`, `bloques.js`, `personajes.js`, `programas.js` (programas ya armados), `fondos.js`.
- `src/interfaz/` es lo único que toca la pantalla; `interfaz/conectar.js` une los avisos del motor con la pantalla.
- `src/dibujo/` dibuja el escenario y la portada en canvas, sin guardar estado.
- Estado compartido en `src/estado.js` (`S`). Nombres internos en inglés heredados del original (`loadLevel`, `sprites`, `prog`); lo nuevo, en español.
- Sumar una parte: crear `src/datos/partes/N-nombre.js` y agregarla a la lista de `partes/index.js`. El número lo da el orden. El comportamiento especial se pide con `rasgos` (explicados en `1-movimiento.js`), nunca con "si es la parte N".

## Antes de dar algo por terminado
- `npm test`: cada nivel se gana con su solución de `tests/soluciones.js` (el piloto de `tests/ayudante/jugar.js` juega solo), con las otras formas válidas (ALTERNATIVAS) y no se gana salteando la idea del nivel (NO_GANAN, que además mira que el juego diga qué falta). Si tocás un nivel, actualizá sus soluciones.
- `npm run build:pendrive` y `node herramientas/capturas.js dist-pendrive/a-moverse.html pruebas/nuevo`, después `node herramientas/comparar.js`. Revisar en 1366×768 y en 360×620, sin errores en la consola.
- `node herramientas/jugar-como-chico.js dist-pendrive/a-moverse.html pruebas/chico` juega tocando botones hasta ganar.
- `node herramientas/probar-crea.js` prueba que “Creá tu juego” guarde el proyecto.
- `pruebas/` no se sube a GitHub.
