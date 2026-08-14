export type EntityStatus = 'active' | 'inactive' | 'pending' | 'blocked' | 'archived';

export const entityStatusLabels: Record<EntityStatus, string> = {
	active: 'Ativo',
	inactive: 'Inativo',
	pending: 'Pendente',
	blocked: 'Bloqueado',
	archived: 'Arquivado',
};
