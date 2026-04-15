export interface Agent {
  id: string;
  name: string;
  color: string;
  role: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
  isAgent: boolean;
}