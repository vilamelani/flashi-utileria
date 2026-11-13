/* =========================================================================
   GUITA · Episodio 4 · CELULAR DE MARÍA · motor
   Simula un celular Android entero (pantalla bloqueada, inicio, llamadas,
   notificaciones) con varias apps adentro (FLASHI, Chat, Portal) para que
   en una misma toma se pueda pasar de una app a otra.

   Gestos ocultos (no se ven en cámara):
     · Mantener apretada ~1 s la esquina SUPERIOR IZQUIERDA → menú de control
     · Doble toque en la esquina INFERIOR DERECHA → siguiente momento
     · Mantener apretada ~1 s la esquina INFERIOR DERECHA → congelar / seguir la cuenta regresiva
   Gestos "reales" del celular falso:
     · Pantalla bloqueada: deslizar hacia arriba o tocar una notificación
     · Notificación arriba: tocarla abre, deslizarla hacia arriba la descarta
     · Rayita de abajo: deslizar hacia arriba → pantalla de inicio
   ========================================================================= */
(() => {
  'use strict';

  const DEF = window.MARIA_DEFAULTS;
  const KEY = 'flashi.maria.v2';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  function merge(a, b) { for (const k in b) { if (isObj(b[k]) && a[k] && typeof a[k] === 'object') merge(a[k], b[k]); else a[k] = clone(b[k]); } return a; }
  const money = (n) => (n < 0 ? '−' : '') + '$' + String(Math.abs(Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  /* ---------- almacenamiento ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* nada */ } }
  };
  // Ajustes: guardamos sólo lo que se cambió (O) y lo mezclamos con la config por defecto
  let O = store.get(KEY, {});
  let S = merge(clone(DEF), O);
  function setPath(path, value) {
    const parts = path.split('.');
    let a = S, b = O;
    for (let i = 0; i < parts.length - 1; i++) {
      const k = parts[i];
      if (!a[k] || typeof a[k] !== 'object') a[k] = {};
      if (!b[k] || typeof b[k] !== 'object') b[k] = {};
      a = a[k]; b = b[k];
    }
    a[parts[parts.length - 1]] = value; b[parts[parts.length - 1]] = value;
    store.set(KEY, O);
  }
  const getPath = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), S);

  /* Fotos: IndexedDB (no entran en localStorage) */
  const idb = (() => {
    let dbp = null;
    const open = () => dbp || (dbp = new Promise((res, rej) => {
      const r = indexedDB.open('flashi-maria', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('files');
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    }));
    const tx = (mode, fn) => open().then((db) => new Promise((res, rej) => { const t = db.transaction('files', mode); const q = fn(t.objectStore('files')); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); }));
    return {
      get: (k) => tx('readonly', (s) => s.get(k)).catch(() => null),
      set: (k, v) => tx('readwrite', (s) => s.put(v, k)).then(() => true).catch(() => false),
      del: (k) => tx('readwrite', (s) => s.delete(k)).catch(() => null),
      clear: () => tx('readwrite', (s) => s.clear()).catch(() => null)
    };
  })();
  const IMGKEY = KEY + '.imgs';
  let imgFlags = store.get(IMGKEY, {});
  const imgURL = {};
  async function loadImages() {
    for (const k of Object.keys(imgFlags)) {
      const b = await idb.get('img.' + k);
      if (b) imgURL[k] = URL.createObjectURL(b); else delete imgFlags[k];
    }
  }
  const PH = {};   // fotos provisorias generadas
  // Fotos que vienen con la app (se pueden reemplazar desde el menú)
  const DEFAULT_IMG = { local1: 'img/locales/timmys.png', local2: 'img/locales/giandutti.jpg' };
  function img(slot) { return imgURL[slot] || DEFAULT_IMG[slot] || (/^s-/.test(slot) ? `img/guardado/${slot}.jpg` : placeholder(slot)); }
  function hasImg(slot) { return !!imgURL[slot]; }

  /* Fotos provisorias dibujadas (para que nunca quede un cuadrado vacío) */
  function placeholder(slot) {
    if (PH[slot]) return PH[slot];
    const c = document.createElement('canvas');
    const sq = /avatar|seller|gloria|daniel|clara/.test(slot);
    c.width = 600; c.height = sq ? 600 : 750;
    const g = c.getContext('2d');
    let h = 0; for (const ch of slot) h = (h * 31 + ch.charCodeAt(0)) % 360;
    h = (h * 47 + (parseInt(slot.replace(/\D/g, ''), 10) || 0) * 53) % 360;
    if (slot === 'cuna') drawCrib(g, c.width, c.height);
    else if (/^wall/.test(slot)) {
      const gr = g.createLinearGradient(0, 0, c.width, c.height);
      gr.addColorStop(0, '#173326'); gr.addColorStop(.55, '#0B1A12'); gr.addColorStop(1, '#050906');
      g.fillStyle = gr; g.fillRect(0, 0, c.width, c.height);
    } else {
      const gr = g.createLinearGradient(0, 0, c.width, c.height);
      gr.addColorStop(0, `hsl(${(h + 20) % 360} 45% 72%)`); gr.addColorStop(1, `hsl(${(h + 70) % 360} 38% 48%)`);
      g.fillStyle = gr; g.fillRect(0, 0, c.width, c.height);
      g.fillStyle = 'rgba(255,255,255,.85)'; g.textAlign = 'center';
      if (sq) { g.font = '700 260px system-ui, sans-serif'; g.fillText((slot === 'avatar' ? 'M' : slot.charAt(0)).toUpperCase(), 300, 390); }
      else { g.font = '700 34px system-ui, sans-serif'; g.fillText('FOTO PROVISORIA', 300, c.height / 2 + 12); }
    }
    PH[slot] = c.toDataURL('image/jpeg', .8);
    return PH[slot];
  }
  function drawCrib(g, w, h) {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#F3E6D6'); gr.addColorStop(1, '#E2CDB4');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#d9c2a5'; g.fillRect(0, h * .78, w, h * .22);
    const x0 = 95, x1 = w - 95, top = 250, bot = 560;
    g.strokeStyle = '#8A5A3B'; g.lineCap = 'round'; g.lineWidth = 18;
    g.beginPath(); g.moveTo(x0, top - 40); g.lineTo(x0, bot + 70); g.moveTo(x1, top - 40); g.lineTo(x1, bot + 70); g.stroke();
    g.lineWidth = 14; g.beginPath(); g.moveTo(x0, top); g.lineTo(x1, top); g.moveTo(x0, bot); g.lineTo(x1, bot); g.stroke();
    g.lineWidth = 8; g.beginPath(); for (let x = x0 + 34; x < x1 - 10; x += 34) { g.moveTo(x, top); g.lineTo(x, bot); } g.stroke();
    g.fillStyle = '#fff'; g.globalAlpha = .9; g.fillRect(x0 + 10, bot - 40, x1 - x0 - 20, 34); g.globalAlpha = 1;
    g.fillStyle = 'rgba(120,80,50,.55)'; g.font = '700 24px system-ui, sans-serif'; g.textAlign = 'center'; g.fillText('FOTO PROVISORIA', w / 2, h - 40);
  }

  /* ---------- registro de apps y escenas ---------- */
  const APPS = {};
  let SCENES = [];
  const sceneById = (id) => SCENES.find((s) => s.id === id);
  const SC = (s) => {
    const c = Object.assign({ time: '12:00', batt: 60, start: 'app', date: '', dur: 60, run: 'pause', onZero: '', delays: [] }, S.scenes[s.id] || {});
    return c;
  };

  /* ---------- estado de la toma ---------- */
  const R = {
    scene: null, cue: 0, app: 'home', screen: 'home', p: {}, locked: false, lockN: [], call: null,
    t0: Date.now(), seq: 0, timer: { on: false, total: 60, left: 60, run: false, last: 0 }, later: []
  };
  const later = (fn, ms) => { const t = setTimeout(fn, ms); R.later.push(t); return t; };
  const clearLater = () => { R.later.forEach(clearTimeout); R.later = []; };

  /* ---------- texto y datos ---------- */
  const D = () => S.data;
  function fill(v) { return String(v ?? '').replace(/\{(\w+)\}/g, (m, k) => (S.data[k] != null ? S.data[k] : m)); }
  const T = (key) => fill(S.texts[key] != null ? S.texts[key] : key);

  /* ---------- reloj, fecha, batería ---------- */
  function clockStr() {
    if (S.phone.clock === 'device') { const n = new Date(); return pad(n.getHours()) + ':' + pad(n.getMinutes()); }
    const sc = SC(R.scene || { id: 'libre' });
    const [hh, mm] = (sc.time || '12:00').split(':').map(Number);
    let m = hh * 60 + mm + Math.floor((Date.now() - R.t0) / 60000);
    m = ((m % 1440) + 1440) % 1440;
    return pad(Math.floor(m / 60)) + ':' + pad(m % 60);
  }
  const dateStr = () => { const sc = R.scene ? SC(R.scene) : null; return (sc && sc.date) || S.phone.date; };
  function shortDate() { const m = dateStr().match(/^(\w+),?\s+(\d+)\s+de\s+(\w+)/i); return m ? `${m[1].slice(0, 3)}, ${m[2]} ${m[3].slice(0, 3)}` : dateStr(); }
  const batt = () => (R.scene ? SC(R.scene).batt : SC({ id: 'libre' }).batt);

  /* ---------- entorno ---------- */
  const isTouch = matchMedia('(pointer: coarse)').matches;
  const isStandalone = () => matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches || navigator.standalone === true;
  const canVibrate = typeof navigator.vibrate === 'function';
  const vib = (p) => { if (canVibrate) { try { navigator.vibrate(p); } catch (e) { /* nada */ } } };

  /* ---------- íconos del sistema ---------- */
  const SYS = {
    sig: (n) => `<svg width="17" height="13" viewBox="0 0 17 13">${[0, 1, 2, 3].map((i) => `<rect x="${i * 4.4}" y="${9 - i * 3}" width="3" height="${4 + i * 3}" rx="1" fill="currentColor" opacity="${i < n ? 1 : .3}"/>`).join('')}</svg>`,
    wifi: '<svg width="16" height="13" viewBox="0 0 16 13"><path d="M8 13 0 3.2A12.6 12.6 0 0 1 8 0a12.6 12.6 0 0 1 8 3.2Z" fill="currentColor"/></svg>',
    batt: (b) => `<svg width="9" height="15" viewBox="0 0 9 15"><rect x="2.5" y="0" width="4" height="2" rx=".6" fill="currentColor"/><rect x=".75" y="1.75" width="7.5" height="12.5" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="${(3 + 10 * (1 - b / 100)).toFixed(1)}" width="5" height="${(10 * b / 100).toFixed(1)}" rx=".6" fill="${b <= 15 ? '#FF4D5E' : 'currentColor'}"/></svg>`,
    handset: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1Z"/></svg>',
    fp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6.5 5.5a8 8 0 0 1 11 0M4.5 10a8.5 8.5 0 0 1 15 0M8 20.5c-1-1.6-1.5-3.5-1.5-5.5a5.5 5.5 0 0 1 11 0v1M12 15v1.5c0 1.8.6 3.4 1.6 4.6M9.3 18.8C9 17.6 9 16.3 9 15a3 3 0 0 1 6 0M17.5 19.5c-.8.3-1.6.5-2.5.5"/></svg>',
    cam: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3 7.2 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.2L15 3Zm3 14.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5v3.5"/><path d="M3.5 3.5l17 17" class="slash"/></svg>',
    keypad: '<svg viewBox="0 0 24 24" fill="currentColor">' + [5, 12, 19].map((y) => [5, 12, 19].map((x) => `<circle cx="${x}" cy="${y}" r="2"/>`).join('')).join('') + '</svg>',
    speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" stroke-linecap="round"/></svg>',
    add: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="10" cy="8" r="3.6"/><path d="M3.5 20a6.5 6.5 0 0 1 13 0M19 8v6M16 11h6"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="2.5" y="6.5" width="13" height="11" rx="2.5"/><path d="M15.5 10.5 21.5 7v10l-6-3.5z"/></svg>',
    hold: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="5" width="3.4" height="14" rx="1"/><rect x="13.6" y="5" width="3.4" height="14" rx="1"/></svg>'
  };

  /* ---------- montaje de capas ---------- */
  let dev, scr, lockL, callL, hu, sbar, nav, crew, sheet, toastEl;
  function mount() {
    document.body.classList.toggle('framed', matchMedia('(min-width: 700px) and (pointer: fine)').matches);
    dev = $('#device');
    dev.innerHTML = `
      <div id="scr"></div><div id="lockL"></div><div id="callL"></div><div id="hu"></div>
      <div id="sbar"></div><div id="nav"><i></i></div>
      <div class="hzv menu"></div><div class="hzv cue"></div>
      <div id="crew" hidden></div><div id="sheet" hidden></div><div id="toast" hidden></div>`;
    [scr, lockL, callL, hu, sbar, nav, crew, sheet, toastEl] = ['#scr', '#lockL', '#callL', '#hu', '#sbar', '#nav', '#crew', '#sheet', '#toast'].map((s) => $(s, dev));
    bindGestures(); bindClicks(); bindSheet();
    setInterval(() => tickTimer(false), 200);
    setInterval(() => { tickClock(); tickUp(); }, 1000);
    addEventListener('resize', () => applyChrome());
    document.addEventListener('fullscreenchange', () => applyChrome());
  }

  /* ---------- barra de estado y rayita ---------- */
  function fakeSBVisible() {
    if (S.phone.statusBar === 'on') return true;
    if (S.phone.statusBar === 'off') return false;
    if (!isTouch) return true;
    return !!document.fullscreenElement || matchMedia('(display-mode: fullscreen)').matches;
  }
  function currentTone() {
    if (!crew.hidden) return 'light';
    if (R.call || R.locked) return 'light';
    const a = APPS[R.app];
    return a && a.tone ? a.tone(api()) : 'light';
  }
  function applyChrome() {
    const vis = fakeSBVisible();
    dev.classList.toggle('real-sb', !vis);
    const tone = currentTone();
    dev.dataset.tone = tone;
    const b = batt();
    const left = R.locked && !R.call ? esc(S.phone.carrier) : `<span data-clock>${clockStr()}</span>`;
    sbar.innerHTML = `<span class="l">${left}</span><span class="r">${S.phone.wifi ? SYS.wifi : ''}${S.phone.net ? `<span class="net">${esc(S.phone.net)}</span>` : ''}${SYS.sig(+S.phone.signal)}${SYS.batt(b)}<span class="pct">${b}%</span></span>`;
    nav.hidden = !!(R.locked || R.call || !crew.hidden);
    document.body.classList.toggle('debugzones', !!S.phone.zones);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = tone === 'dark' ? '#ffffff' : '#000000';
  }

  /* ---------- render de pantallas ---------- */
  function api() { return A; }
  function renderScreen(anim) {
    const a = APPS[R.app] || APPS.home;
    const fn = a.screens[R.screen] || a.screens[a.home];
    scr.innerHTML = `<div class="scr app-${a.id} s-${R.screen}${anim ? ' enter' : ''}">${fn(api())}</div>`;
    if (a.after) a.after(api(), scr.firstElementChild);
    tickTimer(true); tickUp(); applyChrome();
  }

  /* ---------- pantalla bloqueada ---------- */
  function renderLock() {
    if (!R.locked) { lockL.innerHTML = ''; applyChrome(); return; }
    const wall = hasImg('wallLock') ? `style="--wall:url('${img('wallLock')}')"` : '';
    lockL.innerHTML = `
      <div class="lockA" ${wall} data-lock>
        <div class="date"><span>${esc(shortDate())}</span></div>
        <div class="clock num" data-clockbig></div>
        <div class="nl">${R.lockN.map(notifHTML).join('')}</div>
        <div class="foot"><span class="sc">${SYS.handset}</span><span class="fp">${SYS.fp}</span><span class="sc">${SYS.cam}</span></div>
      </div>`;
    tickClock(); applyChrome();
  }
  function unlock(open) {
    const el = lockL.firstElementChild;
    if (open) setTarget(open);
    R.locked = false; R.lockN = [];
    renderScreen(false);
    if (el) { el.classList.add('unlocking'); setTimeout(() => { if (!R.locked) lockL.innerHTML = ''; }, 300); } else lockL.innerHTML = '';
    applyChrome();
  }
  function lock() { R.locked = true; hu.innerHTML = ''; renderLock(); }

  /* ---------- navegación ---------- */
  function setTarget(t) {
    // t = { app, screen, p }
    const a = APPS[t.app] || APPS[R.app];
    R.app = a.id; R.screen = t.screen || a.home;
    if (t.p) Object.assign(R.p, t.p);
    if (a.onEnter) a.onEnter(api(), R.screen);
  }
  function open(appId, screen, p) {
    setTarget({ app: appId, screen, p });
    if (R.locked) { R.locked = false; R.lockN = []; renderLock(); }
    renderScreen(true);
  }
  const go = (screen, p) => open(R.app, screen, p);
  function set(p, rerender) { Object.assign(R.p, p); if (rerender !== false) renderScreen(false); }
  function goHome() { if (R.app === 'home' && R.screen === 'home') return; hu.innerHTML = ''; open('home', 'home'); }

  /* ---------- notificaciones ---------- */
  const allN = {};
  function notifHTML(n) {
    const a = APPS[n.app] || {};
    return `<div class="nA${n.urgent ? ' hot' : ''}" data-n="${n.id}" style="--ac:${a.color || '#1EF08A'};--acx:${a.colorText || '#06140c'}">
      <span class="ai">${a.small || ''}</span>
      <div class="hd"><b>${esc(a.name || '')}</b>·<span>${esc(n.when || 'ahora')}</span></div>
      ${n.title ? `<div class="tt">${esc(n.title)}</div>` : ''}
      <div class="bd">${esc(n.body)}</div>${n.sub ? `<div class="bd sub">${esc(n.sub)}</div>` : ''}
    </div>`;
  }
  function notify(spec) {
    const val = (v) => (typeof v === 'function' ? v(A) : v ? T(v) : '');
    const n = { id: 'n' + (++R.seq), app: spec.app || 'flashi', title: val(spec.title), body: val(spec.text), sub: val(spec.sub), when: typeof spec.when === 'function' ? spec.when(A) : (spec.when || ''), urgent: !!spec.urgent, open: spec.open || null };
    allN[n.id] = n;
    if (S.phone.vibrateNotifs) vib(spec.urgent ? [160, 90, 160] : 180);
    if (R.locked && !R.call) {
      R.lockN.unshift(n);
      const nl = $('.nl', lockL);
      if (nl) nl.insertAdjacentHTML('afterbegin', notifHTML(n)); else renderLock();
    } else {
      hu.insertAdjacentHTML('afterbegin', notifHTML(n));
      while (hu.children.length > 2) hu.removeChild(hu.lastElementChild);
      if (S.phone.banners === 'auto') { const id = n.id; setTimeout(() => dismiss(id), 6000); }
    }
    return n;
  }
  function dismiss(id) { const el = $(`[data-n="${id}"]`, hu); if (!el) return; el.classList.add('out'); setTimeout(() => el.remove(), 260); }
  function tapNotif(id) {
    const n = allN[id]; if (!n) return;
    if (R.locked) { unlock(n.open); return; }
    dismiss(id);
    if (n.open) open(n.open.app, n.open.screen, n.open.p);
  }

  /* ---------- llamadas ---------- */
  let ringIv = null;
  function stopRing() { if (ringIv) { clearInterval(ringIv); ringIv = null; } vib(0); }
  function incomingCall(who, opts = {}) {
    stopRing();
    const c = S.contacts[who] || (who === 'obra' ? { name: S.data.obraSocial, sub: '', number: '' } : { name: who, sub: 'Móvil', number: '' });
    R.call = { who, name: opts.name || c.name, sub: c.sub, number: c.number, phase: opts.active ? 'active' : 'ring', t0: Date.now(), muted: false, speaker: false };
    hu.innerHTML = '';
    if (!opts.active && S.phone.vibrateCalls) { const pulse = () => vib([900, 500, 900]); pulse(); ringIv = setInterval(pulse, 2700); }
    renderCall();
  }
  function renderCall() {
    const c = R.call;
    if (!c) { callL.innerHTML = ''; applyChrome(); return; }
    const av = hasImg(c.who) ? `<img src="${img(c.who)}" alt="">` : `<span>${esc((c.name || '?').trim().charAt(0).toUpperCase())}</span>`;
    if (c.phase === 'ring') {
      callL.innerHTML = `
        <div class="call ring">
          <div class="who"><div class="av">${av}</div><b>${esc(c.name)}</b><small>${esc(c.sub)}${c.number ? ' · ' + esc(c.number) : ''}</small><em>Llamada entrante</em></div>
          <div class="btns">
            <button class="cbtn red" data-act="call-reject"><i>${SYS.handset}</i><span>Rechazar</span></button>
            <button class="cbtn green" data-act="call-answer"><i>${SYS.handset}</i><span>Responder</span></button>
          </div>
        </div>`;
    } else {
      const ended = c.phase === 'ended';
      const t = (k, ic, lbl, on) => `<button class="key${on ? ' on' : ''}" data-act="${k}"><i>${ic}</i><span>${lbl}</span></button>`;
      callL.innerHTML = `
        <div class="call active${ended ? ' ended' : ''}">
          <div class="who"><div class="av">${av}</div><b>${esc(c.name)}</b><small>${esc(c.sub)}${c.number ? ' · ' + esc(c.number) : ''}</small><em class="num" ${ended ? '' : 'data-calltime'}>${ended ? 'Llamada finalizada' : '0:00'}</em></div>
          <div class="keys">
            ${t('call-hold', SYS.hold, 'Espera')}${t('call-mute', SYS.mic, 'Silenciar', c.muted)}${t('call-keypad', SYS.keypad, 'Teclado')}
            ${t('call-speaker', SYS.speaker, 'Altavoz', c.speaker)}${t('call-add', SYS.add, 'Agregar')}${t('call-video', SYS.video, 'Video')}
          </div>
          <button class="cbtn red end" data-act="call-end"><i>${SYS.handset}</i></button>
        </div>`;
      tickCall();
    }
    applyChrome();
  }
  function tickCall() {
    const el = $('[data-calltime]', callL); if (!el || !R.call) return;
    const s = Math.floor((Date.now() - R.call.t0) / 1000);
    el.textContent = Math.floor(s / 60) + ':' + pad(s % 60);
  }
  function endCall() {
    stopRing(); R.call = null;
    const el = callL.firstElementChild;
    if (el) { el.classList.add('closing'); setTimeout(() => { if (!R.call) { callL.innerHTML = ''; applyChrome(); } }, 220); } else renderCall();
    if (R.locked) renderLock();
    applyChrome();
  }
  function callAct(name) {
    const c = R.call; if (!c) return;
    if (name === 'call-reject') { endCall(); }
    else if (name === 'call-answer') { stopRing(); c.phase = 'active'; c.t0 = Date.now(); renderCall(); }
    else if (name === 'call-end') { endCall(); }
    else if (name === 'call-mute') { c.muted = !c.muted; renderCall(); }
    else if (name === 'call-speaker') { c.speaker = !c.speaker; renderCall(); }
  }

  /* ---------- cuenta regresiva ---------- */
  function fmt(sec, mode) { sec = Math.max(0, Math.ceil(sec)); const m = Math.floor(sec / 60), s = sec % 60; if (mode === 's') return String(sec); if (mode === 'mm') return pad(m) + ':' + pad(s); return m + ':' + pad(s); }
  function timerStart(total, run = true) { const sc = SC(R.scene || { id: 'libre' }); R.timer = { on: true, total: total || sc.dur || 60, left: total || sc.dur || 60, run, last: performance.now() }; tickTimer(true); }
  function timerToggle() { const t = R.timer; if (!t.on || t.left <= 0) return; t.run = !t.run; t.last = performance.now(); toast(t.run ? 'Cuenta: sigue' : 'Cuenta: congelada', true); }
  function tickTimer(force) {
    const t = R.timer, now = performance.now();
    if (t.run) {
      t.left -= (now - t.last) / 1000; t.last = now;
      if (t.left <= 0) {
        t.left = 0; t.run = false;
        if (R.scene && SC(R.scene).onZero === 'next') later(nextCue, 400);
        const a = APPS[R.app]; if (a && a.onTimerZero) a.onTimerZero(api());
      }
    }
    const p = t.total ? Math.max(0, t.left / t.total * 100) : 0;
    $$('[data-t]', scr).forEach((e) => { const txt = fmt(t.left, e.dataset.t); if (e.textContent !== txt || force) e.textContent = txt; e.classList.toggle('t-zero', t.on && t.left <= 0); });
    $$('[data-tp]', scr).forEach((e) => e.style.setProperty('--p', p.toFixed(2)));
  }
  function tickUp() { tickCall(); }
  function tickClock() {
    const c = clockStr();
    $$('[data-clock]', dev).forEach((a) => { if (a.textContent !== c) a.textContent = c; });
    const b = $('[data-clockbig]', lockL);
    if (b) { const [h, m] = c.split(':'); const html = `<span>${h}</span><span>${m}</span>`; if (b.innerHTML !== html) b.innerHTML = html; }
  }

  /* ---------- escenas y momentos ---------- */
  function startScene(id) {
    const s = sceneById(id) || sceneById('libre');
    clearLater(); stopRing();
    const sc = SC(s);
    R.scene = s; R.cue = 0; R.p = clone(s.p || {}); R.t0 = Date.now(); R.lockN = []; R.call = null;
    R.timer = { on: false, total: sc.dur || 60, left: sc.dur || 60, run: false, last: performance.now() };
    if (s.timer === 'start') { R.timer.on = true; R.timer.run = sc.run === 'run'; }
    hu.innerHTML = '';
    R.app = s.app || 'home'; R.screen = s.screen || (APPS[R.app] && APPS[R.app].home) || 'home';
    Object.values(APPS).forEach((a) => a.onSceneStart && a.onSceneStart(api(), s));
    if (APPS[R.app].onEnter) APPS[R.app].onEnter(api(), R.screen);
    R.locked = sc.start === 'lock';
    store.set(KEY + '.last', s.id);
    crew.hidden = true;
    renderScreen(false); renderLock();
    if (sc.start === 'call' && s.startCall) incomingCall(s.startCall.who, { active: true, name: s.startCall.name });
    else renderCall();
    scheduleCue(0);
  }
  function scheduleCue(i) {
    if (!R.scene || i >= R.scene.cues.length) return;
    const d = +(SC(R.scene).delays || [])[i] || 0;
    if (d > 0) later(() => { if (R.cue === i) runCue(i); }, d * 1000);
  }
  function runCue(i) {
    const s = R.scene, c = s && s.cues[i]; if (!c) return;
    if (c.timer) timerStart(SC(s).dur, true);
    if (c.stopTimer) R.timer.run = false;
    if (c.set) Object.assign(R.p, c.set);
    if (c.open) { hu.innerHTML = ''; open(c.open.app, c.open.screen, c.open.p); }
    else if (c.timer || c.set) { if (!R.locked) renderScreen(false); }
    if (c.notif) notify(c.notif);
    if (c.call) incomingCall(c.call);
    if (c.fn) c.fn(api());
    R.cue = i + 1;
    scheduleCue(i + 1);
  }
  // Eventos que avisan las apps (ej.: el chat avisa cuando ella terminó de borrar lo que escribió)
  function event(name) {
    if (name !== 'erased' || !R.scene || !R.scene.erase) return;
    const d = +SC(R.scene).afterErase || 0, i = R.cue;
    if (d > 0 && i === 0) later(() => { if (R.cue === i) runCue(i); }, d * 1000);
  }
  function nextCue() { if (R.scene && R.cue < R.scene.cues.length) runCue(R.cue); else if (R.scene) toast('No hay más momentos', true); }

  /* ---------- toast (sólo para el equipo, muy discreto) ---------- */
  let toastT = null;
  function toast(msg, crewOnly) {
    if (crewOnly && !S.phone.zones && sheet.hidden) return;   // en toma no se ve nada
    toastEl.textContent = msg; toastEl.hidden = false; toastEl.classList.toggle('crew', !!crewOnly);
    clearTimeout(toastT); toastT = setTimeout(() => { toastEl.hidden = true; }, crewOnly ? 1100 : 2200);
  }

  /* ---------- pantalla completa y pantalla encendida ---------- */
  let wakeLock = null;
  async function keepAwake() { try { if ('wakeLock' in navigator && !wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); } } catch (e) { /* nada */ } }
  async function goImmersive() {
    keepAwake();
    if (S.phone.autoFullscreen && isTouch && !isStandalone() && !document.fullscreenElement && document.documentElement.requestFullscreen) {
      try { await document.documentElement.requestFullscreen({ navigationUI: 'hide' }); } catch (e) { /* nada */ }
    }
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') keepAwake(); });

  /* ---------- gestos ---------- */
  function bindGestures() {
    let lp = null, lpPos = null, lastCue = 0, swipe = null;
    const local = (e) => { const r = dev.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height }; };
    const inMenu = (p) => p.x < 80 && p.y < 80;
    const inCue = (p) => p.x > p.w - 80 && p.y > p.h - 80;
    dev.addEventListener('pointerdown', (e) => {
      if (crew.hidden) goImmersive();
      if (!sheet.hidden) return;
      const p = local(e);
      if (e.target.closest && e.target.closest('.kbd')) { swipe = null; return; }   // el teclado del chat no dispara gestos ocultos
      swipe = { y: p.y, x: p.x, t: e.target, time: Date.now() };
      if (inMenu(p)) { lpPos = p; lp = setTimeout(() => { lp = null; swallowClick(); openSheet(); }, 900); }
      else if (inCue(p) && crew.hidden) {
        lpPos = p; lp = setTimeout(() => { lp = null; lastCue = 0; swallowClick(); timerToggle(); }, 900);
        const now = Date.now();
        if (now - lastCue < 380) { lastCue = 0; clearTimeout(lp); lp = null; swallowClick(); nextCue(); } else lastCue = now;
      }
    }, true);
    const cancel = () => { if (lp) { clearTimeout(lp); lp = null; } };
    dev.addEventListener('pointermove', (e) => { if (!lp || !lpPos) return; const p = local(e); if (Math.abs(p.x - lpPos.x) > 14 || Math.abs(p.y - lpPos.y) > 14) cancel(); }, true);
    dev.addEventListener('pointercancel', cancel, true);
    dev.addEventListener('pointerup', (e) => {
      cancel();
      if (!swipe || !sheet.hidden || !crew.hidden) { swipe = null; return; }
      const p = local(e), dy = p.y - swipe.y, t = swipe.t;
      // pantalla bloqueada: deslizar hacia arriba
      if (R.locked && !R.call && t.closest && t.closest('[data-lock]') && !t.closest('[data-n]') && dy < -70) unlock();
      // notificación arriba: deslizar para descartar
      const b = t.closest && t.closest('#hu [data-n]'); if (b && dy < -30) { dismiss(b.dataset.n); swallowClick(); }
      // rayita de abajo: deslizar hacia arriba → inicio
      if (!R.locked && !R.call && swipe.y > p.h - 34 && dy < -24) { goHome(); swallowClick(); }
      swipe = null;
    }, true);
    dev.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('dblclick', (e) => e.preventDefault(), { passive: false });
  }
  let swallow = false;
  function swallowClick() { swallow = true; setTimeout(() => { swallow = false; }, 450); }

  function bindClicks() {
    dev.addEventListener('click', (e) => {
      if (swallow) { e.stopPropagation(); e.preventDefault(); return; }
      if (e.target.closest('#sheet')) return;
      if (e.target.closest('#crew')) { crewClick(e); return; }
      const n = e.target.closest('[data-n]'); if (n) { tapNotif(n.dataset.n); return; }
      const a = e.target.closest('[data-act]'); if (!a) return;
      const name = a.dataset.act;
      if (name.startsWith('call-')) { callAct(name); return; }
      if (name === 'go-home') { goHome(); return; }
      if (name === 'open-app') { open(a.dataset.app, a.dataset.screen); return; }
      const app = APPS[R.app];
      if (app && app.actions && app.actions[name]) app.actions[name](api(), a, e);
    });
  }

  /* =======================================================================
     Pantalla del equipo: lista de escenas
     ======================================================================= */
  function showCrew() {
    clearLater(); stopRing(); R.scene = null; R.call = null; callL.innerHTML = ''; hu.innerHTML = '';
    const inst = isStandalone();
    const off = navigator.serviceWorker && navigator.serviceWorker.controller;
    crew.innerHTML = `
      <div class="crew-in">
        <div class="kicker">GUITA · Episodio 4 · Utilería</div>
        <h1>Celular de María</h1>
        <p class="sub">Android · FLASHI, Chat, Portal y llamadas en un solo celular.</p>
        <div class="list">${SCENES.map((s) => `
          <button class="scene" data-crew="start" data-id="${s.id}"><span class="tag">${esc(s.id === 'libre' ? '—' : s.id)}</span>
            <span><b>${esc(s.title)}</b><small>${esc(s.when ? s.when + ' · ' : '')}${esc(s.desc)}</small></span></button>`).join('')}</div>
        <button class="ghost" data-crew="settings">Ajustes del celular, textos y fotos</button>
        <div class="howto">
          <h3>Gestos ocultos</h3>
          <ul>
            <li><b>Menú de control:</b> mantener apretada 1 segundo la esquina <b>superior izquierda</b>.</li>
            <li><b>Siguiente momento:</b> doble toque en la esquina <b>inferior derecha</b>.</li>
            <li><b>Congelar / seguir la cuenta regresiva:</b> mantener apretada 1 segundo la esquina <b>inferior derecha</b>.</li>
            <li><b>Ir al inicio del celular:</b> deslizar hacia arriba desde la rayita de abajo.</li>
          </ul>
        </div>
        <p class="status">Instalada como app: <b class="${inst ? 'ok' : 'warn'}">${inst ? 'sí' : 'no'}</b> ·
          Sin conexión: <b class="${off ? 'ok' : 'warn'}">${off ? 'lista' : 'todavía no'}</b> ·
          Vibración: <b class="${canVibrate ? 'ok' : 'warn'}">${canVibrate ? 'disponible' : 'no disponible'}</b> ·
          Versión: <b data-ver>…</b></p>
        <button class="ghost" data-crew="update">Buscar actualización</button>
      </div>`;
    crew.hidden = false; crew.scrollTop = 0; applyChrome(); showVersion();
  }
  async function showVersion() {
    let v = 'sin instalar';
    try { const k = (await caches.keys()).filter((x) => x.startsWith('flashi-maria')).sort(); if (k.length) v = k[k.length - 1].replace('flashi-maria-', ''); } catch (e) { /* nada */ }
    $$('[data-ver]', dev).forEach((el) => { el.textContent = v; });
  }
  async function checkUpdate() {
    toast('Buscando actualización…');
    try {
      const r = await navigator.serviceWorker.getRegistration();
      if (!r) { location.reload(); return; }
      await r.update();
      const w = r.installing || r.waiting;
      if (!w) { toast('Ya tenés la última versión'); showVersion(); return; }
      w.addEventListener('statechange', () => { if (w.state === 'activated') location.reload(); });
      setTimeout(() => location.reload(), 8000);
    } catch (e) { location.reload(); }
  }
  function crewClick(e) {
    const b = e.target.closest('[data-crew]'); if (!b) return;
    if (b.dataset.crew === 'start') { goImmersive(); startScene(b.dataset.id); }
    else if (b.dataset.crew === 'settings') openSheet();
    else if (b.dataset.crew === 'update') checkUpdate();
  }

  /* =======================================================================
     Menú de control (no aparece en cámara)
     ======================================================================= */
  let selId = null, resetArm = false;
  const IMG_SLOTS = [
    ['avatar', 'Portal · foto de perfil de María'],
    ['cuna', 'Portal · publicación de la cuna (47 y 55)'],
    ['seller', 'Portal · foto de la cuenta que vende la cuna'],
    ['local1', 'FLASHI · logo de Timmy\'s (local 1)'], ['local2', 'FLASHI · foto de Giandutti (local 2)'],
    ['grid1', 'Portal · foto 1 del perfil de María'], ['grid2', 'foto 2'], ['grid3', 'foto 3'], ['grid4', 'foto 4'], ['grid5', 'foto 5'], ['grid6', 'foto 6'], ['grid7', 'foto 7'], ['grid8', 'foto 8'], ['grid9', 'foto 9'],
    ['gloria', 'Foto de contacto · Gloria'], ['daniel', 'Foto de contacto · Daniel'], ['clara', 'Foto de contacto · Clara'],
    ['wallLock', 'Fondo de la pantalla bloqueada'], ['wallHome', 'Fondo de la pantalla de inicio']
  ];
  function openSheet() { selId = (R.scene && R.scene.id) || store.get(KEY + '.last', SCENES[0].id); resetArm = false; renderSheet(); sheet.hidden = false; sheet.scrollTop = 0; }
  function closeSheet() { sheet.hidden = true; if (R.scene) { renderScreen(false); renderLock(); renderCall(); } else if (!crew.hidden) showCrew(); }
  const seg = (path, val, opts) => `<div class="seg" data-path="${path}">${opts.map(([v, l]) => `<button type="button" data-v="${esc(JSON.stringify(v))}" class="${JSON.stringify(val) === JSON.stringify(v) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
  const inp = (path, type = 'text', extra = '') => `<input type="${type}" data-path="${path}" data-type="${type === 'number' ? 'num' : 'str'}" value="${esc(getPath(path) ?? '')}" ${extra}>`;
  const area = (path, rows = 2) => `<textarea data-path="${path}" data-type="str" rows="${rows}">${esc(getPath(path) ?? '')}</textarea>`;
  const row = (label, ctl, hint) => `<label>${label}${hint ? `<small>${hint}</small>` : ''}</label>${ctl}`;
  function renderSheet() {
    const s = sceneById(selId) || SCENES[0], sc = SC(s), cur = R.scene && R.scene.id === s.id;
    const sp = `scenes.${s.id}`;
    let h = (A.updateReady ? `<button class="go" data-m="reload">Hay una versión nueva: tocá para actualizar</button>` : '') + `<div class="mh"><h1>Control de rodaje</h1><div class="row2"><button data-m="crew">Lista de escenas</button><button data-m="close" class="hi">Volver</button></div></div>`;
    h += `<div class="sm">${R.scene ? `En pantalla: <b>${esc(R.scene.id)} · ${esc(R.scene.title)}</b> · momento ${Math.min(R.cue + 1, R.scene.cues.length || 1)} de ${R.scene.cues.length}${R.cue >= R.scene.cues.length && R.scene.cues.length ? ' (terminados)' : ''}` : 'Ninguna escena en pantalla'}</div>`;
    h += `<h2>Escena</h2><div class="chips">${SCENES.map((x) => `<button data-m="sel" data-id="${x.id}" class="${x.id === s.id ? 'on' : ''}">${esc(x.id === 'libre' ? 'Libre' : x.id)}</button>`).join('')}</div>`;
    h += `<div class="scdesc"><b>${esc(s.title)}</b><span>${esc(s.desc)}</span></div>`;
    h += `<button class="go" data-m="start">${cur ? 'Reiniciar' : 'Iniciar'} ${esc(s.id === 'libre' ? 'uso libre' : 'escena ' + s.id)} desde el principio</button>`;
    if (s.cues.length) {
      h += `<h2>Momentos · doble toque abajo a la derecha = siguiente</h2><div class="cues">${s.cues.map((c, i) => {
        const keys = c.notif && typeof c.notif.text === 'string' ? [c.notif.text] : [];
        return `<div class="cue${cur && i === R.cue ? ' next' : ''}"><div class="row"><b>${i + 1} · ${esc(c.label)}</b><button data-m="fire" data-i="${i}">Disparar ya</button></div>
          ${keys.map((k) => area('texts.' + k)).join('')}
          <div class="auto">Se dispara solo a los ${inp(`${sp}.delays.${i}`, 'number', 'min="0" step="0.5" inputmode="decimal"')} s <small>(0 = sólo a mano${i ? '; se cuenta desde el momento anterior' : '; se cuenta desde que arranca la escena'})</small></div></div>`;
      }).join('')}</div>`;
    }
    if (s.extras && s.extras.length) h += `<h2>Acciones aparte (no cuentan como momento)</h2><div class="cues">${s.extras.map((x, i) => `<div class="cue"><div class="row"><b>${esc(x.label)}</b><button data-m="extra" data-i="${i}">Hacer ya</button></div></div>`).join('')}</div>`;
    if (s.texts && s.texts.length) h += `<h2>Textos en pantalla</h2><div class="stack">${s.texts.map(([k, l]) => `<label class="sm">${esc(l)}</label>${area(k)}`).join('')}</div>`;
    h += `<h2>Ajustes de esta escena</h2><div class="f">`;
    h += row('Arranca en', seg(`${sp}.start`, sc.start, (s.starts || [['lock', 'Bloqueo'], ['app', 'App']])));
    if (s.erase) h += row('Bono a los X s de que termina de borrar', inp(`${sp}.afterErase`, 'number', 'min="0" step="0.5" inputmode="decimal"'), '0 = no. Se usa en lugar de la demora del momento 1');
    h += row('Hora', inp(`${sp}.time`, 'time'), S.phone.clock === 'device' ? 'Ahora se usa la hora real (ver Teléfono)' : '');
    h += row('Batería (%)', inp(`${sp}.batt`, 'number', 'min="1" max="100"'));
    h += row('Fecha en el bloqueo', inp(`${sp}.date`, 'text', `placeholder="${esc(S.phone.date)}"`), 'Vacío = la general');
    if (s.timer) {
      h += row('Cuenta regresiva (seg.)', inp(`${sp}.dur`, 'number', 'min="1" max="3600"'));
      if (s.timer === 'start') h += row('Al iniciar, la cuenta', seg(`${sp}.run`, sc.run, [['pause', 'Congelada'], ['run', 'Corriendo']]));
      if (s.timer === 'start') h += row('Al llegar a 0', seg(`${sp}.onZero`, sc.onZero, [['', 'Nada'], ['next', 'Siguiente momento']]));
    }
    h += `</div>`;
    if (s.sheet) h += s.sheet({ row, inp, area, seg, S, esc });
    // fotos
    h += `<details><summary>Fotos (desde la galería del celular)</summary><div class="imgs">${IMG_SLOTS.map(([k, l]) => `
      <div class="imgrow"><span class="th" style="background-image:url('${img(k)}')"></span><span class="il">${esc(l)}${hasImg(k) ? '' : ' <small>(provisoria)</small>'}</span>
      <button data-m="pick" data-slot="${k}">Elegir</button>${hasImg(k) ? `<button data-m="unpick" data-slot="${k}">Quitar</button>` : ''}</div>`).join('')}
      <button class="wide" data-m="pickgrid">Cargar varias fotos para el perfil de María (hasta 9)</button></div></details>`;
    // portal
    h += `<details><summary>Portal (perfil de María y la cuna)</summary><div class="f">
      ${row('Nombre de la app', inp('portal.appName'))}${row('Tema', seg('portal.theme', S.portal.theme, [['light', 'Claro'], ['dark', 'Oscuro']]))}
      ${row('Usuario', inp('portal.username'))}${row('Nombre', inp('portal.fullName'))}${row('Biografía', area('portal.bio'))}
      ${row('Publicaciones', inp('portal.posts', 'number'))}${row('Seguidores', inp('portal.followers', 'number'))}${row('Seguidos', inp('portal.following', 'number'))}
      ${row('Cuenta que vende la cuna', inp('portal.saved.account'))}${row('Texto de la publicación', area('portal.saved.caption', 4))}
      ${row('Me gusta', inp('portal.saved.likes'))}${row('Comentarios', inp('portal.saved.comments'))}${row('Fecha', inp('portal.saved.when'))}
      ${row('Lugar de la cuna en Guardado', inp('portal.cunaPos', 'number', 'min="1" max="15"'), '1 = primera')}</div></details>`;
    // chat
    h += `<details><summary>Chat y contactos</summary><div class="f">
      ${row('Nombre de la app', inp('chat.appName'))}
      ${['gloria', 'daniel', 'clara'].map((k) => row('Contacto', inp(`contacts.${k}.name`)) + row('Número', inp(`contacts.${k}.number`)) + row(`Conversación con ${esc(S.contacts[k].name)}`, area(`chat.threads.${k}`, 4), '“10:00 texto” = recibido · “> 10:05 texto” = enviado · “-- ayer” = separador')).join('')}
      ${row('Texto que escribe y borra (55)', area('chat.typeText'))}
      ${row('Velocidad al escribir solo (letras/seg)', inp('chat.typeSpeed', 'number', 'min="1" max="30"'))}
      ${row('Espera antes de borrar (seg.)', inp('chat.eraseAfter', 'number', 'min="0" step="0.5"'))}
      ${row('Otras conversaciones en la lista', area('chat.listExtra', 3), 'Una por línea: nombre | último mensaje | hora')}</div></details>`;
    // datos
    const dl = { rider: 'Nombre de la rider', riderId: 'ID de rider', cliente: 'Clienta (Clara)', dirCliente: 'Dirección de Clara', local: 'Local 1 (44, 55)', localSub: 'Local 1 · rubro', localDir: 'Local 1 · dirección', local2: 'Local 2 (52)', local2Sub: 'Local 2 · rubro', local2Dir: 'Local 2 · dirección', dirOferta: 'Dirección del pedido ofrecido (52, 55)', pedido: 'Número de pedido', montoOferta: 'Pago del pedido ofrecido', gananciasHoy: 'Ganancias de hoy', entregasHoy: 'Entregas de hoy', saldoSemana: 'Saldo de la semana (número)', puntualidad: 'Puntualidad', categoria: 'Categoría', obraSocial: 'Llamada al empezar la 47' };
    h += `<details><summary>Datos de la ficción (FLASHI)</summary><div class="f">${Object.keys(dl).map((k) => row(dl[k], inp('data.' + k, k === 'saldoSemana' ? 'number' : 'text'))).join('')}</div></details>`;
    // textos FLASHI
    h += `<details><summary>Todos los textos de FLASHI</summary><div class="stack">${Object.keys(S.texts).map((k) => `<label class="sm">${esc(k)}</label>${area('texts.' + k)}`).join('')}</div></details>`;
    // teléfono
    h += `<details open><summary>Teléfono</summary><div class="f">
      ${row('Reloj', seg('phone.clock', S.phone.clock, [['scene', 'Hora de la escena'], ['device', 'Hora real']]))}
      ${row('Fecha general (bloqueo)', inp('phone.date'))}
      ${row('Operadora', inp('phone.carrier'))}
      ${row('Señal', seg('phone.signal', +S.phone.signal, [[0, '0'], [1, '1'], [2, '2'], [3, '3'], [4, '4']]))}
      ${row('Red', seg('phone.net', S.phone.net, [['5G', '5G'], ['4G', '4G'], ['LTE', 'LTE'], ['', '—']]))}
      ${row('Wifi', seg('phone.wifi', !!S.phone.wifi, [[true, 'Sí'], [false, 'No']]))}
      ${row('Barra de estado falsa', seg('phone.statusBar', S.phone.statusBar, [['auto', 'Auto'], ['on', 'Sí'], ['off', 'No']]))}
      ${row('Notificaciones dentro de una app', seg('phone.banners', S.phone.banners, [['fixed', 'Quedan fijas'], ['auto', 'Se van a 6 s']]))}
      ${row('Vibrar con llamadas', seg('phone.vibrateCalls', !!S.phone.vibrateCalls, [[true, 'Sí'], [false, 'No']]))}
      ${row('Vibrar con notificaciones', seg('phone.vibrateNotifs', !!S.phone.vibrateNotifs, [[true, 'Sí'], [false, 'No']]))}
      ${row('Al tocar el ícono, abrir', `<select data-path="phone.launch" data-type="str">${[['menu', 'Lista de escenas']].concat(SCENES.map((x) => [x.id, x.id === 'libre' ? 'Uso libre' : 'Escena ' + x.id])).map(([v, l]) => `<option value="${v}" ${S.phone.launch === v ? 'selected' : ''}>${l}</option>`).join('')}</select>`)}
      ${row('Mostrar zonas ocultas', seg('phone.zones', !!S.phone.zones, [[false, 'No'], [true, 'Sí (ensayo)']]))}
    </div></details>`;
    h += `<h2>Cómo se usa</h2><div class="help">
      <b>Este menú:</b> mantener apretada 1 s la esquina superior izquierda.<br>
      <b>Siguiente momento:</b> doble toque en la esquina inferior derecha (o “Disparar ya”).<br>
      <b>Congelar / seguir la cuenta:</b> mantener apretada 1 s la esquina inferior derecha.<br>
      <b>Desbloquear:</b> deslizar hacia arriba, o tocar una notificación.<br>
      <b>Descartar notificación:</b> deslizarla hacia arriba.<br>
      <b>Inicio del celular:</b> deslizar hacia arriba desde la rayita de abajo.<br>
      <b>Llamadas:</b> los botones Rechazar / Responder / Cortar funcionan de verdad.</div>`;
    h += `<h2>Versión</h2><div class="row2"><span class="sm">Cargada: <b data-ver>…</b></span><button data-m="update">Buscar actualización</button></div>`;
    h += `<h2>Restablecer</h2><div class="row2"><button data-m="reset">${resetArm ? '¿Seguro? Tocá de nuevo: se borran textos, ajustes y fotos' : 'Volver a la configuración original'}</button></div>`;
    sheet.innerHTML = h;
    showVersion();
  }
  function parseVal(t) { if (t.dataset.type === 'num') { const n = parseFloat(t.value); return isNaN(n) ? 0 : n; } return t.value; }
  function bindSheet() {
    sheet.addEventListener('click', async (e) => {
      const sg = e.target.closest('.seg button');
      if (sg) { setPath(sg.parentNode.dataset.path, JSON.parse(sg.dataset.v)); renderSheet(); applyChrome(); return; }
      const b = e.target.closest('[data-m]'); if (!b) return;
      const m = b.dataset.m;
      if (m === 'close') closeSheet();
      else if (m === 'crew') { sheet.hidden = true; showCrew(); }
      else if (m === 'sel') { selId = b.dataset.id; resetArm = false; renderSheet(); sheet.scrollTop = 0; }
      else if (m === 'start') { sheet.hidden = true; startScene(selId); }
      else if (m === 'fire') { const i = +b.dataset.i; sheet.hidden = true; if (!R.scene || R.scene.id !== selId) startScene(selId); runCue(i); }
      else if (m === 'extra') { const i = +b.dataset.i; sheet.hidden = true; if (!R.scene || R.scene.id !== selId) startScene(selId); const x = R.scene.extras && R.scene.extras[i]; if (x) x.fn(A); }
      else if (m === 'update') checkUpdate();
      else if (m === 'reload') location.reload();
      else if (m === 'pick') pickImage(b.dataset.slot);
      else if (m === 'unpick') { await idb.del('img.' + b.dataset.slot); if (imgURL[b.dataset.slot]) URL.revokeObjectURL(imgURL[b.dataset.slot]); delete imgURL[b.dataset.slot]; delete imgFlags[b.dataset.slot]; store.set(IMGKEY, imgFlags); renderSheet(); }
      else if (m === 'pickgrid') pickGrid();
      else if (m === 'reset') {
        if (!resetArm) { resetArm = true; renderSheet(); return; }
        store.del(KEY); O = {}; S = merge(clone(DEF), O); A.S = S;
        await idb.clear(); Object.values(imgURL).forEach((u) => URL.revokeObjectURL(u)); for (const k in imgURL) delete imgURL[k]; imgFlags = {}; store.set(IMGKEY, imgFlags);
        resetArm = false; renderSheet(); toast('Configuración original', true);
      }
    });
    const onEdit = (e) => { const t = e.target; if (!t.dataset || !t.dataset.path || t.closest('.seg')) return; setPath(t.dataset.path, parseVal(t)); };
    sheet.addEventListener('input', onEdit);
    sheet.addEventListener('change', (e) => { onEdit(e); applyChrome(); });
  }
  function filePicker(multiple, cb) { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.multiple = !!multiple; i.onchange = () => cb(Array.from(i.files || [])); i.click(); }
  function shrink(file, max) {
    return new Promise((res) => {
      const u = URL.createObjectURL(file), im = new Image();
      im.onload = () => { const k = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight)); const c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u); c.toBlob((b) => res(b), 'image/jpeg', .86); };
      im.onerror = () => { URL.revokeObjectURL(u); res(null); };
      im.src = u;
    });
  }
  async function saveImg(slot, file) {
    const b = await shrink(file, /avatar|seller|gloria|daniel|clara/.test(slot) ? 640 : 1440);
    if (!b || !(await idb.set('img.' + slot, b))) return false;
    if (imgURL[slot]) URL.revokeObjectURL(imgURL[slot]);
    imgURL[slot] = URL.createObjectURL(b); imgFlags[slot] = true; store.set(IMGKEY, imgFlags);
    return true;
  }
  function pickImage(slot) { filePicker(false, async ([f]) => { if (!f) return; toast((await saveImg(slot, f)) ? 'Foto guardada' : 'No se pudo guardar esa foto', true); renderSheet(); }); }
  function pickGrid() { filePicker(true, async (files) => { let n = 0; for (const f of files.slice(0, 9)) { if (await saveImg('grid' + (n + 1), f)) n++; } toast(n + ' fotos guardadas', true); renderSheet(); }); }

  /* =======================================================================
     API para las apps
     ======================================================================= */
  const A = {
    R, apps: APPS, esc, fmt, money, pad, T, D, fill, img, hasImg, clockStr, dateStr, shortDate,
    go, open, set, notify, event, toast, lock, unlock, incomingCall, nextCue, later, vib, timerStart,
    get p() { return R.p; }, get timer() { return R.timer; }, get scene() { return R.scene; },
    render: () => renderScreen(false),
    app(def) { APPS[def.id] = def; },
    scenes(list) { SCENES = list; },
    async boot() {
      mount();
      await loadImages();
      const l = S.phone.launch;
      if (l && l !== 'menu' && sceneById(l)) startScene(l); else showCrew();
    }
  };
  Object.defineProperty(A, 'S', { get: () => S, set: (v) => { S = v; } });
  window.PHONE = A;
})();
