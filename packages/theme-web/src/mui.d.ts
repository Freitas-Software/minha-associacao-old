import type { SemanticColors } from '@minha-associacao/design-tokens';

declare module '@mui/material/styles' {
	interface Theme {
		semanticColors: SemanticColors;
	}

	interface ThemeOptions {
		semanticColors?: SemanticColors;
	}
}
