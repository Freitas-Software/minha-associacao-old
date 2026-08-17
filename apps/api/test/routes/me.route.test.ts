import { createConfig } from '@minha-associacao/config';
import type { FastifyInstance } from 'fastify';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildApp } from '../../src/app.js';

let app: FastifyInstance | undefined;

afterEach(async () => {
	await app?.close();
	app = undefined;
});

function createAuthMock(session: unknown) {
	const getSession = vi.fn().mockResolvedValue(session);

	return {
		auth: {
			api: { getSession },
			handler: vi.fn(),
		} as never,
		getSession,
	};
}

function createDatabaseMock(rows: unknown[]) {
	const limit = vi.fn().mockResolvedValue(rows);
	const where = vi.fn().mockReturnValue({ limit });
	const from = vi.fn().mockReturnValue({ where });
	const select = vi.fn().mockReturnValue({ from });

	return {
		database: {
			db: { select },
		} as never,
		select,
	};
}

describe('current user route', () => {
	it('returns 503 when authentication is not configured', async () => {
		app = buildApp({
			config: createConfig({ NODE_ENV: 'test' }),
			logger: false,
		});

		const response = await app.inject({
			method: 'GET',
			url: '/api/me',
		});

		expect(response.statusCode).toBe(503);
		expect(response.json()).toEqual({
			error: 'Authentication service unavailable',
			code: 'AUTH_UNAVAILABLE',
		});
	});

	it('returns 401 when there is no authenticated session', async () => {
		const { auth } = createAuthMock(null);
		const { database } = createDatabaseMock([]);

		app = buildApp({
			auth,
			config: createConfig({ NODE_ENV: 'test' }),
			database,
			logger: false,
		});

		const response = await app.inject({
			method: 'GET',
			url: '/api/me',
		});

		expect(response.statusCode).toBe(401);
		expect(response.json()).toEqual({
			error: 'Authentication required',
			code: 'AUTH_REQUIRED',
		});
	});

	it('returns 403 when the auth account is not linked to a domain user', async () => {
		const { auth } = createAuthMock({
			session: { id: 'session-1' },
			user: { id: 'auth-user-1' },
		});
		const { database } = createDatabaseMock([]);

		app = buildApp({
			auth,
			config: createConfig({ NODE_ENV: 'test' }),
			database,
			logger: false,
		});

		const response = await app.inject({
			method: 'GET',
			url: '/api/me',
		});

		expect(response.statusCode).toBe(403);
		expect(response.json()).toEqual({
			error: 'Authenticated account is not linked to a domain user',
			code: 'DOMAIN_USER_NOT_LINKED',
		});
	});

	it('returns the linked domain user', async () => {
		const { auth, getSession } = createAuthMock({
			session: { id: 'session-1' },
			user: { id: 'auth-user-1' },
		});
		const { database, select } = createDatabaseMock([
			{
				id: 'usr_01',
				documentNumber: '52998224725',
				name: 'Maria Silva',
				email: 'maria@example.com',
				phone: null,
				birthDate: '1990-01-01',
				status: 'ACTIVE',
			},
		]);

		app = buildApp({
			auth,
			config: createConfig({ NODE_ENV: 'test' }),
			database,
			logger: false,
		});

		const response = await app.inject({
			headers: {
				cookie: 'better-auth.session_token=session-token',
			},
			method: 'GET',
			url: '/api/me',
		});

		expect(response.statusCode).toBe(200);
		expect(response.json()).toEqual({
			user: {
				id: 'usr_01',
				documentNumber: '52998224725',
				name: 'Maria Silva',
				email: 'maria@example.com',
				phone: null,
				birthDate: '1990-01-01',
				status: 'ACTIVE',
			},
		});

		expect(getSession).toHaveBeenCalledOnce();
		expect(select).toHaveBeenCalledOnce();

		const getSessionArguments = getSession.mock.calls[0]?.[0];
		expect(getSessionArguments?.headers).toBeInstanceOf(Headers);
	});

	it('returns 500 when authentication verification fails', async () => {
		const { auth, getSession } = createAuthMock(null);
		const { database } = createDatabaseMock([]);

		getSession.mockRejectedValueOnce(new Error('authentication failed'));

		app = buildApp({
			auth,
			config: createConfig({ NODE_ENV: 'test' }),
			database,
			logger: false,
		});

		const response = await app.inject({
			method: 'GET',
			url: '/api/me',
		});

		expect(response.statusCode).toBe(500);
		expect(response.json()).toEqual({
			error: 'Failed to verify authentication',
			code: 'AUTH_CHECK_FAILED',
		});
	});
});
