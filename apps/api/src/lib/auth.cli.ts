import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { createConfig } from '@minha-associacao/config';
import { betterAuth } from 'better-auth';
import { username } from 'better-auth/plugins';
import { createDatabaseClient } from '../db/client.js';
import * as schema from '../db/schema/index.js';
import { isValidCpf, normalizeCpf } from './cpf.js';

const config = createConfig();
const database = createDatabaseClient(config.requireDatabaseUrl());

export const auth = betterAuth({
	baseURL: config.requireAuthBaseUrl(),
	database: drizzleAdapter(database.db, {
		provider: 'pg',
		schema,
	}),

	emailAndPassword: {
		enabled: true,
	},
	secret: config.requireAuthSecret(),
	trustedOrigins: [...config.corsAllowedOrigins],

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
	],
});
