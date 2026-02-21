import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AvaliacaoDesempenhoService } from '../../core/services/avaliacao-desempenho';
import {
  AvaliacaoResumo,
  AvaliacaoDesempenhoForm,
  CadastrarAvaliacaoPayload,
} from '../../core/interfaces/avaliacao-desempenho';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';
import { AlertComponent, AlertType } from '../../shared/components/alert/alert';
import { CadastrarAvaliacaoModalComponent } from './cadastrar-avaliacao-modal/cadastrar-avaliacao-modal';
import { AlertStateService } from '../../core/services/alert-state';

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
  templateUrl: './avaliacao-list.html',
})

export class AvaliacaoListComponent implements OnInit {
  @ViewChild('alertRef') alertRef!: AlertComponent;
  @ViewChild(CadastrarAvaliacaoModalComponent) cadastrarModal!: CadastrarAvaliacaoModalComponent;

  avaliacoes: AvaliacaoResumo[] = [];
  formData: AvaliacaoDesempenhoForm | null = null;
  alertMessage = '';
  alertType: AlertType = 'info';
  loading = true;
  apiError = false;
  mutating = false;
  pendingAlert: { message: string; type: AlertType } | null = null;
  fecharModal = false;

  constructor(
    private service: AvaliacaoDesempenhoService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private alertState: AlertStateService
  ) {}

  ngOnInit(): void {
    this.loadAvaliacoes();
    this.loadFormData();
  }

  ngAfterViewInit(): void {
    const pending = this.alertState.consume();
    if (pending) {
      this.alertMessage = pending.message;
      this.alertType = pending.type;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.alertRef?.show();
        this.cdr.detectChanges();
      }, 100);
    }
  }

  loadAvaliacoes(): void {
    this.loading = true;
    this.apiError = false;
    this.service.listar().subscribe({
      next: (data) => {
        this.avaliacoes = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.apiError = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadFormData(): void {
    this.service.getCadastrarForm().subscribe({
      next: (data) => {
        this.formData = data;
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  showAlert(message: string, type: AlertType): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => this.alertRef?.show(), 0);
  }

  onIniciar(id: number): void {
    this.mutating = true;
    this.service.iniciar(id).subscribe({
      next: () => {
        this.showAlert('Requisição de início enviada com sucesso. Em um ambiente com banco de dados, o status seria atualizado para "Em elaboração".', 'success');
        this.loadAvaliacoes();
        this.mutating = false;
      },
      error: () => {
        this.showAlert('Erro ao iniciar avaliação.', 'danger');
        this.mutating = false;
      },
    });
  }

  onDarFeedback(id: number): void {
    this.mutating = true;
    this.service.darFeedback(id).subscribe({
      next: () => {
        this.showAlert('Requisição de feedback enviada com sucesso. Em um ambiente com banco de dados, o status seria atualizado para "Em avaliação".', 'success');
        this.loadAvaliacoes();
        this.mutating = false;
      },
      error: () => {
        this.showAlert('Erro ao dar feedback.', 'danger');
        this.mutating = false;
      },
    });
  }

  onConcluir(id: number): void {
    this.mutating = true;
    this.service.concluir(id).subscribe({
      next: () => {
        this.showAlert('Requisição de conclusão enviada com sucesso. Em um ambiente com banco de dados, o status seria atualizado para "Concluída".', 'success');
        this.loadAvaliacoes();
        this.mutating = false;
      },
      error: () => {
        this.showAlert('Erro ao concluir avaliação.', 'danger');
        this.mutating = false;
      },
    });
  }

  onCadastrar(payload: CadastrarAvaliacaoPayload): void {
    this.mutating = true;
    this.service.cadastrar(payload).subscribe({
      next: () => {
        this.mutating = false;
        const el = document.getElementById('cadastrarModal');
        if (el) {
          (window as any).bootstrap.Modal.getOrCreateInstance(el).hide();
        }
        this.loadAvaliacoes();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.alertMessage = 'Requisição de cadastro enviada com sucesso. Em um ambiente com banco de dados, a nova avaliação apareceria na listagem.';
          this.alertType = 'success';
          this.cdr.detectChanges();
          this.alertRef?.show();
        }, 300);
      },
      error: () => {
        this.mutating = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.alertMessage = 'Erro ao cadastrar avaliação.';
          this.alertType = 'danger';
          this.cdr.detectChanges();
          this.alertRef?.show();
        }, 0);
      },
    });
  }
}