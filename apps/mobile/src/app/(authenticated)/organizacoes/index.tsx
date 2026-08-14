import { router } from 'expo-router';
import {
	AppAvatar,
	AppButton,
	AppCard,
	AppIcon,
	AppScreen,
	AppScreenHeader,
	AppText,
	EmptyState,
} from '@/components/ui';

export default function OrganizacoesScreen() {
	function openDevelopmentOrganizacao() {
		router.push({
			pathname: '/org/[organizacaoId]',
			params: {
				organizacaoId: 'dev-organizacao',
			},
		});
	}

	return (
		<AppScreen scrollable>
			<AppScreenHeader
				description="Selecione a associação que deseja administrar."
				title="Suas associações"
			/>
			{__DEV__ ? (
				<AppCard
					description="Ambiente local para validar os fluxos do aplicativo."
					footer={
						<AppButton onPress={openDevelopmentOrganizacao}>
							Abrir associação
						</AppButton>
					}
					headerAction={<AppAvatar label="AD" />}
					title="Associação de desenvolvimento">
					<AppText tone="secondary">Disponível somente durante o desenvolvimento.</AppText>
				</AppCard>
			) : (
				<EmptyState
					contained
					description="Quando uma associação for vinculada à sua conta, ela aparecerá aqui."
					icon={
						<AppIcon
							name="office-building-outline"
							size={40}
							tone="accent"
						/>
					}
					title="Nenhuma associação encontrada"
				/>
			)}

			<AppButton
				onPress={() => router.push('/organizacoes/criar')}
				variant="outline">
				Criar associação
			</AppButton>
		</AppScreen>
	);
}
