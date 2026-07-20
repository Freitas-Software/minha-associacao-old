import { describe, expectTypeOf, it } from 'vitest';

import type {
	ErrorSummaryProps,
	FormProps,
	FormServerErrors,
	FormTextFieldProps,
	ResetButtonProps,
	SubmitButtonProps,
} from '../src';

describe('form-native public types', () => {
	it('exports the public component contracts', () => {
		expectTypeOf<FormTextFieldProps>().toBeObject();
		expectTypeOf<SubmitButtonProps>().toBeObject();
		expectTypeOf<ResetButtonProps>().toBeObject();
		expectTypeOf<ErrorSummaryProps>().toBeObject();
		expectTypeOf<FormProps>().toBeObject();
		expectTypeOf<FormServerErrors<{ email: string }>>().toBeObject();
	});
});
