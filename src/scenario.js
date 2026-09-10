export const scenario={
 id:"incident-001-website-down",
 title:"THE WEBSITE IS DOWN",
 difficulty:"Intermediate",
 time:"15–20 min",
 skills:["Networking fundamentals","Systematic troubleshooting","Evidence gathering","Root-cause analysis","Decision making"],
 intro:"Your company operates an online customer portal. Users report that the website isn't loading. You are the engineer on call. Find the cause, restore the service, and explain your reasoning.",
 investigation:[
  {id:"dns",label:"Check DNS",detail:"Verify that the hostname resolves to the expected server."},
  {id:"web",label:"Check the web server",detail:"Verify service health and resource usage."},
  {id:"db",label:"Check the database",detail:"Look for database health or connection problems."},
  {id:"firewall",label:"Check the firewall",detail:"Inspect rules controlling incoming traffic."},
  {id:"network",label:"Check network connectivity",detail:"Test whether the server is reachable from the internal network."}
 ],
 evidence:{
  dns:{title:"DNS check",text:"portal.company.com → 203.0.113.25\nResolution: SUCCESS"},
  web:{title:"Web server health",text:"Status: RUNNING\nCPU: 23%\nMemory: 61%\nApplication: RUNNING\nCrash/errors: NONE"},
  db:{title:"Database health",text:"Status: HEALTHY\nConnections: 42\nQuery latency: NORMAL\nConnection errors: NONE"},
  network:{title:"Network connectivity",text:"Web server reachable from internal network.\nInternal connectivity: OK"},
  firewall:{title:"Firewall audit",text:"Last configuration change: 09:10\nRule: ALLOW-HTTPS-PROD\nState: DISABLED\nIncoming TCP/443: BLOCKED"}
 },
 hypotheses:[
  {id:"dns",label:"DNS is failing"},{id:"web",label:"The web application crashed"},{id:"db",label:"The database is unavailable"},{id:"firewall",label:"HTTPS traffic is blocked before reaching the web server"},{id:"unknown",label:"I don't have enough evidence yet"}
 ],
 correctHypothesis:"firewall",
 actions:[
  {id:"restart",label:"Restart the web server"},{id:"dns",label:"Change the DNS record"},{id:"db",label:"Restart the database"},{id:"firewall",label:"Re-enable the ALLOW-HTTPS-PROD rule"}
 ],
 correctAction:"firewall",
 hints:[
  "Think about the path a user's request takes before the application can even talk to the database.",
  "You already know the web server is healthy. What could prevent the user's request from reaching it?",
  "Look at anything that controls incoming traffic."
 ],
 learning:[
  "What is the difference between DNS resolution and network connectivity?",
  "Why doesn't a running web server necessarily mean users can access it?",
  "Why is the timeline of changes important during troubleshooting?"
 ]
};