import { ApplicationConfig, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { AvaliacaoDesempenhoService } from './core/services/avaliacao-desempenho';
import { forkJoin, firstValueFrom, switchMap } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(() => {
      const service = inject(AvaliacaoDesempenhoService);
      return firstValueFrom(
        forkJoin([
          service.listar(),
          service.getCadastrarForm(),
        ]).pipe(
          switchMap(([avaliacoes]) =>
            forkJoin(avaliacoes.map((a) => service.visualizar(a.id_avaliacao)))
          )
        )
      );
    }),
  ],
};