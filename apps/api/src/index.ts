import 'dotenv/config';

import { pathToFileURL } from 'node:url';
import { createConfig } from '@minha-associacao/config';
import type { FastifyInstance } from 'fastify';
import { buildApp } from './app.js';

type ShutdownSignal = 'SIGINT' | 'SIGTERM';

function registerShutdownHandlers(app: FastifyInstance): void {
	const shutdown = async (signal: ShutdownSignal) => {
		app.log.info({ signal }, 'Shutting down API');

		try {
			await app.close();
		} catch (error) {
			app.log.error(error, 'Failed to shut down API cleanly');
			process.exitCode = 1;
		}
	};

	process.once('SIGINT', () => void shutdown('SIGINT'));
	process.once('SIGTERM', () => void shutdown('SIGTERM'));
}

export async function start(): Promise<FastifyInstance | undefined> {
	let app: FastifyInstance | undefined;

	try {
		const config = createConfig({
			...process.env,
			NODE_ENV: process.env.NODE_ENV ?? 'production',
		});
		app = buildApp({ config });
		registerShutdownHandlers(app);

		await app.listen({ host: config.host, port: config.port });
		return app;
	} catch (error) {
		if (app) {
			app.log.error(error, 'Failed to start API');
			await app.close().catch(closeError => {
				app?.log.error(closeError, 'Failed to close API after startup error');
			});
		} else {
			console.error('Failed to load API configuration', error);
		}

		process.exitCode = 1;
		return undefined;
	}
}

const isEntrypoint =
	process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isEntrypoint) {
	void start();
}
