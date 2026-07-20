import { useFormContext } from '@minha-associacao/form-core';
import { useRef, type ComponentPropsWithoutRef, type FormEvent } from 'react';

const INVALID_CONTROL_SELECTOR = '[aria-invalid="true"]:not(:disabled)';
const ERROR_SUMMARY_SELECTOR = '[data-form-error-summary]';

function focusFirstError(formElement: HTMLFormElement) {
	const invalidControl = formElement.querySelector<HTMLElement>(INVALID_CONTROL_SELECTOR);
	const errorSummary = formElement.querySelector<HTMLElement>(ERROR_SUMMARY_SELECTOR);
	(invalidControl ?? errorSummary)?.focus();
}

function scheduleErrorFocus(formElement: HTMLFormElement) {
	if (typeof requestAnimationFrame === 'function') {
		requestAnimationFrame(() => focusFirstError(formElement));
		return;
	}

	setTimeout(() => focusFirstError(formElement), 0);
}

export interface FormProps
	extends Omit<ComponentPropsWithoutRef<'form'>, 'noValidate' | 'onReset' | 'onSubmit'> {
	focusOnError?: boolean;
}

export function Form({ focusOnError = true, ...formProps }: FormProps) {
	const form = useFormContext();
	const submissionLock = useRef(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		event.stopPropagation();
		const formElement = event.currentTarget;

		if (submissionLock.current || form.state.isSubmitting) {
			return;
		}

		submissionLock.current = true;

		try {
			await form.handleSubmit();
		} finally {
			submissionLock.current = false;

			if (focusOnError && !form.state.isValid) {
				scheduleErrorFocus(formElement);
			}
		}
	}

	function handleReset(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!form.state.isSubmitting) {
			form.reset();
		}
	}

	return (
		<form
			{...formProps}
			noValidate
			onReset={handleReset}
			onSubmit={handleSubmit}
		/>
	);
}
