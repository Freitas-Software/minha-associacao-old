import { darkColors, radius } from "@minha-associacao/design-tokens";
import { MD3DarkTheme } from "react-native-paper";
import { nativeFonts } from "./fonts.js";
import { darkSurfaceColors } from "./surface-colors.js";
import type { NativeTheme } from "./types.js";

export const darkNativeTheme = {
	...MD3DarkTheme,

	dark: true,
	roundness: radius.md,

	fonts: nativeFonts,

	colors: {
		...MD3DarkTheme.colors,

		primary: darkColors.primary,
		onPrimary: darkColors.onPrimary,
		primaryContainer: darkColors.primaryContainer,
		onPrimaryContainer: darkColors.onPrimaryContainer,

		secondary: darkColors.secondary,
		onSecondary: darkColors.onSecondary,
		secondaryContainer: darkColors.secondaryContainer,
		onSecondaryContainer: darkColors.onSecondaryContainer,

		tertiary: darkColors.tertiary,
		onTertiary: darkColors.onTertiary,
		tertiaryContainer: darkColors.tertiaryContainer,
		onTertiaryContainer: darkColors.onTertiaryContainer,

		error: darkColors.error,
		onError: darkColors.onError,
		errorContainer: darkColors.errorContainer,
		onErrorContainer: darkColors.onErrorContainer,

		background: darkColors.background,
		onBackground: darkColors.onBackground,

		surface: darkColors.surface,
		onSurface: darkColors.onSurface,

		surfaceVariant: darkColors.surfaceVariant,
		onSurfaceVariant: darkColors.onSurfaceVariant,

		outline: darkColors.outline,
		outlineVariant: darkColors.outlineVariant,

		inverseSurface: darkColors.inverseSurface,
		inverseOnSurface: darkColors.inverseOnSurface,
		inversePrimary: darkColors.inversePrimary,

		scrim: darkColors.scrim,

		...darkSurfaceColors,
	},
} satisfies NativeTheme;
