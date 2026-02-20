import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvaliacaoDesempenhoForm, CadastrarAvaliacaoPayload } from '../../../core/interfaces/avaliacao-desempenho';

@Component({
  selector: 'app-cadastrar-avaliacao-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastrar-avaliacao-modal.component.html',
})
export class CadastrarAvaliacaoModalComponent implements OnInit {
  @Input() formData!: AvaliacaoDesempenhoForm;
  @Output() cadastrar = new EventEmitter<CadastrarAvaliacaoPayload>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      colaborador: [null, Validators.required],
      supervisor: [null, Validators.required],
      mesCompetencia: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.cadastrar.emit(this.form.value as CadastrarAvaliacaoPayload);
    this.form.reset();
  }
}