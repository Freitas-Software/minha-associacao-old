import { router, useLocalSearchParams } from 'expo-router';
import { AppButton, AppCard, AppScreen, AppScreenHeader, AppText } from '@/components/ui';

export default function ProjectDetailsScreen() {
	const { projetoId } = useLocalSearchParams<{
		projetoId: string;
	}>();

	return (
		<AppScreen
			safeAreaEdges={['top', 'right', 'left']}
			scrollable>
			<AppButton
				onPress={() => router.back()}
				variant="ghost">
				Voltar
			</AppButton>
			<AppScreenHeader
				description="Consulte as informações deste projeto."
				title="Detalhes do projeto"
			/>
			<AppCard
				description={`Identificador: ${projetoId}`}
				title="Projeto">
				<AppText tone="secondary">
					O acompanhamento completo será exibido quando a integração estiver disponível.
				</AppText>
			</AppCard>
		</AppScreen>
	);
}
