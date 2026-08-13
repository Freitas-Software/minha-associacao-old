import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/index.js';

export interface DatabaseClient {
	readonly pool: Pool;
	readonly db: NodePgDatabase<typeof schema>;
	close(): Promise<void>;
}

export function createDatabaseClient(databaseUrl: string): DatabaseClient {
	const pool = new Pool({ connectionString: databaseUrl });
	const db = drizzle({ client: pool, schema });

	return {
		pool,
		db,
		async close() {
			await pool.end();
		},
	};
}
