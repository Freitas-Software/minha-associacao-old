import { createConfig } from '@minha-associacao/config';
import { createDatabaseClient, pingDatabase } from './client.js';

const config = createConfig();
const database = createDatabaseClient(config.requireDatabaseUrl());

try {
	const result = await pingDatabase(database);
	console.log(`Database connection OK (${result.latencyMs} ms)`);
} finally {
	await database.close();
}
