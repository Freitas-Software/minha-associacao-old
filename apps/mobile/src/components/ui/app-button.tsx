import type { ReactNode } from 'react';
import { Button, type ButtonProps } from 'react-native-paper';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

export type AppButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type AppComponentSize = 'small' | 'medium' | 'large';
export interface AppButtonProps
	extends Omit<ButtonProps, 'buttonColor' | 'children' | 'contentStyle' | 'mode' | 'textColor'> {
	children: ReactNode;
	loadingLabel?: string;
	size?: AppComponentSize;
	variant?: AppButtonVariant;
}

export function AppButton({
	children,
	disabled,
	loading = false,
	loadingLabel,
	size = 'medium',
	style,
	variant = 'primary',
	...props
}: AppButtonProps) {
	const { minhaAssociacao } = useMinhaAssociacaoTheme();
	const colors = minhaAssociacao.colors;
	const selected = {
		primary: {
			color: colors.actionPrimary,
			content: colors.actionPrimaryContent,
			mode: 'contained' as const,
		},
		secondary: {
			color: colors.actionSecondary,
			content: colors.actionSecondaryContent,
			mode: 'contained-tonal' as const,
		},
		outline: { color: undefined, content: colors.actionPrimaryText, mode: 'outlined' as const },
		ghost: { color: undefined, content: colors.actionPrimaryText, mode: 'text' as const },
		danger: {
			color: colors.feedbackNegative,
			content: colors.feedbackNegativeContent,
			mode: 'contained' as const,
		},
	}[variant];
	const minHeight = { small: 36, medium: 44, large: 52 }[size];
	return (
		<Button
			{...props}
			buttonColor={selected.color}
			contentStyle={{ minHeight }}
			disabled={disabled || loading}
			loading={loading}
			mode={selected.mode}
			style={[{ borderRadius: minhaAssociacao.radii.md }, style]}
			textColor={selected.content}>
			{loading && loadingLabel ? loadingLabel : children}
		</Button>
	);
}
