import { useFormContext } from '@minha-associacao/form-core';
import { AppButton, type AppButtonProps } from '@minha-associacao/ui-web';
import { useSelector } from '@tanstack/react-form';

export interface SubmitButtonProps extends Omit<AppButtonProps, 'disabled' | 'loading' | 'type'> {
	disabled?: boolean;
}

export function SubmitButton({ disabled = false, ...buttonProps }: SubmitButtonProps) {
	const form = useFormContext();
	const canSubmit = useSelector(form.store, state => state.canSubmit);
	const isSubmitting = useSelector(form.store, state => state.isSubmitting);

	return (
		<AppButton
			{...buttonProps}
			disabled={disabled || !canSubmit || isSubmitting}
			loading={isSubmitting}
			type="submit"
		/>
	);
}

export interface ResetButtonProps extends Omit<AppButtonProps, 'disabled' | 'loading' | 'type'> {
	disabled?: boolean;
}

export function ResetButton({ disabled = false, ...buttonProps }: ResetButtonProps) {
	const form = useFormContext();
	const isDirty = useSelector(form.store, state => state.isDirty);
	const isSubmitting = useSelector(form.store, state => state.isSubmitting);

	return (
		<AppButton
			{...buttonProps}
			disabled={disabled || !isDirty || isSubmitting}
			type="reset"
			variant={buttonProps.variant ?? 'ghost'}
		/>
	);
}
