import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="badge" [ngClass]="badgeClass">{{ status }}</span>`,
})
export class StatusBadgeComponent {
  @Input() status = '';

  get badgeClass(): string {
    const map: Record<string, string> = {
      'Criado': 'bg-secondary',
      'Em elaboração': 'bg-primary',
      'Em avaliação': 'bg-warning text-dark',
      'Concluida': 'bg-success',
    };
    return map[this.status] ?? 'bg-secondary';
  }
}