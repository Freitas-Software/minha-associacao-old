import { sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { roles } from './roles.js';

export const permissions = pgTable(
	'permissions',
	{
		id: text().primaryKey(),
		code: text().notNull().unique(),
	},
	table => [
		check('permissions_code_format', sql`${table.code} ~ '^[A-Z][A-Z0-9_]*:[A-Z][A-Z0-9_]*$'`),
	]
);

export const rolePermissions = pgTable(
	'role_permissions',
	{
		role_id: text()
			.notNull()
			.references(() => roles.id, { onDelete: 'restrict' }),
		permission_id: text()
			.notNull()
			.references(() => permissions.id, { onDelete: 'restrict' }),
	},
	table => [
		primaryKey({ columns: [table.role_id, table.permission_id] }),
		index('role_permissions_permission_id_index').on(table.permission_id),
	]
);
