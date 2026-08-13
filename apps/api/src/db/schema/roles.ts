import {
	boolean,
	index,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
} from 'drizzle-orm/pg-core';
import { roleStatusEnum } from './enums.js';
import { memberships } from './memberships.js';
import { organizations } from './organizations.js';

export const roles = pgTable(
	'roles',
	{
		id: text().primaryKey(),
		organization_id: text()
			.notNull()
			.references(() => organizations.id, { onDelete: 'restrict' }),
		name: text().notNull(),
		is_board_role: boolean().notNull().default(false),
		is_full_access: boolean().notNull().default(false),
		status: roleStatusEnum().notNull().default('ACTIVE'),
		created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
		updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	table => [uniqueIndex('roles_organization_name_key').on(table.organization_id, table.name)]
);

export const membershipRoles = pgTable(
	'membership_roles',
	{
		membership_id: text()
			.notNull()
			.references(() => memberships.id, { onDelete: 'restrict' }),
		role_id: text()
			.notNull()
			.references(() => roles.id, { onDelete: 'restrict' }),
	},
	table => [
		primaryKey({ columns: [table.membership_id, table.role_id] }),
		index('membership_roles_role_id_index').on(table.role_id),
	]
);

export const boardMembers = pgTable('board_members', {
	id: text().primaryKey(),
	membership_id: text()
		.notNull()
		.unique()
		.references(() => memberships.id, { onDelete: 'restrict' }),
});
