import { afterEach, describe, expect, it, vi } from 'vitest';
import { lookupCnpj } from '../../../src/modules/organizations/cnpj-registry.js';

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('BrasilAPI CNPJ registry adapter', () => {
	it('identifies the application to avoid the BrasilAPI Node user-agent mitigation', async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(
				JSON.stringify({
					cnpj: '46333915000110',
					razao_social: 'Associação Exemplo',
					nome_fantasia: 'ASSOEX',
					natureza_juridica: 'Associação Privada',
				}),
				{ status: 200, headers: { 'content-type': 'application/json' } }
			)
		);
		vi.stubGlobal('fetch', fetchMock);

		await expect(lookupCnpj('46333915000110')).resolves.toEqual({
			documentNumber: '46333915000110',
			legalName: 'Associação Exemplo',
			tradeName: 'ASSOEX',
			legalNature: 'Associação Privada',
		});
		expect(fetchMock).toHaveBeenCalledWith('https://brasilapi.com.br/api/cnpj/v1/46333915000110', {
			headers: {
				Accept: 'application/json',
				'User-Agent': 'MinhaAssociacao/1.0',
			},
		});
	});

	it('does not call the provider when the document is malformed', async () => {
		const fetchMock = vi.fn();
		vi.stubGlobal('fetch', fetchMock);

		await expect(lookupCnpj('123')).resolves.toBeNull();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
