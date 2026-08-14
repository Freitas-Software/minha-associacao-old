import { AppIcon, AppScreen, AppScreenHeader, EmptyState } from '@/components/ui';

export default function MembersScreen() {
	return (
		<AppScreen safeAreaEdges={['top', 'right', 'left']}>
			<AppScreenHeader
				description="Consulte e administre as pessoas vinculadas à associação."
				title="Membros"
			/>
			<EmptyState
				contained
				description="A lista de membros aparecerá aqui quando os dados forem carregados."
				icon={
					<AppIcon
						name="account-group-outline"
						size={40}
						tone="accent"
					/>
				}
				title="Nenhum membro para exibir"
			/>
		</AppScreen>
	);
}
