const root = document.querySelector('#app');

const esc = value => String(value).replace(/[&<>\"']/g, c => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'
}[c]));

function lastStudentMessage() {
  const messages = [...document.querySelectorAll('.maya-message.student')];
  return messages.length ? messages[messages.length - 1].textContent.trim().toLowerCase() : '';
}

function mayaDialogue(text) {
  const t = text.toLowerCase();
  const previous = lastStudentMessage();
  const asksForCommand = /\b(command|syntax|what do i type|how do i check|how to check|which command)\b/.test(t);

  // Command help comes before broad topic coaching, so students asking for syntax get it.
  if (asksForCommand && /\b(firewall|firewall rules|security rules)\b/.test(t)) {
    return 'On a typical Linux server, you can inspect firewall rules with `sudo iptables -S`. If the system uses UFW, try `sudo ufw status verbose`; on systems using nftables, try `sudo nft list ruleset`. These are real Linux examples, but this incident terminal is simulated and may support only its own listed commands. Look for inbound HTTPS (TCP/443) rules, then compare with recent changes. What evidence would show that a rule is blocking the request?';
  }

  if (asksForCommand && /\b(dns|domain|resolve|hostname)\b/.test(t)) {
    return 'Try `nslookup portal.company.com` to check name resolution. You can also use `dig portal.company.com` on systems where dig is installed. Compare the returned address with the expected IP; a successful lookup makes a DNS failure less likely, but does not prove the whole site is reachable.';
  }

  if (asksForCommand && /\b(web server|http|https|website|curl|endpoint)\b/.test(t)) {
    return 'To test an HTTPS endpoint, try `curl -I https://portal.company.com` (or `curl -v https://portal.company.com` for more connection detail). A timeout, connection refusal, and HTTP error point to different parts of the path. This terminal is simulated, so use the commands it supports.';
  }

  if (asksForCommand && /\b(database|db|sql)\b/.test(t)) {
    return 'There is no single database-health command that works for every engine. First identify the database type and available access. In this incident, inspect the database component or use the simulated terminal’s documented database diagnostic command; check service health, connection errors, and recent changes.';
  }

  if ((t.includes('dns') || t.includes('domain')) && !previous.includes('dns')) {
    return 'That is a reasonable hypothesis. Before we call it the cause, what evidence could you collect to test whether DNS is actually failing?';
  }

  if ((t.includes('proper ip') || t.includes('correct ip') || t.includes('resolves') || t.includes('resolve') || t.includes('issue could be somewhere else') || t.includes('something else')) && (previous.includes('dns') || t.includes('dns'))) {
    return 'Exactly. That is good elimination reasoning. If DNS resolves to the expected IP, DNS becomes less likely to be the cause. Now test the next part of the path: can the request actually reach the web server, and is the server healthy?';
  }

  if (t.includes('web server') || t.includes('server is reachable') || t.includes('server reachable')) {
    return 'Good. What evidence would tell you whether the web server is reachable and healthy? Think about connectivity, process status, CPU, memory, or application health.';
  }

  if (t.includes('curl') && (t.includes('timeout') || t.includes('timed out'))) {
    return 'You have evidence of an HTTPS timeout. Does that prove the web server itself is down, or could something earlier in the request path be preventing the connection?';
  }

  if (t.includes('firewall')) {
    return 'That is worth testing. What evidence would confirm that the firewall is actually affecting the incoming HTTPS request? Look for the rule state and recent configuration changes.';
  }

  if (t.includes('database') || t.includes('db')) {
    return 'What evidence would make the database a credible cause? If the database is healthy, what alternative causes can you eliminate?';
  }

  if (t.includes('dns')) {
    return 'Good hypothesis. Test it rather than committing to it. What does the DNS lookup tell you?';
  }

  if (t.includes('help') || t.includes('hint')) {
    return 'Tell me what you have observed so far. I will help you choose the next useful test without giving away the root cause.';
  }

  if (previous) {
    return 'Good — keep building from the evidence you already have. What does your latest observation allow you to rule out, and what should you test next?';
  }

  return 'Tell me what you observed and what you are considering next. I will help you test the reasoning without giving away the answer.';
}

function appendMessage(role, text) {
  const chat = document.querySelector('.maya-chat');
  if (!chat) return;
  const message = document.createElement('div');
  message.className = `maya-message ${role}`;
  message.textContent = text;
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

root?.addEventListener('submit', event => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.matches('[data-maya-form]')) return;

  event.preventDefault();
  event.stopImmediatePropagation();

  const input = form.querySelector('#maya-input');
  const text = input?.value?.trim() || '';
  if (!text) return;

  appendMessage('student', text);
  appendMessage('maya', mayaDialogue(text));
  input.value = '';
  requestAnimationFrame(() => {
    const next = document.querySelector('#maya-input');
    next?.focus();
    const chat = document.querySelector('.maya-chat');
    if (chat) chat.scrollTop = chat.scrollHeight;
  });
}, true);
