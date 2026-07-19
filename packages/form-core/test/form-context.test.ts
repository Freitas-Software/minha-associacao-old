import { createFormHookContexts } from '@tanstack/react-form';
import { describe, expect, it } from 'vitest';
import { fieldContext, formContext, useFieldContext, useFormContext } from '../src/form-context';

describe('shared form contexts', () => {
	it('exposes one context pair for both platform adapters', () => {
		const contexts = createFormHookContexts();

		expect(fieldContext).toBe(contexts.fieldContext);
		expect(formContext).toBe(contexts.formContext);
		expect(useFieldContext).toEqual(expect.any(Function));
		expect(useFormContext).toEqual(expect.any(Function));
	});
});
