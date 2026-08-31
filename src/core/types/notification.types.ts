export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface ToastNotification {
  id: string;
  message: string;
  type: NotificationType;
  durationMs?: number;
}
