renderNav('hobbies');

// ===== NAV =====
window.goOG=id=>{document.querySelectorAll('.og-page').forEach(p=>p.classList.remove('active'));document.querySelectorAll('.og-btn').forEach(b=>b.classList.remove('active'));document.getElementById('og-'+id).classList.add('active');document.querySelector('.og-btn[onclick="goOG(\''+id+'\')"]').classList.add('active');window.scrollTo(0,0)};

// ===== LIST SYSTEM =====
function oR(c,k){const el=document.getElementById(c);if(!el)return;const items=ls(k,[]);el.innerHTML='';if(!items.length){el.innerHTML='<div style="text-align:center;padding:.5rem;color:var(--tmut);font-size:10px;font-style:italic;opacity:.7">Nothing yet</div>';return}items.forEach((t,i)=>{const txt=typeof t==='string'?t:t.text||'';const e=document.createElement('div');e.className='oi';e.innerHTML='<span style="flex:1">'+txt+'</span><button class="oi-del" onclick="oD(\''+c+'\',\''+k+'\','+i+')">×</button>';el.appendChild(e)})}
window.oA=(c,iid,k)=>{const inp=document.getElementById(iid);if(!inp)return;const v=inp.value.trim();if(!v)return;const items=ls(k,[]);items.push(v);ss(k,items);inp.value='';oR(c,k)};
window.oD=(c,k,i)=>{const items=ls(k,[]);items.splice(i,1);ss(k,items);oR(c,k)};
window.oS=(id,k)=>{const el=document.getElementById(id);if(el)ss(k,el.value)};
function oL(id,k){const el=document.getElementById(id);if(el)el.value=ls(k,'')||''}

// ===== DAILY CHECKLISTS =====
function renderDaily(cid,tasks,sk,color){
  const c=document.getElementById(cid);if(!c)return;c.innerHTML='';
  const today=new Date().toISOString().split('T')[0];
  let d=ls(sk,{});if(d.date!==today)d={date:today,checks:{}};
  let done=0;
  tasks.forEach((t,i)=>{const dn=d.checks[i];if(dn)done++;const lbl=document.createElement('label');lbl.className='daily-check';lbl.innerHTML='<input type="checkbox" '+(dn?'checked':'')+' style="accent-color:'+color+'"><span style="'+(dn?'text-decoration:line-through;opacity:.5':'')+'">'+t+'</span>';lbl.querySelector('input').onchange=()=>{d.checks[i]=!d.checks[i];ss(sk,d);renderDaily(cid,tasks,sk,color)};c.appendChild(lbl)});
  const bar=document.createElement('div');bar.className='daily-bar';bar.innerHTML='<div class="daily-fill" style="width:'+Math.round(done/tasks.length*100)+'%;background:'+color+'"></div>';c.appendChild(bar);
  const lbl=document.createElement('div');lbl.style.cssText='font-size:9px;color:var(--tmut);text-align:center;margin-top:3px';lbl.textContent=done+'/'+tasks.length+' done today';c.appendChild(lbl);
}

// VMK DAILIES
renderDaily('vmk-daily',['Log in and check mail','Play Pirates of the Caribbean','Play Jungle Cruise','Play Haunted Mansion','Play Fireworks','Visit your room — check guests','Check trading posts for rare items','Talk to friends / make new ones','Explore for any new items or events','Screenshot any cool rooms for inspo'],'wh_vmk_daily','#1a3a6b');

// TOONTOWN DAILIES
renderDaily('tt-daily',['Log in and check mailbox','Do a boss run (VP/CFO/CJ/CEO)','Complete a toontask','Train a gag track','Race at Goofy Speedway','Play a round of golf','Visit a friend\'s estate','Check Clarabelle\'s Cattlelog','Garden your estate','Go fishing','Earn jellybeans for clothes','Try a new playground area'],'wh_tt_daily','#e07b10');

// CLUB PENGUIN DAILIES
renderDaily('cp-daily',['Log in and check mail','Earn coins (play 2-3 minigames)','Visit the Dance Club','Check the Gift Shop for new items','Feed your puffles','Visit your igloo — decorate if inspired','Find the secret agent message (if EPF)','Check the Newspaper for events','Play Cart Surfer (best coin game!)','Explore for hidden pins','Visit a friend\'s igloo'],'wh_cp_daily','#1a5fa0');

// OSRS DAILIES
renderDaily('osrs-daily',['Collect daily battlestaff (Varrock diary)','Buy daily runes from shops','Farm run (herbs + trees)','Birdhouse run','Kingdom of Miscellania upkeep','Daily sand + seaweed','Claim daily spin','Check GE offers','Tears of Guthix (weekly)','Complete a Slayer task','Do a clue scroll if you have one'],'wh_osrs_daily','#7b5e00');

// ===== OSRS SKILLS =====
const OSRS_SKILLS=['Attack','Strength','Defence','Ranged','Prayer','Magic','Runecrafting','Construction','Hitpoints','Agility','Herblore','Thieving','Crafting','Fletching','Slayer','Hunter','Mining','Smithing','Fishing','Cooking','Firemaking','Woodcutting','Farming'];
function renderSkills(){
  const c=document.getElementById('osrs-skills');if(!c)return;c.innerHTML='';
  const d=ls('wh_osrs_levels',{});
  OSRS_SKILLS.forEach(s=>{const l=d[s]||1;const r=document.createElement('div');r.className='skill-row';r.innerHTML='<span style="font-weight:600;min-width:90px">'+s+'</span><div style="flex:1;height:6px;background:rgba(123,94,0,.1);border-radius:3px;overflow:hidden;margin:0 8px"><div style="height:100%;width:'+(l/99*100)+'%;background:#7b5e00;border-radius:3px"></div></div><input class="oi-inp" type="number" min="1" max="99" value="'+l+'" onchange="saveSk(\''+s+'\',this.value)">';c.appendChild(r)});
  const total=OSRS_SKILLS.reduce((a,s)=>a+(d[s]||1),0);
  const t=document.createElement('div');t.style.cssText='display:flex;justify-content:space-between;padding:6px 0;font-size:11px;font-weight:700;color:#7b5e00;border-top:2px solid rgba(123,94,0,.2);margin-top:4px';t.innerHTML='<span>Total level</span><span>'+total+' / '+OSRS_SKILLS.length*99+'</span>';c.appendChild(t);
}
window.saveSk=(s,v)=>{const d=ls('wh_osrs_levels',{});d[s]=Math.min(99,Math.max(1,parseInt(v)||1));ss('wh_osrs_levels',d)};
renderSkills();

// ===== TIPS =====
function renderTips(cid,tips){const c=document.getElementById(cid);if(!c)return;tips.forEach(t=>{const e=document.createElement('div');e.className='tip-card';e.innerHTML='<span class="tip-icon">'+(t.icon||'💡')+'</span><div><div style="font-weight:600">'+t.tip+'</div>'+(t.detail?'<div style="font-size:9px;color:var(--tmut);margin-top:2px">'+t.detail+'</div>':'')+'</div>';c.appendChild(e)})}

renderTips('vmk-tips',[
  {icon:'🏰',tip:'Play Pirates of the Caribbean for credits',detail:'Best credit-per-minute game. Get good at the cannon timing.'},
  {icon:'🎯',tip:'Check trading posts daily',detail:'Rare items rotate. Some are worth a ton if you hold onto them.'},
  {icon:'🏠',tip:'Visit other people\'s rooms for decoration ideas',detail:'The community builds incredible rooms — screenshot for inspo.'},
  {icon:'💬',tip:'Be active in chat to make friends',detail:'The community is small and tight — regulars remember each other.'}
]);

renderTips('rblx-tips',[
  {icon:'🎮',tip:'Try games with 1K-50K players for hidden gems',detail:'The most popular games aren\'t always the best. Mid-range player counts often have great communities.'},
  {icon:'💰',tip:'Don\'t spend Robux on limited items early',detail:'Learn the economy first. Some limiteds appreciate, most don\'t.'},
  {icon:'👤',tip:'Use free avatar items from events',detail:'Roblox runs events constantly that give free items — check the Avatar Shop events tab.'}
]);

renderTips('tt-tips',[
  {icon:'🎯',tip:'Train Lure and Sound early',detail:'These are the hardest gag tracks but most important for boss battles.'},
  {icon:'🏎️',tip:'Goofy Speedway is the best jellybean source',detail:'Win races consistently and you\'ll have more jellybeans than you can spend.'},
  {icon:'🐭',tip:'Do toontasks in order — don\'t skip ahead',detail:'Each playground\'s tasks unlock the next area. Rushing leads to being underleveled.'},
  {icon:'👥',tip:'Join a group for boss runs',detail:'VP, CFO, CJ, CEO are group content. Having regular friends makes it way easier.'},
  {icon:'🌱',tip:'Garden your estate for gag XP boosts',detail:'Planting and watering flowers gives organic gag bonuses — very worth it.'},
  {icon:'⛳',tip:'Golf gives laff points',detail:'Completing golf courses awards permanent laff boosts. Easy way to get tankier.'}
]);

renderTips('cp-tips',[
  {icon:'💰',tip:'Cart Surfer is the best coin earner',detail:'Learn the flip + grind combo (backflip then grind on landing) for max coins per run.'},
  {icon:'🐧',tip:'Become an EPF agent ASAP',detail:'Go to the Everyday Phoning Facility. The spy missions are some of the best content in the game.'},
  {icon:'🏠',tip:'Igloo contests happen regularly',detail:'Decorate your igloo and submit it — winners get special items.'},
  {icon:'🎉',tip:'Check the Town for parties',detail:'Player-run parties happen in specific servers. Check the community discord for schedules.'},
  {icon:'📰',tip:'Read the Newspaper every issue',detail:'Hidden hints about upcoming events, new items, and secret rooms are in the Penguin Times.'}
]);

renderTips('osrs-tips',[
  {icon:'🗡️',tip:'Do Waterfall Quest first',detail:'Gives you enough XP to jump from level 1 to 30 Attack and Strength instantly. Massive head start.'},
  {icon:'📜',tip:'Quest early and often',detail:'Quests give the best XP and unlock areas, items, and training methods. Way better than grinding.'},
  {icon:'💰',tip:'Start farming runs ASAP',detail:'Even at low levels, herb runs make 100k+ per run with minimal time invested.'},
  {icon:'🏹',tip:'Train Ranged with a cannon at multi-combat areas',detail:'Expensive but the fastest combat XP in the game. Great for Slayer tasks too.'},
  {icon:'⛏️',tip:'Motherlode Mine for AFK Mining',detail:'Unlocks at 30 Mining. You can watch Netflix while mining. Gives nuggets for Prospector outfit.'},
  {icon:'🎣',tip:'Barbarian Fishing for free Agility + Strength XP',detail:'At level 48 Fishing you can catch leaping fish that also train Agility and Strength. 3-for-1.'},
  {icon:'🏃',tip:'Agility is painful but important',detail:'Higher Agility = faster run energy restore. Do Rooftop Courses for Marks of Grace (Graceful outfit).'},
  {icon:'🔑',tip:'Get the Quest Cape as a long-term goal',detail:'Completing all quests is the most rewarding achievement. It opens up everything.'}
]);

// ===== INIT ALL LISTS =====
const ALL=[['vmk-mg','wh_vmk_mg'],['vmk-fr','wh_vmk_fr'],['vmk-cl','wh_vmk_cl'],['vmk-clw','wh_vmk_clw'],['vmk-fu','wh_vmk_fu'],['vmk-fuw','wh_vmk_fuw'],['babv-bears','wh_babv_bears'],['babv-fr','wh_babv_fr'],['rblx-fav','wh_roblox_faves'],['rblx-try','wh_roblox_try'],['rblx-fr','wh_rblx_fr'],['tt-toons','wh_tt_toons'],['tt-gags','wh_tt_gags'],['tt-fr','wh_tt_fr'],['tt-karts','wh_tt_karts'],['tt-golf','wh_tt_golf'],['tt-cl','wh_tt_cl'],['tt-clw','wh_tt_clw'],['tt-fu','wh_tt_fu'],['tt-fuw','wh_tt_fuw'],['cp-fr','wh_cp_fr'],['cp-mg','wh_cp_mg'],['cp-ev','wh_cp_ev'],['cp-cl','wh_cp_cl'],['cp-clw','wh_cp_clw'],['cp-fu','wh_cp_fu'],['cp-fuw','wh_cp_fuw'],['osrs-goals','wh_osrs_goals'],['osrs-money','wh_osrs_money'],['osrs-quests','wh_osrs_quests'],['osrs-items','wh_osrs_items'],['osrs-fr','wh_osrs_fr']];
ALL.forEach(([c,k])=>oR(c,k));
['vmk-notes/wh_vmk_notes','babv-mem/wh_babv_memories','rblx-av/wh_roblox_avatar','tt-notes/wh_tt_notes','cp-pen/wh_cp_pen','cp-notes/wh_cp_notes','osrs-notes/wh_osrs_notes'].forEach(p=>{const[id,key]=p.split('/');oL(id,key)});
