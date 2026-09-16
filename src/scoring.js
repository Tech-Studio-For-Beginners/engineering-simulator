export function scoreRun(scenario, state) {
  const checks = state.checks || [];
  const evidenceIds = Object.keys(scenario.evidence || {});
  const checkedEvidence = checks.filter(id => evidenceIds.includes(id));
  const investigation = Math.round(25 * Math.min(checkedEvidence.length / Math.min(3, Math.max(1, evidenceIds.length)), 1));
  const evidence = Math.round(20 * Math.min(checkedEvidence.length / Math.min(3, Math.max(1, evidenceIds.length)), 1));

  const reasoningText = (state.reasoning || '').toLowerCase();
  const scenarioText = [
    scenario.title,
    scenario.intro,
    ...Object.values(scenario.evidence || {}).flat(),
    ...(scenario.hypotheses || []).flat(),
    ...(scenario.actions || []).flat()
  ].join(' ').toLowerCase();
  const candidates = [...new Set((scenarioText.match(/[a-z0-9][a-z0-9-]{2,}/g) || []))]
    .filter(word => !['the','and','for','with','that','from','your','you','are','was','were','into','before','after','what','when','then','this','not','all','some','has','have','does','doesn','would','could','should'].includes(word));
  const signals = candidates.filter(word => reasoningText.includes(word));
  const reasoning = Math.round(30 * Math.min(signals.length / 5, 1));
  const decision = state.action === scenario.correctAction ? 15 : 0;
  const explanation = Math.min(10, Math.round((state.reasoning || '').trim().length / 18));
  const hintPenalty = 5 * (state.hints || 0);
  const raw = investigation + evidence + reasoning + decision + explanation;
  const score = Math.max(0, Math.min(100, Math.round(raw - hintPenalty)));

  return { score, investigation, evidence, reasoning, decision, explanation, hintPenalty };
}
