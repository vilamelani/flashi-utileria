/* =========================================================================
   GUITA · Episodio 4 · CELULAR DE MARÍA (Android)
   Configuración por defecto. Todo esto se puede cambiar también desde el
   menú oculto (mantener apretada 1 segundo la esquina superior izquierda),
   y lo que se cambia ahí queda guardado en ese celular.

   Los textos marcados [INVENTADO] no están en el guion: confirmar con Mel.
   Los textos sin marca son LITERALES del guion del Episodio 4 (versión final).
   ========================================================================= */

window.MARIA_DEFAULTS = {

  /* ---------------- Teléfono ---------------- */
  phone: {
    clock: 'scene',            // 'scene' = hora fija de cada escena (editable) · 'device' = hora real del celular
    date: 'jueves, 14 de noviembre', // [INVENTADO] fecha de la pantalla bloqueada (cada escena puede tener la suya)
    carrier: 'Austral',        // operadora ficticia (decisión general de GUITA)
    signal: 3,                 // 0 a 4 rayitas
    net: '5G',                 // texto al lado de la señal: '5G', '4G', 'LTE' o vacío
    wifi: false,               // en la calle no hay wifi
    statusBar: 'auto',         // 'auto' | 'on' | 'off'  (barra de estado falsa; en Android instalada se ve la falsa)
    banners: 'fixed',          // notificaciones dentro de una app: 'fixed' quedan fijas · 'auto' se van a los 6 s
    vibrateCalls: true,        // vibración cuando entra una llamada (el sonido va en post)
    vibrateNotifs: true,       // vibración corta con cada notificación
    autoFullscreen: true,      // si se abre desde el navegador, pide pantalla completa al primer toque
    launch: 'menu',            // dónde abre la app al tocar el ícono: 'menu' (lista de escenas) o una escena ('52', '55B'...)
    zones: false               // pintar las zonas ocultas (para ensayar)
  },

  /* ---------------- Datos de la ficción ---------------- */
  data: {
    rider: 'María G.',               // [INVENTADO] apellido
    riderId: '#R-4471',              // [INVENTADO]
    cliente: 'Clara M.',             // [INVENTADO] apellido
    dirCliente: 'Av. Rivadavia 4120, 7º B', // [INVENTADO]
    local: "Timmy's",                // pedido de Clara (44) y oferta del bono (55)
    localSub: 'Hamburguesas Smash',
    localDir: 'Laprida 2542',
    local2: 'Giandutti',             // oferta de la 52
    local2Sub: 'Chocolates',         // [INVENTADO] rubro que se muestra debajo del nombre
    local2Dir: 'Av. Pueyrredón 1527',
    dirOferta: 'Av. La Plata 890, 3º A', // [INVENTADO] dirección del pedido que acepta en la 52 y la 55
    pedido: '#88213',                // [INVENTADO]
    montoOferta: '$3.200',           // [INVENTADO] lo que paga el pedido ofrecido
    gananciasHoy: '$18.450',         // [INVENTADO]
    entregasHoy: '12',               // [INVENTADO]
    saldoSemana: 63450,              // [INVENTADO] saldo de la semana en Ganancias (número, sin $)
    puntualidad: '74%',              // [INVENTADO]
    categoria: 'Bronce',             // [INVENTADO]
    obraSocial: 'Plan Salud Familiar' // [INVENTADO] quién está en la llamada al empezar la 47
  },

  /* ---------------- Textos de la app FLASHI ---------------- */
  texts: {
    t44_urgent: '¡Rápido! Solo queda 1 minuto para entregar tu pedido y participar por el bono de $10.000',
    t44_late: '¡Estuviste cerca pero no fue suficiente! ¡Entregaste tarde! Será la próxima!',
    t44_failHead: '¡Entregaste tarde!',                                   // [INVENTADO] título de la pantalla (sale de la notificación)
    t44_failSub: '¡Estuviste cerca pero no fue suficiente! Será la próxima.', // [INVENTADO] (sale de la notificación)
    t48_tip: 'te han dejado propina extra por $5000',
    t52_demand: 'Alta demanda en tu zona. Si permanecés desconectado de la app perderás prioridad para futuros pedidos.',
    t52_last: 'Últimos 30 segundos para aceptar',
    t55_bonus: 'Realizá un último pedido por un bono de $50.000',
    t59_bonus: 'Recibiste un bono de $50.000',                           // [INVENTADO] el guion dice "MARÍA recibe un bono de $50.000"
    t59_top: '¡Felicitaciones! Sos parte del 5% de repartidores más activos de la zona.',
    t59_quota: 'Para mantener tu categoría debés completar 30 entregas más esta semana.'
  },

  /* ---------------- Contactos (llamadas y chat) ---------------- */
  contacts: {
    gloria: { name: 'Gloria', sub: 'Móvil', number: '+54 9 11 4782-1190' },  // número [INVENTADO]
    daniel: { name: 'Daniel', sub: 'Móvil', number: '+54 9 11 5531-0427' },  // número [INVENTADO]
    clara:  { name: 'Clara',  sub: 'Móvil', number: '+54 9 11 6120-8835' }   // número [INVENTADO]
  },

  /* ---------------- App de chat (genérica, sin logo de WhatsApp) ---------------- */
  chat: {
    appName: 'Chat',   // [INVENTADO] mismo criterio que en PORTAL: app de chat genérica
    // Conversaciones. Una línea por mensaje:
    //   "10:00 texto"  → mensaje recibido a esa hora
    //   "> 10:05 texto" → mensaje enviado por María
    //   "-- ayer"       → separador de día
    //   "!! texto"      → aviso del sistema (centrado), ej.: mensajes temporales
    threads: {
      gloria: '!! Los mensajes temporales están activados. Los mensajes nuevos desaparecen de este chat 24 horas después de enviarse.\n-- hoy\n10:00 Nena, el alquiler?',   // aviso [INVENTADO]
      daniel: '-- martes\n19:12 Atendeme María. Conseguí un trabajo mejor. ¿Podemos intentarlo?\n-- ayer\n21:40 María por favor atendeme\n21:41 Te llamé 3 veces',   // 1ª línea: Ep. 1, esc. 9F. Lo demás [INVENTADO]
      clara: ''
    },
    listExtra: [   // [INVENTADO] otras conversaciones que se ven en la lista (nombre | último mensaje | hora)
      'Mami | Audio (0:42) | ayer',
      'Riders Almagro | Lucas: alguien sabe si está andando la app? | ayer',
      'Vero | jajaja dale, después te cuento | lunes'
    ],
    notifWhen: 'ahora',   // qué hora muestra la notificación de Gloria en la 46 ('ahora', '10:00'…)
    typeText: 'Hola Daniel, necesito pedirte algo…',   // lo que escribe y borra en la 55
    typeSpeed: 9,                                        // letras por segundo cuando se escribe solo
    eraseAfter: 2.5                                      // segundos antes de borrar solo
  },

  /* ---------------- Portal (app tipo Instagram) ---------------- */
  portal: {
    appName: 'Portal',
    theme: 'light',                 // 'light' | 'dark'
    username: 'mari.gimenez',       // [INVENTADO]
    fullName: 'María',              // [INVENTADO]
    bio: 'Bici, mate y a seguir 🚲',  // [INVENTADO]
    posts: 2,                       // también es cuántas fotos se ven en su perfil (máx. 9): se cargan en Fotos → foto 1, foto 2…
    followers: 312,                 // [INVENTADO]
    following: 405,                 // [INVENTADO]
    saved: {                        // la publicación de la cuna (47 y 55)
      account: 'cunitas.de.madera', // [INVENTADO]
      caption: 'Cuna blanca con mosquitero y chichonera 🤍 Lista para entregar. $200.000. Envíos a todo el país, consultas por mensaje.', // [INVENTADO] salvo "$200.000"
      likes: '1.284',               // [INVENTADO]
      comments: '86',               // [INVENTADO]
      when: '3 de noviembre'        // [INVENTADO]
    },
    cunaPos: 4,                     // en qué lugar de Guardado aparece la cuna (1 = primera)
    // Publicaciones fijas de Guardado (recortadas de las capturas que pasó Mel), en este orden
    savedImages: ['s-postres', 's-bebe', 's-perro', 's-esposo', 's-mate', 's-piel', 's-historias', 's-calabacines', 's-agenda', 's-budin', 's-bilardo', 's-vitaminac', 's-pancitos', 's-tipografias']
  },

  /* ---------------- Escenas ----------------
     Por escena: hora, batería, dónde arranca y cuándo se disparan solos los momentos.
     delays: segundos para disparar cada momento solo (0 = sólo a mano: doble toque abajo a la derecha). */
  scenes: {
    '44':  { time: '12:58', batt: 48, start: 'app',  date: '', dur: 60, run: 'run', onZero: 'next', delays: [0, 0] },
    '46':  { time: '22:00', batt: 23, start: 'lock', date: '', delays: [0, 0, 0] },
    '47':  { time: '10:41', batt: 71, start: 'call', date: '', delays: [] },
    '48':  { time: '13:07', batt: 37, start: 'lock', date: '', delays: [0, 0] },
    '52':  { time: '14:37', batt: 14, start: 'lock', date: '', dur: 30, delays: [0, 0, 0, 0] },
    '55':  { time: '23:05', batt: 9,  start: 'app',  date: '', delays: [0, 0], afterErase: 0 },   // afterErase: segundos después de que borra todo para que llegue el bono (0 = no)
    '55B': { time: '23:07', batt: 9,  start: 'app',  date: '', delays: [0, 0] },   // arranca en el inicio del celular
    '59':  { time: '14:40', batt: 31, start: 'lock', date: '', delays: [0, 0, 0, 0] },
    'libre': { time: '17:45', batt: 52, start: 'app', date: '', delays: [] }
  }
};
