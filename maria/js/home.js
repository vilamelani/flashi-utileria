/* =========================================================================
   Pantalla de inicio del Android (genérica, sin marcas reales).
   ========================================================================= */
(() => {
  'use strict';
  const P = window.PHONE;
  const g = (bg, path) => `<svg viewBox="0 0 64 64"><rect width="64" height="64" fill="${bg}"/>${path}</svg>`;
  const DECO = [
    ['Reloj', g('#2B3A4A', '<circle cx="32" cy="32" r="17" fill="none" stroke="#fff" stroke-width="4"/><path d="M32 22v11l7 4" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>')],
    ['Calendario', g('#3E6FD8', '<rect x="16" y="19" width="32" height="28" rx="5" fill="#fff"/><rect x="16" y="19" width="32" height="8" fill="#BFD0F5"/><text x="32" y="44" font-size="15" font-weight="700" text-anchor="middle" fill="#3E6FD8" font-family="system-ui">14</text>')],
    ['Fotos', g('#F2F2F2', '<circle cx="25" cy="25" r="8" fill="#F7B32B"/><circle cx="39" cy="25" r="8" fill="#E8505B"/><circle cx="25" cy="39" r="8" fill="#3BB273"/><circle cx="39" cy="39" r="8" fill="#3E6FD8"/>')],
    ['Ajustes', g('#5F6B73', '<circle cx="32" cy="32" r="7" fill="none" stroke="#fff" stroke-width="4"/><path d="M32 15v6M32 43v6M15 32h6M43 32h6M20 20l4 4M40 40l4 4M20 44l4-4M40 24l4-4" stroke="#fff" stroke-width="4" stroke-linecap="round"/>')],
    ['Cámara', g('#2D2D2D', '<rect x="15" y="22" width="34" height="24" rx="5" fill="none" stroke="#fff" stroke-width="4"/><circle cx="32" cy="34" r="6" fill="none" stroke="#fff" stroke-width="4"/><path d="M25 22l3-5h8l3 5" fill="none" stroke="#fff" stroke-width="4"/>')],
    ['Mapas', g('#E9F1E7', '<path d="M16 20l10-4 12 4 10-4v28l-10 4-12-4-10 4z" fill="#8BC88A"/><circle cx="35" cy="28" r="6" fill="#E8505B"/>')],
    ['Notas', g('#F7C948', '<path d="M20 22h24M20 31h24M20 40h16" stroke="#6B4E00" stroke-width="4" stroke-linecap="round"/>')],
    ['Calculadora', g('#3A3A3A', '<rect x="20" y="16" width="24" height="32" rx="4" fill="none" stroke="#fff" stroke-width="3.5"/><path d="M25 24h14M26 33h2M36 33h2M26 41h2M36 41h2" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>')]
  ];
  const PHONEI = g('#2FA36B', '<path d="M24 16l6-.5 3.5 9-4.4 3.3a25 25 0 0 0 14 14l3.3-4.4 9 3.5-.5 6a5 5 0 0 1-5 4.6A36 36 0 0 1 14.5 21a5 5 0 0 1 4.6-5z" fill="#fff" transform="translate(-3 -2) scale(.95)"/>');
  const icon = (svg, label, act) => `<div class="hm-app"${act || ''}><span class="hm-ic">${svg}</span><span class="hm-l">${label}</span></div>`;

  P.app({
    id: 'home', name: 'Sistema', home: 'home', tone: () => 'light',
    screens: {
      home(A) {
        const apps = ['flashi', 'chat', 'portal'].map((id) => P.apps[id]);
        const wall = A.img('wallHome');
        return `<div class="hm" style="background-image:url('${wall}')">
          <div class="hm-glance"><b>${A.esc(A.dateStr().replace(/^(\w)/, (m) => m.toUpperCase()))}</b></div>
          <div class="hm-grid">${DECO.map(([l, s]) => icon(s, l)).join('')}</div>
          <div class="hm-dock">
            ${icon(PHONEI, 'Teléfono')}
            ${apps.map((a) => icon(a.icon, A.esc(a.label || a.name), ` data-act="open-app" data-app="${a.id}"`)).join('')}
          </div>
          <div class="hm-search"><span>Buscar</span></div>
        </div>`;
      }
    }
  });
})();
