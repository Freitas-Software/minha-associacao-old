import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import authRoute from './auth.route.js';
import meRoute from './me.route.js';
import registrationsRoute from './registrations.route.js';

const identityModule: FastifyPluginAsyncZod = async app => {
	await app.register(authRoute);
	await app.register(meRoute);
	await app.register(registrationsRoute);
};

export default identityModule
