import { router, useLocalSearchParams } from 'expo-router';
import { AppButton, AppCard, AppScreen, AppScreenHeader, AppText } from '@/components/ui';

export default function DocumentDetailsScreen() {
	const { documentoId } = useLocalSearchParams<{
		documentoId: string;
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
				description="Consulte as informações deste documento."
				title="Detalhes do documento"
			/>
			<AppCard
				description={`Identificador: ${documentoId}`}
				title="Documento">
				<AppText tone="secondary">
					O conteúdo completo será exibido quando a integração estiver disponível.
				</AppText>
			</AppCard>
		</AppScreen>
	);
}
