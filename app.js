const STORAGE_KEY = 'afy-unidad1-progress-v3';
const data = window.COURSE_DATA;
let state = loadState();
let currentPhaseId = state.currentPhaseId || 1;

const phaseNav = document.getElementById('phaseNav');
const phaseTitle = document.getElementById('phaseTitle');
const phaseBadge = document.getElementById('phaseBadge');
const phaseSummary = document.getElementById('phaseSummary');
const practiceText = document.getElementById('practiceText');
const practiceSteps = document.getElementById('practiceSteps');
const practiceEvidence = document.getElementById('practiceEvidence');
const practiceDelivered = document.getElementById('practiceDelivered');
const practiceStatusText = document.getElementById('practiceStatusText');
const teacherCode = document.getElementById('teacherCode');
const unlockMessage = document.getElementById('unlockMessage');
const testLockedState = document.getElementById('testLockedState');
const testForm = document.getElementById('testForm');
const testActions = document.getElementById('testActions');
const testFeedback = document.getElementById('testFeedback');
const attemptInfo = document.getElementById('attemptInfo');
const newAttemptBtn = document.getElementById('newAttempt');
const mapSection = document.getElementById('mapSection');
const mapInputsLayer = document.getElementById('mapInputsLayer');
const mapFeedback = document.getElementById('mapFeedback');
const certificateSection = document.getElementById('certificateSection');
const certificateContent = document.getElementById('certificateContent');

document.getElementById('verifyTeacherCode').addEventListener('click', verifyTeacher);
document.getElementById('submitTest').addEventListener('click', submitTest);
document.getElementById('newAttempt').addEventListener('click', prepareSecondAttempt);
document.getElementById('goCertificate').addEventListener('click', () => {
  currentPhaseId = 8;
  render();
  certificateSection.scrollIntoView({behavior:'smooth'});
});
document.getElementById('printCertificate').addEventListener('click', () => window.print());
document.getElementById('resetProgress').addEventListener('click', () => {
  if(confirm('Se borrará el progreso guardado en este dispositivo.')) {
    localStorage.removeItem(STORAGE_KEY);
    state = loadState(true);
    currentPhaseId = 1;
    render();
  }
});
practiceDelivered.addEventListener('change', () => {
  const p = getPhaseState(currentPhaseId);
  p.practiceDelivered = practiceDelivered.checked;
  saveState();
  renderUnlockState();
  renderNav();
  renderCertificate();
});

function loadState(forceFresh=false){
  if(forceFresh) return initialState();
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return initialState();
    const parsed = JSON.parse(raw);
    return Object.assign(initialState(), parsed);
  }catch{
    return initialState();
  }
}
function initialState(){
  const phases = {};
  data.phases.forEach(p => phases[p.id] = {
    practiceDelivered:false,
    verified:false,
    attempts:0,
    testPassed:false,
    bestScore:0,
    shownSet:null,
    secondSet:null,
    responses:{},
    mapResponses:{}
  });
  return {currentPhaseId:1, phases};
}
function saveState(){
  state.currentPhaseId = currentPhaseId;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function getPhaseState(id){ return state.phases[id]; }

function renderNav(){
  phaseNav.innerHTML = '';
  data.phases.forEach(phase => {
    const ps = getPhaseState(phase.id);
    const a = document.createElement('a');
    a.href='#';
    a.className = 'phase-link' + (phase.id === currentPhaseId ? ' active' : '');
    a.innerHTML = `<div class="phase-meta"><strong>Fase ${phase.id}</strong><span>${phase.title}</span><small>${ps.practiceDelivered ? 'Práctica marcada' : 'Práctica pendiente'} · ${ps.attempts}/2 intentos</small></div>
      <span class="phase-state ${ps.testPassed ? 'done' : (phase.id===currentPhaseId || phase.id===1 || getPhaseState(phase.id-1)?.testPassed ? 'open' : 'locked')}">${ps.testPassed ? '✓' : '→'}</span>`;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      currentPhaseId = phase.id;
      saveState();
      render();
      window.scrollTo({top:0,behavior:'smooth'});
    });
    phaseNav.appendChild(a);
  });
  const completed = data.phases.filter(p => getPhaseState(p.id).testPassed && getPhaseState(p.id).practiceDelivered).length;
  const percent = Math.round(completed / data.phases.length * 100);
  document.getElementById('globalProgressText').textContent = percent + '%';
  document.getElementById('globalProgressBar').style.width = percent + '%';
}
function render(){
  const phase = data.phases.find(p => p.id === currentPhaseId);
  const ps = getPhaseState(currentPhaseId);
  phaseBadge.textContent = `FASE ${phase.id}`;
  phaseTitle.textContent = phase.title;
  phaseSummary.textContent = phase.summary;
  practiceText.textContent = phase.practice;
  practiceEvidence.textContent = phase.evidence;
  practiceSteps.innerHTML = phase.practice_steps.map(s => `<li>${s}</li>`).join('');
  practiceDelivered.checked = !!ps.practiceDelivered;
  renderNav();
  renderUnlockState();
  renderMapSection(phase, ps);
  renderTestSection(phase, ps);
  renderCertificate();
}
function renderUnlockState(){
  const ps = getPhaseState(currentPhaseId);
  practiceStatusText.textContent = ps.practiceDelivered ? 'Entregada / marcada' : 'Pendiente';
  practiceStatusText.style.color = ps.practiceDelivered ? 'var(--green)' : 'var(--amber)';
}
async function verifyTeacher(){
  const ps = getPhaseState(currentPhaseId);
  if(!ps.practiceDelivered){
    showFeedback(unlockMessage,'Marca antes la práctica como entregada en EVAGD.', 'warn');
    return;
  }
  const hash = await sha256(teacherCode.value.trim());
  if(hash === data.meta.teacherCodeHash){
    ps.verified = true;
    saveState();
    showFeedback(unlockMessage,'Verificación correcta. El test de esta fase queda desbloqueado.', 'ok');
    renderTestSection(data.phases.find(p=>p.id===currentPhaseId), ps);
  }else{
    showFeedback(unlockMessage,'La verificación no es válida.', 'bad');
  }
}
function renderMapSection(phase, ps){
  if(phase.id !== 1){
    mapSection.classList.add('hidden');
    return;
  }
  mapSection.classList.remove('hidden');
  const positions = [
    [82,219,176],[82,294,176],[82,369,176],[82,494,176],[82,564,176],[82,604,176],[82,644,176],[82,684,176],
    [407,223,136],[407,263,136],[407,345,136],[407,385,136],[407,425,136],[407,465,136],[407,547,136],[407,587,136],[407,627,136],
    [632,223,146],[632,263,146],[632,303,146],[632,343,146],[632,435,146],[632,475,146],
    [908,225,180],[908,265,180],[908,305,180],[908,345,180],[908,385,180],[908,459,180],[908,499,180],
    [908,598,180],[908,632,180],[908,666,180],[908,700,180],[908,734,180],[908,768,180],
    [402,767,136],[582,767,136],[762,767,136],[942,767,136],
    [82,747,176],[82,781,176],[82,815,176]
  ];
  mapInputsLayer.innerHTML = '';
  positions.forEach((pos, idx) => {
    const input = document.createElement('input');
    input.className = 'map-input';
    input.style.left = pos[0] + 'px';
    input.style.top = pos[1] + 'px';
    input.style.width = pos[2] + 'px';
    input.value = ps.mapResponses[idx] || '';
    input.dataset.idx = idx;
    input.addEventListener('input', () => {
      ps.mapResponses[idx] = input.value;
      saveState();
    });
    mapInputsLayer.appendChild(input);
  });
  document.getElementById('clearMap').onclick = () => {
    if(confirm('¿Limpiar todas las respuestas del mapa?')){
      ps.mapResponses = {};
      saveState();
      renderMapSection(phase, ps);
      hideFeedback(mapFeedback);
    }
  };
  document.getElementById('checkMap').onclick = () => {
    const answers = data.mapAnswers;
    let good = 0;
    answers.forEach((ans, i) => {
      const value = String(ps.mapResponses[i] || '').trim().toLowerCase();
      if(normalize(value) === normalize(ans)) good++;
    });
    const pct = Math.round(good / answers.length * 100);
    showFeedback(mapFeedback, `Mapa completado: ${good} de ${answers.length} aciertos aproximados (${pct}%).`, pct >= 75 ? 'ok' : 'warn');
  };
}
function renderTestSection(phase, ps){
  attemptInfo.textContent = `Intentos usados: ${ps.attempts}/2`;
  const unlocked = ps.practiceDelivered && ps.verified;
  testLockedState.classList.toggle('hidden', unlocked);
  testForm.classList.toggle('hidden', !unlocked);
  testActions.classList.toggle('hidden', !unlocked);
  if(!unlocked){
    testForm.innerHTML = '';
    return;
  }
  let questionIndices = ps.attempts === 0 ? (ps.shownSet || buildSet(ps, phase.questions.length, 'shownSet')) :
                        ps.attempts === 1 ? (ps.secondSet || buildSet(ps, phase.questions.length, 'secondSet')) : (ps.secondSet || ps.shownSet);
  const disabled = ps.attempts >= 2;
  testForm.innerHTML = '';
  questionIndices.forEach((qIdx, orderIndex) => {
    const q = phase.questions[qIdx];
    const div = document.createElement('div');
    div.className = 'question';
    div.innerHTML = `<h4>${orderIndex + 1}. ${q.q}</h4>`;
    const options = document.createElement('div');
    options.className = 'options';
    q.options.forEach((opt, optIndex) => {
      const selected = ps.responses[qIdx] === optIndex ? 'checked' : '';
      let extraClass = '';
      if(disabled){
        if(optIndex === q.answer) extraClass = 'correct';
        else if(selected) extraClass = 'incorrect';
      }
      options.innerHTML += `<label class="option ${extraClass}">
        <input type="radio" name="q_${qIdx}" value="${optIndex}" ${selected} ${disabled ? 'disabled' : ''}>
        <span>${opt}</span>
      </label>`;
    });
    div.appendChild(options);
    testForm.appendChild(div);
  });
  testForm.querySelectorAll('input[type="radio"]').forEach(r => r.addEventListener('change', () => {
    ps.responses[r.name.split('_')[1]] = Number(r.value);
    saveState();
  }));
  newAttemptBtn.classList.toggle('hidden', ps.attempts !== 1);
}
function buildSet(ps, total, key){
  const pool = Array.from({length: total}, (_, i) => i);
  shuffle(pool);
  ps[key] = pool.slice(0, 15);
  saveState();
  return ps[key];
}
function submitTest(){
  const phase = data.phases.find(p => p.id === currentPhaseId);
  const ps = getPhaseState(currentPhaseId);
  const set = ps.attempts === 0 ? ps.shownSet : ps.secondSet;
  if(!set || set.some(i => ps.responses[i] === undefined)){
    showFeedback(testFeedback,'Responde todas las preguntas antes de enviar el test.', 'warn');
    return;
  }
  let score = 0;
  set.forEach(i => {
    if(ps.responses[i] === phase.questions[i].answer) score++;
  });
  ps.attempts += 1;
  ps.bestScore = Math.max(ps.bestScore, score);
  if(score >= 12) ps.testPassed = true;
  saveState();
  if(ps.attempts === 1){
    showFeedback(testFeedback, `Primer intento completado. Resultado: ${score}/15. ${score >= 12 ? 'Fase superada.' : 'Puedes preparar el segundo intento con preguntas aleatorias distintas.'}`, score >= 12 ? 'ok' : 'warn');
  } else {
    showFeedback(testFeedback, `Segundo intento completado. Resultado: ${score}/15. Ya puedes revisar las respuestas correctas marcadas en verde.`, score >= 12 || ps.testPassed ? 'ok' : 'warn');
  }
  renderNav();
  renderTestSection(phase, ps);
  renderCertificate();
}
function prepareSecondAttempt(){
  const ps = getPhaseState(currentPhaseId);
  if(ps.attempts !== 1) return;
  ps.responses = {};
  buildSet(ps, data.phases.find(p => p.id === currentPhaseId).questions.length, 'secondSet');
  saveState();
  renderTestSection(data.phases.find(p => p.id === currentPhaseId), ps);
  showFeedback(testFeedback,'Segundo intento preparado con nueva selección y orden de preguntas.', 'ok');
}
function renderCertificate(){
  const rows = data.phases.map(phase => {
    const ps = getPhaseState(phase.id);
    return `<tr>
      <td>Fase ${phase.id}</td>
      <td>${phase.title}</td>
      <td>${ps.practiceDelivered ? 'Sí' : 'No'}</td>
      <td>${ps.attempts}/2</td>
      <td>${ps.bestScore}/15</td>
      <td>${ps.testPassed ? 'Superada' : 'Pendiente'}</td>
    </tr>`;
  }).join('');
  const allDone = data.phases.every(phase => {
    const ps = getPhaseState(phase.id);
    return ps.practiceDelivered && ps.attempts > 0;
  });
  certificateSection.classList.toggle('hidden', false);
  certificateContent.innerHTML = `
    <h2>${data.meta.title}</h2>
    <p><strong>Módulo:</strong> ${data.meta.module}</p>
    <p>Este documento resume el progreso guardado en este dispositivo, incluyendo la entrega de prácticas en EVAGD y los resultados de los test por fase.</p>
    <table class="certificate-table">
      <thead><tr><th>Fase</th><th>Bloque</th><th>Práctica marcada</th><th>Intentos</th><th>Mejor puntuación</th><th>Estado</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="margin-top:18px"><strong>Estado global:</strong> ${allDone ? 'Recorrido completo registrado.' : 'Aún faltan fases por completar o registrar.'}</p>
    <p class="muted">Fecha de impresión: ${new Date().toLocaleDateString('es-ES')}</p>
  `;
}
function showFeedback(el, text, kind){
  el.textContent = text;
  el.className = `feedback show ${kind}`;
}
function hideFeedback(el){ el.className = 'feedback'; el.textContent = ''; }
function normalize(str){
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
}
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}
async function sha256(text){
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2,'0')).join('');
}
render();
