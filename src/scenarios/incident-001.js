export const incident001 = {
  id: 'incident-001',
  title: 'THE WEBSITE IS DOWN',
  subject: 'Computer Networks',
  difficulty: 'Intermediate',
  time: '15–20 min',
  intro: "Your company operates an online customer portal. Users report that the website isn't loading. You are the engineer on call. Find the cause, restore the service, and explain your reasoning.",
  skills: [
    'Networking fundamentals',
    'Systematic troubleshooting',
    'Evidence gathering',
    'Root-cause analysis',
    'Decision making'
  ],
  visualMap: {
    title: 'Request path',
    subtitle: 'Build the system picture as you investigate.',
    nodes: [
      ['user', '👤', 'User', 'The customer making the request.'],
      ['dns', '🌐', 'DNS', 'Resolves portal.company.com to an IP address.'],
      ['firewall', '🔥', 'Firewall', 'Controls incoming HTTPS traffic.'],
      ['web', '🖥️', 'Web server', 'Hosts the customer portal.'],
      ['db', '🗄️', 'Database', 'Stores application data.']
    ],
    connections: [
      ['user', 'dns'],
      ['dns', 'firewall'],
      ['firewall', 'web'],
      ['web', 'db']
    ]
  },
  terminal: {
    title: 'Engineering Terminal',
    prompt: 'Use diagnostics to gather evidence. The terminal is simulated for this incident.',
    commands: [
      {
        id: 'nslookup',
        checkId: 'dns',
        match: [s => /^nslookup\s+portal\.company\.com$/.test(s), s => /^dig\s+portal\.company\.com$/.test(s)],
        output: 'Server: 10.0.0.2\nName: portal.company.com\nAddress: 203.0.113.25\n\nResolution: SUCCESS'
      },
      {
        id: 'ping',
        checkId: 'network',
        match: [s => /^ping\s+portal\.company\.com$/.test(s), s => /^ping\s+203\.0\.113\.25$/.test(s)],
        output: 'PING portal.company.com (203.0.113.25)\n64 bytes from 203.0.113.25: time=18 ms\n64 bytes from 203.0.113.25: time=17 ms\n\n2 packets transmitted, 2 received, 0% packet loss'
      },
      {
        id: 'curl',
        checkId: 'web',
        match: [s => /^curl\s+-i\s+https:\/\/portal\.company\.com\/?$/.test(s), s => /^curl\s+https:\/\/portal\.company\.com\/?$/.test(s)],
        output: 'curl: (28) Connection timed out\n\nThe HTTPS request did not receive a response.'
      },
      {
        id: 'web-status',
        checkId: 'web',
        match: [s => /^systemctl\s+status\s+webapp$/.test(s), s => /^systemctl\s+status\s+nginx$/.test(s)],
        output: '● webapp.service - Customer Portal\n   Active: active (running)\n   CPU: 23%\n   Memory: 61%\n   Errors: NONE'
      },
      {
        id: 'dbcheck',
        checkId: 'db',
        match: [s => /^dbcheck\s+--status$/.test(s)],
        output: 'Database: HEALTHY\nConnections: 42\nQuery latency: NORMAL\nConnection errors: NONE'
      },
      {
        id: 'firewall',
        checkId: 'firewall',
        match: [s => /^firewallctl\s+rules$/.test(s), s => /^firewallctl\s+status$/.test(s)],
        output: 'PORT     PROTOCOL    ACTION\n22       TCP         ALLOW\n80       TCP         ALLOW\n443      TCP         BLOCK\n\nLast configuration change: 09:10\nRule: ALLOW-HTTPS-PROD\nState: DISABLED'
      }
    ]
  },
  investigation: [
    ['dns', 'Check DNS', 'Verify that the hostname resolves to the expected server.'],
    ['web', 'Check the web server', 'Verify service health and resource usage.'],
    ['db', 'Check the database', 'Look for database health or connection problems.'],
    ['firewall', 'Check the firewall', 'Inspect rules controlling incoming traffic.'],
    ['network', 'Check network connectivity', 'Test whether the server is reachable from the internal network.']
  ],
  evidence: {
    dns: ['DNS check', 'portal.company.com → 203.0.113.25\nResolution: SUCCESS'],
    web: ['Web server health', 'Status: RUNNING\nCPU: 23%\nMemory: 61%\nApplication: RUNNING\nCrash/errors: NONE'],
    db: ['Database health', 'Status: HEALTHY\nConnections: 42\nQuery latency: NORMAL\nConnection errors: NONE'],
    firewall: ['Firewall audit', 'Last configuration change: 09:10\nRule: ALLOW-HTTPS-PROD\nState: DISABLED\nIncoming TCP/443: BLOCKED'],
    network: ['Network connectivity', 'Web server reachable from internal network.\nInternal connectivity: OK']
  },
  hypotheses: [
    ['dns', 'DNS is failing'],
    ['web', 'The web application crashed'],
    ['db', 'The database is unavailable'],
    ['firewall', 'HTTPS traffic is blocked before reaching the web server'],
    ['unknown', 'I don’t have enough evidence yet']
  ],
  actions: [
    ['restart', 'Restart the web server'],
    ['dns', 'Change the DNS record'],
    ['db', 'Restart the database'],
    ['firewall', 'Re-enable the ALLOW-HTTPS-PROD rule']
  ],
  correctHypothesis: 'firewall',
  correctAction: 'firewall',
  verification: 'Confirm external HTTPS access is restored.',
  hints: [
    'Think about the path a user’s request takes before the application can even talk to the database.',
    'You already know the web server is healthy. What could prevent the user’s request from reaching it?',
    'Look at anything that controls incoming traffic.'
  ],
  learningObjectives: [
    'Trace the path of a web request.',
    'Distinguish DNS, application, database, network and firewall failures.',
    'Use evidence before forming a conclusion.',
    'Connect a configuration change to an incident.'
  ]
};
