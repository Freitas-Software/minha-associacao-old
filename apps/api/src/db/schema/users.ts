import { sql } from 'drizzle-orm';
import { date, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { user as authUser } from './better-auth.js';
import { userStatusEnum } from './enums.js';

export const users = pgTable(
	'users',
	{
		id: text().primaryKey(),
		auth_user_id: text()
			.unique()
			.references(() => authUser.id, { onDelete: 'set null' }),
		document_number: text().notNull().unique(),
		name: text(),
		email: text(),
		phone: text(),
		birth_date: date(),
		status: userStatusEnum().notNull().default('PENDING_PROFILE'),
		created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
		updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	table => [
		uniqueIndex('users_email_unique_when_present')
			.on(sql`lower(${table.email})`)
			.where(sql`${table.email} is not null`),
		uniqueIndex('users_phone_unique_when_present')
			.on(table.phone)
			.where(sql`${table.phone} is not null`),
	]
);
