import { describe, expect, it, vi } from 'vitest';

import { setServerErrors } from '../src/server-errors';

describe('setServerErrors', () => {
	it('marks registered fields as touched and sets the server error map', () => {
		const setFieldMeta = vi.fn();
		const setErrorMap = vi.fn();

		const form = {
			getFieldMeta: vi.fn((fieldName: string) =>
				fieldName === 'email' ? { isTouched: false } : undefined,
			),
			setFieldMeta,
			setErrorMap,
			state: {
				values: {
					email: '',
				},
			},
		};

		setServerErrors(
			form as never,
			{
				fields: {
					email: 'E-mail já cadastrado',
				},
				form: 'Não foi possível salvar',
			},
		);

		expect(setFieldMeta).toHaveBeenCalledOnce();
		expect(setFieldMeta).toHaveBeenCalledWith(
			'email',
			expect.any(Function),
		);

		expect(setErrorMap).toHaveBeenCalledWith({
			onServer: {
				fields: {
					email: 'E-mail já cadastrado',
				},
				form: 'Não foi possível salvar',
			},
		});
	});
});
