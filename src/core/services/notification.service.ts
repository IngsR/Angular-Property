export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface ToastNotification {
  id: string;
  message: string;
  type: NotificationType;
  durationMs?: number;
}

type NotificationListener = (toast: ToastNotification | null) => void;

export class NotificationService {
  private static instance: NotificationService;
  private currentToast: ToastNotification | null = null;
  private timer: any = null;
  private listeners: Set<NotificationListener> = new Set();

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public show(message: string, type: NotificationType = 'success', durationMs = 2800): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    const toast: ToastNotification = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type,
      durationMs,
    };

    this.currentToast = toast;
    this.notify();

    this.timer = setTimeout(() => {
      this.currentToast = null;
      this.notify();
    }, durationMs);
  }

  public dismiss(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.currentToast = null;
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.currentToast));
  }

  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    listener(this.currentToast);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const notificationService = NotificationService.getInstance();
