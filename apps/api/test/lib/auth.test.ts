import { describe, expect, it } from 'vitest';
import { createAuth } from '../../src/lib/auth.js';

describe('createAuth', () => {
	it('creates the authentication service with the Drizzle adapter', () => {
		const auth = createAuth({} as never, {
			baseUrl: 'https://api.example.com',
			secret: 'a-high-entropy-secret-with-32-characters',
			trustedOrigins: ['https://app.example.com'],
		});

		expect(auth.handler).toBeTypeOf('function');
		expect(auth.api).toBeDefined();
	});
});
