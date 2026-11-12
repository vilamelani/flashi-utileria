/* Mapa estilizado compartido (no es un mapa real). */
(function(){
var C=[195,280],ANG=-14*Math.PI/180;
function rot(p){var dx=p[0]-C[0],dy=p[1]-C[1];return [C[0]+dx*Math.cos(ANG)-dy*Math.sin(ANG),C[1]+dx*Math.sin(ANG)+dy*Math.cos(ANG)];}
function along(pts,f){var L=[],tot=0;for(var i=1;i<pts.length;i++){var d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);L.push(d);tot+=d;}
  var t=Math.max(0,Math.min(1,f))*tot;for(var j=0;j<L.length;j++){if(t<=L[j]){var r=L[j]?t/L[j]:0;return [pts[j][0]+(pts[j+1][0]-pts[j][0])*r,pts[j][1]+(pts[j+1][1]-pts[j][1])*r];}t-=L[j];}return pts[pts.length-1];}
var ROUTE=[[120,560],[120,280],[280,280],[280,140]];
window.FLASHI_MAP=function(o){
  o=o||{};var prog=o.prog==null?0.18:o.prog;var id='m'+Math.random().toString(36).slice(2,7);
  var g='';
  for(var x=-120;x<=520;x+=80)g+='<line x1="'+x+'" y1="-200" x2="'+x+'" y2="760" stroke="#11201A" stroke-width="11"/>';
  for(var y=-140;y<=700;y+=70)g+='<line x1="-200" y1="'+y+'" x2="600" y2="'+y+'" stroke="#11201A" stroke-width="11"/>';
  g+='<line x1="-200" y1="280" x2="600" y2="280" stroke="#18301F" stroke-width="22"/>';
  g+='<line x1="-220" y1="700" x2="620" y2="-160" stroke="#142A1C" stroke-width="16"/>';
  g+='<rect x="208" y="358" width="64" height="54" rx="6" fill="#0B2616"/>';
  g+='<rect x="48" y="78" width="64" height="54" rx="6" fill="#0B2616"/>';
  var lab='font-family="Manrope,system-ui,sans-serif" font-size="10.5" font-weight="700" fill="#4D6B5A" letter-spacing=".5"';
  g+='<text x="318" y="275" '+lab+'>AV. RIVADAVIA</text>';
  g+='<text x="-30" y="345" '+lab+'>YERBAL</text>';
  g+='<text '+lab+' transform="translate(196 470) rotate(-90)">HIDALGO</text>';
  g+='<text '+lab+' transform="translate(116 540) rotate(-90)">ACOYTE</text>';
  var pts=ROUTE.map(function(p){return p.join(',');}).join(' ');
  var done=[];var tot=ROUTE;// parte recorrida
  g+='<polyline points="'+pts+'" fill="none" stroke="#1EF08A" stroke-width="12" stroke-linejoin="round" opacity=".35" filter="url(#'+id+')"/>';
  g+='<polyline points="'+pts+'" fill="none" stroke="#1EF08A" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>';
  var me=rot(along(ROUTE,prog)),pin=rot(ROUTE[ROUTE.length-1]);
  var pinC=o.pinColor||'#FF2B4A';
  var s='<svg viewBox="0 0 390 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><filter id="'+id+'" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>'+
    '<radialGradient id="'+id+'v" cx="50%" cy="45%" r="70%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".65"/></radialGradient></defs>'+
    '<rect width="390" height="560" fill="#07110B"/><g transform="rotate(-14 195 280)">'+g+'</g>'+
    '<g transform="translate('+pin[0].toFixed(1)+' '+pin[1].toFixed(1)+')"><path d="M0 0C-4-8-15-15-15-26a15 15 0 1 1 30 0C15-15 4-8 0 0Z" fill="'+pinC+'" filter="url(#'+id+')" opacity=".7"/><path d="M0 0C-4-8-15-15-15-26a15 15 0 1 1 30 0C15-15 4-8 0 0Z" fill="'+pinC+'"/><circle cy="-26" r="5.5" fill="#fff"/></g>'+
    '<g transform="translate('+me[0].toFixed(1)+' '+me[1].toFixed(1)+')"><circle r="12" fill="none" stroke="#1EF08A" stroke-width="2"><animate attributeName="r" from="10" to="30" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" from=".8" to="0" dur="1.8s" repeatCount="indefinite"/></circle><circle r="10" fill="#1EF08A" stroke="#05120A" stroke-width="4"/></g>'+
    '<rect width="390" height="560" fill="url(#'+id+'v)"/></svg>';
  return s;
};
})();
