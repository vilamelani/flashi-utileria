# FLASHI · utilería digital para el Episodio 4 de GUITA

Web apps que las actrices usan **en cámara** durante el rodaje. Directora: Mel (co-dirige con Candela Berbel).
Se publican con GitHub Pages desde la raíz: `https://vilamelani.github.io/flashi-utileria/`

| Ruta | Qué es | Celular |
|---|---|---|
| `maria/` | **Celular de María**: un Android falso entero con FLASHI Delivery, Chat, Portal, llamadas, bloqueo e inicio | Android, Chrome, instalada |
| `eats.html` | **FLASHI EATS**, app de Clara (versión 1, todavía sin migrar) | iPhone 15 Pro, Safari, instalada |
| `index.html` | Página de inicio con links | — |
| `delivery.html` | Redirección a `maria/` (el link viejo) | — |
| `archivo/fuente-v1/` | Fuente de la versión 1 (build en un solo archivo). Se usa sólo para migrar EATS. **No correr su `build.py`**: pisaría la raíz. | — |

## Cómo trabajar con Mel
- Español rioplatense (voseo). **Ante cualquier duda, preguntar; no asumir.**
- Textos del guion **literales** (guion final del Ep. 4, escenas 44 a 63). Lo inventado se marca `[INVENTADO]` en `config.js` y se le avisa.
- Todo tiene que ser **configurable desde el menú oculto** (como en PORTAL): textos, datos, horas, fotos desde la galería.
- Mensajería, llamadas e Instagram **se arman en la app** (decisión del 12/11/2026; antes iban en post).

## Estructura (igual que PORTAL / postal-utileria): sin build
Se edita directo y se publica con `git push`. **Al cambiar cualquier archivo de `maria/`, subir `VERSION` en `maria/sw.js`** (los celulares toman la actualización al abrir la app con internet, cerrarla y volver a abrirla).

```
maria/
  index.html  manifest.webmanifest  sw.js
  css/app.css      sistema: barra de estado, rayita, bloqueo, notificaciones, llamadas, inicio, pantalla de equipo, menú
  css/flashi.css   FLASHI (todo bajo .app-flashi)   css/chat.css   css/portal.css
  js/config.js     VALORES POR DEFECTO (textos, datos, contactos, chats, Portal, hora/batería/demoras por escena)
  js/core.js       motor: estado, capas, notificaciones, llamadas, cuenta regresiva, momentos, gestos, menú, fotos (IndexedDB)
  js/flashi.js     app FLASHI + mapa SVG       js/chat.js   chat genérico + teclado mágico
  js/portal.js     Portal (perfil, menú, Guardado, publicación)   js/home.js  inicio del Android
  js/scenes.js     escenas y sus momentos (cues)
  fonts/  icons/   (portal.png = mismo ícono que PORTAL)
```

### Motor (`core.js`)
- `PHONE.app({id, name, icon, small, color, home, tone, screens, actions, after, onEnter, onSceneStart})` registra una app.
- Navegación: `A.open(app, screen, p)`, `A.go(screen, p)` (dentro de la app actual), `A.set(p)`.
- Capas sobre la pantalla: bloqueo (`#lockL`), llamada (`#callL`), notificaciones arriba (`#hu`). Las notificaciones de cualquier app aparecen sobre cualquier otra (ej.: FLASHI sobre Portal en la 55B).
- Cue: `{label, notif:{text, urgent, open:{app,screen,p}}, open, call:'daniel', timer:true, stopTimer, set, fn}`.
- Demoras por cue en `config.scenes[id].delays` (0 = a mano). `onZero:'next'` dispara el siguiente cue cuando la cuenta llega a 0.
- Ajustes: se guarda sólo lo modificado en localStorage `flashi.maria.v2` y se mezcla con `config.js`. Fotos en IndexedDB `flashi-maria`.
- Gestos (por coordenadas, no bloquean botones): mantener 1 s arriba-izq = menú · doble toque abajo-der = siguiente momento · mantener 1 s abajo-der = congelar cuenta · deslizar desde la rayita = inicio.

## Escenas del celular de María (rodaje: sábado 14/11/2026)
44 entrega tarde (cuenta corriendo) · 46 bloqueo → notificación de Gloria → chat + llamadas (Daniel/Gloria) · 47 llamada en curso → Portal → Guardado → cuna $200.000 · 48 propina · 52 llamada Daniel + alta demanda + 30 s → oferta de Giandutti → mapa con los dos puntos · 55 escribe y borra a Daniel · 55B desde el inicio → Portal → saca la cuna de Guardado + bono $50.000 (Timmy's) · 59 bloqueo → bono + 5% + 30 entregas + llamada de Clara · uso libre.

Locales (pedidos de Mel, 13/11): local 1 = Timmy's · Hamburguesas Smash, Laprida 2542 (logo en `maria/img/locales/timmys.png`); local 2 = Giandutti, Av. Pueyrredón 1527 (foto de chocolates en `giandutti.jpg`). Guardado de Portal: 14 publicaciones fijas en `maria/img/guardado/` (recortadas de capturas de Mel) + la cuna. EATS (v1) todavía dice Burger Voraz: cambiar al migrar.

## Pendiente
- **Migrar EATS** (Clara) a esta estructura antes de su rodaje (≈ 26/11/2026). Escenas nuevas de Clara: 45, 48, 49 (FLASHI EATS) y 58 (Portal: Instagram de María con zoom a selfies). La 57 (Clara agenda su número en el celular de María) va en el celular de María.
- Respetar los arreglos de iOS 26 de la v1 (en `archivo/fuente-v1`): con barra real y `black-translucent`, contenido a `env(safe-area-inset-top) + 42px`; `100lvh` en modo instalado; los `<meta apple-mobile-web-app-*>` se congelan al instalar.
- Sin probar todavía en el Android real de María.
