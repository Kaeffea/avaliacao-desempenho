import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusAvaliacao } from '../../../core/interfaces/avaliacao-desempenho';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="badgeClass">{{ status }}</span>
  `,
})
export class StatusBadgeComponent {
  @Input() status: StatusAvaliacao = 'Criada';

  get badgeClass(): string {
    const map: Record<StatusAvaliacao, string> = {
      'Criada': 'bg-secondary',
      'Em elaboração': 'bg-primary',
      'Em avaliação': 'bg-warning text-dark',
      'Concluída': 'bg-success',
    };
    return map[this.status] ?? 'bg-secondary';
  }
}