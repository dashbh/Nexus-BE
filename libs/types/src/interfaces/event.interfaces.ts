// Event related interfaces for Kafka

export interface BaseEvent {
  eventId: string;
  eventType: string;
  timestamp: Date;
  correlationId: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface UserLoginEvent extends BaseEvent {
  eventType: 'user.login';
  payload: {
    userId: string;
    email: string;
    loginTime: Date;
    ipAddress: string;
    userAgent: string;
  };
}

export interface UserLogoutEvent extends BaseEvent {
  eventType: 'user.logout';
  payload: {
    userId: string;
    sessionDuration: number;
  };
}

export interface ServiceHealthEvent extends BaseEvent {
  eventType: 'service.health';
  payload: {
    serviceName: string;
    status: 'healthy' | 'unhealthy';
    metrics: Record<string, number>;
  };
}
