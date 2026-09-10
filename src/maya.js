export function mayaMessage(stage,state,scenario){
 if(stage==="investigate") return "Where would you start? Don't worry about being right immediately — show me how you would investigate.";
 if(stage==="evidence") return state.investigations.length<2 ? "Good. Keep collecting evidence before committing to a cause. What else can you verify?" : "Now compare the evidence. Which component is actually showing abnormal behavior?";
 if(stage==="decision") return "You have observations now. Choose the hypothesis that best explains the evidence — not just the symptom.";
 if(stage==="reasoning") return "Before you finish, connect the timeline, the evidence, and your chosen action. Why does your action fix the user's problem?";
 if(stage==="learning") return "Nice. An engineer should be able to explain not only what was broken, but why the evidence points there.";
 return "I'm Maya. I won't give you the answer first. I'll help you reason your way to it.";
}
