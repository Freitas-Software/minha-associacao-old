import { describe, expect, it } from 'vitest';
import {
	getFirstFormErrorMessage,
	normalizeFieldErrors,
	normalizeFormErrors,
	normalizeServerErrors,
} from '../src/form-errors';

describe('field error normalization', () => {
	it.each([
		undefined,
		null,
		false,
		42,
		{},
		{ code: 500 },
		{ code: 'ERR_BAD_RESPONSE', path: 'name' },
	])('ignores values without a user-facing message: %o', error => {
		expect(normalizeFieldErrors(error)).toEqual([]);
	});

	it('normalizes strings, Errors and Standard Schema issues without duplicates', () => {
		const errors = [
			' Campo obrigatório ',
			new Error('Falha do servidor'),
			[
				{ message: 'Campo obrigatório', path: ['name'] },
				{ message: 'Formato inválido', path: ['document'] },
			],
		];

		expect(normalizeFieldErrors(errors)).toEqual([
			'Campo obrigatório',
			'Falha do servidor',
			'Formato inválido',
		]);
		expect(errors).toHaveLength(3);
	});

	it('supports explicit error wrappers without exposing unrelated metadata', () => {
		expect(
			normalizeFieldErrors({
				errors: [{ message: 'Erro principal' }],
				cause: { message: 'Causa' },
				code: 'INTERNAL_IDENTIFIER',
			})
		).toEqual(['Erro principal', 'Causa']);
		expect(normalizeFieldErrors({ issues: [{ message: 'Issue Zod' }] })).toEqual(['Issue Zod']);
	});

	it('uses lower-priority wrappers only when preferred wrappers have no usable message', () => {
		expect(normalizeFieldErrors({ issues: [], message: 'Fallback da issue' })).toEqual([
			'Fallback da issue',
		]);
		expect(
			normalizeFieldErrors({ message: ' ', errors: [{ message: 'Fallback da mensagem' }] })
		).toEqual(['Fallback da mensagem']);
		expect(
			normalizeFieldErrors({
				cause: { message: 'Fallback da causa' },
				errors: [{ message: 'Fallback dos errors' }],
				issues: [],
				message: ' ',
			})
		).toEqual(['Fallback dos errors', 'Fallback da causa']);
		expect(
			normalizeFieldErrors({
				issues: [{ message: 'Issue prioritária' }],
				message: 'Não deve substituir a issue',
			})
		).toEqual(['Issue prioritária']);
	});

	it('does not accept a fallback when a shared issue object was already normalized', () => {
		const sharedIssue = { message: 'Issue compartilhada' };

		expect(
			normalizeFieldErrors([
				sharedIssue,
				{ issues: [sharedIssue], message: 'Fallback não deve aparecer' },
			])
		).toEqual(['Issue compartilhada']);
	});

	it('handles cyclic and deeply nested structures without recursive overflow', () => {
		const cyclicError: Record<string, unknown> = {};
		cyclicError.cause = cyclicError;

		let deeplyNestedError: unknown = { message: 'Erro utilizável' };
		for (let depth = 0; depth < 20_000; depth += 1) {
			deeplyNestedError = [deeplyNestedError];
		}

		expect(normalizeFieldErrors([cyclicError, deeplyNestedError])).toEqual(['Erro utilizável']);
	});

	it('does not invoke accessor properties on untrusted error objects', () => {
		let getterWasCalled = false;
		const errorWithGetter = {};
		Object.defineProperty(errorWithGetter, 'message', {
			enumerable: true,
			get: () => {
				getterWasCalled = true;
				return 'Não deve ser lido';
			},
		});

		expect(normalizeFieldErrors(errorWithGetter)).toEqual([]);
		expect(getterWasCalled).toBe(false);
	});

	it('reads only array data properties without scanning sparse lengths or invoking accessors', () => {
		let getterWasCalled = false;
		const sparseErrors: unknown[] = [];
		Object.defineProperty(sparseErrors, '0', {
			enumerable: true,
			get: () => {
				getterWasCalled = true;
				return { message: 'Não deve ser lido' };
			},
		});
		Object.defineProperty(sparseErrors, '4294967294', {
			enumerable: true,
			value: { message: 'Erro esparso utilizável' },
		});

		expect(sparseErrors).toHaveLength(4_294_967_295);
		expect(normalizeFieldErrors(sparseErrors)).toEqual(['Erro esparso utilizável']);
		expect(getterWasCalled).toBe(false);
	});

	it('ignores revoked proxies instead of leaking descriptor failures', () => {
		const { proxy, revoke } = Proxy.revocable({}, {});
		revoke();

		expect(normalizeFieldErrors(proxy)).toEqual([]);
		expect(normalizeFormErrors(proxy)).toEqual({ form: [], fields: {} });
	});
});

describe('form error normalization', () => {
	it('keeps server global and field errors in an explicit two-argument contract', () => {
		const normalized = normalizeServerErrors(
			['Não foi possível salvar', { message: 'Não foi possível salvar' }],
			{
				name: [{ message: 'Informe o nome' }],
				email: ['E-mail inválido', ''],
				ignored: false,
			}
		);

		expect(normalized).toEqual({
			form: ['Não foi possível salvar'],
			fields: {
				name: ['Informe o nome'],
				email: ['E-mail inválido'],
			},
		});
		expect(normalizeServerErrors('Falha global', undefined)).toEqual({
			form: ['Falha global'],
			fields: {},
		});
	});

	it('preserves empty-path issues globally and accepts form and fields as field names', () => {
		const normalized = normalizeFormErrors({
			'': [{ message: 'Revise os dados do formulário' }],
			form: [{ message: 'Campo form inválido' }],
			fields: [{ message: 'Campo fields inválido' }],
			email: [{ message: 'E-mail inválido' }],
		});

		expect(normalized).toEqual({
			form: ['Revise os dados do formulário'],
			fields: {
				form: ['Campo form inválido'],
				fields: ['Campo fields inválido'],
				email: ['E-mail inválido'],
			},
		});
	});

	it('creates safe own properties for prototype-like field names', () => {
		const errorMap: Record<string, unknown> = {};
		let getterWasCalled = false;
		for (const field of ['__proto__', 'constructor', 'prototype']) {
			Object.defineProperty(errorMap, field, {
				enumerable: true,
				value: [{ message: `${field} inválido` }],
			});
		}
		Object.defineProperty(errorMap, 'accessor', {
			enumerable: true,
			get: () => {
				getterWasCalled = true;
				return [{ message: 'Não deve ser lido' }];
			},
		});

		const normalized = normalizeFormErrors(errorMap);

		expect(Object.getPrototypeOf(normalized.fields)).toBe(Object.prototype);
		expect(getterWasCalled).toBe(false);
		for (const field of ['__proto__', 'constructor', 'prototype']) {
			expect(Object.hasOwn(normalized.fields, field)).toBe(true);
			expect(normalized.fields[field]).toEqual([`${field} inválido`]);
		}
	});

	it('returns the first global or field message from normalized errors', () => {
		const globalErrors = normalizeFormErrors(new Error('Serviço indisponível'));
		const fieldErrors = normalizeFormErrors({ name: [], email: ['E-mail inválido'] });

		expect(globalErrors).toEqual({ form: ['Serviço indisponível'], fields: {} });
		expect(getFirstFormErrorMessage(globalErrors)).toBe('Serviço indisponível');
		expect(getFirstFormErrorMessage(fieldErrors)).toBe('E-mail inválido');
		expect(getFirstFormErrorMessage({ form: [], fields: {} })).toBeUndefined();
	});
});
