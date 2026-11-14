/* =========================================================================
   Portal · la app tipo Instagram de GUITA (misma identidad que PORTAL:
   paleta de Arte en naranjas, logo con letra Grand Hotel).
   En el celular de María: su perfil → menú → Guardado → la cuna ($200.000).
   ========================================================================= */
(() => {
  'use strict';
  const P = window.PHONE;
  const I = {
    home: '<svg viewBox="0 0 24 24"><path d="M3.5 10.2 12 3.5l8.5 6.7V20.5h-5.6v-6.2H9.1v6.2H3.5z"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="7"/><path d="m20.5 20.5-4.7-4.7"/></svg>',
    add: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5.5"/><path d="M12 7.8v8.4M7.8 12h8.4"/></svg>',
    reels: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5.5"/><path d="M10 8.8v6.4l5.3-3.2z"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><path d="M4 6.5h16M4 12h16M4 17.5h16"/></svg>',
    chev: '<svg viewBox="0 0 24 24"><path d="m6 9.5 6 6 6-6"/></svg>',
    chevR: '<svg viewBox="0 0 24 24"><path d="m9.5 6 6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M20 12H4.5M11 5l-7 7 7 7"/></svg>',
    grid: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>',
    tagged: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4.5"/><circle cx="12" cy="10.2" r="3"/><path d="M6.6 19.5a6 6 0 0 1 10.8 0"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    dots: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.7" fill="currentColor" stroke="none"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20.5s-8-4.8-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 6.2-8 11-8 11z"/></svg>',
    bubble: '<svg viewBox="0 0 24 24"><path d="M20.5 12a8.5 8.5 0 0 1-12.4 7.6L3.5 21l1.4-4.4A8.5 8.5 0 1 1 20.5 12z"/></svg>',
    send: '<svg viewBox="0 0 24 24"><path d="M21 3.5 10.2 13.8M21 3.5 14.4 21l-4.2-7.2L3 9.7z"/></svg>',
    bm: '<svg viewBox="0 0 24 24"><path d="M6 3.5h12v17l-6-5-6 5z"/></svg>',
    bmOn: '<svg viewBox="0 0 24 24"><path d="M6 3.5h12v17l-6-5-6 5z" fill="currentColor"/></svg>',
    archive: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/><path d="M3 5.5 5 8l2.5-1.8"/></svg>',
    activity: '<svg viewBox="0 0 24 24"><path d="M3 12h4l2.5-6 5 12 2.5-6h4"/></svg>',
    bell: '<svg viewBox="0 0 24 24"><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10.5" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z"/></svg>'
  };
  const ICON = '<img src="icons/portal.png" alt="" style="width:100%;height:100%;display:block">';   // mismo ícono que PORTAL
  const SMALL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/></svg>';
  const nf = (n) => { n = +n || 0; if (n < 10000) return n.toLocaleString('es-AR'); if (n < 1e6) return (Math.floor(n / 100) / 10).toLocaleString('es-AR') + ' mil'; return (Math.floor(n / 1e5) / 10).toLocaleString('es-AR') + ' M'; };
  const nav = (A) => `<nav class="pt-nav"><span>${I.home}</span><span>${I.search}</span><span>${I.add}</span><span>${I.reels}</span><span class="me" data-act="profile"><img src="${A.img('avatar')}" alt=""></span></nav>`;
  const savedList = (A) => {
    const list = (A.S.portal.savedImages || []).slice();
    if (A.p.cunaSaved !== false) { const pos = Math.max(0, Math.min(list.length, (+A.S.portal.cunaPos || 1) - 1)); list.splice(pos, 0, 'cuna'); }
    return list;
  };

  function profile(A) {
    const po = A.S.portal;
    // Se ven tantas fotos como diga "publicaciones" (máximo 9): foto 1, foto 2…
    const n = Math.max(0, Math.min(9, Math.round(+po.posts || 0)));
    const grid = Array.from({ length: n }, (_, i) => `<div style="background-image:url('${A.img('grid' + (i + 1))}')"></div>`).join('');
    return `<div class="pt">
      <div class="pt-top"><div class="pt-user">${A.esc(po.username)}${I.chev}</div><div class="pt-acts"><span>${I.add}</span><span data-act="menu">${I.menu}</span></div></div>
      <div class="pt-scroll">
        <section class="pt-head">
          <div class="pt-av"><img src="${A.img('avatar')}" alt=""><span class="plus">${I.plus}</span></div>
          <div class="pt-right"><div class="pt-name">${A.esc(po.fullName)}</div>
            <div class="pt-stats"><div><b>${nf(po.posts)}</b><span>publicaciones</span></div><div><b>${nf(po.followers)}</b><span>seguidores</span></div><div><b>${nf(po.following)}</b><span>seguidos</span></div></div></div>
        </section>
        ${po.bio ? `<div class="pt-bio">${A.esc(po.bio)}</div>` : ''}
        <div class="pt-btns"><span>Editar perfil</span><span>Compartir perfil</span></div>
        <div class="pt-hl"><div><i>${I.plus}</i>Nuevo</div></div>
        <div class="pt-tabs"><span class="on">${I.grid}</span><span>${I.reels}</span><span>${I.tagged}</span></div>
        <div class="pt-grid">${grid}</div>
      </div>${nav(A)}</div>`;
  }
  function menu(A) {
    const item = (ic, t, act) => `<div class="pt-item"${act ? ` data-act="${act}"` : ''}><i>${ic}</i><span>${t}</span><em>${I.chevR}</em></div>`;
    return `<div class="pt">
      <div class="pt-top sub"><span class="pt-back" data-act="profile">${I.back}</span><div class="pt-title">Configuración y actividad</div></div>
      <div class="pt-scroll">
        <div class="pt-search">${I.search}<span>Buscar</span></div>
        <div class="pt-sec">Cómo usás ${A.esc(A.S.portal.appName)}</div>
        ${item(I.bm, 'Guardado', 'saved')}${item(I.archive, 'Archivo')}${item(I.activity, 'Tu actividad')}${item(I.bell, 'Notificaciones')}${item(I.clock, 'Tiempo en la app')}
        <div class="pt-sec">Quién puede ver tu contenido</div>
        ${item(I.lock, 'Privacidad de la cuenta')}${item(I.star, 'Mejores amigos')}
      </div></div>`;
  }
  function saved(A) {
    const list = savedList(A);
    return `<div class="pt">
      <div class="pt-top sub"><span class="pt-back" data-act="menu">${I.back}</span><div class="pt-title">Guardado</div><span class="pt-r">${I.plus}</span></div>
      <div class="pt-scroll">
        <div class="pt-coll"><b>Todas las publicaciones</b></div>
        <div class="pt-grid">${list.map((k) => `<div style="background-image:url('${A.img(k)}')"${k === 'cuna' ? ' data-act="post"' : ''}></div>`).join('')}</div>
      </div>${nav(A)}</div>`;
  }
  function post(A) {
    const s = A.S.portal.saved, on = A.p.cunaSaved !== false;
    return `<div class="pt">
      <div class="pt-top sub"><span class="pt-back" data-act="saved">${I.back}</span><div class="pt-title">Publicaciones</div></div>
      <div class="pt-scroll">
        <div class="pt-ph"><img class="av" src="${A.img('seller')}" alt=""><b>${A.esc(s.account)}</b><span class="ic">${I.dots}</span></div>
        <div class="pt-img" style="background-image:url('${A.img('cuna')}')"></div>
        <div class="pt-row"><span>${I.heart}</span><span>${I.bubble}</span><span>${I.send}</span><span class="bm${on ? ' on' : ''}" data-act="toggleSave">${on ? I.bmOn : I.bm}</span></div>
        <div class="pt-likes"><b>${A.esc(s.likes)} Me gusta</b></div>
        <div class="pt-cap"><b>${A.esc(s.account)}</b> ${A.esc(s.caption)}</div>
        <div class="pt-more">Ver los ${A.esc(s.comments)} comentarios</div>
        <div class="pt-when">${A.esc(s.when)}</div>
      </div>${nav(A)}</div>`;
  }

  P.app({
    id: 'portal', get name() { return P.S.portal.appName; }, icon: ICON, small: SMALL, color: '#FC8565', colorText: '#fff',
    home: 'profile', tone: (A) => (A.S.portal.theme === 'dark' ? 'light' : 'dark'),
    onSceneStart(A) { A.p.cunaSaved = true; },
    actions: {
      profile: (A) => A.go('profile'),
      menu: (A) => A.go('menu'),
      saved: (A) => A.go('saved'),
      post: (A) => A.go('post'),
      toggleSave: (A, el) => { A.p.cunaSaved = A.p.cunaSaved === false; el.classList.toggle('on', A.p.cunaSaved); el.innerHTML = A.p.cunaSaved ? I.bmOn : I.bm; el.classList.add('pop'); setTimeout(() => el.classList.remove('pop'), 300); }
    },
    after(A, root) { root.dataset.theme = A.S.portal.theme; },
    screens: { profile, menu, saved, post }
  });
})();
