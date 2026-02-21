import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="badge-status" [ngClass]="badgeClass">{{ status }}</span>`,
})
export class StatusBadgeComponent {
  @Input() status = '';

  get badgeClass(): string {
    const map: Record<string, string> = {
      'Criado': 'badge-criado',
      'Em elaboração': 'badge-elaboracao',
      'Em avaliação': 'badge-avaliacao',
      'Concluida': 'badge-concluida',
    };
    return map[this.status] ?? 'badge-criado';
  }
}