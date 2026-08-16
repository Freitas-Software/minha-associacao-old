import { router } from 'expo-router';
import { AppButton, AppIcon, AppScreen, AppSurface, AppText } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

export default function SignInScreen() {
	const { setSession } = useAuth();
	const { spacing } = useMinhaAssociacaoTheme().minhaAssociacao;

	function handleDevelopmentLogin() {
		setSession({
			user: {
				id: 'dev-user',
				name: 'Usuário de desenvolvimento',
			},
		});

		router.replace('/organizacoes');
	}

	return (
		<AppScreen
			centered
			scrollable>
			<AppSurface
				variant="subtle"
				style={{ gap: spacing.lg, padding: spacing.xl }}>
				<AppIcon
					name="account-group-outline"
					size={44}
					tone="accent"
				/>
				<AppText
					accessibilityRole="header"
					tone="accent"
					variant="headlineLarge">
					Minha Associação
				</AppText>
				<AppText tone="secondary">A autenticação ainda não está conectada ao servidor.</AppText>

				{__DEV__ ? (
					<AppButton onPress={handleDevelopmentLogin}>Entrar em modo de desenvolvimento</AppButton>
				) : null}
			</AppSurface>
		</AppScreen>
	);
}
