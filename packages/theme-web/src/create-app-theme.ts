import {
	breakpoints,
	darkColors,
	lightColors,
	radius,
	typography,
} from '@minha-associacao/design-tokens';
import { createTheme } from '@mui/material/styles';
import { componentOverrides } from './components/index.js';
import type { AppThemeMode } from './types.js';

export function createAppTheme(mode: AppThemeMode) {
	const colors = mode === 'light' ? lightColors : darkColors;

	return createTheme({
		components: componentOverrides,

		cssVariables: {
			cssVarPrefix: 'association',
		},

		breakpoints: {
			values: breakpoints,
		},

		palette: {
			mode,

			primary: {
				main: colors.primary,
				contrastText: colors.onPrimary,
			},

			secondary: {
				main: colors.secondary,
				contrastText: colors.onSecondary,
			},

			error: {
				main: colors.error,
				contrastText: colors.onError,
			},

			background: {
				default: colors.background,
				paper: colors.surface,
			},

			text: {
				primary: colors.onSurface,
				secondary: colors.onSurfaceVariant,
			},

			divider: colors.outlineVariant,

			action: {
				active: colors.onSurfaceVariant,
				disabled: colors.onSurfaceVariant,
				disabledBackground: colors.surfaceVariant,
				hover: colors.primaryContainer,
				selected: colors.secondaryContainer,
			},
		},

		semanticColors: colors,

		shape: {
			borderRadius: radius.md,
		},

		typography: {
			fontFamily: [
				typography.fontFamily.sans,
				'system-ui',
				'-apple-system',
				'BlinkMacSystemFont',
				'"Segoe UI"',
				'sans-serif',
			].join(', '),

			fontWeightRegular: typography.fontWeight.regular,
			fontWeightMedium: typography.fontWeight.medium,
			fontWeightBold: typography.fontWeight.bold,

			h1: {
				fontSize: typography.fontSize['4xl'],
				fontWeight: typography.fontWeight.bold,
				lineHeight: typography.lineHeight.compact,
			},

			h2: {
				fontSize: typography.fontSize['3xl'],
				fontWeight: typography.fontWeight.bold,
				lineHeight: typography.lineHeight.compact,
			},

			h3: {
				fontSize: typography.fontSize['2xl'],
				fontWeight: typography.fontWeight.semibold,
				lineHeight: typography.lineHeight.compact,
			},

			h4: {
				fontSize: typography.fontSize.xl,
				fontWeight: typography.fontWeight.semibold,
				lineHeight: typography.lineHeight.compact,
			},

			h5: {
				fontSize: typography.fontSize.lg,
				fontWeight: typography.fontWeight.semibold,
				lineHeight: typography.lineHeight.normal,
			},

			h6: {
				fontSize: typography.fontSize.md,
				fontWeight: typography.fontWeight.semibold,
				lineHeight: typography.lineHeight.normal,
			},

			body1: {
				fontSize: typography.fontSize.md,
				fontWeight: typography.fontWeight.regular,
				lineHeight: typography.lineHeight.normal,
			},

			body2: {
				fontSize: typography.fontSize.sm,
				fontWeight: typography.fontWeight.regular,
				lineHeight: typography.lineHeight.normal,
			},

			subtitle1: {
				fontSize: typography.fontSize.md,
				fontWeight: typography.fontWeight.medium,
				lineHeight: typography.lineHeight.normal,
			},

			subtitle2: {
				fontSize: typography.fontSize.sm,
				fontWeight: typography.fontWeight.medium,
				lineHeight: typography.lineHeight.normal,
			},

			caption: {
				fontSize: typography.fontSize.xs,
				fontWeight: typography.fontWeight.regular,
				lineHeight: typography.lineHeight.normal,
			},

			button: {
				fontSize: typography.fontSize.sm,
				fontWeight: typography.fontWeight.semibold,
				lineHeight: typography.lineHeight.normal,
				textTransform: 'none',
			},
		},
	});
}
