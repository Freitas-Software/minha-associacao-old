import { router } from 'expo-router';
import { useState } from 'react';
import { AppButton, AppScreen, AppScreenHeader, AppText, AppTextInput } from '@/components/ui';
import { apiRequest } from '@/lib/api';

export default function CriarOrganizacaoScreen() {
	const [documentNumber, setDocumentNumber] = useState('');
	const [abbreviation, setAbbreviation] = useState('');
	const [error, setError] = useState<string | null>(null);
	async function submit() {
		try {
			setError(null);
			await apiRequest('/api/organizations', {
				method: 'POST',
				body: JSON.stringify({
					documentNumber: documentNumber.replace(/\D/g, ''),
					abbreviation: abbreviation || undefined,
				}),
			});
			router.replace('/organizacoes');
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : 'Não foi possível criar a associação.');
		}
	}
	return (
		<AppScreen scrollable>
			<AppScreenHeader
				description="Cadastre uma nova associação para começar a administrá-la."
				title="Criar associação"
			/>
			<AppTextInput
				label="CNPJ"
				value={documentNumber}
				onChangeText={setDocumentNumber}
				keyboardType="number-pad"
			/>
			<AppTextInput
				label="Sigla (opcional)"
				value={abbreviation}
				onChangeText={setAbbreviation}
			/>
			{error ? <AppText tone="negative">{error}</AppText> : null}
			<AppButton onPress={submit}>Validar e criar associação</AppButton>
			<AppButton
				onPress={() => router.back()}
				variant="outline">
				Voltar
			</AppButton>
		</AppScreen>
	);
}
