export type FontWeightToken = 'regular' | 'medium' | 'semiBold' | 'bold';

export interface FontFamilyDefinition {
	id: string;
	family: string;
	mobile: Record<FontWeightToken, string>;
	web: {
		family: string;
		fallback: string;
	};
}

export interface TypographyStyle {
	fontFamily: 'interface' | 'brand' | 'numeric';
	fontSize: number;
	lineHeight: number;
	fontWeight: FontWeightToken;
	letterSpacing?: number;
}

export interface TypographyScale {
	displayLarge: TypographyStyle;
	displayMedium: TypographyStyle;
	headingLarge: TypographyStyle;
	headingMedium: TypographyStyle;
	headingSmall: TypographyStyle;
	titleLarge: TypographyStyle;
	titleMedium: TypographyStyle;
	titleSmall: TypographyStyle;
	bodyLarge: TypographyStyle;
	bodyMedium: TypographyStyle;
	bodySmall: TypographyStyle;
	labelLarge: TypographyStyle;
	labelMedium: TypographyStyle;
	labelSmall: TypographyStyle;
	moneyLarge: TypographyStyle;
	moneyMedium: TypographyStyle;
	moneySmall: TypographyStyle;
}

export interface ThemeTypography {
	interface: FontFamilyDefinition;
	brand: FontFamilyDefinition;
	numeric: FontFamilyDefinition;
	scale: TypographyScale;
}
