import { sql } from 'drizzle-orm';
import { boolean, check, date, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { createId } from '../ids.js';
import {
	billingPeriodicityEnum,
	chargeStatusEnum,
	delinquencyCombinationEnum,
	delinquencyCriteriaEnum,
	forgivenessComponentEnum,
	paymentMethodEnum,
	paymentStatusEnum,
	refundStatusEnum,
	restrictionTypeEnum,
	roleChangeRecalculationPolicyEnum,
} from './enums.js';
import { memberships } from './memberships.js';
import { organizations } from './organizations.js';
import { roles } from './roles.js';
import { users } from './users.js';

export const billingConfigurations = pgTable('billing_configurations', {
	id: text().primaryKey().$defaultFn(() => createId('billingConfiguration')),
	organization_id: text().notNull().unique().references(() => organizations.id, { onDelete: 'restrict' }),
	default_amount_cents: integer().notNull(),
	default_periodicity: billingPeriodicityEnum().notNull(),
	first_due_date: date().notNull(),
	role_change_recalculation_policy: roleChangeRecalculationPolicyEnum().notNull(),
	fine_enabled: boolean().notNull().default(false),
	fine_amount_cents: integer().notNull().default(0),
	interest_enabled: boolean().notNull().default(false),
	interest_rate_basis_points: integer().notNull().default(0),
	delinquency_criteria: delinquencyCriteriaEnum().notNull(),
	delinquency_days_after_due: integer(),
	delinquency_overdue_charges: integer(),
	delinquency_combination: delinquencyCombinationEnum(),
	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, table => [
	check('billing_default_amount_non_negative', sql`${table.default_amount_cents} >= 0`),
	check('billing_fine_non_negative', sql`${table.fine_amount_cents} >= 0`),
	check('billing_interest_rate_non_negative', sql`${table.interest_rate_basis_points} >= 0`),
	check('billing_delinquency_thresholds_non_negative', sql`(${table.delinquency_days_after_due} is null or ${table.delinquency_days_after_due} >= 0) and (${table.delinquency_overdue_charges} is null or ${table.delinquency_overdue_charges} >= 0)`),
]);

export const roleBillingPolicies = pgTable('role_billing_policies', {
	id: text().primaryKey().$defaultFn(() => createId('roleBillingPolicy')),
	role_id: text().notNull().unique().references(() => roles.id, { onDelete: 'restrict' }),
	amount_cents: integer().notNull(),
	periodicity: billingPeriodicityEnum().notNull(),
	delinquency_criteria: delinquencyCriteriaEnum().notNull(),
	delinquency_days_after_due: integer(),
	delinquency_overdue_charges: integer(),
	delinquency_combination: delinquencyCombinationEnum(),
	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, table => [
	check('role_billing_amount_non_negative', sql`${table.amount_cents} >= 0`),
	check('role_billing_thresholds_non_negative', sql`(${table.delinquency_days_after_due} is null or ${table.delinquency_days_after_due} >= 0) and (${table.delinquency_overdue_charges} is null or ${table.delinquency_overdue_charges} >= 0)`),
]);

export const charges = pgTable('charges', {
	id: text().primaryKey().$defaultFn(() => createId('charge')),
	organization_id: text().notNull().references(() => organizations.id, { onDelete: 'restrict' }),
	membership_id: text().notNull().references(() => memberships.id, { onDelete: 'restrict' }),
	calculated_from_role_id: text().notNull().references(() => roles.id, { onDelete: 'restrict' }),
	period_start: date().notNull(),
	period_end: date().notNull(),
	due_date: date().notNull(),
	status: chargeStatusEnum().notNull().default('OPEN'),
	is_future: boolean().notNull().default(false),
	principal_cents: integer().notNull(),
	penalty_cents: integer().notNull().default(0),
	interest_cents: integer().notNull().default(0),
	forgiven_principal_cents: integer().notNull().default(0),
	forgiven_penalty_cents: integer().notNull().default(0),
	forgiven_interest_cents: integer().notNull().default(0),
	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, table => [
	uniqueIndex('charges_membership_period_unique').on(table.membership_id, table.period_start, table.period_end),
	index('charges_membership_due_date_index').on(table.membership_id, table.due_date),
	check('charges_amounts_non_negative', sql`${table.principal_cents} >= 0 and ${table.penalty_cents} >= 0 and ${table.interest_cents} >= 0 and ${table.forgiven_principal_cents} >= 0 and ${table.forgiven_penalty_cents} >= 0 and ${table.forgiven_interest_cents} >= 0`),
]);

export const payments = pgTable('payments', {
	id: text().primaryKey().$defaultFn(() => createId('payment')),
	organization_id: text().notNull().references(() => organizations.id, { onDelete: 'restrict' }),
	membership_id: text().notNull().references(() => memberships.id, { onDelete: 'restrict' }),
	method: paymentMethodEnum().notNull(),
	status: paymentStatusEnum().notNull().default('PENDING'),
	amount_cents: integer().notNull(),
	provider: text(),
	provider_payment_id: text(),
	provider_metadata: jsonb(),
	confirmed_at: timestamp({ withTimezone: true }),
	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, table => [
	index('payments_membership_status_index').on(table.membership_id, table.status),
	check('payments_amount_positive', sql`${table.amount_cents} > 0`),
]);

export const paymentAllocations = pgTable('payment_allocations', {
	id: text().primaryKey().$defaultFn(() => createId('paymentAllocation')),
	payment_id: text().notNull().references(() => payments.id, { onDelete: 'restrict' }),
	charge_id: text().notNull().references(() => charges.id, { onDelete: 'restrict' }),
	penalty_cents: integer().notNull().default(0),
	interest_cents: integer().notNull().default(0),
	principal_cents: integer().notNull().default(0),
	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, table => [
	uniqueIndex('payment_allocations_payment_charge_unique').on(table.payment_id, table.charge_id),
	check('payment_allocations_non_negative', sql`${table.penalty_cents} >= 0 and ${table.interest_cents} >= 0 and ${table.principal_cents} >= 0`),
]);

export const refunds = pgTable('refunds', {
	id: text().primaryKey().$defaultFn(() => createId('refund')),
	payment_id: text().notNull().references(() => payments.id, { onDelete: 'restrict' }),
	amount_cents: integer().notNull(),
	status: refundStatusEnum().notNull().default('PENDING'),
	reason: text().notNull(),
	provider_refund_id: text(),
	confirmed_at: timestamp({ withTimezone: true }),
	created_by_user_id: text().references(() => users.id, { onDelete: 'restrict' }),
	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, table => [check('refund_amount_positive', sql`${table.amount_cents} > 0`)]);

export const forgivenesses = pgTable('forgivenesses', {
	id: text().primaryKey().$defaultFn(() => createId('forgiveness')),
	charge_id: text().notNull().references(() => charges.id, { onDelete: 'restrict' }),
	component: forgivenessComponentEnum().notNull(),
	amount_cents: integer().notNull(),
	reason: text().notNull(),
	created_by_user_id: text().notNull().references(() => users.id, { onDelete: 'restrict' }),
	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, table => [
	uniqueIndex('forgivenesses_charge_component_unique').on(table.charge_id, table.component),
	check('forgiveness_amount_positive', sql`${table.amount_cents} > 0`),
]);

export const delinquencyExceptions = pgTable('delinquency_exceptions', {
	id: text().primaryKey().$defaultFn(() => createId('delinquencyException')),
	organization_id: text().notNull().references(() => organizations.id, { onDelete: 'restrict' }),
	membership_id: text().notNull().references(() => memberships.id, { onDelete: 'restrict' }),
	starts_at: date().notNull(),
	ends_at: date().notNull(),
	reason: text().notNull(),
	created_by_user_id: text().notNull().references(() => users.id, { onDelete: 'restrict' }),
	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, table => [check('delinquency_exception_date_order', sql`${table.ends_at} >= ${table.starts_at}`)]);

export const membershipRestrictions = pgTable('membership_restrictions', {
	id: text().primaryKey().$defaultFn(() => createId('membershipRestriction')),
	membership_id: text().notNull().references(() => memberships.id, { onDelete: 'restrict' }),
	type: restrictionTypeEnum().notNull(),
	active: boolean().notNull().default(true),
	calculated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	metadata: jsonb().notNull().default({}),
}, table => [uniqueIndex('membership_restrictions_membership_type_unique').on(table.membership_id, table.type)]);

export const billingConfigurationRestrictions = pgTable('billing_configuration_restrictions', {
	billing_configuration_id: text().notNull().references(() => billingConfigurations.id, { onDelete: 'restrict' }),
	type: restrictionTypeEnum().notNull(),
}, table => [uniqueIndex('billing_configuration_restriction_unique').on(table.billing_configuration_id, table.type)]);

export const roleBillingPolicyRestrictions = pgTable('role_billing_policy_restrictions', {
	role_billing_policy_id: text().notNull().references(() => roleBillingPolicies.id, { onDelete: 'restrict' }),
	type: restrictionTypeEnum().notNull(),
}, table => [uniqueIndex('role_billing_policy_restriction_unique').on(table.role_billing_policy_id, table.type)]);
