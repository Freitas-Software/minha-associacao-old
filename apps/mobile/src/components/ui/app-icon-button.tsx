import { IconButton, type IconButtonProps } from 'react-native-paper';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

export type AppIconButtonVariant = 'default' | 'primary' | 'secondary' | 'danger';
export interface AppIconButtonProps extends IconButtonProps {
	variant?: AppIconButtonVariant;
}

export function AppIconButton({ style, variant = 'default', ...props }: AppIconButtonProps) {
	const { minhaAssociacao } = useMinhaAssociacaoTheme();
	const colors = minhaAssociacao.colors;
	const selected = {
		default: {
			borderColor: colors.borderControl,
			containerColor: colors.surface,
			iconColor: colors.contentPrimary,
			mode: 'outlined' as const,
		},
		primary: {
			borderColor: colors.actionPrimary,
			containerColor: colors.actionPrimary,
			iconColor: colors.actionPrimaryContent,
			mode: 'contained' as const,
		},
		secondary: {
			borderColor: colors.actionSecondary,
			containerColor: colors.actionSecondary,
			iconColor: colors.actionSecondaryContent,
			mode: 'contained-tonal' as const,
		},
		danger: {
			borderColor: colors.feedbackNegative,
			containerColor: colors.feedbackNegative,
			iconColor: colors.feedbackNegativeContent,
			mode: 'contained' as const,
		},
	}[variant];
	return (
		<IconButton
			{...props}
			containerColor={selected.containerColor}
			iconColor={selected.iconColor}
			mode={selected.mode}
			style={[
				{ borderColor: selected.borderColor, borderRadius: minhaAssociacao.radii.pill },
				style,
			]}
		/>
	);
}
