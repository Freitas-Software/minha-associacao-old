import type { SemanticColors } from './colors';
import type { MotionScale, RadiusScale, ShadowScale, SpacingScale } from './foundations';
import type { ThemeTypography } from './typography';

export const themeIds = ['light', 'dark'] as const;

export type ThemeId = (typeof themeIds)[number];
export type ThemeMode = ThemeId;
export type ThemePreference = 'system' | ThemeId;

export interface MinhaAssociacaoThemeDefinition {
	id: ThemeId;
	name: string;
	mode: ThemeMode;
	colors: SemanticColors;
	typography: ThemeTypography;
	spacing: SpacingScale;
	radii: RadiusScale;
	shadows: ShadowScale;
	motion: MotionScale;
}
