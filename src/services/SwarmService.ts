import { Agent, Message } from '../types';

const AGENTS: Agent[] = [
  { id: 'agent-1', name: 'Architect', color: '#FF5733', role: 'System Design' },
  { id: 'agent-2', name: 'Engineer', color: '#33FF57', role: 'Implementation' },
  { id: 'agent-3', name: 'Security', color: '#3357FF', role: 'Hardening' },
];

export const SwarmService = {
  getAgents: () => AGENTS,
  
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