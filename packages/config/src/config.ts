import type { EnvSchema } from './loaders/index.js';

const DEVELOPMENT_ORIGINS = ['http://localhost:3000', 'http://localhost:8081'];

export class Config {
	public readonly corsAllowedOrigins: ReadonlySet<string>;
	public readonly host: string;
	public readonly nodeEnv: EnvSchema['NODE_ENV'];
	public readonly port: number;

	public constructor(environment: EnvSchema) {
		this.host = environment.HOST;
		this.nodeEnv = environment.NODE_ENV;
		this.port = environment.PORT;

		const defaultOrigins = this.isDevelopment ? DEVELOPMENT_ORIGINS : [];
		this.corsAllowedOrigins = new Set([...defaultOrigins, ...environment.CORS_ALLOWED_ORIGINS]);
	}

	public get isDevelopment(): boolean {
		return this.nodeEnv === 'development';
	}

	public get isProduction(): boolean {
		return this.nodeEnv === 'production';
	}

	public get isTest(): boolean {
		return this.nodeEnv === 'test';
	}

	public isCorsOriginAllowed(origin: string): boolean {
		return this.corsAllowedOrigins.has(origin.replace(/\/$/, ''));
	}
}
