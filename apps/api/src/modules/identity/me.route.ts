import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

const errorResponseSchema = z.object({
	error: z.string(),
	code: z.string(),
});

const meResponseSchema = z.object({
	user: z.object({
		id: z.string(),
		documentNumber: z.string(),
		name: z.string().nullable(),
		email: z.string().nullable(),
		phone: z.string().nullable(),
		birthDate: z.string().nullable(),
		status: z.enum(['PENDING_PROFILE', 'ACTIVE', 'INACTIVE']),
	}),
});

const meRoute: FastifyPluginAsyncZod = async app => {
	app.get(
		'/me',
		{
			preHandler: app.requireAuth,
			schema: {
				response: {
					200: meResponseSchema,
					401: errorResponseSchema,
					403: errorResponseSchema,
					500: errorResponseSchema,
					503: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { actor } = request;

			if (!actor) {
				request.log.error('Authentication hook completed without an actor');

				return reply.status(500).send({
					error: 'Authentication context unavailable',
					code: 'AUTH_CONTEXT_MISSING',
				});
			}

			return {
				user: actor,
			};
		}
	);
};

export default meRoute;
