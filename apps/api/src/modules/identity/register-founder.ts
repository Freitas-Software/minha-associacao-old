import { fromNodeHeaders } from 'better-auth/node';
import { eq } from 'drizzle-orm';
import type { IncomingHttpHeaders } from 'node:http';
import type { Database } from '../../db/client.js';
import { createId } from '../../db/ids.js';
import { user as authUsers, users } from '../../db/schema/index.js';
import type { AppAuth } from '../../infra/auth/better-auth.js';

export interface RegisterFounderInput {
	name: string;
	documentNumber: string;
	email: string;
	password: string;
}

export interface RegisterFounderOptions {
	auth: AppAuth;
	database: Database;
	headers: IncomingHttpHeaders;
	input: RegisterFounderInput;
}

export async function registerFounder(options: RegisterFounderOptions) {
	const { auth, database, headers, input } = options;

	const [existingDomainUser] = await database
		.select({ id: users.id })
		.from(users)
		.where(eq(users.document_number, input.documentNumber))
		.limit(1);

	if (existingDomainUser) {
		return { status: 'domain-user-exists' as const };
	}

	const registration = await auth.api.signUpEmail({
		body: {
			name: input.name,
			email: input.email,
			password: input.password,
			username: input.documentNumber,
		},
		headers: fromNodeHeaders(headers),
		returnHeaders: true,
	});

	try {
		const [domainUser] = await database
			.insert(users)
			.values({
				id: createId('user'),
				auth_user_id: registration.response.user.id,
				document_number: input.documentNumber,
				name: input.name,
				email: registration.response.user.email,
				status: 'PENDING_PROFILE',
			})
			.returning({
				id: users.id,
				documentNumber: users.document_number,
				name: users.name,
				email: users.email,
				status: users.status,
			});

		if (!domainUser) throw new Error('Domain user insert returned no record');

		return {
			status: 'created' as const,
			authenticationHeaders: registration.headers,
			user: domainUser,
		};
	} catch (registrationError) {
		try {
			await database.delete(authUsers).where(eq(authUsers.id, registration.response.user.id));
		} catch (compensationError) {
			throw new AggregateError(
				[registrationError, compensationError],
				'Founder registration and authentication cleanup both failed'
			);
		}

		throw registrationError;
	}
}
