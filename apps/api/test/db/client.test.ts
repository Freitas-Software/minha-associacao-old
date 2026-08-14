import { describe, expect, it, vi } from 'vitest';
import { createDatabaseClient, pingDatabase } from '../../src/db/client.js';

describe('createDatabaseClient', () => {
	it('creates an explicit database client without using an import-time singleton', async () => {
		const database = createDatabaseClient('postgresql://user:password@localhost:5432/app');

		expect(database.db).toBeDefined();
		expect(database.pool).toBeDefined();
		expect(database.pool.options.connectionString).toBe(
			'postgresql://user:password@localhost:5432/app'
		);

		await database.close();
	});
});

describe('pingDatabase', () => {
	it('checks the database with a bounded query and returns its latency', async () => {
		const query = vi.fn().mockResolvedValue({ rows: [{ ok: 1 }] });

		const result = await pingDatabase({ pool: { query } } as never, { timeoutMs: 1_000 });

		expect(result).toMatchObject({ status: 'ok' });
		expect(result.latencyMs).toBeGreaterThanOrEqual(0);
		expect(query).toHaveBeenCalledWith('select 1 as ok');
	});

	it('rejects invalid timeout values before touching the database', async () => {
		const query = vi.fn();

		await expect(pingDatabase({ pool: { query } } as never, { timeoutMs: 0 })).rejects.toThrow(
			'Database ping timeout must be a positive integer'
		);
		expect(query).not.toHaveBeenCalled();
	});

	it('rejects an unexpected database response', async () => {
		const query = vi.fn().mockResolvedValue({ rows: [{ ok: 0 }] });

		await expect(pingDatabase({ pool: { query } } as never)).rejects.toThrow(
			'Database ping returned an unexpected result'
		);
	});
});
