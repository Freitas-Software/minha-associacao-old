import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const authRoute: FastifyPluginAsyncZod = async app => {
	app.route({
		method: ['GET', 'POST'],
		url: '/auth/*',
		async handler(request, reply) {
			if (!app.auth) {
				return reply.status(503).send({
					error: 'Authentication service unavailable',
					code: 'AUTH_UNAVAILABLE',
				});
			}

			try {
				const url = new URL(request.url, `http://${request.headers.host}`);

				const headers = fromNodeHeaders(request.headers);

				const req = new Request(url.toString(), {
					method: request.method,
					headers,
					...(request.body ? { body: JSON.stringify(request.body) } : {}),
				});

				const response = await app.auth.handler(req);

				reply.status(response.status);
				response.headers.forEach((value, key) => void reply.header(key, value));

				return reply.send(response.body ? await response.text() : null);
			} catch (error) {
				app.log.error(error, 'Authentication Error:');
				return reply.status(500).send({
					error: 'Internal authentication error',
					code: 'AUTH_FAILURE',
				});
			}
		},
	});
};

export default authRoute;
