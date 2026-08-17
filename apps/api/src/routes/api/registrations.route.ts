import { isAPIError } from 'better-auth/api';
import type { FastifyReply } from 'fastify';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { isValidCpf, normalizeCpf } from '../../lib/cpf.js';
import { registerFounder } from '../../services/register-founder.js';

const registrationBodySchema = z.object({
	name: z.string().trim().min(2).max(120),
	documentNumber: z.string().transform(normalizeCpf).refine(isValidCpf, { message: 'Invalid CPF' }),
	email: z.email().transform(email => email.toLowerCase()),
	password: z.string().min(8).max(128),
});

const registrationResponseSchema = z.object({
	user: z.object({
		id: z.string(),
		documentNumber: z.string(),
		name: z.string().nullable(),
		email: z.string().nullable(),
		status: z.enum(['PENDING_PROFILE', 'ACTIVE', 'INACTIVE']),
	}),
});

const errorResponseSchema = z.object({
	error: z.string(),
	code: z.string(),
});

function applyAuthenticationHeaders(headers: Headers, reply: FastifyReply) {
	const cookies = headers.getSetCookie();

	if (cookies.length > 0) {
		reply.header('set-cookie', cookies);
	}
}

const registrationsRoute: FastifyPluginAsyncZod = async app => {
	app.post(
		'/registrations',
		{
			schema: {
				body: registrationBodySchema,
				response: {
					201: registrationResponseSchema,
					409: errorResponseSchema,
					500: errorResponseSchema,
					503: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			if (!app.auth || !app.database)
				return reply
					.status(503)
					.send({ error: 'Registration service unavailable', code: 'REGISTRATION_UNAVAILABLE' });

			try {
				const result = await registerFounder({
					auth: app.auth,
					database: app.database.db,
					headers: request.headers,
					input: request.body,
				});

				if (result.status === 'domain-user-exists')
					return reply.status(409).send({
						error: 'Registration is not available for the provided credentials',
						code: 'REGISTRATION_NOT_AVAILABLE',
					});

				applyAuthenticationHeaders(result.authenticationHeaders, reply);

				return reply.status(201).send({
					user: result.user,
				});
			} catch (error) {
				if (isAPIError(error) && error.statusCode < 500) {
					request.log.info(
						{ statusCode: error.statusCode },
						'Founder registration rejected by authentication service'
					);

					return reply.status(409).send({
						error: 'Registration is not available for the provided credentials',
						code: 'REGISTRATION_NOT_AVAILABLE',
					});
				}

				request.log.error({ err: error }, ' Founder registration failed');

				return reply.status(500).send({
					error: 'Failed to create registration',
					code: 'REGISTRATION_FAILED',
				});
			}
		}
	);
};

export default registrationsRoute;
