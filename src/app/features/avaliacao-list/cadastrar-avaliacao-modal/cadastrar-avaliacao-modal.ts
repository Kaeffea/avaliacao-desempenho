import { Component, EventEmitter, Input, OnInit, Output, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CadastrarAvaliacaoPayload, AvaliacaoDesempenhoForm } from '../../../core/interfaces/avaliacao-desempenho';

declare const bootstrap: any;

@Component({
  selector: 'app-cadastrar-avaliacao-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastrar-avaliacao-modal.html',
})
export class CadastrarAvaliacaoModalComponent implements OnInit {
  @Input() formData!: AvaliacaoDesempenhoForm;
  @Output() cadastrar = new EventEmitter<CadastrarAvaliacaoPayload>();
  @ViewChild('modalRef') modalRef!: ElementRef;

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id_colaborador: [null, Validators.required],
      id_supervisor: [null, Validators.required],
      competencia: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const raw = this.form.value;
    const [year, month] = raw.competencia.split('-');
    const payload: CadastrarAvaliacaoPayload = {
      id_colaborador: Number(raw.id_colaborador),
      id_supervisor: Number(raw.id_supervisor),
      competencia: `${month}/${year}`,
    };
    this.cadastrar.emit(payload);
  }

  close(): void {
    const el = document.getElementById('cadastrarModal');
    if (el) {
      const modal = bootstrap.Modal.getOrCreateInstance(el);
      modal.hide();
    }
    this.form.reset();
  }
}