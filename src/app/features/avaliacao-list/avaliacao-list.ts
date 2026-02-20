import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvaliacaoDesempenhoService } from '../../core/services/avaliacao-desempenho';
import { AvaliacaoDesempenho, AvaliacaoDesempenhoForm, CadastrarAvaliacaoPayload } from '../../core/interfaces/avaliacao-desempenho';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';
import { AlertComponent, AlertType } from '../../shared/components/alert/alert';
import { CadastrarAvaliacaoModalComponent } from './cadastrar-avaliacao-modal/cadastrar-avaliacao-modal';

@Component({
  selector: 'app-avaliacao-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StatusBadgeComponent,
    AlertComponent,
    CadastrarAvaliacaoModalComponent,
  ],
  templateUrl: './avaliacao-list.component.html',
})
export class AvaliacaoListComponent implements OnInit {
  @ViewChild('alertRef') alertRef!: AlertComponent;

  avaliacoes: AvaliacaoDesempenho[] = [];
  formData: AvaliacaoDesempenhoForm | null = null;
  alertMessage = '';
  alertType: AlertType = 'info';
  loading = true;

  constructor(private service: AvaliacaoDesempenhoService) {}

  ngOnInit(): void {
    this.loadAvaliacoes();
    this.loadFormData();
  }

  loadAvaliacoes(): void {
    this.loading = true;
    this.service.listar().subscribe({
      next: (data) => {
        this.avaliacoes = data;
        this.loading = false;
      },
      error: () => {
        this.showAlert('Erro ao carregar avaliações.', 'danger');
        this.loading = false;
      },
    });
  }

  loadFormData(): void {
    this.service.getCadastrarForm().subscribe({
      next: (data) => (this.formData = data),
      error: () => this.showAlert('Erro ao carregar dados do formulário.', 'danger'),
    });
  }

  onCadastrar(payload: CadastrarAvaliacaoPayload): void {
    this.service.cadastrar(payload).subscribe({
      next: () => {
        this.showAlert('Avaliação cadastrada com sucesso!', 'success');
        this.loadAvaliacoes();
      },
      error: () => this.showAlert('Erro ao cadastrar avaliação.', 'danger'),
    });
  }

  showAlert(message: string, type: AlertType): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => this.alertRef?.show(), 0);
  }
}