import { typography } from '@minha-associacao/design-tokens';
import { configureFonts } from 'react-native-paper';

const nativeTypography = typography.fontFamily.native;

export const nativeFonts = configureFonts({
	config: {
		displayLarge: {
			fontFamily: nativeTypography.sansBold,
			fontWeight: '700',
		},

		displayMedium: {
			fontFamily: nativeTypography.sansBold,
			fontWeight: '700',
		},

		displaySmall: {
			fontFamily: nativeTypography.sansSemibold,
			fontWeight: '600',
		},

		headlineLarge: {
			fontFamily: nativeTypography.sansBold,
			fontWeight: '700',
		},

		headlineMedium: {
			fontFamily: nativeTypography.sansSemibold,
			fontWeight: '600',
		},

		headlineSmall: {
			fontFamily: nativeTypography.sansSemibold,
			fontWeight: '600',
		},

		titleLarge: {
			fontFamily: nativeTypography.sansSemibold,
			fontWeight: '600',
		},

		titleMedium: {
			fontFamily: nativeTypography.sansMedium,
			fontWeight: '500',
		},

		titleSmall: {
			fontFamily: nativeTypography.sansMedium,
			fontWeight: '500',
		},

		bodyLarge: {
			fontFamily: nativeTypography.sansRegular,
			fontWeight: '400',
		},

		bodyMedium: {
			fontFamily: nativeTypography.sansRegular,
			fontWeight: '400',
		},

		bodySmall: {
			fontFamily: nativeTypography.sansRegular,
			fontWeight: '400',
		},

		labelLarge: {
			fontFamily: nativeTypography.sansSemibold,
			fontWeight: '600',
		},

		labelMedium: {
			fontFamily: nativeTypography.sansMedium,
			fontWeight: '500',
		},

		labelSmall: {
			fontFamily: nativeTypography.sansMedium,
			fontWeight: '500',
		},
	},
});
