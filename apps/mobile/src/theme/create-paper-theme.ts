import type {
	MinhaAssociacaoThemeDefinition,
	TypographyStyle,
} from '@minha-associacao/design-tokens';
import { configureFonts, MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

export type MinhaAssociacaoPaperTheme = MD3Theme & {
	minhaAssociacao: MinhaAssociacaoThemeDefinition;
};

function resolveFontFamily(theme: MinhaAssociacaoThemeDefinition, style: TypographyStyle) {
	return theme.typography[style.fontFamily].mobile[style.fontWeight];
}

function toPaperFont(theme: MinhaAssociacaoThemeDefinition, style: TypographyStyle) {
	return {
		fontFamily: resolveFontFamily(theme, style),
		fontSize: style.fontSize,
		fontWeight: '400' as const,
		letterSpacing: style.letterSpacing ?? 0,
		lineHeight: style.lineHeight,
	};
}

export function createPaperTheme(
	definition: MinhaAssociacaoThemeDefinition
): MinhaAssociacaoPaperTheme {
	const base = definition.mode === 'dark' ? MD3DarkTheme : MD3LightTheme;
	const { colors, typography } = definition;

	return {
		...base,
		dark: definition.mode === 'dark',
		fonts: configureFonts({
			config: {
				displayLarge: toPaperFont(definition, typography.scale.displayLarge),
				displayMedium: toPaperFont(definition, typography.scale.displayMedium),
				displaySmall: toPaperFont(definition, typography.scale.headingLarge),
				headlineLarge: toPaperFont(definition, typography.scale.headingLarge),
				headlineMedium: toPaperFont(definition, typography.scale.headingMedium),
				headlineSmall: toPaperFont(definition, typography.scale.headingSmall),
				titleLarge: toPaperFont(definition, typography.scale.titleLarge),
				titleMedium: toPaperFont(definition, typography.scale.titleMedium),
				titleSmall: toPaperFont(definition, typography.scale.titleSmall),
				bodyLarge: toPaperFont(definition, typography.scale.bodyLarge),
				bodyMedium: toPaperFont(definition, typography.scale.bodyMedium),
				bodySmall: toPaperFont(definition, typography.scale.bodySmall),
				labelLarge: toPaperFont(definition, typography.scale.labelLarge),
				labelMedium: toPaperFont(definition, typography.scale.labelMedium),
				labelSmall: toPaperFont(definition, typography.scale.labelSmall),
				default: toPaperFont(definition, typography.scale.bodyMedium),
			},
		}),
		minhaAssociacao: definition,
		roundness: definition.radii.md,
		colors: {
			...base.colors,
			primary: colors.actionPrimary,
			onPrimary: colors.actionPrimaryContent,
			primaryContainer: colors.actionPrimarySubtle,
			onPrimaryContainer: colors.actionPrimarySubtleContent,
			secondary: colors.actionSecondary,
			onSecondary: colors.actionSecondaryContent,
			secondaryContainer: colors.actionSecondary,
			onSecondaryContainer: colors.actionSecondaryContent,
			tertiary: colors.feedbackPositive,
			onTertiary: colors.feedbackPositiveContent,
			tertiaryContainer: colors.feedbackPositiveSubtle,
			onTertiaryContainer: colors.feedbackPositiveSubtleContent,
			background: colors.canvas,
			onBackground: colors.contentPrimary,
			surface: colors.surface,
			onSurface: colors.contentPrimary,
			surfaceVariant: colors.surfaceSubtle,
			onSurfaceVariant: colors.contentSecondary,
			outline: colors.borderControl,
			outlineVariant: colors.borderSubtle,
			error: colors.feedbackNegative,
			onError: colors.feedbackNegativeContent,
			errorContainer: colors.feedbackNegativeSubtle,
			onErrorContainer: colors.feedbackNegativeSubtleContent,
			inverseSurface: colors.contentPrimary,
			inverseOnSurface: colors.canvas,
			inversePrimary: colors.actionPrimary,
			shadow: colors.shadow,
			scrim: colors.scrim,
			backdrop: colors.overlay,
			surfaceDisabled: `${colors.contentPrimary}1F`,
			onSurfaceDisabled: `${colors.contentPrimary}61`,
			elevation: {
				level0: 'transparent',
				level1: colors.surface,
				level2: colors.surfaceElevated,
				level3: colors.surfaceElevated,
				level4: colors.surfaceInteractive,
				level5: colors.surfaceInteractive,
			},
		},
	};
}
