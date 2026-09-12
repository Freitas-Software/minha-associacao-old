const BRASIL_API_USER_AGENT = 'MinhaAssociacao/1.0';

export interface CnpjRegistryResult {
	documentNumber: string;
	legalName: string;
	tradeName: string | null;
	legalNature: string | null;
}

export async function lookupCnpj(documentNumber: string): Promise<CnpjRegistryResult | null> {
	if (!/^\d{14}$/.test(documentNumber)) return null;

	const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${documentNumber}`, {
		headers: {
			Accept: 'application/json',
			'User-Agent': BRASIL_API_USER_AGENT,
		},
	});
	if (response.status === 404) return null;
	if (!response.ok) throw new Error(`BrasilAPI returned ${response.status}`);

	const data = (await response.json()) as {
		cnpj?: string;
		razao_social?: string;
		nome_fantasia?: string;
		natureza_juridica?: string;
	};
	if (!data.cnpj || !data.razao_social) return null;

	return {
		documentNumber: data.cnpj.replace(/\D/g, ''),
		legalName: data.razao_social,
		tradeName: data.nome_fantasia?.trim() || null,
		legalNature: data.natureza_juridica?.trim() || null,
	};
}
