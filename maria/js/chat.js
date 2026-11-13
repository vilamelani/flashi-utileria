/* =========================================================================
   Chat · app de mensajes genérica (sin logo ni marca de WhatsApp,
   mismo criterio que en PORTAL). Teclado "mágico": cualquier tecla escribe
   el texto del guion; la tecla de borrar lo va borrando.
   ========================================================================= */
(() => {
  'use strict';
  const P = window.PHONE;
  const I = {
    back: '<svg viewBox="0 0 24 24"><path d="M20 12H4.5M11 5l-7 7 7 7"/></svg>',
    video: '<svg viewBox="0 0 24 24"><rect x="2.5" y="6.5" width="13" height="11" rx="2.5"/><path d="M15.5 10.5 21.5 7v10l-6-3.5z"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M6.7 3.2 9.4 3l1.6 4.1-2 1.5a11.3 11.3 0 0 0 6.4 6.4l1.5-2 4.1 1.6-.2 2.7a2.3 2.3 0 0 1-2.3 2.1A16.4 16.4 0 0 1 3.7 5.5a2.3 2.3 0 0 1 3-2.3z"/></svg>',
    dots: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.7" fill="currentColor" stroke="none"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="7"/><path d="m20.5 20.5-4.7-4.7"/></svg>',
    smile: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0"/><circle cx="9" cy="10" r=".9" fill="currentColor"/><circle cx="15" cy="10" r=".9" fill="currentColor"/></svg>',
    clip: '<svg viewBox="0 0 24 24"><path d="M20 11.5 12.4 19a5 5 0 0 1-7.1-7.1l7.8-7.8a3.3 3.3 0 0 1 4.7 4.7l-7.6 7.6a1.7 1.7 0 0 1-2.4-2.4l7-7"/></svg>',
    cam: '<svg viewBox="0 0 24 24"><path d="M3.5 8h3.4l1.8-2.8h6.6L17.1 8h3.4v11.3h-17z"/><circle cx="12" cy="13.2" r="3.4"/></svg>',
    mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5v3.5"/></svg>',
    send: '<svg viewBox="0 0 24 24"><path d="M4 12 20.5 4 16 20.5l-3.5-6.8z" fill="currentColor"/></svg>',
    bksp: '<svg viewBox="0 0 24 24"><path d="M8.5 5H20a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 20 19H8.5L2.5 12z"/><path d="m11 9 6 6M17 9l-6 6"/></svg>',
    shift: '<svg viewBox="0 0 24 24"><path d="M12 4 4 12.5h4.5V20h7v-7.5H20z"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M20.5 12a8.5 8.5 0 0 1-12.4 7.6L3.5 21l1.4-4.4A8.5 8.5 0 1 1 20.5 12z"/></svg>',
    timer: '<svg viewBox="0 0 24 24" class="tmr"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9.5 2.5h5"/></svg>',
    ticks: '<svg viewBox="0 0 18 12" class="tk"><path d="M1 6.5 4.5 10 11 2.5M7.5 10 14 2.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  const ICON = '<svg viewBox="0 0 64 64"><rect width="64" height="64" fill="#5B8CFF"/><path d="M47 31a15 15 0 0 1-21.9 13.4L17 47l2.5-7.8A15 15 0 1 1 47 31z" fill="#fff"/></svg>';
  const SMALL = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 12a8.5 8.5 0 0 1-12.4 7.6L3.5 21l1.4-4.4A8.5 8.5 0 1 1 20.5 12z"/></svg>';

  function parse(text) {
    return String(text || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
      if (l.startsWith('--')) return { day: l.replace(/^-+\s*/, '') };
      if (l.startsWith('!!')) return { sys: l.replace(/^!+\s*/, '') };
      const m = l.match(/^(>\s*)?(\d{1,2}:\d{2})?\s*(.*)$/);
      return { out: !!m[1], time: m[2] || '', text: m[3] };
    });
  }
  const contact = (A, k) => A.S.contacts[k] || { name: k };
  const avatar = (A, k) => A.hasImg(k) ? `<img src="${A.img(k)}" alt="">` : `<span>${A.esc((contact(A, k).name || '?').charAt(0).toUpperCase())}</span>`;

  function list(A) {
    const rows = [];
    ['gloria', 'daniel', 'clara'].forEach((k) => {
      const msgs = parse(A.S.chat.threads[k]).filter((m) => !m.day && !m.sys);
      if (!msgs.length) return;
      const last = msgs[msgs.length - 1];
      rows.push(`<div class="cl-row" data-act="thread" data-k="${k}"><span class="av">${avatar(A, k)}</span><div class="cl-main"><div class="cl-top"><b>${A.esc(contact(A, k).name)}</b><small>${A.esc(last.time)}</small></div><div class="cl-last">${last.out ? I.ticks : ''}${A.esc(last.text)}</div></div></div>`);
    });
    String(A.S.chat.listExtra || '').split('\n').filter((l) => l.trim()).forEach((l, i) => {
      const [n, m, t] = l.split('|').map((x) => (x || '').trim());
      rows.push(`<div class="cl-row"><span class="av" style="--h:${(i * 97 + 40) % 360}"><span>${A.esc((n || '?').charAt(0).toUpperCase())}</span></span><div class="cl-main"><div class="cl-top"><b>${A.esc(n)}</b><small>${A.esc(t)}</small></div><div class="cl-last">${A.esc(m)}</div></div></div>`);
    });
    return `<div class="ch">
      <div class="ch-bar"><b class="ch-title">${A.esc(A.S.chat.appName)}</b><span class="ic">${I.cam}</span><span class="ic">${I.search}</span><span class="ic">${I.dots}</span></div>
      <div class="ch-filters"><span class="on">Todos</span><span>No leídos</span><span>Grupos</span></div>
      <div class="cl">${rows.join('')}</div>
      <span class="fab">${I.chat}</span>
    </div>`;
  }

  const KEYS = [['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'], ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫']];
  function keyboard() {
    const k = (c) => c === '⇧' ? `<span class="k wide" data-act="key">${I.shift}</span>` : c === '⌫' ? `<span class="k wide" data-act="bksp" data-bksp>${I.bksp}</span>` : `<span class="k" data-act="key">${c}</span>`;
    return `<div class="kbd">
      <div class="kb-sug"><span>de</span><span>que</span><span>la</span></div>
      ${KEYS.map((r, i) => `<div class="kr${i === 1 ? ' r2' : ''}">${r.map(k).join('')}</div>`).join('')}
      <div class="kr"><span class="k wide fn" data-act="key">?123</span><span class="k fn" data-act="key">,</span><span class="k space" data-act="key">Español</span><span class="k fn" data-act="key">.</span><span class="k wide fn" data-act="key">↵</span></div>
    </div>`;
  }
  function thread(A) {
    const k = A.p.thread || 'gloria', c = contact(A, k);
    const msgs = parse(A.S.chat.threads[k]).concat(A.p.sent || []);
    const body = msgs.map((m) => m.sys ? `<div class="sys"><span>${I.timer}${A.esc(m.sys)}</span></div>` : m.day ? `<div class="day"><span>${A.esc(m.day)}</span></div>`
      : `<div class="msg ${m.out ? 'out' : 'in'}"><span class="tx">${A.esc(m.text)}</span><span class="tm">${A.esc(m.time)}${m.out ? I.ticks : ''}</span></div>`).join('');
    const draft = draftText(A);
    return `<div class="ch th${A.p.kbd ? ' typing' : ''}">
      <div class="ch-bar th-bar"><span class="ic back" data-act="back">${I.back}</span><span class="av sm">${avatar(A, k)}</span><div class="th-who"><b>${A.esc(c.name)}</b></div><span class="ic">${I.video}</span><span class="ic">${I.phone}</span><span class="ic">${I.dots}</span></div>
      <div class="th-body" data-act="hidekbd"><div class="th-msgs">${body}</div></div>
      <div class="cm">
        <div class="cm-box" data-act="showkbd"><span class="ic">${I.smile}</span><span class="cm-text${draft ? '' : ' ph'}"><span class="cm-t">${draft ? A.esc(draft) : 'Mensaje'}</span><i class="caret"></i></span><span class="ic">${I.clip}</span><span class="ic cm-cam"${draft ? ' hidden' : ''}>${I.cam}</span></div>
        <span class="cm-btn" data-act="send">${draft ? I.send : I.mic}</span>
      </div>
      ${A.p.kbd ? keyboard() : ''}
    </div>`;
  }
  const target = (A) => String(A.S.chat.typeText || '');
  const draftText = (A) => target(A).slice(0, Math.max(0, Math.min(A.p.n || 0, target(A).length)));
  function updateDraft(A) {
    const el = document.querySelector('.cm-text'), t = document.querySelector('.cm-t'); if (!el || !t) return;
    const d = draftText(A);
    t.textContent = d || 'Mensaje'; el.classList.toggle('ph', !d);
    const cam = document.querySelector('.cm-cam'); if (cam) cam.hidden = !!d;
    const b = document.querySelector('.cm-btn'); if (b) b.innerHTML = d ? I.send : I.mic;
  }
  function type(A, dir) { A.p.n = Math.max(0, Math.min(target(A).length, (A.p.n || 0) + dir)); updateDraft(A); }
  function scrollBottom() { const b = document.querySelector('.th-body'); if (b) b.scrollTop = b.scrollHeight; }

  // Escribe y borra solo (para la 55, cuando el celular está desenfocado)
  function autoType(A) {
    if (A.p.thread == null) A.p.thread = 'daniel';
    if (!(window.PHONE.R.app === 'chat' && A.p.kbd)) A.open('chat', 'thread', { kbd: true });
    const len = target(A).length, step = 1000 / Math.max(1, +A.S.chat.typeSpeed || 9);
    let i = A.p.n || 0;
    const up = () => { if (i < len) { i++; A.p.n = i; updateDraft(A); A.later(up, step * (0.6 + Math.random() * 0.8)); } else A.later(down, (+A.S.chat.eraseAfter || 2.5) * 1000); };
    const down = () => { if (i > 0) { i--; A.p.n = i; updateDraft(A); A.later(down, 55); } };
    up();
  }

  P.app({
    id: 'chat', get name() { return P.S.chat.appName; }, icon: ICON, small: SMALL, color: '#5B8CFF', colorText: '#fff',
    home: 'list', tone: () => 'light',
    onSceneStart(A) { A.p.n = 0; A.p.kbd = !!A.p.kbd; A.p.sent = []; },
    autoType,
    lastText: (k) => { const m = parse(P.S.chat.threads[k]).filter((x) => !x.day && !x.sys); return m.length ? m[m.length - 1].text : ''; },
    actions: {
      thread: (A, el) => A.go('thread', { thread: el.dataset.k, n: 0, kbd: false, sent: [] }),
      back: (A) => { if (A.p.kbd) { A.set({ kbd: false }); return; } A.go('list'); },
      showkbd: (A) => { if (!A.p.kbd) A.set({ kbd: true }); },
      hidekbd: (A) => { if (A.p.kbd) A.set({ kbd: false }); },
      key: () => { /* lo maneja el pointerdown (más rápido, sobre todo en iPhone) */ },
      bksp: () => { /* lo maneja el pointerdown (para poder mantener apretado) */ },
      send: (A) => {
        const d = draftText(A); if (!d) return;
        A.p.sent = (A.p.sent || []).concat([{ out: true, time: A.clockStr(), text: d }]); A.p.n = 0; A.render();
      }
    },
    after(A, root) {
      scrollBottom();
      const b = root.querySelector('[data-bksp]');
      if (b) {
        let t = null, iv = null;
        const stop = () => { clearTimeout(t); clearInterval(iv); t = iv = null; };
        b.addEventListener('pointerdown', (e) => { e.preventDefault(); type(A, -1); t = setTimeout(() => { iv = setInterval(() => type(A, -1), 70); }, 420); });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => b.addEventListener(ev, stop));
      }
      root.querySelectorAll('.k').forEach((k) => {
        if (k.hasAttribute('data-bksp')) return;
        k.addEventListener('pointerdown', (e) => { e.preventDefault(); type(A, +1); k.classList.add('pr'); setTimeout(() => k.classList.remove('pr'), 110); });
      });
    },
    screens: { list, thread }
  });
})();
