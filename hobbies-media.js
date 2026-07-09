renderNav('hobbies');
window.goMD=id=>{document.querySelectorAll('.md-page').forEach(p=>p.classList.remove('active'));document.querySelectorAll('.md-btn').forEach(b=>b.classList.remove('active'));document.getElementById('md-'+id).classList.add('active');document.querySelector('.md-btn[onclick="goMD(\''+id+'\')"]').classList.add('active');window.scrollTo(0,0)};
function mR(c,k){const el=document.getElementById(c);if(!el)return;const items=ls(k,[]);el.innerHTML='';if(!items.length){el.innerHTML='<div style="text-align:center;padding:.5rem;color:var(--tmut);font-size:10px;font-style:italic;opacity:.7">Nothing yet</div>';return}items.forEach((t,i)=>{const txt=typeof t==='string'?t:t.text||'';const e=document.createElement('div');e.className='mi';e.innerHTML='<span style="flex:1">'+txt+'</span><button class="mi-del" onclick="mD(\''+c+'\',\''+k+'\','+i+')">×</button>';el.appendChild(e)})}
window.mA=(c,iid,k)=>{const inp=document.getElementById(iid);if(!inp)return;const v=inp.value.trim();if(!v)return;const items=ls(k,[]);items.push(v);ss(k,items);inp.value='';mR(c,k)};
window.mD=(c,k,i)=>{const items=ls(k,[]);items.splice(i,1);ss(k,items);mR(c,k)};

// Film journal
let filmJ=ls('wh_film_journal',[]);
function renderFJ(){const c=document.getElementById('film-journal');if(!c)return;c.innerHTML='';if(!filmJ.length){c.innerHTML='<div style="text-align:center;padding:.5rem;color:var(--tmut);font-size:10px;font-style:italic">No entries yet — watch something and write about it!</div>';return}
filmJ.forEach((e,i)=>{const d=document.createElement('div');d.style.cssText='padding:8px 10px;background:white;border:1px solid rgba(0,0,0,.06);border-radius:8px;margin-bottom:5px;position:relative';d.innerHTML='<div style="font-weight:700;font-size:12px;color:#2c3e50">'+e.title+'</div><div style="font-size:9px;color:var(--tmut);margin:2px 0">'+(e.date||'')+'</div><div style="font-size:10px;line-height:1.5">'+e.entry+'</div><button class="mi-del" style="position:absolute;top:6px;right:6px" onclick="delFJ('+i+')">×</button>';c.appendChild(d)})}
window.addFilmJournal=()=>{const t=document.getElementById('fj-title').value.trim();const e=document.getElementById('fj-entry').value.trim();if(!t)return;filmJ.unshift({title:t,entry:e,date:new Date().toLocaleDateString()});ss('wh_film_journal',filmJ);document.getElementById('fj-title').value='';document.getElementById('fj-entry').value='';renderFJ()};
window.delFJ=i=>{filmJ.splice(i,1);ss('wh_film_journal',filmJ);renderFJ()};
renderFJ();

// Book journal
let bookJ=ls('wh_book_journal',[]);
function renderBJ(){const c=document.getElementById('book-journal');if(!c)return;c.innerHTML='';if(!bookJ.length){c.innerHTML='<div style="text-align:center;padding:.5rem;color:var(--tmut);font-size:10px;font-style:italic">No entries yet</div>';return}
bookJ.forEach((e,i)=>{const d=document.createElement('div');d.style.cssText='padding:8px 10px;background:white;border:1px solid rgba(0,0,0,.06);border-radius:8px;margin-bottom:5px;position:relative';d.innerHTML='<div style="font-weight:700;font-size:12px;color:#795548">'+e.title+'</div><div style="font-size:9px;color:var(--tmut);margin:2px 0">'+(e.date||'')+'</div><div style="font-size:10px;line-height:1.5">'+e.entry+'</div><button class="mi-del" style="position:absolute;top:6px;right:6px" onclick="delBJ('+i+')">×</button>';c.appendChild(d)})}
window.addBookJournal=()=>{const t=document.getElementById('bj-title').value.trim();const e=document.getElementById('bj-entry').value.trim();if(!t)return;bookJ.unshift({title:t,entry:e,date:new Date().toLocaleDateString()});ss('wh_book_journal',bookJ);document.getElementById('bj-title').value='';document.getElementById('bj-entry').value='';renderBJ()};
window.delBJ=i=>{bookJ.splice(i,1);ss('wh_book_journal',bookJ);renderBJ()};
renderBJ();

const ALL=[['mv-watchlist','wh_movies_watchlist'],['mv-faves','wh_movies_faves'],['mv-horror','wh_movies_horror'],['mv-comfort','wh_movies_comfort'],['mv-analyse','wh_movies_analyse'],['mv-cult','wh_movies_cult'],['bk-current','wh_books_current'],['bk-tbr','wh_books_tbr'],['bk-faves','wh_books_faves'],['bk-horror','wh_books_horror'],['bk-comfort','wh_books_comfort'],['bk-nonfic','wh_books_nonfic']];
ALL.forEach(([c,k])=>mR(c,k));
