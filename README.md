# ¡A Moverse!

Puente hacia Scratch para primaria: se arman programas con bloques iguales a los de Scratch 3 (mismos nombres y colores)
para mover un bichito y armar un juego de a partes: movimiento, choques, enemigos, vidas y puntos, aparecer y avisar,
semillas y clones, juntar y comparar, niveles, animaciones y un modo para crear tu propio juego.

## Usarlo

- **En internet:** GitHub Pages.
- **Sin internet:** `npm run build:pendrive` arma `dist-pendrive/a-moverse.html`. Se copia al pendrive y se abre con doble clic.

## Para cambiar cosas

Todo lo que se ve está en `src/datos/`:

| Qué | Dónde |
| --- | --- |
| Un nivel, su desafío, su pista o su mensaje final | `src/datos/partes/<n>-<parte>.js` |
| Las notas para el docente de una parte | el mismo archivo, en `teach` |
| Una parte nueva | un archivo nuevo en `src/datos/partes/` y una línea en `partes/index.js` |
| Una palabra o un mensaje del juego | `src/datos/textos.js` |
| Lo que dice un bloque | `src/datos/bloques.js` (ETIQUETAS) y su nombre en Scratch en `src/datos/glosario.js` |
| Personajes, programas ya armados, fondos | `personajes.js`, `programas.js`, `fondos.js` |

Cada nivel tiene un `id` que no se cambia: el avance de los chicos se guarda con él.
Si cambiás un nivel, actualizá su solución en `tests/soluciones.js` y corré `npm test`.

## Comandos

```
npm install            # una vez
npm run dev            # para probar mientras se cambia algo
npm test               # cada nivel se gana con su solución (un piloto automático lo juega)
npm run build          # versión para GitHub Pages
npm run build:pendrive # un solo HTML para usar sin internet
```

## Cómo está hecho

- `src/motor/`: el intérprete de bloques y las reglas de cada nivel, sin pantalla.
- `src/dibujo/`: el escenario y la portada (canvas).
- `src/interfaz/`: editor de bloques, botones, menú y ventanas.
- `herramientas/`: capturas, comparación con el original y recorridos tocando botones.
