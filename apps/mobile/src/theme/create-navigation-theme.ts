import type { MinhaAssociacaoThemeDefinition } from '@minha-associacao/design-tokens';

/**
 * Mantém o navigator do Expo Router na mesma paleta semântica do React Native Paper.
 * Sem este adapter, o Router usa azul e superfícies claras dos temas padrão.
 */
export function createNavigationTheme(definition: MinhaAssociacaoThemeDefinition) {
	const { colors, typography } = definition;

	return {
		dark: definition.mode === 'dark',
		colors: {
			primary: colors.actionPrimary,
			background: colors.canvas,
			card: colors.navigationBackground,
			text: colors.navigationContent,
			border: colors.borderSubtle,
			notification: colors.feedbackWarning,
		},
		fonts: {
			regular: {
				fontFamily: typography.interface.mobile.regular,
				fontWeight: '400' as const,
			},
			medium: {
				fontFamily: typography.interface.mobile.medium,
				fontWeight: '500' as const,
			},
			bold: {
				fontFamily: typography.interface.mobile.bold,
				fontWeight: '700' as const,
			},
			heavy: {
				fontFamily: typography.interface.mobile.bold,
				fontWeight: '700' as const,
			},
		},
	};
}
