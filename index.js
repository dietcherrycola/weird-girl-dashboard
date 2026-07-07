// ============ INIT NAV ============
renderNav('home');

// ============ DATE ============
const _today=new Date();
document.getElementById('date-pill').textContent=_today.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});

// ============ MINI CALENDAR ============
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
let calY=_today.getFullYear(),calM=_today.getMonth();
function renderCal(){
  const g=document.getElementById('cal-grid');
  document.getElementById('cal-lbl').textContent=MONTHS[calM]+' '+calY;g.innerHTML='';
  ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d=>{const e=document.createElement('div');e.className='cdl';e.textContent=d;g.appendChild(e)});
  const first=new Date(calY,calM,1).getDay(),days=new Date(calY,calM+1,0).getDate();
  for(let i=0;i<first;i++){const e=document.createElement('div');e.className='cd empty';g.appendChild(e)}
  for(let d=1;d<=days;d++){const e=document.createElement('div');e.className='cd';e.textContent=d;if(calY===_today.getFullYear()&&calM===_today.getMonth()&&d===_today.getDate())e.classList.add('today');g.appendChild(e)}
}
document.getElementById('cal-prev').onclick=()=>{calM--;if(calM<0){calM=11;calY--}renderCal()};
document.getElementById('cal-next').onclick=()=>{calM++;if(calM>11){calM=0;calY++}renderCal()};
renderCal();

// ============ DONE LIST ============
let doneItems=ls(K.done,[]);
function getTodayDone(){
  const todayStart=new Date();todayStart.setHours(0,0,0,0);
  return doneItems.filter(item=>item.ts&&item.ts>=todayStart.getTime());
}
function renderDone(){
  const list=document.getElementById('done-list'),count=document.getElementById('done-count');
  list.innerHTML='';
  const todayItems=getTodayDone();
  todayItems.forEach((item,i)=>{
    const realIndex=doneItems.indexOf(item);
    const e=document.createElement('div');e.className='done-item';
    const txt=typeof item==='string'?item:item.text;
    e.innerHTML=`<div class="done-check">✓</div><span style="flex:1">${txt}</span><span style="font-size:9px;color:var(--tmut);margin-right:4px">${item.ts?new Date(item.ts).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}):''}</span><button class="btn-del" onclick="removeDone(${realIndex})">×</button>`;
    list.appendChild(e);
  });
  count.textContent=todayItems.length===0?'fresh day — get after it!':todayItems.length+' thing'+(todayItems.length!==1?'s':'')+' done today ✨';
}
window.removeDone=i=>{doneItems.splice(i,1);ss(K.done,doneItems);renderDone()};
document.getElementById('done-add-btn').onclick=()=>{const inp=document.getElementById('done-inp');if(!inp.value.trim())return;doneItems.unshift({text:inp.value.trim(),ts:Date.now()});ss(K.done,doneItems);renderDone();inp.value=''};
document.getElementById('done-inp').onkeydown=e=>{if(e.key==='Enter')document.getElementById('done-add-btn').click()};
renderDone();

// ============ HEALTH QUICK ============
let obCount=ls(K.ob,0);document.getElementById('obc').textContent=obCount;
window.setEQ=emoji=>{document.getElementById('energy-disp').textContent=emoji;if(emoji==='✨'){obCount++;ss(K.ob,obCount);document.getElementById('obc').textContent=obCount}};

// ============ ENERGY QUICK LOG ============
const physOpts=[{e:'💀',l:'Crashed',v:1},{e:'🔋',l:'Very low',v:2},{e:'😩',l:'Low',v:3},{e:'⚡',l:'Good',v:4},{e:'🔥',l:'Amazing',v:5}];
const mentalOpts=[{e:'🧱',l:'Brain fog',v:1},{e:'😵',l:'Struggling',v:2},{e:'😐',l:'Getting by',v:3},{e:'🧠',l:'Focused',v:4},{e:'✨',l:'Open brain!',v:5}];
let selP=null,selM=null;
function renderEnergyOpts(){
  ['phys','mental'].forEach(type=>{
    const opts=type==='phys'?physOpts:mentalOpts;
    const c=document.getElementById(type+'-opts-home');if(!c)return;c.innerHTML='';
    opts.forEach((o,i)=>{const el=document.createElement('div');el.className='ec-opt';el.innerHTML=`<span class="ec-emoji">${o.e}</span><div class="ec-val">${o.l}</div>`;el.onclick=()=>{if(type==='phys'){selP=i;c.querySelectorAll('.ec-opt').forEach((x,j)=>x.classList.toggle('sel-phys',j===i))}else{selM=i;c.querySelectorAll('.ec-opt').forEach((x,j)=>x.classList.toggle('sel-mental',j===i))}};c.appendChild(el)});
  });
}
renderEnergyOpts();

function renderTED(){
  const logs=ls(K.energy,[]),today=logs.find(l=>l.date===todayKey()),ted=document.getElementById('ted');
  if(today)ted.innerHTML=`<span class="ted-chip">${today.pe} ${today.phys}/5</span><span class="ted-chip">${today.me} ${today.mental}/5</span>${today.open?'<span class="ted-chip">✨ Open brain</span>':''}`;
  else ted.innerHTML='<span style="font-size:10px;color:var(--tmut);font-style:italic">not logged</span>';
}
renderTED();

document.getElementById('energy-log-home').onclick=()=>{
  if(selP===null||selM===null){const s=document.getElementById('energy-saved-home');s.style.color='var(--ch)';s.textContent='Pick both levels!';setTimeout(()=>s.textContent='',2500);return}
  const logs=ls(K.energy,[]),key=todayKey();
  const entry={date:key,phys:physOpts[selP].v,mental:mentalOpts[selM].v,pe:physOpts[selP].e,me:mentalOpts[selM].e,open:mentalOpts[selM].v===5,notes:document.getElementById('energy-notes-home').value.trim(),ts:Date.now()};
  const idx=logs.findIndex(l=>l.date===key);if(idx>=0)logs[idx]=entry;else logs.push(entry);
  logs.sort((a,b)=>b.date.localeCompare(a.date));ss(K.energy,logs);
  const s=document.getElementById('energy-saved-home');s.style.color='var(--green)';s.textContent='Logged! ✨';setTimeout(()=>s.textContent='',3000);
  renderTED();
};

// ============ GOALS / NEEDS BARS ============
const defGoals=[
  {id:1,name:'YouTube / Weird Girl General Store',freqNum:3,freqUnit:'week',val:55,lastDone:null},
  {id:2,name:'Coding & modding',freqNum:2,freqUnit:'week',val:40,lastDone:null},
  {id:3,name:'Doll restoration & Etsy',freqNum:1,freqUnit:'week',val:70,lastDone:null},
  {id:4,name:'Nomad Sculpt / 3D art',freqNum:2,freqUnit:'week',val:30,lastDone:null},
  {id:5,name:'Beauty & baddie content',freqNum:2,freqUnit:'week',val:65,lastDone:null},
  {id:6,name:'Reading & learning',freqNum:4,freqUnit:'week',val:50,lastDone:null},
  {id:7,name:'Language learning',freqNum:5,freqUnit:'week',val:25,lastDone:null},
  {id:8,name:'Movement & body care',freqNum:3,freqUnit:'week',val:60,lastDone:null}
];
let goals=ls(K.goals,defGoals);
function barColor(v){return v>=60?'var(--green)':v>=40?'var(--yellow)':'var(--ch)'}
function renderNeeds(){
  const list=document.getElementById('needs-list');list.innerHTML='';
  goals.forEach((g,i)=>{
    const e=document.createElement('div');e.className='need-row';
    e.innerHTML=`<div class="need-top"><div><div class="need-name">${g.name}</div><div class="need-freq">${g.freqNum}x / ${g.freqUnit}${g.lastDone?' · last: '+tAgo(g.lastDone):''}</div></div><div style="display:flex;gap:3px"><button class="btn-sm primary" style="font-size:9px;padding:2px 7px" onclick="bumpGoal(${i})">+ did it</button><button class="btn-del" onclick="delGoal(${i})">×</button></div></div><div class="bar-track"><div class="bar-fill" style="width:${g.val}%;background:${barColor(g.val)}"></div></div>`;
    list.appendChild(e);
  });
}
window.bumpGoal=i=>{goals[i].val=Math.min(100,goals[i].val+15);goals[i].lastDone=Date.now();ss(K.goals,goals);renderNeeds()};
window.delGoal=i=>{goals.splice(i,1);ss(K.goals,goals);renderNeeds()};

// Decay
let lastDecay=ls(K.decay,null);
const now=Date.now();
if(!lastDecay||now-lastDecay>86400000){goals.forEach(g=>{const rate=g.freqUnit==='day'?3:g.freqUnit==='week'?Math.round(14/g.freqNum):Math.round(45/g.freqNum);g.val=Math.max(0,g.val-rate)});ss(K.goals,goals);ss(K.decay,now)}
renderNeeds();

// Need modal
const needModal=document.getElementById('need-modal');
document.getElementById('open-need-modal').onclick=()=>needModal.classList.add('open');
document.getElementById('nm-cancel').onclick=()=>needModal.classList.remove('open');
needModal.onclick=e=>{if(e.target===needModal)needModal.classList.remove('open')};
document.getElementById('nm-save').onclick=()=>{
  const name=document.getElementById('nm-name').value.trim();if(!name)return;
  goals.push({id:Date.now(),name,freqNum:parseInt(document.getElementById('nm-freq').value)||3,freqUnit:document.getElementById('nm-unit').value,val:50,lastDone:null});
  ss(K.goals,goals);renderNeeds();needModal.classList.remove('open');document.getElementById('nm-name').value='';
};

// ============ BACKLOG ============
const defBacklog={todo:[{t:'ADHD evaluation — call doctor',done:false},{t:'Start electrolysis fund',done:false},{t:'Order Etsy supplies',done:false}],content:[{t:'Script Heathers essay',done:false}],errands:[{t:'Grocery run',done:false}],later:[{t:'Learn to use Blender',done:false}]};
let backlog=ls(K.backlog,defBacklog);
let activeBL='todo';
function renderBLTabs(){
  const tabs=document.getElementById('bl-tabs');tabs.innerHTML='';
  Object.keys(backlog).forEach(cat=>{
    const btn=document.createElement('button');btn.className='bl-tab'+(cat===activeBL?' active':'');
    btn.textContent=cat+' ('+backlog[cat].filter(x=>!x.done).length+')';
    btn.onclick=()=>{activeBL=cat;renderBLTabs();renderBLItems()};tabs.appendChild(btn);
  });
}
function renderBLItems(){
  const list=document.getElementById('bl-items'),items=backlog[activeBL]||[];
  list.innerHTML='';
  items.forEach((item,i)=>{
    const e=document.createElement('div');e.className='bl-item';
    e.innerHTML=`<div class="check-box${item.done?' done':''}" onclick="toggleBL(${i})" style="width:14px;height:14px;font-size:8px">${item.done?'✓':''}</div><span style="flex:1;${item.done?'text-decoration:line-through;opacity:.5':''}">${item.t}</span><button class="btn-del" onclick="delBL(${i})">×</button>`;
    list.appendChild(e);
  });
  document.getElementById('bl-count').textContent=items.filter(x=>!x.done).length+' remaining';
}
window.toggleBL=i=>{backlog[activeBL][i].done=!backlog[activeBL][i].done;ss(K.backlog,backlog);renderBLTabs();renderBLItems()};
window.delBL=i=>{backlog[activeBL].splice(i,1);ss(K.backlog,backlog);renderBLTabs();renderBLItems()};
document.getElementById('bl-add-btn').onclick=()=>{
  const inp=document.getElementById('bl-inp'),v=inp.value.trim();if(!v)return;
  backlog[activeBL].push({t:v,done:false});ss(K.backlog,backlog);inp.value='';renderBLTabs();renderBLItems();
};
document.getElementById('bl-inp').onkeydown=e=>{if(e.key==='Enter')document.getElementById('bl-add-btn').click()};
renderBLTabs();renderBLItems();

// ============ LIFE PILLARS ============
const pillars=[
  {name:'Health & body',emoji:'💪',pct:30,note:'T1D management, PCOS, ADHD eval'},
  {name:'Career & money',emoji:'💰',pct:45,note:'School job + side hustles growing'},
  {name:'Creative work',emoji:'🎨',pct:35,note:'YouTube, doll customs, 3D art'},
  {name:'Learning & growth',emoji:'📚',pct:25,note:'24 learning pillars in the hub!'},
  {name:'Social & love',emoji:'💖',pct:50,note:'Building connections'},
  {name:'Home & environment',emoji:'🏠',pct:40,note:'ACNH island + real life space'},
  {name:'Joy & beauty',emoji:'✨',pct:55,note:'Self care, vibes, feeling good'}
];
function renderPillars(){
  const section=document.getElementById('pillars-section');section.innerHTML='';
  pillars.forEach(p=>{
    const e=document.createElement('div');e.className='pillar-card';
    e.innerHTML=`<div style="display:flex;align-items:center;gap:8px"><span style="font-size:16px">${p.emoji}</span><div style="flex:1"><div style="font-size:11px;font-weight:500">${p.name}</div><div style="font-size:9px;color:var(--tmut)">${p.note}</div></div><span style="font-size:10px;font-weight:700;color:${barColor(p.pct)}">${p.pct}%</span></div><div class="pp-track"><div class="pp-fill" style="width:${p.pct}%;background:${barColor(p.pct)}"></div></div>`;
    section.appendChild(e);
  });
}
renderPillars();

// ============ QUICK LINKS ============
const quickLinks=document.getElementById('quick-links');
[
  {label:'🧠 Learning Hub',href:'learning-hub.html',color:'var(--purple)'},
  {label:'🎀 Barbie Empire',href:'barbie.html',color:'var(--pink)'},
  {label:'✨ Hobbies',href:'hobbies.html',color:'var(--gold)'},
  {label:'🩺 Health',href:'health.html',color:'var(--blue)'},
  {label:'📅 Calendar',href:'calendar.html',color:'var(--ch)'},
  {label:'🔮 2026 Manifestation',href:'manifestation.html',color:'#8e44ad'},
  {label:'🍃 ACNH',href:'acnh.html',color:'var(--grass)'},
].forEach(l=>{
  const a=document.createElement('a');
  a.href=l.href;
  a.style.cssText=`display:inline-flex;align-items:center;gap:5px;padding:8px 16px;background:white;border:1.5px solid ${l.color}33;border-radius:10px;font-size:11px;font-weight:600;color:${l.color};text-decoration:none;transition:all .15s;font-family:'DM Sans',sans-serif`;
  a.textContent=l.label;
  a.onmouseover=()=>a.style.background=l.color+'15';
  a.onmouseout=()=>a.style.background='white';
  quickLinks.appendChild(a);
});

// ============ CYCLE WIDGET ============
function renderHomeCycleWidget(){
  const ptSettings=JSON.parse(localStorage.getItem('wgc_settings')||'null')||{cycleLen:32,periodLen:5,pmddDays:10,lastPeriod:null};
  const ptPeriods=JSON.parse(localStorage.getItem('wgc_periods')||'[]');
  const TODAY_W=todayKey();
  const orb=document.getElementById('home-cycle-orb');
  const phaseName=document.getElementById('home-cycle-phase');
  const dayLabel=document.getElementById('home-cycle-day');
  if(!orb)return;
  const lastP=ptSettings.lastPeriod;
  if(!lastP){phaseName.textContent='🌸 Cycle tracker';dayLabel.textContent='Go to Health → Cycle to add your first period';return}
  const parse=s=>{const p=s.split('-');return new Date(+p[0],+p[1]-1,+p[2])};
  const diffDays=(a,b)=>Math.round((parse(b)-parse(a))/86400000);
  const sorted=[...ptPeriods].sort((a,b)=>b.date.localeCompare(a.date));
  let avgCL=ptSettings.cycleLen;
  const lens=[];for(let i=0;i<sorted.length-1;i++){const l=diffDays(sorted[i+1].date,sorted[i].date);if(l>=15&&l<=120)lens.push(l)}
  if(lens.length)avgCL=Math.round(lens.reduce((a,b)=>a+b,0)/lens.length);
  const avgPL=()=>{const v=sorted.filter(p=>p.periodLen&&p.periodLen>0);return v.length?Math.round(v.reduce((a,b)=>a+b.periodLen,0)/v.length):ptSettings.periodLen||5};
  const cd=Math.max(1,diffDays(lastP,TODAY_W)+1);
  const pl=avgPL(),pmddDays=ptSettings.pmddDays||10,ov=Math.round(avgCL/2);
  let phase='fol';
  if(cd<=pl)phase='men';else if(cd<=ov-2)phase='fol';else if(cd<=ov+2)phase='ov';else if(cd>avgCL-pmddDays)phase='pmdd';else phase='lut';
  const phaseNames={men:'Menstrual Phase',fol:'Follicular Phase',ov:'Ovulation Window',lut:'Luteal Phase',pmdd:'PMDD Zone'};
  const phaseEmojis={men:'🩸',fol:'🌱',ov:'🌕',lut:'🌊',pmdd:'💙'};
  orb.className='cycle-phase-orb '+phase;
  orb.textContent=phaseEmojis[phase];
  phaseName.textContent=phaseNames[phase];
  dayLabel.textContent='Cycle day '+cd+' of ~'+avgCL;
  const daysToNext=Math.max(0,avgCL-cd);
  const pmddPill=document.getElementById('home-pmdd-pill');
  const periodPill=document.getElementById('home-period-pill');
  if(phase==='pmdd'||cd>avgCL-pmddDays){pmddPill.style.display='';document.getElementById('home-pmdd-text').textContent='PMDD active'}
  if(daysToNext<=5){periodPill.style.display='';document.getElementById('home-period-text').textContent=daysToNext===0?'Period expected today':'~'+daysToNext+'d to period'}
}
renderHomeCycleWidget();
