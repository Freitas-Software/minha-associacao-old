import { index, jsonb, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { createId } from '../ids.js';
import { provisioningAccessStatusEnum } from './enums.js';
import { organizations } from './organizations.js';
import { users } from './users.js';

export const provisioningAccess = pgTable(
	'provisioning_access',
	{
		id: text().primaryKey().$defaultFn(() => createId('provisioningAccess')),
		organization_id: text().notNull().references(() => organizations.id, { onDelete: 'restrict' }),
		user_id: text().notNull().references(() => users.id, { onDelete: 'restrict' }),
		status: provisioningAccessStatusEnum().notNull().default('ACTIVE'),
		scopes: jsonb().notNull().default([]),
		created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
		completed_at: timestamp({ withTimezone: true }),
		revoked_at: timestamp({ withTimezone: true }),
	},
	table => [
		uniqueIndex('provisioning_access_one_per_org_user').on(table.organization_id, table.user_id),
		index('provisioning_access_user_index').on(table.user_id),
	]
);
