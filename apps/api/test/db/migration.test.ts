import { readdir, readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('database migrations', () => {
	it('contains the required domain schema invariants', async () => {
		const migrationsDirectory = new URL('../../drizzle/', import.meta.url);
		const migrationFiles = (await readdir(migrationsDirectory))
			.filter(file => file.endsWith('.sql'))
			.sort();
		const currentSchemaMigrations = migrationFiles.filter(file => /^000[45]_/.test(file));
		const sql = (
			await Promise.all(
				currentSchemaMigrations.map(file => readFile(new URL(file, migrationsDirectory), 'utf8'))
			)
		).join('\n');
		const historySql = (
			await Promise.all(migrationFiles.map(file => readFile(new URL(file, migrationsDirectory), 'utf8')))
		).join('\n');

		expect(sql).toContain(
			`CREATE TYPE "public"."membership_status" AS ENUM('ACTIVE', 'INACTIVE')`
		);
		expect(sql).toContain(
			`CREATE TYPE "public"."organization_status" AS ENUM('PROVISIONING', 'OPERATIONAL', 'INACTIVE')`
		);
		expect(sql).toContain(`ALTER TABLE "memberships" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
		expect(sql).toContain(`ALTER TABLE "memberships" ADD COLUMN "role_id" text NOT NULL`);
		expect(sql).toContain(`ALTER TABLE "roles" ADD COLUMN "is_default_join_role" boolean DEFAULT false NOT NULL`);
		expect(historySql).toMatch(/"last_selected_at"\s+timestamp with time zone/i);
		expect(historySql).not.toContain('password_hash');
		expect(historySql).toContain('CREATE INDEX "memberships_user_last_selected_index"');
		expect(historySql).toMatch(/WHERE\s+"memberships"\."status"\s*=\s*'ACTIVE'/);
		expect(historySql).toContain('CONSTRAINT "invitations_expiry_after_creation"');
		expect(sql).toContain('CONSTRAINT "invitations_type_binding_consistency"');
		expect(sql).toContain('CONSTRAINT "invitations_global_usage_limit"');
		expect(historySql).toContain(
			'CONSTRAINT "organization_documents_replaces_document_id_organization_documents_id_fk"'
		);
		expect(historySql).toContain('CREATE SCHEMA "auth"');
		expect(historySql).toContain('CONSTRAINT "users_auth_user_id_user_id_fk"');
		expect(sql).toContain('CREATE TABLE "billing_configurations"');
		expect(sql).toContain('CREATE TABLE "charges"');
		expect(sql).toContain('CREATE TABLE "payments"');
		expect(sql).toContain('CREATE TABLE "barter_operations"');
		expect(sql).toContain('CREATE TABLE "provisioning_access"');
		expect(sql).not.toContain('CREATE TABLE "board_members"');
		expect(sql).not.toContain('CREATE TABLE "membership_roles"');
	});
});
