import { createConfig } from '@minha-associacao/config';
import type { FastifyInstance } from 'fastify';
import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, createLoggerOptions } from '../src/app.js';

let app: FastifyInstance | undefined;

afterEach(async () => {
	await app?.close();
	app = undefined;
});

describe('API', () => {
	it('serves the health endpoint through Fastify injection', async () => {
		app = buildApp({
			config: createConfig({ NODE_ENV: 'test' }),
			logger: false,
		});

		const response = await app.inject({
			method: 'GET',
			url: '/api/health',
		});

		expect(response.statusCode).toBe(200);
		expect(response.json()).toEqual({ status: 'ok' });
		expect(response.headers['x-content-type-options']).toBe('nosniff');
	});

	it('only emits CORS credentials for configured origins', async () => {
		app = buildApp({
			config: createConfig({
				NODE_ENV: 'test',
				CORS_ALLOWED_ORIGINS: 'https://app.example.com',
			}),
			logger: false,
		});

		const [allowed, rejected] = await Promise.all([
			app.inject({
				headers: { origin: 'https://app.example.com' },
				method: 'GET',
				url: '/api/health',
			}),
			app.inject({
				headers: { origin: 'https://untrusted.example.com' },
				method: 'GET',
				url: '/api/health',
			}),
		]);

		expect(allowed.headers['access-control-allow-origin']).toBe('https://app.example.com');
		expect(allowed.headers['access-control-allow-credentials']).toBe('true');
		expect(rejected.headers['access-control-allow-origin']).toBeUndefined();
	});
});

describe('logger configuration', () => {
	it.each(['development', 'test', 'production'] as const)('redacts secrets in %s', nodeEnv => {
		const options = createLoggerOptions(createConfig({ NODE_ENV: nodeEnv }));

		expect(options.redact).toEqual(
			expect.objectContaining({
				censor: '[REDACTED]',
				paths: expect.arrayContaining([
					'req.headers.authorization',
					'req.headers.cookie',
					'req.body.password',
				]),
			})
		);
	});

	it('uses pretty debug logging only in development', () => {
		const development = createLoggerOptions(createConfig({ NODE_ENV: 'development' }));
		const production = createLoggerOptions(createConfig({ NODE_ENV: 'production' }));

		expect(development).toMatchObject({
			level: 'debug',
			transport: { target: 'pino-pretty' },
		});
		expect(production).toMatchObject({ level: 'info' });
		expect(production).not.toHaveProperty('transport');
	});
});
