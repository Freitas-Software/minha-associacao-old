import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/index.js';

const DEFAULT_DATABASE_PING_TIMEOUT_MS = 5_000;

export interface DatabaseClient {
	readonly pool: Pool;
	readonly db: NodePgDatabase<typeof schema>;
	close(): Promise<void>;
}

export interface DatabasePingResult {
	readonly status: 'ok';
	readonly latencyMs: number;
}

export interface PingDatabaseOptions {
	readonly timeoutMs?: number;
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
export async function pingDatabase(
	database: Pick<DatabaseClient, 'pool'>,
	options: PingDatabaseOptions = {}
): Promise<DatabasePingResult> {
	const timeoutMs = options.timeoutMs ?? DEFAULT_DATABASE_PING_TIMEOUT_MS;

	if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
		throw new RangeError('Database ping timeout must be a positive integer');
	}

	const startedAt = performance.now();
	let timeoutHandle: NodeJS.Timeout | undefined;
	const timeout = new Promise<never>((_, reject) => {
		timeoutHandle = setTimeout(
			() => reject(new Error(`Database ping timed out after ${timeoutMs} ms`)),
			timeoutMs
		);
		timeoutHandle.unref();
	});

	let result: { rows: Array<{ ok: number }> };
	try {
		result = await Promise.race([database.pool.query<{ ok: number }>('select 1 as ok'), timeout]);
	} finally {
		if (timeoutHandle) {
			clearTimeout(timeoutHandle);
		}
	}

	if (result.rows[0]?.ok !== 1) {
		throw new Error('Database ping returned an unexpected result');
	}

	return {
		status: 'ok',
		latencyMs: Math.round((performance.now() - startedAt) * 100) / 100,
	};
}
