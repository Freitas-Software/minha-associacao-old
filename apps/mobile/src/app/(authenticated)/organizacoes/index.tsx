import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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
import { apiRequest } from '@/lib/api';

type Organization = {
	id: string;
	name: string;
	abbreviation: string;
	documentNumber: string;
	status: string;
};

export default function OrganizacoesScreen() {
	const [organizations, setOrganizations] = useState<Organization[]>([]);
	const [error, setError] = useState<string | null>(null);

	const loadOrganizations = useCallback(async () => {
		try {
			setError(null);
			const result = await apiRequest<{ organizations: Organization[] }>('/api/organizations');
			setOrganizations(result.organizations);
		} catch (cause) {
			setError(
				cause instanceof Error ? cause.message : 'Não foi possível carregar as associações.'
			);
		}
	}, []);

	useEffect(() => {
		void loadOrganizations();
	}, [loadOrganizations]);

	function openOrganizacao(organizationId: string) {
		router.push({
			pathname: '/org/[organizacaoId]',
			params: {
				organizacaoId: organizationId,
			},
		});
	}

	return (
		<AppScreen scrollable>
			<AppScreenHeader
				description="Selecione a associação que deseja administrar."
				title="Suas associações"
			/>
			{error ? <AppText tone="negative">{error}</AppText> : null}
			{organizations.length > 0 ? (
				organizations.map(organization => (
					<AppCard
						description={`${organization.documentNumber} · ${organization.status}`}
						footer={
							<AppButton onPress={() => openOrganizacao(organization.id)}>
								Abrir associação
							</AppButton>
						}
						headerAction={<AppAvatar label={organization.abbreviation.slice(0, 2).toUpperCase()} />}
						key={organization.id}
						title={organization.name}>
						<AppText tone="secondary">Acesso autorizado pela sua conta.</AppText>
					</AppCard>
				))
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
