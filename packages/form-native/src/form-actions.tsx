import { useFormContext } from '@minha-associacao/form-core';
import { AppButton, type AppButtonProps } from '@minha-associacao/ui-native';
import { useSelector } from '@tanstack/react-form';
import { useRef } from 'react';

export interface SubmitButtonProps
	extends Omit<AppButtonProps, 'disabled' | 'loading' | 'onPress'> {
	disabled?: boolean;
	onSubmitSuccess?: () => void;
}

export function SubmitButton({
	disabled = false,
	onSubmitSuccess,
	...buttonProps
}: SubmitButtonProps) {
	const form = useFormContext();
	const submissionLock = useRef(false);

	const canSubmit = useSelector(form.store, state => state.canSubmit);

	const isSubmitting = useSelector(form.store, state => state.isSubmitting);

	async function handlePress() {
		if (submissionLock.current || form.state.isSubmitting) {
			return;
		}

		submissionLock.current = true;

		try {
			await form.handleSubmit();

			if (form.state.isValid) {
				onSubmitSuccess?.();
			}
		} finally {
			submissionLock.current = false;
		}
	}

	return (
		<AppButton
			{...buttonProps}
			disabled={disabled || !canSubmit || isSubmitting}
			loading={isSubmitting}
			onPress={handlePress}
		/>
	);
}

export interface ResetButtonProps extends Omit<AppButtonProps, 'disabled' | 'loading' | 'onPress'> {
	disabled?: boolean;
	onReset?: () => void;
}

export function ResetButton({ disabled = false, onReset, ...buttonProps }: ResetButtonProps) {
	const form = useFormContext();

	const isDirty = useSelector(form.store, state => state.isDirty);

	const isSubmitting = useSelector(form.store, state => state.isSubmitting);

	function handlePress() {
		if (isSubmitting) {
			return;
		}

		form.reset();
		onReset?.();
	}

	return (
		<AppButton
			{...buttonProps}
			disabled={disabled || !isDirty || isSubmitting}
			onPress={handlePress}
			variant={buttonProps.variant ?? 'ghost'}
		/>
	);
}
