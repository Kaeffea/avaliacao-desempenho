import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AvaliacaoDesempenho,
  AvaliacaoDesempenhoForm,
  CadastrarAvaliacaoPayload,
  EditarAvaliacaoPayload,
} from '../interfaces/avaliacao-desempenho';

@Injectable({ providedIn: 'root' })
export class AvaliacaoDesempenhoService {
  private readonly baseUrl =
    'https://sume.lccv.ufal.br/api/public/selecao_sume/avaliacoes_desempenho';

  constructor(private http: HttpClient) {}

  listar(): Observable<AvaliacaoDesempenho[]> {
    return this.http.get<AvaliacaoDesempenho[]>(`${this.baseUrl}/listar/`);
  }

  visualizar(id: number): Observable<AvaliacaoDesempenho> {
    return this.http.get<AvaliacaoDesempenho>(`${this.baseUrl}/${id}/visualizar/`);
  }

  getCadastrarForm(): Observable<AvaliacaoDesempenhoForm> {
    return this.http.get<AvaliacaoDesempenhoForm>(`${this.baseUrl}/cadastrar_avaliacao_form/`);
  }

  cadastrar(payload: CadastrarAvaliacaoPayload): Observable<AvaliacaoDesempenho> {
    return this.http.post<AvaliacaoDesempenho>(`${this.baseUrl}/cadastrar/`, payload);
  }

  iniciar(id: number): Observable<AvaliacaoDesempenho> {
    return this.http.post<AvaliacaoDesempenho>(`${this.baseUrl}/${id}/iniciar/`, {});
  }

  editar(id: number, payload: EditarAvaliacaoPayload): Observable<AvaliacaoDesempenho> {
    return this.http.post<AvaliacaoDesempenho>(`${this.baseUrl}/${id}/editar/`, payload);
  }

  darFeedback(id: number): Observable<AvaliacaoDesempenho> {
    return this.http.post<AvaliacaoDesempenho>(`${this.baseUrl}/${id}/dar_feedback/`, {});
  }

  concluir(id: number): Observable<AvaliacaoDesempenho> {
    return this.http.post<AvaliacaoDesempenho>(`${this.baseUrl}/${id}/concluir/`, {});
  }
}