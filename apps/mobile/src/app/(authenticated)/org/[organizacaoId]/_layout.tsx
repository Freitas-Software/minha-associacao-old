import { Stack, useLocalSearchParams } from 'expo-router';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';
import { OrganizacaoProvider } from '@/providers/organizacao-provider';

export default function OrganizacaoLayout() {
	const { organizacaoId } = useLocalSearchParams<{
		organizacaoId: string;
	}>();
	const { colors } = useMinhaAssociacaoTheme().minhaAssociacao;

	return (
		<OrganizacaoProvider organizacaoId={organizacaoId}>
			<Stack
				screenOptions={{
					contentStyle: { backgroundColor: colors.canvas },
					headerShown: false,
				}}
			/>
		</OrganizacaoProvider>
	);
}
