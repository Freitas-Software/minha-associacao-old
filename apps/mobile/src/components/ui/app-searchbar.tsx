import { Searchbar, type SearchbarProps } from 'react-native-paper';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

export function AppSearchbar({ inputStyle, style, ...props }: SearchbarProps) {
	const { minhaAssociacao } = useMinhaAssociacaoTheme();
	const colors = minhaAssociacao.colors;
	return (
		<Searchbar
			{...props}
			iconColor={colors.contentSecondary}
			inputStyle={[{ color: colors.contentPrimary }, inputStyle]}
			placeholderTextColor={colors.contentMuted}
			style={[
				{ backgroundColor: colors.surfaceInteractive, borderRadius: minhaAssociacao.radii.pill },
				style,
			]}
		/>
	);
}
