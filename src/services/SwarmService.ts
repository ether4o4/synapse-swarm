import { Agent, Message } from '../types';

const AGENTS: Agent[] = [
  { id: 'agent-1', name: 'Architect', color: '#FF5733', role: 'System Design' },
  { id: 'agent-2', name: 'Engineer', color: '#33FF57', role: 'Implementation' },
  { id: 'agent-3', name: 'Security', color: '#3357FF', role: 'Hardening' },
];

export const SwarmService = {
  getAgents: () => AGENTS,

  getTargetedAgents: (text: string): Agent[] => {
    const mentions = SwarmService.parseMentions(text);
    if (mentions.length > 0) {
      return AGENTS.filter(a => mentions.some(m => m.toLowerCase() === a.name.toLowerCase()));
    }
    if (text.toLowerCase().includes('swarm')) {
      return AGENTS;
    }
    return [AGENTS[0]]; // Default to Architect
  },

  getAgentResponse: async (text: string, agent: Agent): Promise<Message> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const responseText = `[${agent.role}] I've analyzed your request: "${text}". Here's my perspective...`;
    return SwarmService.processMessage(responseText, agent.id, true);
  },
  
  processMessage: (text: string, senderId: string = 'user', isAgent: boolean = false): Message => {
    return {
      id: Math.random().toString(36).substring(7),
      text,
      senderId,
      timestamp: Date.now(),
      isAgent,
    };
  },
  
  parseMentions: (text: string): string[] => {
    const mentions = text.match(/@(\w+)/g);
    return mentions ? mentions.map(m => m.substring(1)) : [];
  }
};