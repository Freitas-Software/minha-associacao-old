CREATE TYPE "public"."audit_actor_source" AS ENUM('USER', 'PLATFORM', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."barter_source_type" AS ENUM('PAA_DELIVERY', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."barter_status" AS ENUM('DRAFT', 'CONFIRMED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."billing_periodicity" AS ENUM('MONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL');--> statement-breakpoint
CREATE TYPE "public"."charge_status" AS ENUM('OPEN', 'PAID', 'FORGIVEN', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."delinquency_combination" AS ENUM('ANY', 'ALL');--> statement-breakpoint
CREATE TYPE "public"."delinquency_criteria" AS ENUM('DAYS_AFTER_DUE_DATE', 'OVERDUE_CHARGES', 'BOTH');--> statement-breakpoint
CREATE TYPE "public"."forgiveness_component" AS ENUM('PENALTY', 'INTEREST', 'PRINCIPAL');--> statement-breakpoint
CREATE TYPE "public"."invitation_status" AS ENUM('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED', 'EXHAUSTED');--> statement-breakpoint
CREATE TYPE "public"."invitation_type" AS ENUM('INDIVIDUAL', 'GLOBAL');--> statement-breakpoint
CREATE TYPE "public"."paa_project_status" AS ENUM('ACTIVE', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('CASH', 'BANK_TRANSFER', 'CARD', 'PIX', 'GATEWAY', 'BARTER');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'CONFIRMED', 'FAILED', 'PARTIALLY_REFUNDED', 'REFUNDED', 'REVERSED');--> statement-breakpoint
CREATE TYPE "public"."provisioning_access_status" AS ENUM('ACTIVE', 'REVOKED', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."refund_status" AS ENUM('PENDING', 'CONFIRMED', 'FAILED', 'REVERSED');--> statement-breakpoint
CREATE TYPE "public"."residual_disposition" AS ENUM('RETURNED', 'RETAINED_AS_CREDIT', 'SPLIT', 'NONE');--> statement-breakpoint
CREATE TYPE "public"."restriction_type" AS ENUM('MEMBERSHIP_CARD', 'BENEFITS');--> statement-breakpoint
CREATE TYPE "public"."role_change_recalculation_policy" AS ENUM('FUTURE_ONLY', 'FUTURE_AND_ELIGIBLE_OPEN');--> statement-breakpoint
CREATE TABLE "barter_allocations" (
	"id" text PRIMARY KEY NOT NULL,
	"barter_operation_id" text NOT NULL,
	"charge_id" text NOT NULL,
	"penalty_cents" integer DEFAULT 0 NOT NULL,
	"interest_cents" integer DEFAULT 0 NOT NULL,
	"principal_cents" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "barter_allocations_non_negative" CHECK ("barter_allocations"."penalty_cents" >= 0 and "barter_allocations"."interest_cents" >= 0 and "barter_allocations"."principal_cents" >= 0)
);
--> statement-breakpoint
CREATE TABLE "barter_operations" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"membership_id" text NOT NULL,
	"producer_user_id" text NOT NULL,
	"source_type" "barter_source_type" NOT NULL,
	"source_reference" text NOT NULL,
	"status" "barter_status" DEFAULT 'DRAFT' NOT NULL,
	"recognized_value_cents" integer NOT NULL,
	"eligible_value_cents" integer NOT NULL,
	"allocated_value_cents" integer DEFAULT 0 NOT NULL,
	"residual_value_cents" integer DEFAULT 0 NOT NULL,
	"residual_disposition" "residual_disposition",
	"evidence" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"confirmed_by_user_id" text,
	"confirmed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "barter_values_non_negative" CHECK ("barter_operations"."recognized_value_cents" >= 0 and "barter_operations"."eligible_value_cents" >= 0 and "barter_operations"."allocated_value_cents" >= 0 and "barter_operations"."residual_value_cents" >= 0),
	CONSTRAINT "barter_allocation_within_eligible" CHECK ("barter_operations"."allocated_value_cents" + "barter_operations"."residual_value_cents" <= "barter_operations"."eligible_value_cents")
);
--> statement-breakpoint
CREATE TABLE "billing_configurations" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"default_amount_cents" integer NOT NULL,
	"default_periodicity" "billing_periodicity" NOT NULL,
	"first_due_date" date NOT NULL,
	"role_change_recalculation_policy" "role_change_recalculation_policy" NOT NULL,
	"fine_enabled" boolean DEFAULT false NOT NULL,
	"fine_amount_cents" integer DEFAULT 0 NOT NULL,
	"interest_enabled" boolean DEFAULT false NOT NULL,
	"interest_rate_basis_points" integer DEFAULT 0 NOT NULL,
	"delinquency_criteria" "delinquency_criteria" NOT NULL,
	"delinquency_days_after_due" integer,
	"delinquency_overdue_charges" integer,
	"delinquency_combination" "delinquency_combination",
	"restriction_types" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "billing_configurations_organization_id_unique" UNIQUE("organization_id"),
	CONSTRAINT "billing_default_amount_non_negative" CHECK ("billing_configurations"."default_amount_cents" >= 0),
	CONSTRAINT "billing_fine_non_negative" CHECK ("billing_configurations"."fine_amount_cents" >= 0),
	CONSTRAINT "billing_interest_rate_non_negative" CHECK ("billing_configurations"."interest_rate_basis_points" >= 0),
	CONSTRAINT "billing_delinquency_thresholds_non_negative" CHECK (("billing_configurations"."delinquency_days_after_due" is null or "billing_configurations"."delinquency_days_after_due" >= 0) and ("billing_configurations"."delinquency_overdue_charges" is null or "billing_configurations"."delinquency_overdue_charges" >= 0))
);
--> statement-breakpoint
CREATE TABLE "charges" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"membership_id" text NOT NULL,
	"calculated_from_role_id" text NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"due_date" date NOT NULL,
	"status" charge_status DEFAULT 'OPEN' NOT NULL,
	"is_future" boolean DEFAULT false NOT NULL,
	"principal_cents" integer NOT NULL,
	"penalty_cents" integer DEFAULT 0 NOT NULL,
	"interest_cents" integer DEFAULT 0 NOT NULL,
	"forgiven_principal_cents" integer DEFAULT 0 NOT NULL,
	"forgiven_penalty_cents" integer DEFAULT 0 NOT NULL,
	"forgiven_interest_cents" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "charges_amounts_non_negative" CHECK ("charges"."principal_cents" >= 0 and "charges"."penalty_cents" >= 0 and "charges"."interest_cents" >= 0 and "charges"."forgiven_principal_cents" >= 0 and "charges"."forgiven_penalty_cents" >= 0 and "charges"."forgiven_interest_cents" >= 0)
);
--> statement-breakpoint
CREATE TABLE "delinquency_exceptions" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"membership_id" text NOT NULL,
	"starts_at" date NOT NULL,
	"ends_at" date NOT NULL,
	"reason" text NOT NULL,
	"created_by_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "delinquency_exception_date_order" CHECK ("delinquency_exceptions"."ends_at" >= "delinquency_exceptions"."starts_at")
);
--> statement-breakpoint
CREATE TABLE "forgivenesses" (
	"id" text PRIMARY KEY NOT NULL,
	"charge_id" text NOT NULL,
	"component" "forgiveness_component" NOT NULL,
	"amount_cents" integer NOT NULL,
	"reason" text NOT NULL,
	"created_by_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "forgiveness_amount_positive" CHECK ("forgivenesses"."amount_cents" > 0)
);
--> statement-breakpoint
CREATE TABLE "membership_restrictions" (
	"id" text PRIMARY KEY NOT NULL,
	"membership_id" text NOT NULL,
	"type" "restriction_type" NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"calculated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_allocations" (
	"id" text PRIMARY KEY NOT NULL,
	"payment_id" text NOT NULL,
	"charge_id" text NOT NULL,
	"penalty_cents" integer DEFAULT 0 NOT NULL,
	"interest_cents" integer DEFAULT 0 NOT NULL,
	"principal_cents" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_allocations_non_negative" CHECK ("payment_allocations"."penalty_cents" >= 0 and "payment_allocations"."interest_cents" >= 0 and "payment_allocations"."principal_cents" >= 0)
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"membership_id" text NOT NULL,
	"method" "payment_method" NOT NULL,
	"status" "payment_status" DEFAULT 'PENDING' NOT NULL,
	"amount_cents" integer NOT NULL,
	"provider" text,
	"provider_payment_id" text,
	"provider_metadata" jsonb,
	"confirmed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_amount_positive" CHECK ("payments"."amount_cents" > 0)
);
--> statement-breakpoint
CREATE TABLE "refunds" (
	"id" text PRIMARY KEY NOT NULL,
	"payment_id" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"status" "refund_status" DEFAULT 'PENDING' NOT NULL,
	"reason" text NOT NULL,
	"provider_refund_id" text,
	"confirmed_at" timestamp with time zone,
	"created_by_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "refund_amount_positive" CHECK ("refunds"."amount_cents" > 0)
);
--> statement-breakpoint
CREATE TABLE "role_billing_policies" (
	"id" text PRIMARY KEY NOT NULL,
	"role_id" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"periodicity" "billing_periodicity" NOT NULL,
	"delinquency_criteria" "delinquency_criteria" NOT NULL,
	"delinquency_days_after_due" integer,
	"delinquency_overdue_charges" integer,
	"delinquency_combination" "delinquency_combination",
	"restriction_types" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "role_billing_policies_role_id_unique" UNIQUE("role_id"),
	CONSTRAINT "role_billing_amount_non_negative" CHECK ("role_billing_policies"."amount_cents" >= 0),
	CONSTRAINT "role_billing_thresholds_non_negative" CHECK (("role_billing_policies"."delinquency_days_after_due" is null or "role_billing_policies"."delinquency_days_after_due" >= 0) and ("role_billing_policies"."delinquency_overdue_charges" is null or "role_billing_policies"."delinquency_overdue_charges" >= 0))
);
--> statement-breakpoint
CREATE TABLE "paa_deliveries" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"producer_user_id" text NOT NULL,
	"delivered_at" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paa_delivery_items" (
	"id" text PRIMARY KEY NOT NULL,
	"delivery_id" text NOT NULL,
	"price_table_item_id" text NOT NULL,
	"quantity" integer NOT NULL,
	"calculated_value_cents" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "paa_delivery_quantity_positive" CHECK ("paa_delivery_items"."quantity" > 0),
	CONSTRAINT "paa_delivery_value_non_negative" CHECK ("paa_delivery_items"."calculated_value_cents" >= 0)
);
--> statement-breakpoint
CREATE TABLE "paa_price_table_items" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"product" text NOT NULL,
	"commercialization_form" text NOT NULL,
	"unit" text NOT NULL,
	"price_cents" integer NOT NULL,
	"source_document_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "paa_price_positive" CHECK ("paa_price_table_items"."price_cents" >= 0)
);
--> statement-breakpoint
CREATE TABLE "paa_projects" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"notice_reference" text NOT NULL,
	"status" "paa_project_status" DEFAULT 'ACTIVE' NOT NULL,
	"accepted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provisioning_access" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"status" "provisioning_access_status" DEFAULT 'ACTIVE' NOT NULL,
	"scopes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "board_members" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "membership_roles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "board_members" CASCADE;--> statement-breakpoint
DROP TABLE "membership_roles" CASCADE;--> statement-breakpoint
DROP INDEX "memberships_user_last_selected_index";--> statement-breakpoint
ALTER TABLE "memberships" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "memberships" ALTER COLUMN "status" SET DATA TYPE text USING "status"::text;--> statement-breakpoint
ALTER TABLE "memberships" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'::text;--> statement-breakpoint
DROP TYPE "public"."membership_status";--> statement-breakpoint
CREATE TYPE "public"."membership_status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
ALTER TABLE "memberships" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'::"public"."membership_status";--> statement-breakpoint
ALTER TABLE "memberships" ALTER COLUMN "status" SET DATA TYPE "public"."membership_status" USING "status"::"public"."membership_status";--> statement-breakpoint
CREATE INDEX "memberships_user_last_selected_index" ON "memberships" USING btree ("user_id","last_selected_at" DESC NULLS LAST) WHERE "memberships"."status" = 'ACTIVE';--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "status" SET DATA TYPE text USING "status"::text;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "status" SET DEFAULT 'PROVISIONING'::text;--> statement-breakpoint
DROP TYPE "public"."organization_status";--> statement-breakpoint
CREATE TYPE "public"."organization_status" AS ENUM('PROVISIONING', 'OPERATIONAL', 'INACTIVE');--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "status" SET DEFAULT 'PROVISIONING'::"public"."organization_status";--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "status" SET DATA TYPE "public"."organization_status" USING "status"::"public"."organization_status";--> statement-breakpoint
DROP INDEX "invitations_one_unconsumed_unrevoked_per_membership";--> statement-breakpoint
ALTER TABLE "invitations" ALTER COLUMN "membership_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ALTER COLUMN "channel" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ALTER COLUMN "recipient" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ALTER COLUMN "invited_by_user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "actor_source" "audit_actor_source" NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "type" "invitation_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "status" "invitation_status" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "target_role_id" text;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "cpf" text;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "max_uses" integer;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "uses_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "replaced_by_invitation_id" text;--> statement-breakpoint
ALTER TABLE "memberships" ADD COLUMN "role_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "memberships" ADD COLUMN "deactivated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "memberships" ADD COLUMN "deactivation_reason" text;--> statement-breakpoint
ALTER TABLE "memberships" ADD COLUMN "reactivated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "memberships" ADD COLUMN "delinquent_since" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "roles" ADD COLUMN "is_default_join_role" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "barter_allocations" ADD CONSTRAINT "barter_allocations_barter_operation_id_barter_operations_id_fk" FOREIGN KEY ("barter_operation_id") REFERENCES "public"."barter_operations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barter_allocations" ADD CONSTRAINT "barter_allocations_charge_id_charges_id_fk" FOREIGN KEY ("charge_id") REFERENCES "public"."charges"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barter_operations" ADD CONSTRAINT "barter_operations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barter_operations" ADD CONSTRAINT "barter_operations_membership_id_memberships_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."memberships"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barter_operations" ADD CONSTRAINT "barter_operations_producer_user_id_users_id_fk" FOREIGN KEY ("producer_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barter_operations" ADD CONSTRAINT "barter_operations_confirmed_by_user_id_users_id_fk" FOREIGN KEY ("confirmed_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_configurations" ADD CONSTRAINT "billing_configurations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "charges" ADD CONSTRAINT "charges_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "charges" ADD CONSTRAINT "charges_membership_id_memberships_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."memberships"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "charges" ADD CONSTRAINT "charges_calculated_from_role_id_roles_id_fk" FOREIGN KEY ("calculated_from_role_id") REFERENCES "public"."roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delinquency_exceptions" ADD CONSTRAINT "delinquency_exceptions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delinquency_exceptions" ADD CONSTRAINT "delinquency_exceptions_membership_id_memberships_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."memberships"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delinquency_exceptions" ADD CONSTRAINT "delinquency_exceptions_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forgivenesses" ADD CONSTRAINT "forgivenesses_charge_id_charges_id_fk" FOREIGN KEY ("charge_id") REFERENCES "public"."charges"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forgivenesses" ADD CONSTRAINT "forgivenesses_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_restrictions" ADD CONSTRAINT "membership_restrictions_membership_id_memberships_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."memberships"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_charge_id_charges_id_fk" FOREIGN KEY ("charge_id") REFERENCES "public"."charges"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_membership_id_memberships_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."memberships"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_billing_policies" ADD CONSTRAINT "role_billing_policies_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paa_deliveries" ADD CONSTRAINT "paa_deliveries_project_id_paa_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."paa_projects"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paa_deliveries" ADD CONSTRAINT "paa_deliveries_producer_user_id_users_id_fk" FOREIGN KEY ("producer_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paa_delivery_items" ADD CONSTRAINT "paa_delivery_items_delivery_id_paa_deliveries_id_fk" FOREIGN KEY ("delivery_id") REFERENCES "public"."paa_deliveries"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paa_delivery_items" ADD CONSTRAINT "paa_delivery_items_price_table_item_id_paa_price_table_items_id_fk" FOREIGN KEY ("price_table_item_id") REFERENCES "public"."paa_price_table_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paa_price_table_items" ADD CONSTRAINT "paa_price_table_items_project_id_paa_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."paa_projects"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paa_price_table_items" ADD CONSTRAINT "paa_price_table_items_source_document_id_organization_documents_id_fk" FOREIGN KEY ("source_document_id") REFERENCES "public"."organization_documents"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paa_projects" ADD CONSTRAINT "paa_projects_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provisioning_access" ADD CONSTRAINT "provisioning_access_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provisioning_access" ADD CONSTRAINT "provisioning_access_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "barter_operations_membership_status_index" ON "barter_operations" USING btree ("membership_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "charges_membership_period_unique" ON "charges" USING btree ("membership_id","period_start","period_end");--> statement-breakpoint
CREATE INDEX "charges_membership_due_date_index" ON "charges" USING btree ("membership_id","due_date");--> statement-breakpoint
CREATE UNIQUE INDEX "forgivenesses_charge_component_unique" ON "forgivenesses" USING btree ("charge_id","component");--> statement-breakpoint
CREATE UNIQUE INDEX "membership_restrictions_membership_type_unique" ON "membership_restrictions" USING btree ("membership_id","type");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_allocations_payment_charge_unique" ON "payment_allocations" USING btree ("payment_id","charge_id");--> statement-breakpoint
CREATE INDEX "payments_membership_status_index" ON "payments" USING btree ("membership_id","status");--> statement-breakpoint
CREATE INDEX "paa_deliveries_project_producer_index" ON "paa_deliveries" USING btree ("project_id","producer_user_id");--> statement-breakpoint
CREATE INDEX "paa_delivery_items_delivery_index" ON "paa_delivery_items" USING btree ("delivery_id");--> statement-breakpoint
CREATE INDEX "paa_projects_organization_status_index" ON "paa_projects" USING btree ("organization_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "provisioning_access_one_per_org_user" ON "provisioning_access" USING btree ("organization_id","user_id");--> statement-breakpoint
CREATE INDEX "provisioning_access_user_index" ON "provisioning_access" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_target_role_id_roles_id_fk" FOREIGN KEY ("target_role_id") REFERENCES "public"."roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "invitations_one_pending_individual_per_org_cpf" ON "invitations" USING btree ("organization_id","cpf") WHERE "invitations"."type" = 'INDIVIDUAL' and "invitations"."status" = 'PENDING';--> statement-breakpoint
CREATE INDEX "invitations_organization_status_index" ON "invitations" USING btree ("organization_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "roles_one_default_join_role_per_org" ON "roles" USING btree ("organization_id") WHERE "roles"."is_default_join_role" = true;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_type_binding_consistency" CHECK (("invitations"."type" = 'INDIVIDUAL' and "invitations"."cpf" is not null) or ("invitations"."type" = 'GLOBAL' and "invitations"."cpf" is null));--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_global_usage_limit" CHECK ("invitations"."type" = 'INDIVIDUAL' or "invitations"."max_uses" is null or "invitations"."max_uses" >= 2);--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_usage_non_negative" CHECK ("invitations"."uses_count" >= 0);--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_usage_within_limit" CHECK ("invitations"."max_uses" is null or "invitations"."uses_count" <= "invitations"."max_uses");--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_default_join_role_eligible" CHECK ("roles"."is_default_join_role" = false or ("roles"."status" = 'ACTIVE' and "roles"."is_board_role" = false and "roles"."is_full_access" = false));
