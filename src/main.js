import './estilos/estilos.css';
import { conectarMotor } from './interfaz/conectar.js';
import { ponerTextos } from './interfaz/textos-pantalla.js';
import { iniciarGuardado } from './guardado.js';
import { iniciarPartida } from './motor/partida.js';
import { iniciarAviso } from './interfaz/aviso.js';
import { iniciarVentanas } from './interfaz/ventanas.js';
import { iniciarControles } from './interfaz/controles.js';
import { iniciarEscenario } from './dibujo/escenario.js';
import { iniciarBucle } from './interfaz/bucle.js';
import { iniciarMenu } from './interfaz/menu.js';
import { S } from './estado.js';
import { LEVELS1 } from './datos/partes/1-movimiento.js';
import { PARTS } from './datos/partes/index.js';
import { fit } from './dibujo/escenario.js';
import { loop } from './interfaz/bucle.js';
import { go, showPart, showParts } from './interfaz/menu.js';
import { loadLevel } from './motor/partida.js';

ponerTextos();
conectarMotor();
iniciarGuardado();
iniciarPartida();
iniciarAviso();
iniciarVentanas();
iniciarControles();
iniciarEscenario();
iniciarBucle();
iniciarMenu();


S.P = PARTS[0];
S.li = 0;
loadLevel(LEVELS1[0]);
showParts();
fit();
requestAnimationFrame(loop);

/* Acceso para las pruebas automáticas (capturas y recorridos); el juego no lo usa. */
window.amoverse = { S, PARTS, go, showPart, showParts, loadLevel };
