import { incident001 } from './scenarios/incident-001.js?v=20260911-15';
import { incident002 } from './scenarios/incident-002.js';

export const scenarios = {
  [incident001.id]: incident001,
  [incident002.id]: incident002
};

export function getScenario(id = 'incident-001') {
  return scenarios[id] || incident001;
}

export class Simulator {
  constructor(scenario = incident001) {
    this.scenario = scenario;
    this.reset();
  }

  reset() {
    this.stage = 'intro';
    this.checks = [];
    this.hypothesis = null;
    this.action = null;
    this.reasoning = '';
    this.language = 'en-IN';
    this.hints = 0;
    this.seminar = false;
    this.terminal = { history: [], commandsUsed: [], attempts: 0 };
  }

  start() { this.stage = 'investigate'; }
  investigate(id) {
    if (!this.checks.includes(id)) this.checks.push(id);
    this.stage = 'evidence';
  }
  chooseHypothesis(id) { this.hypothesis = id; this.stage = 'action'; }
  chooseAction(id) { this.action = id; this.stage = 'reasoning'; }
  askHint() {
    const hints = this.scenario.hints || [];
    this.hints = Math.min(this.hints + 1, hints.length);
    return hints[this.hints - 1] || '';
  }
  submitReasoning(text) {
    this.reasoning = (text || '').trim();
    this.stage = 'results';
  }
}
