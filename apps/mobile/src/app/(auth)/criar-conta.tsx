import { router } from 'expo-router';
import { useState } from 'react';
import { AppButton, AppScreen, AppScreenHeader, AppText, AppTextInput } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';

export default function CriarContaScreen() {
	const { register } = useAuth();
	const [name, setName] = useState('');
	const [documentNumber, setDocumentNumber] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	async function submit() {
		try {
			setError(null);
			await register({ name, documentNumber, email, password });
			router.replace('/organizacoes');
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Não foi possível criar a conta.');
		}
	}
	return (
		<AppScreen
			keyboardAware
			scrollable>
			<AppScreenHeader
				title="Criar conta"
				description="Sua conta é global e poderá participar de várias associações."
			/>
			<AppTextInput
				label="Nome completo"
				value={name}
				onChangeText={setName}
			/>
			<AppTextInput
				label="CPF"
				value={documentNumber}
				onChangeText={setDocumentNumber}
				keyboardType="number-pad"
			/>
			<AppTextInput
				label="E-mail"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
			/>
			<AppTextInput
				label="Senha"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>
			{error ? <AppText tone="negative">{error}</AppText> : null}
			<AppButton onPress={submit}>Criar conta</AppButton>
		</AppScreen>
	);
}
