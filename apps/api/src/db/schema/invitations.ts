import { sql } from 'drizzle-orm';
import { check, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { createId } from '../ids.js';
import { invitationChannelEnum } from './enums.js';
import { memberships } from './memberships.js';
import { users } from './users.js';

export const invitations = pgTable(
	'invitations',
	{
		id: text()
			.primaryKey()
			.$defaultFn(() => createId('invitation')),
		membership_id: text()
			.notNull()
			.references(() => memberships.id, { onDelete: 'restrict' }),
		channel: invitationChannelEnum().notNull(),
		recipient: text().notNull(),
		token_hash: text().notNull().unique(),
		expires_at: timestamp({ withTimezone: true }).notNull(),
		accepted_at: timestamp({ withTimezone: true }),
		revoked_at: timestamp({ withTimezone: true }),
		invited_by_user_id: text()
			.notNull()
			.references(() => users.id, { onDelete: 'restrict' }),
		created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	table => [
		uniqueIndex('invitations_one_unconsumed_unrevoked_per_membership')
			.on(table.membership_id)
			.where(sql`${table.accepted_at} is null and ${table.revoked_at} is null`),
		check('invitations_expiry_after_creation', sql`${table.expires_at} > ${table.created_at}`),
		check(
			'invitations_acceptance_not_before_creation',
			sql`${table.accepted_at} is null or ${table.accepted_at} >= ${table.created_at}`
		),
		check(
			'invitations_revocation_not_before_creation',
			sql`${table.revoked_at} is null or ${table.revoked_at} >= ${table.created_at}`
		),
	]
);
