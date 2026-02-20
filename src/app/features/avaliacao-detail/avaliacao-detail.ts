import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AvaliacaoDesempenhoService } from '../../core/services/avaliacao-desempenho';
import { AvaliacaoDesempenho } from '../../core/interfaces/avaliacao-desempenho';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';
import { AlertComponent, AlertType } from '../../shared/components/alert/alert';

@Component({
  selector: 'app-avaliacao-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, StatusBadgeComponent, AlertComponent],
  templateUrl: './avaliacao-detail.component.html',
})
export class AvaliacaoDetailComponent implements OnInit {
  @ViewChild('alertRef') alertRef!: AlertComponent;

  avaliacao: AvaliacaoDesempenho | null = null;
  form!: FormGroup;
  alertMessage = '';
  alertType: AlertType = 'info';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: AvaliacaoDesempenhoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAvaliacao(id);
  }

  loadAvaliacao(id: number): void {
    this.service.visualizar(id).subscribe({
      next: (data) => {
        this.avaliacao = data;
        this.buildForm(data);
        this.loading = false;
      },
      error: () => {
        this.showAlert('Erro ao carregar avaliação.', 'danger');
        this.loading = false;
      },
    });
  }

  buildForm(avaliacao: AvaliacaoDesempenho): void {
    this.form = this.fb.group({
      sugestoesSupervisor: [avaliacao.sugestoesSupervisor ?? ''],
      observacoesAvaliado: [avaliacao.observacoesAvaliado ?? ''],
      itens: this.fb.array(
        (avaliacao.itens ?? []).map((item) =>
          this.fb.group({
            id: [item.id],
            nota: [item.nota, [Validators.required, Validators.min(1), Validators.max(5)]],
            observacoes: [item.observacoes ?? ''],
          })
        )
      ),
    });
  }

  get itens(): FormArray {
    return this.form.get('itens') as FormArray;
  }

  get canEdit(): boolean {
    return this.avaliacao?.statusAvaliacao === 'Em elaboração' ||
           this.avaliacao?.statusAvaliacao === 'Em avaliação';
  }

  onIniciar(): void {
    if (!this.avaliacao) return;
    this.service.iniciar(this.avaliacao.id).subscribe({
      next: (data) => {
        this.avaliacao = data;
        this.buildForm(data);
        this.showAlert('Avaliação iniciada!', 'success');
      },
      error: () => this.showAlert('Erro ao iniciar avaliação.', 'danger'),
    });
  }

  onSalvar(): void {
    if (!this.avaliacao || this.form.invalid) return;
    this.service.editar(this.avaliacao.id, this.form.value).subscribe({
      next: (data) => {
        this.avaliacao = data;
        this.buildForm(data);
        this.showAlert('Avaliação salva com sucesso!', 'success');
      },
      error: () => this.showAlert('Erro ao salvar avaliação.', 'danger'),
    });
  }

  onDarFeedback(): void {
    if (!this.avaliacao) return;
    this.service.darFeedback(this.avaliacao.id).subscribe({
      next: (data) => {
        this.avaliacao = data;
        this.showAlert('Feedback enviado!', 'success');
      },
      error: () => this.showAlert('Erro ao dar feedback.', 'danger'),
    });
  }

  onConcluir(): void {
    if (!this.avaliacao) return;
    this.service.concluir(this.avaliacao.id).subscribe({
      next: () => {
        this.showAlert('Avaliação concluída!', 'success');
        setTimeout(() => this.router.navigate(['/avaliacoes']), 1500);
      },
      error: () => this.showAlert('Erro ao concluir avaliação.', 'danger'),
    });
  }

  showAlert(message: string, type: AlertType): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => this.alertRef?.show(), 0);
  }
}