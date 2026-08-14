import {
	Checkbox,
	type CheckboxItemProps,
	type CheckboxProps,
	RadioButton,
	type RadioButtonItemProps,
	type RadioButtonProps,
	Switch,
	type SwitchProps,
} from 'react-native-paper';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

function AppCheckboxComponent(props: CheckboxProps) {
	const { minhaAssociacao } = useMinhaAssociacaoTheme();
	return (
		<Checkbox
			{...props}
			color={minhaAssociacao.colors.actionPrimaryText}
			uncheckedColor={minhaAssociacao.colors.contentMuted}
		/>
	);
}
function AppCheckboxItemComponent({ labelStyle, ...props }: CheckboxItemProps) {
	const { minhaAssociacao } = useMinhaAssociacaoTheme();
	return (
		<Checkbox.Item
			{...props}
			color={minhaAssociacao.colors.actionPrimaryText}
			labelStyle={[{ color: minhaAssociacao.colors.contentPrimary }, labelStyle]}
			uncheckedColor={minhaAssociacao.colors.contentMuted}
		/>
	);
}
export const AppCheckbox = Object.assign(AppCheckboxComponent, { Item: AppCheckboxItemComponent });
function AppRadioButtonComponent(props: RadioButtonProps) {
	const { minhaAssociacao } = useMinhaAssociacaoTheme();
	return (
		<RadioButton
			{...props}
			color={minhaAssociacao.colors.actionPrimaryText}
			uncheckedColor={minhaAssociacao.colors.contentMuted}
		/>
	);
}
function AppRadioButtonItemComponent({ labelStyle, ...props }: RadioButtonItemProps) {
	const { minhaAssociacao } = useMinhaAssociacaoTheme();
	return (
		<RadioButton.Item
			{...props}
			color={minhaAssociacao.colors.actionPrimaryText}
			labelStyle={[{ color: minhaAssociacao.colors.contentPrimary }, labelStyle]}
			uncheckedColor={minhaAssociacao.colors.contentMuted}
		/>
	);
}
export const AppRadioButton = Object.assign(AppRadioButtonComponent, {
	Group: RadioButton.Group,
	Item: AppRadioButtonItemComponent,
});
export function AppSwitch(props: SwitchProps) {
	const { minhaAssociacao } = useMinhaAssociacaoTheme();
	return (
		<Switch
			{...props}
			color={minhaAssociacao.colors.actionPrimaryText}
		/>
	);
}
