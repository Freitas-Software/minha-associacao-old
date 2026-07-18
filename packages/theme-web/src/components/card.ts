import type { Components, Theme } from '@mui/material/styles';

export const cardOverrides: Components<Theme>['MuiCard'] = {
	defaultProps: {
		elevation: 0,
	},

	styleOverrides: {
		root: ({ theme }) => ({
			backgroundColor: theme.semanticColors.surface,
			backgroundImage: 'none',
			border: `1px solid ${theme.semanticColors.outlineVariant}`,
			borderRadius: theme.shape.borderRadius,
		}),
	},
};
