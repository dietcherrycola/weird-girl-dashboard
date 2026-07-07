renderNav('home');
const items=ls(K.done,[]);const now=new Date();const todayStr=todayKey();

function renderStats(){
  const c=document.getElementById('ds-stats');
  const today=items.filter(i=>i.ts&&new Date(i.ts).toISOString().split('T')[0]===todayStr).length;
  const weekAgo=Date.now()-7*86400000;
  const thisWeek=items.filter(i=>i.ts&&i.ts>weekAgo).length;
  const monthStart=new Date(now.getFullYear(),now.getMonth(),1).getTime();
  const thisMonth=items.filter(i=>i.ts&&i.ts>monthStart).length;
  const dayCounts={};items.forEach(i=>{if(!i.ts)return;const d=new Date(i.ts).toISOString().split('T')[0];dayCounts[d]=(dayCounts[d]||0)+1});
  const bestDay=Object.entries(dayCounts).sort((a,b)=>b[1]-a[1])[0];
  c.innerHTML=`<div class="ds-stat"><div class="ds-val" style="color:var(--green)">${today}</div><div class="ds-lbl">Done today</div></div><div class="ds-stat"><div class="ds-val">${thisWeek}</div><div class="ds-lbl">This week</div></div><div class="ds-stat"><div class="ds-val">${thisMonth}</div><div class="ds-lbl">This month</div></div><div class="ds-stat"><div class="ds-val" style="font-size:16px">${bestDay?bestDay[1]:0}</div><div class="ds-lbl">Best day record</div></div>`;
}

function renderMonthGraph(){
  const c=document.getElementById('ds-month-graph');const year=now.getFullYear(),month=now.getMonth();
  const dim=new Date(year,month+1,0).getDate();const dayData={};
  items.forEach(i=>{if(!i.ts)return;const d=new Date(i.ts);if(d.getFullYear()===year&&d.getMonth()===month){dayData[d.getDate()]=(dayData[d.getDate()]||0)+1}});
  const max=Math.max(1,...Object.values(dayData));c.innerHTML='';
  for(let d=1;d<=dim;d++){const count=dayData[d]||0;const height=count>0?Math.max(8,(count/max)*100):2;const isToday=d===now.getDate();
    const col=document.createElement('div');col.className='month-col';
    col.innerHTML=`<div class="month-col-val">${count||''}</div><div class="month-col-bar" style="height:${height}px;${isToday?'background:var(--green)':count?'':'background:rgba(0,0,0,.06)'}"></div><div class="month-col-lbl" style="${isToday?'font-weight:700;color:var(--chd)':''}">${d}</div>`;
    c.appendChild(col);}
}

function renderKeywords(){
  const c=document.getElementById('ds-keywords');
  const stops=new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','my','i','it','is','was','this','that','from','got','did','do','done','just','up','out','some','all','been','have','has','had','its','about','new','old','back','into','over','take','made','get','set','put','ran','let','went','off','try','add']);
  const wc={};items.forEach(i=>{if(!i.text)return;i.text.toLowerCase().replace(/[^a-z0-9\s]/g,'').split(/\s+/).forEach(w=>{if(w.length<3||stops.has(w))return;wc[w]=(wc[w]||0)+1})});
  const sorted=Object.entries(wc).filter(([w,c])=>c>=2).sort((a,b)=>b[1]-a[1]).slice(0,25);
  if(!sorted.length){c.innerHTML='<div style="font-size:10px;color:var(--tmut);font-style:italic">Keep logging to see patterns!</div>';return}
  sorted.forEach(([word,count])=>{const t=document.createElement('span');t.className='kw-tag';t.innerHTML=`${word} <span class="kw-count">${count}x</span>`;c.appendChild(t)});
}

let archiveDays=14;
function renderArchive(){
  const c=document.getElementById('ds-archive');c.innerHTML='';
  const groups={};items.forEach(i=>{if(!i.ts)return;const d=new Date(i.ts).toISOString().split('T')[0];if(!groups[d])groups[d]=[];groups[d].push(i)});
  const dates=Object.keys(groups).sort((a,b)=>b.localeCompare(a)).slice(0,archiveDays);
  if(!dates.length){c.innerHTML='<div class="empty-s">No items yet!</div>';return}
  dates.forEach(date=>{const dayItems=groups[date];const block=document.createElement('div');block.className='day-block';
    const isToday=date===todayStr;const d=new Date(date+'T12:00');
    const label=isToday?'Today':d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
    block.innerHTML=`<div class="day-date">${label}<span class="day-count">${dayItems.length} done</span></div>`;
    dayItems.forEach(item=>{const time=item.ts?new Date(item.ts).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}):'';
      const e=document.createElement('div');e.className='day-item';e.innerHTML=`<span class="day-item-time">${time}</span><span>${item.text}</span>`;block.appendChild(e)});
    c.appendChild(block)});
  document.getElementById('ds-load-more').style.display=dates.length<Object.keys(groups).length?'':'none';
}
document.getElementById('ds-load-more').onclick=()=>{archiveDays+=14;renderArchive()};

renderStats();renderMonthGraph();renderKeywords();renderArchive();
