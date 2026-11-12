/* ===== FLASHI Delivery · app de María (Android) ===== */
(function(){
var TAB={
 home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/></svg>',
 money:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2.5" y="6" width="19" height="13" rx="3"/><circle cx="12" cy="12.5" r="3"/><path d="M6 6V4.5h12V6"/></svg>',
 list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></svg>',
 user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>'
};
var BOLT='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 2 4 13.5h6.5L9.5 22 20 9.8h-6.6Z"/></svg>';
var ICON_FULL='<svg viewBox="0 0 64 64"><rect width="64" height="64" fill="#060D09"/><text x="14" y="46" font-family="Unbounded,system-ui,sans-serif" font-weight="800" font-size="40" fill="#E9F4EE">f</text><circle cx="45" cy="42" r="6" fill="#1EF08A"/></svg>';
var ARROW='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19V11a4 4 0 0 1 4-4h10M15 3l4 4-4 4"/></svg>';

function money(n){var s=String(Math.abs(Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g,'.');return (n<0?'−':'')+'$'+s;}
function tabs(on){var t=[['home','Inicio',TAB.home],['earnings','Ganancias',TAB.money],['orders','Pedidos',TAB.list],['profile','Perfil',TAB.user]];
  return '<nav class="tabs">'+t.map(function(x){return '<span data-act="tab" data-to="'+x[0]+'" class="'+(x[0]===on?'on':'')+'">'+x[2]+x[1]+'</span>';}).join('')+'</nav>';}
function top(A){var on=A.p.online!==false;
  return '<div class="top"><span class="logo">flashi<i></i><small>Delivery</small></span><button class="chip'+(on?'':' off')+'" data-act="toggleOnline"><span class="dot"></span>'+(on?'Conectada':'Desconectada')+'</button></div>';}
function first(n){return String(n).split(' ')[0];}

var app={
 id:'delivery',platform:'android',appName:'FLASHI Delivery',home:'home',batt:40,clockDefault:'scene',
 icon:ICON_FULL,iconSmall:BOLT,
 help:'<b>Aceptar / Confirmar entrega:</b> los botones verdes funcionan de verdad al tocarlos.',
 data:{
  rider:{label:'Nombre de la rider',value:'María G.'},
  riderId:{label:'ID de rider',value:'#R-4471'},
  cliente:{label:'Clienta (Clara)',value:'Clara M.'},
  dirCliente:{label:'Dirección de Clara',value:'Av. Rivadavia 4120, 7º B'},
  cliente5:{label:'Cliente Esc 5',value:'Julián R.'},
  dir5:{label:'Dirección Esc 5',value:'Yerbal 1480, PB'},
  local:{label:'Local del pedido',value:'Burger Voraz'},
  localDir:{label:'Dirección del local',value:'Hidalgo 612'},
  dirOferta:{label:'Dirección oferta Esc 11/14',value:'Av. La Plata 890, 3º A'},
  pedido:{label:'Número de pedido',value:'#88213'},
  gananciasHoy:{label:'Ganancias de hoy',value:'$18.450'},
  entregasHoy:{label:'Entregas de hoy',value:'12'}
 },
 texts:{
  e1_urgent:{label:'Esc 1 · Texto en pantalla',value:'¡Rápido! Solo queda 1 minuto para entregar tu pedido y participar por el bono de $10.000'},
  e1_late:{label:'Esc 1 · Notificación',value:'¡Estuviste cerca pero no fue suficiente! ¡Entregaste tarde! Será la próxima!'},
  fail_head:{label:'Pantalla bono perdido · Título',value:'¡Entregaste tarde!'},
  fail_sub:{label:'Pantalla bono perdido · Texto',value:'¡Estuviste cerca pero no fue suficiente! Será la próxima.'},
  e5_bonus:{label:'Esc 5 · Notificación bono',value:'Entregá tu pedido en 1 minuto y ganá un bono de $10.000!'},
  e5_won:{label:'Esc 5 · Notificación ganaste',value:'¡Felicitaciones! Tu eficiencia tiene premio. Ganaste $10.000.'},
  e6_tip:{label:'Esc 6 · Notificación propina',value:'Te han dejado propina extra por $5000'},
  e8_new:{label:'Esc 8 · Notificación',value:'Nuevo pedido asignado.'},
  e8_addr:{label:'Esc 8 · Segunda línea (dirección)',value:'{cliente} · {dirCliente}'},
  e11_demand:{label:'Esc 11 · Notificación alta demanda',value:'Alta demanda en tu zona. Si permanecés desconectado de la app perderás prioridad para futuros pedidos.'},
  e11_last:{label:'Esc 11 · Notificación 30 segundos',value:'Últimos 30 segundos para aceptar'},
  e14_bonus:{label:'Esc 14 · Notificación bono',value:'Realizá un último pedido por un bono de $50.000'},
  e15_ok:{label:'Esc 15 · Notificación',value:'¡Felicitaciones! Completaste el pedido a tiempo. ¡Mantené tu promedio de entrega y obtené recompensas!'},
  e20_bonus:{label:'Esc 20 · Notificación bono (inventada)',value:'Recibiste un bono de $50.000'},
  e20_top:{label:'Esc 20 · Notificación 5%',value:'¡Felicitaciones! Sos parte del 5% de repartidores más activos de la zona.'},
  e20_quota:{label:'Esc 20 · Notificación 30 entregas',value:'Para mantener tu categoría debés completar 30 entregas más esta semana.'}
 },
 scenes:[
  {id:'e1',name:'Esc 1 · Día · Entrega tarde a Clara',short:'Esc 1',desc:'Pantalla con cuenta regresiva de 1 minuto. Luego llega la notificación de entrega tarde.',
   time:'11:52',batt:48,start:'app',screen:'delivering',timer:'start',dur:60,run:'pause',texts:['e1_urgent','fail_head','fail_sub'],
   cues:[{label:'Notificación: entregaste tarde',notif:{text:'e1_late',urgent:true,open:'fail'}},{label:'Abrir pantalla de bono perdido',go:'fail'}]},
  {id:'e5',name:'Esc 5 · Día · Bono de 1 minuto',short:'Esc 5',desc:'Mapa hacia la dirección. Llega el bono de 1 minuto (arranca la cuenta) y después el bono ganado.',
   time:'12:34',batt:41,start:'app',screen:'map',p:{mode:'drop5',prog:.55},timer:'cue',dur:60,
   cues:[{label:'Notificación: entregá en 1 minuto (arranca la cuenta)',timer:true,notif:{text:'e5_bonus',urgent:true,open:'map'}},
         {label:'Notificación: ganaste $10.000',stopTimer:true,notif:{text:'e5_won',open:'success',p:{kind:'bonus10'}}},
         {label:'Abrir pantalla de felicitaciones',go:'success',p:{kind:'bonus10'}}]},
  {id:'e6',name:'Esc 6 · Día · Propina',short:'Esc 6',desc:'Después de entregarle a Clara. Llega la notificación de propina extra.',
   time:'13:07',batt:37,start:'lock',screen:'home',
   cues:[{label:'Notificación: propina extra de $5000',notif:{text:'e6_tip',open:'earnings',p:{hl:'tip'}}},{label:'Abrir ganancias con la propina',go:'earnings',p:{hl:'tip'}}]},
  {id:'e8',name:'Esc 8 · Noche · Nuevo pedido (Clara)',short:'Esc 8',desc:'Buscando pedidos. Llega “Nuevo pedido asignado” con la dirección de Clara.',
   time:'21:40',batt:22,start:'app',screen:'home',
   cues:[{label:'Notificación: nuevo pedido asignado',notif:{text:'e8_new',sub:'e8_addr',open:'orderNew'}},{label:'Abrir el pedido con la dirección',go:'orderNew'}]},
  {id:'e11',name:'Esc 11 · Día · Plaza, alta demanda',short:'Esc 11',desc:'María desconectada. Alta demanda, después “Últimos 30 segundos” (arranca la cuenta). Ella toca Aceptar.',
   time:'14:37',batt:14,start:'lock',screen:'home',p:{online:false},timer:'cue',dur:30,
   cues:[{label:'Notificación: alta demanda',notif:{text:'e11_demand',urgent:true,open:'home'}},
         {label:'Notificación: últimos 30 segundos (arranca la cuenta)',timer:true,notif:{text:'e11_last',urgent:true,open:'offer',p:{variant:'demand'}}},
         {label:'Abrir la oferta con la cuenta regresiva',go:'offer',p:{variant:'demand'}}]},
  {id:'e14',name:'Esc 14 · Noche · Bono de $50.000',short:'Esc 14',desc:'Habitación. Llega el bono por un último pedido. Ella toca Aceptar.',
   time:'23:05',batt:9,start:'lock',screen:'home',
   cues:[{label:'Notificación: último pedido por $50.000',notif:{text:'e14_bonus',open:'offer',p:{variant:'bonus'}}},{label:'Abrir la oferta del bono',go:'offer',p:{variant:'bonus'}}]},
  {id:'e15',name:'Esc 15 · Noche · Pedido a tiempo',short:'Esc 15',desc:'Acaba de entregar. Llega la felicitación por entregar a tiempo.',
   time:'23:41',batt:6,start:'app',screen:'map',p:{mode:'drop',prog:.97},
   cues:[{label:'Notificación: completaste a tiempo',notif:{text:'e15_ok',open:'success',p:{kind:'ontime'}}},{label:'Abrir felicitaciones',go:'success',p:{kind:'ontime'}}]},
  {id:'e20',name:'Esc 20-I · Montaje · Bono y categoría',short:'Esc 20-I',desc:'Bono de $50.000, “5% más activos” y enseguida “30 entregas más”.',
   time:'18:20',batt:31,start:'app',screen:'home',
   cues:[{label:'Notificación: recibiste el bono de $50.000',notif:{text:'e20_bonus',open:'earnings',p:{hl:'bonus'}}},
         {label:'Notificación: sos parte del 5%',notif:{text:'e20_top',open:'badge'}},
         {label:'Notificación: 30 entregas más',notif:{text:'e20_quota',urgent:true,open:'quota'}},
         {label:'Abrir requisitos (30 entregas)',go:'quota'}]},
  {id:'free',name:'Uso libre',short:'uso libre',desc:'Inicio conectada, sin momentos. Para planos generales o montaje.',time:'17:45',batt:52,start:'app',screen:'home',cues:[]}
 ],
 actions:{
  toggleOnline:function(A){A.set({online:A.p.online===false});},
  tab:function(A,el){var to=el.getAttribute('data-to');if(to==='orders'||to==='profile')to='home';A.go(to,to==='earnings'?{hl:null}:null);},
  accept:function(A){A.timer.run=false;A.go('map',{mode:'pick',prog:.12,online:true});},
  reject:function(A){A.timer.run=false;A.go('home');},
  confirm:function(A){var m=A.p.mode;
    if(m==='pick'){A.go('map',{mode:'drop',prog:.2});return;}
    if(A.st.scene&&A.st.scene.id==='e1'){A.go('fail');return;}
    if(A.timer.on&&A.timer.left<=0){A.go('fail');return;}
    A.timer.run=false;A.go('success',{kind:(A.timer.on?'bonus10':'ontime')});},
  toOrder:function(A){A.go('map',{mode:'pick',prog:.12});},
  home:function(A){A.go('home',{online:true});},
  quota:function(A){A.go('quota');}
 },
 screens:{
  home:function(A){var D=A.D(),on=A.p.online!==false;
   var bars=[14,22,18,30,26,36,20,40].map(function(h,i){return '<i class="'+(i===7?'hi':'')+'" style="height:'+h+'px"></i>';}).join('');
   return top(A)+
    '<div class="hello"><small>Turno de hoy · 6 h 12 min</small><h2>Hola, '+A.esc(first(D.rider))+'</h2></div>'+
    '<div class="card earn"><span class="lbl">Ganancias de hoy</span><div class="row"><span class="big green glowg num">'+A.esc(D.gananciasHoy)+'</span><span class="bars">'+bars+'</span></div><span style="font-size:12.5px;color:var(--mu);font-weight:600">'+A.esc(D.entregasHoy)+' entregas · meta diaria 20</span></div>'+
    '<div class="g2"><div class="card"><span class="lbl">Puntualidad</span><span class="big red num">74%</span><small>Meta de tu categoría: 90%</small></div><div class="card"><span class="lbl">Categoría</span><span class="big">Bronce</span><small>Faltan 18 entregas para Plata</small></div></div>'+
    (on?'<div class="radar"><span class="rd"></span><div><b>Buscando pedidos…</b><span>Quedate cerca de la zona caliente</span><br><span class="demand">Alta demanda · ×1,4</span></div></div>'
       :'<div class="offline"><b>Estás desconectada</b><span>No vas a recibir pedidos mientras estés desconectada.</span><button class="btn" data-act="toggleOnline">Conectarme</button></div>')+
    '<div class="spacer"></div>'+tabs('home');},

  delivering:function(A){var D=A.D();
   return top(A)+
    '<div class="urg"><p>'+A.esc(A.T('e1_urgent'))+'</p><div class="row"><span class="tt num" data-t="m">1:00</span><span>BONO $10.000</span></div><div class="tbar" data-tp><i></i></div></div>'+
    '<div class="dest"><span class="lbl">Entregá a</span><h3>'+A.esc(D.cliente)+'</h3><span class="addr">'+A.esc(D.dirCliente)+'</span><span class="meta">Pedido '+A.esc(D.pedido)+' · '+A.esc(D.local)+' · 1 bolsa</span></div>'+
    '<div class="minimap">'+FLASHI_MAP({prog:.96})+'</div>'+
    '<div class="acts"><span>Llamar</span><span>Chat</span></div>'+
    '<div class="spacer"></div><div class="bottom"><button class="btn" data-act="confirm">Confirmar entrega</button></div>';},

  fail:function(A){
   return '<div class="res bad"><span class="xmark"></span><h1>'+A.esc(A.T('fail_head'))+'</h1><p>'+A.esc(A.T('fail_sub'))+'</p></div>'+
    '<div class="card lost"><span>Bono por entregar en 1 min</span><s class="num">$10.000</s></div>'+
    '<div class="st2"><div class="card">Llegaste tarde por<b class="red num">0:47</b></div><div class="card">Puntualidad<b class="red num">71% ↓</b></div></div>'+
    '<div class="spacer"></div><div class="bottom"><button class="btn ghost" data-act="home">Buscar próximo pedido</button></div>';},

  map:function(A){var D=A.D(),m=A.p.mode||'drop';
   var pick=m==='pick',drop5=m==='drop5';
   var name=pick?D.local:(drop5?D.cliente5:D.cliente),addr=pick?D.localDir:(drop5?D.dir5:D.dirCliente);
   var chip=A.timer.on?'<div class="tchip">Bono $10.000 <b class="num" data-t="m">1:00</b></div>':'';
   var near=(A.p.prog||0)>.9;
   return top(A)+'<div class="map">'+FLASHI_MAP({prog:A.p.prog})+
    '<div class="instr"><span class="ar">'+ARROW+'</span><div><b>'+(near?'Llegaste':'200 m')+'</b><span>'+(near?'Tu destino está a la derecha':'Girá a la derecha en Hidalgo')+'</span></div></div>'+chip+'</div>'+
    '<div class="sheet"><span class="grab"></span><span class="lbl">'+(pick?'Retirá en':'Entregá a')+'</span><h3>'+A.esc(name)+'</h3><span class="addr">'+A.esc(addr)+'</span><span class="meta">'+(near?'A 20 m':'1,2 km · 6 min')+' · Pedido '+A.esc(D.pedido)+'</span>'+
    '<button class="btn" data-act="confirm">'+(pick?'Llegué al local':'Confirmar entrega')+'</button></div>';},

  offer:function(A){var D=A.D(),v=A.p.variant||'demand';
   var card='<div class="card ocard"><div class="row"><span>'+A.esc(D.local)+'</span><b class="num">$3.200</b></div><span class="addr">→ '+A.esc(D.dirOferta)+'</span><span class="meta">2,8 km · 14 min · 1 bolsa grande</span></div>';
   if(v==='bonus'){
    return top(A)+'<div class="bonusbox"><span class="lbl">Bono por último pedido</span><div class="big num">+$50.000</div><p>'+A.esc(A.T('e14_bonus'))+'</p></div>'+card+
     '<div class="spacer"></div><div class="bottom"><button class="btn" data-act="accept">Aceptar pedido</button><button class="fine" data-act="reject">Rechazar: perdés el bono</button></div>';}
   return top(A)+'<div class="pad"><div class="alertbox"><b>Alta demanda en tu zona</b>Si permanecés desconectada perderás prioridad para futuros pedidos.</div></div>'+
    '<div class="ringwrap"><div class="ring lg" data-tp><div><span class="rt num" data-t="m">0:30</span><small>para aceptar</small></div></div></div>'+card+
    '<div class="spacer"></div><div class="bottom"><button class="btn" data-act="accept">Aceptar pedido</button><button class="fine" data-act="reject">Rechazar resta 15 puntos de prioridad</button></div>';},

  success:function(A){var k=A.p.kind||'ontime';
   var txt=k==='bonus10'?A.T('e5_won'):A.T('e15_ok');
   var amt=k==='bonus10'?'+$10.000':'+$3.200';
   return '<div class="res good"><span class="check"></span><h1>¡Felicitaciones!</h1><p>'+A.esc(txt.replace(/^¡Felicitaciones!\s*/,''))+'</p><div class="won num glowg">'+amt+'</div></div>'+
    '<div class="st2"><div class="card">Puntualidad<b class="green num">76% ↑</b></div><div class="card">Entregas hoy<b class="num">13</b></div></div>'+
    '<div class="spacer"></div><div class="bottom"><button class="btn" data-act="home">Seguir conectada</button></div>';},

  earnings:function(A){var D=A.D(),hl=A.p.hl;
   var base=63450,items=[];
   if(hl==='bonus')items.push(['hl','Bono de actividad','ahora',50000]);
   if(hl==='tip')items.push(['hl','Propina extra · '+D.cliente,'ahora',5000]);
   items.push(['','Pedido '+D.pedido+' · '+D.local,'hace 3 min',3200],['','Pedido #88207 · Wok Express','hace 41 min',2850],['neg','Cargo por uso de la app','hoy',-1200],['','Pedido #88199 · Heladería Polar','hace 1 h',2400],['','Pedido #88190 · Pizzería La Esquina','hace 2 h',2950]);
   var total=base+(hl==='bonus'?50000:0)+(hl==='tip'?5000:0);
   return top(A)+'<div class="card bal"><span class="lbl">Saldo de la semana</span><div class="big num'+(hl?' green glowg':'')+'">'+money(total)+'</div><span style="font-size:12.5px;color:var(--mu);font-weight:600">Se transfiere el lunes · comisión 22%</span></div>'+
    '<div class="mov">'+items.map(function(i){return '<div class="'+i[0]+'"><span>'+A.esc(i[1])+'<small>'+i[2]+'</small></span><b class="num">'+(i[3]>0?'+':'')+money(i[3])+'</b></div>';}).join('')+'</div>'+
    '<div class="spacer"></div>'+tabs('earnings');},

  badge:function(A){
   return top(A)+'<div class="medal"><div><b>TOP 5%</b><small>DE TU ZONA</small></div></div>'+
    '<div class="center"><h1>'+A.esc(A.T('e20_top'))+'</h1></div>'+
    '<div class="perks"><div>Prioridad en pedidos de alta demanda</div><div>Acceso a bonos exclusivos</div><div>Insignia Rayo en tu perfil</div></div>'+
    '<div class="spacer"></div><div class="bottom"><button class="btn" data-act="quota">Ver cómo mantenerla</button></div>';},

  quota:function(A){
   return '<div class="quota" style="display:flex;flex-direction:column;flex:1">'+top(A)+'<div class="qring"><div><b class="num">0/30</b><small>entregas</small></div></div>'+
    '<div class="center"><h1>'+A.esc(A.T('e20_quota'))+'</h1><div class="left"><span class="num">4<small>días</small></span><span class="num">11<small>h</small></span><span class="num">06<small>min</small></span></div></div>'+
    '<div class="perks bad"><div>Si no las completás, perdés tu categoría</div><div>Bajás en la prioridad de pedidos</div><div>Sin acceso a bonos la próxima semana</div></div>'+
    '<div class="spacer"></div><div class="bottom"><button class="btn red" data-act="home">Conectarme ahora</button></div></div>';},

  orderNew:function(A){var D=A.D();
   return top(A)+'<div class="assign"><span class="lbl">Nuevo pedido asignado</span><h2>'+A.esc(D.local)+' → cliente</h2><span class="who">'+A.esc(D.cliente)+'</span><span class="addr">'+A.esc(D.dirCliente)+'</span><span class="meta">Pedido '+A.esc(D.pedido)+' · 1,9 km · 11 min · Ganancia $2.900</span></div>'+
    '<div class="minimap" style="height:210px">'+FLASHI_MAP({prog:.15})+'</div>'+
    '<div class="spacer"></div><div class="bottom"><button class="btn" data-act="toOrder">Ir a retirar</button></div>';}
 }
};
window.FLASHI_APP=FLASHI(app);
})();
