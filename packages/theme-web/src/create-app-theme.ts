import {
	breakpoints,
	darkColors,
	lightColors,
	radius,
	typography,
} from '@minha-associacao/design-tokens';
import { createTheme } from '@mui/material/styles';
import type { AppThemeMode } from './types';

export function createAppTheme(mode: AppThemeMode) {
	const colors = mode === 'light' ? lightColors : darkColors;

	return createTheme({
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
		},

		shape: {
			borderRadius: radius.md,
		},

		typography: {
			fontFamily: typography.fontFamily.sans,

			button: {
				fontWeight: typography.fontWeight.semibold,
				textTransform: 'none',
			},
		},
	});
}
