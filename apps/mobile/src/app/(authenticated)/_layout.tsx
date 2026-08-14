import { Stack } from 'expo-router';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

export default function AuthenticatedLayout() {
	const { colors } = useMinhaAssociacaoTheme().minhaAssociacao;

	return (
		<Stack
			screenOptions={{
				contentStyle: { backgroundColor: colors.canvas },
				headerShown: false,
			}}
		/>
	);
}
