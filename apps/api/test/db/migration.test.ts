import { readdir, readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('database migrations', () => {
	it('contains the required domain schema invariants', async () => {
		const migrationsDirectory = new URL('../../drizzle/', import.meta.url);
		const migrationFiles = (await readdir(migrationsDirectory))
			.filter(file => file.endsWith('.sql'))
			.sort();
		const sql = (
			await Promise.all(
				migrationFiles.map(file => readFile(new URL(file, migrationsDirectory), 'utf8'))
			)
		).join('\n');

		expect(sql).toContain(
			`CREATE TYPE "public"."membership_status" AS ENUM('PENDING', 'ACTIVE', 'INACTIVE')`
		);
		expect(sql).toContain(`"status" "membership_status" DEFAULT 'PENDING' NOT NULL`);
		expect(sql).toMatch(/"last_selected_at"\s+timestamp with time zone/i);
		expect(sql).not.toContain('password_hash');
		expect(sql).toContain('CREATE INDEX "memberships_user_last_selected_index"');
		expect(sql).toMatch(/WHERE\s+"memberships"\."status"\s*=\s*'ACTIVE'/);
		expect(sql).toContain('CONSTRAINT "invitations_expiry_after_creation"');
		expect(sql).toContain('CONSTRAINT "invitations_acceptance_not_before_creation"');
		expect(sql).toContain('CONSTRAINT "invitations_revocation_not_before_creation"');
		expect(sql).toContain(
			'CONSTRAINT "organization_documents_replaces_document_id_organization_documents_id_fk"'
		);
		expect(sql).toContain('CREATE SCHEMA "auth"');
		expect(sql).toContain('CONSTRAINT "users_auth_user_id_user_id_fk"');
	});
});
