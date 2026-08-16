CREATE TYPE "public"."invitation_channel" AS ENUM('EMAIL', 'WHATSAPP');

--> statement-breakpoint
CREATE TYPE "public"."membership_status" AS ENUM('PENDING', 'ACTIVE', 'INACTIVE');

--> statement-breakpoint
CREATE TYPE "public"."organization_document_type" AS ENUM('STATUTE', 'ELECTION_RECORD');

--> statement-breakpoint
CREATE TYPE "public"."organization_status" AS ENUM('ACTIVE', 'INACTIVE');

--> statement-breakpoint
CREATE TYPE "public"."role_status" AS ENUM('ACTIVE', 'INACTIVE');

--> statement-breakpoint
CREATE TYPE "public"."stored_file_status" AS ENUM('READY', 'DELETED');

--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('PENDING_PROFILE', 'ACTIVE', 'INACTIVE');

--> statement-breakpoint
CREATE TABLE
	"audit_logs" (
		"id" TEXT PRIMARY KEY NOT NULL,
		"organization_id" TEXT NOT NULL,
		"actor_user_id" TEXT,
		"action" TEXT NOT NULL,
		"entity_type" TEXT NOT NULL,
		"entity_id" TEXT NOT NULL,
		"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
		"created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
	);

--> statement-breakpoint
CREATE TABLE
	"organization_documents" (
		"id" TEXT PRIMARY KEY NOT NULL,
		"organization_id" TEXT NOT NULL,
		"type" "organization_document_type" NOT NULL,
		"stored_file_id" TEXT NOT NULL,
		"uploaded_by_user_id" TEXT NOT NULL,
		"replaces_document_id" TEXT,
		"created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
	);

--> statement-breakpoint
CREATE TABLE
	"stored_files" (
		"id" TEXT PRIMARY KEY NOT NULL,
		"object_key" TEXT NOT NULL,
		"public_url" TEXT NOT NULL,
		"original_file_name" TEXT NOT NULL,
		"mime_type" TEXT NOT NULL,
		"size_bytes" BIGINT NOT NULL,
		"checksum_sha256" TEXT NOT NULL,
		"status" "stored_file_status" DEFAULT 'READY' NOT NULL,
		"uploaded_by_user_id" TEXT NOT NULL,
		"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
		"created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
		CONSTRAINT "stored_files_object_key_unique" UNIQUE ("object_key"),
		CONSTRAINT "stored_files_public_url_unique" UNIQUE ("public_url"),
		CONSTRAINT "stored_files_size_positive" CHECK ("stored_files"."size_bytes">0),
		CONSTRAINT "stored_files_checksum_sha256_format" CHECK ("stored_files"."checksum_sha256"~'^[a-f0-9]{64}$')
	);

--> statement-breakpoint
CREATE TABLE
	"invitations" (
		"id" TEXT PRIMARY KEY NOT NULL,
		"membership_id" TEXT NOT NULL,
		"channel" "invitation_channel" NOT NULL,
		"recipient" TEXT NOT NULL,
		"token_hash" TEXT NOT NULL,
		"expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
		"accepted_at" TIMESTAMP WITH TIME ZONE,
		"revoked_at" TIMESTAMP WITH TIME ZONE,
		"invited_by_user_id" TEXT NOT NULL,
		"created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
		CONSTRAINT "invitations_token_hash_unique" UNIQUE ("token_hash"),
		CONSTRAINT "invitations_expiry_after_creation" CHECK (
			"invitations"."expires_at">"invitations"."created_at"
		),
		CONSTRAINT "invitations_acceptance_not_before_creation" CHECK (
			"invitations"."accepted_at" IS NULL
			OR "invitations"."accepted_at">="invitations"."created_at"
		),
		CONSTRAINT "invitations_revocation_not_before_creation" CHECK (
			"invitations"."revoked_at" IS NULL
			OR "invitations"."revoked_at">="invitations"."created_at"
		)
	);

--> statement-breakpoint
CREATE TABLE
	"memberships" (
		"id" TEXT PRIMARY KEY NOT NULL,
		"organization_id" TEXT NOT NULL,
		"user_id" TEXT NOT NULL,
		"status" "membership_status" DEFAULT 'PENDING' NOT NULL,
		"last_selected_at" TIMESTAMP WITH TIME ZONE,
		"created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
		"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
	);

--> statement-breakpoint
CREATE TABLE
	"organizations" (
		"id" TEXT PRIMARY KEY NOT NULL,
		"name" TEXT NOT NULL,
		"abbreviation" TEXT NOT NULL,
		"document_number" TEXT NOT NULL,
		"status" "organization_status" DEFAULT 'ACTIVE' NOT NULL,
		"created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
		"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
	);

--> statement-breakpoint
CREATE TABLE
	"permissions" (
		"id" TEXT PRIMARY KEY NOT NULL,
		"code" TEXT NOT NULL,
		CONSTRAINT "permissions_code_unique" UNIQUE ("code"),
		CONSTRAINT "permissions_code_format" CHECK (
			"permissions"."code"~'^[A-Z][A-Z0-9_]*:[A-Z][A-Z0-9_]*$'
		)
	);

--> statement-breakpoint
CREATE TABLE
	"role_permissions" (
		"role_id" TEXT NOT NULL,
		"permission_id" TEXT NOT NULL,
		CONSTRAINT "role_permissions_role_id_permission_id_pk" PRIMARY KEY ("role_id", "permission_id")
	);

--> statement-breakpoint
CREATE TABLE
	"board_members" (
		"id" TEXT PRIMARY KEY NOT NULL,
		"membership_id" TEXT NOT NULL,
		CONSTRAINT "board_members_membership_id_unique" UNIQUE ("membership_id")
	);

--> statement-breakpoint
CREATE TABLE
	"membership_roles" (
		"membership_id" TEXT NOT NULL,
		"role_id" TEXT NOT NULL,
		CONSTRAINT "membership_roles_membership_id_role_id_pk" PRIMARY KEY ("membership_id", "role_id")
	);

--> statement-breakpoint
CREATE TABLE
	"roles" (
		"id" TEXT PRIMARY KEY NOT NULL,
		"organization_id" TEXT NOT NULL,
		"name" TEXT NOT NULL,
		"is_board_role" BOOLEAN DEFAULT FALSE NOT NULL,
		"is_full_access" BOOLEAN DEFAULT FALSE NOT NULL,
		"status" "role_status" DEFAULT 'ACTIVE' NOT NULL,
		"created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
		"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
	);

--> statement-breakpoint
CREATE TABLE
	"users" (
		"id" TEXT PRIMARY KEY NOT NULL,
		"cpf" TEXT NOT NULL,
		"name" TEXT,
		"email" TEXT,
		"phone" TEXT,
		"birth_date" date,
		"status" "user_status" DEFAULT 'PENDING_PROFILE' NOT NULL,
		"created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
		"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
		CONSTRAINT "users_cpf_unique" UNIQUE ("cpf")
	);

--> statement-breakpoint
ALTER TABLE "audit_logs"
ADD CONSTRAINT "audit_logs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "audit_logs"
ADD CONSTRAINT "audit_logs_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "organization_documents"
ADD CONSTRAINT "organization_documents_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "organization_documents"
ADD CONSTRAINT "organization_documents_stored_file_id_stored_files_id_fk" FOREIGN KEY ("stored_file_id") REFERENCES "public"."stored_files" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "organization_documents"
ADD CONSTRAINT "organization_documents_uploaded_by_user_id_users_id_fk" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "organization_documents"
ADD CONSTRAINT "organization_documents_replaces_document_id_organization_documents_id_fk" FOREIGN KEY ("replaces_document_id") REFERENCES "public"."organization_documents" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "stored_files"
ADD CONSTRAINT "stored_files_uploaded_by_user_id_users_id_fk" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "invitations"
ADD CONSTRAINT "invitations_membership_id_memberships_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."memberships" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "invitations"
ADD CONSTRAINT "invitations_invited_by_user_id_users_id_fk" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "memberships"
ADD CONSTRAINT "memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "memberships"
ADD CONSTRAINT "memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "role_permissions"
ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "role_permissions"
ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "board_members"
ADD CONSTRAINT "board_members_membership_id_memberships_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."memberships" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "membership_roles"
ADD CONSTRAINT "membership_roles_membership_id_memberships_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."memberships" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "membership_roles"
ADD CONSTRAINT "membership_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "roles"
ADD CONSTRAINT "roles_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

--> statement-breakpoint
CREATE INDEX "audit_logs_organization_created_at_index" ON "audit_logs" USING btree ("organization_id", "created_at" DESC NULLS LAST);

--> statement-breakpoint
CREATE INDEX "audit_logs_entity_index" ON "audit_logs" USING btree ("entity_type", "entity_id");

--> statement-breakpoint
CREATE INDEX "organization_documents_organization_type_index" ON "organization_documents" USING btree ("organization_id", "type");

--> statement-breakpoint
CREATE INDEX "organization_documents_stored_file_id_index" ON "organization_documents" USING btree ("stored_file_id");

--> statement-breakpoint
CREATE INDEX "organization_documents_replaces_document_id_index" ON "organization_documents" USING btree ("replaces_document_id");

--> statement-breakpoint
CREATE INDEX "stored_files_uploaded_by_user_id_index" ON "stored_files" USING btree ("uploaded_by_user_id");

--> statement-breakpoint
CREATE UNIQUE INDEX "invitations_one_unconsumed_unrevoked_per_membership" ON "invitations" USING btree ("membership_id")
WHERE
	"invitations"."accepted_at" IS NULL
	AND "invitations"."revoked_at" IS NULL;

--> statement-breakpoint
CREATE UNIQUE INDEX "memberships_organization_user_key" ON "memberships" USING btree ("organization_id", "user_id");

--> statement-breakpoint
CREATE INDEX "memberships_user_id_index" ON "memberships" USING btree ("user_id");

--> statement-breakpoint
CREATE INDEX "memberships_user_last_selected_index" ON "memberships" USING btree ("user_id", "last_selected_at" DESC NULLS LAST)
WHERE
	"memberships"."status"='ACTIVE';

--> statement-breakpoint
CREATE UNIQUE INDEX "organizations_abbreviation_key" ON "organizations" USING btree ("abbreviation");

--> statement-breakpoint
CREATE UNIQUE INDEX "organizations_document_number_key" ON "organizations" USING btree ("document_number");

--> statement-breakpoint
CREATE INDEX "role_permissions_permission_id_index" ON "role_permissions" USING btree ("permission_id");

--> statement-breakpoint
CREATE INDEX "membership_roles_role_id_index" ON "membership_roles" USING btree ("role_id");

--> statement-breakpoint
CREATE UNIQUE INDEX "roles_organization_name_key" ON "roles" USING btree ("organization_id", "name");

--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique_when_present" ON "users" USING btree (LOWER("email"))
WHERE
	"users"."email" IS NOT NULL;

--> statement-breakpoint
CREATE UNIQUE INDEX "users_phone_unique_when_present" ON "users" USING btree ("phone")
WHERE
	"users"."phone" IS NOT NULL;