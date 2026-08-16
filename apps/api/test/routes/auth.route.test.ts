import { createConfig } from '@minha-associacao/config';
import type { FastifyInstance } from 'fastify';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildApp } from '../../src/app.js';

let app: FastifyInstance | undefined;

afterEach(async () => {
	await app?.close();
	app = undefined;
});

describe('authentication route', () => {
	it('returns 503 when authentication is not configured', async () => {
		app = buildApp({ config: createConfig({ NODE_ENV: 'test' }), logger: false });

		const response = await app.inject({ method: 'GET', url: '/api/auth/session' });

		expect(response.statusCode).toBe(503);
		expect(response.json()).toEqual({
			error: 'Authentication service unavailable',
			code: 'AUTH_UNAVAILABLE',
		});
	});

	it('forwards requests and responses through Better Auth', async () => {
		const handler = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ authenticated: true }), {
				headers: { 'content-type': 'application/json', 'x-auth': 'ok' },
				status: 201,
			})
		);
		app = buildApp({
			auth: { handler } as never,
			config: createConfig({ NODE_ENV: 'test' }),
			logger: false,
		});

		const response = await app.inject({
			method: 'POST',
			payload: { username: '52998224725' },
			url: '/api/auth/sign-in/username',
		});

		expect(response.statusCode).toBe(201);
		expect(response.headers['x-auth']).toBe('ok');
		expect(response.json()).toEqual({ authenticated: true });
		expect(handler).toHaveBeenCalledOnce();
		const request = handler.mock.calls[0]?.[0] as Request;
		expect(request.url).toContain('/api/auth/sign-in/username');
		expect(await request.json()).toEqual({ username: '52998224725' });
	});

	it('returns 500 when the authentication handler fails', async () => {
		const handler = vi.fn().mockRejectedValue(new Error('auth failed'));
		app = buildApp({
			auth: { handler } as never,
			config: createConfig({ NODE_ENV: 'test' }),
			logger: false,
		});

		const response = await app.inject({ method: 'GET', url: '/api/auth/session' });

		expect(response.statusCode).toBe(500);
		expect(response.json()).toEqual({
			error: 'Internal authentication error',
			code: 'AUTH_FAILURE',
		});
	});
});
