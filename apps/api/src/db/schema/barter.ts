import { sql } from 'drizzle-orm';
import { check, index, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '../ids.js';
import { barterStatusEnum, residualDispositionEnum } from './enums.js';
import { charges } from './billing.js';
import { memberships } from './memberships.js';
import { organizations } from './organizations.js';
import { users } from './users.js';

export const barterOperations = pgTable('barter_operations', {
	id: text().primaryKey().$defaultFn(() => createId('barterOperation')),
	organization_id: text().notNull().references(() => organizations.id, { onDelete: 'restrict' }),
	membership_id: text().notNull().references(() => memberships.id, { onDelete: 'restrict' }),
	producer_user_id: text().notNull().references(() => users.id, { onDelete: 'restrict' }),
	description: text().notNull(),
	status: barterStatusEnum().notNull().default('DRAFT'),
	recognized_value_cents: integer().notNull(),
	eligible_value_cents: integer().notNull(),
	allocated_value_cents: integer().notNull().default(0),
	residual_value_cents: integer().notNull().default(0),
	residual_disposition: residualDispositionEnum(),
	evidence: jsonb().notNull().default({}),
	confirmed_by_user_id: text().references(() => users.id, { onDelete: 'restrict' }),
	confirmed_at: timestamp({ withTimezone: true }),
	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, table => [
	index('barter_operations_membership_status_index').on(table.membership_id, table.status),
	check('barter_values_non_negative', sql`${table.recognized_value_cents} >= 0 and ${table.eligible_value_cents} >= 0 and ${table.allocated_value_cents} >= 0 and ${table.residual_value_cents} >= 0`),
	check('barter_allocation_within_eligible', sql`${table.allocated_value_cents} + ${table.residual_value_cents} <= ${table.eligible_value_cents}`),
]);

export const barterAllocations = pgTable('barter_allocations', {
	id: text().primaryKey().$defaultFn(() => createId('barterAllocation')),
	barter_operation_id: text().notNull().references(() => barterOperations.id, { onDelete: 'restrict' }),
	charge_id: text().notNull().references(() => charges.id, { onDelete: 'restrict' }),
	penalty_cents: integer().notNull().default(0),
	interest_cents: integer().notNull().default(0),
	principal_cents: integer().notNull().default(0),
	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, table => [check('barter_allocations_non_negative', sql`${table.penalty_cents} >= 0 and ${table.interest_cents} >= 0 and ${table.principal_cents} >= 0`)]);
