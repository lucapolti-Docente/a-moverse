# Auditoría pedagógica (Etapa 2)

Revisión de los 77 niveles con la skill `didactica`: un revisor por parte, más un cruce entre partes.
Los nombres de bloque se verificaron contra la traducción oficial de Scratch 3 (scratch-l10n, `es.json` y `es-419.json`).
Todavía no se cambió nada: esto es la propuesta.

## Problemas que cruzan todo el juego

1. **"Atacar" choca con "sin violencia ni armas"**: "aplastala", espada, disparos, munición, naves que se eliminan, "Perdiste".
2. **Ideas que se piden antes de enseñarlas**:
   - "esperar": se usa en p3-dir y se enseña en p3-6.
   - "decir": aparece en p2-1 sin presentación.
   - "ir a posición aleatoria": aparece en p4-obj sin presentación.
   - "ir a (otro objeto)": aparece en p5-dedonde sin presentación.
   - "tecla espacio": aparece en p5-espacio sin presentación.
   - Cambiar un número o una tecla ▾: se pide en los niveles 2 y 4 sin mostrar cómo.
   - Que un mensaje también le llega al que lo envía: p5-cerca.
3. **"repetir" aparece recién en la parte 7**, ya armado, y el chico nunca lo arrastra. En Scratch es de lo primero que se usa, y el nivel 2 ("¿cuántos bloques necesitás?") lo está pidiendo.
4. **Chequeos que rechazan programas que funcionan** (va contra la regla del proyecto):
   - p2-hielo: el hielo en un programa aparte.
   - p3-5: dos bloques "mover".
   - p3-6: "esperar 0.5".
   - p5-balas: restar antes de crear el clon.
   - p4/p6: la regla de fin solo acepta "=" (no acepta "< 1" ni "> 3").
5. **Errores sin mensaje**: el chico se queda sin saber qué pasa. Pasa en:
   - Nivel 2 (llega corto o se pasa).
   - p2-6 (llega a la meta sin programa de meta).
   - p3-4 (las direcciones al revés).
   - p4-crear (crea la variable pero no la usa).
   - p5-pego.
   - p5-lluvia (falta la regla).
   - p6-aviso (pone un fondo fijo).
   - p6-nivel (la condición no es "= 4").
   - p7-caminar, p7-dolor y p7-festejo.
6. **Mensajes que no corresponden**:
   - `detuvoAntes` habla del "verde" en partes que no tienen meta verde (parte 4).
   - En p2-barro salen a la vez `sePaso` y `barroResbala`.
   - En p4-regresiva dice "Ganaste, pero…" cuando se acabó el tiempo.
   - En p1-o, "Primero poné un si" aparece aunque ya hay un "si".
7. **Grado núcleo inconsistente en las notas docentes**: la parte 3 dice 5.º–7.º, la 4 dice 5.º–7.º, la 5 y la 6 dicen 6.º–7.º. El proyecto es núcleo 4.º y 5.º.
8. **Partes demasiado largas para una clase**: la parte 4 tiene 13 niveles y la 5 tiene 14, con unas 20 ideas nuevas.

## Nombres de bloques frente a Scratch 3

Los colores coinciden en todas las categorías. Hay que corregir tres nombres (según `es.json`):

| En el juego | En Scratch 3 |
| --- | --- |
| enviar mensaje | enviar |
| al cambiar el fondo a | cuando el fondo cambie a |
| rebotar si toca un borde | si toca un borde, rebotar |

**Hay que decidir el dialecto.** El español de América (`es-419`) usa otros nombres:

| Bloque | es (España) | es-419 (Latinoamérica) |
| --- | --- | --- |
| Bandera | al hacer clic en 🏴 | al presionar 🏴 |
| Mover en x | sumar a x | cambiar x en |
| Mover en y | sumar a y | cambiar y en |
| Fijar variable | dar a … el valor | fijar … a |
| Cambiar variable | sumar a … | cambiar … en |
| Borde | borde | el borde |

Si las compus de la escuela muestran Scratch en "Español Latinoamericano", los chicos van a ver es-419.

## Parte 1 · Movimiento

| Nivel | Idea nueva | Problema | Arreglo propuesto |
|---|---|---|---|
| 1 · La banderita | evento bandera + mover | — | — |
| 2 · La estrella lejana | secuencia, cambiar el número | No muestra cómo se edita el número; sin mensaje si queda corto o se pasa | Mensaje "faltan N pasos / te pasaste N"; acá entra "repetir" (ver propuestas) |
| 3 · Una tecla | evento tecla | "Se repite solo" depende del teclado (en el pad no siempre) | "si la dejás apretada en el teclado" |
| 4 · Para atrás y para arriba | negativos | Tres ideas juntas: negativo, otro programa, cambiar tecla ▾; la estrella de arriba no se puede juntar nunca (bug) | Partir en 4a "otra flecha = otro programa" y 4b "−10"; arreglar la estrella |
| 5 · ¿Dónde está? | x e y | — | — |
| 6 · Las cuatro flechas | sumar a x / y | El ejemplo solo muestra y | Ejemplo con x e y |
| p1-siempre | por siempre | — | — |
| p1-pregunta | si + ¿tecla? | Si "sumar" queda afuera del "si", el mensaje dice "soltá la flecha" | Mensaje según dónde quedó el bloque |
| 7 · Preguntar todo el tiempo | si adentro del por siempre | Repite la nota anterior; el ejemplo da la solución | Hacerlo nivel de depurar, sin ejemplo |
| 8 · Entre las piedras | 4 "si" + diagonal | Salto grande; sin aviso si una flecha no tiene su "si" | Nivel intermedio con 2 "si" sin piedras; avisar también con flechas |
| p1-wasd | cambiar la tecla | — | — |
| p1-o | operador "o" | El objetivo no dice el tercer paso; mensaje falso "poné un si" | Objetivo en 3 pasos; arreglar el mensaje |
| 9 · Cierre | comparar A/B | Falta "Operadores verde" | Sumarlo |

## Parte 2 · Choques y metas

| Nivel | Idea nueva | Problema | Arreglo propuesto |
|---|---|---|---|
| p2-1 · ¿Qué estoy tocando? | ¿tocando el color?, decir, dos programas a la vez | No presenta "decir" (violeta) ni los dos programas a la vez | Agregarlo a la intro |
| p2-2 · La meta | detener todos | — | — |
| p2-3 · ¡Cuidado, lava! | ir a x: y: | Se puede llegar sin tocar la lava; el objetivo dicta 4 bloques | Lava en el camino obligado; objetivo corto |
| p2-4 · La pared | deshacer el paso | — | — |
| p2-dentro · Una pregunta adentro | si anidado | Mismo mapa: nada obliga a anidar (se enseña la solución antes del problema) | Mapa donde el programa aparte falle a la vista |
| p2-5 · Paredes por todos lados | generalizar a 4 flechas | — | — |
| p2-barro | un color cambia la velocidad | Se gana sin el barro; el chequeo es solo de forma; mensajes contradictorios | Juntar con hielo en un nivel que mida el resultado |
| p2-hielo | acelerar | Misma idea que el barro; rechaza el hielo en un programa aparte, que funciona | Ídem |
| p2-6 · El laberinto | integrar | Sin mensaje si llega a la meta sin programa de meta | Agregar los avisos de meta |
| p2-7 · Cierre | gigante contra separado | "Mmm, no" sin pista | Explicación corta para la respuesta mala |
| FREE2 | — | Dice "cada cosa en un programa aparte", pero las paredes van adentro de las flechas | Arrancar con el movimiento que frena |

## Parte 3 · Enemigos

| Nivel | Idea nueva | Problema | Arreglo propuesto |
|---|---|---|---|
| p3-1 · Otro personaje | objetos con sus propios programas | Pide "sumar a x 5", el bloque viene con 10 | "el número que quieras" |
| p3-2 · Ir y volver | rebotar, mover según hacia dónde mira | "Mirar para un lado" no se enseñó | Pasar p3-dir antes |
| p3-3 · ¡Me tocó! | ¿tocando (personaje)? | "Picar" | "te toca" |
| p3-dir · ¿Para dónde miro? | dirección en grados | 4 direcciones + 4 diagonales + 360; usa "esperar" antes de enseñarlo | Solo 0/90/180/−90; diagonales al extra; ejemplo sin esperar |
| p3-4 · Arriba y abajo | mismo programa, otro número | Sin mensaje si ninguna avispa cambia o si están al revés | Mensaje |
| p3-5 · Te persigue | apuntar hacia | Bug: solo cuenta el último "mover"; con negativos dice "casi no se mueve"; rangos 6/7 desparejos | Medir la velocidad real; rango 2–6 |
| p3-6 · Ventaja | esperar | Rechaza 0.5; objetivo confuso | Aceptar >0; reescribir |
| p3-7 · Todo junto | "o" con personajes | "perdés" | "se termina el juego" |
| p3-8 · Cierre | — | Falta una pregunta de grados | Sumarla |
| FREE3 | — | Dice "juntá estrellas" y no hay estrellas | Arreglar |

## Parte 4 · Vidas y puntos

| Nivel | Idea nueva | Problema | Arreglo propuesto |
|---|---|---|---|
| p4-obj · Objetos | objeto quieto, ir a posición aleatoria | "ir a posición aleatoria" no se presenta; "personajes" contra "objeto" | Presentarlo; nombre "La moneda también es un objeto" |
| p4-pts · Puntos | variable, sumar a | — | — |
| p4-crear · Crear variable | crear una variable | Sin mensaje si la crea y no la usa | Mensaje |
| p4-cero · Desde cero | dar a … el valor | El aviso solo mira la moneda (falso aviso si la pone en el bichito) | Mirar todos los objetos |
| p4-vidas · Vidas | restar con negativo | — | — |
| p4-corazon · Corazones | (ninguna) | Repite p4-obj; sin "saltar" suma 30 por segundo y gana | Fusionar con p4-vidas |
| p4-golpe · De golpe | esperar después de restar | Objetivo de 4 frases | Acortar |
| p4-igual · ¿Es igual? | "=" como pregunta | No dice que es un bloque verde de Operadores (lo dice el nivel siguiente) | Pasar la frase acá; nota "en Scratch se encastra la bolita" |
| p4-over · Game over | regla de fin | "Falta la regla" aunque solo falte "detener"; exige "=" | Mensaje preciso; aceptar "< 1" |
| p4-ganar · Ganar | (ninguna) | Igual que p4-over; "detuvoAntes" habla del verde | Fusionar con p4-todo |
| p4-reloj · Cronómetro | variable de tiempo | Acepta esperar 2 / sumar 2 | Pedir 1 y 1 |
| p4-regresiva · Regresiva | contar para atrás | Dos cosas en 5 frases; "Ganaste, pero…" cuando se acabó el tiempo | Acortar; arreglar el texto; opción con "repetir 10" |
| p4-todo · Todo junto | dos reglas | Le falta el cartel de la pregunta | Agregarlo |
| p4-cierre | — | Sin pregunta de "=" | Sumarla |

## Parte 5 · Atacar

Mete unas 20 ideas en 14 niveles, muchas escondidas en programas plegados.

| Nivel | Ideas nuevas | Problema | Arreglo propuesto |
|---|---|---|---|
| p5-aplasta | 1 (esconder) | "Aplastala" | "¡Atrapala!" |
| p5-mostrar | 1 (mostrar al empezar) | — | — |
| p5-espacio | 2 (tecla espacio, "y") | La intro no habla de la tecla espacio; un solo mensaje para dos errores distintos | Nivel aparte para la tecla espacio; dos mensajes |
| p5-mensaje | 2 (enviar, al recibir) | Arrastra el "y" del nivel anterior; el "al recibir" ya viene puesto; el chequeo acepta "enviar" en cualquier lugar | Sin "y"; que el chico arme el "al recibir" |
| p5-dedonde | 3 (proyectil, ir a objeto, tecla en otro objeto) | El vuelo está plegado y no se explica | Partir: "la semilla vuela" y después "sale del bichito" |
| p5-pego | 1 | Sin mensaje si falta "enviar" | Mensaje |
| p5-queclon | 3 (clones) | — (buen primer paso) | — |
| p5-clones | 2 (clon de otro objeto, eliminar en el borde) | La intro repite la anterior; "mover 10" en el ejemplo y 15 en el programa | Intro nueva sobre "clon de Semilla" |
| p5-mayor | 2 (> <) | "semillas < 1" para decir cero; la variable aparece sola; el globito queda pegado | "< 3 → ¡Pocas!"; que creen la variable |
| p5-balas | 1 (un recurso que se gasta) | "Munición"; vuelve a explicar ">"; bug: resta antes del clon | "semillas en la bolsa"; arreglar el bug |
| p5-espada | 1 (objeto de vida corta) | Es un arma | Red o burbuja |
| p5-cerca | 2 (alcance, mensaje propio) | El alcance (50 contra 28) no se dice; la avispa reaparece con un programa plegado | Explicarlo |
| p5-lluvia | 4 o más | Salto enorme; el objetivo pide 10 y acepta 5; sin mensaje si falta la regla; "Perdiste" | Intro en pasos; "llegá a 5"; mensajes |
| p5-cierre | 0 | "navecitas" | Renombrar con el tema nuevo |

**Qué usan las partes que siguen:** la parte 6 usa los mensajes y esconder/mostrar, y la 7 usa esconder/mostrar. Clones, > < y semillas no se usan hasta la parte 8. Por eso se puede partir sin romper el encadenamiento.

## Parte 6 · Niveles

| Nivel | Idea nueva | Problema | Arreglo propuesto |
|---|---|---|---|
| p6-escenario | el escenario es un objeto, cambiar fondo | La lava no hace nada (contradice la parte 2); el bloque ya viene con "arena" | Regla de lava plegada; que el chico elija el fondo |
| p6-inicio | fondo al empezar | — | — |
| p6-pasar | volver al inicio al pasar | Si el "ir a" queda en otro lugar, se traba en la pared sin aviso | Avisar si queda adentro de una pared |
| p6-aviso | mensaje para pasar, siguiente fondo | Primera vez que arma un "al recibir"; con un fondo fijo nunca termina y no hay mensaje | Repaso de mensajes; avisar |
| p6-nivel | variable nivel | "nivel = 4" confunde; solo acepta 4 exacto | Aceptar "> 3"; explicarlo |
| p6-cadauno | cuando el fondo cambie a | Nombre del bloque distinto al de Scratch | Corregirlo |
| p6-dificil | variable adentro de un número | El botón "＋ variable" es chico; solo anda en "mover" | Agrandarlo; aclararlo en el modo libre |
| p6-juego | integrar | El ejemplo usa "esperar" y no está en la paleta; acepta +1 | Sacarlo; chequear −1 e "ir a" |
| p6-cierre | arcade | — | — |

## Parte 7 · Animaciones

| Nivel | Idea nueva | Problema | Arreglo propuesto |
|---|---|---|---|
| p7-disfraces | disfraces | Se gana con solo apretar espacio; no verifica la flecha arriba; "feliz" ya viene elegido | Chequear la flecha arriba; que elija el disfraz |
| p7-raras | animar = cambiar con espera | Gana con solo caminar, sin responder la pregunta | Que toque los disfraces que vio |
| p7-caminar | elegir los disfraces por nombre | Sin mensaje si no cambia; no mira el orden de las esperas | Mensajes; chequear el resultado (que se vean los dos pasos) |
| p7-dolor | disfraz para un momento | Bug: el programa de caminar marca "recuperado" y gana sin el "paso 1"; dos programas que cambian el disfraz se pisan | Arreglar el chequeo; explicar el choque |
| p7-parpadeo | repetir + parpadeo | "repetir" viene armado; idea central metida a la pasada | Ver propuestas |
| p7-festejo | disfraz al ganar | Sin mensaje si llega sin festejar | Mensaje |
| p7-todo | "o" con dos flechas | Objetivo largo; dice "Perdiste" | Acortar; "¡Uy! Otra vez" |

## Parte 8 · Creá tu juego

- **No guarda el proyecto:** se pierde al recargar la página.
- **No hay lista de "terminado".**
- **Las ideas no tienen recetas:** falta decir qué personajes y bloques usa cada una.
- **No vienen armadas las variables:** "vidas" y "tiempo" hay que crearlas.

## Cómo encadenan las partes

- Las partes 1 a 3 encadenan bien, salvo dos cosas: "esperar" (p3-dir) y "mirar para un lado" (p3-2) se usan antes de enseñarse.
- **4 → 5:** la parte 5 retoma bien las variables, "=" y "esperar". No usa "crear variable": "semillas" aparece sola.
- **5 → 6:** la parte 6 necesita mensajes y esconder/mostrar. En la parte 5 el chico nunca arrastró un "al recibir" ni un "enviar".
- **7:** "repetir" debería venir aprendido desde la parte 1. En la parte 7 solo se repasa.

## Decisiones (aprobadas por Luca)

- La parte 5 se parte en 3: **Aparecer y avisar**, **Semillas y clones** y **Juntar y comparar**. En total quedan 10 partes.
- Tema nuevo en lugar de espada, disparos y naves: **semillas y burbujas**.
  - La avispa se atrapa con una burbuja y vuelve al panal.
  - Las semillas hacen florecer nubes secas.
  - En lugar de munición, "semillas en la bolsa".
- Los nombres de los bloques siguen el **español de Scratch 3 (es)**. Se corrigen tres:
  - "enviar mensaje" pasa a "enviar".
  - "al cambiar el fondo a" pasa a "cuando el fondo cambie a".
  - "rebotar si toca un borde" pasa a "si toca un borde, rebotar".
- **"repetir" se enseña en la parte 1**: un nivel nuevo en lugar de "¿cuántos bloques?".
- El resto de los arreglos de las tablas se aplica en la Etapa 3.
