import { AppIcon, AppScreen, AppScreenHeader, EmptyState } from '@/components/ui';

export default function ProjectsScreen() {
	return (
		<AppScreen safeAreaEdges={['top', 'right', 'left']}>
			<AppScreenHeader
				description="Acompanhe as iniciativas e atividades da associação."
				title="Projetos"
			/>
			<EmptyState
				contained
				description="Os projetos cadastrados aparecerão aqui."
				icon={
					<AppIcon
						name="briefcase-outline"
						size={40}
						tone="accent"
					/>
				}
				title="Nenhum projeto para exibir"
			/>
		</AppScreen>
	);
}
