import { Agent } from '../types';

export const StorageService = {
  // Simulates on-device persistent storage
  privateStorage: new Map<string, Record<string, any>>(),
  sharedStorage: {} as Record<string, any>,

  saveData: (agentId: string, key: string, value: any) => {
    const agentData = StorageService.privateStorage.get(agentId) || {};
    agentData[key] = value;
    StorageService.privateStorage.set(agentId, agentData);
  },

  getData: (agentId: string, key: string) => {
    const agentData = StorageService.privateStorage.get(agentId);
    return agentData ? agentData[key] : null;
  },

  saveShared: (key: string, value: any) => {
    StorageService.sharedStorage[key] = value;
  },

  getShared: (key: string) => {
    return StorageService.sharedStorage[key];
  }
};