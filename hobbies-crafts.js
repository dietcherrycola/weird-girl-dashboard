renderNav('hobbies');
window.crTab=t=>{document.querySelectorAll('.cr-tc').forEach(c=>c.classList.remove('active'));document.querySelectorAll('.cr-tab').forEach(b=>b.classList.remove('active'));document.getElementById('crt-'+t).classList.add('active');const btn=document.querySelector('.cr-tab[onclick="crTab(\''+t+'\')"]');if(btn)btn.classList.add('active')};

// Lists
function cR(c,k){const el=document.getElementById(c);if(!el)return;const items=ls(k,[]);el.innerHTML='';if(!items.length){el.innerHTML='<div style="text-align:center;padding:.5rem;color:var(--tmut);font-size:10px;font-style:italic;opacity:.7">Nothing yet</div>';return}items.forEach((t,i)=>{const txt=typeof t==='string'?t:t.text||'';const e=document.createElement('div');e.className='ci-item';e.innerHTML='<span style="flex:1">'+txt+'</span><button class="ci-del" onclick="cD(\''+c+'\',\''+k+'\','+i+')">×</button>';el.appendChild(e)})}
window.cAdd=(c,iid,k)=>{const inp=document.getElementById(iid);if(!inp)return;const v=inp.value.trim();if(!v)return;const items=ls(k,[]);items.push(v);ss(k,items);inp.value='';cR(c,k)};
window.cD=(c,k,i)=>{const items=ls(k,[]);items.splice(i,1);ss(k,items);cR(c,k)};

// Projects
let projects=ls('wh_craft_projects',[]);
function renderProjects(){const c=document.getElementById('craft-projects');if(!c)return;c.innerHTML='';if(!projects.length){c.innerHTML='<div style="text-align:center;padding:1rem;color:var(--tmut);font-size:10px;font-style:italic">No projects yet — start creating!</div>';return}
projects.forEach((p,i)=>{const colors={Queue:'var(--tmut)','In progress':'#e07b39',Done:'var(--green)'};const e=document.createElement('div');e.className='ci-item';e.innerHTML='<div style="flex:1"><div style="font-weight:600">'+p.name+'</div><div style="font-size:9px;color:var(--tmut);margin-top:2px">'+p.type+' · <span style="color:'+(colors[p.status]||'var(--tmut)')+'">'+p.status+'</span></div></div><select class="ci-inp" style="flex:none;width:90px;font-size:9px" onchange="updateProjectStatus('+i+',this.value)"><option '+(p.status==='Queue'?'selected':'')+'>Queue</option><option '+(p.status==='In progress'?'selected':'')+'>In progress</option><option '+(p.status==='Done'?'selected':'')+'>Done</option></select><button class="ci-del" onclick="delProject('+i+')">×</button>';c.appendChild(e)})}
window.addProject=()=>{const n=document.getElementById('cp-name').value.trim();if(!n)return;projects.push({name:n,type:document.getElementById('cp-type').value,status:document.getElementById('cp-status').value});ss('wh_craft_projects',projects);document.getElementById('cp-name').value='';renderProjects()};
window.updateProjectStatus=(i,s)=>{projects[i].status=s;ss('wh_craft_projects',projects)};
window.delProject=i=>{projects.splice(i,1);ss('wh_craft_projects',projects);renderProjects()};
renderProjects();

// How-to guides
let guides=ls('wh_craft_guides',[]);
function renderGuides(){const c=document.getElementById('craft-guides');if(!c)return;c.innerHTML='';if(!guides.length){c.innerHTML='<div style="text-align:center;padding:1rem;color:var(--tmut);font-size:10px;font-style:italic">No guides yet — create your first step-by-step!</div>';return}
guides.forEach((g,gi)=>{const card=document.createElement('div');card.className='cr';card.style.cssText='cursor:pointer';
card.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center"><div class="cr-t" style="margin:0">📋 '+g.title+'</div><div style="display:flex;gap:4px"><span style="font-size:9px;color:var(--tmut)">'+g.steps.length+' steps</span><button class="ci-del" onclick="event.stopPropagation();delGuide('+gi+')">×</button></div></div>';
card.onclick=()=>toggleGuide(gi);
const body=document.createElement('div');body.id='guide-body-'+gi;body.style.cssText='display:none;margin-top:.7rem;border-top:1px solid rgba(0,0,0,.06);padding-top:.5rem';
let stepsHtml='';g.steps.forEach((s,si)=>{stepsHtml+='<div style="display:flex;gap:6px;padding:4px 0;border-bottom:1px solid rgba(0,0,0,.04);font-size:10px;align-items:flex-start"><span style="font-weight:700;color:#d4648a;min-width:20px">'+(si+1)+'.</span><span style="flex:1">'+s+'</span><button class="ci-del" onclick="event.stopPropagation();delStep('+gi+','+si+')">×</button></div>'});
body.innerHTML=stepsHtml+'<div class="ci-add" style="margin-top:.4rem"><input class="ci-inp" id="step-inp-'+gi+'" placeholder="Add a step..." onclick="event.stopPropagation()"><button class="ci-btn" onclick="event.stopPropagation();addStep('+gi+')">+ Step</button></div>';
card.appendChild(body);c.appendChild(card)})}
window.toggleGuide=i=>{const b=document.getElementById('guide-body-'+i);if(b)b.style.display=b.style.display==='none'?'block':'none'};
window.addGuide=()=>{const t=document.getElementById('ht-title').value.trim();if(!t)return;guides.push({title:t,steps:[]});ss('wh_craft_guides',guides);document.getElementById('ht-title').value='';renderGuides()};
window.addStep=(gi)=>{const inp=document.getElementById('step-inp-'+gi);if(!inp)return;const v=inp.value.trim();if(!v)return;guides[gi].steps.push(v);ss('wh_craft_guides',guides);inp.value='';renderGuides();document.getElementById('guide-body-'+gi).style.display='block'};
window.delStep=(gi,si)=>{guides[gi].steps.splice(si,1);ss('wh_craft_guides',guides);renderGuides();document.getElementById('guide-body-'+gi).style.display='block'};
window.delGuide=i=>{if(confirm('Delete this guide?')){guides.splice(i,1);ss('wh_craft_guides',guides);renderGuides()}};
renderGuides();

// Archives
function renderArchive(type){const c=document.getElementById('craft-'+type);if(!c)return;const items=ls('wh_craft_'+type,[]);c.innerHTML='';if(!items.length){c.innerHTML='<div style="text-align:center;padding:.5rem;color:var(--tmut);font-size:10px;font-style:italic">None yet</div>';return}
items.forEach((item,i)=>{const e=document.createElement('div');e.className='archive-card '+type;e.innerHTML='<div style="font-weight:600">'+item.name+'</div><div style="font-size:9px;color:var(--tmut);margin-top:2px;font-style:italic">'+(item.why||'')+'</div><button class="ci-del" style="position:absolute;top:6px;right:6px" onclick="delArchive(\''+type+'\','+i+')">×</button>';e.style.position='relative';c.appendChild(e)})}
window.addArchive=type=>{const name=document.getElementById(type+'-name').value.trim();if(!name)return;const why=document.getElementById(type+'-why').value.trim();const items=ls('wh_craft_'+type,[]);items.push({name,why});ss('wh_craft_'+type,items);document.getElementById(type+'-name').value='';document.getElementById(type+'-why').value='';renderArchive(type)};
window.delArchive=(type,i)=>{const items=ls('wh_craft_'+type,[]);items.splice(i,1);ss('wh_craft_'+type,items);renderArchive(type)};

cR('craft-have','wh_craft_supplies_have');cR('craft-need','wh_craft_supplies_need');
renderArchive('loved');renderArchive('nope');
