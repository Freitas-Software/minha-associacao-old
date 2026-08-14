import { TextInput, type TextInputProps } from 'react-native-paper';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

export interface AppTextInputProps extends TextInputProps {}

function AppTextInputComponent({
	error = false,
	mode = 'outlined',
	outlineStyle,
	style,
	...props
}: AppTextInputProps) {
	const { minhaAssociacao } = useMinhaAssociacaoTheme();
	const colors = minhaAssociacao.colors;
	const activeColor = error ? colors.feedbackNegative : colors.actionPrimaryText;
	return (
		<TextInput
			{...props}
			activeOutlineColor={activeColor}
			activeUnderlineColor={activeColor}
			cursorColor={activeColor}
			error={error}
			mode={mode}
			outlineColor={colors.borderControl}
			outlineStyle={[{ borderRadius: minhaAssociacao.radii.md }, outlineStyle]}
			placeholderTextColor={colors.contentMuted}
			selectionColor={colors.actionPrimarySubtle}
			style={[{ backgroundColor: colors.surface }, style]}
			textColor={colors.contentPrimary}
			underlineColor={colors.borderControl}
		/>
	);
}

export const AppTextInput = Object.assign(AppTextInputComponent, {
	Affix: TextInput.Affix,
	Icon: TextInput.Icon,
});
