/* =========================================================================
   Escenas del celular de María (numeración del guion final del Ep. 4).
   Cada escena: dónde arranca (app/pantalla) y sus "momentos" en orden.
   Los momentos se disparan con doble toque abajo a la derecha, desde el menú
   ("Disparar ya") o solos a los X segundos (se configura en el menú).
   Hora, batería, fecha y demoras de cada escena: js/config.js → scenes.
   ========================================================================= */
(() => {
  'use strict';
  const P = window.PHONE;
  const F = (screen, p) => ({ app: 'flashi', screen, p });

  P.scenes([
    {
      id: '44', when: 'DÍA', title: 'Entrega tarde a Clara',
      desc: 'FLASHI con la cuenta regresiva de 1 minuto. Al llegar a 0 (o con doble toque) llega “¡Estuviste cerca…! ¡Entregaste tarde!”.',
      app: 'flashi', screen: 'delivering', timer: 'start',
      texts: [['texts.t44_urgent', 'Texto en pantalla'], ['texts.t44_failHead', 'Pantalla de bono perdido · título [INVENTADO]'], ['texts.t44_failSub', 'Pantalla de bono perdido · texto [INVENTADO]']],
      cues: [
        { label: 'Notificación: entregaste tarde', notif: { text: 't44_late', urgent: true, open: F('fail') } },
        { label: 'Abrir la pantalla de bono perdido', open: F('fail') }
      ]
    },
    {
      id: '46', when: 'NOCHE', title: 'Mensaje de Gloria y llamadas',
      desc: 'Chat abierto con Gloria (“Nena, el alquiler?” de las 10:00). Entra la llamada de Daniel (la corta) y después la de Gloria (la atiende). La hora arranca en 22:00.',
      app: 'chat', screen: 'thread', p: { thread: 'gloria' },
      cues: [
        { label: 'Llamada entrante de Daniel (la corta)', call: 'daniel' },
        { label: 'Llamada entrante de Gloria (la atiende y después corta)', call: 'gloria' }
      ]
    },
    {
      id: '47', when: 'DÍA', title: 'Corta con la obra social y mira la cuna en Guardado',
      desc: 'Arranca en una llamada en curso: ella corta y queda en el inicio. Abre Portal → menú (≡) → Guardado → la cuna de $200.000.',
      app: 'home', screen: 'home', startCall: { who: 'obra' }, starts: [['call', 'Llamada en curso'], ['app', 'Inicio'], ['lock', 'Bloqueo']],
      cues: [
        { label: 'Por si hace falta: abrir Portal en Guardado', open: { app: 'portal', screen: 'saved' } },
        { label: 'Por si hace falta: abrir la publicación de la cuna', open: { app: 'portal', screen: 'post' } }
      ]
    },
    {
      id: '48', when: 'DÍA', title: 'Propina extra',
      desc: 'Pantalla bloqueada. Llega “te han dejado propina extra por $5000”. Al tocarla se abre Ganancias.',
      app: 'flashi', screen: 'home',
      cues: [
        { label: 'Notificación: propina extra de $5000', notif: { text: 't48_tip', open: F('earnings', { hl: 'tip' }) } },
        { label: 'Abrir Ganancias con la propina', open: F('earnings', { hl: 'tip' }) }
      ]
    },
    {
      id: '52', when: 'DÍA', title: 'Plaza: llamada de Daniel y alta demanda',
      desc: 'Bloqueada y desconectada de FLASHI. Llamada de Daniel (la corta) → “Alta demanda…” → “Últimos 30 segundos…” (arranca la cuenta) → toca y acepta.',
      app: 'flashi', screen: 'home', p: { online: false }, timer: 'cue',
      cues: [
        { label: 'Llamada entrante de Daniel (la corta)', call: 'daniel' },
        { label: 'Notificación: alta demanda', notif: { text: 't52_demand', urgent: true, open: F('home') } },
        { label: 'Notificación: últimos 30 segundos (arranca la cuenta)', timer: true, notif: { text: 't52_last', urgent: true, open: F('offer', { variant: 'demand', dest: 'oferta' }) } },
        { label: 'Abrir la oferta con la cuenta regresiva', open: F('offer', { variant: 'demand', dest: 'oferta' }) }
      ]
    },
    {
      id: '55', when: 'NOCHE', title: 'Escribe a Daniel y lo borra',
      desc: 'Chat con Daniel abierto. Ella toca “Mensaje” y escribe con el teclado (cualquier tecla escribe el texto del guion) y lo borra. Después puede ir a Portal → Guardado → sacar la cuna. Llega el bono de $50.000.',
      app: 'chat', screen: 'thread', p: { thread: 'daniel' },
      cues: [
        { label: 'Escribir y borrar solo (si el celular está desenfocado)', fn: (A) => P.apps.chat.autoType(A) },
        { label: 'Notificación: último pedido por $50.000', notif: { text: 't55_bonus', open: F('offer', { variant: 'bonus', dest: 'oferta' }) } }
      ]
    },
    {
      id: '55B', when: 'NOCHE', title: 'Saca la cuna de Guardado y llega el bono',
      desc: 'Arranca en Portal, en la publicación de la cuna. Ella toca el ícono de guardado para sacarla. Llega “Realizá un último pedido por un bono de $50.000” encima de Portal; la toca y acepta.',
      app: 'portal', screen: 'post',
      cues: [
        { label: 'Notificación: último pedido por $50.000', notif: { text: 't55_bonus', open: F('offer', { variant: 'bonus', dest: 'oferta' }) } },
        { label: 'Abrir la oferta del bono', open: F('offer', { variant: 'bonus', dest: 'oferta' }) }
      ]
    },
    {
      id: '59', when: 'DÍA', title: 'Bono, 5% más activos, 30 entregas y llamada de Clara',
      desc: 'FLASHI abierta. Bono de $50.000 → “Sos parte del 5%…” → “Para mantener tu categoría…” → llamada de Clara (la atiende).',
      app: 'flashi', screen: 'home',
      cues: [
        { label: 'Notificación: recibiste el bono de $50.000 [INVENTADO]', notif: { text: 't59_bonus', open: F('earnings', { hl: 'bonus' }) } },
        { label: 'Notificación: sos parte del 5%', notif: { text: 't59_top', open: F('badge') } },
        { label: 'Notificación: 30 entregas más', notif: { text: 't59_quota', urgent: true, open: F('quota') } },
        { label: 'Llamada entrante de Clara (la atiende)', call: 'clara' }
      ]
    },
    { id: 'libre', when: '', title: 'Uso libre', desc: 'Inicio del celular, sin momentos. Para planos generales o para ensayar.', app: 'home', screen: 'home', cues: [] }
  ]);
})();
