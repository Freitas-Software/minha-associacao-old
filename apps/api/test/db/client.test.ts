import { describe, expect, it } from 'vitest';
import { createDatabaseClient } from '../../src/db/client.js';

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
