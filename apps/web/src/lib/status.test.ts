import { describe, expect, it } from 'vitest';
import { entityStatusLabels } from './status';

describe('entityStatusLabels', () => {
	it('keeps a direct label for each semantic status', () => {
		expect(entityStatusLabels).toEqual({
			active: 'Ativo',
			inactive: 'Inativo',
			pending: 'Pendente',
			blocked: 'Bloqueado',
			archived: 'Arquivado',
		});
	});
});
