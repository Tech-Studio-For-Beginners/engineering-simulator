export function scoreRun(scenario,state){
 const checks=state.checks || [];
 const investigation=25*Math.min(checks.length/3,1);
 const evidence=20*Math.min(checks.filter(id=>['web','db','firewall'].includes(id)).length/3,1);
 const reasoningText=(state.reasoning||'').toLowerCase();
 const reasoningSignals=['firewall','https','443','block','blocked','traffic','09:10','web server','database','healthy'];
 const reasoning=Math.round(30*Math.min(reasoningSignals.filter(x=>reasoningText.includes(x)).length/4,1));
 const decision=(state.action===scenario.correctAction?15:0);
 const explanation=Math.min(10,Math.round((state.reasoning||'').trim().length/18));
 const raw=Math.round(investigation+evidence+reasoning+decision+explanation);
 const score=Math.max(0,Math.min(100,raw-5*state.hints));
 return {score,investigation:Math.round(investigation),evidence:Math.round(evidence),reasoning,decision,explanation,hintPenalty:5*state.hints};
}
