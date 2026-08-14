import { AppCard, AppIcon, AppScreen, AppScreenHeader, EmptyState } from '@/components/ui';
import { useOrganizacao } from '@/hooks/use-organizacao';

export default function DashboardScreen() {
	const { organizacaoId } = useOrganizacao();

	return (
		<AppScreen
			safeAreaEdges={['top', 'right', 'left']}
			scrollable>
			<AppScreenHeader
				description={`Associação atual: ${organizacaoId}`}
				title="Minha Associação"
			/>
			<AppCard
				description="Os principais indicadores da associação ficarão reunidos neste espaço."
				title="Visão geral">
				<EmptyState
					description="Os dados do painel serão exibidos quando a integração com o servidor estiver disponível."
					icon={
						<AppIcon
							name="view-dashboard-outline"
							size={40}
							tone="accent"
						/>
					}
					title="Painel em preparação"
				/>
			</AppCard>
		</AppScreen>
	);
}
