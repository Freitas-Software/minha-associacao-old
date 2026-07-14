import { describe, expect, it, vi } from 'vitest';
import { env } from './env';

const { createAuthClient } = vi.hoisted(() => ({
	createAuthClient: vi.fn(() => ({ type: 'auth-client' })),
}));

vi.mock('better-auth/react', () => ({ createAuthClient }));

describe('authClient', () => {
	it('uses the validated public API URL', async () => {
		const { authClient } = await import('./auth-client');

		expect(authClient).toEqual({ type: 'auth-client' });
		expect(createAuthClient).toHaveBeenCalledOnce();
		expect(createAuthClient).toHaveBeenCalledWith({ baseURL: env.VITE_API_URL });
	});
});
