import { sql } from 'drizzle-orm';
import { check, index, integer, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { createId } from '../ids.js';
import { invitationChannelEnum, invitationStatusEnum, invitationTypeEnum } from './enums.js';
import { memberships } from './memberships.js';
import { organizations } from './organizations.js';
import { roles } from './roles.js';
import { users } from './users.js';

export const invitations = pgTable(
	'invitations',
	{
		id: text()
			.primaryKey()
			.$defaultFn(() => createId('invitation')),
		organization_id: text().notNull().references(() => organizations.id, { onDelete: 'restrict' }),
		type: invitationTypeEnum().notNull(),
		status: invitationStatusEnum().notNull().default('PENDING'),
		membership_id: text().references(() => memberships.id, { onDelete: 'restrict' }),
		target_role_id: text().references(() => roles.id, { onDelete: 'restrict' }),
		cpf: text(),
		channel: invitationChannelEnum(),
		recipient: text(),
		token_hash: text().notNull().unique(),
		max_uses: integer(),
		uses_count: integer().notNull().default(0),
		expires_at: timestamp({ withTimezone: true }).notNull(),
		accepted_at: timestamp({ withTimezone: true }),
		revoked_at: timestamp({ withTimezone: true }),
		replaced_by_invitation_id: text(),
		invited_by_user_id: text().references(() => users.id, { onDelete: 'restrict' }),
		created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	table => [
		uniqueIndex('invitations_one_pending_individual_per_org_cpf')
			.on(table.organization_id, table.cpf)
			.where(sql`${table.type} = 'INDIVIDUAL' and ${table.status} = 'PENDING'`),
		index('invitations_organization_status_index').on(table.organization_id, table.status),
		check(
			'invitations_type_binding_consistency',
			sql`(${table.type} = 'INDIVIDUAL' and ${table.cpf} is not null) or (${table.type} = 'GLOBAL' and ${table.cpf} is null)`,
		),
		check('invitations_global_usage_limit', sql`${table.type} = 'INDIVIDUAL' or ${table.max_uses} is null or ${table.max_uses} >= 2`),
		check('invitations_usage_non_negative', sql`${table.uses_count} >= 0`),
		check('invitations_usage_within_limit', sql`${table.max_uses} is null or ${table.uses_count} <= ${table.max_uses}`),
		check('invitations_acceptance_not_before_creation', sql`${table.accepted_at} is null or ${table.accepted_at} >= ${table.created_at}`),
		check('invitations_revocation_not_before_creation', sql`${table.revoked_at} is null or ${table.revoked_at} >= ${table.created_at}`),
		check('invitations_expiry_after_creation', sql`${table.expires_at} > ${table.created_at}`),
	]
);
