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
