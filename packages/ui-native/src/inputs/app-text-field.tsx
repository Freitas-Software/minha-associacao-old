import { spacing } from '@minha-associacao/design-tokens';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, HelperText, TextInput, type TextInputProps } from 'react-native-paper';

type AllowedTextInputProps = Omit<
	TextInputProps,
	'accessibilityHint' | 'dense' | 'error' | 'label' | 'mode'
>;

export interface AppTextFieldProps extends AllowedTextInputProps {
	label: TextInputProps['label'];
	errorMessage?: string;
	helperText?: ReactNode;
	loading?: boolean;
	accessibilityHint?: string;
}

export function AppTextField({
	label,
	errorMessage,
	helperText,
	loading = false,
	disabled = false,
	accessibilityHint,
	...textInputProps
}: AppTextFieldProps) {
	if (loading) {
		return (
			<View
				accessibilityLabel={`Carregando campo ${String(label)}`}
				accessibilityRole="progressbar"
				style={styles.loading}>
				<ActivityIndicator />
			</View>
		);
	}

	const supportingText = errorMessage ?? helperText;
	const inferredAccessibilityHint =
		accessibilityHint ?? (typeof supportingText === 'string' ? supportingText : undefined);

	return (
		<View>
			<TextInput
				{...textInputProps}
				accessibilityHint={inferredAccessibilityHint}
				dense
				disabled={disabled}
				error={Boolean(errorMessage)}
				label={label}
				mode="outlined"
			/>

			{supportingText ? (
				<HelperText
					accessibilityLiveRegion="polite"
					disabled={disabled}
					padding="normal"
					type={errorMessage ? 'error' : 'info'}
					visible>
					{supportingText}
				</HelperText>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	loading: {
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 56,
		paddingHorizontal: spacing.lg,
	},
});
