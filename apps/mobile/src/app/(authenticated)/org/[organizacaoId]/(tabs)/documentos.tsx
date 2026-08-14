import { AppIcon, AppScreen, AppScreenHeader, EmptyState } from '@/components/ui';

export default function DocumentsScreen() {
	return (
		<AppScreen safeAreaEdges={['top', 'right', 'left']}>
			<AppScreenHeader
				description="Organize os arquivos e registros importantes da associação."
				title="Documentos"
			/>
			<EmptyState
				contained
				description="Os documentos enviados para a associação aparecerão aqui."
				icon={
					<AppIcon
						name="file-document-outline"
						size={40}
						tone="accent"
					/>
				}
				title="Nenhum documento para exibir"
			/>
		</AppScreen>
	);
}
