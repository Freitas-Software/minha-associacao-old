import type {
	MinhaAssociacaoThemeDefinition,
	SemanticColors,
	ThemeId,
	ThemeMode,
	ThemeTypography,
} from '../contracts';
import { defaultTypography, motion, radii, shadows, spacing } from '../foundations';

interface CreateMinhaAssociacaoThemeOptions {
	id: ThemeId;
	name: string;
	mode: ThemeMode;
	colors: SemanticColors;
	typography?: ThemeTypography;
}

export const createMinhaAssociacaoTheme = (
	options: CreateMinhaAssociacaoThemeOptions
): MinhaAssociacaoThemeDefinition => ({
	id: options.id,
	name: options.name,
	mode: options.mode,
	colors: options.colors,
	typography: options.typography ?? defaultTypography,
	spacing,
	radii,
	shadows,
	motion,
});
