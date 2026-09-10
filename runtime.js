(function () {
  'use strict';

  var root = document.getElementById('app');
  if (!root) return;

  var state = {
    stage: 'intro',
    checks: [],
    hypothesis: '',
    action: '',
    reasoning: '',
    hints: 0,
    seminar: false
  };

  var checks = [
    ['dns', 'Check DNS', 'Verify that the hostname resolves to the expected server.'],
    ['web', 'Check the web server', 'Verify service health and resource usage.'],
    ['db', 'Check the database', 'Look for database health or connection problems.'],
    ['firewall', 'Check the firewall', 'Inspect rules controlling incoming traffic.'],
    ['network', 'Check network connectivity', 'Test whether the server is reachable from the internal network.']
  ];

  var evidence = {
    dns: ['DNS check', 'portal.company.com → 203.0.113.25\nResolution: SUCCESS'],
    web: ['Web server health', 'Status: RUNNING\nCPU: 23%\nMemory: 61%\nApplication: RUNNING\nCrash/errors: NONE'],
    db: ['Database health', 'Status: HEALTHY\nConnections: 42\nQuery latency: NORMAL\nConnection errors: NONE'],
    firewall: ['Firewall audit', 'Last configuration change: 09:10\nRule: ALLOW-HTTPS-PROD\nState: DISABLED\nIncoming TCP/443: BLOCKED'],
    network: ['Network connectivity', 'Web server reachable from internal network.\nInternal connectivity: OK']
  };

  var hypotheses = [
    ['dns', 'DNS is failing'],
    ['web', 'The web application crashed'],
    ['db', 'The database is unavailable'],
    ['firewall', 'HTTPS traffic is blocked before reaching the web server'],
    ['unknown', 'I do not have enough evidence yet']
  ];

  var actions = [
    ['restart', 'Restart the web server'],
    ['dns', 'Change the DNS record'],
    ['db', 'Restart the database'],
    ['firewall', 'Re-enable the ALLOW-HTTPS-PROD rule']
  ];

  function esc(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function progress() {
    var p = { intro: 0, investigate: 20, evidence: 40, diagnose: 60, action: 75, explain: 88, results: 100 }[state.stage] || 0;
    return '<div class="progress"><div style="width:' + p + '%"></div></div>';
  }

  function maya() {
    var message = 'I am Maya. I will help you reason through the incident instead of giving you the answer.';
    if (state.stage === 'investigate') message = 'Where would you start? Pick one check and show me how you would investigate.';
    if (state.stage === 'evidence') message = state.checks.length < 2 ? 'Good. Keep collecting evidence before committing to a cause.' : 'Now compare the evidence. Which component is actually abnormal?';
    if (state.stage === 'diagnose') message = 'Choose the hypothesis that best explains the evidence, not just the symptom.';
    if (state.stage === 'action') message = 'What action would restore service based on your diagnosis?';
    if (state.stage === 'explain') message = 'Connect the timeline, evidence, root cause and action. English, Tamil, Tanglish or mixed language is fine.';
    return '<div class="maya"><div class="maya-avatar" style="display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px">M</div><div class="maya-copy"><div class="maya-name">Maya · Engineering Mentor</div><div class="maya-text">' + esc(message) + '</div></div></div>';
  }

  function frame(html) {
    root.innerHTML = progress() + '<section class="card">' + html + maya() + '</section>';
  }

  function render() {
    var html = '';
    if (state.stage === 'intro') {
      html = '<div class="eyebrow">Production incident · Intermediate</div>' +
        '<h1 class="title">THE WEBSITE IS DOWN</h1>' +
        '<p class="sub">Your company operates an online customer portal. Users report that the website is not loading. You are the engineer on call. Find the cause, restore the service, and explain your reasoning.</p>' +
        '<div class="meta"><span class="tag">Networking</span><span class="tag">Troubleshooting</span><span class="tag">Root-cause analysis</span><span class="tag">15–20 min</span></div>' +
        '<div class="row"><button class="primary" data-action="start">Start investigation</button><button class="secondary" data-action="seminar">Seminar mode</button></div>';
    } else if (state.stage === 'investigate') {
      html = '<div class="eyebrow">Step 1 · Investigate' + (state.seminar ? ' · Seminar mode' : '') + '</div><h2>Where do you start?</h2><p class="sub">Pick one check. There is no penalty for an imperfect first move.</p><div class="actions">';
      checks.forEach(function (c) { html += '<button class="choice" data-check="' + c[0] + '"><strong>' + c[1] + '</strong><span>' + c[2] + '</span></button>'; });
      html += '</div>';
    } else if (state.stage === 'evidence') {
      html = '<div class="eyebrow">Step 2 · Gather evidence</div><h2>What did you find?</h2><p class="sub">Review the result, then choose another investigation.</p>';
      state.checks.forEach(function (id) { html += '<div class="evidence"><h3>' + evidence[id][0] + '</h3><pre>' + esc(evidence[id][1]) + '</pre></div>'; });
      html += '<div class="actions">';
      checks.forEach(function (c) { if (state.checks.indexOf(c[0]) === -1) html += '<button class="choice" data-check="' + c[0] + '"><strong>' + c[1] + '</strong><span>' + c[2] + '</span></button>'; });
      html += '<button class="primary" data-action="diagnose">I am ready to form a hypothesis</button></div>';
    } else if (state.stage === 'diagnose') {
      html = '<div class="eyebrow">Step 3 · Diagnose</div><h2>What is the most likely cause?</h2><p class="sub">Choose the explanation that best fits the evidence.</p><div class="actions">';
      hypotheses.forEach(function (h) { html += '<button class="choice" data-hypothesis="' + h[0] + '"><strong>' + h[1] + '</strong></button>'; });
      html += '</div>';
    } else if (state.stage === 'action') {
      html = '<div class="eyebrow">Step 4 · Restore</div><h2>What would you do?</h2><p class="sub">Select the action that should restore service.</p><div class="actions">';
      actions.forEach(function (a) { html += '<button class="choice" data-fix="' + a[0] + '"><strong>' + a[1] + '</strong></button>'; });
      html += '</div>';
    } else if (state.stage === 'explain') {
      html = '<div class="eyebrow">Step 5 · Explain your reasoning</div><h2>Tell Maya what happened.</h2><p class="sub">Connect the timeline, evidence, root cause and action. English, Tamil, Tanglish or mixed language is fine.</p><textarea id="reasoning" placeholder="Example: 09:10 firewall rule disable aayirukku..."></textarea><div class="row" style="margin-top:12px"><button class="primary" data-action="submit">Submit reasoning</button><button class="secondary" data-action="hint">Ask Maya for a hint</button></div>';
      if (state.hints) html += '<p class="hint">Hint: ' + esc(state.hints === 1 ? 'You already know the web server is healthy. What could prevent the user request from reaching it?' : 'Look at anything that controls incoming traffic.') + '</p>';
    } else {
      var correct = state.action === 'firewall' && state.hypothesis === 'firewall';
      var score = correct ? 100 : 55;
      if (state.checks.length < 3) score -= 15;
      score -= state.hints * 5;
      if (score < 0) score = 0;
      html = '<div class="eyebrow">Incident complete</div><h2>Investigation complete.</h2><div class="score">' + score + '<small>/100</small></div>' +
        '<div class="success">Root cause: HTTPS traffic was blocked by the firewall.</div>' +
        '<p class="sub">Your diagnosis: <strong>' + esc(state.hypothesis || 'not selected') + '</strong><br>Your action: <strong>' + esc(state.action || 'not selected') + '</strong></p>' +
        '<h3>Learning check</h3><ol><li>What is the difference between DNS resolution and network connectivity?</li><li>Why does a running web server not necessarily mean users can access it?</li><li>Why is the timeline of changes important during troubleshooting?</li></ol>' +
        '<button class="primary" data-action="restart">Run the incident again</button>';
    }
    frame(html);
  }

  root.addEventListener('click', function (event) {
    var button = event.target.closest('button');
    if (!button) return;
    var action = button.getAttribute('data-action');
    if (action === 'start' || action === 'seminar') {
      state.stage = 'investigate'; state.checks = []; state.hypothesis = ''; state.action = ''; state.reasoning = ''; state.hints = 0; state.seminar = action === 'seminar'; render(); return;
    }
    if (button.hasAttribute('data-check')) {
      var id = button.getAttribute('data-check');
      if (state.checks.indexOf(id) === -1) state.checks.push(id);
      state.stage = 'evidence'; render(); return;
    }
    if (action === 'diagnose') { state.stage = 'diagnose'; render(); return; }
    if (button.hasAttribute('data-hypothesis')) { state.hypothesis = button.getAttribute('data-hypothesis'); state.stage = 'action'; render(); return; }
    if (button.hasAttribute('data-fix')) { state.action = button.getAttribute('data-fix'); state.stage = 'explain'; render(); return; }
    if (action === 'hint') { state.hints = Math.min(state.hints + 1, 2); render(); return; }
    if (action === 'submit') { var box = document.getElementById('reasoning'); state.reasoning = box ? box.value : ''; state.stage = 'results'; render(); return; }
    if (action === 'restart') { state.stage = 'intro'; state.checks = []; state.hypothesis = ''; state.action = ''; state.reasoning = ''; state.hints = 0; state.seminar = false; render(); }
  });

  render();
})();
