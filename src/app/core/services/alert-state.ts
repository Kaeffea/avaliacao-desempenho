import { Injectable } from '@angular/core';
import { AlertType } from '../../shared/components/alert/alert';

@Injectable({ providedIn: 'root' })
export class AlertStateService {
  private pending: { message: string; type: AlertType } | null = null;

  set(message: string, type: AlertType): void {
    this.pending = { message, type };
  }

  consume(): { message: string; type: AlertType } | null {
    const val = this.pending;
    this.pending = null;
    return val;
  }
}