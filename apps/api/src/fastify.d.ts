import 'fastify';
import type { DatabaseClient, pingDatabase } from './db/client.js';
import type { AppAuth } from './infra/auth/better-auth.ts';
import type { AuthenticatedActor } from './modules/identity/authenticated-actor.ts';

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
