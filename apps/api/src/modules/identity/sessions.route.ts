import { isAPIError } from 'better-auth/api';
import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyReply } from 'fastify';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { isValidCpf, normalizeCpf } from '../../shared/validation/cpf.js';

const errorResponseSchema = z.object({ error: z.string(), code: z.string() });

function applyAuthenticationHeaders(headers: Headers, reply: FastifyReply) {
	const cookies = headers.getSetCookie();
	if (cookies.length > 0) reply.header('set-cookie', cookies);
}

const sessionsRoute: FastifyPluginAsyncZod = async app => {
	app.post(
		'/sessions',
		{
			schema: {
				body: z.object({
					documentNumber: z.string().transform(normalizeCpf).refine(isValidCpf),
					password: z.string().min(8).max(128),
				}),
				response: {
					200: z.object({ token: z.string() }),
					401: errorResponseSchema,
					500: errorResponseSchema,
					503: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			if (!app.auth)
				return reply
					.status(503)
					.send({ error: 'Authentication service unavailable', code: 'AUTH_UNAVAILABLE' });

			try {
				const result = await app.auth.api.signInUsername({
					body: {
						username: request.body.documentNumber,
						password: request.body.password,
					},
					headers: fromNodeHeaders(request.headers),
					returnHeaders: true,
				});
				applyAuthenticationHeaders(result.headers, reply);
				return { token: result.response.token };
			} catch (cause) {
				if (isAPIError(cause) && cause.statusCode < 500)
					return reply
						.status(401)
						.send({ error: 'CPF ou senha inválidos', code: 'INVALID_CREDENTIALS' });
				request.log.error({ err: cause }, 'Application login failed');
				return reply.status(500).send({ error: 'Failed to authenticate', code: 'AUTH_FAILURE' });
			}
		}
	);
};

export default sessionsRoute;
