import { Chip, type ChipProps } from 'react-native-paper';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

export type AppChipVariant = 'default' | 'primary' | 'outlined' | 'danger';
export interface AppChipProps extends ChipProps {
	variant?: AppChipVariant;
}

export function AppChip({ style, textStyle, variant = 'default', ...props }: AppChipProps) {
	const { minhaAssociacao } = useMinhaAssociacaoTheme();
	const colors = minhaAssociacao.colors;
	const selected = {
		default: {
			backgroundColor: colors.surfaceInteractive,
			borderColor: 'transparent',
			color: colors.contentPrimary,
			mode: 'flat' as const,
		},
		primary: {
			backgroundColor: colors.actionPrimarySubtle,
			borderColor: 'transparent',
			color: colors.actionPrimarySubtleContent,
			mode: 'flat' as const,
		},
		outlined: {
			backgroundColor: colors.surface,
			borderColor: colors.borderControl,
			color: colors.contentPrimary,
			mode: 'outlined' as const,
		},
		danger: {
			backgroundColor: colors.feedbackNegativeSubtle,
			borderColor: 'transparent',
			color: colors.feedbackNegativeSubtleContent,
			mode: 'flat' as const,
		},
	}[variant];
	return (
		<Chip
			{...props}
			mode={selected.mode}
			selectedColor={selected.color}
			style={[
				{
					backgroundColor: selected.backgroundColor,
					borderColor: selected.borderColor,
					borderRadius: minhaAssociacao.radii.pill,
				},
				style,
			]}
			textStyle={[{ color: selected.color }, textStyle]}
		/>
	);
}
