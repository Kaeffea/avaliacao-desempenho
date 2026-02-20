export type StatusAvaliacao = 'Criada' | 'Em elaboração' | 'Em avaliação' | 'Concluída';

export interface Colaborador {
  id: number;
  nome: string;
}

export interface TipoItemAvaliacaoDesempenho {
  id: number;
  dimensao: string;
  tipoItemAvaliacaoDesempenho: string;
  descricao: string;
}

export interface ItemAvaliacaoDesempenho {
  id: number;
  tipoItemAvaliacaoDesempenho: TipoItemAvaliacaoDesempenho;
  nota: number;
  observacoes?: string;
}

export interface AvaliacaoDesempenho {
  id: number;
  colaborador: Colaborador;
  supervisor: Colaborador;
  mesCompetencia: string;
  statusAvaliacao: StatusAvaliacao;
  nota: number;
  sugestoesSupervisor?: string;
  observacoesAvaliado?: string;
  itens?: ItemAvaliacaoDesempenho[];
}

export interface AvaliacaoDesempenhoForm {
  colaboradores: Colaborador[];
  supervisores: Colaborador[];
}

export interface CadastrarAvaliacaoPayload {
  colaborador: number;
  supervisor: number;
  mesCompetencia: string;
}

export interface EditarAvaliacaoPayload {
  sugestoesSupervisor?: string;
  observacoesAvaliado?: string;
  itens?: { id: number; nota: number; observacoes?: string }[];
}