import { describe, expect, it } from 'vitest';
import { createConfig } from '../src/index.js';
import { parseEnv } from '../src/loaders/index.js';

describe('environment parsing', () => {
	it('applies safe development defaults', () => {
		expect(parseEnv({})).toEqual({
			NODE_ENV: 'development',
			HOST: '0.0.0.0',
			PORT: 3001,
			CORS_ALLOWED_ORIGINS: [],
		});
	});

	it('coerces the port and normalizes comma-separated origins', () => {
		expect(
			parseEnv({
				NODE_ENV: 'production',
				HOST: '127.0.0.1',
				PORT: '4000',
				CORS_ALLOWED_ORIGINS: 'https://app.example.com/, https://admin.example.com/path',
			})
		).toEqual({
			NODE_ENV: 'production',
			HOST: '127.0.0.1',
			PORT: 4000,
			CORS_ALLOWED_ORIGINS: ['https://app.example.com', 'https://admin.example.com'],
		});
	});

	it('normalizes origins provided as an array', () => {
		expect(
			parseEnv({
				CORS_ALLOWED_ORIGINS: ['https://app.example.com/', 'https://admin.example.com/path'],
			}).CORS_ALLOWED_ORIGINS
		).toEqual(['https://app.example.com', 'https://admin.example.com']);
	});

	it('accepts only PostgreSQL database URLs', () => {
		expect(
			parseEnv({ DATABASE_URL: 'postgresql://user:password@localhost:5432/app' }).DATABASE_URL
		).toBe('postgresql://user:password@localhost:5432/app');
		expect(() => parseEnv({ DATABASE_URL: 'https://example.com/database' })).toThrow(
			'DATABASE_URL must use the postgres or postgresql protocol'
		);
	});

	it.each([
		{ NODE_ENV: 'staging' },
		{ PORT: '0' },
		{ PORT: '65536' },
		{ CORS_ALLOWED_ORIGINS: 'not-a-url' },
	])('rejects invalid environment values: %o', environment => {
		expect(() => parseEnv(environment)).toThrow();
	});
});

describe('Config', () => {
	it('allows the local web app only in development by default', () => {
		const development = createConfig({ NODE_ENV: 'development' });
		const production = createConfig({ NODE_ENV: 'production' });

		expect(development.isCorsOriginAllowed('http://localhost:3000/')).toBe(true);
		expect(development.isCorsOriginAllowed('http://localhost:8081')).toBe(true);
		expect(production.isCorsOriginAllowed('http://localhost:3000')).toBe(false);
		expect(production.isCorsOriginAllowed('http://localhost:8081')).toBe(false);
	});

	it('exposes the selected runtime mode', () => {
		const config = createConfig({ NODE_ENV: 'test' });

		expect(config.host).toBe('0.0.0.0');
		expect(config.nodeEnv).toBe('test');
		expect(config.port).toBe(3001);
		expect(config.isDevelopment).toBe(false);
		expect(config.isProduction).toBe(false);
		expect(config.isTest).toBe(true);
	});

	it('requires a configured database URL at database entrypoints', () => {
		const withoutDatabase = createConfig({ NODE_ENV: 'test' });
		const withDatabase = createConfig({
			DATABASE_URL: 'postgres://user:password@localhost:5432/app',
		});

		expect(() => withoutDatabase.requireDatabaseUrl()).toThrow('DATABASE_URL is required');
		expect(withDatabase.requireDatabaseUrl()).toBe('postgres://user:password@localhost:5432/app');
	});
});
