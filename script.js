
const STORAGE_KEY = 'u1_empresa_org_v2';
const nav = document.getElementById('phaseNav');
const phasesContainer = document.getElementById('phasesContainer');
const progressEl = document.getElementById('globalProgress');
const certificateSection = document.getElementById('certificateSection');
const certificateSheet = document.getElementById('certificateSheet');
const verifyDialog = document.getElementById('verifyDialog');
const teacherCodeInput = document.getElementById('teacherCodeInput');
const verifyMsg = document.getElementById('verifyMsg');

let verifyPhaseId = null;
const state = loadState();

init();

function init(){
  renderNav();
  renderPhases();
  updateProgress();
  renderCertificate();
  bindGlobal();
}

function defaultPhaseState(){
  return {
    notes:'',
    practiceDelivered:false,
    practiceTimestamp:'',
    verified:false,
    tests:{
      attemptsUsed:0,
      history:[],
      activeSet:null,
      reviewSet:null,
      finished:false
    },
    mapAnswers:{}
  };
}

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const phaseState = {};
    APP_DATA.phases.forEach(p => {
      phaseState[p.id] = {...defaultPhaseState(), ...(parsed.phaseState?.[p.id] || {})};
    });
    return {studentName: parsed.studentName || '', phaseState};
  }catch{
    return {studentName:'', phaseState:Object.fromEntries(APP_DATA.phases.map(p=>[p.id, defaultPhaseState()]))};
  }
}

function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateProgress();
  renderNav();
  renderCertificate();
}

function bindGlobal(){
  document.getElementById('resetAll').addEventListener('click', () => {
    if(confirm('¿Seguro que deseas borrar todo el progreso guardado en este navegador?')){
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });
  document.getElementById('showCertificate').addEventListener('click', () => {
    certificateSection.classList.remove('hidden');
    certificateSection.scrollIntoView({behavior:'smooth'});
  });
  document.getElementById('refreshCertificate').addEventListener('click', renderCertificate);
  document.getElementById('printCertificate').addEventListener('click', () => window.print());
  document.querySelectorAll('[data-scroll]').forEach(btn => btn.addEventListener('click', e => {
    const target = document.querySelector(btn.dataset.scroll);
    if(target) target.scrollIntoView({behavior:'smooth'});
  }));
  document.getElementById('verifyForm').addEventListener('submit', onVerifySubmit);
}

function renderNav(){
  nav.innerHTML = '';
  APP_DATA.phases.forEach((phase, index) => {
    const unlocked = isPhaseOpen(index);
    const done = state.phaseState[phase.id].tests.finished;
    const a = document.createElement('a');
    a.href = unlocked ? `#${phase.id}` : '#';
    a.className = `phase-link ${done ? 'done' : ''}`;
    if(!unlocked) a.style.opacity = '.55';
    a.innerHTML = `<div><strong>Fase ${phase.number}</strong><span>${phase.title}</span></div>`;
    nav.appendChild(a);
  });
}

function isPhaseOpen(index){
  if(index === 0) return true;
  const prev = APP_DATA.phases[index-1];
  return state.phaseState[prev.id].tests.finished;
}

function updateProgress(){
  const total = APP_DATA.phases.length;
  const done = APP_DATA.phases.filter(p => state.phaseState[p.id].tests.finished).length;
  const percent = Math.round(done/total*100);
  progressEl.style.setProperty('--p', percent + '%');
  progressEl.textContent = `${percent}%`;
}

function renderPhases(){
  phasesContainer.innerHTML = '';
  APP_DATA.phases.forEach((phase, index) => {
    const ps = state.phaseState[phase.id];
    const open = isPhaseOpen(index);

    const section = document.createElement('section');
    section.className = `phase-card ${open ? '' : 'phase-locked'}`;
    section.id = phase.id;

    const statusBits = [];
    statusBits.push(`<span class="chip ${ps.practiceDelivered ? 'ok' : 'warn'}">${ps.practiceDelivered ? 'Práctica registrada' : 'Pendiente EVAGD'}</span>`);
    statusBits.push(`<span class="chip ${ps.verified ? 'ok' : 'warn'}">${ps.verified ? 'Verificación concedida' : 'Test bloqueado'}</span>`);
    statusBits.push(`<span class="chip ${ps.tests.finished ? 'ok' : 'warn'}">${ps.tests.finished ? 'Fase superada' : 'Fase no finalizada'}</span>`);

    section.innerHTML = `
      <div class="phase-top">
        <div class="phase-title">
          <p class="eyebrow">${phase.subtitle}</p>
          <h3>Fase ${phase.number}. ${phase.title}</h3>
          <p>${phase.summary}</p>
        </div>
        <div class="phase-status">${statusBits.join('')}</div>
      </div>
    `;

    if(!open){
      const locked = document.createElement('article');
      locked.className = 'lock-card';
      locked.innerHTML = `<h4>Fase bloqueada</h4><p>Para acceder, finaliza la fase anterior: práctica registrada, verificación docente y test completado.</p>`;
      section.appendChild(locked);
      phasesContainer.appendChild(section);
      return;
    }

    const theoryGrid = document.createElement('div');
    theoryGrid.className = 'theory-grid';
    phase.theory.forEach(card => {
      const article = document.createElement('article');
      article.className = 'theory-card';
      article.innerHTML = `<h4>${card.title}</h4><p>${card.text}</p>`;
      theoryGrid.appendChild(article);
    });
    section.appendChild(theoryGrid);

    const badgeWrap = document.createElement('div');
    badgeWrap.className = 'badge-wrap';
    phase.badges.forEach(b => {
      const span = document.createElement('span');
      span.className = 'badge';
      span.textContent = b;
      badgeWrap.appendChild(span);
    });
    section.appendChild(badgeWrap);

    if(phase.id === 'fase-1'){
      section.appendChild(renderMapPhase1(phase));
    }

    section.appendChild(renderPractice(phase));

    if(ps.practiceDelivered){
      section.appendChild(renderVerification(phase));
    } else {
      const lock = document.createElement('article');
      lock.className = 'lock-card';
      lock.innerHTML = `<h4>Acceso al test</h4><p>Primero entrega la práctica en EVAGD y regístralo aquí. Después podrás solicitar la verificación docente.</p>`;
      section.appendChild(lock);
    }

    if(ps.verified){
      section.appendChild(renderTest(phase));
    }

    phasesContainer.appendChild(section);
  });
}

function renderMapPhase1(phase){
  const ps = state.phaseState[phase.id];
  const map = document.createElement('article');
  map.className = 'map-card';
  map.innerHTML = `
    <h4>Mapa conceptual gráfico con huecos interactivos</h4>
    <p>Completa los términos omitidos siguiendo la misma estructura y conexiones del mapa de referencia. Las respuestas se guardan de forma automática.</p>
    <div class="map-scene" id="mapScene">
      <img class="map-image" src="assets/mapa-fase1.svg" alt="Mapa conceptual de la fase 1 con huecos numerados">
    </div>
    <p class="map-help"><strong>Consejo:</strong> usa los números del dibujo para localizar cada hueco. Puedes dejarlo a medias y continuar más tarde.</p>
  `;
  const scene = map.querySelector('#mapScene');
  const positions = [
    {n:1,left:80,top:120,width:220},{n:2,left:540,top:120,width:280},{n:3,left:1030,top:120,width:250},
    {n:4,left:110,top:235,width:180},{n:5,left:110,top:315,width:180},{n:6,left:110,top:395,width:180},{n:7,left:110,top:475,width:180},
    {n:8,left:310,top:575,width:150},{n:9,left:310,top:640,width:150},{n:10,left:310,top:705,width:150},{n:11,left:310,top:770,width:150},
    {n:12,left:615,top:295,width:150},{n:13,left:615,top:355,width:150},{n:14,left:615,top:470,width:150},{n:15,left:615,top:530,width:150},
    {n:16,left:615,top:680,width:150},{n:17,left:615,top:740,width:150},{n:18,left:615,top:800,width:150}
  ];
  positions.forEach(pos => {
    const input = document.createElement('input');
    input.className = 'map-input';
    input.style.left = pos.left + 'px';
    input.style.top = pos.top + 'px';
    input.style.width = pos.width + 'px';
    input.placeholder = pos.n;
    input.value = ps.mapAnswers[pos.n] || '';
    input.addEventListener('input', e => {
      ps.mapAnswers[pos.n] = e.target.value;
      saveState();
    });
    scene.appendChild(input);
  });
  return map;
}

function renderPractice(phase){
  const ps = state.phaseState[phase.id];
  const card = document.createElement('article');
  card.className = 'practice-card';
  card.innerHTML = `
    <h4>${phase.practice.title}</h4>
    <p>${phase.practice.prompt}</p>
    <ol class="practice-steps">${phase.practice.studentSteps.map(step => `<li>${step}</li>`).join('')}</ol>
    <label class="eyebrow" style="display:block;margin:18px 0 8px;">Borrador o notas personales</label>
    <textarea class="textarea" placeholder="Puedes tomar notas aquí. No sustituye la entrega en EVAGD.">${escapeHtml(ps.notes)}</textarea>
    <div class="inline">
      <button class="secondary saveNotes">Guardar notas</button>
      <button class="primary markDelivery">${ps.practiceDelivered ? 'Actualizar registro EVAGD' : 'Ya he entregado en EVAGD'}</button>
      <span class="status-text ${ps.practiceDelivered ? 'ok' : 'warn'}">${ps.practiceDelivered ? 'Entrega registrada: ' + ps.practiceTimestamp : 'Aún no consta la entrega en EVAGD'}</span>
    </div>
  `;
  const textarea = card.querySelector('textarea');
  textarea.addEventListener('input', debounce(() => {
    ps.notes = textarea.value;
    saveState();
  }, 250));
  card.querySelector('.saveNotes').addEventListener('click', () => {
    ps.notes = textarea.value;
    saveState();
  });
  card.querySelector('.markDelivery').addEventListener('click', () => {
    ps.notes = textarea.value;
    ps.practiceDelivered = true;
    ps.practiceTimestamp = new Date().toLocaleString('es-ES');
    saveState();
    renderPhases();
  });
  return card;
}

function renderVerification(phase){
  const ps = state.phaseState[phase.id];
  const card = document.createElement('article');
  card.className = 'lock-card';
  card.innerHTML = `
    <h4>Verificación docente</h4>
    <p>Una vez entregada la práctica en EVAGD, solicita al docente el código de verificación para desbloquear el test de esta fase.</p>
    <div class="verify-row">
      <button class="primary verifyBtn">${ps.verified ? 'Verificación registrada' : 'Introducir verificación docente'}</button>
      <span class="status-text ${ps.verified ? 'ok' : 'warn'}">${ps.verified ? 'Acceso al test habilitado.' : 'El test sigue bloqueado.'}</span>
    </div>
  `;
  card.querySelector('.verifyBtn').disabled = ps.verified;
  card.querySelector('.verifyBtn').addEventListener('click', () => {
    verifyPhaseId = phase.id;
    teacherCodeInput.value = '';
    verifyMsg.textContent = '';
    verifyDialog.showModal();
    setTimeout(() => teacherCodeInput.focus(), 50);
  });
  return card;
}

async function onVerifySubmit(e){
  e.preventDefault();
  if(!verifyPhaseId) return;
  const code = teacherCodeInput.value.trim();
  const hash = await sha256(code);
  if(hash === APP_DATA.teacherHash){
    state.phaseState[verifyPhaseId].verified = true;
    saveState();
    verifyMsg.textContent = 'Verificación correcta.';
    setTimeout(() => {
      verifyDialog.close();
      renderPhases();
      const target = document.getElementById(verifyPhaseId);
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    }, 350);
  }else{
    verifyMsg.textContent = 'Código no válido. Revisa el dato con el docente.';
  }
}

function renderTest(phase){
  const ps = state.phaseState[phase.id];
  const box = document.createElement('article');
  box.className = 'test-box';
  box.innerHTML = `
    <div class="quiz-head">
      <div>
        <h4>Test de la fase</h4>
        <p>Se muestran 15 preguntas aleatorias. Dispones de dos intentos. Tras el segundo intento se indican las respuestas correctas.</p>
      </div>
      <div class="quiz-meta">Intentos usados: ${ps.tests.attemptsUsed} / 2</div>
    </div>
    <div class="inline">
      <button class="primary startTest">${ps.tests.activeSet ? 'Continuar test' : (ps.tests.finished ? 'Ver resultados' : 'Iniciar test')}</button>
      ${ps.tests.finished ? '<button class="secondary reviewBtn">Ver revisión</button>' : ''}
    </div>
    <div class="quizArea"></div>
  `;
  const area = box.querySelector('.quizArea');
  box.querySelector('.startTest').addEventListener('click', () => {
    if(!ps.tests.activeSet && !ps.tests.finished){
      createAttemptSet(phase.id);
    }
    if(ps.tests.finished){
      renderReview(area, phase.id);
    }else{
      renderAttempt(area, phase.id);
    }
  });
  if(ps.tests.finished){
    box.querySelector('.reviewBtn')?.addEventListener('click', () => renderReview(area, phase.id));
  }
  return box;
}

function createAttemptSet(phaseId){
  const ps = state.phaseState[phaseId];
  const pool = APP_DATA.questionPools[phaseId];
  const selected = shuffle([...pool]).slice(0,15).map(q => {
    const zipped = q.options.map((t,i)=>({text:t, original:i}));
    const shuffled = shuffle(zipped);
    return {
      q:q.q,
      options:shuffled.map(o => o.text),
      correctIndex:shuffled.findIndex(o => o.original === q.correct)
    };
  });
  ps.tests.activeSet = selected;
  saveState();
}

function renderAttempt(area, phaseId){
  const ps = state.phaseState[phaseId];
  const set = ps.tests.activeSet;
  if(!set){
    area.innerHTML = '<p class="muted">Todavía no hay un intento activo.</p>';
    return;
  }
  const form = document.createElement('form');
  form.innerHTML = set.map((item, idx) => `
    <section class="question">
      <strong>${idx+1}. ${item.q}</strong>
      <div class="options">
        ${item.options.map((opt, j) => `
          <label class="option">
            <input type="radio" name="q${idx}" value="${j}">
            <span>${opt}</span>
          </label>
        `).join('')}
      </div>
    </section>
  `).join('');
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'primary';
  submit.textContent = 'Corregir intento';
  submit.style.marginTop = '16px';
  form.appendChild(submit);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const answers = set.map((_, idx) => {
      const checked = form.querySelector(`input[name="q${idx}"]:checked`);
      return checked ? Number(checked.value) : null;
    });
    const correct = answers.filter((ans, idx) => ans === set[idx].correctIndex).length;
    const score = Math.round(correct / set.length * 100);
    ps.tests.history.push({score, correct, total:set.length});
    ps.tests.attemptsUsed += 1;
    const reveal = ps.tests.attemptsUsed >= 2;
    ps.tests.reviewSet = {questions:set, answers, reveal};
    ps.tests.activeSet = null;
    ps.tests.finished = score >= APP_DATA.passingScore || ps.tests.attemptsUsed >= 2;
    saveState();

    const summary = document.createElement('div');
    summary.className = 'result-box';
    summary.innerHTML = `
      <strong>Resultado del intento: ${score}% (${correct}/${set.length})</strong>
      <p>${ps.tests.finished ? 'La fase queda finalizada y se desbloqueará la siguiente.' : 'Todavía dispones de un segundo intento con una selección distinta de preguntas.'}</p>
    `;
    area.innerHTML = '';
    area.appendChild(summary);

    if(!ps.tests.finished){
      const btn = document.createElement('button');
      btn.className = 'primary';
      btn.textContent = 'Generar segundo intento';
      btn.addEventListener('click', () => {
        createAttemptSet(phaseId);
        renderPhases();
        document.getElementById(phaseId)?.scrollIntoView({behavior:'smooth'});
      });
      area.appendChild(btn);
    }else{
      renderReview(area, phaseId);
      renderPhases();
    }
  });

  area.innerHTML = '';
  area.appendChild(form);
}

function renderReview(area, phaseId){
  const ps = state.phaseState[phaseId];
  const review = ps.tests.reviewSet;
  if(!review){
    area.innerHTML = '<p class="muted">No hay revisión disponible todavía.</p>';
    return;
  }
  const last = ps.tests.history[ps.tests.history.length - 1];
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div class="result-box">
      <strong>Último resultado registrado: ${last.score}% (${last.correct}/${last.total})</strong>
      <p>${review.reveal ? 'Se muestran las respuestas correctas porque ya se han agotado los dos intentos o la fase está cerrada.' : 'Se muestran tus elecciones. Las soluciones completas se reservan para después del segundo intento.'}</p>
    </div>
  `;
  review.questions.forEach((item, idx) => {
    const q = document.createElement('section');
    q.className = 'question';
    q.innerHTML = `<strong>${idx+1}. ${item.q}</strong>`;
    const opts = document.createElement('div');
    opts.className = 'options';
    item.options.forEach((opt, j) => {
      const chosen = review.answers[idx] === j;
      const correct = item.correctIndex === j;
      let cls = 'option';
      if(review.reveal && correct) cls += ' correct';
      if(chosen && review.reveal && !correct) cls += ' incorrect';
      opts.innerHTML += `<div class="${cls}"><span>${chosen ? '✓' : '○'}</span><span>${opt}</span></div>`;
    });
    q.appendChild(opts);
    wrap.appendChild(q);
  });
  area.innerHTML = '';
  area.appendChild(wrap);
}

function renderCertificate(){
  const rows = APP_DATA.phases.map(phase => {
    const ps = state.phaseState[phase.id];
    const best = ps.tests.history.length ? Math.max(...ps.tests.history.map(h => h.score)) + '%' : 'Sin realizar';
    return `
      <tr>
        <td><strong>Fase ${phase.number}</strong><br>${phase.title}</td>
        <td>${ps.practiceDelivered ? 'Entregada en EVAGD<br><span class="muted">' + ps.practiceTimestamp + '</span>' : 'Pendiente'}</td>
        <td>${ps.verified ? 'Sí' : 'No'}</td>
        <td>${ps.tests.attemptsUsed}</td>
        <td>${best}</td>
        <td>${ps.tests.finished ? 'Finalizada' : 'En proceso'}</td>
      </tr>
    `;
  }).join('');
  const completed = APP_DATA.phases.filter(p => state.phaseState[p.id].tests.finished).length;
  certificateSheet.innerHTML = `
    <p class="eyebrow">Registro automático</p>
    <h2 style="margin:8px 0 6px;">Certificado de seguimiento de la unidad</h2>
    <p class="muted">Este documento resume el avance del estudiante en la unidad “La empresa y su organización · El proceso de comunicación”.</p>
    <div class="summary-grid" style="margin:18px 0;">
      <article class="summary-card"><h3>Fases finalizadas</h3><p><strong>${completed} / ${APP_DATA.phases.length}</strong></p></article>
      <article class="summary-card"><h3>Prácticas registradas</h3><p><strong>${APP_DATA.phases.filter(p => state.phaseState[p.id].practiceDelivered).length} / ${APP_DATA.phases.length}</strong></p></article>
      <article class="summary-card"><h3>Fecha del informe</h3><p><strong>${new Date().toLocaleString('es-ES')}</strong></p></article>
    </div>
    <table class="table">
      <thead>
        <tr><th>Fase</th><th>Práctica</th><th>Verificación</th><th>Intentos</th><th>Mejor nota</th><th>Estado</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="muted" style="margin-top:18px;">Las prácticas se entregan fuera de esta web, en EVAGD. Este certificado refleja el registro local del navegador y los resultados obtenidos en los test de cada fase.</p>
  `;
}

function escapeHtml(text){
  return (text || '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}
function debounce(fn, wait){
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}
function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
async function sha256(text){
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2,'0')).join('');
}
