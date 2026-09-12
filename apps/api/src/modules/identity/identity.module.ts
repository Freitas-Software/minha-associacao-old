import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import meRoute from './me.route.js';
import registrationsRoute from './registrations.route.js';
import sessionsRoute from './sessions.route.js';

const identityModule: FastifyPluginAsyncZod = async app => {
	await app.register(meRoute);
	await app.register(registrationsRoute);
	await app.register(sessionsRoute);
};

export default identityModule;
