# Engineering Simulator

**The simulator where engineering students learn to THINK like engineers.**

An experiential engineering learning platform built around realistic incidents, evidence gathering, hypotheses, decisions, and an AI mentor named **Maya**.

## MVP goals

- Progressive, one-decision-at-a-time learning flow
- Curriculum-friendly engineering incidents
- Evidence-based troubleshooting
- Deterministic scenario outcomes and scoring
- Maya as a Socratic AI mentor (hints should guide, not immediately reveal)
- Support for English, Tamil, and Tanglish UI/reasoning input in later iterations
- Voice input in a later browser/API layer

## Current prototype

### Incident #001 — The Website Is Down

A production customer portal is unavailable. Students investigate DNS, the web server, database, network connectivity, and firewall evidence before selecting a root cause and remediation.

**Root cause:** an inbound HTTPS firewall rule was disabled after a 09:10 configuration change.

### Scoring model

- Investigation — 25
- Evidence usage — 20
- Technical reasoning — 30
- Decision making — 15
- Explanation — 10

English fluency is intentionally not a scoring criterion.

## Architecture direction

The simulator is data-driven. Scenario data defines the incident, investigation options, evidence, hypotheses, actions, hints, learning questions, and scoring rubric. The UI/engine renders that data rather than hard-coding individual simulations.

Future versions can add an API, persistence, authentication, AI mentor service, faculty authoring studio, skill graph, and analytics without replacing the scenario engine.

## Local run

This MVP is plain HTML/CSS/JavaScript. Open `index.html` in a browser, or serve the repository with any static HTTP server.
