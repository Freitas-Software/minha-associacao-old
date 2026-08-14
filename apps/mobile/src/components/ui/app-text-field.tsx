import type { ReactNode } from 'react';
import type { TextInputProps } from 'react-native-paper';
import { View } from 'react-native';
import { AppActivityIndicator, AppHelperText } from './app-feedback';
import { AppTextInput } from './app-text-input';

export interface AppTextFieldProps extends TextInputProps {
	accessibilityHint?: string;
	errorMessage?: string;
	helperText?: ReactNode;
	loading?: boolean;
}

export function AppTextField({
	accessibilityHint,
	accessibilityLabel,
	disabled,
	errorMessage,
	helperText,
	label,
	loading = false,
	...props
}: AppTextFieldProps) {
	const supportingText = errorMessage ?? helperText;
	if (loading)
		return (
			<View
				accessibilityLabel={`Carregando campo ${String(label)}`}
				accessibilityRole="progressbar"
				style={{ alignItems: 'center', justifyContent: 'center', minHeight: 56 }}>
				<AppActivityIndicator />
			</View>
		);
	return (
		<View>
			<AppTextInput
				{...props}
				accessibilityHint={
					accessibilityHint ?? (typeof supportingText === 'string' ? supportingText : undefined)
				}
				accessibilityLabel={accessibilityLabel ?? (typeof label === 'string' ? label : undefined)}
				disabled={disabled}
				error={Boolean(errorMessage)}
				label={label}
			/>
			<AppHelperText
				accessibilityLiveRegion="polite"
				disabled={disabled}
				padding="normal"
				type={errorMessage ? 'error' : 'info'}
				visible={Boolean(supportingText)}>
				{supportingText}
			</AppHelperText>
		</View>
	);
}
