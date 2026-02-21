# Avaliação de Desempenho

Aplicação front-end desenvolvida em Angular para gerenciamento de avaliações de desempenho, consumindo a API do LCCV/UFAL.

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Angular CLI](https://angular.io/cli) v17+

## Instalação e execução
```bash
npm install
ng serve
```

Acesse [http://localhost:4200](http://localhost:4200).

## Funcionalidades

- Listagem de avaliações de desempenho
- Cadastro de nova avaliação
- Visualização e edição de avaliação
- Transição de status: Iniciar → Dar Feedback → Concluir
- Alertas de feedback para o usuário

## Tecnologias

- Angular 17
- Bootstrap 5
- Bootstrap Icons
- RxJS

## Observações sobre a API

O endpoint `POST /avaliacoes_desempenho/{id}/editar/` retorna HTTP 500 no ambiente de teste disponibilizado. Todos os outros endpoints funcionam corretamente. A integração no front-end está implementada conforme especificado — o erro é exclusivo do servidor de teste.