import { fieldContext, formContext } from '@minha-associacao/form-core';
import { createFormHook } from '@tanstack/react-form';
import { FormTextField } from './fields/form-text-field.js';
import { ResetButton, SubmitButton } from './form-actions.js';
import { ErrorSummary } from './form-error-summary.js';
import { Form } from './form-root.js';

const webFormHook = createFormHook({
	fieldComponents: {
		TextField: FormTextField,
	},
	fieldContext,
	formComponents: {
		ErrorSummary,
		Form,
		ResetButton,
		SubmitButton,
	},
	formContext,
});

export const { useAppForm, withForm } = webFormHook;
