import type { Components, Theme } from '@mui/material/styles';

export const textFieldOverrides: Components<Theme>['MuiTextField'] = {
	defaultProps: {
		fullWidth: true,
		size: 'small',
		variant: 'outlined',
	},
};

export const outlinedInputOverrides: Components<Theme>['MuiOutlinedInput'] = {
	styleOverrides: {
		root: ({ theme }) => ({
			minHeight: 40,
			backgroundColor: theme.semanticColors.surface,
			borderRadius: theme.shape.borderRadius,

			'& .MuiOutlinedInput-notchedOutline': {
				borderColor: theme.semanticColors.outline,
			},

			'&:hover .MuiOutlinedInput-notchedOutline': {
				borderColor: theme.semanticColors.onSurfaceVariant,
			},

			'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
				borderColor: theme.semanticColors.primary,
				borderWidth: 2,
			},

			'&.Mui-error .MuiOutlinedInput-notchedOutline': {
				borderColor: theme.semanticColors.error,
			},

			'&.Mui-disabled': {
				backgroundColor: theme.semanticColors.surfaceVariant,
			},
		}),

		input: ({ theme }) => ({
			color: theme.semanticColors.onSurface,

			'&::placeholder': {
				color: theme.semanticColors.onSurfaceVariant,
				opacity: 1,
			},
		}),
	},
};
