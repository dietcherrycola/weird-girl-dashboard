renderNav('energy');

const physOpts=[{e:'💀',l:'Crashed',v:1},{e:'🔋',l:'Very low',v:2},{e:'😩',l:'Low',v:3},{e:'⚡',l:'Good',v:4},{e:'🔥',l:'Amazing',v:5}];
const mentalOpts=[{e:'🧱',l:'Brain fog',v:1},{e:'😵',l:'Struggling',v:2},{e:'😐',l:'Getting by',v:3},{e:'🧠',l:'Focused',v:4},{e:'✨',l:'Open brain!',v:5}];
let selP=null,selM=null;

function renderEnergyOpts(){
  ['phys','mental'].forEach(type=>{
    const opts=type==='phys'?physOpts:mentalOpts;
    const c=document.getElementById(type+'-opts');if(!c)return;c.innerHTML='';
    opts.forEach((o,i)=>{const el=document.createElement('div');el.className='ec-opt';el.innerHTML=`<span class="ec-emoji">${o.e}</span><div class="ec-val">${o.l}</div>`;el.onclick=()=>{if(type==='phys'){selP=i;c.querySelectorAll('.ec-opt').forEach((x,j)=>x.classList.toggle('sel-phys',j===i))}else{selM=i;c.querySelectorAll('.ec-opt').forEach((x,j)=>x.classList.toggle('sel-mental',j===i))}};c.appendChild(el)});
  });
}
renderEnergyOpts();

document.getElementById('energy-log-btn').onclick=()=>{
  if(selP===null||selM===null){const s=document.getElementById('energy-saved');s.style.color='var(--ch)';s.textContent='Pick both levels!';setTimeout(()=>s.textContent='',2500);return}
  const logs=ls(K.energy,[]),key=todayKey();
  const entry={date:key,phys:physOpts[selP].v,mental:mentalOpts[selM].v,pe:physOpts[selP].e,me:mentalOpts[selM].e,open:mentalOpts[selM].v===5,notes:document.getElementById('energy-notes').value.trim(),ts:Date.now()};
  const idx=logs.findIndex(l=>l.date===key);if(idx>=0)logs[idx]=entry;else logs.push(entry);
  logs.sort((a,b)=>b.date.localeCompare(a.date));ss(K.energy,logs);
  const s=document.getElementById('energy-saved');s.style.color='var(--green)';s.textContent='Logged! ✨';setTimeout(()=>s.textContent='',3000);
  renderAll();
};

// HOURLY
const HOUR_SLOTS=['6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm'];
function loadHourly(){return ls(K.hourly,{})}function saveHourly(h){ss(K.hourly,h)}
function renderHourly(){
  const grid=document.getElementById('hour-grid');if(!grid)return;grid.innerHTML='';
  const hourly=loadHourly(),todayH=hourly[todayKey()]||{};
  HOUR_SLOTS.forEach((slot,i)=>{
    const logged=todayH[slot];const el=document.createElement('div');
    el.style.cssText='background:white;border:1px solid var(--cbr);border-radius:7px;padding:4px;text-align:center;cursor:pointer;transition:all .15s;position:relative'+(logged?';border-color:rgba(192,57,43,.4)':'');
    el.innerHTML=`<div style="font-size:9px;color:var(--tmut)">${slot}</div><div style="font-size:13px;min-height:16px">${logged?(logged.pe||'')+(logged.me||''):''}</div>`;
    el.onclick=e=>{e.stopPropagation();openHourPicker(i,slot,el)};grid.appendChild(el);
  });renderHourChart();
}
let activeHSlot=null;
function openHourPicker(i,slot,el){
  document.querySelectorAll('.hour-picker').forEach(p=>p.remove());
  if(activeHSlot===i){activeHSlot=null;return}activeHSlot=i;
  const picker=document.createElement('div');picker.className='hour-picker';
  picker.style.cssText='position:absolute;z-index:50;background:white;border:1px solid var(--cbr);border-radius:10px;padding:.6rem;width:180px;left:50%;transform:translateX(-50%);top:calc(100% + 4px);box-shadow:0 4px 12px rgba(192,57,43,.1)';
  window.hp_sel_p=-1;window.hp_sel_m=-1;

  // Build picker with proper event listeners
  const title=document.createElement('div');title.style.cssText='font-size:10px;font-weight:500;color:var(--chd);margin-bottom:.4rem';title.textContent=slot;picker.appendChild(title);

  const plbl=document.createElement('div');plbl.style.cssText='font-size:9px;color:var(--tmut);margin-bottom:3px';plbl.textContent='Physical';picker.appendChild(plbl);
  const prow=document.createElement('div');prow.style.cssText='display:flex;gap:3px;margin-bottom:.4rem';
  physOpts.forEach((o,j)=>{const d=document.createElement('div');d.style.cssText='flex:1;border:1.5px solid var(--cbr);border-radius:5px;padding:2px;text-align:center;cursor:pointer;font-size:12px';d.textContent=o.e;d.addEventListener('click',(ev)=>{ev.stopPropagation();prow.querySelectorAll('div').forEach(x=>x.style.borderColor='var(--cbr)');d.style.borderColor='var(--orange)';window.hp_sel_p=j});prow.appendChild(d)});
  picker.appendChild(prow);

  const mlbl=document.createElement('div');mlbl.style.cssText='font-size:9px;color:var(--tmut);margin-bottom:3px';mlbl.textContent='Mental';picker.appendChild(mlbl);
  const mrow=document.createElement('div');mrow.style.cssText='display:flex;gap:3px;margin-bottom:.4rem';
  mentalOpts.forEach((o,j)=>{const d=document.createElement('div');d.style.cssText='flex:1;border:1.5px solid var(--cbr);border-radius:5px;padding:2px;text-align:center;cursor:pointer;font-size:12px';d.textContent=o.e;d.addEventListener('click',(ev)=>{ev.stopPropagation();mrow.querySelectorAll('div').forEach(x=>x.style.borderColor='var(--cbr)');d.style.borderColor='var(--purple)';window.hp_sel_m=j});mrow.appendChild(d)});
  picker.appendChild(mrow);

  const btn=document.createElement('button');btn.style.cssText='width:100%;background:var(--ch);color:white;border:none;border-radius:6px;padding:5px;font-size:10px;font-family:DM Sans,sans-serif;cursor:pointer';btn.textContent='Save';
  btn.addEventListener('click',(ev)=>{ev.stopPropagation();window.saveHourEntry(slot)});
  picker.appendChild(btn);

  el.style.position='relative';el.appendChild(picker);
  picker.addEventListener('click',(ev)=>ev.stopPropagation());
  picker.addEventListener('touchstart',(ev)=>ev.stopPropagation());
  setTimeout(()=>document.addEventListener('click',function h(e){if(!picker.contains(e.target)&&!el.contains(e.target)){picker.remove();activeHSlot=null;document.removeEventListener('click',h)}},false),200);
}
window.saveHourEntry=(slot)=>{
  if(window.hp_sel_p<0||window.hp_sel_m<0)return;
  const h=loadHourly();if(!h[todayKey()])h[todayKey()]={};
  h[todayKey()][slot]={pe:physOpts[window.hp_sel_p].e,me:mentalOpts[window.hp_sel_m].e,pv:physOpts[window.hp_sel_p].v,mv:mentalOpts[window.hp_sel_m].v};
  saveHourly(h);window.hp_sel_p=-1;window.hp_sel_m=-1;document.querySelectorAll('.hour-picker').forEach(p=>p.remove());activeHSlot=null;renderHourly();
};
function renderHourChart(){
  const chart=document.getElementById('hour-chart');if(!chart)return;chart.innerHTML='';
  const h=loadHourly(),todayH=h[todayKey()]||{};
  HOUR_SLOTS.forEach(slot=>{const d=todayH[slot];const col=document.createElement('div');col.style.cssText='display:flex;flex-direction:column;gap:1px;align-items:center;justify-content:flex-end;height:48px';
    if(d){const pb=document.createElement('div');pb.style.cssText=`width:100%;height:${d.pv/5*36}px;background:var(--orange);opacity:.7;border-radius:2px 2px 0 0`;const mb=document.createElement('div');mb.style.cssText=`width:100%;height:${d.mv/5*36}px;background:var(--purple);opacity:.7;border-radius:2px 2px 0 0`;col.appendChild(pb);col.appendChild(mb)}
    else{const e=document.createElement('div');e.style.cssText='width:100%;height:3px;background:rgba(192,57,43,.1);border-radius:1px';col.appendChild(e)}
    chart.appendChild(col);});
}

// TRENDS
function renderTrends(){
  const div=document.getElementById('energy-trends');div.innerHTML='';
  const logs=ls(K.energy,[]).slice(0,14);
  if(!logs.length){div.innerHTML='<div class="empty-s">No energy logs yet — start logging to see trends!</div>';return}
  logs.forEach(l=>{
    const e=document.createElement('div');e.className='trend-row';
    e.innerHTML=`<div class="trend-date">${fmtShort(l.date)}</div><div class="trend-emojis">${l.pe}${l.me}</div><div class="trend-bar"><div class="trend-bar-p" style="width:${l.phys/5*100}%"></div><div class="trend-bar-m" style="width:${l.mental/5*100}%"></div></div><span style="font-size:9px;color:var(--tmut)">${l.phys+l.mental}/10</span>`;
    div.appendChild(e);
  });
}

// INSIGHTS
function renderInsights(){
  const div=document.getElementById('energy-insights');
  const logs=ls(K.energy,[]);
  if(logs.length<3){div.innerHTML='<div class="empty-s">Log a few more days to unlock insights!</div>';return}
  const recent=logs.slice(0,7);
  const avgP=+(recent.reduce((a,b)=>a+b.phys,0)/recent.length).toFixed(1);
  const avgM=+(recent.reduce((a,b)=>a+b.mental,0)/recent.length).toFixed(1);
  const openDays=recent.filter(l=>l.open).length;
  const trend=logs.length>=14?((logs.slice(0,7).reduce((a,b)=>a+b.phys+b.mental,0)/7)>(logs.slice(7,14).reduce((a,b)=>a+b.phys+b.mental,0)/7)?'📈 Trending up':'📉 Trending down'):'📊 Building data...';
  div.innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px">
      <div style="background:var(--chp);border-radius:8px;padding:7px 9px"><div style="font-size:9px;color:var(--tmut)">Avg Physical (7d)</div><div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--orange)">${avgP}/5</div></div>
      <div style="background:var(--purple-light);border-radius:8px;padding:7px 9px"><div style="font-size:9px;color:var(--tmut)">Avg Mental (7d)</div><div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--purple)">${avgM}/5</div></div>
    </div>
    <div style="margin-bottom:4px">✨ <strong>Open brain days this week:</strong> ${openDays}/7</div>
    <div style="margin-bottom:4px">${trend}</div>
    ${avgP<3?'<div style="background:var(--yellow-light);padding:6px 8px;border-radius:8px;margin-top:6px;font-size:10px">⚠️ Physical energy is low — prioritize rest, blood sugar management, and gentle movement</div>':''}
    ${avgM<3?'<div style="background:var(--purple-light);padding:6px 8px;border-radius:8px;margin-top:6px;font-size:10px">🧠 Mental energy is struggling — consider reducing decisions, using body doubling, or taking a brain break</div>':''}
  `;
}

// HISTORY
function renderHistory(){
  const div=document.getElementById('energy-history');div.innerHTML='';
  const logs=ls(K.energy,[]);
  if(!logs.length){div.innerHTML='<div class="empty-s">No logs yet</div>';return}
  logs.forEach(l=>{
    const e=document.createElement('div');
    e.style.cssText='display:flex;gap:8px;padding:8px 10px;background:white;border:1px solid var(--cbr);border-radius:9px;margin-bottom:5px;align-items:flex-start';
    e.innerHTML=`<div style="font-size:9px;color:var(--tmut);min-width:65px;flex-shrink:0">${fmtShort(l.date)}</div><div style="display:flex;gap:4px;font-size:14px">${l.pe}${l.me}${l.open?'✨':''}</div><div style="flex:1;font-size:10px;color:var(--tmut);font-style:italic;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${l.notes||''}</div><div style="font-size:10px;font-weight:600;color:var(--chd)">${l.phys+l.mental}/10</div>`;
    div.appendChild(e);
  });
}

function renderAll(){renderHourly();renderTrends();renderInsights();renderHistory()}
renderAll();
