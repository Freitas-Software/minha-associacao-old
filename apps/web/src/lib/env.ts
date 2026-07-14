import { z } from 'zod';

export const DEFAULT_API_URL = 'http://localhost:3001';

const clientEnvSchema = z.object({
	VITE_API_URL: z
		.string()
		.trim()
		.url()
		.default(DEFAULT_API_URL)
		.transform(url => url.replace(/\/$/, '')),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

export function parseClientEnv(input: Record<string, unknown>): ClientEnv {
	return clientEnvSchema.parse(input);
}

export const env = parseClientEnv(import.meta.env);
