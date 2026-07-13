renderNav('home');

const MK = 'wg_manifestations';
let manis = ls(MK, []);
let currentPlanId = null;

// ===== RENDER BOARD =====
function renderBoard() {
  const grid = document.getElementById('mani-grid');
  const countEl = document.getElementById('mani-count');
  const progressEl = document.getElementById('mani-progress-total');
  grid.innerHTML = '';

  if (!manis.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--tmut);font-size:11px;font-style:italic">Your manifestation board is empty. What does your dream 2026 look like?</div>';
    countEl.textContent = '';
    progressEl.textContent = '';
    return;
  }

  countEl.textContent = manis.length + ' manifestation' + (manis.length !== 1 ? 's' : '');

  let totalSteps = 0, doneSteps = 0;
  manis.forEach(m => {
    if (m.steps) { totalSteps += m.steps.length; doneSteps += m.steps.filter(s => s.done).length; }
  });
  progressEl.textContent = totalSteps ? doneSteps + '/' + totalSteps + ' steps complete' : '';

  manis.forEach((m, i) => {
    const card = document.createElement('div');
    card.className = 'mani-card';

    const stepCount = m.steps ? m.steps.length : 0;
    const stepDone = m.steps ? m.steps.filter(s => s.done).length : 0;
    const pct = stepCount ? Math.round(stepDone / stepCount * 100) : 0;
    const hasPlan = stepCount > 0;

    card.innerHTML = `
      <button class="mani-plan-btn ${hasPlan ? 'has-plan' : ''}" onclick="event.stopPropagation();openPlan(${i})" title="Plan steps">${hasPlan ? stepDone + '/' + stepCount : '+'}</button>
      <div class="mani-text">${m.text}</div>
      ${hasPlan ? '<div class="mani-progress"><div class="mani-progress-fill" style="width:' + pct + '%"></div></div>' : ''}
      <div class="mani-date">${m.date || ''}</div>
      <button class="mani-del" onclick="event.stopPropagation();delMani(${i})">remove</button>
    `;
    grid.appendChild(card);
  });
}

// ===== ADD =====
window.openAddModal = () => {
  document.getElementById('add-modal').classList.add('open');
  document.getElementById('new-mani-inp').value = '';
  setTimeout(() => document.getElementById('new-mani-inp').focus(), 100);
};
window.closeAddModal = () => document.getElementById('add-modal').classList.remove('open');
document.getElementById('add-modal').onclick = e => { if (e.target.id === 'add-modal') closeAddModal(); };

window.addManifestation = () => {
  const inp = document.getElementById('new-mani-inp');
  const text = inp.value.trim();
  if (!text) return;
  manis.push({ text, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), steps: [], notes: '' });
  ss(MK, manis);
  inp.value = '';
  closeAddModal();
  renderBoard();
};
document.getElementById('new-mani-inp').onkeydown = e => { if (e.key === 'Enter') addManifestation(); };

window.delMani = i => {
  if (!confirm('Remove this manifestation?')) return;
  manis.splice(i, 1);
  ss(MK, manis);
  renderBoard();
};

// ===== PLAN VIEW =====
window.openPlan = i => {
  currentPlanId = i;
  const m = manis[i];
  document.getElementById('board-view').style.display = 'none';
  document.getElementById('plan-view').classList.add('active');
  document.getElementById('plan-title').textContent = m.text;
  document.getElementById('plan-notes-area').value = m.notes || '';
  renderPlanSteps();
  setTimeout(() => document.getElementById('plan-step-inp').focus(), 100);
};

window.showBoard = () => {
  currentPlanId = null;
  document.getElementById('plan-view').classList.remove('active');
  document.getElementById('board-view').style.display = '';
  renderBoard();
};

function renderPlanSteps() {
  const c = document.getElementById('plan-steps');
  c.innerHTML = '';
  const m = manis[currentPlanId];
  if (!m || !m.steps) return;

  if (!m.steps.length) {
    c.innerHTML = '<div style="text-align:center;padding:1rem;color:var(--tmut);font-size:10px;font-style:italic">No steps yet — break this dream into actionable pieces!</div>';
    return;
  }

  m.steps.forEach((step, si) => {
    const e = document.createElement('div');
    e.className = 'plan-step' + (step.done ? ' done' : '');
    e.innerHTML = `
      <div class="plan-cb ${step.done ? 'checked' : ''}" onclick="toggleStep(${si})">${step.done ? '✓' : ''}</div>
      <span class="plan-step-text ${step.done ? 'crossed' : ''}">${step.text}</span>
      <button class="plan-step-del" onclick="delStep(${si})">x</button>
    `;
    c.appendChild(e);
  });
}

window.addPlanStep = () => {
  const inp = document.getElementById('plan-step-inp');
  const text = inp.value.trim();
  if (!text || currentPlanId === null) return;
  if (!manis[currentPlanId].steps) manis[currentPlanId].steps = [];
  manis[currentPlanId].steps.push({ text, done: false });
  ss(MK, manis);
  inp.value = '';
  renderPlanSteps();
};
document.getElementById('plan-step-inp').onkeydown = e => { if (e.key === 'Enter') addPlanStep(); };

window.toggleStep = si => {
  if (currentPlanId === null) return;
  manis[currentPlanId].steps[si].done = !manis[currentPlanId].steps[si].done;
  ss(MK, manis);
  renderPlanSteps();
};

window.delStep = si => {
  if (currentPlanId === null) return;
  manis[currentPlanId].steps.splice(si, 1);
  ss(MK, manis);
  renderPlanSteps();
};

window.savePlanNotes = () => {
  if (currentPlanId === null) return;
  manis[currentPlanId].notes = document.getElementById('plan-notes-area').value;
  ss(MK, manis);
};

// INIT
renderBoard();
