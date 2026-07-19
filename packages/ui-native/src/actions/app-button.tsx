import type { SharedButtonProps } from '@minha-associacao/ui-core';
import type { ReactNode } from 'react';
import { Button, type ButtonProps, useTheme } from 'react-native-paper';

import { nativeButtonConfiguration, nativeButtonMinHeight } from './app-button-config';

type AllowedButtonProps = Omit<
	ButtonProps,
	| 'buttonColor'
	| 'children'
	| 'color'
	| 'contentStyle'
	| 'disabled'
	| 'loading'
	| 'mode'
	| 'textColor'
	| 'theme'
>;

export interface AppButtonProps extends SharedButtonProps, AllowedButtonProps {
	children: ReactNode;
	loadingLabel?: string;
}

export function AppButton({
	children,
	variant = 'primary',
	size = 'medium',
	loading = false,
	loadingLabel,
	disabled = false,
	accessibilityLabel,
	...buttonProps
}: AppButtonProps) {
	const theme = useTheme();
	const configuration = nativeButtonConfiguration[variant];
	const isUnavailable = disabled || loading;
	const content = loading && loadingLabel ? loadingLabel : children;

	return (
		<Button
			{...buttonProps}
			accessibilityLabel={loading && loadingLabel ? loadingLabel : accessibilityLabel}
			buttonColor={configuration.useErrorColors ? theme.colors.error : undefined}
			contentStyle={{ minHeight: nativeButtonMinHeight[size] }}
			disabled={isUnavailable}
			loading={loading}
			mode={configuration.mode}
			textColor={configuration.useErrorColors ? theme.colors.onError : undefined}>
			{content}
		</Button>
	);
}
