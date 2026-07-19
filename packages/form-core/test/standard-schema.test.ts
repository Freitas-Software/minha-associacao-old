import { FieldApi, FormApi, formOptions } from '@tanstack/react-form';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { z } from 'zod';
import { normalizeFieldErrors, normalizeFormErrors } from '../src/form-errors';

const memberSchema = z.object({
	name: z.string().min(2, 'Informe ao menos 2 caracteres'),
});

type MemberValues = z.input<typeof memberSchema>;

describe('TanStack Form and Standard Schema', () => {
	it('uses a Zod schema directly across change, blur, submit and reset', async () => {
		const onSubmit = vi.fn();
		const onSubmitInvalid = vi.fn();
		const options = formOptions({
			defaultValues: { name: '' } satisfies MemberValues,
			validators: {
				onChange: memberSchema,
				onBlur: z.object({ name: z.string().min(3, 'Informe ao menos 3 caracteres') }),
				onSubmit: z.object({ name: z.string().min(5, 'Informe ao menos 5 caracteres') }),
			},
			onSubmit,
			onSubmitInvalid,
		});
		const form = new FormApi(options);
		const field = new FieldApi({ form, name: 'name' });
		const unmountForm = form.mount();
		const unmountField = field.mount();

		try {
			expectTypeOf(form.state.values).toEqualTypeOf<MemberValues>();
			expectTypeOf(field.state.value).toEqualTypeOf<string>();
			expect(form.state.values).toEqual({ name: '' });

			field.handleChange('a');
			expect(form.state.canSubmit).toBe(false);
			expect(field.state.meta).toMatchObject({
				isBlurred: false,
				isDirty: true,
				isTouched: true,
			});
			expect(field.state.meta.errorMap.onChange?.[0]).toMatchObject({
				message: 'Informe ao menos 2 caracteres',
				path: ['name'],
			});
			expect(normalizeFieldErrors(field.state.meta.errors)).toEqual([
				'Informe ao menos 2 caracteres',
			]);
			expect(normalizeFormErrors(form.state.errorMap.onChange)).toEqual({
				form: [],
				fields: { name: ['Informe ao menos 2 caracteres'] },
			});

			field.handleBlur();
			expect(field.state.meta.isBlurred).toBe(true);
			expect(field.state.meta.errorMap.onBlur?.[0]?.message).toBe('Informe ao menos 3 caracteres');

			field.handleChange('abcd');
			field.handleBlur();
			expect(field.state.meta.errorMap.onChange).toBeUndefined();
			expect(field.state.meta.errorMap.onBlur).toBeUndefined();
			expect(form.state.canSubmit).toBe(true);

			await form.handleSubmit();
			expect(onSubmit).not.toHaveBeenCalled();
			expect(onSubmitInvalid).toHaveBeenCalledOnce();
			expect(field.state.meta.errorMap.onSubmit?.[0]?.message).toBe(
				'Informe ao menos 5 caracteres'
			);

			form.reset();
			expect(form.state).toMatchObject({
				errorMap: {},
				isBlurred: false,
				isDirty: false,
				isTouched: false,
				submissionAttempts: 0,
				values: { name: '' },
			});
		} finally {
			unmountField();
			unmountForm();
		}
	});

	it('keeps a pathless Zod issue as a global form error', async () => {
		const schema = z.object({ name: z.string() }).superRefine((_value, context) => {
			context.addIssue({
				code: 'custom',
				message: 'A combinação informada não é permitida',
			});
		});
		const form = new FormApi({
			defaultValues: { name: 'Associação Comunitária' },
			validators: { onSubmit: schema },
		});
		const field = new FieldApi({ form, name: 'name' });
		const unmountForm = form.mount();
		const unmountField = field.mount();

		try {
			await form.handleSubmit();
			expect(normalizeFormErrors(form.state.errorMap.onSubmit)).toEqual({
				form: ['A combinação informada não é permitida'],
				fields: {},
			});
		} finally {
			unmountField();
			unmountForm();
		}
	});

	it('exposes submitting state while an asynchronous submit is pending', async () => {
		let resolveSubmission = () => {};
		const submission = new Promise<void>(resolve => {
			resolveSubmission = resolve;
		});
		const onSubmit = vi.fn(() => submission);
		const form = new FormApi({
			defaultValues: { name: 'Associação Comunitária' },
			onSubmit,
		});
		const field = new FieldApi({ form, name: 'name' });
		const unmountForm = form.mount();
		const unmountField = field.mount();

		try {
			const pendingSubmit = form.handleSubmit();
			expect(form.state.canSubmit).toBe(false);
			expect(form.state.isSubmitting).toBe(true);
			resolveSubmission();
			await pendingSubmit;
			expect(onSubmit).toHaveBeenCalledOnce();
			expect(form.state).toMatchObject({
				canSubmit: true,
				isSubmitSuccessful: true,
				isSubmitted: true,
				isSubmitting: false,
			});
		} finally {
			unmountField();
			unmountForm();
		}
	});
});
