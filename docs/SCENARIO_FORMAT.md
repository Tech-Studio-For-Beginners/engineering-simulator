# Engineering Simulator — Scenario Format

**Status:** MVP / Authoring reference

**Purpose:** Define a consistent, data-driven structure for creating Engineering Simulator incidents. New simulations should follow this format so the simulation engine can render scenarios without hardcoding each incident.

## Core principle

A simulation is an engineering problem, not a quiz.

The student should move through a realistic reasoning loop:

**Observe → Investigate → Compare evidence → Hypothesize → Test → Decide → Explain**

The scenario data controls the deterministic reality of the incident. Maya can guide the student's thinking, but she must not invent evidence or change the underlying facts.

## Recommended scenario structure

Each scenario should contain these logical sections:

```text
Scenario
├── Identity
│   ├── id
│   ├── title
│   ├── subject
│   ├── difficulty
│   └── estimatedTime
│
├── Learning
│   ├── targetAudience
│   ├── skills
│   └── learningObjectives
│
├── Incident
│   ├── opening
│   ├── context
│   ├── initialState
│   └── objective
│
├── Investigation
│   ├── startingChoices
│   ├── evidence
│   └── investigationRules
│
├── Diagnosis
│   ├── hypothesisChoices
│   └── correctHypothesis
│
├── Resolution
│   ├── actionChoices
│   ├── correctAction
│   └── verification
│
├── Mentor
│   └── hints
│
├── Assessment
│   └── scoringRules
│
└── Reinforcement
    ├── keyConcepts
    └── learningResources
```

## Example: Incident #001

```javascript
const scenario = {
  id: "incident-001",
  title: "The Website Is Down",
  subject: "Computer Networks",
  difficulty: "Intermediate",
  estimatedTime: "15–20 minutes",

  targetAudience: [
    "Final-year CSE",
    "AI & DS",
    "IT"
  ],

  skills: [
    "Networking fundamentals",
    "Systematic troubleshooting",
    "Evidence gathering",
    "Root-cause analysis",
    "Decision making",
    "Technical communication"
  ],

  learningObjectives: [
    "Trace the path of a web request",
    "Distinguish DNS, application, database, network and firewall failures",
    "Use evidence before forming a conclusion",
    "Connect a configuration change to an incident"
  ],

  incident: {
    opening: "Production website is unavailable.",
    context: "Users report that the customer portal is not loading.",
    initialState: {
      time: "09:17 AM",
      status: "Website unavailable"
    },
    objective: "Find the cause, restore the service, and explain the reasoning."
  },

  investigation: {
    startingChoices: [
      "dns",
      "web-server",
      "database",
      "firewall",
      "network"
    ],

    evidence: {
      dns: {
        result: "portal.company.com resolves to 203.0.113.25",
        status: "healthy"
      },
      "web-server": {
        result: "Running; CPU 23%; memory 61%; application running",
        status: "healthy"
      },
      database: {
        result: "42 connections; normal query latency; no connection errors",
        status: "healthy"
      },
      network: {
        result: "Web server reachable from internal network",
        status: "healthy"
      },
      firewall: {
        result: "ALLOW-HTTPS-PROD disabled; incoming TCP/443 blocked",
        status: "fault"
      }
    }
  },

  diagnosis: {
    hypothesisChoices: [
      "dns-failure",
      "web-app-crash",
      "database-unavailable",
      "https-blocked",
      "unknown"
    ],
    correctHypothesis: "https-blocked"
  },

  resolution: {
    actionChoices: [
      "restart-web-server",
      "restart-database",
      "change-dns",
      "re-enable-https-firewall-rule",
      "wait-and-monitor"
    ],
    correctAction: "re-enable-https-firewall-rule",
    verification: "Confirm external HTTPS access is restored."
  },

  mentor: {
    hints: [
      "Think about the path a user's request takes before the application can even talk to the database.",
      "You already know the web server is healthy. What could prevent the user's request from reaching it?",
      "Look at anything that controls incoming traffic."
    ]
  }
};
```

The example is illustrative. The production scenario data may use a different implementation shape as long as the same logical information is available to the engine.

## Scenario design rules

### 1. Every incident needs a real engineering story

A good scenario should have:

- A realistic initial symptom
- Multiple plausible causes
- Evidence that helps distinguish those causes
- A defensible root cause
- A remediation
- A way to verify the fix

Avoid scenarios where the correct answer is obvious from the opening screen.

### 2. Evidence must be deterministic

Evidence should come from the scenario definition or deterministic simulation logic.

**Do not let an LLM invent technical evidence.**

If a student checks the database twice, the database should not randomly become unhealthy because an AI model generated a different answer.

### 3. Multiple investigation paths are allowed

Students should be able to investigate in different orders.

The scenario should reward useful investigation rather than require one magical sequence of clicks.

A wrong first investigation should not automatically mean failure unless the scenario specifically makes that action dangerous or consequential.

### 4. Evidence should support competing hypotheses

Where practical, include evidence that rules out plausible alternatives.

For example:

- DNS healthy → DNS becomes less likely
- Web server healthy → application crash becomes less likely
- Database healthy → database outage becomes less likely
- Firewall shows HTTPS blocked → firewall becomes strongly supported

This teaches diagnosis rather than answer hunting.

### 5. Resolution should require a decision

The student should eventually choose an action based on the evidence.

The action should be specific enough that the simulator can determine whether it is appropriate.

### 6. Always include verification

Engineering does not end when the fix is applied.

A strong simulation should ask the student to verify that the system is actually healthy again.

### 7. Maya should guide, not solve

Hints should progress from broad thinking prompts to more direct conceptual guidance.

Suggested four levels:

1. **Socratic nudge** — asks what the student should examine
2. **Direction** — points toward a relevant system/component
3. **Concept explanation** — explains the relevant engineering concept
4. **Near-answer/reveal** — used only when the student is stuck

Using hints may reduce independence score according to the scoring model.

## Language support

Scenario content should be written so that the UI can support:

- English
- Tamil
- Tanglish
- Mixed English/Tamil
- Voice input

Technical identifiers such as `TCP/443`, `ALLOW-HTTPS-PROD`, IP addresses, commands and configuration names should remain technically precise even when surrounding explanation is translated.

The scenario should never require English fluency to discover the engineering solution.

## Assessment hooks

A scenario should expose enough structured data for the scoring engine to assess:

- Investigation quality
- Evidence usage
- Technical reasoning
- Decision making
- Explanation
- Hint usage
- Verification of the fix

Free-form reasoning can later be evaluated semantically by AI against a structured rubric, but the final score should remain auditable.

See `docs/SCORING.md` for the current scoring model.

## Authoring checklist

Before adding a new simulation, confirm:

- [ ] Unique scenario ID
- [ ] Subject and difficulty defined
- [ ] Target audience defined
- [ ] Learning objectives defined
- [ ] Realistic incident opening
- [ ] At least two plausible hypotheses
- [ ] Deterministic evidence
- [ ] Multiple reasonable investigation paths
- [ ] Clear root cause
- [ ] Specific remediation
- [ ] Post-fix verification
- [ ] Maya hints written progressively
- [ ] Scoring hooks defined
- [ ] Tamil/English/Tanglish support considered
- [ ] Learning/reinforcement resources identified
- [ ] Scenario tested from start to finish

## Future direction

Eventually, scenarios should be authored as data rather than custom UI code.

That will allow the project to grow from a handful of hand-built incidents into a broader engineering simulation library covering areas such as:

- Computer Networks
- DBMS
- Operating Systems
- Cybersecurity
- Software Testing
- DevOps
- AI & Data Science
- IoT / Embedded Systems
- Cloud Computing
- Other engineering disciplines mapped to the relevant curriculum

The long-term goal is a reusable **simulation engine + scenario library + AI engineering mentor**, rather than a collection of unrelated demos.
