# Engineering Simulator — Scoring Model

**Status:** MVP / Incident #001

**Purpose:** Document how the simulator currently evaluates a student's engineering investigation, so the scoring model can be reviewed and improved over time.

## Core principle

The simulator is intended to assess **engineering thinking**, not English proficiency.

A student should be able to explain their reasoning in **English, Tamil, Tanglish, or mixed language** without losing engineering points because of language fluency.

The current implementation is deterministic and intentionally simple. It is an MVP scoring model, not the final adaptive assessment system.

## Current 100-point model

| Area | Maximum | What it measures |
|---|---:|---|
| Investigation | 25 | How much relevant investigation the student performs |
| Evidence usage | 20 | Whether the student checks and uses useful evidence |
| Technical reasoning | 30 | Whether the explanation demonstrates engineering reasoning |
| Decision making | 15 | Whether the selected remediation is appropriate |
| Explanation | 10 | Whether the student actually explains their conclusion |
| **Total** | **100** | |

### 1. Investigation — 25 points

The current MVP awards points based on the number of distinct investigations performed.

- 1 investigation ≈ 8 points
- 2 investigations ≈ 17 points
- 3 or more investigations = 25 points

The intention is to encourage evidence gathering rather than immediate guessing.

### 2. Evidence usage — 20 points

The current implementation gives credit for investigating these particularly useful components:

- Web server
- Database
- Firewall

The student can earn the full 20 points by investigating all three useful evidence sources.

### 3. Technical reasoning — 30 points

The reasoning response is currently assessed against four engineering concepts:

| Reasoning element | Points |
|---|---:|
| Evidence used | 6 |
| Root cause identified | 8 |
| Evidence → cause connection | 8 |
| Action justified | 8 |
| **Total** | **30** |

The MVP currently uses a lightweight language-aware keyword/rubric check. This is deliberately transparent and deterministic while the product is being validated.

Example of strong reasoning:

> 09:10 firewall rule was disabled, so HTTPS traffic on port 443 was blocked. The web server is running and the database is healthy. Therefore I would re-enable the HTTPS firewall rule to restore access.

A strong Tamil/Tanglish explanation should receive equivalent engineering credit when it communicates the same ideas.

### 4. Decision making — 15 points

For Incident #001, the correct remediation is:

**Re-enable the `ALLOW-HTTPS-PROD` firewall rule.**

Selecting the correct remediation earns 15 points.

### 5. Explanation — 10 points

The MVP also checks whether the student provides a meaningful written/spoken explanation:

- 30+ characters → 10 points
- 10–29 characters → 6 points
- Under 10 characters → 2 points

This is a basic MVP check and should not be confused with semantic reasoning quality, which belongs in the Technical Reasoning category.

## Maya hint penalty

Maya is designed to guide students without simply giving them the answer.

Each hint currently applies a **5-point penalty** to the final score.

This is intended to preserve the value of independent investigation while still allowing students to ask for help.

## Wrong first investigation

An imperfect first investigation is **not automatically penalized**.

For example, a student who checks DNS first is not necessarily doing something wrong. The simulator should reward what the student learns and how they proceed from the evidence.

This supports the principle:

> **Investigate first. Diagnose from evidence.**

## Example scoring journey

A student:

1. Checks DNS
2. Checks web server
3. Checks firewall
4. Identifies firewall as the root cause
5. Re-enables the HTTPS rule
6. Gives a detailed explanation connecting the 09:10 change to the outage
7. Uses no Maya hints

This student should score close to the top of the range.

A student who immediately guesses the firewall, chooses the correct fix, but provides little evidence or reasoning should score lower. The simulator is intentionally designed to distinguish **getting the answer** from **showing engineering thinking**.

## Future scoring direction

The MVP scoring model is expected to evolve.

The long-term model should evaluate the quality of the engineering process:

**Observe → Investigate → Compare evidence → Hypothesize → Test → Decide → Explain**

Future versions may include:

- Evidence quality rather than evidence count
- Alternative hypotheses considered
- Logical consistency between observations and diagnosis
- Quality of test/verification choices
- Whether the student changes direction appropriately when evidence contradicts a hypothesis
- Root-cause depth
- Quality of remediation justification
- Post-fix verification
- Adaptive difficulty
- Skill-level tracking across simulations
- AI-assisted semantic reasoning assessment using a structured rubric

### Important future principle

AI may help interpret a student's free-form reasoning, but the system should keep the **final score structured and auditable**. The LLM should not be allowed to invent evidence or arbitrarily assign a final score.

## Language fairness

Engineering Simulator should measure engineering ability separately from language ability.

**English fluency = 0 scoring points.**

Students may use:

- English
- Tamil
- Tanglish
- Mixed English/Tamil
- Voice input
- Typed input

The goal is to answer the engineering question, not to pass an English communication test.

## Why this document exists

This file is a reference point for future development. When the scoring model changes, update this document in the same commit as the scoring implementation where practical.
