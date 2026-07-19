import type { ButtonVariant, ComponentSize } from '@minha-associacao/ui-core';

export interface NativeButtonConfiguration {
	mode: 'contained' | 'contained-tonal' | 'outlined' | 'text';
	useErrorColors: boolean;
}

export const nativeButtonConfiguration: Record<ButtonVariant, NativeButtonConfiguration> = {
	primary: {
		mode: 'contained',
		useErrorColors: false,
	},
	secondary: {
		mode: 'contained-tonal',
		useErrorColors: false,
	},
	outline: {
		mode: 'outlined',
		useErrorColors: false,
	},
	ghost: {
		mode: 'text',
		useErrorColors: false,
	},
	danger: {
		mode: 'contained',
		useErrorColors: true,
	},
};

export const nativeButtonMinHeight: Record<ComponentSize, number> = {
	small: 44,
	medium: 48,
	large: 56,
};
