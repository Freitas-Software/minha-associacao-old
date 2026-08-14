import {
	AppButton,
	AppCard,
	AppChip,
	AppRadioButton,
	AppScreen,
	AppScreenHeader,
	AppText,
} from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { useAppTheme } from '@/providers/app-theme-provider';

export default function SettingsScreen() {
	const { session, signOut } = useAuth();
	const { mode, preference, setPreference } = useAppTheme();

	function handleThemePreference(value: string) {
		if (value === 'system' || value === 'light' || value === 'dark') {
			setPreference(value);
		}
	}

	return (
		<AppScreen
			safeAreaEdges={['top', 'right', 'left']}
			scrollable>
			<AppScreenHeader
				description="Personalize o aplicativo e gerencie sua sessão."
				title="Configurações"
			/>

			<AppCard
				description="Escolha um tema ou acompanhe a aparência configurada no dispositivo."
				dividers
				headerAction={
					<AppChip variant="primary">{mode === 'dark' ? 'Escuro' : 'Claro'}</AppChip>
				}
				title="Aparência">
				<AppRadioButton.Group
					onValueChange={handleThemePreference}
					value={preference}>
					<AppRadioButton.Item
						label="Usar tema do dispositivo"
						value="system"
					/>
					<AppRadioButton.Item
						label="Tema claro"
						value="light"
					/>
					<AppRadioButton.Item
						label="Tema escuro"
						value="dark"
					/>
				</AppRadioButton.Group>
			</AppCard>

			<AppCard
				description={session?.user.name ?? 'Usuário autenticado'}
				footer={
					<AppButton
						onPress={signOut}
						variant="outline">
						Sair da conta
					</AppButton>
				}
				title="Conta">
				<AppText tone="secondary">
					Ao sair, será necessário entrar novamente para acessar as associações.
				</AppText>
			</AppCard>
		</AppScreen>
	);
}
