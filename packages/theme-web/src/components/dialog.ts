import type { Components, Theme } from '@mui/material/styles';

export const dialogOverrides: Components<Theme>['MuiDialog'] = {
	defaultProps: {
		fullWidth: true,
		maxWidth: 'sm',
	},

	styleOverrides: {
		paper: ({ theme }) => ({
			backgroundColor: theme.semanticColors.surface,
			backgroundImage: 'none',
			border: `1px solid ${theme.semanticColors.outlineVariant}`,
			borderRadius:
				typeof theme.shape.borderRadius === 'number'
					? theme.shape.borderRadius * 2
					: theme.shape.borderRadius,
		}),
	},
};
