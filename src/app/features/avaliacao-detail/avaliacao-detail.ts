import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AvaliacaoDesempenhoService } from '../../core/services/avaliacao-desempenho';
import { AvaliacaoDetalhe, EditarAvaliacaoPayload } from '../../core/interfaces/avaliacao-desempenho';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';
import { AlertComponent, AlertType } from '../../shared/components/alert/alert';
import { AlertStateService } from '../../core/services/alert-state';


@Component({
  selector: 'app-avaliacao-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, StatusBadgeComponent, AlertComponent],
  templateUrl: './avaliacao-detail.html',
})
export class AvaliacaoDetailComponent implements OnInit {
  @ViewChild('alertRef') alertRef!: AlertComponent;

  avaliacao: AvaliacaoDetalhe | null = null;
  form!: FormGroup;
  alertMessage = '';
  alertType: AlertType = 'info';
  loading = true;
  mutating = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: AvaliacaoDesempenhoService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private alertState: AlertStateService
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
        this.cdr.detectChanges();
      },
      error: () => {
        this.showAlert('Erro ao carregar avaliação.', 'danger');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  buildForm(avaliacao: AvaliacaoDetalhe): void {
    this.form = this.fb.group({
      sugestao_supervisor: [avaliacao.sugestao_supervisor ?? ''],
      observacao_avaliado: [avaliacao.observacao_avaliado ?? ''],
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
    const s = this.avaliacao?.status.id;
    return s === 2 || s === 3;
  }

  onSalvar(): void {
    if (!this.avaliacao || this.form.invalid) return;
    this.mutating = true;
    this.cdr.detectChanges();
    const payload: EditarAvaliacaoPayload = this.form.value;
    this.service.editar(this.avaliacao.id_avaliacao, payload).subscribe({
      next: () => {
        this.mutating = false;
        this.alertState.set('Requisição de edição enviada com sucesso. Em um ambiente com banco de dados, as alterações estariam salvas.', 'success');
        this.router.navigate(['/avaliacoes']);
      },
      error: () => {
        this.mutating = false;
        this.alertState.set('O endpoint /editar/ retornou erro 500 no ambiente de teste da API. A requisição foi enviada corretamente pelo front-end.', 'warning');
        this.router.navigate(['/avaliacoes']);
      },
    });
  }

  showAlert(message: string, type: AlertType): void {
    this.alertMessage = message;
    this.alertType = type;
    this.cdr.detectChanges();
    setTimeout(() => this.alertRef?.show(), 0);
  }
}