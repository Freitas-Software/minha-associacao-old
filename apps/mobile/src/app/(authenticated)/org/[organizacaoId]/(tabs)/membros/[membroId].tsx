import { router, useLocalSearchParams } from 'expo-router';
import { AppButton, AppCard, AppScreen, AppScreenHeader, AppText } from '@/components/ui';

export default function MemberDetailsScreen() {
	const { membroId } = useLocalSearchParams<{
		membroId: string;
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
				description="Consulte as informações deste membro."
				title="Detalhes do membro"
			/>
			<AppCard
				description={`Identificador: ${membroId}`}
				title="Membro">
				<AppText tone="secondary">
					Os dados completos serão exibidos quando a integração estiver disponível.
				</AppText>
			</AppCard>
		</AppScreen>
	);
}
