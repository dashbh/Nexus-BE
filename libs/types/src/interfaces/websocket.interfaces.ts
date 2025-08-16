// WebSocket related interfaces

export interface WebSocketSession {
  userId: string;
  socketId: string;
  connectedAt: Date;
  lastPing: Date;
  subscriptions: string[];
}

export interface WebSocketMessage {
  type: string;
  payload: unknown;
  timestamp: Date;
  correlationId: string;
}

export interface WebSocketResponse {
  type: string;
  payload: unknown;
  success: boolean;
  error?: string;
  timestamp: Date;
  correlationId: string;
}
