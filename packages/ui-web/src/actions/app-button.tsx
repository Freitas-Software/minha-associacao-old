import type { ButtonVariant, SharedButtonProps } from '@minha-associacao/ui-core';
import {
	CircularProgress,
	Button as MuiButton,
	type ButtonProps as MuiButtonProps,
} from '@mui/material';
import type { ElementType, ReactNode } from 'react';

type AllowedMuiButtonProps = Omit<
	MuiButtonProps,
	'children' | 'color' | 'disabled' | 'loading' | 'size' | 'variant'
>;

export interface AppButtonProps extends SharedButtonProps, AllowedMuiButtonProps {
	children: ReactNode;
	loadingLabel?: string;
	startIcon?: ReactNode;
	endIcon?: ReactNode;
	component?: ElementType;
}

interface MuiButtonConfiguration {
	color: 'primary' | 'secondary' | 'error' | 'inherit';
	variant: 'contained' | 'outlined' | 'text';
}

const variantConfiguration: Record<ButtonVariant, MuiButtonConfiguration> = {
	primary: {
		color: 'primary',
		variant: 'contained',
	},
	secondary: {
		color: 'secondary',
		variant: 'contained',
	},
	outline: {
		color: 'primary',
		variant: 'outlined',
	},
	ghost: {
		color: 'inherit',
		variant: 'text',
	},
	danger: {
		color: 'error',
		variant: 'contained',
	},
};

export function AppButton({
	children,
	variant = 'primary',
	size = 'medium',
	loading = false,
	loadingLabel,
	disabled = false,
	startIcon,
	endIcon,
	...buttonProps
}: AppButtonProps) {
	const configuration = variantConfiguration[variant];

	const content = loading && loadingLabel ? loadingLabel : children;

	return (
		<MuiButton
			{...buttonProps}
			color={configuration.color}
			disabled={disabled || loading}
			endIcon={loading ? undefined : endIcon}
			size={size}
			startIcon={
				loading ? (
					<CircularProgress
						aria-hidden
						color="inherit"
						size={16}
					/>
				) : (
					startIcon
				)
			}
			variant={configuration.variant}>
			{content}
		</MuiButton>
	);
}
