

var MALES=['Hải','Tân','Tân Star','Giang','Tuấn','Hưng','Đức Anh','Mr A'];
var FEMALES=['Minh','Hằng','Thủy','Thu','An','Hà','Hiền','Hương 84'];
var avM=[...MALES],avF=[...FEMALES];
var pairs=[],scores={},drawCnt=0,isEditing=false,isAnimating=false;

var SCHED=[
  {l:1,s1:{id:'a12',t1:'A1',t2:'A2'},s2:{id:'b12',t1:'B1',t2:'B2'}},
  {l:2,s1:{id:'a34',t1:'A3',t2:'A4'},s2:{id:'b34',t1:'B3',t2:'B4'}},
  {l:3,s1:{id:'a13',t1:'A1',t2:'A3'},s2:{id:'b13',t1:'B1',t2:'B3'}},
  {l:4,s1:{id:'a24',t1:'A2',t2:'A4'},s2:{id:'b24',t1:'B2',t2:'B4'}},
  {l:5,s1:{id:'a14',t1:'A1',t2:'A4'},s2:{id:'b14',t1:'B1',t2:'B4'}},
  {l:6,s1:{id:'a23',t1:'A2',t2:'A3'},s2:{id:'b23',t1:'B2',t2:'B3'}}
];
var GA=SCHED.map(function(r){return r.s1;}),GB=SCHED.map(function(r){return r.s2;});

/* ── AUDIO ── */
var audioCtx=null;
function getACtx(){if(!audioCtx){try{audioCtx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}return audioCtx;}
function playTick(freq,vol,dur){var c=getACtx();if(!c)return;var o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type='sine';o.frequency.value=freq||800;g.gain.setValueAtTime(vol||0.12,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+(dur||0.07));o.start(c.currentTime);o.stop(c.currentTime+(dur||0.07));}
function playFanfare(){var c=getACtx();if(!c)return;var seqs=[[523,.0,.15],[659,.12,.15],[784,.22,.2],[523,.32,.1],[659,.4,.1],[1047,.48,.4]];seqs.forEach(function(s){var o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type='triangle';o.frequency.value=s[0];var t=c.currentTime+s[1];g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.22,t+0.04);g.gain.exponentialRampToValueAtTime(0.001,t+s[2]);o.start(t);o.stop(t+s[2]+0.05);});}

/* ── CONFETTI ── */
function launchConfetti(){var canvas=document.getElementById('confetti-canvas');canvas.width=window.innerWidth;canvas.height=window.innerHeight;var ctx=canvas.getContext('2d');var cols=['#c8f135','#1a7a4a','#f9a825','#e91e63','#2196f3','#ff5722','#9c27b0','#00bcd4','#ff9800'];var particles=[];var cx=window.innerWidth/2,cy=window.innerHeight*0.42;for(var i=0;i<160;i++){var angle=Math.random()*Math.PI*2,speed=Math.random()*14+4;particles.push({x:cx+(Math.random()-.5)*60,y:cy,vx:Math.cos(angle)*speed*(0.6+Math.random()*.8),vy:Math.sin(angle)*speed*(0.6+Math.random()*.8)-6,size:Math.random()*10+4,color:cols[Math.floor(Math.random()*cols.length)],rot:Math.random()*360,rotV:(Math.random()-.5)*18,gravity:0.45,alpha:1,shape:Math.random()>.5?'rect':'circle'});}var raf;function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);var alive=false;particles.forEach(function(p){if(p.alpha>0.015){alive=true;p.x+=p.vx;p.y+=p.vy;p.vy+=p.gravity;p.vx*=0.99;p.rot+=p.rotV;p.alpha-=0.013;ctx.save();ctx.globalAlpha=Math.max(0,p.alpha);ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);ctx.fillStyle=p.color;if(p.shape==='circle'){ctx.beginPath();ctx.arc(0,0,p.size/2,0,Math.PI*2);ctx.fill();}else{ctx.fillRect(-p.size/2,-p.size/3,p.size,p.size*.55);}ctx.restore();}});if(alive)raf=requestAnimationFrame(draw);else ctx.clearRect(0,0,canvas.width,canvas.height);}draw();setTimeout(function(){cancelAnimationFrame(raf);ctx.clearRect(0,0,canvas.width,canvas.height);},4000);}

/* ── SPIN ── */
function runSpin(finalM,finalF,onDone){var overlay=document.getElementById('spin-overlay');var mEl=document.getElementById('spin-m'),fEl=document.getElementById('spin-f');var prog=document.getElementById('spin-progress'),status=document.getElementById('spin-status');var capNum=document.getElementById('spin-cap-num');capNum.textContent='CẶP SỐ '+(drawCnt+1);prog.style.width='0%';prog.style.background='linear-gradient(90deg,#0d4d2a,#c8f135)';status.innerHTML='Đang quay<span class="dot-pulse"><span></span><span></span><span></span></span>';mEl.className='drum-name drum-name-m';fEl.className='drum-name drum-name-f';mEl.style.filter='blur(3px)';fEl.style.filter='blur(3px)';mEl.textContent='?';fEl.textContent='?';overlay.style.display='flex';var phases=[[1100,55,3,900],[800,110,2,700],[700,220,1,550],[500,420,0,400]];var phase=0,pStart=Date.now(),totalMs=3100+500,startT=Date.now();var timer=null;function tick(){var now=Date.now();var elapsed=now-startT;var pct=Math.min(99,elapsed/totalMs*100);prog.style.width=pct+'%';if(phase<3&&now-pStart>=phases[phase][0]){phase++;pStart=now;clearInterval(timer);var blur=phases[phase][2];mEl.style.filter=blur?'blur('+blur+'px)':'none';fEl.style.filter=blur?'blur('+blur+'px)':'none';if(phase===3){status.textContent='Sắp ra kết quả...';}if(phase<4){timer=setInterval(tick,phases[phase][1]);}return;}if(phase<3){var rm=MALES[Math.floor(Math.random()*MALES.length)],rf=FEMALES[Math.floor(Math.random()*FEMALES.length)];mEl.textContent=rm;fEl.textContent=rf;playTick(phases[phase][3],0.06+phase*0.01,0.06);}else{var pool_m=avM.length>1?avM:[finalM],pool_f=avF.length>1?avF:[finalF];mEl.textContent=pool_m[Math.floor(Math.random()*pool_m.length)];fEl.textContent=pool_f[Math.floor(Math.random()*pool_f.length)];playTick(phases[phase][3],0.09,0.08);var phaseElapsed=now-pStart;if(phaseElapsed>=phases[phase][0]){clearInterval(timer);mEl.style.filter='none';fEl.style.filter='none';mEl.textContent=finalM;fEl.textContent=finalF;mEl.className='drum-name drum-name-m name-revealed';fEl.className='drum-name drum-name-f name-revealed';prog.style.width='100%';prog.style.background='linear-gradient(90deg,#c8f135,#0d4d2a)';status.innerHTML='🎉 &nbsp;<span style="color:#0d4d2a;font-size:15px">'+finalM+'</span>&nbsp;+&nbsp;<span style="color:#c2185b;font-size:15px">'+finalF+'</span>&nbsp; 🎉';playFanfare();setTimeout(launchConfetti,200);setTimeout(function(){overlay.style.display='none';onDone();},2200);}};}timer=setInterval(tick,phases[0][1]);}

/* ── PLAYER LISTS ── */
function renderLists(){var ml=document.getElementById('mlist'),fl=document.getElementById('flist');ml.innerHTML=MALES.map(function(n,i){var drawn=avM.indexOf(n)<0&&drawCnt>0;return'<div class="pi '+(drawn?'pid':'pim')+'" id="pm'+i+'"><span class="picon '+(drawn?'icond':'iconm')+'">'+(i+1)+'</span>'+(drawn?'<span class="pname-drawn">'+n+'</span>':'<input class="pname-input" id="minput'+i+'" type="text" value="'+n+'" readonly onchange="updateName(\'m\','+i+',this.value)" onfocus="this.classList.add(\'m-editing\')" onblur="this.classList.remove(\'m-editing\')"><span class="pedit-icon" onclick="editName(\'m\','+i+')">✏️</span>')+'</div>';}).join('');fl.innerHTML=FEMALES.map(function(n,i){var drawn=avF.indexOf(n)<0&&drawCnt>0;return'<div class="pi '+(drawn?'pid':'pif')+'" id="pf'+i+'"><span class="picon '+(drawn?'icond':'iconf')+'">'+(i+1)+'</span>'+(drawn?'<span class="pname-drawn">'+n+'</span>':'<input class="pname-input" id="finput'+i+'" type="text" value="'+n+'" readonly onchange="updateName(\'f\','+i+',this.value)" onfocus="this.classList.add(\'f-editing\')" onblur="this.classList.remove(\'f-editing\')"><span class="pedit-icon" onclick="editName(\'f\','+i+')">✏️</span>')+'</div>';}).join('');}
renderLists();

function toggleEdit(){if(drawCnt>0){alert('Không thể sửa tên sau khi đã bắt đầu bốc thăm!');return;}isEditing=!isEditing;document.getElementById('btn-lock').style.display=isEditing?'none':'inline-block';document.getElementById('btn-edit').style.display=isEditing?'inline-block':'none';document.getElementById('edit-hint').textContent=isEditing?'💡 Click vào tên để sửa':'';document.getElementById('pgrid').className=isEditing?'pgrid editing-mode':'pgrid';var inputs=document.querySelectorAll('.pname-input');inputs.forEach(function(inp){if(isEditing){inp.removeAttribute('readonly');inp.classList.add('editing');}else{inp.setAttribute('readonly','');inp.classList.remove('editing','m-editing','f-editing');}});}
function editName(g,i){if(!isEditing)return;var inp=document.getElementById((g==='m'?'m':'f')+'input'+i);if(inp){inp.focus();inp.select();}}
function updateName(g,i,val){val=val.trim();if(!val)return;if(g==='m'){var old=MALES[i];MALES[i]=val;var ai=avM.indexOf(old);if(ai>=0)avM[ai]=val;}else{var old=FEMALES[i];FEMALES[i]=val;var ai=avF.indexOf(old);if(ai>=0)avF[ai]=val;}}

/* ── DRAW ── */
function pairName(slot){var g=slot[0],n=parseInt(slot[1])-1,idx=g==='A'?n:4+n;if(idx>=pairs.length)return'Đôi '+slot;var p=pairs[idx];return p.m+' & '+p.f;}

function doDrawPair(){if(isAnimating||!avM.length)return;if(isEditing)toggleEdit();var mi=Math.floor(Math.random()*avM.length),fi=Math.floor(Math.random()*avF.length);var finalM=avM[mi],finalF=avF[fi];var mIdx=MALES.indexOf(finalM),fIdx=FEMALES.indexOf(finalF);var btn=document.getElementById('btn-draw');btn.disabled=true;btn.classList.add('btn-loading');isAnimating=true;
runSpin(finalM,finalF,function(){isAnimating=false;drawCnt++;var g=drawCnt<=4?'A':'B';avM.splice(mi,1);avF.splice(fi,1);pairs.push({num:drawCnt,m:finalM,f:finalF,g:g,mi:mIdx,fi:fIdx});
function crossOut(el,name){if(!el)return;el.className='pi pid';var ic=el.querySelector('.picon');if(ic)ic.className='picon icond';var inp=el.querySelector('input'),ei=el.querySelector('.pedit-icon');if(inp)el.removeChild(inp);if(ei)el.removeChild(ei);var sp=document.createElement('span');sp.className='pname-drawn';sp.textContent=name;el.appendChild(sp);}
crossOut(document.getElementById('pm'+mIdx),finalM);crossOut(document.getElementById('pf'+fIdx),finalF);
var card=document.createElement('div');card.className='pair-card '+(g==='A'?'pca':'pcb');card.innerHTML='<div class="pnum '+(g==='A'?'pna':'pnb')+'">'+drawCnt+'</div><div class="pinfo"><div class="pnames"><span class="pm">'+finalM+'</span><span style="color:#aaa;margin:0 5px;font-size:11px">+</span><span class="pf">'+finalF+'</span></div><div class="ptag">Bảng '+g+' — '+(g==='A'?'Sân 1':'Sân 2')+' ('+g+(g==='A'?drawCnt:drawCnt-4)+')</div></div><span class="pbadge '+(g==='A'?'pba':'pbb')+'">BẢNG '+g+'</span>';
document.getElementById('pairs-out').appendChild(card);
btn.classList.remove('btn-loading');if(!avM.length){btn.disabled=true;btn.textContent='✓ ĐÃ BỐC THĂM XONG';document.getElementById('dcnt').textContent='Đã ghép đủ 8 cặp đôi!';document.getElementById('btn-show').style.display='block';}else{btn.disabled=false;btn.textContent='🎲 BỐC THĂM CẶP '+(drawCnt+1);document.getElementById('dcnt').textContent='Còn '+avM.length+' cặp chưa bốc';}});}

/* ── SCORE INPUT (format: 11:7) ── */
function ps(inp){
  var id=inp.dataset.id;
  var val=inp.value.trim();
  var m=val.match(/^(\d+)\s*[:\-]\s*(\d+)$/);
  if(m){
    var n1=parseInt(m[1]),n2=parseInt(m[2]);
    scores[id+'_1']=n1;scores[id+'_2']=n2;scores[id+'_raw']=n1+':'+n2;
    inp.value=n1+':'+n2;
    inp.classList.add('sv');inp.classList.remove('si');
  }else if(!val){
    delete scores[id+'_1'];delete scores[id+'_2'];delete scores[id+'_raw'];
    inp.classList.remove('sv','si');
  }else{
    inp.classList.add('si');inp.classList.remove('sv');
  }
  renderStandings();updateBK();
}

function matchScore(id,xc){
  var raw=scores[id+'_raw']||'';
  var vc=raw?(raw.match(/^\d+:\d+$/)?'sv':'si'):'';
  var xs='';
  if(xc==='sinb')xs='color:#4a148c;border-color:#ce93d8';
  else if(xc==='sinc')xs='color:#b71c1c;border-color:#ef9a9a';
  else if(xc==='sinbg')xs='color:#5c1a1a;border-color:#f8bbd0';
  return '<div class="stw"><input class="st '+(vc||'')+'" type="text" value="'+raw+'" placeholder="11:7" style="'+xs+'" data-id="'+id+'" oninput="ps(this)" onclick="this.select()"><div class="st-hint">vd: 11:7</div></div>';
}

/* ── STANDINGS ── */
function calcStand(slots,matches){
  var s={};slots.forEach(function(sl){s[sl]={sl:sl,w:0,l:0,pts:0,gf:0,ga:0,pl:0,scores:[]};});
  matches.forEach(function(m){
    var n1=scores[m.id+'_1'],n2=scores[m.id+'_2'];
    if(n1!==undefined&&n2!==undefined){
      s[m.t1].gf+=n1;s[m.t1].ga+=n2;s[m.t1].pl++;
      s[m.t2].gf+=n2;s[m.t2].ga+=n1;s[m.t2].pl++;
      if(n1>n2){s[m.t1].w++;s[m.t1].pts+=2;s[m.t2].l++;}
      else if(n2>n1){s[m.t2].w++;s[m.t2].pts+=2;s[m.t1].l++;}
    }
  });
  return Object.values(s).sort(function(a,b){return(b.pts-a.pts)||(b.gf-b.ga-a.gf+a.ga)||(b.gf-a.gf)||(a.sl<b.sl?-1:1);});
}

function getR(g,r){var sl=g==='A'?['A1','A2','A3','A4']:['B1','B2','B3','B4'];var st=calcStand(sl,g==='A'?GA:GB);return st[r-1]?st[r-1].sl:(r===1?'#1'+g:'#2'+g);}

function getWinner(id,s1,s2){var v1=scores[id+'_1'],v2=scores[id+'_2'];if(v1!==undefined&&v2!==undefined)return v1>v2?s1:v2>v1?s2:null;return null;}
function getLoser(id,s1,s2){var w=getWinner(id,s1,s2);if(!w)return null;return w===s1?s2:s1;}

function upd(id,txt){var el=document.getElementById(id);if(el)el.textContent=txt;}

function updateBK(){
  var r1A=getR('A',1),r2A=getR('A',2),r1B=getR('B',1),r2B=getR('B',2);
  /* BK teams */
  upd('bk1-team1',pairName(r1A));upd('bk1-team2',pairName(r2B));
  upd('bk2-team1',pairName(r1B));upd('bk2-team2',pairName(r2A));
  /* BK winners */
  var bk1w=getWinner('bk1',r1A,r2B),bk1l=getLoser('bk1',r1A,r2B);
  var bk2w=getWinner('bk2',r1B,r2A),bk2l=getLoser('bk2',r1B,r2A);
  upd('bk1-winner-label',bk1w?'🏆 Thắng: '+pairName(bk1w):'');
  upd('bk2-winner-label',bk2w?'🏆 Thắng: '+pairName(bk2w):'');
  /* CK */
  upd('ck-team1',bk1w?pairName(bk1w):'Thắng Bán Kết 1');
  upd('ck-team2',bk2w?pairName(bk2w):'Thắng Bán Kết 2');
  /* HCĐ */
  upd('hcd-team1',bk1l?pairName(bk1l):'Thua Bán Kết 1');
  upd('hcd-team2',bk2l?pairName(bk2l):'Thua Bán Kết 2');
  /* CK winner */
  var ckw=getWinner('ck',bk1w,bk2w);
  upd('ck-winner-label',ckw?'🏆 VÔ ĐỊCH: '+pairName(ckw):'');
  /* HCĐ winner */
  var hcdw=getWinner('hcd',bk1l,bk2l);
  upd('hcd-winner-label',hcdw?'🥉 Hạng Ba: '+pairName(hcdw):'');
}

function renderStandings(){
  var stA=calcStand(['A1','A2','A3','A4'],GA),stB=calcStand(['B1','B2','B3','B4'],GB);
  function tH(st,g){
    var totalMatches=6;
    var rows=st.map(function(s,i){
      var hsDiff=s.gf-s.ga;
      var rankCls=i===0?'rk1':i===1?'rk2':i===2?'rk3':'';
      return '<tr class="'+rankCls+'">'
        +'<td><span class="rank-num" style="color:'+(i===0?'#f9a825':i===1?'#1a5c3a':i===2?'#1565c0':'#999')+'">'+( i+1)+'</span></td>'
        +'<td class="tdl2">'
          +'<span style="font-size:9px;color:#aaa;font-weight:400">'+s.sl+' </span>'
          +pairName(s.sl)
          +(i<2?'<span class="adv">→ BK</span>':'')
        +'</td>'
        +'<td>'+s.pl+' / 3</td>'
        +'<td style="color:#1a5c3a;font-weight:700;font-size:14px">'+s.w+'</td>'
        +'<td style="color:#c62828;font-size:13px">'+s.l+'</td>'
        +'<td style="font-size:16px;font-weight:700;color:'+(i===0?'#f9a825':i===1?'#1a5c3a':'#555')+'">'+s.pts+'</td>'
        +'<td style="color:'+(hsDiff>0?'#1a5c3a':hsDiff<0?'#c62828':'#888')+';font-weight:600">'+(hsDiff>0?'+':'')+hsDiff+'</td>'
        +'<td style="font-size:11px;color:#888">'+s.gf+' — '+s.ga+'</td>'
        +'</tr>';
    }).join('');
    return '<div class="stcard">'
      +'<div class="sthdr sthdr-'+g.toLowerCase()+'">'
        +'<span>📊 XẾP HẠNG BẢNG '+g+' ('+(g==='A'?'Sân 1':'Sân 2')+')</span>'
        +'<span style="font-size:10px;font-weight:400;opacity:.8;margin-left:auto">Thắng=2đ, Thua=0đ</span>'
      +'</div>'
      +'<table class="sttbl"><thead><tr>'
        +'<th style="width:35px">XH</th><th>Đôi</th><th>Đã đấu</th>'
        +'<th style="color:#1a5c3a">Thắng</th><th style="color:#c62828">Thua</th>'
        +'<th>Điểm</th><th>Hiệu số</th><th>Tổng game</th>'
      +'</tr></thead><tbody>'+rows+'</tbody></table></div>';
  }
  document.getElementById('standings').innerHTML=tH(stA,'A')+tH(stB,'B');
  updateBK();
}

/* ── BRACKET TABLE (Group Stage) ── */
function buildBracket(){
  var t=document.getElementById('btable');
  var h='<thead><tr><th class="ch chl" rowspan="2">LƯỢT</th>';
  h+='<th class="ch cha" colspan="2">SÂN 1 — BẢNG A</th><th class="ch chas">TỶ SỐ</th>';
  h+='<th class="ch chb" colspan="2">SÂN 2 — BẢNG B</th><th class="ch chbs">TỶ SỐ</th>';
  h+='</tr><tr>';
  ['Đôi 1','Đôi 2','nhập: 11:7','Đôi 1','Đôi 2','nhập: 11:7'].forEach(function(lbl,i){
    var cls=['cha','cha','chas','chb','chb','chbs'][i];
    h+='<th class="ch '+cls+'" style="font-size:10px;font-weight:400">'+lbl+'</th>';
  });
  h+='</tr></thead><tbody>';
  for(var ri=0;ri<SCHED.length;ri++){
    var rd=SCHED[ri],l=rd.l,s1=rd.s1,s2=rd.s2;
    h+='<tr style="border-top:2px solid #a5d6a7">';
    h+='<td class="tdl" rowspan="2">L'+l+'<br><span style="font-size:9px;font-weight:400;color:#888">Lượt '+l+'</span></td>';
    h+='<td class="tdt" style="border-bottom:1px dashed #c8e6c9"><span class="sl">'+s1.t1+'</span><span class="nm">'+pairName(s1.t1)+'</span></td>';
    h+='<td class="tdt" style="border-bottom:1px dashed #c8e6c9"><span class="sl">'+s1.t2+'</span><span class="nm">'+pairName(s1.t2)+'</span></td>';
    h+='<td class="tds" rowspan="2">'+matchScore(s1.id)+'</td>';
    h+='<td class="tdt tdtb" style="border-bottom:1px dashed #f8bbd0"><span class="sl" style="color:#e91e63">'+s2.t1+'</span><span class="nm" style="color:#5c1a1a">'+pairName(s2.t1)+'</span></td>';
    h+='<td class="tdt tdtb" style="border-bottom:1px dashed #f8bbd0"><span class="sl" style="color:#e91e63">'+s2.t2+'</span><span class="nm" style="color:#5c1a1a">'+pairName(s2.t2)+'</span></td>';
    h+='<td class="tds tdsb" rowspan="2">'+matchScore(s2.id,'sinbg')+'</td>';
    h+='</tr><tr>';
    h+='<td class="tdt btm" style="color:#aaa;font-size:11px;padding:4px 8px"><span class="sl">vs</span></td><td class="tdt btm"></td>';
    h+='<td class="tdt tdtb btm" style="color:#aaa;font-size:11px;padding:4px 8px"><span class="sl" style="color:#e91e63">vs</span></td><td class="tdt tdtb btm"></td>';
    h+='</tr>';
  }
  h+='</tbody>';t.innerHTML=h;
}

function showTourney(){
  document.getElementById('draw').style.display='none';
  document.getElementById('tourney').style.display='block';
  buildBracket();renderStandings();
}
function backDraw(){document.getElementById('tourney').style.display='none';document.getElementById('draw').style.display='block';}

