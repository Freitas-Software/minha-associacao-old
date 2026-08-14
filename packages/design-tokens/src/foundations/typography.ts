import type { ThemeTypography, TypographyScale } from '../contracts';
import { geistFont, geistMonoFont } from './fonts';

export const defaultTypographyScale = {
	displayLarge: {
		fontFamily: 'brand',
		fontSize: 36,
		lineHeight: 44,
		fontWeight: 'bold',
		letterSpacing: -0.8,
	},
	displayMedium: {
		fontFamily: 'brand',
		fontSize: 30,
		lineHeight: 38,
		fontWeight: 'bold',
		letterSpacing: -0.5,
	},
	headingLarge: {
		fontFamily: 'brand',
		fontSize: 24,
		lineHeight: 32,
		fontWeight: 'semiBold',
		letterSpacing: -0.4,
	},
	headingMedium: {
		fontFamily: 'brand',
		fontSize: 20,
		lineHeight: 28,
		fontWeight: 'semiBold',
		letterSpacing: -0.2,
	},
	headingSmall: { fontFamily: 'brand', fontSize: 18, lineHeight: 26, fontWeight: 'semiBold' },
	titleLarge: { fontFamily: 'interface', fontSize: 18, lineHeight: 26, fontWeight: 'semiBold' },
	titleMedium: { fontFamily: 'interface', fontSize: 16, lineHeight: 24, fontWeight: 'semiBold' },
	titleSmall: { fontFamily: 'interface', fontSize: 14, lineHeight: 20, fontWeight: 'medium' },
	bodyLarge: { fontFamily: 'interface', fontSize: 16, lineHeight: 24, fontWeight: 'regular' },
	bodyMedium: { fontFamily: 'interface', fontSize: 14, lineHeight: 20, fontWeight: 'regular' },
	bodySmall: { fontFamily: 'interface', fontSize: 12, lineHeight: 18, fontWeight: 'regular' },
	labelLarge: { fontFamily: 'interface', fontSize: 14, lineHeight: 20, fontWeight: 'semiBold' },
	labelMedium: { fontFamily: 'interface', fontSize: 12, lineHeight: 16, fontWeight: 'semiBold' },
	labelSmall: { fontFamily: 'interface', fontSize: 11, lineHeight: 16, fontWeight: 'medium' },
	moneyLarge: {
		fontFamily: 'numeric',
		fontSize: 30,
		lineHeight: 38,
		fontWeight: 'bold',
		letterSpacing: -0.5,
	},
	moneyMedium: { fontFamily: 'numeric', fontSize: 20, lineHeight: 28, fontWeight: 'semiBold' },
	moneySmall: { fontFamily: 'numeric', fontSize: 14, lineHeight: 20, fontWeight: 'medium' },
} as const satisfies TypographyScale;

export const defaultTypography = {
	interface: geistFont,
	brand: geistFont,
	numeric: geistMonoFont,
	scale: defaultTypographyScale,
} as const satisfies ThemeTypography;
