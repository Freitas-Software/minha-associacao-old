import { fieldContext, formContext } from '@minha-associacao/form-core';
import { createFormHook } from '@tanstack/react-form';

import { ResetButton, SubmitButton } from './form-actions';
import { ErrorSummary } from './form-error-summary';
import { FormTextField } from './fields/form-text-field';
import { Form } from './form-root';

const nativeFormHook = createFormHook({
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

export const { useAppForm, withForm } = nativeFormHook;
