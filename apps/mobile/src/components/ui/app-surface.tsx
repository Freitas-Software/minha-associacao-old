import {
	Divider,
	type DividerProps,
	Surface,
	type SurfaceProps,
	TouchableRipple,
	type TouchableRippleProps,
} from 'react-native-paper';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

export type AppSurfaceVariant = 'default' | 'elevated' | 'subtle' | 'interactive';
export interface AppSurfaceProps extends SurfaceProps {
	variant?: AppSurfaceVariant;
}

export function AppSurface({ variant = 'default', style, ...props }: AppSurfaceProps) {
	const { minhaAssociacao } = useMinhaAssociacaoTheme();
	const selected = {
		default: { backgroundColor: minhaAssociacao.colors.surface, elevation: 0 as const },
		elevated: { backgroundColor: minhaAssociacao.colors.surfaceElevated, elevation: 2 as const },
		subtle: { backgroundColor: minhaAssociacao.colors.surfaceSubtle, elevation: 0 as const },
		interactive: {
			backgroundColor: minhaAssociacao.colors.surfaceInteractive,
			elevation: 0 as const,
		},
	}[variant];
	return (
		<Surface
			{...props}
			elevation={selected.elevation}
			mode={selected.elevation ? 'elevated' : 'flat'}
			style={[
				{ backgroundColor: selected.backgroundColor, borderRadius: minhaAssociacao.radii.lg },
				style,
			]}
		/>
	);
}

export function AppDivider({ style, ...props }: DividerProps) {
	const theme = useMinhaAssociacaoTheme();
	return (
		<Divider
			{...props}
			style={[{ backgroundColor: theme.minhaAssociacao.colors.borderSubtle }, style]}
		/>
	);
}

export function AppTouchableRipple({ rippleColor, ...props }: TouchableRippleProps) {
	const theme = useMinhaAssociacaoTheme();
	return (
		<TouchableRipple
			{...props}
			rippleColor={rippleColor ?? theme.minhaAssociacao.colors.actionPrimarySubtle}
		/>
	);
}
