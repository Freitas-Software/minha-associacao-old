import { lightColors, radius } from '@minha-associacao/design-tokens';
import { MD3LightTheme } from 'react-native-paper';

import { lightSurfaceColors } from './surface-colors.js';
import type { NativeTheme } from './types.js';

export const lightNativeTheme = {
	...MD3LightTheme,

	dark: false,
	roundness: radius.md,

	colors: {
		...MD3LightTheme.colors,

		primary: lightColors.primary,
		onPrimary: lightColors.onPrimary,
		primaryContainer: lightColors.primaryContainer,
		onPrimaryContainer: lightColors.onPrimaryContainer,

		secondary: lightColors.secondary,
		onSecondary: lightColors.onSecondary,
		secondaryContainer: lightColors.secondaryContainer,
		onSecondaryContainer: lightColors.onSecondaryContainer,

		tertiary: lightColors.tertiary,
		onTertiary: lightColors.onTertiary,
		tertiaryContainer: lightColors.tertiaryContainer,
		onTertiaryContainer: lightColors.onTertiaryContainer,

		error: lightColors.error,
		onError: lightColors.onError,
		errorContainer: lightColors.errorContainer,
		onErrorContainer: lightColors.onErrorContainer,

		background: lightColors.background,
		onBackground: lightColors.onBackground,

		surface: lightColors.surface,
		onSurface: lightColors.onSurface,

		surfaceVariant: lightColors.surfaceVariant,
		onSurfaceVariant: lightColors.onSurfaceVariant,

		outline: lightColors.outline,
		outlineVariant: lightColors.outlineVariant,

		inverseSurface: lightColors.inverseSurface,
		inverseOnSurface: lightColors.inverseOnSurface,
		inversePrimary: lightColors.inversePrimary,

		scrim: lightColors.scrim,

		...lightSurfaceColors,
	},
} satisfies NativeTheme;
