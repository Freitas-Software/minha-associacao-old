import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { AppButton, AppIcon, AppScreen, AppText, AppTextInput } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

export default function SignInScreen() {
	const { signIn } = useAuth();
	const [documentNumber, setDocumentNumber] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const { colors, radii, spacing } = useMinhaAssociacaoTheme().minhaAssociacao;

	async function handleSignIn() {
		try {
			setError(null);
			await signIn({ documentNumber, password });
			router.replace('/organizacoes');
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Falha ao entrar.');
		}
	}

	return (
		<AppScreen
			centered
			keyboardAware
			scrollable
			contentContainerStyle={{ alignSelf: 'center', maxWidth: 480, width: '100%' }}>
			<View style={{ gap: spacing.lg }}>
				<View
					style={{
						alignItems: 'center',
						backgroundColor: colors.brandAccent,
						borderRadius: radii.lg,
						height: 64,
						justifyContent: 'center',
						width: 64,
					}}>
					<AppIcon
						name="account-group-outline"
						size={42}
						tone="inverse"
					/>
				</View>
				<AppText
					tone="accent"
					variant="labelLarge">
					Minha Associação
				</AppText>
				<AppText
					accessibilityRole="header"
					variant="headlineLarge">
					Tudo sobre a sua associação, em um só lugar.
				</AppText>
				<AppText tone="secondary">
					Acompanhe sua carteirinha, mensalidades, benefícios e os comunicados mais importantes.
				</AppText>
				<AppTextInput
					label="CPF"
					value={documentNumber}
					onChangeText={setDocumentNumber}
					keyboardType="number-pad"
				/>
				<AppTextInput
					label="Senha"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
				/>
				{error ? <AppText tone="negative">{error}</AppText> : null}
				<AppButton onPress={handleSignIn}>Entrar</AppButton>
				<AppButton
					onPress={() => router.push('/criar-conta' as never)}
					variant="outline">
					Criar conta
				</AppButton>
			</View>
		</AppScreen>
	);
}
