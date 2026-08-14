import { FAB, type FABProps } from 'react-native-paper';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

export type AppFABVariant = 'primary' | 'secondary' | 'danger';
export type AppFABProps = FABProps & { variant?: AppFABVariant };

export function AppFAB({ style, variant = 'primary', ...props }: AppFABProps) {
	const { minhaAssociacao } = useMinhaAssociacaoTheme();
	const colors = minhaAssociacao.colors;
	const selected = {
		primary: { backgroundColor: colors.actionPrimary, color: colors.actionPrimaryContent },
		secondary: { backgroundColor: colors.actionSecondary, color: colors.actionSecondaryContent },
		danger: {
			backgroundColor: colors.feedbackNegative,
			color: colors.feedbackNegativeContent,
		},
	}[variant];
	const fabProps = {
		...props,
		color: selected.color,
		style: [
			{ backgroundColor: selected.backgroundColor, borderRadius: minhaAssociacao.radii.lg },
			style,
		],
	} as FABProps;
	return <FAB {...fabProps} />;
}
