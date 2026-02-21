export interface StatusAvaliacao {
  id: number;
  descricao: string;
}

export interface AvaliacaoResumo {
  id_avaliacao: number;
  nome_colaborador: string;
  competencia: string;
  status: StatusAvaliacao;
}

export interface AvaliacaoDetalhe {
  id_avaliacao: number;
  id_colaborador: number;
  nome_colaborador: string;
  id_supervisor: number;
  nome_supervisor: string;
  competencia: string;
  status: StatusAvaliacao;
  nota: number | null;
  sugestao_supervisor: string;
  observacao_avaliado: string;
  itens?: ItemAvaliacaoDesempenho[];
}

export interface TipoItemAvaliacaoDesempenho {
  id: number;
  dimensao: string;
  descricao: string;
}

export interface ItemAvaliacaoDesempenho {
  id: number;
  tipoItemAvaliacaoDesempenho: TipoItemAvaliacaoDesempenho;
  nota: number;
  observacoes?: string;
}

export interface ColaboradorForm {
  id_colaborador: number;
  nome: string;
}

export interface SupervisorForm {
  id_supervisor: number;
  nome: string;
}

export interface AvaliacaoDesempenhoForm {
  colaboradores: ColaboradorForm[];
  supervisores: SupervisorForm[];
}

export interface CadastrarAvaliacaoPayload {
  id_colaborador: number;
  id_supervisor: number;
  competencia: string;
}

export interface EditarAvaliacaoPayload {
  sugestao_supervisor?: string;
  observacao_avaliado?: string;
  itens?: { id: number; nota: number; observacoes?: string }[];
}