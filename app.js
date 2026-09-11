import { incident001 } from './src/scenarios/incident-001.js';
import { Simulator } from './src/engine.js';

const scenario = incident001;
const state = new Simulator(scenario);
const root = document.querySelector('#app');

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const reset = () => state.reset();

function progress(){
  const p={intro:0,investigate:20,evidence:40,diagnose:60,action:75,explain:88,results:100}[state.stage] ?? 0;
  return `<div class="progress"><div style="width:${p}%"></div></div>`;
}

function maya(){
  let m='I’m Maya. I won’t give you the answer first. I’ll help you reason your way to it.';
  if(state.stage==='investigate')m='Where would you start? Don’t worry about being right immediately — show me how you would investigate.';
  if(state.stage==='evidence')m=state.checks.length<2?'Good. Keep collecting evidence before committing to a cause. What else can you verify?':'Now compare the evidence. Which component is actually showing abnormal behavior?';
  if(state.stage==='diagnose')m='Choose the hypothesis that best explains the evidence — not just the symptom.';
  if(state.stage==='action')m='What action would restore service based on your diagnosis?';
  if(state.stage==='explain')m='Connect the timeline, evidence, root cause and action. English, Tamil, Tanglish or mixed language is fine.';
  return `<div class="maya"><img class="maya-avatar" src="src/maya/avatar.svg" alt="Maya"><div class="maya-copy"><div class="maya-name">Maya · Engineering Mentor</div><div class="maya-text">${esc(m)}</div><button class="speak" data-speak="${esc(m)}">🔊 Hear Maya</button></div></div>`;
}

function shell(content){root.innerHTML=progress()+`<section class="card">${content}${maya()}</section>`;}
function back(label,stage){return `<button class="secondary" data-back="${stage}">← ${label}</button>`;}

function render(){
  if(state.stage==='intro')return shell(`<div class="eyebrow">${esc(scenario.subject)} · ${esc(scenario.difficulty)}</div><h1 class="title">${esc(scenario.title)}</h1><p class="sub">${esc(scenario.intro)}</p><div class="meta">${scenario.skills.map(x=>`<span class="tag">${esc(x)}</span>`).join('')}<span class="tag">${esc(scenario.time)}</span></div><div class="row"><button class="primary" data-start="1">Start investigation</button><button class="secondary" data-seminar="1">Seminar mode</button></div>`);

  if(state.stage==='investigate')return shell(`<div class="eyebrow">Step 1 · Investigate${state.seminar?' · Seminar mode':''}</div><h2>Where do you start?</h2><p class="sub">Pick one check. There is no penalty for an imperfect first move — the important thing is how you investigate.</p><div class="actions">${scenario.investigation.map(x=>`<button class="choice" data-check="${x[0]}"><strong>${esc(x[1])}</strong><span>${esc(x[2])}</span></button>`).join('')}</div>`);

  if(state.stage==='evidence')return shell(`<div class="eyebrow">Step 2 · Gather evidence</div><h2>What did you find?</h2><p class="sub">Review the result, then choose another investigation. Build the picture before you diagnose.</p>${state.checks.map(id=>`<div class="evidence"><h3>${esc(scenario.evidence[id][0])}</h3><pre>${esc(scenario.evidence[id][1])}</pre></div>`).join('')}<div class="actions">${scenario.investigation.filter(x=>!state.checks.includes(x[0])).map(x=>`<button class="choice" data-check="${x[0]}"><strong>${esc(x[1])}</strong><span>${esc(x[2])}</span></button>`).join('')}<button class="primary" data-diagnose="1">I’m ready to form a hypothesis</button>${back('Back to investigation','investigate')}</div>`);

  if(state.stage==='diagnose')return shell(`<div class="eyebrow">Step 3 · Diagnose</div><h2>What is the most likely cause?</h2><p class="sub">Choose the explanation that best fits the evidence you collected.</p><div class="actions">${scenario.hypotheses.map(x=>`<button class="choice" data-hypothesis="${x[0]}"><strong>${esc(x[1])}</strong></button>`).join('')}${back('Back to evidence','evidence')}</div>`);

  if(state.stage==='action')return shell(`<div class="eyebrow">Step 4 · Restore</div><h2>What would you do?</h2><p class="sub">Select the action that should restore service.</p><div class="actions">${scenario.actions.map(x=>`<button class="choice" data-action-choice="${x[0]}"><strong>${esc(x[1])}</strong></button>`).join('')}${back('Back to diagnosis','diagnose')}</div>`);

  if(state.stage==='explain')return shell(`<div class="eyebrow">Step 5 · Explain your reasoning</div><h2>Explain it in your own language.</h2><p class="sub">Tell Maya what you found, why you think it caused the problem, and why your chosen action will fix it.</p><div style="margin-top:18px"><div style="font-size:13px;font-weight:750;margin-bottom:8px">Choose your language</div><div class="row"><button class="${state.language==='en-IN'?'primary':'secondary'}" data-language="en-IN">🇬🇧 English</button><button class="${state.language==='ta-IN'?'primary':'secondary'}" data-language="ta-IN">தமிழ்</button></div><p style="font-size:12px;color:#6b7280;margin:10px 0 0">Your language does not affect your engineering score.</p></div><div style="margin-top:18px;padding:14px 16px;border:1px solid #dbe4f5;border-radius:12px;background:#f8faff"><strong>🎙 Speak or type your answer</strong><p style="margin:6px 0 0;color:#5b6574;font-size:13px">You do not need perfect English. Explain the engineering reasoning in the language you are most comfortable with.</p></div><textarea id="reasoning" placeholder="${state.language==='ta-IN'?'உங்கள் முடிவை தமிழில் விளக்குங்கள்...':'Example: 09:10 firewall rule was disabled, so HTTPS traffic on port 443 was blocked...'}">${esc(state.reasoning)}</textarea><div class="row" style="margin-top:12px"><button class="primary" data-submit="1">Submit reasoning</button><button class="secondary" id="voiceButton" data-voice="1">🎙 Speak your answer</button><button class="secondary" data-hint="1">Ask Maya for a hint</button></div>${state.hints?`<p class="hint">Hint: ${esc(scenario.hints[state.hints-1])}</p>`:''}${back('Back to action','action')}`);

  const hasFirewall=state.checks.includes('firewall');
  let score=40+(state.checks.length>=3?20:10)+(hasFirewall?5:0)+(state.hypothesis===scenario.correctHypothesis?10:0)+(state.action===scenario.correctAction?15:0)+(state.reasoning.length>=30?10:state.reasoning.length>=10?6:2)-state.hints*5;
  score=Math.max(0,Math.min(100,score));
  return shell(`<div class="eyebrow">Incident complete</div><h2>Investigation complete.</h2><div class="score">${score}<small>/100</small></div><div class="success">Root cause: HTTPS traffic was blocked by the firewall.</div><div style="margin-top:20px;color:#4b5563">Your diagnosis: <strong>${esc(state.hypothesis||'—')}</strong><br>Your action: <strong>${esc(state.action||'—')}</strong><br>Your response language: <strong>${state.language==='ta-IN'?'Tamil':'English'}</strong></div><div style="margin-top:26px;padding:16px;border:1px solid #dbe4f5;border-radius:12px;background:#f8faff"><h3>Reasoning assessment</h3><p style="color:#5b6574;font-size:13px">We assess engineering reasoning, not English or Tamil fluency.</p><div class="metric"><span>Evidence used</span><strong>${hasFirewall?'✓':'Needs improvement'}</strong></div><div class="metric"><span>Root cause</span><strong>${state.hypothesis===scenario.correctHypothesis?'✓':'Needs improvement'}</strong></div><div class="metric"><span>Correct action</span><strong>${state.action===scenario.correctAction?'✓':'Needs improvement'}</strong></div></div><button class="primary" data-restart="1" style="margin-top:24px">Run the incident again</button>`);
}

function speak(text,lang){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=lang||'en-IN';u.rate=.96;speechSynthesis.speak(u);}
function listen(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){alert('Voice input is supported in Chrome or Edge. Please use Chrome or Edge and allow microphone access.');return;}const r=new SR();r.lang=state.language;r.interimResults=false;r.continuous=false;const b=document.querySelector('#voiceButton');if(b)b.textContent='🎙 Listening…';r.onresult=e=>{const el=document.querySelector('#reasoning');if(el)el.value=e.results[0][0].transcript;};r.onerror=()=>{if(b)b.textContent='🎙 Speak your answer';};r.onend=()=>{const x=document.querySelector('#voiceButton');if(x)x.textContent='🎙 Speak your answer';};r.start();}

root.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-start')){reset();state.start();render();return;}
  if(b.hasAttribute('data-seminar')){reset();state.seminar=true;state.start();render();return;}
  if(b.dataset.check){state.investigate(b.dataset.check);render();return;}
  if(b.hasAttribute('data-diagnose')){state.stage='diagnose';render();return;}
  if(b.dataset.hypothesis){state.chooseHypothesis(b.dataset.hypothesis);render();return;}
  if(b.dataset.actionChoice){state.chooseAction(b.dataset.actionChoice);render();return;}
  if(b.hasAttribute('data-hint')){state.askHint();render();return;}
  if(b.hasAttribute('data-voice')){listen();return;}
  if(b.dataset.language){state.language=b.dataset.language;render();return;}
  if(b.dataset.speak){speak(b.dataset.speak,state.language);return;}
  if(b.hasAttribute('data-submit')){state.submitReasoning(document.querySelector('#reasoning')?.value||'');render();return;}
  if(b.hasAttribute('data-restart')){reset();render();return;}
  if(b.dataset.back){state.stage=b.dataset.back;render();}
});

render();
