import { describe, expect, it } from 'vitest';
import { DEFAULT_API_URL, parseClientEnv } from './env';

describe('parseClientEnv', () => {
	it('uses the local API when VITE_API_URL is omitted', () => {
		expect(parseClientEnv({}).VITE_API_URL).toBe(DEFAULT_API_URL);
	});

	it('normalizes a trailing slash', () => {
		expect(parseClientEnv({ VITE_API_URL: 'https://api.example.com/' }).VITE_API_URL).toBe(
			'https://api.example.com'
		);
	});

	it('rejects an invalid API URL', () => {
		expect(() => parseClientEnv({ VITE_API_URL: 'not-a-url' })).toThrow();
	});
});
