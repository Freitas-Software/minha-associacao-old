import type { MinhaAssociacaoThemeDefinition, ThemeId } from '../contracts';
import { darkTheme } from './dark';
import { lightTheme } from './light';

export const themes: Record<ThemeId, MinhaAssociacaoThemeDefinition> = {
	light: lightTheme,
	dark: darkTheme,
};

export { createMinhaAssociacaoTheme } from './create-minha-associacao-theme';
export { darkTheme } from './dark';
export { lightTheme } from './light';
