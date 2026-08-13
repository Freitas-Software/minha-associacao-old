import { sql } from 'drizzle-orm';
import {
	type AnyPgColumn,
	bigint,
	check,
	index,
	jsonb,
	pgTable,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';
import { organizationDocumentTypeEnum, storedFileStatusEnum } from './enums.js';
import { organizations } from './organizations.js';
import { users } from './users.js';

export const storedFiles = pgTable(
	'stored_files',
	{
		id: text().primaryKey(),
		object_key: text().notNull().unique(),
		public_url: text().notNull().unique(),
		original_file_name: text().notNull(),
		mime_type: text().notNull(),
		size_bytes: bigint({ mode: 'number' }).notNull(),
		checksum_sha256: text().notNull(),
		status: storedFileStatusEnum().notNull().default('READY'),
		uploaded_by_user_id: text()
			.notNull()
			.references(() => users.id, { onDelete: 'restrict' }),
		metadata: jsonb().notNull().default({}),
		created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	table => [
		index('stored_files_uploaded_by_user_id_index').on(table.uploaded_by_user_id),
		check('stored_files_size_positive', sql`${table.size_bytes} > 0`),
		check('stored_files_checksum_sha256_format', sql`${table.checksum_sha256} ~ '^[a-f0-9]{64}$'`),
	]
);

export const organizationDocuments = pgTable(
	'organization_documents',
	{
		id: text().primaryKey(),
		organization_id: text()
			.notNull()
			.references(() => organizations.id, { onDelete: 'restrict' }),
		type: organizationDocumentTypeEnum().notNull(),
		stored_file_id: text()
			.notNull()
			.references(() => storedFiles.id, { onDelete: 'restrict' }),
		uploaded_by_user_id: text()
			.notNull()
			.references(() => users.id, { onDelete: 'restrict' }),
		replaces_document_id: text().references(
			(): AnyPgColumn => organizationDocuments.id,
			{ onDelete: 'restrict' }
		),
		created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	},
	table => [
		index('organization_documents_organization_type_index').on(table.organization_id, table.type),
		index('organization_documents_stored_file_id_index').on(table.stored_file_id),
		index('organization_documents_replaces_document_id_index').on(table.replaces_document_id),
	]
);
