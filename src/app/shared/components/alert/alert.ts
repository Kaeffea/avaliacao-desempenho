import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'success' | 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="visible"
      class="alert alert-{{ type }} alert-dismissible fade show"
      role="alert"
    >
      {{ message }}
      <button type="button" class="btn-close" (click)="visible = false"></button>
    </div>
  `,
})
export class AlertComponent {
  @Input() message = '';
  @Input() type: AlertType = 'info';
  @Input() autoDismiss = true;

  visible = false;

  show(): void {
    this.visible = true;
    if (this.autoDismiss) {
      setTimeout(() => (this.visible = false), 4000);
    }
  }
}