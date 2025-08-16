// Notification Service gRPC Interfaces

export interface SendNotificationRequest {
  userId: string;
  type: 'EMAIL' | 'SMS' | 'PUSH';
  title: string;
  message: string;
  metadata?: Record<string, string>;
}

export interface SendNotificationResponse {
  success: boolean;
  notificationId?: string;
  message?: string;
}

export interface GetNotificationsRequest {
  userId: string;
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
}

export interface GetNotificationsResponse {
  success: boolean;
  notifications?: {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
  }[];
  total?: number;
  message?: string;
}
