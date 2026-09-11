import { incident001 } from './src/scenarios/incident-001.js';
import { Simulator } from './src/engine.js';
import { scoreRun } from './src/scoring.js';

const scenario = incident001;
const state = new Simulator(scenario);
const root = document.querySelector('#app');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

function reset(){ state.reset(); }
function progress(){ const p={intro:0,investigate:20,evidence:40,diagnose:60,action:75,explain:88,results:100}[state.stage] ?? 0; return `<div class="progress"><div style="width:${p}%"></div></div>`; }
function maya(){
  let m='I’m Maya. I won’t give you the answer first. I’ll help you reason your way to it.';
  if(state.stage==='investigate')m='Where would you start? Don’t worry about being right immediately — show me how you would investigate.';
  if(state.stage==='evidence')m=state.checks.length<2?'Good. Keep collecting evidence before committing to a cause. What else can you verify?':'Now compare the evidence. Which component is actually showing abnormal behavior?';
  if(state.stage==='diagnose')m='Choose the hypothesis that best explains the evidence — not just the symptom.';
  if(state.stage==='action')m='What action would restore service based on your diagnosis?';
  if(state.stage==='reasoning')m='Connect the timeline, evidence, root cause and action. English, Tamil, Tanglish or mixed language is fine.';
  if(state.stage==='results')m='Now look at what you did well and where your engineering reasoning can become stronger.';
  return `<div class="maya"><img class="maya-avatar" src="src/maya/avatar.svg" alt="Maya"><div class="maya-copy"><div class="maya-name">Maya · Engineering Mentor</div><div class="maya-text">${esc(m)}</div><button class="speak" data-speak="${esc(m)}">🔊 Hear Maya</button></div></div>`;
}
function shell(content){ root.innerHTML=progress()+`<section class="card">${content}${maya()}</section>`; }
function back(label,stage){ return `<button class="secondary" data-back="${stage}">← ${label}</button>`; }

function feedback(){
  const r=scoreRun(scenario,state);
  const diagnosisCorrect=state.hypothesis===scenario.correctHypothesis;
  const actionCorrect=state.action===scenario.correctAction;
  const firewallChecked=state.checks.includes('firewall');
  const webChecked=state.checks.includes('web');
  const dbChecked=state.checks.includes('db');
  const reasoning=state.reasoning.trim();
  const reasoningSignals=['firewall','https','443','block','blocked','traffic','09:10','web server','database','healthy'].filter(x=>reasoning.toLowerCase().includes(x));
  const items=[];
  if(diagnosisCorrect)items.push(`<div class="feedback good"><strong>✓ Diagnosis was correct.</strong><span>You identified the firewall as the component blocking the user's HTTPS request.</span></div>`);else items.push(`<div class="feedback improve"><strong>✗ Diagnosis: ${esc(state.hypothesis||'not selected')}</strong><span>The evidence showed DNS was resolving, the web server was running, and the database was healthy. The abnormal evidence was the disabled <code>ALLOW-HTTPS-PROD</code> rule blocking TCP/443.</span></div>`);
  if(actionCorrect)items.push(`<div class="feedback good"><strong>✓ Remediation was correct.</strong><span>Re-enabling <code>ALLOW-HTTPS-PROD</code> addresses the actual failure: incoming HTTPS traffic was being blocked.</span></div>`);else items.push(`<div class="feedback improve"><strong>✗ Remediation would not fix the incident.</strong><span>${state.action?`You chose “${esc(state.action)}”.`:'No remediation was selected.'} That does not address the disabled firewall rule blocking TCP/443. The appropriate action is to re-enable <code>ALLOW-HTTPS-PROD</code>, then verify external HTTPS access.</span></div>`);
  if(firewallChecked)items.push(`<div class="feedback good"><strong>✓ You found the key evidence.</strong><span>The firewall audit showed a 09:10 configuration change, the HTTPS rule disabled, and incoming TCP/443 blocked. This is the strongest evidence in the incident.</span></div>`);else items.push(`<div class="feedback improve"><strong>→ Missing the decisive evidence.</strong><span>You did not inspect the firewall. The decisive clue was the disabled <code>ALLOW-HTTPS-PROD</code> rule blocking incoming TCP/443.</span></div>`);
  if(!webChecked||!dbChecked){const missing=[];if(!webChecked)missing.push('web server');if(!dbChecked)missing.push('database');items.push(`<div class="feedback tip"><strong>→ Strengthen your investigation.</strong><span>You could have checked the ${missing.join(' and ')} to rule out other plausible causes before deciding. A strong engineer compares alternatives rather than jumping to the first explanation.</span></div>`);}
  if(reasoningSignals.length>=4)items.push(`<div class="feedback good"><strong>✓ Your explanation contained useful technical evidence.</strong><span>You connected several relevant signals from the incident. Keep making the evidence → cause → action chain explicit.</span></div>`);else items.push(`<div class="feedback improve"><strong>→ Your reasoning needs more evidence-to-cause connection.</strong><span>Explain <em>what you observed</em>, <em>why it points to the root cause</em>, and <em>why your chosen action fixes that cause</em>. For example: “The firewall rule was disabled at 09:10, so incoming HTTPS traffic on TCP/443 was blocked. The web server and database were healthy, so re-enabling the rule should restore access.”</span></div>`);
  if(state.hints>0)items.push(`<div class="feedback tip"><strong>💡 You used ${state.hints} Maya hint${state.hints>1?'s':''}.</strong><span>Hints are available when you are stuck, but try to gather and compare evidence independently before asking Maya next time.</span></div>`);
  return {r,items};
}

function render(){
  if(state.stage==='intro')return shell(`<div class="eyebrow">${esc(scenario.subject)} · ${esc(scenario.difficulty)}</div><h1 class="title">${esc(scenario.title)}</h1><p class="sub">${esc(scenario.intro)}</p><div class="meta">${scenario.skills.map(x=>`<span class="tag">${esc(x)}</span>`).join('')}<span class="tag">${esc(scenario.time)}</span></div><div class="row"><button class="primary" data-start="1">Start investigation</button><button class="secondary" data-seminar="1">Seminar mode</button></div>`);
  if(state.stage==='investigate')return shell(`<div class="eyebrow">Step 1 · Investigate${state.seminar?' · Seminar mode':''}</div><h2>Where do you start?</h2><p class="sub">Pick one check. There is no penalty for an imperfect first move — the important thing is how you investigate.</p><div class="actions">${scenario.investigation.map(x=>`<button class="choice" data-check="${esc(x[0])}"><strong>${esc(x[1])}</strong><span>${esc(x[2])}</span></button>`).join('')}</div>`);
  if(state.stage==='evidence')return shell(`<div class="eyebrow">Step 2 · Gather evidence</div><h2>What did you find?</h2><p class="sub">Review the result, then choose another investigation. Build the picture before you diagnose.</p>${state.checks.map(id=>`<div class="evidence"><h3>${esc(scenario.evidence[id][0])}</h3><pre>${esc(scenario.evidence[id][1])}</pre></div>`).join('')}<div class="actions">${scenario.investigation.filter(x=>!state.checks.includes(x[0])).map(x=>`<button class="choice" data-check="${esc(x[0])}"><strong>${esc(x[1])}</strong><span>${esc(x[2])}</span></button>`).join('')}<button class="primary" data-diagnose="1">I’m ready to form a hypothesis</button>${back('Back to investigation','investigate')}</div>`);
  if(state.stage==='diagnose')return shell(`<div class="eyebrow">Step 3 · Diagnose</div><h2>What is the most likely cause?</h2><p class="sub">Choose the explanation that best fits the evidence you collected.</p><div class="actions">${scenario.hypotheses.map(x=>`<button class="choice" data-hypothesis="${esc(x[0])}"><strong>${esc(x[1])}</strong></button>`).join('')}${back('Back to evidence','evidence')}</div>`);
  if(state.stage==='action')return shell(`<div class="eyebrow">Step 4 · Restore</div><h2>What would you do?</h2><p class="sub">Select the action that should restore service.</p><div class="actions">${scenario.actions.map(x=>`<button class="choice" data-fix="${esc(x[0])}"><strong>${esc(x[1])}</strong></button>`).join('')}${back('Back to diagnosis','diagnose')}</div>`);
  if(state.stage==='reasoning')return shell(`<div class="eyebrow">Step 5 · Explain your reasoning</div><h2>Explain it in your own language.</h2><p class="sub">Tell Maya what you found, why you think it caused the problem, and why your chosen action will fix it.</p><div style="margin-top:18px"><div style="font-size:13px;font-weight:750;margin-bottom:8px">Choose your language</div><div class="row"><button class="${state.language==='en-IN'?'primary':'secondary'}" data-language="en-IN">🇬🇧 English</button><button class="${state.language==='ta-IN'?'primary':'secondary'}" data-language="ta-IN">தமிழ்</button></div><p style="font-size:12px;color:#6b7280;margin:10px 0 0">Your language does not affect your engineering score.</p></div><textarea id="reasoning" placeholder="${state.language==='ta-IN'?'உங்கள் முடிவை தமிழில் விளக்குங்கள்...':'Example: 09:10 firewall rule was disabled, so HTTPS traffic on port 443 was blocked...'}">${esc(state.reasoning)}</textarea><div class="row" style="margin-top:12px"><button class="primary" data-submit="1">Submit reasoning</button><button class="secondary" data-voice="1">🎙 Speak your answer</button><button class="secondary" data-hint="1">Ask Maya for a hint</button></div>${state.hints?`<p class="hint">Hint: ${esc(scenario.hints[state.hints-1])}</p>`:''}${back('Back to action','action')}`);
  const {r,items}=feedback();
  const summary=r.score>=85?'Strong engineering investigation.':r.score>=70?'Good start. Now strengthen the evidence-to-reasoning connection.':'Keep investigating. Focus on ruling out alternatives before deciding.';
  return shell(`<div class="eyebrow">Incident complete</div><h2>Investigation complete.</h2><div class="score">${r.score}<small>/100</small></div><p class="sub" style="margin-top:8px"><strong>${summary}</strong></p><div class="success">Root cause: HTTPS traffic was blocked by the firewall.</div><div style="margin-top:22px"><div class="metric"><span>Investigation</span><strong>${r.investigation}/25</strong></div><div class="metric"><span>Evidence usage</span><strong>${r.evidence}/20</strong></div><div class="metric"><span>Technical reasoning</span><strong>${r.reasoning}/30</strong></div><div class="metric"><span>Decision</span><strong>${r.decision}/15</strong></div><div class="metric"><span>Explanation</span><strong>${r.explanation}/10</strong></div>${r.hintPenalty?`<div class="metric"><span>Maya hint penalty</span><strong>-${r.hintPenalty}</strong></div>`:''}</div><div style="margin-top:26px"><div class="eyebrow">What went wrong?</div><h2 style="margin-top:8px">Learn from your investigation</h2><p class="sub">Instead of only telling you that something needs improvement, Maya explains exactly what the evidence showed and what you could do differently.</p>${items.join('')}</div><div style="margin-top:28px"><button class="primary" data-restart="1">Run the incident again</button></div>`);
}

function speak(text,lang){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=lang||'en-IN';u.rate=.96;speechSynthesis.speak(u);}
function listen(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){alert('Voice input is supported in Chrome or Edge. Please use Chrome or Edge and allow microphone access.');return;}const r=new SR();r.lang=state.language;r.interimResults=false;r.continuous=false;const b=document.querySelector('[data-voice]');if(b)b.textContent='🎙 Listening…';r.onresult=e=>{const el=document.querySelector('#reasoning');if(el)el.value=e.results[0][0].transcript;};r.onerror=()=>{if(b)b.textContent='🎙 Speak your answer';};r.onend=()=>{const x=document.querySelector('[data-voice]');if(x)x.textContent='🎙 Speak your answer';};r.start();}

root.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-start')){reset();state.start();render();return;}
  if(b.hasAttribute('data-seminar')){reset();state.seminar=true;state.start();render();return;}
  if(b.dataset.check){state.investigate(b.dataset.check);render();return;}
  if(b.hasAttribute('data-diagnose')){state.stage='diagnose';render();return;}
  if(b.dataset.hypothesis){state.chooseHypothesis(b.dataset.hypothesis);render();return;}
  if(b.dataset.fix){state.chooseAction(b.dataset.fix);render();return;}
  if(b.hasAttribute('data-hint')){state.askHint();render();return;}
  if(b.hasAttribute('data-voice')){listen();return;}
  if(b.dataset.language){state.language=b.dataset.language;render();return;}
  if(b.dataset.speak){speak(b.dataset.speak,state.language);return;}
  if(b.hasAttribute('data-submit')){state.submitReasoning(document.querySelector('#reasoning')?.value||'');render();return;}
  if(b.hasAttribute('data-restart')){reset();render();return;}
  if(b.dataset.back){state.stage=b.dataset.back;render();}
});
render();
