import 'dotenv/config';
import { createDatabaseClient, pingDatabase } from './client.js';

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is required');
}

const database = createDatabaseClient(process.env.DATABASE_URL);

try {
	const result = await pingDatabase(database);
	console.log(`Database connection OK (${result.latencyMs} ms)`);
} finally {
	await database.close();
}
