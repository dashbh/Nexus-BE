// Notification Service Definition
import { GrpcServiceDefinition } from '../interfaces/common';

export const NOTIFICATION_SERVICE: GrpcServiceDefinition = {
  name: 'NotificationService',
  package: 'nexus.notification',
  methods: [
    {
      name: 'SendNotification',
      requestType: 'SendNotificationRequest',
      responseType: 'SendNotificationResponse',
    },
    {
      name: 'GetNotifications',
      requestType: 'GetNotificationsRequest',
      responseType: 'GetNotificationsResponse',
    },
  ],
};
