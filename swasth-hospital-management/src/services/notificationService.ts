import { getSocket } from '@/lib/socket';

export type NotificationType = 
  | 'appointment'
  | 'prescription'
  | 'test_result'
  | 'message'
  | 'alert';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

class NotificationService {
  private socket = getSocket();
  private listeners: ((notification: Notification) => void)[] = [];

  constructor() {
    this.socket.on('notification', this.handleNotification.bind(this));
  }

  private handleNotification(notification: Notification) {
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/notification-icon.png',
      });
    }

    // Notify all listeners
    this.listeners.forEach(listener => listener(notification));
  }

  public subscribe(callback: (notification: Notification) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  public async requestPermission() {
    if (Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }
  }

  public async sendNotification(userId: string, notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          notification,
        }),
      });
      return response.json();
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  public async markAsRead(notificationId: string) {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService(); 