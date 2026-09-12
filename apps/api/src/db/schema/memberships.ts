import { sql } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { createId } from '../ids.js';
import { membershipStatusEnum } from './enums.js';
import { organizations } from './organizations.js';
import { roles } from './roles.js';
import { users } from './users.js';

export const memberships = pgTable(
	'memberships',
	{
		id: text()
			.primaryKey()
			.$defaultFn(() => createId('membership')),
		organization_id: text()
			.notNull()
			.references(() => organizations.id, { onDelete: 'restrict' }),
		user_id: text()
			.notNull()
			.references(() => users.id, { onDelete: 'restrict' }),
		role_id: text()
			.notNull()
			.references(() => roles.id, { onDelete: 'restrict' }),
		status: membershipStatusEnum().notNull().default('ACTIVE'),
		last_selected_at: timestamp({ withTimezone: true }),
		deactivated_at: timestamp({ withTimezone: true }),
		deactivation_reason: text(),
		reactivated_at: timestamp({ withTimezone: true }),
		delinquent_since: timestamp({ withTimezone: true }),
		created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
		updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	table => [
		uniqueIndex('memberships_organization_user_key').on(table.organization_id, table.user_id),
		index('memberships_user_id_index').on(table.user_id),
		index('memberships_user_last_selected_index')
			.on(table.user_id, table.last_selected_at.desc().nullsLast())
			.where(sql`${table.status} = 'ACTIVE'`),
	]
);
