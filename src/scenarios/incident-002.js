export const incident002 = {
  id: 'incident-002',
  title: 'THE APPLICATION IS SLOW',
  subject: 'Software Systems & Performance',
  difficulty: 'Intermediate',
  time: '15–20 min',
  intro: 'The college student portal worked normally yesterday. Today, students report that some pages take a long time to load while others keep spinning. Registration is underway, and frustration is rising. The IT team says the application is up and no important changes were made. Investigate the symptoms, identify the likely bottleneck, and justify what you would do next.',
  skills: ['Performance troubleshooting', 'Evidence gathering', 'Systems thinking', 'Root-cause analysis', 'Decision making'],
  visualMap: {
    title: 'Student portal request path',
    subtitle: 'Compare the user experience with each system layer.',
    nodes: [
      ['users', '👥', 'Students', 'Students accessing the portal from different locations.'],
      ['edge', '🌐', 'Load balancer', 'Receives requests and routes them to application instances.'],
      ['app', '🖥️', 'Application', 'Handles portal pages and registration requests.'],
      ['db', '🗄️', 'Database', 'Stores student and registration data.'],
      ['cache', '⚡', 'Cache', 'Serves frequently requested data when available.']
    ],
    connections: [['users','edge'],['edge','app'],['app','db'],['app','cache']]
  },
  terminal: {
    title: 'Performance Diagnostics',
    prompt: 'Use the simulated diagnostics to establish the scope and locate the bottleneck before choosing a fix.',
    commands: [
      { id: 'scope', checkId: 'scope', match: [s => /^portalctl\s+slow-pages$/.test(s)], output: 'SLOW REQUESTS (last 15 min)\n/registration/submit  p95: 8.4 s  affected: 31%\n/course-search        p95: 6.9 s  affected: 28%\n/home                 p95: 420 ms affected: 2%\n\nPattern: slow behavior is concentrated in data-heavy pages, not every page.' },
      { id: 'users', checkId: 'users', match: [s => /^portalctl\s+user-impact$/.test(s)], output: 'User impact by access region\nCampus: 29% reporting slow pages\nOff-campus: 32% reporting slow pages\n\nImpact is similar across locations; no single campus network explains the pattern.' },
      { id: 'app', checkId: 'app', match: [s => /^appctl\s+status$/.test(s)], output: 'Application instances: 4/4 RUNNING\nCPU: 38–46%\nMemory: 54–62%\nRestart count: 0\n\nInstances are up and not showing resource saturation.' },
      { id: 'db', checkId: 'db', match: [s => /^dbctl\s+performance$/.test(s)], output: 'Database performance (last 15 min)\nConnection pool: 100/100 in use\nPool wait p95: 7.6 s\nQuery execution p95: 180 ms\nDB CPU: 41%\nSlow query alerts: none\n\nRequests are waiting for a connection; executed queries are generally fast.' },
      { id: 'cache', checkId: 'cache', match: [s => /^cachectl\s+stats$/.test(s)], output: 'Cache hit rate: 91% (normal baseline: 88–93%)\nEvictions: normal\nCache errors: none\n\nCache metrics do not indicate a new cache failure.' },
      { id: 'changes', checkId: 'changes', match: [s => /^deployctl\s+recent$/.test(s)], output: 'Recent changes\nNo application deployment in the last 24 hours.\nRegistration traffic increased 2.3x after registration opened at 09:00.\n\nTraffic change is confirmed; a software release is not.' }
    ]
  },
  investigation: [
    ['scope', 'Identify which pages are slow', 'Determine whether the problem affects every page or specific actions.'],
    ['users', 'Compare affected users', 'Check whether impact is limited to a location or shared across users.'],
    ['app', 'Check application instances', 'Look for crashes, saturation, or unhealthy instances.'],
    ['db', 'Inspect database performance', 'Separate query execution time from waiting for database connections.'],
    ['cache', 'Check cache behavior', 'Test whether cache misses or errors explain the slowdown.'],
    ['changes', 'Review recent changes and traffic', 'Check releases and demand changes around the start of the incident.']
  ],
  evidence: {
    scope: ['Slow-page distribution', 'Registration submit p95: 8.4 s; course search p95: 6.9 s; home page p95: 420 ms. Slowness is concentrated in data-heavy actions.'],
    users: ['User impact', 'Campus: 29% report slow pages. Off-campus: 32%. Similar impact across locations.'],
    app: ['Application health', '4/4 instances running. CPU 38–46%, memory 54–62%, no restart spike or resource saturation.'],
    db: ['Database connection pool', 'Pool: 100/100 connections in use. Pool wait p95: 7.6 s. Query execution p95: 180 ms. DB CPU: 41%. No slow-query alerts.'],
    cache: ['Cache health', '91% hit rate, within normal baseline. Evictions and errors normal.'],
    changes: ['Recent changes and demand', 'No deployment in the last 24 hours. Registration traffic increased 2.3x after opening at 09:00.']
  },
  hypotheses: [
    ['network', 'A campus network problem is slowing requests'],
    ['app', 'Application instances are overloaded or unhealthy'],
    ['db-query', 'Database queries have become unusually slow'],
    ['pool', 'The database connection pool is exhausted, making requests wait'],
    ['cache', 'A cache failure is forcing expensive repeated work'],
    ['unknown', 'I need more evidence before choosing a cause']
  ],
  actions: [
    ['restart', 'Restart all application instances'],
    ['scale-app', 'Add application instances immediately'],
    ['query', 'Optimize database queries immediately'],
    ['pool', 'Investigate connection usage and safely tune the database connection pool; validate under load'],
    ['cache', 'Clear and rebuild the cache'],
    ['unknown', 'Collect targeted traces and connection-level evidence before changing production']
  ],
  correctHypothesis: 'pool',
  correctAction: 'pool',
  verification: 'Re-run registration and course-search requests; confirm pool wait and p95 latency fall while database health and error rates remain acceptable.',
  hints: [
    'First establish whether all pages and all users are affected equally. What pattern do you see?',
    'The application instances are running and not saturated. Separate time spent executing a query from time spent waiting to get a connection.',
    'A busy database does not necessarily mean slow queries. Inspect connection-pool utilization and wait time.'
  ],
  learningObjectives: ['Establish the scope of a performance incident before changing systems.', 'Distinguish application saturation, query execution time, connection waiting, cache behavior, and network impact.', 'Use measurements to identify a bottleneck rather than guessing.', 'Choose a bounded remediation and define how to validate it.']
};
