export const typography = {
	fontFamily: {
		sans: 'Geist',
		mono: 'Geist Mono',
		native: {
			sansRegular: 'Geist_400Regular',
			sansMedium: 'Geist_500Medium',
			sansSemibold: 'Geist_600SemiBold',
			sansBold: 'Geist_700Bold',

			monoRegular: 'GeistMono_400Regular',
			monoMedium: 'GeistMono_500Medium',
			monoSemibold: 'GeistMono_600SemiBold',
			monoBold: 'GeistMono_700Bold',
		},
	},

	fontSize: {
		xs: 12,
		sm: 14,
		md: 16,
		lg: 18,
		xl: 20,
		'2xl': 24,
		'3xl': 30,
		'4xl': 36,
	},

	fontWeight: {
		regular: 400,
		medium: 500,
		semibold: 600,
		bold: 700,
	},

	lineHeight: {
		compact: 1.2,
		normal: 1.5,
		relaxed: 1.7,
	},
} as const;
