renderNav('hobbies');

// Lists
function gRender(c,k){const el=document.getElementById(c);if(!el)return;const items=ls(k,[]);el.innerHTML='';if(!items.length){el.innerHTML='<div style="text-align:center;padding:.5rem;color:var(--tmut);font-size:10px;font-style:italic;opacity:.7">Nothing yet</div>';return}items.forEach((t,i)=>{const txt=typeof t==='string'?t:t.text||'';const e=document.createElement('div');e.className='gi';e.innerHTML='<span style="flex:1">'+txt+'</span><button class="gi-del" onclick="gDel(\''+c+'\',\''+k+'\','+i+')">×</button>';el.appendChild(e)})}
window.gAdd=(c,iid,k)=>{const inp=document.getElementById(iid);if(!inp)return;const v=inp.value.trim();if(!v)return;const items=ls(k,[]);items.push(v);ss(k,items);inp.value='';gRender(c,k)};
window.gDel=(c,k,i)=>{const items=ls(k,[]);items.splice(i,1);ss(k,items);gRender(c,k)};
gRender('garden-wish','wh_garden_wishlist');gRender('garden-supplies','wh_garden_supplies');

// Plants
let plants=ls('wh_garden_plants',[]);
function renderPlants(){const c=document.getElementById('plant-list');if(!c)return;c.innerHTML='';if(!plants.length){c.innerHTML='<div style="text-align:center;padding:.8rem;color:var(--tmut);font-size:10px;font-style:italic">No plants yet — start your garden!</div>';return}
plants.forEach((p,i)=>{const e=document.createElement('div');e.className='plant-card';e.innerHTML='<div style="display:flex;justify-content:space-between;align-items:flex-start"><div><span style="font-weight:700;color:#4A6FA5">'+p.name+'</span> <span style="font-size:9px;padding:1px 6px;border-radius:20px;background:#E4EDFA;color:#4A6FA5">'+p.type+'</span></div><button class="gi-del" onclick="delPlant('+i+')">×</button></div>'+(p.notes?'<div style="font-size:9px;color:var(--tmut);margin-top:3px;font-style:italic">'+p.notes+'</div>':'');c.appendChild(e)})}
window.addPlant=()=>{const n=document.getElementById('plant-name').value.trim();if(!n)return;plants.push({name:n,type:document.getElementById('plant-type').value,notes:document.getElementById('plant-notes').value.trim()});ss('wh_garden_plants',plants);document.getElementById('plant-name').value='';document.getElementById('plant-notes').value='';renderPlants()};
window.delPlant=i=>{plants.splice(i,1);ss('wh_garden_plants',plants);renderPlants()};
renderPlants();

// Beginner guide
[{t:'Start small — 3-5 plants max',d:'Don\'t overwhelm yourself. Herbs are perfect starters (basil, mint, rosemary).'},{t:'Know your zone',d:'You\'re in Arkansas, USDA Zone 7b/8a. This tells you what grows when.'},{t:'Sunlight is everything',d:'Most veggies need 6-8 hours of direct sun. Observe your space before planting.'},{t:'Water consistently, not constantly',d:'Most plants prefer deep watering 2-3x/week over daily sprinkles.'},{t:'Good soil = good plants',d:'Buy quality potting mix for containers. Amend garden soil with compost.'},{t:'Read the plant tag',d:'It tells you sun needs, spacing, water frequency, and when to plant. Trust the tag.'},{t:'Container gardening is valid',d:'No yard? No problem. Most things grow great in pots on a patio or balcony.'},{t:'Don\'t be afraid of failure',d:'Every gardener kills plants. It\'s how you learn. The plant store will have more.'}].forEach(tip=>{const e=document.createElement('div');e.className='tip-card';e.innerHTML='<span style="font-size:14px;flex-shrink:0">🌿</span><div><div style="font-weight:600">'+tip.t+'</div><div style="font-size:9px;color:var(--tmut);margin-top:1px">'+tip.d+'</div></div>';document.getElementById('beginner-guide').appendChild(e)});

// Seasonal
[{season:'🌸 Spring (Mar-May)',plants:'Tomatoes, peppers, herbs, squash, beans, cucumbers. Start seeds indoors in March, transplant after last frost (~April 10).'},{season:'☀️ Summer (Jun-Aug)',plants:'Keep watering! Harvest tomatoes, squash, herbs. Plant fall crops in late July: beans, cucumbers for fall harvest.'},{season:'🍂 Fall (Sep-Nov)',plants:'Lettuce, spinach, kale, broccoli, carrots, radishes. These love cool weather. Plant by mid-September.'},{season:'❄️ Winter (Dec-Feb)',plants:'Plan next year! Order seeds in January. Start indoor herbs. Clean and prep tools. Dream big.'}].forEach(s=>{const e=document.createElement('div');e.style.cssText='padding:8px 10px;background:white;border:1px solid rgba(58,140,78,.1);border-radius:8px;margin-bottom:5px;font-size:11px';e.innerHTML='<div style="font-weight:700;color:#4A6FA5;margin-bottom:3px">'+s.season+'</div><div style="line-height:1.5">'+s.plants+'</div>';document.getElementById('seasonal').appendChild(e)});

// Load text areas
document.getElementById('garden-journal').value=ls('wh_garden_journal','')||'';
document.getElementById('garden-notes').value=ls('wh_garden_notes','')||'';
