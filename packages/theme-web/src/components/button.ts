import type { Components, Theme } from '@mui/material/styles';

export const buttonOverrides: Components<Theme>['MuiButton'] = {
	defaultProps: {
		disableElevation: true,
		disableRipple: false,
	},

	styleOverrides: {
		root: ({ theme }) => ({
			minHeight: 40,
			paddingInline: theme.spacing(2.5),
			borderRadius: theme.shape.borderRadius,
			fontWeight: theme.typography.fontWeightMedium,
			textTransform: 'none',
		}),

		sizeSmall: {
			minHeight: 32,
			paddingInline: 12,
		},

		sizeLarge: {
			minHeight: 48,
			paddingInline: 24,
		},

		contained: ({ theme }) => ({
			backgroundColor: theme.semanticColors.secondary,
			color: theme.semanticColors.onSecondary,
		}),

		outlined: ({ theme }) => ({
			borderColor: theme.semanticColors.outline,

			'&:hover': {
				borderColor: theme.semanticColors.primary,
				backgroundColor: theme.semanticColors.primaryContainer,
				color: theme.semanticColors.onPrimaryContainer,
			},
		}),
	},
};
