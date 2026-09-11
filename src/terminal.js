export function createTerminalState(){
  return { history: [], commandsUsed: [], attempts: 0 };
}

export function runDiagnosticCommand(scenario, state, rawCommand){
  const input=(rawCommand||'').trim();
  if(!input) return {ok:false,output:'Type a diagnostic command first.'};

  const normalized=input.toLowerCase().replace(/\s+/g,' ').trim();
  const command=scenario.terminal?.commands?.find(item=>item.match.some(pattern=>pattern(normalized)));

  state.terminal.attempts += 1;

  if(!command){
    const output=`command not found: ${input}\n\nMaya: What information are you trying to obtain? Think about the component or layer you want to investigate, then choose a tool that can provide that evidence.`;
    state.terminal.history.push({input,output,ok:false});
    return {ok:false,output};
  }

  if(!state.checks.includes(command.checkId)) state.checks.push(command.checkId);
  if(!state.terminal.commandsUsed.includes(command.id)) state.terminal.commandsUsed.push(command.id);
  state.terminal.history.push({input,output:command.output,ok:true,checkId:command.checkId});
  return {ok:true,output:command.output,checkId:command.checkId};
}
