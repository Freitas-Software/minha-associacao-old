import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

const healthResponseSchema = z.object({
	status: z.literal('ok'),
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
};

export default healthRoute;
