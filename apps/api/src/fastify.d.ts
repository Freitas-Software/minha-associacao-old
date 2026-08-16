import type { DatabaseClient, pingDatabase } from './db/client.js';
import type { AppAuth } from './lib/auth.ts';

declare module 'fastify' {
	interface FastifyInstance {
		database: DatabaseClient | undefined;
		pingDatabase: typeof pingDatabase;
		auth: AppAuth | undefined;
	}
}
