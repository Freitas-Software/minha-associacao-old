import 'dotenv/config';
import { z } from 'zod';

const originSchema = z.url().transform(value => new URL(value).origin);

const corsAllowedOriginsSchema = z
	.union([z.string(), z.array(z.string())])
	.optional()
	.transform(value => {
		if (value === undefined) {
			return [];
		}

		const origins = Array.isArray(value) ? value : value.split(',');

		return origins.map(origin => origin.trim()).filter(Boolean);
	})
	.pipe(z.array(originSchema));

export const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
	HOST: z.string().trim().min(1).default('0.0.0.0'),
	PORT: z.coerce.number().int().min(1).max(65_535).default(3001),
	CORS_ALLOWED_ORIGINS: corsAllowedOriginsSchema,
	DATABASE_URL: z
		.url()
		.refine(value => ['postgres:', 'postgresql:'].includes(new URL(value).protocol), {
			message: 'DATABASE_URL must use the postgres or postgresql protocol',
		})
		.optional(),
	BETTER_AUTH_URL: z.url().optional(),
	BETTER_AUTH_SECRET: z.string().min(32).optional(),
});

export type EnvSchema = z.infer<typeof envSchema>;
export type Environment = Record<string, string | string[] | undefined>;

export function parseEnv(environment: Environment = process.env): EnvSchema {
	return envSchema.parse(environment);
}

export const envLoader = parseEnv;
