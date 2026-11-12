# FLASHI · utilería digital para el Episodio 4

Dos web apps que las actrices usan **en cámara** durante el rodaje. Directora: Mel.
Se publican con GitHub Pages desde la raíz de este repo:
`https://vilamelani.github.io/flashi-utileria/`

- `delivery.html` → **FLASHI Delivery**, app de **María** (rider). Se usa en un **Android**, instalada desde Chrome.
- `eats.html` → **FLASHI EATS**, app de **Clara** (clienta). Se usa en un **iPhone 15 Pro**, instalada desde Safari.
- `index.html` → página de inicio con links a las dos.

## Cómo trabajar con Mel
- Habla en español rioplatense (voseo). Responder en ese registro.
- Pidió explícitamente: **ante cualquier duda, preguntar; no asumir.** Proponer, mostrar y confirmar antes de cambios grandes.
- Los textos del guion van **literales**. Lo inventado se marca como tal y se confirma con ella.

## Flujo para cambios (importante)
1. Editar solo en `fuente/src/`. **Nunca** editar a mano los `.html` de la raíz: se regeneran.
2. Construir: `python3 fuente/build.py` → regenera en la raíz `delivery.html`, `eats.html`, `*.webmanifest`, `sw.js`, `index.html`, `LEEME.txt`. `sw.js` lleva una versión nueva en cada build (así los celulares toman la actualización).
3. `git add -A && git commit && git push` → GitHub Pages publica solo en 1–2 min.
4. En los celulares: abrir la app con internet, cerrarla del todo y volver a abrirla (el service worker es cache-first).
- Los íconos (`*-192.png`, `*-512.png`, `*-apple.png`) ya están generados; no hace falta rehacerlos.
- Todo va **plano en la raíz** (sin subcarpetas): Mel sube a veces por la web de GitHub y las carpetas se aplanaban y se pisaban archivos.
- Las fuentes (Unbounded y Manrope) se embeben en base64 desde `fuente/fonts/`: la app funciona 100% offline.
- `fuente/dist-artifact/` (ignorado por git) tiene versiones sin `<head>` para publicar como artifact de Claude, si hiciera falta.

## Arquitectura (`fuente/src/`)
- `core.js` → motor común: escenas y "momentos" (cues), pantalla de bloqueo falsa (Android / iOS), notificaciones (banner del sistema), cuenta regresiva congelable, reloj por escena, menú oculto, gestos invisibles, ajustes en localStorage (`flashi-<app>-v1`).
- `core.css` → estilos comunes (dirección visual "A · Pulso"), bloqueo, notificaciones, menú.
- `map.js` → mapa estilizado en SVG (no es un mapa real).
- `delivery.js/.css` → pantallas, textos, datos y escenas de María.
- `eats.js/.css` → pantallas, textos, datos y escenas de Clara (incluye un chat genérico, NO de FLASHI, para el audio de la madre).
- Cada app declara: `data` (datos editables), `texts` (textos editables, con `{variables}`), `scenes` (con `cues`), `actions`, `screens`.
- Tipos de cue: `notif` (texto, `open` pantalla al tocarla), `go`, `set` (params), `timer:true` (arranca la cuenta), `stopTimer`, `fn`.

## Dirección visual elegida: A · Pulso
- Fondo `#060D09`, superficies `#0E1A13` / `#16271D`, **verde marca `#1EF08A`** (pedido de Arte: el primario es verde), **rojo urgencia `#FF2B4A`**, texto `#E9F4EE`, apagado `#7E958A`.
- Unbounded (títulos, montos) + Manrope (texto). Bordes redondeados, brillos (glow) en montos y timers.
- Sensación buscada: app real y bien diseñada, pero con la "violencia capitalista" de la urgencia de comprar y vender.

## Decisiones de Mel (confirmadas)
- María Android / Clara iPhone. Notificaciones **sin sonido** (se hace en post). Se filman **en cámara** (insert real).
- Notificaciones sobre **pantalla de bloqueo falsa que imita el sistema real** (Android para María, iOS para Clara).
- **Menú oculto por escena**: se abre con **3 toques arriba a la izquierda** (logo o reloj).
- **Toque invisible abajo a la derecha**: 1 toque = siguiente momento; 2 toques = congelar/seguir el timer.
- Reloj **fijo por escena** (María, barra de estado falsa). En iPhone la barra es la real: la hora se ajusta a mano en el iPhone; el reloj de bloqueo de Clara usa la hora del teléfono por defecto.
- Timers congelables y con duración configurable. Mapa estilizado en Esc 5 y 8. Audio de la madre: solo visual (la voz va en post).
- Reclamo de Esc 2: estrellas + motivos. Propina de Esc 6: no se ve del lado de Clara.
- WhatsApp/llamadas/Instagram reales: fuera de alcance por ahora ("lo vemos después").

## Escenas implementadas
María: Esc 1 (1 min + entrega tarde), 5 (bono 1 min → ganaste $10.000), 6 (propina $5000), 8 (nuevo pedido con dirección de Clara), 11 (alta demanda → últimos 30 s → Aceptar), 14 (bono $50.000 → Aceptar), 15 (completaste a tiempo), 20-I (bono, top 5%, 30 entregas más), uso libre.
Clara: Esc 2 (calificar: tarde y frío), 6 (seguimiento hasta que llega), 7 (chat con audio de mamá → cupón $8000 → "Pedir otra vez"), uso libre.

## Pendiente de confirmar con Mel (inventado por Claude)
- Textos: "Recibiste un bono de $50.000" (Esc 20), notificaciones de Clara en Esc 2 y 6, "Te acreditamos $1.500…" y "Tu calificación impacta en el puntaje de la repartidora".
- Datos: Burger Voraz, direcciones (Av. Rivadavia 4120 7º B, etc.), montos, #R-4471, Categoría Bronce/Plata, insignia "Rayo", "cargo por uso de la app", calles reales de Caballito en el mapa.
- Esc 14 sin cuenta regresiva (el guion no la menciona). Esc 1: el timer arranca pausado.
- Banners de notificación quedan fijos hasta tocarlos (configurable a 6 s).

## Problemas de iOS 26 ya resueltos (no romper)
- El sistema aplica un desenfoque "Liquid Glass" ~40 pt debajo de la barra de estado en web apps instaladas con `black-translucent`. Solución: en iOS con barra real, `--sbh = env(safe-area-inset-top) + 42px` (en `core.js`, `applyBar`).
- `height:100%` queda corto en modo instalado y deja una franja abajo. Solución: `@media (display-mode: standalone){html,body{height:100lvh}}` en `core.css`.
- No cambiar los `<meta apple-mobile-web-app-*>` sin avisar: iOS los congela al instalar (habría que reinstalar).
- Sin probar aún en dispositivos reales: el Android de María.
