/* =========================================================================
   FLASHI Delivery · la app de María (rider)
   Dirección visual: fondo casi negro verdoso, verde #1EF08A (Arte), rojo #FF2B4A.
   ========================================================================= */
(() => {
  'use strict';
  const P = window.PHONE;

  /* Mapa estilizado (no es un mapa real) */
  const C = [195, 280], ANG = -14 * Math.PI / 180;
  const rot = (p) => { const dx = p[0] - C[0], dy = p[1] - C[1]; return [C[0] + dx * Math.cos(ANG) - dy * Math.sin(ANG), C[1] + dx * Math.sin(ANG) + dy * Math.cos(ANG)]; };
  function along(pts, f) {
    const L = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
    let t = Math.max(0, Math.min(1, f)) * tot;
    for (let j = 0; j < L.length; j++) { if (t <= L[j]) { const r = L[j] ? t / L[j] : 0; return [pts[j][0] + (pts[j + 1][0] - pts[j][0]) * r, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * r]; } t -= L[j]; }
    return pts[pts.length - 1];
  }
  const ROUTE = [[120, 560], [120, 280], [280, 280], [280, 140]];
  function MAP(o = {}) {
    const prog = o.prog == null ? 0.18 : o.prog, id = 'm' + Math.random().toString(36).slice(2, 7);
    let g = '';
    for (let x = -120; x <= 520; x += 80) g += `<line x1="${x}" y1="-200" x2="${x}" y2="760" stroke="#11201A" stroke-width="11"/>`;
    for (let y = -140; y <= 700; y += 70) g += `<line x1="-200" y1="${y}" x2="600" y2="${y}" stroke="#11201A" stroke-width="11"/>`;
    g += '<line x1="-200" y1="280" x2="600" y2="280" stroke="#18301F" stroke-width="22"/><line x1="-220" y1="700" x2="620" y2="-160" stroke="#142A1C" stroke-width="16"/>';
    g += '<rect x="208" y="358" width="64" height="54" rx="6" fill="#0B2616"/><rect x="48" y="78" width="64" height="54" rx="6" fill="#0B2616"/>';
    const lab = 'font-family="Manrope,system-ui,sans-serif" font-size="10.5" font-weight="700" fill="#4D6B5A" letter-spacing=".5"';
    g += `<text x="318" y="275" ${lab}>AV. RIVADAVIA</text><text x="-30" y="345" ${lab}>YERBAL</text><text ${lab} transform="translate(196 470) rotate(-90)">HIDALGO</text><text ${lab} transform="translate(116 540) rotate(-90)">ACOYTE</text>`;
    const pts = ROUTE.map((p) => p.join(',')).join(' ');
    g += `<polyline points="${pts}" fill="none" stroke="#1EF08A" stroke-width="12" stroke-linejoin="round" opacity=".35" filter="url(#${id})"/><polyline points="${pts}" fill="none" stroke="#1EF08A" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`;
    const me = rot(along(ROUTE, prog)), pin = rot(ROUTE[ROUTE.length - 1]);
    return `<svg viewBox="0 0 390 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>` +
      `<radialGradient id="${id}v" cx="50%" cy="45%" r="70%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".65"/></radialGradient></defs>` +
      `<rect width="390" height="560" fill="#07110B"/><g transform="rotate(-14 195 280)">${g}</g>` +
      `<g transform="translate(${pin[0].toFixed(1)} ${pin[1].toFixed(1)})"><path d="M0 0C-4-8-15-15-15-26a15 15 0 1 1 30 0C15-15 4-8 0 0Z" fill="#FF2B4A" filter="url(#${id})" opacity=".7"/><path d="M0 0C-4-8-15-15-15-26a15 15 0 1 1 30 0C15-15 4-8 0 0Z" fill="#FF2B4A"/><circle cy="-26" r="5.5" fill="#fff"/></g>` +
      `<g transform="translate(${me[0].toFixed(1)} ${me[1].toFixed(1)})"><circle r="12" fill="none" stroke="#1EF08A" stroke-width="2"><animate attributeName="r" from="10" to="30" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" from=".8" to="0" dur="1.8s" repeatCount="indefinite"/></circle><circle r="10" fill="#1EF08A" stroke="#05120A" stroke-width="4"/></g>` +
      `<rect width="390" height="560" fill="url(#${id}v)"/></svg>`;
  }

  const TAB = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/></svg>',
    money: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2.5" y="6" width="19" height="13" rx="3"/><circle cx="12" cy="12.5" r="3"/><path d="M6 6V4.5h12V6"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>'
  };
  const BOLT = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 2 4 13.5h6.5L9.5 22 20 9.8h-6.6Z"/></svg>';
  const ICON = '<svg viewBox="0 0 64 64"><rect width="64" height="64" fill="#060D09"/><text x="14" y="46" font-family="Unbounded,system-ui,sans-serif" font-weight="800" font-size="40" fill="#E9F4EE">f</text><circle cx="45" cy="42" r="6" fill="#1EF08A"/></svg>';
  const ARROW = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19V11a4 4 0 0 1 4-4h10M15 3l4 4-4 4"/></svg>';

  const first = (n) => String(n).split(' ')[0];
  const tabs = (on) => `<nav class="tabs">${[['home', 'Inicio', TAB.home], ['earnings', 'Ganancias', TAB.money], ['orders', 'Pedidos', TAB.list], ['profile', 'Perfil', TAB.user]].map(([k, l, ic]) => `<span data-act="tab" data-to="${k}" class="${k === on ? 'on' : ''}">${ic}${l}</span>`).join('')}</nav>`;
  const top = (A) => { const on = A.p.online !== false; return `<div class="top"><span class="logo">flashi<i></i><small>Delivery</small></span><button class="chip${on ? '' : ' off'}" data-act="toggleOnline"><span class="dot"></span>${on ? 'Conectada' : 'Desconectada'}</button></div>`; };

  P.app({
    id: 'flashi', name: 'FLASHI', label: 'FLASHI', icon: ICON, small: BOLT, color: '#1EF08A', colorText: '#06140c',
    home: 'home', tone: () => 'light',
    onSceneStart(A, s) { if (A.p.online == null) A.p.online = true; },
    actions: {
      toggleOnline: (A) => A.set({ online: A.p.online === false }),
      tab: (A, el) => { let to = el.dataset.to; if (to === 'orders' || to === 'profile') to = 'home'; A.go(to, to === 'earnings' ? { hl: null } : null); },
      accept: (A) => { A.timer.run = false; A.go('map', { mode: 'pick', prog: .12, online: true }); },
      reject: (A) => { A.timer.run = false; A.go('home'); },
      confirm: (A) => {
        const m = A.p.mode;
        if (m === 'pick') { A.go('map', { mode: 'drop', prog: .2 }); return; }
        if (A.scene && A.scene.id === '44') { A.go('fail'); return; }
        if (A.timer.on && A.timer.left <= 0) { A.go('fail'); return; }
        A.timer.run = false; A.go('success');
      },
      flashiHome: (A) => A.go('home', { online: true }),
      quota: (A) => A.go('quota')
    },
    screens: {
      home(A) {
        const D = A.D(), on = A.p.online !== false;
        const bars = [14, 22, 18, 30, 26, 36, 20, 40].map((h, i) => `<i class="${i === 7 ? 'hi' : ''}" style="height:${h}px"></i>`).join('');
        return top(A) +
          `<div class="hello"><small>Turno de hoy · 6 h 12 min</small><h2>Hola, ${A.esc(first(D.rider))}</h2></div>` +
          `<div class="card earn"><span class="lbl">Ganancias de hoy</span><div class="row"><span class="big green glowg num">${A.esc(D.gananciasHoy)}</span><span class="bars">${bars}</span></div><span class="note">${A.esc(D.entregasHoy)} entregas · meta diaria 20</span></div>` +
          `<div class="g2"><div class="card"><span class="lbl">Puntualidad</span><span class="big red num">${A.esc(D.puntualidad)}</span><small>Meta de tu categoría: 90%</small></div><div class="card"><span class="lbl">Categoría</span><span class="big">${A.esc(D.categoria)}</span><small>Faltan 18 entregas para Plata</small></div></div>` +
          (on ? '<div class="radar"><span class="rd"></span><div><b>Buscando pedidos…</b><span>Quedate cerca de la zona caliente</span><br><span class="demand">Alta demanda · ×1,4</span></div></div>'
            : '<div class="offline"><b>Estás desconectada</b><span>No vas a recibir pedidos mientras estés desconectada.</span><button class="btn" data-act="toggleOnline">Conectarme</button></div>') +
          '<div class="spacer"></div>' + tabs('home');
      },
      delivering(A) {
        const D = A.D();
        return top(A) +
          `<div class="urg"><p>${A.esc(A.T('t44_urgent'))}</p><div class="row"><span class="tt num" data-t="m">1:00</span><span>BONO $10.000</span></div><div class="tbar" data-tp><i></i></div></div>` +
          `<div class="dest"><span class="lbl">Entregá a</span><h3>${A.esc(D.cliente)}</h3><span class="addr">${A.esc(D.dirCliente)}</span><span class="meta">Pedido ${A.esc(D.pedido)} · ${A.esc(D.local)} · 1 bolsa</span></div>` +
          `<div class="minimap">${MAP({ prog: .96 })}</div><div class="acts"><span>Llamar</span><span>Chat</span></div>` +
          '<div class="spacer"></div><div class="bottom"><button class="btn" data-act="confirm">Confirmar entrega</button></div>';
      },
      fail(A) {
        return `<div class="res bad"><span class="xmark"></span><h1>${A.esc(A.T('t44_failHead'))}</h1><p>${A.esc(A.T('t44_failSub'))}</p></div>` +
          '<div class="card lost"><span>Bono por entregar en 1 min</span><s class="num">$10.000</s></div>' +
          '<div class="st2"><div class="card">Llegaste tarde por<b class="red num">0:47</b></div><div class="card">Puntualidad<b class="red num">71% ↓</b></div></div>' +
          '<div class="spacer"></div><div class="bottom"><button class="btn ghost" data-act="flashiHome">Buscar próximo pedido</button></div>';
      },
      map(A) {
        const D = A.D(), pick = (A.p.mode || 'drop') === 'pick';
        const name = pick ? D.local : D.cliente, addr = pick ? D.localDir : (A.p.dest === 'oferta' ? D.dirOferta : D.dirCliente);
        const near = (A.p.prog || 0) > .9;
        return top(A) + `<div class="map">${MAP({ prog: A.p.prog })}<div class="instr"><span class="ar">${ARROW}</span><div><b>${near ? 'Llegaste' : '200 m'}</b><span>${near ? 'Tu destino está a la derecha' : 'Girá a la derecha en Hidalgo'}</span></div></div></div>` +
          `<div class="sheet"><span class="grab"></span><span class="lbl">${pick ? 'Retirá en' : 'Entregá a'}</span><h3>${A.esc(name)}</h3><span class="addr">${A.esc(addr)}</span><span class="meta">${near ? 'A 20 m' : '1,2 km · 6 min'} · Pedido ${A.esc(D.pedido)}</span>` +
          `<button class="btn" data-act="confirm">${pick ? 'Llegué al local' : 'Confirmar entrega'}</button></div>`;
      },
      offer(A) {
        const D = A.D(), v = A.p.variant || 'demand';
        const card = `<div class="card ocard"><div class="row"><span>${A.esc(D.local)}</span><b class="num">${A.esc(D.montoOferta)}</b></div><span class="addr">→ ${A.esc(D.dirOferta)}</span><span class="meta">2,8 km · 14 min · 1 bolsa grande</span></div>`;
        if (v === 'bonus') {
          return top(A) + `<div class="bonusbox"><span class="lbl">Bono por último pedido</span><div class="big num">+$50.000</div><p>${A.esc(A.T('t55_bonus'))}</p></div>` + card +
            '<div class="spacer"></div><div class="bottom"><button class="btn" data-act="accept">Aceptar pedido</button><button class="fine" data-act="reject">Rechazar: perdés el bono</button></div>';
        }
        return top(A) + '<div class="pad"><div class="alertbox"><b>Alta demanda en tu zona</b>Si permanecés desconectada perderás prioridad para futuros pedidos.</div></div>' +
          '<div class="ringwrap"><div class="ring lg" data-tp><div><span class="rt num" data-t="m">0:30</span><small>para aceptar</small></div></div></div>' + card +
          '<div class="spacer"></div><div class="bottom"><button class="btn" data-act="accept">Aceptar pedido</button><button class="fine" data-act="reject">Rechazar resta 15 puntos de prioridad</button></div>';
      },
      success(A) {
        return '<div class="res good"><span class="check"></span><h1>¡Pedido entregado!</h1><p>Seguí conectada para no perder prioridad.</p><div class="won num glowg">+' + A.esc(A.D().montoOferta) + '</div></div>' +
          '<div class="st2"><div class="card">Puntualidad<b class="green num">76% ↑</b></div><div class="card">Entregas hoy<b class="num">13</b></div></div>' +
          '<div class="spacer"></div><div class="bottom"><button class="btn" data-act="flashiHome">Seguir conectada</button></div>';
      },
      earnings(A) {
        const D = A.D(), hl = A.p.hl;
        const items = [];
        if (hl === 'bonus') items.push(['hl', 'Bono de actividad', 'ahora', 50000]);
        if (hl === 'tip') items.push(['hl', 'Propina extra · ' + D.cliente, 'ahora', 5000]);
        items.push(['', `Pedido ${D.pedido} · ${D.local}`, 'hace 3 min', 3200], ['', 'Pedido #88207 · Wok Express', 'hace 41 min', 2850], ['neg', 'Cargo por uso de la app', 'hoy', -1200], ['', 'Pedido #88199 · Heladería Polar', 'hace 1 h', 2400], ['', 'Pedido #88190 · Pizzería La Esquina', 'hace 2 h', 2950]);
        const total = (+D.saldoSemana || 0) + (hl === 'bonus' ? 50000 : 0) + (hl === 'tip' ? 5000 : 0);
        return top(A) + `<div class="card bal"><span class="lbl">Saldo de la semana</span><div class="big num${hl ? ' green glowg' : ''}">${A.money(total)}</div><span class="note">Se transfiere el lunes · comisión 22%</span></div>` +
          `<div class="mov">${items.map((i) => `<div class="${i[0]}"><span>${A.esc(i[1])}<small>${i[2]}</small></span><b class="num">${i[3] > 0 ? '+' : ''}${A.money(i[3])}</b></div>`).join('')}</div>` +
          '<div class="spacer"></div>' + tabs('earnings');
      },
      badge(A) {
        return top(A) + '<div class="medal"><div><b>TOP 5%</b><small>DE TU ZONA</small></div></div>' +
          `<div class="center"><h1>${A.esc(A.T('t59_top'))}</h1></div>` +
          '<div class="perks"><div>Prioridad en pedidos de alta demanda</div><div>Acceso a bonos exclusivos</div><div>Insignia Rayo en tu perfil</div></div>' +
          '<div class="spacer"></div><div class="bottom"><button class="btn" data-act="quota">Ver cómo mantenerla</button></div>';
      },
      quota(A) {
        return '<div class="quota">' + top(A) + '<div class="qring"><div><b class="num">0/30</b><small>entregas</small></div></div>' +
          `<div class="center"><h1>${A.esc(A.T('t59_quota'))}</h1><div class="left"><span class="num">4<small>días</small></span><span class="num">11<small>h</small></span><span class="num">06<small>min</small></span></div></div>` +
          '<div class="perks bad"><div>Si no las completás, perdés tu categoría</div><div>Bajás en la prioridad de pedidos</div><div>Sin acceso a bonos la próxima semana</div></div>' +
          '<div class="spacer"></div><div class="bottom"><button class="btn red" data-act="flashiHome">Conectarme ahora</button></div></div>';
      }
    }
  });
})();
