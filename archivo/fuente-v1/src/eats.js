/* ===== FLASHI EATS · app de Clara (iPhone) ===== */
(function(){
var TAB={
 home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/></svg>',
 search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
 bag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 8h14l-1 13H6Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
 user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>'
};
var ICON='<svg viewBox="0 0 64 64"><rect width="64" height="64" fill="#1EF08A"/><text x="14" y="46" font-family="Unbounded,system-ui,sans-serif" font-weight="800" font-size="40" fill="#03140A">f</text><circle cx="45" cy="42" r="6" fill="#03140A"/></svg>';
var STAR='<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9Z"/></svg>';
var CHECK='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
var PLAY='<svg width="14" height="16" viewBox="0 0 14 16" fill="#fff"><path d="M1 1.5v13a1 1 0 0 0 1.5.9l11-6.5a1 1 0 0 0 0-1.8l-11-6.5A1 1 0 0 0 1 1.5Z"/></svg>';
var PAUSE='<svg width="14" height="16" viewBox="0 0 14 16" fill="#fff"><rect x="1" y="1" width="4" height="14" rx="1"/><rect x="9" y="1" width="4" height="14" rx="1"/></svg>';
var MIC='<svg width="16" height="18" viewBox="0 0 16 22" fill="none" stroke="#8E8E93" stroke-width="2" stroke-linecap="round"><rect x="4" y="1" width="8" height="13" rx="4"/><path d="M1 10a7 7 0 0 0 14 0M8 17v4"/></svg>';
var WAVE=[8,14,20,12,24,18,10,22,26,16,12,20,14,24,10,18,22,12,16,26,20,14,10,18,24,12,16,20,10,14,22,18,12,8,14,10];
var CHIPS=['Llegó tarde','Comida fría','Faltó algo','Mal empaquetado','Repartidora descortés','Otro'];
var SLAB=['','Muy malo','Malo','Regular','Bueno','Excelente'];

function tabs(on){var t=[['home','Inicio',TAB.home],['search','Buscar',TAB.search],['orders','Pedidos',TAB.bag],['profile','Perfil',TAB.user]];
  return '<nav class="tabs">'+t.map(function(x){return '<span data-act="tab" data-to="'+x[0]+'" class="'+(x[0]===on?'on':'')+'">'+x[2]+x[1]+'</span>';}).join('')+'</nav>';}
function top(A){var D=A.D();return '<div class="top"><span class="logo">flashi<i></i><small>Eats</small></span><span class="avatar">'+A.esc(String(D.cliente).charAt(0))+'</span></div>';}
function pad(n){return (n<10?'0':'')+n;}

var app={
 id:'eats',platform:'ios',appName:'FLASHI EATS',home:'home',batt:64,clockDefault:'device',
 icon:ICON,iconSmall:ICON,
 help:'<b>Reloj:</b> por defecto usa la hora del iPhone (ajustala a mano en Configuración del iPhone para cada escena).',
 data:{
  cliente:{label:'Nombre de la clienta',value:'Clara'},
  dirCliente:{label:'Dirección de Clara',value:'Av. Rivadavia 4120, 7º B'},
  local:{label:'Local',value:'Burger Voraz'},
  item:{label:'Pedido',value:'Doble cheddar + papas'},
  precio:{label:'Precio del pedido',value:'$14.900'},
  rider:{label:'Rider',value:'María G.'},
  riderId:{label:'ID de rider',value:'#R-4471'},
  pedido:{label:'Número de pedido',value:'#88213'},
  madre:{label:'Contacto del audio',value:'Mamá'},
  audioDur:{label:'Duración del audio (seg.)',value:'14'}
 },
 texts:{
  c2_rate:{label:'Esc 2 · Notificación (inventada)',value:'¿Cómo estuvo tu pedido de {local}? Calificá tu experiencia.'},
  rated_note:{label:'Pantalla calificación enviada · Texto (inventado)',value:'Tu calificación impacta en el puntaje de la repartidora.'},
  c6_arr:{label:'Esc 6 · Notificación (inventada)',value:'Tu repartidora llegó. Salí a buscar tu pedido.'},
  c7_coupon:{label:'Esc 7 · Notificación cupón',value:'¡Lunes de no cocinar! Te regalamos un cupón de $8000! Aprovechá ahora y disfrutá de tu snack favorito!'},
  c7_again:{label:'Esc 7 · Notificación pedir otra vez',value:'Si querés utilizar el cupón antes de que expire, tocá en pedir otra vez'},
  chat_old1:{label:'Chat · Mensaje viejo de la madre',value:'Hija, ¿estás bien? No me contestás.'},
  chat_old2:{label:'Chat · Respuesta vieja de Clara',value:'Sí ma, perdón. Mucho trabajo.'}
 },
 scenes:[
  {id:'c2',name:'Esc 2 · Día · Reclamo: tarde y frío',short:'Esc 2',desc:'Inicio con “Tu pedido fue entregado”. Clara toca Calificar, pone estrellas y marca “Llegó tarde” y “Comida fría”.',
   time:'12:05',batt:64,start:'app',screen:'home',p:{delivered:true},
   cues:[{label:'Notificación: ¿cómo estuvo tu pedido? (inventada, opcional)',notif:{text:'c2_rate',open:'rate'}},{label:'Abrir la calificación',go:'rate'}]},
  {id:'c6',name:'Esc 6 · Día · Esperando a María en el hall',short:'Esc 6',desc:'Seguimiento del pedido. Cada momento acerca a la repartidora hasta que llega.',
   time:'12:58',batt:58,start:'app',screen:'track',p:{stage:0},
   cues:[{label:'Llega en 2 min',set:{stage:1}},{label:'Llega en 1 min',set:{stage:2}},
         {label:'Notificación: tu repartidora llegó',fn:function(A){A.set({stage:3,upStart:Date.now()});},notif:{text:'c6_arr',open:'track'}}]},
  {id:'c7',name:'Esc 7 · Noche · Audio de mamá y cupón',short:'Esc 7',desc:'Chat genérico con el audio de la madre (se reproduce visualmente). Llegan las dos notificaciones del cupón. Clara toca “Pedir otra vez”.',
   time:'21:14',batt:41,start:'app',screen:'chat',
   cues:[{label:'Notificación: cupón de $8000',notif:{text:'c7_coupon',open:'home',p:{coupon:true}}},
         {label:'Notificación: pedir otra vez',notif:{text:'c7_again',open:'home',p:{coupon:true}}},
         {label:'Abrir inicio con el cupón',go:'home',p:{coupon:true}}]},
  {id:'free',name:'Uso libre',short:'uso libre',desc:'Inicio de la app, sin momentos.',time:'16:30',batt:70,start:'app',screen:'home',cues:[]}
 ],
 actions:{
  tab:function(A,el){var to=el.getAttribute('data-to');A.go('home');},
  home:function(A){A.go('home',{delivered:false});},
  rate:function(A){A.go('rate',{stars:0,chips:[]});},
  star:function(A,el){A.set({stars:+el.getAttribute('data-v')});},
  chip:function(A,el){var v=el.getAttribute('data-v'),c=(A.p.chips||[]).slice(),i=c.indexOf(v);if(i<0)c.push(v);else c.splice(i,1);A.set({chips:c});},
  send:function(A){A.go('rated',{delivered:false});},
  reorder:function(A){A.go('confirmed',{useCoupon:!!A.p.coupon});},
  follow:function(A){A.go('track',{stage:0,coupon:false});},
  back:function(A){A.go('home');},
  play:function(A){if(A.p.playing){A.p.playing=false;A.p.aPos=curPos(A);}else{A.p.playing=true;A.p.aStart=Date.now()-(A.p.aPos||0)*1000;if((A.p.aPos||0)>=dur(A))A.p.aStart=Date.now();}audioTick(A,true);}
 },
 onStart:function(A){A.p.playing=false;A.p.aPos=0;A.p.cStart=null;},
 onGo:function(A,s){if(s==='home'&&A.p.coupon&&!A.p.cStart)A.p.cStart=Date.now();},
 screens:{
  home:function(A){var D=A.D(),p=A.p;
   var deliv=p.delivered?'<div class="deliv"><div class="r"><span class="ok">'+CHECK+'</span><div><b>Tu pedido de '+A.esc(D.local)+' fue entregado</b><span>Pedido '+A.esc(D.pedido)+' · ¿Cómo estuvo?</span></div></div><button class="btn" data-act="rate">Calificar pedido</button></div>':'';
   var promo=p.coupon?
     '<div class="promo"><span class="tag num" data-cexp>Vence en 14:59</span><h4>¡Lunes de no cocinar!</h4><div class="big num">$8.000</div><p>Te regalamos un cupón para tu snack favorito. Aprovechá ahora.</p><button class="btn" data-act="reorder">Pedir otra vez · '+A.esc(D.local)+'</button></div>'
    :'<div class="promo soft"><h4>Envío gratis en heladerías</h4><p style="margin:4px 0 0">Solo hoy, pedidos desde $9.000.</p></div>';
   return top(A)+'<div class="loc">Entregar en<b>'+A.esc(D.dirCliente)+' ▾</b></div>'+deliv+promo+
    '<div class="last"><span class="thumb"></span><div><b>'+A.esc(D.local)+'</b>'+A.esc(D.item)+' · '+A.esc(D.precio)+'</div>'+(p.coupon?'':'<button class="sbtn" data-act="reorder">Pedir otra vez</button>')+'</div>'+
    '<div class="cats"><span>Hamburguesas</span><span>Chocolate</span><span>Helado</span><span>Sushi</span><span>Pizza</span></div>'+
    '<div class="sect">Cerca tuyo</div><div class="rlist">'+
     '<div><span class="thumb th2"></span><p><b>Heladería Polar</b>25–35 min · 4,6 ★</p><em>Envío gratis</em></div>'+
     '<div><span class="thumb th3"></span><p><b>Choco Bar 24 h</b>15–25 min · 4,4 ★</p><em>−20%</em></div>'+
     '<div><span class="thumb th4"></span><p><b>Pizzería La Esquina</b>30–40 min · 4,2 ★</p><em>2×1</em></div></div>'+
    '<div class="spacer"></div>'+tabs('home');},

  rate:function(A){var D=A.D(),s=A.p.stars||0,c=A.p.chips||[];
   var st='';for(var i=1;i<=5;i++)st+='<button data-act="star" data-v="'+i+'" class="'+(i<=s?'on':'')+'" aria-label="'+i+' estrellas">'+STAR+'</button>';
   return '<div class="hdr"><button class="bk" data-act="back">‹</button><h2>Calificá tu pedido</h2></div>'+
    '<div class="card ordc"><span class="thumb"></span><div><b>'+A.esc(D.local)+'</b>Pedido '+A.esc(D.pedido)+' · Entregado por '+A.esc(D.rider)+'</div></div>'+
    '<div class="q">¿Cómo estuvo tu pedido?</div><div class="stars">'+st+'</div><div class="slabel">'+SLAB[s]+'</div>'+
    '<div class="q" style="font-size:16px;padding-top:18px">¿Qué salió mal?</div>'+
    '<div class="chips">'+CHIPS.map(function(x){return '<button data-act="chip" data-v="'+x+'" class="'+(c.indexOf(x)>=0?'on':'')+'">'+x+'</button>';}).join('')+'</div>'+
    '<div class="spacer"></div><div class="bottom" style="padding:14px 16px 20px"><button class="btn'+(s?'':' dim')+'" data-act="send">Enviar calificación</button></div>';},

  rated:function(A){var D=A.D(),s=A.p.stars||1,c=A.p.chips||[];
   var stars='';for(var i=1;i<=5;i++)stars+='<span style="color:'+(i<=s?'#FFB020':'var(--s3)')+';display:inline-block;width:22px;height:22px">'+STAR+'</span>';
   return '<div style="background:radial-gradient(120% 55% at 50% 0%,#1EF08A44,transparent 62%);display:flex;flex-direction:column;align-items:center;text-align:center;padding:48px 22px 0"><span style="width:84px;height:84px;border-radius:50%;background:var(--g);display:grid;place-items:center;color:var(--gi);box-shadow:0 0 50px #1EF08Aaa;margin-bottom:18px">'+CHECK.replace('width="20" height="20"','width="40" height="40"')+'</span>'+
    '<h1 style="font-family:var(--fd);font-weight:800;font-size:26px;letter-spacing:-.03em;margin:0 0 10px">Recibimos tu calificación</h1><div>'+stars+'</div>'+
    '<p style="font-size:14px;color:var(--tx2);margin:10px 0 0">'+A.esc(c.join(' · ')||'Sin comentarios')+'</p></div>'+
    '<div class="card" style="margin:22px 16px 0;font-size:14px;line-height:1.45;color:var(--tx2)">'+A.esc(A.T('rated_note'))+'<br><b style="color:var(--g)">Te acreditamos $1.500 en Flashi Créditos.</b></div>'+
    '<div class="spacer"></div><div style="padding:14px 16px 20px"><button class="btn" data-act="home">Volver al inicio</button></div>';},

  track:function(A){var D=A.D(),s=A.p.stage||0;
   var eta=['4 min','2 min','1 min'][s];var prog=[.35,.62,.84,1][s];
   var head=s<3?'<span class="lbl">Llega en</span><div class="big num">'+eta+'</div><div class="sub">'+A.esc(D.rider)+' está en camino con tu pedido</div>'
     :'<span class="lbl">Tu pedido</span><div class="big arrived glowg">Llegó</div><div class="sub">'+A.esc(D.rider)+' te espera en la puerta</div><span class="waiting">Esperando hace <b class="num" data-up>0:00</b></span>';
   var steps='';for(var i=0;i<4;i++)steps+='<i class="'+(i<=s?'on':'')+(i===s&&s<3?' now':'')+'"></i>';
   return top(A)+'<div class="eta">'+head+'</div><div class="steps">'+steps+'</div>'+
    '<div class="map">'+FLASHI_MAP({prog:prog})+'</div>'+
    '<div class="sheet"><span class="grab"></span><div class="rider"><span class="avatar">'+A.esc(String(D.rider).charAt(0))+'</span><div><b>'+A.esc(D.rider)+'</b>Rider '+A.esc(D.riderId)+' · Bici · <em>4,6 ★</em></div></div>'+
    '<div class="acts" style="margin:8px 0 0"><span>Chat</span><span>Llamar</span></div><span class="meta" style="margin-top:6px">'+A.esc(D.local)+' · '+A.esc(D.item)+'</span></div>';},

  chat:function(A){var D=A.D();
   var w=WAVE.map(function(h){return '<i style="height:'+h+'px"></i>';}).join('');
   return '<div class="chat"><div class="ch"><span class="bk">‹</span><span class="av">'+A.esc(String(D.madre).charAt(0))+'</span><div><b>'+A.esc(D.madre)+'</b><span>en línea</span></div></div>'+
    '<div class="body"><span class="day">jueves</span><div class="m in">'+A.esc(A.T('chat_old1'))+'<small>19:48</small></div><div class="m out">'+A.esc(A.T('chat_old2'))+'<small>23:02 ✓✓</small></div>'+
    '<span class="day">Hoy</span><div class="m in aud"><button class="play" data-act="play">'+(A.p.playing?PAUSE:PLAY)+'</button><span class="wave" data-wave>'+w+'</span><span class="adur num" data-adur>0:'+pad(dur(A))+'</span></div>'+
    '<div class="m in" style="padding:3px 11px 5px;background:none"><small style="text-align:left">21:13</small></div></div>'+
    '<div class="inp"><span>Mensaje</span><i>'+MIC+'</i></div></div>';},

  confirmed:function(A){var D=A.D(),c=A.p.useCoupon;
   var price=parseInt(String(D.precio).replace(/\D/g,''),10)||14900;var total=price+1200-(c?8000:0);
   var m=function(n){return '$'+String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'.');};
   return '<div style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:44px 22px 0;background:radial-gradient(120% 55% at 50% 0%,#1EF08A44,transparent 62%)"><span style="width:84px;height:84px;border-radius:50%;background:var(--g);display:grid;place-items:center;color:var(--gi);box-shadow:0 0 50px #1EF08Aaa;margin-bottom:18px">'+CHECK.replace('width="20" height="20"','width="40" height="40"')+'</span>'+
    '<h1 style="font-family:var(--fd);font-weight:800;font-size:28px;letter-spacing:-.035em;margin:0 0 8px">¡Pedido confirmado!</h1><p style="margin:0;color:var(--tx2);font-size:15px">Llega en 25–35 min</p></div>'+
    '<div class="card sum"><div class="r"><span>1× '+A.esc(D.item)+'</span><span>'+A.esc(D.precio)+'</span></div><div class="r"><span>Envío</span><span>$1.200</span></div>'+
    (c?'<div class="r"><span class="green">Cupón Lunes de no cocinar</span><span class="green">−$8.000</span></div>':'')+
    '<div class="r tot"><span style="color:var(--tx)">Total</span><b class="num">'+m(total)+'</b></div></div>'+
    '<div class="spacer"></div><div style="padding:14px 16px 20px"><button class="btn" data-act="follow">Seguir mi pedido</button></div>';}
 }
};
function dur(A){var d=parseInt(A.D().audioDur,10);return d>0?d:14;}
function curPos(A){if(!A.p.playing)return A.p.aPos||0;return Math.min(dur(A),(Date.now()-A.p.aStart)/1000);}
function audioTick(A,force){
  var w=document.querySelector('[data-wave]');if(!w)return;
  var pos=curPos(A),d=dur(A);
  if(A.p.playing&&pos>=d){A.p.playing=false;A.p.aPos=d;force=true;}
  var bars=w.children,n=Math.round(bars.length*pos/d);
  for(var i=0;i<bars.length;i++)bars[i].classList.toggle('p',i<n);
  var t=document.querySelector('[data-adur]');if(t){var r=A.p.playing||pos>0?pos:d;r=Math.floor(r);t.textContent=Math.floor(r/60)+':'+pad(r%60);}
  if(force){var b=document.querySelector('.chat .play');if(b)b.innerHTML=A.p.playing?PAUSE:PLAY;}
}
var API=FLASHI(app);window.FLASHI_APP=API;
setInterval(function(){
  if(API.p.playing)audioTick(API,false);
  var e=document.querySelectorAll('[data-cexp]');if(e.length&&API.p.cStart){var left=Math.max(0,899-Math.floor((Date.now()-API.p.cStart)/1000));
    for(var i=0;i<e.length;i++)e[i].textContent='Vence en '+pad(Math.floor(left/60))+':'+pad(left%60);}
},250);
})();
