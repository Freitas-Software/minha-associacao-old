import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { expo } from '@better-auth/expo';
import { betterAuth } from 'better-auth';
import { username } from 'better-auth/plugins';
import type { Database } from '../db/client.js';
import * as schema from '../db/schema/index.js';
import { isValidCpf, normalizeCpf } from './cpf.js';

export interface AuthOptions {
	readonly baseUrl: string;
	readonly secret: string;
	readonly trustedOrigins: readonly string[];
}

export function createAuth(db: Database, options: AuthOptions) {
	return betterAuth({
		baseURL: options.baseUrl,
		database: drizzleAdapter(db, {
			provider: 'pg',
			schema,
		}),
		basePath: '/api/auth',
		emailAndPassword: { enabled: true },
		disabledPaths: ['/is-username-available'],
		secret: options.secret,
		trustedOrigins: [...options.trustedOrigins],
		plugins: [
			username({
				minUsernameLength: 11,
				maxUsernameLength: 14,
				usernameNormalization: normalizeCpf,
				usernameValidator: isValidCpf,
				validationOrder: {
					username: 'post-normalization',
				},
			}),
			expo(),
		],
	});
}

export type AppAuth = ReturnType<typeof createAuth>;
