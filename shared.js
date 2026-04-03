/* ========================================================
   WEIRD GIRL LIFE DASHBOARD — Shared JavaScript
   Firebase + localStorage hybrid — bulletproof data layer
   
   HOW IT WORKS:
   - On page load: reads from localStorage IMMEDIATELY (instant render)
   - Firebase loads in background, syncs cache
   - ss() writes to BOTH localStorage AND Firebase
   - On next page load on ANY device: Firebase data loads fresh
   - Real-time sync: other device changes trigger page reload
   ======================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAvFNZ3U2EZ7yu-cDTaSiFkCUXpMVZ5iVM",
  authDomain: "weird-girl-dashboard.firebaseapp.com",
  databaseURL: "https://weird-girl-dashboard-default-rtdb.firebaseio.com",
  projectId: "weird-girl-dashboard",
  storageBucket: "weird-girl-dashboard.firebasestorage.app",
  messagingSenderId: "847433347186",
  appId: "1:847433347186:web:cd50a16dc2fd29793a52eb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const provider = new GoogleAuthProvider();

let _uid = null;
let _firebaseLoaded = false;
let _weAreSaving = false;

// ============ STORAGE API ============
// ls() ALWAYS reads from localStorage first (instant, works offline)
// When Firebase loads, it pushes fresh data INTO localStorage
// This means pages render immediately and stay up to date

window.ls = function(k, d) {
  try {
    const raw = localStorage.getItem(k);
    if (raw !== null) return JSON.parse(raw);
    return d;
  } catch { return d; }
};

window.ss = function(k, v) {
  // Always save to localStorage (instant, works offline)
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
  // Also save to Firebase (syncs to cloud)
  firebaseSave();
};

// ============ FIREBASE SAVE ============
// Only saves keys that belong to our dashboard (not browser/auth junk)
function isDashboardKey(key) {
  // All our dashboard key prefixes
  if (key.startsWith('wg_') || key.startsWith('wh_') || key.startsWith('wgh') || 
      key.startsWith('wgc') || key.startsWith('sv_') || key.startsWith('bb_') ||
      key.startsWith('wg_fc') || key.startsWith('wgh2_') || key.startsWith('wgc_')) return true;
  // Standalone keys used by various pages
  if (['wg_groceries','wg_beautygoals','wg_gratitude'].includes(key)) return true;
  return false;
}

let _saveTimer = null;
function firebaseSave() {
  if (!_uid) return;
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    const allData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!isDashboardKey(key)) continue;
      try { allData[key] = JSON.parse(localStorage.getItem(key)); } 
      catch { allData[key] = localStorage.getItem(key); }
    }
    _weAreSaving = true;
    set(ref(database, 'users/' + _uid), allData)
      .then(() => { 
        setTimeout(() => { _weAreSaving = false; }, 2000);
        showSyncStatus('✅ Synced');
      })
      .catch(e => { 
        console.error('Firebase save error:', e);
        showSyncStatus('❌ Sync failed');
        _weAreSaving = false; 
      });
  }, 800);
}

// Tiny sync indicator so you can SEE when saves happen
function showSyncStatus(msg) {
  let el = document.getElementById('wg-sync-status');
  if (!el) {
    el = document.createElement('div');
    el.id = 'wg-sync-status';
    el.style.cssText = 'position:fixed;bottom:8px;right:8px;font-size:9px;padding:3px 8px;background:white;border:1px solid rgba(0,0,0,.1);border-radius:12px;z-index:9998;font-family:DM Sans,sans-serif;color:#666;opacity:0;transition:opacity .3s';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  setTimeout(() => { el.style.opacity = '0'; }, 2000);
}

// ============ FIREBASE LOAD ============
function firebaseLoadIntoLocalStorage(data) {
  if (!data) return;
  let count = 0;
  Object.keys(data).forEach(k => {
    try { localStorage.setItem(k, JSON.stringify(data[k])); count++; } catch {}
  });
  console.log('Firebase loaded ' + count + ' keys');
}

// ============ AUTH ============
function showLogin() {
  if (document.getElementById('login-overlay')) return;
  const o = document.createElement('div');
  o.id = 'login-overlay';
  o.style.cssText = 'position:fixed;inset:0;background:#fdf6f0;z-index:9999;display:flex;align-items:center;justify-content:center;font-family:"DM Sans",sans-serif';
  o.innerHTML = '<div style="text-align:center;max-width:360px;padding:2rem">' +
    '<div style="font-size:3rem;margin-bottom:1rem">✨</div>' +
    '<div style="font-family:Playfair Display,serif;font-size:1.8rem;font-weight:700;color:#7b241c;margin-bottom:.5rem">Weird Girl Dashboard</div>' +
    '<div style="font-size:11px;color:#6b3a3a;margin-bottom:1.5rem;line-height:1.6">Sign in to sync your data across all your devices</div>' +
    '<button id="g-sign-in" style="display:inline-flex;align-items:center;gap:10px;padding:12px 24px;background:white;border:2px solid rgba(192,57,43,.15);border-radius:12px;font-size:13px;font-family:DM Sans,sans-serif;font-weight:600;color:#1a0a0a;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.08)">🔐 Sign in with Google</button>' +
    '<div style="font-size:9px;color:#6b3a3a;margin-top:1rem;opacity:.6">Your data is private — only you can access it</div>' +
    '</div>';
  document.body.appendChild(o);
  document.getElementById('g-sign-in').onclick = () => {
    signInWithPopup(auth, provider).catch(e => alert('Sign in failed: ' + e.message));
  };
}

function hideLogin() {
  const o = document.getElementById('login-overlay');
  if (o) o.remove();
}

function addSignOutBtn(user) {
  document.querySelectorAll('.sign-out-btn').forEach(el => el.remove());
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  const btn = document.createElement('button');
  btn.className = 'nav-btn sign-out-btn';
  btn.style.cssText = 'margin-left:auto;font-size:9px;opacity:.7';
  btn.textContent = '👋 ' + (user.displayName || 'Sign out').split(' ')[0];
  btn.title = 'Click to sign out';
  btn.onclick = () => { if (confirm('Sign out?')) signOut(auth); };
  nav.appendChild(btn);
}

// ============ AUTH STATE ============
onAuthStateChanged(auth, async (user) => {
  if (user) {
    _uid = user.uid;
    hideLogin();
    addSignOutBtn(user);
    
    // Load Firebase data INTO localStorage (merges with existing)
    try {
      const snapshot = await get(ref(database, 'users/' + _uid));
      if (snapshot.exists()) {
        firebaseLoadIntoLocalStorage(snapshot.val());
        _firebaseLoaded = true;
        // Reload page ONCE to re-render with fresh Firebase data
        // sessionStorage clears when tab closes, so next visit pulls fresh
        const reloadKey = 'wg_synced';
        if (!sessionStorage.getItem(reloadKey)) {
          sessionStorage.setItem(reloadKey, '1');
          window.location.reload();
          return;
        }
      } else {
        // First time Firebase user — push localStorage UP to Firebase
        _firebaseLoaded = true;
        firebaseSave();
      }
    } catch (err) {
      console.error('Firebase load error:', err);
    }
    
    // Start real-time listener for cross-device sync
    startRealtimeSync();
    
  } else {
    _uid = null;
    _firebaseLoaded = false;
    showLogin();
  }
});

// ============ REAL-TIME SYNC ============
let _firstSync = true;
function startRealtimeSync() {
  if (!_uid) return;
  _firstSync = true;
  
  onValue(ref(database, 'users/' + _uid), (snapshot) => {
    // Skip the first callback (it's our own initial load)
    if (_firstSync) { _firstSync = false; return; }
    // Skip if WE just saved (prevent reload loop)
    if (_weAreSaving) return;
    
    // Another device saved — update localStorage and reload
    if (snapshot.exists()) {
      firebaseLoadIntoLocalStorage(snapshot.val());
      // Reload the page to show updated data
      window.location.reload();
    }
  });
}

// ============ UTILITIES ============
window.todayKey = function() { return new Date().toISOString().split('T')[0]; };
window.fmtDate = function(k) { if (!k) return ''; const p = k.split('-'); return new Date(+p[0],+p[1]-1,+p[2]).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); };
window.fmtShort = function(k) { if (!k) return ''; const p = k.split('-'); return new Date(+p[0],+p[1]-1,+p[2]).toLocaleDateString('en-US',{month:'short',day:'numeric'}); };
window.nowStr = function() { return new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}); };
window.tAgo = function(ts) {
  const d = Date.now()-ts, m = Math.floor(d/60000), h = Math.floor(d/3600000), dy = Math.floor(d/86400000);
  if (m<60) return m+'m ago'; if (h<24) return h+'h ago'; if (dy===1) return 'yesterday'; if (dy<7) return dy+'d ago';
  if (dy<30) return Math.floor(dy/7)+'w ago'; return Math.floor(dy/30)+'mo ago';
};

// ============ SHARED STORAGE KEYS ============
window.K = {
  goals:'wg_g8',decay:'wg_d8',backlog:'wg_bl8',done:'wg_dn8',ob:'wg_ob8',
  energy:'wg_en8',hourly:'wg_hr8',content:'wg_ct8',movies:'wg_mv8',
  income:'wg_ic8',wishlist:'wg_wl8',books:'wg_bk8',chess:'wg_ch8',
  rituals:'wg_rt8',treatments:'wg_tr8',outfits:'wg_of8',recipes:'wg_rc8',
  vibes:'wg_vb8',letters:'wg_lt8'
};

// ============ DONE LIST ============
window.getDoneItems = function() { return ls(K.done, []); };
window.addDone = function(text) {
  if (!text || !text.trim()) return;
  const items = ls(K.done, []);
  items.unshift({text: text.trim(), ts: Date.now()});
  ss(K.done, items);
};

// ============ NAV ============
const NAV_ITEMS = [
  {id:'home',label:'🏠 Home',href:'index.html'},
  {id:'energy',label:'⚡ Energy',href:'energy.html'},
  {id:'calendar',label:'📅 Calendar',href:'calendar.html'},
  {id:'barbie',label:'🎀 Barbie',href:'barbie.html',cls:'barbie-btn'},
  {id:'learning',label:'🧠 Learning',href:'learning-hub.html',cls:'learn-btn'},
  {id:'money',label:'💰 Money',href:'money.html'},
  {id:'health',label:'🩺 Health',href:'health.html',cls:'health-btn'},
  {id:'vibes',label:'🌙 Vibes',href:'vibes.html'},
  {id:'hobbies',label:'✨ Hobbies',href:'hobbies.html',cls:'hobbies-btn'},
];

window.renderNav = function(activeId) {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  nav.innerHTML = '';
  NAV_ITEMS.forEach(item => {
    const a = document.createElement('a');
    a.href = item.href;
    a.className = 'nav-btn ' + (item.cls||'') + (item.id===activeId?' active':'');
    a.textContent = item.label;
    nav.appendChild(a);
  });
};

window.onDashboardReady = function(callback) {
  if (_firebaseLoaded) callback();
  else setTimeout(() => callback(), 2000); // fallback timeout
};
