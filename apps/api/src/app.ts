import path from 'node:path';
import fastifyAutoload from '@fastify/autoload';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import { type Config, createConfig } from '@minha-associacao/config';
import fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { createDatabaseClient, type DatabaseClient, pingDatabase } from './db/client.js';
import { type AppAuth, createAuth } from './lib/auth.js';

const REDACTED_LOG_PATHS = [
	'req.headers.authorization',
	'req.headers.cookie',

	'req.body.password',
	'req.body.username',

	'req.body.token',
	'req.body.accessToken',
	'req.body.refreshToken',
	'req.body.clientSecret',
	'req.body.privateKey',

	'res.headers.set-cookie',

	'body.password',
	'body.username',

	'body.token',
	'body.accessToken',
	'body.refreshToken',
	'body.clientSecret',
	'body.privateKey',
];

type FastifyLoggerOption = NonNullable<FastifyServerOptions['logger']>;
type LoggerOptions = Exclude<FastifyLoggerOption, boolean>;

export interface BuildAppOptions {
	config?: Config;
	database?: DatabaseClient;
	auth?: AppAuth;
	logger?: FastifyLoggerOption;
}

export function createLoggerOptions(config: Config): LoggerOptions {
	const logger: LoggerOptions = {
		level: config.isDevelopment ? 'debug' : 'info',
		redact: {
			censor: '[REDACTED]',
			paths: REDACTED_LOG_PATHS,
		},
	};

	if (config.isDevelopment) {
		logger.transport = {
			target: 'pino-pretty',
			options: {
				colorize: true,
				ignore: 'pid,hostname',
				translateTime: 'HH:MM:ss',
			},
		};
	}

	return logger;
}

export function buildApp(options: BuildAppOptions = {}): FastifyInstance {
	const config = options.config ?? createConfig();
	const app = fastify({
		logger: options.logger ?? createLoggerOptions(config),
	});

	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	const database =
		options.database ?? (config.databaseUrl ? createDatabaseClient(config.databaseUrl) : undefined);
	app.decorate('database', database);
	app.decorate('pingDatabase', pingDatabase);
	if (!options.database && database) {
		app.addHook('onClose', async () => {
			await database.close();
		});
	}

	const auth =
		options.auth ??
		(database?.db
			? createAuth(database.db, {
					baseUrl: config.requireAuthBaseUrl(),
					secret: config.requireAuthSecret(),
					trustedOrigins: [...config.corsAllowedOrigins],
				})
			: undefined);
	app.decorate('auth', auth);

	app.register(fastifyHelmet);
	app.register(fastifyRateLimit, {
		global: true,
		max: 100,
		timeWindow: '1 minute',
	});
	app.register(fastifyCors, {
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
		credentials: true,
		maxAge: 86_400,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		origin: (origin, callback) => {
			if (origin === undefined || config.isCorsOriginAllowed(origin)) {
				callback(null, true);
				return;
			}

			callback(null, false);
		},
	});

	app.register(fastifyAutoload, {
		dir: path.resolve(import.meta.dirname, 'routes'),
		dirNameRoutePrefix: true,
	});

	return app;
}
