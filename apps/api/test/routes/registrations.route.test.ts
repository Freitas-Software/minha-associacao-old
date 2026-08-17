import { createConfig } from '@minha-associacao/config';
import type { FastifyInstance } from 'fastify';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildApp } from '../../src/app.js';

let app: FastifyInstance | undefined;

afterEach(async () => {
	await app?.close();
	app = undefined;
});

interface DatabaseMockOptions {
	selectedRows?: unknown[];
	insertedRows?: unknown[];
	insertError?: Error;
}

function createDatabaseMock(options: DatabaseMockOptions = {}) {
	const {
		selectedRows = [],
		insertedRows = [
			{
				id: 'usr_01',
				documentNumber: '52998224725',
				name: 'Maria Silva',
				email: 'maria@example.com',
				status: 'PENDING_PROFILE',
			},
		],
		insertError,
	} = options;

	const selectLimit = vi.fn().mockResolvedValue(selectedRows);
	const selectWhere = vi.fn().mockReturnValue({ limit: selectLimit });
	const selectFrom = vi.fn().mockReturnValue({ where: selectWhere });
	const select = vi.fn().mockReturnValue({ from: selectFrom });

	const returning = insertError
		? vi.fn().mockRejectedValue(insertError)
		: vi.fn().mockResolvedValue(insertedRows);
	const values = vi.fn().mockReturnValue({ returning });
	const insert = vi.fn().mockReturnValue({ values });

	const deleteWhere = vi.fn().mockResolvedValue(undefined);
	const deleteRecord = vi.fn().mockReturnValue({ where: deleteWhere });

	return {
		database: {
			db: {
				delete: deleteRecord,
				insert,
				select,
			},
		} as never,
		deleteRecord,
		deleteWhere,
		insert,
		select,
		values,
	};
}

function createAuthMock() {
	const signUpEmail = vi.fn().mockResolvedValue({
		headers: new Headers({
			'set-cookie': 'better-auth.session_token=session-token; Path=/; HttpOnly',
		}),
		response: {
			token: 'session-token',
			user: {
				id: 'auth-user-1',
				email: 'maria@example.com',
			},
		},
	});

	return {
		auth: {
			api: { signUpEmail },
			handler: vi.fn(),
		} as never,
		signUpEmail,
	};
}

describe('founder registration route', () => {
	it('returns 503 when registration is not configured', async () => {
		app = buildApp({
			config: createConfig({ NODE_ENV: 'test' }),
			logger: false,
		});

		const response = await app.inject({
			method: 'POST',
			payload: {
				name: 'Maria Silva',
				documentNumber: '52998224725',
				email: 'maria@example.com',
				password: 'password123',
			},
			url: '/api/registrations',
		});

		expect(response.statusCode).toBe(503);
		expect(response.json()).toEqual({
			error: 'Registration service unavailable',
			code: 'REGISTRATION_UNAVAILABLE',
		});
	});

	it('rejects an invalid CPF at the HTTP boundary', async () => {
		const { auth } = createAuthMock();
		const { database } = createDatabaseMock();

		app = buildApp({
			auth,
			config: createConfig({ NODE_ENV: 'test' }),
			database,
			logger: false,
		});

		const response = await app.inject({
			method: 'POST',
			payload: {
				name: 'Maria Silva',
				documentNumber: '11111111111',
				email: 'maria@example.com',
				password: 'password123',
			},
			url: '/api/registrations',
		});

		expect(response.statusCode).toBe(400);
	});

	it('does not allow founder registration for an existing domain user', async () => {
		const { auth, signUpEmail } = createAuthMock();
		const { database } = createDatabaseMock({
			selectedRows: [{ id: 'usr_existing' }],
		});

		app = buildApp({
			auth,
			config: createConfig({ NODE_ENV: 'test' }),
			database,
			logger: false,
		});

		const response = await app.inject({
			method: 'POST',
			payload: {
				name: 'Maria Silva',
				documentNumber: '52998224725',
				email: 'maria@example.com',
				password: 'password123',
			},
			url: '/api/registrations',
		});

		expect(response.statusCode).toBe(409);
		expect(response.json()).toEqual({
			error: 'Registration is not available for the provided credentials',
			code: 'REGISTRATION_NOT_AVAILABLE',
		});
		expect(signUpEmail).not.toHaveBeenCalled();
	});

	it('creates the authentication and domain users', async () => {
		const { auth, signUpEmail } = createAuthMock();
		const { database, values } = createDatabaseMock();

		app = buildApp({
			auth,
			config: createConfig({ NODE_ENV: 'test' }),
			database,
			logger: false,
		});

		const response = await app.inject({
			method: 'POST',
			payload: {
				name: ' Maria Silva ',
				documentNumber: '529.982.247-25',
				email: 'MARIA@EXAMPLE.COM',
				password: 'password123',
			},
			url: '/api/registrations',
		});

		expect(response.statusCode).toBe(201);
		expect(response.headers['set-cookie']).toEqual(
			expect.arrayContaining([expect.stringContaining('better-auth.session_token=session-token')])
		);
		expect(response.json()).toEqual({
			user: {
				id: 'usr_01',
				documentNumber: '52998224725',
				name: 'Maria Silva',
				email: 'maria@example.com',
				status: 'PENDING_PROFILE',
			},
		});

		expect(signUpEmail).toHaveBeenCalledWith(
			expect.objectContaining({
				body: {
					name: 'Maria Silva',
					email: 'maria@example.com',
					password: 'password123',
					username: '52998224725',
				},
				returnHeaders: true,
			})
		);

		expect(values).toHaveBeenCalledWith({
			id: expect.stringMatching(/^usr_[0-9a-z]{26}$/),
			auth_user_id: 'auth-user-1',
			document_number: '52998224725',
			name: 'Maria Silva',
			email: 'maria@example.com',
			status: 'PENDING_PROFILE',
		});
	});

	it('removes the auth user when the domain user cannot be created', async () => {
		const { auth } = createAuthMock();
		const { database, deleteRecord, deleteWhere } = createDatabaseMock({
			insertError: new Error('domain insert failed'),
		});

		app = buildApp({
			auth,
			config: createConfig({ NODE_ENV: 'test' }),
			database,
			logger: false,
		});

		const response = await app.inject({
			method: 'POST',
			payload: {
				name: 'Maria Silva',
				documentNumber: '52998224725',
				email: 'maria@example.com',
				password: 'password123',
			},
			url: '/api/registrations',
		});

		expect(response.statusCode).toBe(500);
		expect(response.json()).toEqual({
			error: 'Failed to create registration',
			code: 'REGISTRATION_FAILED',
		});
		expect(deleteRecord).toHaveBeenCalledOnce();
		expect(deleteWhere).toHaveBeenCalledOnce();
	});
});
