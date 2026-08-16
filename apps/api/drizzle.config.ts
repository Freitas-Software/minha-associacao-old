import { createConfig } from '@minha-associacao/config';
import { defineConfig } from 'drizzle-kit';

const config = createConfig();

export default defineConfig({
	out: './drizzle',
	schema: './src/db/schema/index.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: config.requireDatabaseUrl(),
	},
});
