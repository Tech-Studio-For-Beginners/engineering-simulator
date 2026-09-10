export class Simulator{
 constructor(scenario){this.scenario=scenario;this.reset()}
 reset(){this.stage="intro";this.investigations=[];this.hints=0;this.hypothesis=null;this.action=null;this.reasoning=""}
 start(){this.stage="investigate"}
 investigate(id){if(!this.investigations.includes(id))this.investigations.push(id);this.stage="evidence"}
 chooseHypothesis(id){this.hypothesis=id;this.stage="decision"}
 chooseAction(id){this.action=id;this.stage="reasoning"}
 askHint(){this.hints=Math.min(this.hints+1,this.scenario.hints.length);return this.scenario.hints[this.hints-1]}
 submitReasoning(text){this.reasoning=text.trim();this.stage="learning"}
 finish(){this.stage="results"}
}
