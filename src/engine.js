import { incident001 } from './scenarios/incident-001.js';

export const scenarios = {
  [incident001.id]: incident001
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
    this.investigations = [];
    this.hints = 0;
    this.hypothesis = null;
    this.action = null;
    this.reasoning = '';
    this.language = 'en-IN';
    this.seminar = false;
  }

  start() { this.stage = 'investigate'; }

  investigate(id) {
    if (!this.investigations.includes(id)) this.investigations.push(id);
    this.stage = 'evidence';
  }

  chooseHypothesis(id) {
    this.hypothesis = id;
    this.stage = 'action';
  }

  chooseAction(id) {
    this.action = id;
    this.stage = 'reasoning';
  }

  askHint() {
    this.hints = Math.min(this.hints + 1, this.scenario.hints.length);
    return this.scenario.hints[this.hints - 1];
  }

  submitReasoning(text) {
    this.reasoning = (text || '').trim();
    this.stage = 'results';
  }

  finish() { this.stage = 'results'; }
}
