import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'avaliacoes', pathMatch: 'full' },
  {
    path: 'avaliacoes',
    loadComponent: () =>
      import('./features/avaliacao-list/avaliacao-list').then(
        (m) => m.AvaliacaoListComponent
      ),
  },
  {
    path: 'avaliacoes/:id',
    loadComponent: () =>
      import('./features/avaliacao-detail/avaliacao-detail').then(
        (m) => m.AvaliacaoDetailComponent
      ),
  },
  {
    path: 'avaliacoes/:id/editar',
    loadComponent: () =>
      import('./features/avaliacao-detail/avaliacao-detail').then(
        (m) => m.AvaliacaoDetailComponent
      ),
  },
  { path: '**', redirectTo: 'avaliacoes' },
];