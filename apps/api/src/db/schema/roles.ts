import { sql } from 'drizzle-orm';
import { boolean, check, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { createId } from '../ids.js';
import { roleStatusEnum } from './enums.js';
import { organizations } from './organizations.js';

export const roles = pgTable(
	'roles',
	{
		id: text()
			.primaryKey()
			.$defaultFn(() => createId('role')),
		organization_id: text()
			.notNull()
			.references(() => organizations.id, { onDelete: 'restrict' }),
		name: text().notNull(),
		is_board_role: boolean().notNull().default(false),
		is_full_access: boolean().notNull().default(false),
		is_default_join_role: boolean().notNull().default(false),
		status: roleStatusEnum().notNull().default('ACTIVE'),
		created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
		updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	table => [
		uniqueIndex('roles_organization_name_key').on(table.organization_id, table.name),
		uniqueIndex('roles_one_default_join_role_per_org')
			.on(table.organization_id)
			.where(sql`${table.is_default_join_role} = true`),
		check(
			'roles_default_join_role_eligible',
			sql`${table.is_default_join_role} = false or (${table.status} = 'ACTIVE' and ${table.is_board_role} = false and ${table.is_full_access} = false)`,
		),
	]
);
