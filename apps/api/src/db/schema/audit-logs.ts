import { index, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '../ids.js';
import { auditActorSourceEnum } from './enums.js';
import { organizations } from './organizations.js';
import { users } from './users.js';

export const auditLogs = pgTable(
	'audit_logs',
	{
		id: text()
			.primaryKey()
			.$defaultFn(() => createId('auditLog')),
		organization_id: text()
			.notNull()
			.references(() => organizations.id, { onDelete: 'restrict' }),
		actor_user_id: text().references(() => users.id, { onDelete: 'set null' }),
		actor_source: auditActorSourceEnum().notNull(),
		action: text().notNull(),
		entity_type: text().notNull(),
		entity_id: text().notNull(),
		metadata: jsonb().notNull().default({}),
		created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	table => [
		index('audit_logs_organization_created_at_index').on(
			table.organization_id,
			table.created_at.desc()
		),
		index('audit_logs_entity_index').on(table.entity_type, table.entity_id),
	]
);
