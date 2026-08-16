import type { EnvSchema } from './loaders/index.js';

const DEVELOPMENT_ORIGINS = ['http://localhost:3000', 'http://localhost:8081'];

export class Config {
	readonly #corsAllowedOrigins: ReadonlySet<string>;
	readonly #environment: EnvSchema;

	public constructor(environment: EnvSchema) {
		this.#environment = environment;

		const defaultOrigins = this.isDevelopment ? DEVELOPMENT_ORIGINS : [];
		this.#corsAllowedOrigins = new Set([...defaultOrigins, ...environment.CORS_ALLOWED_ORIGINS]);
	}

	public get corsAllowedOrigins(): ReadonlySet<string> {
		return this.#corsAllowedOrigins;
	}

	public get databaseUrl(): string | undefined {
		return this.#environment.DATABASE_URL;
	}

	public get authBaseUrl(): string | undefined {
		return this.#environment.BETTER_AUTH_URL;
	}

	public get authSecret(): string | undefined {
		return this.#environment.BETTER_AUTH_SECRET;
	}

	public get host(): string {
		return this.#environment.HOST;
	}

	public get nodeEnv(): EnvSchema['NODE_ENV'] {
		return this.#environment.NODE_ENV;
	}

	public get port(): number {
		return this.#environment.PORT;
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
		return this.#corsAllowedOrigins.has(origin.replace(/\/$/, ''));
	}

	public requireDatabaseUrl(): string {
		if (!this.databaseUrl) {
			throw new Error('DATABASE_URL is required');
		}

		return this.databaseUrl;
	}

	public requireAuthBaseUrl(): string {
		if (!this.authBaseUrl) {
			throw new Error('BETTER_AUTH_URL is required');
		}

		return this.authBaseUrl;
	}

	public requireAuthSecret(): string {
		if (!this.authSecret) {
			throw new Error('BETTER_AUTH_SECRET is required');
		}

		return this.authSecret;
	}
}
