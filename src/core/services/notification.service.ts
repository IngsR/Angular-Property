import { Injectable, signal } from '@angular/core';
import { ToastNotification, NotificationType } from '../types/notification.types';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _toast = signal<ToastNotification | null>(null);
  readonly toast = this._toast.asReadonly();
  private timer: ReturnType<typeof setTimeout> | null = null;

  show(message: string, type: NotificationType = 'success', durationMs = 2800): void {
    if (this.timer) clearTimeout(this.timer);
    const toast: ToastNotification = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type,
      durationMs,
    };
    this._toast.set(toast);
    this.timer = setTimeout(() => {
      this._toast.set(null);
    }, durationMs);
  }

  dismiss(): void {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    this._toast.set(null);
  }
}
