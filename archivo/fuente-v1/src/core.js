/* ================= FLASHI · motor de rodaje =================
   Una app = FLASHI(config). El motor maneja: escenas y momentos (cues),
   pantalla de bloqueo falsa, notificaciones, cuenta regresiva congelable,
   reloj por escena, menú oculto y gestos invisibles. */
(function(){
'use strict';

var ICON = {
  sig:'<svg width="17" height="12" viewBox="0 0 17 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor"/><rect x="4.5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor"/><rect x="9" y="3" width="3" height="9" rx="1" fill="currentColor"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="currentColor" opacity=".35"/></svg>',
  wifiA:'<svg width="16" height="13" viewBox="0 0 16 13"><path d="M8 13 0 3.2A12.6 12.6 0 0 1 8 0a12.6 12.6 0 0 1 8 3.2Z" fill="currentColor"/></svg>',
  wifiI:'<svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.6 10.4 9a3.4 3.4 0 0 0-4.8 0Z M8 5.8a6 6 0 0 1 4.2 1.7l1.4-1.5A8 8 0 0 0 8 3.7 8 8 0 0 0 2.4 6l1.4 1.5A6 6 0 0 1 8 5.8Z M8 1.9a10 10 0 0 1 7 2.8L16 3.6A11.6 11.6 0 0 0 8 .4 11.6 11.6 0 0 0 0 3.6l1 1.1a10 10 0 0 1 7-2.8Z" fill="currentColor"/></svg>',
  lock:'<svg viewBox="0 0 18 22"><rect x="1" y="9" width="16" height="12.5" rx="3" fill="#fff"/><path d="M4.5 9.5V6.3a4.5 4.5 0 0 1 9 0v3.2" fill="none" stroke="#fff" stroke-width="2.2"/></svg>',
  fp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6.5 5.5a8 8 0 0 1 11 0M4.5 10a8.5 8.5 0 0 1 15 0M8 20.5c-1-1.6-1.5-3.5-1.5-5.5a5.5 5.5 0 0 1 11 0v1M12 15v1.5c0 1.8.6 3.4 1.6 4.6M9.3 18.8C9 17.6 9 16.3 9 15a3 3 0 0 1 6 0M17.5 19.5c-.8.3-1.6.5-2.5.5"/></svg>',
  torch:'<svg width="20" height="22" viewBox="0 0 20 22" fill="#fff"><path d="M5 1h10v4l-2.5 4v11a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V9L5 5Z" opacity=".95"/></svg>',
  cam:'<svg width="24" height="20" viewBox="0 0 24 20" fill="#fff"><path d="M8 1h8l1.8 2.5H21a2.5 2.5 0 0 1 2.5 2.5v10.5A2.5 2.5 0 0 1 21 19H3A2.5 2.5 0 0 1 .5 16.5V6A2.5 2.5 0 0 1 3 3.5h3.2Z"/><circle cx="12" cy="10.8" r="4.3" fill="#3a3a3c"/></svg>',
  phone:'<svg width="22" height="22" viewBox="0 0 24 24" fill="#E3F1E8"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1Z"/></svg>',
  camA:'<svg width="22" height="22" viewBox="0 0 24 24" fill="#E3F1E8"><path d="M9 3 7.2 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.2L15 3Zm3 14.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/></svg>'
};

function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function pad(n){return (n<10?'0':'')+n;}
function clone(o){return JSON.parse(JSON.stringify(o||{}));}
function isIOSDevice(){var ua=navigator.userAgent||'';return /iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1);}

window.FLASHI = function(app){
  var KEY='flashi-'+app.id+'-v1';
  var cfg = load();
  var st = {scene:null,cue:0,screen:app.home,p:{},locked:false,lockN:[],t0:Date.now(),
            timer:{on:false,total:60,left:60,run:false,last:0},seq:0};
  var dev, scrwrap, lockwrap, hu, sbar, menu;

  function defaults(){return {sceneId:app.scenes[0].id,clock:app.clockDefault||'scene',date:app.dateDefault||'lunes, 14 de octubre',
    bar:'auto',banners:'fixed',wall:null,zones:false,data:{},texts:{},sc:{}};}
  function load(){var d=defaults();try{var s=JSON.parse(localStorage.getItem(KEY)||'null');if(s){for(var k in s)d[k]=s[k];}}catch(e){}return d;}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(cfg));}catch(e){}}

  /* ---------- datos y textos ---------- */
  function D(){var o={};for(var k in app.data)o[k]=app.data[k].value;for(var j in cfg.data)if(cfg.data[j]!=='')o[j]=cfg.data[j];return o;}
  function T(key){
    var v = (cfg.texts[key]!=null)?cfg.texts[key]:(app.texts[key]?app.texts[key].value:key);
    var d=D(); return String(v).replace(/\{(\w+)\}/g,function(m,k){return d[k]!=null?d[k]:m;});
  }
  function sceneById(id){for(var i=0;i<app.scenes.length;i++)if(app.scenes[i].id===id)return app.scenes[i];return app.scenes[0];}
  function SC(s){var b={start:s.start||'app',time:s.time||'12:00',batt:s.batt!=null?s.batt:(app.batt||60),dur:s.dur||0,run:s.run||'pause'};
    var o=cfg.sc[s.id]||{};for(var k in o)b[k]=o[k];return b;}

  /* ---------- reloj ---------- */
  function clockStr(){
    if(cfg.clock==='device'){var n=new Date();return pad(n.getHours())+':'+pad(n.getMinutes());}
    var sc=SC(st.scene||app.scenes[0]);var hm=(sc.time||'12:00').split(':');
    var mins=(+hm[0])*60+(+hm[1])+Math.floor((Date.now()-st.t0)/60000);
    mins=((mins%1440)+1440)%1440;return pad(Math.floor(mins/60))+':'+pad(mins%60);
  }
  function batt(){return SC(st.scene||app.scenes[0]).batt;}

  /* ---------- barra de estado ---------- */
  function barVisible(){if(cfg.bar==='on')return true;if(cfg.bar==='off')return false;return !(app.platform==='ios'&&isIOSDevice());}
  function sbarHTML(){
    var b=batt(),low=b<=15;
    if(app.platform==='android'){
      var bat='<svg width="9" height="15" viewBox="0 0 9 15"><rect x="2.5" y="0" width="4" height="2" rx=".6" fill="currentColor"/><rect x=".75" y="1.75" width="7.5" height="12.5" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="'+(3+10*(1-b/100)).toFixed(1)+'" width="5" height="'+(10*b/100).toFixed(1)+'" rx=".6" fill="'+(low?'#FF4D5E':'currentColor')+'"/></svg>';
      return '<span data-clock>'+clockStr()+'</span><span class="ic">'+ICON.wifiA+'<span style="font-size:11.5px">5G</span>'+ICON.sig+bat+'<span class="pct">'+b+'%</span></span>';
    }
    var w=Math.max(2,Math.round(19*b/100));
    var bi='<svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.6" fill="none" stroke="currentColor" opacity=".4"/><rect x="2.2" y="2.2" width="'+w+'" height="8.6" rx="2" fill="'+(low?'#FF453A':'currentColor')+'"/><path d="M25 4.4v4.2a2.2 2.2 0 0 0 0-4.2Z" fill="currentColor" opacity=".45"/></svg>';
    return '<span data-clock>'+clockStr()+'</span>'+(document.body.classList.contains('framed')?'<span class="isl"></span>':'')+'<span class="ic">'+ICON.sig+ICON.wifiI+bi+'</span>';
  }
  function applyBar(){
    var vis=barVisible();
    dev.classList.toggle('hidebar',!vis);
    // iOS 26+: la barra de estado real aplica un desenfoque (efecto Liquid Glass) ~40pt por debajo
    // del área segura. Con la barra real, bajamos el contenido para que no quede desenfocado.
    var top = vis ? (app.platform==='ios'?'54px':'30px') : (app.platform==='ios'?'calc(env(safe-area-inset-top, 0px) + 42px)':'env(safe-area-inset-top, 0px)');
    dev.style.setProperty('--sbh',top);
    dev.style.setProperty('--tabpad', app.platform==='ios' ? (vis?'20px':'env(safe-area-inset-bottom, 0px)') : '0px');
    sbar.innerHTML=sbarHTML();
  }

  /* ---------- render ---------- */
  function api(){return A;}
  function renderScreen(anim){
    var fn=app.screens[st.screen]||app.screens[app.home];
    var html=fn(A);
    scrwrap.innerHTML='<div class="scr'+(anim?' enter':'')+' s-'+st.screen+'">'+html+'</div>';
    tickTimer(true);tickUp();
  }
  function renderLock(){
    if(!st.locked){lockwrap.innerHTML='';return;}
    var wall = cfg.wall ? 'style="--wall:url('+cfg.wall+') center/cover"' : '';
    var n=st.lockN.map(notifHTML).join('');
    if(app.platform==='android'){
      lockwrap.innerHTML='<div class="lockA" '+wall+' data-lock>'+
        '<div class="date"><span>'+esc(shortDate())+'</span><span></span></div>'+
        '<div class="clock num" data-clockbig></div>'+
        '<div class="nl">'+n+'</div>'+
        '<div class="foot"><span class="sc">'+ICON.phone+'</span><span class="fp">'+ICON.fp+'</span><span class="sc">'+ICON.camA+'</span></div></div>';
    } else {
      lockwrap.innerHTML='<div class="lockI" '+wall+' data-lock>'+
        '<svg class="lk" viewBox="0 0 18 22">'+ICON.lock.replace(/^<svg[^>]*>|<\/svg>$/g,'')+'</svg>'+
        '<div class="date">'+esc(cfg.date)+'</div>'+
        '<div class="clock" data-clockbig></div>'+
        '<div class="nl">'+n+'</div>'+
        '<div class="foot"><span class="sc">'+ICON.torch+'</span><span class="sc">'+ICON.cam+'</span></div><div class="hbar"></div></div>';
    }
    tickClock();
  }
  function shortDate(){ // "lunes, 14 de octubre" -> "lun, 14 oct"
    var m=cfg.date.match(/^(\w+),?\s+(\d+)\s+de\s+(\w+)/i);
    if(!m)return cfg.date; return m[1].slice(0,3)+', '+m[2]+' '+m[3].slice(0,3);
  }
  function renderAll(anim){applyBar();renderScreen(anim);renderLock();}

  /* ---------- notificaciones ---------- */
  function notifHTML(n){
    var ic=app.platform==='android'?app.iconSmall:app.icon;
    var t=n.title?'<div class="tt">'+esc(n.title)+'</div>':'';
    var sub=n.sub?'<div class="bd" style="opacity:.8">'+esc(n.sub)+'</div>':'';
    if(app.platform==='android'){
      return '<div class="nA'+(n.urgent?' hot':'')+'" data-n="'+n.id+'"><span class="ai">'+ic+'</span><div class="hd"><b>'+esc(app.appName)+'</b>·<span>ahora</span></div>'+t+'<div class="bd">'+esc(n.body)+'</div>'+sub+'</div>';
    }
    return '<div class="nI" data-n="'+n.id+'"><span class="ai">'+ic+'</span><div class="hd"><b>'+esc(app.appName)+'</b><span>ahora</span></div>'+t+'<div class="bd">'+esc(n.body)+'</div>'+sub+'</div>';
  }
  var allN={};
  function notify(spec){
    var n={id:'n'+(++st.seq),title:spec.title?T(spec.title):'',body:T(spec.text),sub:spec.sub?T(spec.sub):'',urgent:!!spec.urgent,open:spec.open||null,p:spec.p||null};
    allN[n.id]=n;
    if(st.locked){
      st.lockN.unshift(n);
      var nl=lockwrap.querySelector('.nl');
      if(nl){nl.insertAdjacentHTML('afterbegin',notifHTML(n));}else renderLock();
    } else {
      hu.insertAdjacentHTML('afterbegin',notifHTML(n));
      while(hu.children.length>2)hu.removeChild(hu.lastElementChild);
      if(cfg.banners==='auto'){var id=n.id;setTimeout(function(){dismiss(id);},6000);}
    }
    return n;
  }
  function dismiss(id){var el=hu.querySelector('[data-n="'+id+'"]');if(!el)return;el.classList.add('out');setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);},260);}
  function clearBanners(){hu.innerHTML='';}
  function tapNotif(id){
    var n=allN[id];if(!n)return;
    if(st.locked){st.lockN=st.lockN.filter(function(x){return x.id!==id;});unlock(n.open,n.p);return;}
    dismiss(id);if(n.open)go(n.open,n.p);
  }

  /* ---------- navegación ---------- */
  function go(screen,p){if(p)for(var k in p)st.p[k]=p[k];st.screen=screen;
    if(app.onGo)app.onGo(A,screen);
    if(st.locked){st.locked=false;renderLock();}
    renderScreen(true);}
  function unlock(screen,p){
    var el=lockwrap.firstElementChild;
    if(screen){if(p)for(var k in p)st.p[k]=p[k];st.screen=screen;if(app.onGo)app.onGo(A,screen);}
    renderScreen(false);
    if(el){el.classList.add('unlocking');setTimeout(function(){st.locked=false;st.lockN=[];renderLock();},300);}
    else {st.locked=false;renderLock();}
  }
  function lock(){st.locked=true;clearBanners();renderLock();}
  function set(p,rerender){for(var k in p)st.p[k]=p[k];if(rerender!==false&&!st.locked)renderScreen(false);}

  /* ---------- cuenta regresiva ---------- */
  function fmt(sec,mode){sec=Math.max(0,Math.ceil(sec));var m=Math.floor(sec/60),s=sec%60;
    if(mode==='s')return String(sec);if(mode==='mm')return pad(m)+':'+pad(s);return m+':'+pad(s);}
  function timerStart(total,run){var sc=SC(st.scene);st.timer.total=total||sc.dur||60;st.timer.left=st.timer.total;st.timer.on=true;st.timer.run=(run!==false);st.timer.last=performance.now();tickTimer(true);}
  function timerToggle(){if(!st.timer.on)return;if(st.timer.left<=0)return;st.timer.run=!st.timer.run;st.timer.last=performance.now();}
  function tickTimer(force){
    var t=st.timer,now=performance.now();
    if(t.run){t.left-=(now-t.last)/1000;t.last=now;if(t.left<=0){t.left=0;t.run=false;if(app.onTimerZero)app.onTimerZero(A);}}
    var p=t.total?Math.max(0,t.left/t.total*100):0;
    var els=scrwrap.querySelectorAll('[data-t]');
    for(var i=0;i<els.length;i++){var e=els[i];var txt=fmt(t.left,e.getAttribute('data-t'));if(e.textContent!==txt||force)e.textContent=txt;e.classList.toggle('t-zero',t.on&&t.left<=0);}
    var ps=scrwrap.querySelectorAll('[data-tp]');for(var j=0;j<ps.length;j++)ps[j].style.setProperty('--p',p.toFixed(2));
  }
  function tickUp(){var els=scrwrap.querySelectorAll('[data-up]');if(!els.length)return;var since=st.p.upStart||Date.now();var s=Math.floor((Date.now()-since)/1000);
    for(var i=0;i<els.length;i++)els[i].textContent=Math.floor(s/60)+':'+pad(s%60);}
  function tickClock(){var c=clockStr();var a=document.querySelectorAll('[data-clock]');for(var i=0;i<a.length;i++)if(a[i].textContent!==c)a[i].textContent=c;
    var b=lockwrap.querySelector('[data-clockbig]');if(b){if(app.platform==='android'){var h=c.split(':');var html='<span>'+h[0]+'</span><span>'+h[1]+'</span>';if(b.innerHTML!==html)b.innerHTML=html;}else if(b.textContent!==c)b.textContent=c;}}

  /* ---------- escenas y cues ---------- */
  function startScene(id){
    var s=sceneById(id);cfg.sceneId=s.id;save();
    var sc=SC(s);
    st.scene=s;st.cue=0;st.p=clone(s.p);st.t0=Date.now();st.lockN=[];st.seq=st.seq||0;
    st.screen=s.screen||app.home;
    st.timer={on:false,total:sc.dur||60,left:sc.dur||60,run:false,last:performance.now()};
    if(s.timer==='start'){st.timer.on=true;st.timer.run=(sc.run==='run');}
    st.p.upStart=Date.now();
    clearBanners();
    st.locked=(sc.start==='lock');
    if(app.onStart)app.onStart(A,s);
    renderAll(false);
  }
  function runCue(i){
    var s=st.scene,c=s.cues[i];if(!c)return;
    if(c.timer)timerStart(SC(s).dur,true);
    if(c.stopTimer)st.timer.run=false;
    if(c.set)for(var k in c.set)st.p[k]=c.set[k];
    if(c.go){clearBanners();go(c.go,c.p);}else if((c.timer||c.set)&&!st.locked)renderScreen(false);
    if(c.notif)notify(c.notif);
    if(c.fn)c.fn(A);
    st.cue=i+1;
  }
  function nextCue(){if(!st.scene)return;if(st.cue<st.scene.cues.length)runCue(st.cue);}

  /* ---------- gestos ---------- */
  function bindZones(){
    var mz=dev.querySelector('.hz.menu'),cz=dev.querySelector('.hz.cue');
    var taps=[];
    mz.addEventListener('pointerdown',function(e){e.preventDefault();var now=Date.now();taps=taps.filter(function(t){return now-t<700;});taps.push(now);if(taps.length>=3){taps=[];openMenu();}});
    var pend=null,lastTap=0;
    cz.addEventListener('pointerdown',function(e){e.preventDefault();var now=Date.now();
      if(pend&&now-lastTap<320){clearTimeout(pend);pend=null;timerToggle();return;}
      lastTap=now;pend=setTimeout(function(){pend=null;nextCue();},320);});
  }
  function bindDevice(){
    dev.addEventListener('click',function(e){
      var n=e.target.closest('[data-n]');if(n&&!n.closest('#menu')){tapNotif(n.getAttribute('data-n'));return;}
      var a=e.target.closest('[data-act]');if(a&&!a.closest('#menu')){var f=app.actions[a.getAttribute('data-act')];if(f)f(A,a);}
    });
    var y0=null,tgt=null;
    dev.addEventListener('pointerdown',function(e){y0=e.clientY;tgt=e.target;wake();});
    dev.addEventListener('pointerup',function(e){if(y0==null)return;var dy=e.clientY-y0;
      if(st.locked&&tgt&&tgt.closest('[data-lock]')&&dy<-70)unlock();
      var b=tgt&&tgt.closest('.hu [data-n]');if(b&&dy<-30)dismiss(b.getAttribute('data-n'));
      y0=null;});
    document.addEventListener('gesturestart',function(e){e.preventDefault();});
    document.addEventListener('dblclick',function(e){e.preventDefault();},{passive:false});
  }
  var wl=null;function wake(){try{if(!wl&&navigator.wakeLock)navigator.wakeLock.request('screen').then(function(l){wl=l;l.addEventListener('release',function(){wl=null;});}).catch(function(){});}catch(e){}}
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')wake();});

  /* ================= MENÚ ================= */
  var selId=null,resetArm=false;
  function openMenu(){selId=(st.scene&&st.scene.id)||cfg.sceneId;renderMenu();menu.hidden=false;menu.scrollTop=0;}
  function closeMenu(){menu.hidden=true;if(!st.scene)startScene(cfg.sceneId);}
  function seg(key,val,opts){return '<div class="seg" data-seg="'+key+'">'+opts.map(function(o){return '<button type="button" data-v="'+o[0]+'" class="'+(String(val)===String(o[0])?'on':'')+'">'+o[1]+'</button>';}).join('')+'</div>';}
  function textField(k){var def=app.texts[k];if(!def)return '';var v=(cfg.texts[k]!=null)?cfg.texts[k]:def.value;
    return '<textarea id="tx-'+k+'" data-text="'+k+'" rows="2">'+esc(v)+'</textarea>';}
  function renderMenu(){
    var s=sceneById(selId),sc=SC(s),cur=st.scene&&st.scene.id===s.id;
    var h='<div class="mh"><h1>'+esc(app.appName)+' · Control de rodaje</h1><button class="x" data-m="close">Volver a la app</button></div>';
    h+='<div class="sm">'+(st.scene?'En pantalla: <b style="color:#fff">'+esc(st.scene.name)+'</b> · momento '+Math.min(st.cue+1,st.scene.cues.length)+' de '+st.scene.cues.length+(st.cue>=st.scene.cues.length?' (terminados)':''):'Ninguna escena iniciada')+'</div>';
    h+='<h2>Escena</h2><div class="scn">'+app.scenes.map(function(x){return '<button data-m="sel" data-id="'+x.id+'" class="'+(x.id===s.id?'sel':'')+'"><b>'+esc(x.name)+'</b><span>'+esc(x.desc)+'</span></button>';}).join('')+'</div>';
    h+='<button class="go" data-m="start">Iniciar '+esc(s.short||s.name)+' desde el principio</button>';
    h+='<h2>Momentos (toque abajo a la derecha = siguiente)</h2><div class="cues">'+s.cues.map(function(c,i){
      var keys=[];if(c.notif){if(c.notif.title)keys.push(c.notif.title);keys.push(c.notif.text);if(c.notif.sub)keys.push(c.notif.sub);}
      return '<div class="cue'+(cur&&i===st.cue?' next':'')+'"><div class="row"><b>'+esc(c.label)+'</b><button data-m="fire" data-i="'+i+'">Disparar ya</button></div>'+keys.map(textField).join('')+'</div>';}).join('')+(s.cues.length?'':'<div class="sm">Esta escena no tiene momentos: solo navegación libre.</div>')+'</div>';
    if(s.texts&&s.texts.length){h+='<h2>Textos en pantalla</h2><div class="stack" style="display:flex;flex-direction:column;gap:8px">'+s.texts.map(function(k){return '<label class="sm">'+esc(app.texts[k].label)+'</label>'+textField(k);}).join('')+'</div>';}
    h+='<h2>Ajustes de esta escena</h2><div class="f">';
    h+='<label>Arranca en</label>'+seg('start',sc.start,[['lock','Bloqueo'],['app','App']]);
    h+='<label>Hora de la escena</label><input type="time" id="sc-time" data-sc="time" value="'+esc(sc.time)+'">';
    h+='<label>Batería (%)</label><input type="number" id="sc-batt" data-sc="batt" min="1" max="100" value="'+sc.batt+'">';
    if(s.timer){h+='<label>Cuenta regresiva (seg.)</label><input type="number" id="sc-dur" data-sc="dur" min="1" max="3600" value="'+sc.dur+'">';}
    if(s.timer==='start'){h+='<label>Al iniciar, el timer</label>'+seg('run',sc.run,[['pause','Pausado'],['run','Corriendo']]);}
    h+='</div>';
    h+='<h2>Datos de la ficción</h2><div class="f">'+Object.keys(app.data).map(function(k){var v=cfg.data[k]!=null&&cfg.data[k]!==''?cfg.data[k]:app.data[k].value;return '<label>'+esc(app.data[k].label)+'</label><input type="text" id="dt-'+k+'" data-data="'+k+'" value="'+esc(v)+'">';}).join('')+'</div>';
    h+='<h2>Teléfono</h2><div class="f">';
    h+='<label>Reloj</label>'+seg('clock',cfg.clock,[['scene','Hora de escena'],['device','Del teléfono']]);
    h+='<label>Fecha (bloqueo)</label><input type="text" id="g-date" data-g="date" value="'+esc(cfg.date)+'">';
    h+='<label>Barra de estado falsa</label>'+seg('bar',cfg.bar,[['auto','Auto'],['on','Sí'],['off','No']]);
    h+='<label>Notificaciones en app</label>'+seg('banners',cfg.banners,[['fixed','Quedan fijas'],['auto','Se van a 6 s']]);
    h+='<label>Fondo de bloqueo</label><div class="row2"><label class="x" style="padding:9px 12px;border-radius:10px;background:#242826;font-weight:700;font-size:13px;color:#fff">Elegir imagen<input type="file" accept="image/*" id="g-wall" hidden></label>'+(cfg.wall?'<button data-m="nowall">Quitar</button>':'')+'</div>';
    h+='<label>Mostrar zonas ocultas</label>'+seg('zones',cfg.zones?'1':'0',[['0','No'],['1','Sí (ensayo)']]);
    h+='</div>';
    h+='<h2>Cómo se usa</h2><div class="help">'+
      '<b>Abrir este menú:</b> 3 toques rápidos arriba a la izquierda (sobre el logo o el reloj).<br>'+
      '<b>Siguiente momento:</b> 1 toque en la esquina inferior derecha.<br>'+
      '<b>Congelar / seguir la cuenta regresiva:</b> 2 toques rápidos en la esquina inferior derecha.<br>'+
      '<b>Desbloquear:</b> deslizar hacia arriba en la pantalla de bloqueo, o tocar la notificación.<br>'+
      '<b>Descartar una notificación:</b> deslizarla hacia arriba.'+(app.help?'<br>'+app.help:'')+'</div>';
    h+='<h2>Restablecer</h2><div class="row2"><button data-m="reset">'+(resetArm?'¿Seguro? Tocá de nuevo para borrar todos los ajustes':'Borrar todos los ajustes y textos editados')+'</button></div>';
    menu.innerHTML=h;
  }
  function bindMenu(){
    menu.addEventListener('click',function(e){
      var b=e.target.closest('[data-m]');
      var sg=e.target.closest('[data-seg] button');
      if(sg){var key=sg.parentNode.getAttribute('data-seg'),v=sg.getAttribute('data-v');
        if(key==='start'||key==='run'){cfg.sc[selId]=cfg.sc[selId]||{};cfg.sc[selId][key]=v;}
        else if(key==='zones'){cfg.zones=(v==='1');document.body.classList.toggle('debugzones',cfg.zones);}
        else {cfg[key]=v;}
        save();if(key==='bar'||key==='clock')applyBar();renderMenu();return;}
      if(!b)return;var m=b.getAttribute('data-m');
      if(m==='close')closeMenu();
      else if(m==='sel'){selId=b.getAttribute('data-id');resetArm=false;renderMenu();}
      else if(m==='start'){startScene(selId);menu.hidden=true;}
      else if(m==='fire'){var i=+b.getAttribute('data-i');if(!st.scene||st.scene.id!==selId)startScene(selId);menu.hidden=true;runCue(i);}
      else if(m==='nowall'){cfg.wall=null;save();renderLock();renderMenu();}
      else if(m==='reset'){if(!resetArm){resetArm=true;renderMenu();return;}try{localStorage.removeItem(KEY);}catch(x){}cfg=defaults();resetArm=false;document.body.classList.remove('debugzones');renderAll(false);renderMenu();}
    });
    menu.addEventListener('input',function(e){
      var t=e.target;
      if(t.hasAttribute('data-text')){cfg.texts[t.getAttribute('data-text')]=t.value;save();}
      else if(t.hasAttribute('data-data')){cfg.data[t.getAttribute('data-data')]=t.value;save();}
      else if(t.hasAttribute('data-sc')){var k=t.getAttribute('data-sc');cfg.sc[selId]=cfg.sc[selId]||{};cfg.sc[selId][k]=(k==='time')?t.value:Math.max(1,+t.value||1);save();}
      else if(t.hasAttribute('data-g')){cfg[t.getAttribute('data-g')]=t.value;save();}
    });
    menu.addEventListener('change',function(e){
      var t=e.target;if(t.id==='g-wall'&&t.files&&t.files[0]){shrink(t.files[0],function(url){cfg.wall=url;save();renderLock();renderMenu();});}
      if(t.hasAttribute('data-sc')||t.hasAttribute('data-data')||t.hasAttribute('data-text')){applyBar();if(st.scene&&!st.locked)renderScreen(false);}
    });
  }
  function shrink(file,cb){var r=new FileReader();r.onload=function(){var img=new Image();img.onload=function(){var W=1170,sc=Math.min(1,W/img.width);var c=document.createElement('canvas');c.width=Math.round(img.width*sc);c.height=Math.round(img.height*sc);c.getContext('2d').drawImage(img,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.82));};img.src=r.result;};r.readAsDataURL(file);}

  /* ---------- montaje ---------- */
  function framed(){var f=window.matchMedia('(min-width: 700px)').matches&&window.matchMedia('(pointer: fine)').matches;document.body.classList.toggle('framed',f);}
  function mount(){
    document.body.classList.add(app.platform);
    document.body.classList.toggle('debugzones',!!cfg.zones);
    framed();window.addEventListener('resize',function(){framed();applyBar();});
    dev=document.getElementById('device');dev.classList.add(app.platform);
    dev.innerHTML='<div id="scrwrap"></div><div id="lockwrap"></div><div class="hu" id="hu"></div><div class="sbar" id="sbar"></div><div class="hz menu" aria-hidden="true"></div><div class="hz cue" aria-hidden="true"></div><div id="menu" hidden></div>';
    scrwrap=dev.querySelector('#scrwrap');lockwrap=dev.querySelector('#lockwrap');hu=dev.querySelector('#hu');sbar=dev.querySelector('#sbar');menu=dev.querySelector('#menu');
    bindZones();bindDevice();bindMenu();
    startScene(cfg.sceneId);
    setInterval(function(){tickTimer(false);},200);
    setInterval(function(){tickClock();tickUp();},1000);
  }

  var A={st:st,cfg:cfg,T:T,D:D,esc:esc,fmt:fmt,go:go,set:set,notify:notify,lock:lock,unlock:unlock,timerStart:timerStart,
    get timer(){return st.timer;},render:function(){renderScreen(false);},nextCue:nextCue,start:startScene,runCue:runCue,openMenu:openMenu,SC:function(){return SC(st.scene);}};
  Object.defineProperty(A,'p',{get:function(){return st.p;}});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
  return A;
};
})();
