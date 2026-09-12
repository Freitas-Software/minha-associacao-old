import { createConfig } from '@minha-associacao/config';
import { APIError } from 'better-auth/api';
import type { FastifyInstance } from 'fastify';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildApp } from '../../../src/app.js';

let app: FastifyInstance | undefined;

afterEach(async () => {
	await app?.close();
	app = undefined;
});

describe('application sessions route', () => {
	it('does not expose the Better Auth transport', async () => {
		app = buildApp({ config: createConfig({ NODE_ENV: 'test' }), logger: false });
		const response = await app.inject({ method: 'POST', url: '/api/auth/sign-in/username' });
		expect(response.statusCode).toBe(404);
	});

	it('returns a bearer token through the application login contract', async () => {
		const signInUsername = vi.fn().mockResolvedValue({
			headers: new Headers(),
			response: { token: 'session-token' },
		});
		app = buildApp({
			auth: { api: { signInUsername } } as never,
			config: createConfig({ NODE_ENV: 'test' }),
			logger: false,
		});

		const response = await app.inject({
			method: 'POST',
			url: '/api/sessions',
			payload: { documentNumber: '529.982.247-25', password: 'password123' },
		});

		expect(response.statusCode).toBe(200);
		expect(response.json()).toEqual({ token: 'session-token' });
		expect(signInUsername).toHaveBeenCalledWith(
			expect.objectContaining({
				body: { username: '52998224725', password: 'password123' },
				returnHeaders: true,
			})
		);
	});

	it('returns a generic error for invalid credentials', async () => {
		const signInUsername = vi
			.fn()
			.mockRejectedValue(new APIError('UNAUTHORIZED', { message: 'internal auth detail' }));
		app = buildApp({
			auth: { api: { signInUsername } } as never,
			config: createConfig({ NODE_ENV: 'test' }),
			logger: false,
		});

		const response = await app.inject({
			method: 'POST',
			url: '/api/sessions',
			payload: { documentNumber: '52998224725', password: 'password123' },
		});

		expect(response.statusCode).toBe(401);
		expect(response.json()).toEqual({
			error: 'CPF ou senha inválidos',
			code: 'INVALID_CREDENTIALS',
		});
	});
});
