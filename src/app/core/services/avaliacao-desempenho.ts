import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay, tap } from 'rxjs';
import {
  AvaliacaoResumo,
  AvaliacaoDetalhe,
  AvaliacaoDesempenhoForm,
  CadastrarAvaliacaoPayload,
  EditarAvaliacaoPayload,
} from '../interfaces/avaliacao-desempenho';

@Injectable({ providedIn: 'root' })
export class AvaliacaoDesempenhoService {
  private readonly baseUrl = '/api/public/selecao_sume/avaliacoes_desempenho';

  private listar$: Observable<AvaliacaoResumo[]> | null = null;
  private form$: Observable<AvaliacaoDesempenhoForm> | null = null;
  private detalhe$: Map<number, Observable<AvaliacaoDetalhe>> = new Map();

  constructor(private http: HttpClient) {}

  private getCache<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  }

  private setCache<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private removeCache(key: string): void {
    localStorage.removeItem(key);
  }

  listar(): Observable<AvaliacaoResumo[]> {
    const cached = this.getCache<AvaliacaoResumo[]>('cache:listar');
    if (cached) return of(cached);
    if (!this.listar$) {
      this.listar$ = this.http
        .get<AvaliacaoResumo[]>(`${this.baseUrl}/listar/`)
        .pipe(
          tap((data) => this.setCache('cache:listar', data)),
          shareReplay(1)
        );
    }
    return this.listar$;
  }

  invalidarListar(): void {
    this.listar$ = null;
    this.removeCache('cache:listar');
  }

  visualizar(id: number): Observable<AvaliacaoDetalhe> {
    const cached = this.getCache<AvaliacaoDetalhe>(`cache:detalhe:${id}`);
    if (cached) return of(cached);
    if (!this.detalhe$.has(id)) {
      const req$ = this.http
        .get<AvaliacaoDetalhe>(`${this.baseUrl}/${id}/visualizar/`)
        .pipe(
          tap((data) => this.setCache(`cache:detalhe:${id}`, data)),
          shareReplay(1)
        );
      this.detalhe$.set(id, req$);
    }
    return this.detalhe$.get(id)!;
  }

  invalidarDetalhe(id: number): void {
    this.detalhe$.delete(id);
    this.removeCache(`cache:detalhe:${id}`);
  }

  getCadastrarForm(): Observable<AvaliacaoDesempenhoForm> {
    const cached = this.getCache<AvaliacaoDesempenhoForm>('cache:form');
    if (cached) return of(cached);
    if (!this.form$) {
      this.form$ = this.http
        .get<AvaliacaoDesempenhoForm>(`${this.baseUrl}/cadastrar_avaliacao_form/`)
        .pipe(
          tap((data) => this.setCache('cache:form', data)),
          shareReplay(1)
        );
    }
    return this.form$;
  }

  cadastrar(payload: CadastrarAvaliacaoPayload): Observable<AvaliacaoDetalhe> {
    return this.http.post<AvaliacaoDetalhe>(`${this.baseUrl}/cadastrar/`, payload).pipe(
      tap(() => this.invalidarListar())
    );
  }

  iniciar(id: number): Observable<AvaliacaoDetalhe> {
    return this.http.post<AvaliacaoDetalhe>(`${this.baseUrl}/${id}/iniciar/`, {}).pipe(
      tap(() => { this.invalidarListar(); this.invalidarDetalhe(id); })
    );
  }

  editar(id: number, payload: EditarAvaliacaoPayload): Observable<AvaliacaoDetalhe> {
    return this.http.post<AvaliacaoDetalhe>(`${this.baseUrl}/${id}/editar/`, payload).pipe(
      tap(() => { this.invalidarListar(); this.invalidarDetalhe(id); })
    );
  }

  darFeedback(id: number): Observable<AvaliacaoDetalhe> {
    return this.http.post<AvaliacaoDetalhe>(`${this.baseUrl}/${id}/dar_feedback/`, {}).pipe(
      tap(() => { this.invalidarListar(); this.invalidarDetalhe(id); })
    );
  }

  concluir(id: number): Observable<AvaliacaoDetalhe> {
    return this.http.post<AvaliacaoDetalhe>(`${this.baseUrl}/${id}/concluir/`, {}).pipe(
      tap(() => { this.invalidarListar(); this.invalidarDetalhe(id); })
    );
  }
}