import 'dotenv/config';
import { createDatabaseClient } from './client.js';

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is required');
}

const database = createDatabaseClient(process.env.DATABASE_URL);

await database.pool.query('select 1 as ok');
await database.close();

console.log('Database connection OK');
