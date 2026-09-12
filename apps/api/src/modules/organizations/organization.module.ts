import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import organizationRoutes from './organizations.route.js';
import provisioningRoutes from './provisioning.route.js';

const organizationModule: FastifyPluginAsyncZod = async app => {
	await app.register(organizationRoutes);
	await app.register(provisioningRoutes);
};

export default organizationModule;
