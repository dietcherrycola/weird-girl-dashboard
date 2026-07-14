renderNav('calendar');

// ===== FULL CALENDAR =====
(function(){
const FC_STORAGE='wg_fc_events';
let fcEvents=[],fcYear,fcMonth,fcSelectedDay=null,fcView='month',fcEditId=null,fcNewEventDay=null,fcPickedColor='#930500';
let fcWeekStart=null;
const FC_CAT_COLORS={personal:'#930500',health:'#930500',school:'#4A6FA5',work:'#5C0300',social:'#4A6FA5',birthday:'#5C0300',reminder:'#e07b10',other:'#555'};
const FC_MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const FC_DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const FC_DAY_NAMES=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function fcLoad(){fcEvents=ls(FC_STORAGE,[]);}
function fcSave(){ss(FC_STORAGE,fcEvents);}
function fcTodayStr(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function fcDs(y,m,d){return y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');}
function fcParse(str){const p=str.split('-');return new Date(+p[0],+p[1]-1,+p[2]);}

function fcOccursOn(ev,dateStr){
  if(!ev.date)return false;
  if(!ev.recur||ev.recur==='none'){
    if(ev.endDate&&ev.endDate>=ev.date)return dateStr>=ev.date&&dateStr<=ev.endDate;
    return ev.date===dateStr;
  }
  const base=fcParse(ev.date),target=fcParse(dateStr);
  if(target<base)return false;
  const diff=Math.round((target-base)/86400000);
  if(ev.recur==='daily')return true;
  if(ev.recur==='custom'){
    // If no days selected, fall back to same weekday as start
    if(!ev.recurDays||!ev.recurDays.length) return diff%7===0;
    // Check if target's day-of-week is in the selected days
    if(!ev.recurDays.includes(target.getDay())) return false;
    // Check week interval — which week number (from start) is this?
    const interval=ev.weekInterval||1;
    const weeksSinceBase=Math.floor(diff/7);
    return weeksSinceBase%interval===0;
  }
  if(ev.recur==='monthly')return target.getDate()===base.getDate();
  if(ev.recur==='yearly')return target.getDate()===base.getDate()&&target.getMonth()===base.getMonth();
  return false;
}
function fcOnDate(dateStr){return fcEvents.filter(ev=>fcOccursOn(ev,dateStr));}

// ---- VIEWS ----
window.fcShowView=function(view){
  fcView=view;
  ['month','week','agenda'].forEach(v=>{
    const el=document.getElementById('fc-'+v+'-view');
    if(el)el.style.display=v===view?'block':'none';
    const btn=document.getElementById('fc-view-'+v);
    if(btn){btn.style.background=v===view?'var(--ch)':'';btn.style.color=v===view?'white':'';}
  });
  if(view==='month')fcRenderMonth();
  else if(view==='week')fcRenderWeek();
  else if(view==='agenda')fcRenderAgenda();
};

window.fcPrev=function(){
  if(fcView==='month'){fcMonth--;if(fcMonth<0){fcMonth=11;fcYear--;}fcRenderMonth();}
  else if(fcView==='week'&&fcWeekStart){fcWeekStart.setDate(fcWeekStart.getDate()-7);fcRenderWeek();}
};
window.fcNext=function(){
  if(fcView==='month'){fcMonth++;if(fcMonth>11){fcMonth=0;fcYear++;}fcRenderMonth();}
  else if(fcView==='week'&&fcWeekStart){fcWeekStart.setDate(fcWeekStart.getDate()+7);fcRenderWeek();}
};
window.fcGoToday=function(){
  const n=new Date();fcYear=n.getFullYear();fcMonth=n.getMonth();
  fcWeekStart=fcGetWeekStart(new Date());
  if(fcView==='month')fcRenderMonth();
  else if(fcView==='week')fcRenderWeek();
};

// ---- MONTH ----
function fcRenderMonth(){
  const g=document.getElementById('fc-month-grid');if(!g)return;
  const lbl=document.getElementById('fc-month-lbl');if(lbl)lbl.textContent=FC_MONTHS[fcMonth]+' '+fcYear;
  g.innerHTML='';
  const today=fcTodayStr();
  const firstDay=new Date(fcYear,fcMonth,1).getDay();
  const daysInMonth=new Date(fcYear,fcMonth+1,0).getDate();
  const daysInPrev=new Date(fcYear,fcMonth,0).getDate();
  // prev month fill
  for(let i=firstDay-1;i>=0;i--){
    const pm=fcMonth-1<0?11:fcMonth-1,py=fcMonth-1<0?fcYear-1:fcYear;
    g.appendChild(fcMakeCell(py,pm,daysInPrev-i,true));
  }
  // this month
  for(let d=1;d<=daysInMonth;d++)g.appendChild(fcMakeCell(fcYear,fcMonth,d,false));
  // next month fill
  const total=firstDay+daysInMonth,rem=total%7===0?0:7-(total%7);
  for(let d=1;d<=rem;d++){
    const nm=fcMonth+1>11?0:fcMonth+1,ny=fcMonth+1>11?fcYear+1:fcYear;
    g.appendChild(fcMakeCell(ny,nm,d,true));
  }
  fcUpdateHomeWidget();
}

function fcMakeCell(ey,em,d,otherMonth){
  const dateStr=fcDs(ey,em,d),today=fcTodayStr();
  const isToday=dateStr===today,isSel=dateStr===fcSelectedDay;
  const evs=fcOnDate(dateStr);
  const cell=document.createElement('div');
  cell.className='fc-month-cell'+(otherMonth?' other-month':'')+(isToday?' today':'')+(isSel?' selected':'');
  cell.onclick=function(){fcSelectDay(dateStr);};
  const dn=document.createElement('div');dn.className='fc-day-num';dn.textContent=d;cell.appendChild(dn);
  evs.slice(0,2).forEach(function(ev){
    const pill=document.createElement('div');pill.className='fc-event-pill';
    pill.style.background=ev.color||FC_CAT_COLORS[ev.cat]||'#930500';
    pill.textContent=(ev.time?ev.time.slice(0,5)+' ':'')+ev.name;
    pill.onclick=function(e){e.stopPropagation();fcEditEvent(ev.id);};
    cell.appendChild(pill);
  });
  if(evs.length>2){const m=document.createElement('div');m.className='fc-more-pill';m.textContent='+'+(evs.length-2)+' more';cell.appendChild(m);}
  return cell;
}

window.fcSelectDay=function(dateStr){
  fcSelectedDay=dateStr;
  fcRenderMonth();
  fcShowDayPanel(dateStr);
};

function fcShowDayPanel(dateStr){
  const panel=document.getElementById('fc-day-panel');if(!panel)return;
  const d=fcParse(dateStr);
  const title=document.getElementById('fc-day-title');
  if(title)title.textContent=FC_DAY_NAMES[d.getDay()]+', '+FC_MONTHS[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear();
  fcNewEventDay=dateStr;
  panel.style.display='block';
  panel.scrollIntoView({behavior:'smooth',block:'nearest'});
  const evList=document.getElementById('fc-day-events');
  const empty=document.getElementById('fc-day-empty');
  if(!evList)return;
  const evs=fcOnDate(dateStr).sort(function(a,b){return(a.time||'99:99').localeCompare(b.time||'99:99');});
  evList.innerHTML='';
  if(empty)empty.style.display=evs.length?'none':'block';
  evs.forEach(function(ev){
    const color=ev.color||FC_CAT_COLORS[ev.cat]||'#930500';
    const row=document.createElement('div');row.className='fc-day-event-row';
    row.innerHTML='<div style="width:4px;border-radius:2px;background:'+color+';flex-shrink:0;align-self:stretch"></div>'
      +'<div style="flex:1"><div style="font-weight:600;font-size:12px">'+ev.name+'</div>'
      +'<div style="font-size:9px;color:var(--tmut);margin-top:2px">'+(ev.time||'All day')+(ev.recur&&ev.recur!=='none'?' \u00b7 \uD83D\uDD04 Repeats':'')+(ev.notes?' \u00b7 '+ev.notes:'')+'</div></div>'
      +'<button class="hob-btn-sm" onclick="fcEditEvent(\''+ev.id+'\')">Edit</button>';
    evList.appendChild(row);
  });
}

window.fcOpenNewEventOnDay=function(){fcOpenNewEvent(fcNewEventDay);};

// ---- WEEK ----
function fcGetWeekStart(date){const d=new Date(date);d.setDate(d.getDate()-d.getDay());d.setHours(0,0,0,0);return d;}

function fcRenderWeek(){
  if(!fcWeekStart)fcWeekStart=fcGetWeekStart(new Date());
  const g=document.getElementById('fc-week-grid');if(!g)return;
  const today=fcTodayStr();
  const ws=new Date(fcWeekStart),we=new Date(fcWeekStart);we.setDate(we.getDate()+6);
  const lbl=document.getElementById('fc-week-lbl');
  if(lbl)lbl.textContent=FC_MONTHS[ws.getMonth()].slice(0,3)+' '+ws.getDate()+' \u2013 '+FC_MONTHS[we.getMonth()].slice(0,3)+' '+we.getDate()+', '+we.getFullYear();
  g.innerHTML='';
  for(let i=0;i<7;i++){
    const day=new Date(fcWeekStart);day.setDate(day.getDate()+i);
    const dateStr=fcDs(day.getFullYear(),day.getMonth(),day.getDate());
    const isToday=dateStr===today;
    const evs=fcOnDate(dateStr).sort(function(a,b){return(a.time||'99:99').localeCompare(b.time||'99:99');});
    const col=document.createElement('div');col.className='fc-week-day-col'+(isToday?' today':'');
    const hdr=document.createElement('div');hdr.className='fc-week-day-hdr'+(isToday?' today-hdr':'');
    hdr.innerHTML=FC_DAYS[i]+'<br>'+day.getDate();col.appendChild(hdr);
    evs.forEach(function(ev){
      const pill=document.createElement('div');pill.className='fc-event-pill';
      pill.style.background=ev.color||FC_CAT_COLORS[ev.cat]||'#930500';
      pill.style.marginBottom='3px';
      pill.textContent=(ev.time?ev.time.slice(0,5)+' ':'')+ev.name;
      pill.onclick=function(){fcEditEvent(ev.id);};col.appendChild(pill);
    });
    if(!evs.length){const e=document.createElement('div');e.style.cssText='font-size:9px;color:rgba(0,0,0,.2);text-align:center;margin-top:.5rem';e.textContent='\u2014';col.appendChild(e);}
    g.appendChild(col);
  }
}

// ---- AGENDA ----
function fcRenderAgenda(){
  const list=document.getElementById('fc-agenda-list'),empty=document.getElementById('fc-agenda-empty');
  if(!list)return;list.innerHTML='';
  const today=fcTodayStr(),upcoming=[];
  for(let i=0;i<90;i++){
    const d=new Date();d.setDate(d.getDate()+i);
    const dateStr=fcDs(d.getFullYear(),d.getMonth(),d.getDate());
    const evs=fcOnDate(dateStr);
    if(evs.length)upcoming.push({dateStr,d:new Date(d),evs});
  }
  if(empty)empty.style.display=upcoming.length?'none':'block';
  upcoming.forEach(function(item){
    const isToday=item.dateStr===today;
    const dh=document.createElement('div');
    dh.style.cssText='font-size:10px;font-weight:700;color:'+(isToday?'var(--ch)':'var(--tmut)')+';text-transform:uppercase;letter-spacing:.5px;margin:10px 0 4px';
    dh.textContent=(isToday?'TODAY \u2014 ':'')+FC_DAY_NAMES[item.d.getDay()]+', '+FC_MONTHS[item.d.getMonth()]+' '+item.d.getDate();
    list.appendChild(dh);
    item.evs.sort(function(a,b){return(a.time||'99:99').localeCompare(b.time||'99:99');}).forEach(function(ev){
      const color=ev.color||FC_CAT_COLORS[ev.cat]||'#930500';
      const el=document.createElement('div');el.className='fc-agenda-item';
      el.innerHTML='<div class="fc-agenda-dot" style="background:'+color+'"></div>'
        +'<div style="flex:1"><div style="font-size:12px;font-weight:600">'+ev.name+'</div>'
        +'<div style="font-size:9px;color:var(--tmut);margin-top:2px">'+(ev.time?ev.time+' \u00b7 ':'')+( ev.cat||'')+(ev.recur&&ev.recur!=='none'?' \u00b7 \uD83D\uDD04 repeating':'')+'</div>'
        +(ev.notes?'<div style="font-size:10px;color:var(--tmut);margin-top:2px;font-style:italic">'+ev.notes+'</div>':'')
        +'</div><button class="hob-btn-sm" onclick="fcEditEvent(\''+ev.id+'\')">Edit</button>';
      list.appendChild(el);
    });
  });
}

// ---- CRUD ----
window.fcOpenNewEvent=function(dateStr){
  fcEditId=null;
  const mt=document.getElementById('fc-modal-title');if(mt)mt.textContent='\u2728 New event';
  const db=document.getElementById('fc-delete-btn');if(db)db.style.display='none';
  const nd=document.getElementById('fc-ev-name');if(nd)nd.value='';
  const dd=document.getElementById('fc-ev-date');if(dd)dd.value=dateStr||fcTodayStr();
  const ed=document.getElementById('fc-ev-end-date');if(ed)ed.value='';
  const td=document.getElementById('fc-ev-time');if(td)td.value='';
  const rd=document.getElementById('fc-ev-recur');if(rd)rd.value='none';
  [0,1,2,3,4,5,6].forEach(function(d){const el=document.getElementById('fc-rd-'+d);if(el)el.checked=false;});
  const defWi=document.getElementById('fc-wi-1');if(defWi)defWi.checked=true;
  fcToggleRecurDays();
  const cd=document.getElementById('fc-ev-cat');if(cd)cd.value='personal';
  const nd2=document.getElementById('fc-ev-notes');if(nd2)nd2.value='';
  fcPickedColor='#930500';
  document.querySelectorAll('.fc-color-swatch').forEach(function(s){s.classList.toggle('selected',s.dataset.color===fcPickedColor);});
  const modal=document.getElementById('fc-event-modal');if(modal)modal.classList.add('open');
};

window.fcPickColor=function(el){
  document.querySelectorAll('.fc-color-swatch').forEach(function(s){s.classList.remove('selected');});
  el.classList.add('selected');fcPickedColor=el.dataset.color;
};

window.fcSaveEvent=function(){
  const nameEl=document.getElementById('fc-ev-name');
  const name=nameEl?nameEl.value.trim():'';if(!name)return;
  const id=fcEditId||('ev_'+Date.now()+'_'+Math.random().toString(36).slice(2,6));
  function gv(elId){const el=document.getElementById(elId);return el?el.value:'';}
  const recur=gv('fc-ev-recur');
  const recurDays=[];
  let weekInterval=1;
  if(recur==='custom'){
    [0,1,2,3,4,5,6].forEach(function(d){const el=document.getElementById('fc-rd-'+d);if(el&&el.checked)recurDays.push(d);});
    const wi=document.querySelector('input[name="fc-week-interval"]:checked');
    weekInterval=wi?parseInt(wi.value):1;
  }
  const ev={id,name,date:gv('fc-ev-date'),endDate:gv('fc-ev-end-date'),time:gv('fc-ev-time'),cat:gv('fc-ev-cat'),color:fcPickedColor,recur,recurDays,weekInterval,notes:gv('fc-ev-notes')};
  if(fcEditId){const idx=fcEvents.findIndex(function(e){return e.id===fcEditId;});if(idx>=0)fcEvents[idx]=ev;else fcEvents.push(ev);}
  else fcEvents.push(ev);
  fcSave();
  const modal=document.getElementById('fc-event-modal');if(modal)modal.classList.remove('open');
  fcEditId=null;
  fcRenderMonth();
  if(fcView==='week')fcRenderWeek();
  if(fcView==='agenda')fcRenderAgenda();
  if(fcSelectedDay)fcShowDayPanel(fcSelectedDay);
  fcUpdateHomeWidget();
};

window.fcEditEvent=function(id){
  const ev=fcEvents.find(function(e){return e.id===id;});if(!ev)return;
  fcEditId=id;
  const mt=document.getElementById('fc-modal-title');if(mt)mt.textContent='\u270F\uFE0F Edit event';
  const db=document.getElementById('fc-delete-btn');if(db)db.style.display='inline-block';
  function sv(elId,val){const el=document.getElementById(elId);if(el)el.value=val||'';}
  sv('fc-ev-name',ev.name);sv('fc-ev-date',ev.date);sv('fc-ev-end-date',ev.endDate);
  sv('fc-ev-time',ev.time);sv('fc-ev-cat',ev.cat||'personal');sv('fc-ev-recur',ev.recur||'none');sv('fc-ev-notes',ev.notes);
  [0,1,2,3,4,5,6].forEach(function(d){const el=document.getElementById('fc-rd-'+d);if(el)el.checked=ev.recurDays&&ev.recurDays.includes(d);});
  const wi=ev.weekInterval||1;const wiEl=document.getElementById('fc-wi-'+wi);if(wiEl)wiEl.checked=true;
  fcToggleRecurDays();
  fcPickedColor=ev.color||'#930500';
  document.querySelectorAll('.fc-color-swatch').forEach(function(s){s.classList.toggle('selected',s.dataset.color===fcPickedColor);});
  const modal=document.getElementById('fc-event-modal');if(modal)modal.classList.add('open');
};

window.fcDeleteEvent=function(){
  if(!fcEditId)return;
  if(!confirm('Delete this event?'))return;
  fcEvents=fcEvents.filter(function(e){return e.id!==fcEditId;});
  fcSave();
  const modal=document.getElementById('fc-event-modal');if(modal)modal.classList.remove('open');
  fcEditId=null;
  fcRenderMonth();
  if(fcView==='week')fcRenderWeek();
  if(fcView==='agenda')fcRenderAgenda();
  if(fcSelectedDay)fcShowDayPanel(fcSelectedDay);
  fcUpdateHomeWidget();
};

// ---- HOME WIDGET ----
function fcUpdateHomeWidget(){
  // Add event dots to home calendar cells
  const g=document.getElementById('cal-grid');if(!g)return;
  g.querySelectorAll('.cd:not(.empty)').forEach(function(cell){
    const d=parseInt(cell.textContent);if(isNaN(d))return;
    const dateStr=fcDs(calY,calM,d);
    if(fcOnDate(dateStr).length)cell.classList.add('has-event');
    else cell.classList.remove('has-event');
  });
  // Today's events below home calendar
  let container=document.getElementById('home-cal-today-events');
  if(!container){
    const card=document.querySelector('#cal-grid')&&document.querySelector('#cal-grid').closest('.card');
    if(card){container=document.createElement('div');container.id='home-cal-today-events';container.className='home-cal-events';card.appendChild(container);}
  }
  if(!container)return;
  const todayEvs=fcOnDate(fcTodayStr()).sort(function(a,b){return(a.time||'99:99').localeCompare(b.time||'99:99');});
  container.innerHTML='';
  if(todayEvs.length){
    const hdr=document.createElement('div');hdr.style.cssText='font-size:9px;font-weight:700;color:var(--tmut);text-transform:uppercase;letter-spacing:.4px;margin-bottom:2px;margin-top:.3rem';hdr.textContent="Today's events";container.appendChild(hdr);
    todayEvs.slice(0,4).forEach(function(ev){
      const pill=document.createElement('div');pill.className='home-cal-event-pill';
      pill.style.background=ev.color||FC_CAT_COLORS[ev.cat]||'#930500';
      pill.textContent=(ev.time?ev.time.slice(0,5)+' ':'')+ev.name;
      pill.onclick=function(){window.location.href='calendar.html';};container.appendChild(pill);
    });
    if(todayEvs.length>4){const m=document.createElement('div');m.style.cssText='font-size:9px;color:var(--tmut);padding:1px 3px';m.textContent='+'+(todayEvs.length-4)+' more \u2014 open calendar';container.appendChild(m);}
  }
}

// Toggle day-of-week picker
window.fcToggleRecurDays=function(){
  const recur=document.getElementById('fc-ev-recur');
  const wrap=document.getElementById('fc-recur-days-wrap');
  if(!wrap||!recur)return;
  wrap.style.display=recur.value==='custom'?'block':'none';
};

// Override renderCal to also show dots
const _origRenderCalFC=window.renderCal;
window.renderCal=function(){
  if(_origRenderCalFC)_origRenderCalFC();
  fcLoad();fcUpdateHomeWidget();
};

// ---- INIT ----
window.initFullCalendar=function(){
  fcLoad();
  const n=new Date();fcYear=n.getFullYear();fcMonth=n.getMonth();
  if(!fcWeekStart)fcWeekStart=fcGetWeekStart(new Date());
  fcShowView('month');
};

// Run on load
fcLoad();
setTimeout(function(){initFullCalendar();},100);
})();

// Auto-init
if(typeof initFullCalendar === 'function') initFullCalendar();
