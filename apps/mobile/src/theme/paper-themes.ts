import { type ThemeId, themes } from '@minha-associacao/design-tokens';
import { createPaperTheme, type MinhaAssociacaoPaperTheme } from './create-paper-theme';

export const paperThemes: Record<ThemeId, MinhaAssociacaoPaperTheme> = {
	light: createPaperTheme(themes.light),
	dark: createPaperTheme(themes.dark),
};
