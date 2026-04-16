import { Agent, Message } from '../types';
import { SwarmService } from './SwarmService';

export const ExecutionEngine = {
  // Orchestrates the parallel execution of agent tasks
  execute: async (
    text: string,
    onAgentStart: (agentId: string) => void,
    onAgentMessage: (msg: Message) => void,
    onAgentEnd: (agentId: string) => void
  ) => {
    const targetedAgents = SwarmService.getTargetedAgents(text);
    if (targetedAgents.length === 0) return;

    // Run agents in parallel
    const tasks = targetedAgents.map(async (agent) => {
      onAgentStart(agent.id);
      try {
        const response = await SwarmService.getAgentResponse(text, agent);
        onAgentMessage(response);

        // Agent-to-Agent Interaction Simulation
        // If multiple agents are involved, they can react to each other
        if (targetedAgents.length > 1 && Math.random() > 0.7) {
          const others = targetedAgents.filter(a => a.id !== agent.id);
          const reactor = others[Math.floor(Math.random() * others.length)];
          
          // Small delay for the "observation"
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          onAgentStart(reactor.id);
          const reactionText = `[Observation] Building on ${agent.name}'s point: the ${agent.role} perspective is crucial here. I'll adjust my output to align.`;
          const reaction = SwarmService.processMessage(reactionText, reactor.id, true);
          onAgentMessage(reaction);
          onAgentEnd(reactor.id);
        }
      } finally {
        onAgentEnd(agent.id);
      }
    });

    await Promise.all(tasks);
  }
};