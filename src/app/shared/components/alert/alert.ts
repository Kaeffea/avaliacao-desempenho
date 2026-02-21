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
      class="custom-alert alert-{{ type }}"
      role="alert"
    >
      <i class="bi flex-shrink-0" [ngClass]="{
        'bi-check-circle-fill': type === 'success',
        'bi-x-circle-fill': type === 'danger',
        'bi-exclamation-triangle-fill': type === 'warning',
        'bi-info-circle-fill': type === 'info'
      }"></i>
      <span style="flex:1">{{ message }}</span>
      <button type="button" class="btn-close flex-shrink-0" style="font-size:0.7rem" (click)="visible = false"></button>
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
      setTimeout(() => (this.visible = false), 5000);
    }
  }
}