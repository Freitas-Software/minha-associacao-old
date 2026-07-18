import type { Components, Theme } from '@mui/material/styles';

export const cssBaselineOverrides: Components<Theme>['MuiCssBaseline'] = {
	styleOverrides: theme => ({
		'*, *::before, *::after': {
			boxSizing: 'border-box',
		},

		html: {
			minHeight: '100%',
			backgroundColor: theme.semanticColors.background,
		},

		body: {
			minHeight: '100%',
			margin: 0,
			backgroundColor: theme.semanticColors.background,
			color: theme.semanticColors.onBackground,
			fontFamily: theme.typography.fontFamily,
			WebkitFontSmoothing: 'antialiased',
			MozOsxFontSmoothing: 'grayscale',
		},

		'#root': {
			minHeight: '100%',
		},

		a: {
			color: 'inherit',
			textDecoration: 'none',
		},

		button: {
			font: 'inherit',
		},
	}),
};
