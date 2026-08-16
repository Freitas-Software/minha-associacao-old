import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

const healthResponseSchema = z.object({
	status: z.literal('ok'),
});

const readyResponseSchema = z.object({
	status: z.literal('ok'),
	database: z.object({
		status: z.literal('ok'),
		latencyMs: z.number().nonnegative(),
	}),
});

const healthRoute: FastifyPluginAsyncZod = async app => {
	app.get(
		'/health',
		{
			schema: {
				response: {
					200: healthResponseSchema,
				},
			},
		},
		async () => ({ status: 'ok' as const })
	);

	app.get(
		'/ready',
		{
			schema: {
				response: {
					200: readyResponseSchema,
					503: z.object({ status: z.literal('error') }),
				},
			},
		},
		async (_request, reply) => {
			if (!app.database) {
				return reply.code(503).send({ status: 'error' as const });
			}

			try {
				const database = await app.pingDatabase(app.database);
				return { status: 'ok' as const, database };
			} catch (error) {
				app.log.warn({ err: error }, 'Database ready check failed');
				return reply.code(503).send({ status: 'error' as const });
			}
		}
	);
};

export default healthRoute;
