const state = loadState();
const phaseNav = document.getElementById('phaseNav');
const phasesContainer = document.getElementById('phasesContainer');
const teacherCodeEl = document.getElementById('teacherCode');
const globalProgressText = document.getElementById('globalProgressText');

teacherCodeEl.textContent = TEACHER_CODE;

renderNav();
renderPhases();
updateGlobalProgress();
updateCertificate();
initGlobalActions();

function defaultState() {
  return {
    completedPhases: {},
    practices: {},
    maps: {},
    tests: {}
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateGlobalProgress();
  updateCertificate();
  renderNav();
}

function renderNav() {
  phaseNav.innerHTML = '';
  PHASES.forEach(phase => {
    const a = document.createElement('a');
    a.href = `#${phase.id}`;
    a.className = `phase-link ${state.completedPhases[phase.id] ? 'done' : ''}`;
    a.innerHTML = `<strong>Fase ${phase.number}</strong><span>${phase.title}</span>`;
    a.addEventListener('click', () => setTimeout(highlightActiveNav, 100));
    phaseNav.appendChild(a);
  });
  highlightActiveNav();
}

function highlightActiveNav() {
  const links = [...document.querySelectorAll('.phase-link')];
  const sections = [...document.querySelectorAll('.phase-section')];
  const scroll = window.scrollY + 120;
  let activeId = sections[0]?.id;
  sections.forEach(section => {
    if (section.offsetTop <= scroll) activeId = section.id;
  });
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
  });
}

window.addEventListener('scroll', highlightActiveNav);

function renderPhases() {
  phasesContainer.innerHTML = '';
  PHASES.forEach(phase => {
    const tpl = document.getElementById('phaseTemplate').content.cloneNode(true);
    const section = tpl.querySelector('.phase-section');
    section.id = phase.id;
    tpl.querySelector('.phase-kicker').textContent = phase.subtitle;
    tpl.querySelector('h3').textContent = `Fase ${phase.number}. ${phase.title}`;
    const checkbox = tpl.querySelector('.phase-complete-checkbox');
    checkbox.checked = !!state.completedPhases[phase.id];
    checkbox.addEventListener('change', (e) => {
      state.completedPhases[phase.id] = e.target.checked;
      saveState();
    });

    const body = tpl.querySelector('.phase-body');

    const theoryGrid = document.createElement('div');
    theoryGrid.className = 'card-grid';
    phase.theory.forEach(item => {
      const card = document.createElement('article');
      card.className = 'content-card';
      card.innerHTML = `<h4>${item.title}</h4><p>${item.text}</p>`;
      theoryGrid.appendChild(card);
    });
    body.appendChild(theoryGrid);

    if (phase.badges) {
      const badgeCard = document.createElement('article');
      badgeCard.className = 'content-card';
      badgeCard.innerHTML = `<h4>Conceptos esenciales</h4><div class="badge-list">${phase.badges.map(b => `<span class="badge">${b}</span>`).join('')}</div>`;
      body.appendChild(badgeCard);
    }

    if (phase.map) {
      body.appendChild(renderMap(phase));
    }

    const practiceGrid = document.createElement('div');
    practiceGrid.className = 'card-grid';
    phase.practices.forEach(practice => practiceGrid.appendChild(renderPracticeCard(phase, practice)));
    body.appendChild(practiceGrid);

    if (phase.test) {
      body.appendChild(renderTestCard(phase));
    }

    phasesContainer.appendChild(tpl);
  });
}

function renderMap(phase) {
  const wrapper = document.createElement('article');
  wrapper.className = 'map-card';
  wrapper.innerHTML = `
    <h4>Mapa conceptual con huecos</h4>
    <p>Completa los campos siguiendo la lógica del esquema del tema. El contenido se guarda automáticamente.</p>
    <div class="map-layout"></div>
    <p class="map-note">Sugerencia didáctica: utiliza este apartado como actividad de inicio o de consolidación de la Fase 1.</p>
  `;
  const layout = wrapper.querySelector('.map-layout');
  const savedMap = state.maps[phase.id] || {};

  phase.map.columns.forEach((col, colIndex) => {
    const colEl = document.createElement('div');
    colEl.className = 'map-column';
    colEl.innerHTML = `<h5>${col.title}</h5>`;
    col.blanks.forEach((blank, blankIndex) => {
      const key = `${colIndex}_${blankIndex}`;
      const row = document.createElement('div');
      row.className = 'blank-row';
      row.innerHTML = `<label>${blank}</label><input type="text" value="${escapeHtml(savedMap[key] || '')}" placeholder="Escribe aquí" />`;
      const input = row.querySelector('input');
      input.addEventListener('input', (e) => {
        state.maps[phase.id] = state.maps[phase.id] || {};
        state.maps[phase.id][key] = e.target.value;
        saveState();
      });
      colEl.appendChild(row);
    });
    layout.appendChild(colEl);
  });
  return wrapper;
}

function renderPracticeCard(phase, practice) {
  const card = document.createElement('article');
  card.className = 'task-card';
  const practiceState = state.practices[practice.id] || { text: '', submitted: false, timestamp: null };
  card.innerHTML = `
    <h4>${practice.title}</h4>
    <p>${practice.prompt}</p>
    <textarea placeholder="Escribe tu respuesta o borrador aquí...">${escapeHtml(practiceState.text || '')}</textarea>
    <div class="inline-actions">
      <button class="primary-btn save-btn">Guardar</button>
      <button class="secondary-btn submit-btn">Registrar entrega</button>
      <span class="status-text ${getPracticeStatusClass(practiceState)}">${getPracticeStatusText(practiceState)}</span>
    </div>
  `;
  const textarea = card.querySelector('textarea');
  const saveBtn = card.querySelector('.save-btn');
  const submitBtn = card.querySelector('.submit-btn');
  const statusEl = card.querySelector('.status-text');

  const autoSave = () => {
    state.practices[practice.id] = { ...practiceState, text: textarea.value, submitted: practiceState.submitted, timestamp: practiceState.timestamp };
    saveState();
    statusEl.textContent = textarea.value.trim() ? 'Borrador guardado automáticamente' : 'Sin contenido todavía';
    statusEl.className = `status-text ${textarea.value.trim() ? 'saved' : 'empty'}`;
  };

  textarea.addEventListener('input', debounce(autoSave, 250));
  saveBtn.addEventListener('click', () => {
    autoSave();
  });
  submitBtn.addEventListener('click', () => {
    state.practices[practice.id] = {
      text: textarea.value,
      submitted: true,
      timestamp: new Date().toLocaleString('es-ES')
    };
    saveState();
    statusEl.textContent = `Entrega registrada · ${state.practices[practice.id].timestamp}`;
    statusEl.className = 'status-text saved';
  });
  return card;
}

function renderTestCard(phase) {
  const testId = phase.id;
  const wrapper = document.createElement('article');
  wrapper.className = 'test-card';
  wrapper.id = `${phase.id}-test`;

  const testState = state.tests[testId] || { attemptsUsed: 0, history: [], currentSet: null };
  wrapper.innerHTML = `
    <h4>Test de la fase</h4>
    <p>Este test permite <strong>dos intentos</strong>. En el segundo intento, al corregir, se mostrarán también las respuestas correctas. Se eligen 15 preguntas aleatorias y el orden cambia en cada ejecución.</p>
    <div class="quiz-summary">
      Intentos usados: <strong>${testState.attemptsUsed}</strong> / 2
      ${testState.history.length ? `<br>Última nota: <strong>${testState.history[testState.history.length - 1].score}%</strong>` : ''}
    </div>
    <div class="inline-actions" style="margin-top:14px;">
      <button class="primary-btn start-test-btn">${testState.attemptsUsed >= 2 ? 'Ver intento final' : 'Iniciar / continuar test'}</button>
      <button class="ghost-btn reset-test-btn">Reiniciar este test</button>
    </div>
    <div class="quiz-container"></div>
  `;

  const quizContainer = wrapper.querySelector('.quiz-container');
  const startBtn = wrapper.querySelector('.start-test-btn');
  const resetBtn = wrapper.querySelector('.reset-test-btn');

  startBtn.addEventListener('click', () => {
    showQuiz(testId, phase.test.pool, quizContainer, wrapper);
  });

  resetBtn.addEventListener('click', () => {
    state.tests[testId] = { attemptsUsed: 0, history: [], currentSet: null };
    saveState();
    renderPhases();
  });

  if (testState.currentSet || testState.attemptsUsed >= 2) {
    showQuiz(testId, phase.test.pool, quizContainer, wrapper);
  }

  return wrapper;
}

function showQuiz(testId, poolName, container, wrapper) {
  const testState = state.tests[testId] || { attemptsUsed: 0, history: [], currentSet: null };
  const pool = QUESTION_POOLS[poolName];

  if (!testState.currentSet) {
    testState.currentSet = buildQuestionSet(pool);
    state.tests[testId] = testState;
    saveState();
  }

  const currentSet = testState.currentSet;
  const locked = testState.attemptsUsed >= 2 && testState.history.length > 0;
  const revealCorrect = locked || testState.attemptsUsed === 1;

  container.innerHTML = '';
  currentSet.forEach((question, idx) => {
    const qEl = document.createElement('div');
    qEl.className = 'quiz-question';
    qEl.innerHTML = `<strong>${idx + 1}. ${question.q}</strong><div class="quiz-options"></div>`;
    const optWrap = qEl.querySelector('.quiz-options');

    question.options.forEach((option, optIndex) => {
      const id = `${testId}_${idx}_${optIndex}`;
      const checked = question.userAnswer === optIndex ? 'checked' : '';
      const disabled = locked ? 'disabled' : '';
      const classes = ['quiz-option'];
      if (revealCorrect && optIndex === question.correct) classes.push('correct-reveal');
      if (revealCorrect && question.userAnswer === optIndex && optIndex !== question.correct) classes.push('user-wrong');
      const label = document.createElement('label');
      label.className = classes.join(' ');
      label.innerHTML = `<input type="radio" name="q_${testId}_${idx}" value="${optIndex}" ${checked} ${disabled}><span>${option}</span>`;
      const input = label.querySelector('input');
      input?.addEventListener('change', () => {
        state.tests[testId].currentSet[idx].userAnswer = optIndex;
        saveState();
      });
      optWrap.appendChild(label);
    });
    container.appendChild(qEl);
  });

  if (!locked) {
    const actions = document.createElement('div');
    actions.className = 'inline-actions';
    actions.innerHTML = `<button class="secondary-btn">Corregir intento</button>`;
    actions.querySelector('button').addEventListener('click', () => submitQuiz(testId, poolName));
    container.appendChild(actions);
  } else if (testState.history.length) {
    const final = testState.history[testState.history.length - 1];
    const summary = document.createElement('div');
    summary.className = 'quiz-summary';
    summary.innerHTML = `Resultado final registrado: <strong>${final.score}%</strong> · ${final.correct}/${final.total} respuestas correctas.`;
    container.appendChild(summary);
  }
}

function buildQuestionSet(pool) {
  return shuffle([...pool])
    .slice(0, 15)
    .map(q => {
      const indexed = q.options.map((opt, index) => ({ opt, index }));
      const shuffled = shuffle(indexed);
      return {
        q: q.q,
        options: shuffled.map(item => item.opt),
        correct: shuffled.findIndex(item => item.index === q.correct),
        userAnswer: null
      };
    });
}

function submitQuiz(testId, poolName) {
  const testState = state.tests[testId];
  const unanswered = testState.currentSet.filter(q => q.userAnswer === null).length;
  if (unanswered) {
    alert(`Faltan ${unanswered} preguntas por responder.`);
    return;
  }

  const correct = testState.currentSet.filter(q => q.userAnswer === q.correct).length;
  const total = testState.currentSet.length;
  const score = Math.round((correct / total) * 100);
  testState.attemptsUsed += 1;
  testState.history.push({ score, correct, total, date: new Date().toLocaleString('es-ES') });

  if (testState.attemptsUsed < 2) {
    testState.currentSet = buildQuestionSet(QUESTION_POOLS[poolName]);
    alert(`Primer intento registrado: ${score}%. Se generará un segundo intento con preguntas y orden aleatorios.`);
  } else {
    alert(`Segundo intento registrado: ${score}%. Ahora se mostrarán también las respuestas correctas.`);
  }

  state.tests[testId] = testState;
  saveState();
  renderPhases();
}

function updateGlobalProgress() {
  const total = PHASES.length;
  const done = PHASES.filter(p => state.completedPhases[p.id]).length;
  const percent = Math.round((done / total) * 100);
  globalProgressText.textContent = `${percent}%`;
  globalProgressText.style.background = `conic-gradient(var(--primary) ${percent}%, var(--primary-soft) ${percent}% 100%)`;
}

function updateCertificate() {
  const sheet = document.getElementById('certificateSheet');
  const completed = PHASES.filter(p => state.completedPhases[p.id]).length;
  const practiceRows = PHASES.flatMap(phase => phase.practices.map(practice => {
    const pState = state.practices[practice.id] || {};
    return {
      phase: `Fase ${phase.number}`,
      task: practice.title,
      status: pState.submitted ? `Entregada (${pState.timestamp || ''})` : pState.text ? 'En borrador' : 'Pendiente'
    };
  }));

  const testRows = PHASES.filter(p => p.test).map(phase => {
    const tState = state.tests[phase.id] || { attemptsUsed: 0, history: [] };
    const last = tState.history[tState.history.length - 1];
    return {
      phase: `Fase ${phase.number}`,
      attempts: `${tState.attemptsUsed || 0}/2`,
      result: last ? `${last.score}% (${last.correct}/${last.total})` : 'Sin realizar'
    };
  });

  sheet.innerHTML = `
    <div class="certificate-title">
      <p class="eyebrow">Certificación de seguimiento</p>
      <h2>Unidad 1 · La empresa y su organización · El proceso de comunicación</h2>
      <p>Código de verificación docente: <strong>${TEACHER_CODE}</strong></p>
      <p>Fecha de emisión: <strong>${new Date().toLocaleDateString('es-ES')}</strong></p>
    </div>
    <div class="certificate-grid">
      <div class="certificate-block">
        <h4>Resumen general</h4>
        <p>Fases completadas: <strong>${completed} / ${PHASES.length}</strong></p>
        <p>Progreso global: <strong>${Math.round((completed / PHASES.length) * 100)}%</strong></p>
        <p>Este documento resume las evidencias guardadas localmente en la plataforma del estudiante.</p>
      </div>
      <div class="certificate-block">
        <h4>Observaciones</h4>
        <p>Se incluyen entregas registradas de prácticas y resultados de los test aleatorios con un máximo de dos intentos por fase evaluable.</p>
        <p>El certificado puede imprimirse o guardarse como PDF desde el navegador.</p>
      </div>
    </div>
    <div class="certificate-block" style="margin-top:16px;">
      <h4>Registro de prácticas</h4>
      <table class="table-like">
        <thead><tr><th>Fase</th><th>Práctica</th><th>Estado</th></tr></thead>
        <tbody>
          ${practiceRows.map(r => `<tr><td>${r.phase}</td><td>${r.task}</td><td>${r.status}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="certificate-block" style="margin-top:16px;">
      <h4>Resultados de test</h4>
      <table class="table-like">
        <thead><tr><th>Fase</th><th>Intentos</th><th>Resultado</th></tr></thead>
        <tbody>
          ${testRows.map(r => `<tr><td>${r.phase}</td><td>${r.attempts}</td><td>${r.result}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function initGlobalActions() {
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById(btn.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.getElementById('certificateBtn').addEventListener('click', () => {
    document.getElementById('certificatePanel').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('refreshCertificateBtn').addEventListener('click', updateCertificate);
  document.getElementById('printCertificateBtn').addEventListener('click', () => window.print());
  document.getElementById('resetProgressBtn').addEventListener('click', () => {
    if (confirm('¿Seguro que deseas borrar el progreso guardado?')) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });
}

function getPracticeStatusText(pState) {
  if (pState.submitted) return `Entrega registrada · ${pState.timestamp || ''}`;
  if (pState.text) return 'Borrador guardado automáticamente';
  return 'Sin contenido todavía';
}
function getPracticeStatusClass(pState) {
  if (pState.submitted || pState.text) return 'saved';
  return 'empty';
}
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function debounce(fn, delay = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
