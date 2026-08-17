import type { FastifyReply, FastifyRequest } from 'fastify';
import type { DatabaseClient, pingDatabase } from './db/client.js';
import type { AppAuth } from './lib/auth.ts';
import type { AuthenticatedActor } from './lib/authenticated-user.ts';

declare module 'fastify' {
	interface FastifyInstance {
		database: DatabaseClient | undefined;
		pingDatabase: typeof pingDatabase;
		auth: AppAuth | undefined;
		requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void>;
	}

	interface FastifyRequest {
		actor: AuthenticatedActor | null;
	}
}
