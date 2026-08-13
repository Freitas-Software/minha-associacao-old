import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { organizationStatusEnum } from './enums.js';

export const organizations = pgTable(
	'organizations',
	{
		id: text().primaryKey(),
		name: text().notNull(),
		abbreviation: text().notNull(),
		document_number: text().notNull(),
		status: organizationStatusEnum().notNull().default('ACTIVE'),
		created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
		updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	table => [
		uniqueIndex('organizations_abbreviation_key').on(table.abbreviation),
		uniqueIndex('organizations_document_number_key').on(table.document_number),
	]
);
