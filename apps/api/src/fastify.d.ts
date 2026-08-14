import type { DatabaseClient, pingDatabase } from './db/client.js';

declare module 'fastify' {
	interface FastifyInstance {
		database: DatabaseClient | undefined;
		pingDatabase: typeof pingDatabase;
	}
}
