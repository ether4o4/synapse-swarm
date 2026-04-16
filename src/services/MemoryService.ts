import { Message } from '../types';

export const MemoryService = {
  // Per-agent message history (isolated memory)
  agentMemory: new Map<string, Message[]>(),
  swarmMemory: [] as Message[],

  addToAgentMemory: (agentId: string, message: Message) => {
    const history = MemoryService.agentMemory.get(agentId) || [];
    history.push(message);
    // Keep last 20 messages for context
    MemoryService.agentMemory.set(agentId, history.slice(-20));
  },

  getAgentContext: (agentId: string): Message[] => {
    return MemoryService.agentMemory.get(agentId) || [];
  },

  addToSwarmMemory: (message: Message) => {
    MemoryService.swarmMemory.push(message);
    if (MemoryService.swarmMemory.length > 50) {
      MemoryService.swarmMemory.shift();
    }
  },

  getSwarmContext: (): Message[] => {
    return MemoryService.swarmMemory;
  }
};