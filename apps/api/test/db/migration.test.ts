import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('initial domain migration', () => {
	it('contains the required domain schema invariants', async () => {
		const sql = await readFile(
			new URL('../../drizzle/0000_domain-schema.sql', import.meta.url),
			'utf8'
		);

		expect(sql).toContain(
			`CREATE TYPE "public"."membership_status" AS ENUM('PENDING', 'ACTIVE', 'INACTIVE')`
		);
		expect(sql).toContain(`"status" "membership_status" DEFAULT 'PENDING' NOT NULL`);
		expect(sql).toContain('"last_selected_at" timestamp with time zone');
		expect(sql).not.toContain('password_hash');
		expect(sql).toContain('CREATE INDEX "memberships_user_last_selected_index"');
		expect(sql).toContain('WHERE "memberships"."status" = \'ACTIVE\'');
		expect(sql).toContain('CONSTRAINT "invitations_expiry_after_creation"');
		expect(sql).toContain('CONSTRAINT "invitations_acceptance_not_before_creation"');
		expect(sql).toContain('CONSTRAINT "invitations_revocation_not_before_creation"');
		expect(sql).toContain(
			'CONSTRAINT "organization_documents_replaces_document_id_organization_documents_id_fk"'
		);
	});
});
