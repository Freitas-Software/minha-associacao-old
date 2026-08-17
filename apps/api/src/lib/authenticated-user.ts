import { fromNodeHeaders } from 'better-auth/node';
import { eq } from 'drizzle-orm';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { DatabaseClient } from '../db/client.js';
import { users } from '../db/schema/users.js';
import type { AppAuth } from './auth.js';

export interface AuthenticatedActor {
	id: string;
	authUserId: string;
	documentNumber: string;
	name: string | null;
	email: string | null;
	phone: string | null;
	birthDate: string | null;
	status: 'PENDING_PROFILE' | 'ACTIVE' | 'INACTIVE';
}

export interface RequireAuthOptions {
	auth: AppAuth | undefined;
	database: DatabaseClient | undefined;
}

export function createRequireAuth(options: RequireAuthOptions) {
	return async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		const { auth, database } = options;

		if (!auth || !database) {
			reply
				.status(503)
				.send({ error: 'Authentication service unavailable', code: 'AUTH_UNAVAILABLE' });
			return;
		}

		try {
			const session = await auth.api.getSession({
				headers: fromNodeHeaders(request.headers),
			});

			if (!session) {
				reply.status(401).send({
					error: 'Authentication required',
					code: 'AUTH_REQUIRED',
				});
				return;
			}

			const [domainUser] = await database.db
				.select({
					id: users.id,
					documentNumber: users.document_number,
					name: users.name,
					email: users.email,
					phone: users.phone,
					birthDate: users.birth_date,
					status: users.status,
				})
				.from(users)
				.where(eq(users.auth_user_id, session.user.id))
				.limit(1);

			if (!domainUser) {
				reply.status(403).send({
					error: 'Authenticated account is not linked to a domain user',
					code: 'DOMAIN_USER_NOT_LINKED',
				});
				return;
			}

			request.actor = {
				...domainUser,
				authUserId: session.user.id,
			};
		} catch (error) {
			request.log.error({ err: error }, 'Failed to resolve authenticated user');
			reply.status(500).send({
				error: 'Failed to verify authentication',
				code: 'AUTH_CHECK_FAILED',
			});
		}
	};
}
