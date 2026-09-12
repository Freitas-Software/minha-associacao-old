CREATE TABLE "billing_configuration_restrictions" (
	"billing_configuration_id" text NOT NULL,
	"type" "restriction_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_billing_policy_restrictions" (
	"role_billing_policy_id" text NOT NULL,
	"type" "restriction_type" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "billing_configuration_restrictions" ADD CONSTRAINT "billing_configuration_restrictions_billing_configuration_id_billing_configurations_id_fk" FOREIGN KEY ("billing_configuration_id") REFERENCES "public"."billing_configurations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_billing_policy_restrictions" ADD CONSTRAINT "role_billing_policy_restrictions_role_billing_policy_id_role_billing_policies_id_fk" FOREIGN KEY ("role_billing_policy_id") REFERENCES "public"."role_billing_policies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "billing_configuration_restriction_unique" ON "billing_configuration_restrictions" USING btree ("billing_configuration_id","type");--> statement-breakpoint
CREATE UNIQUE INDEX "role_billing_policy_restriction_unique" ON "role_billing_policy_restrictions" USING btree ("role_billing_policy_id","type");--> statement-breakpoint
ALTER TABLE "billing_configurations" DROP COLUMN "restriction_types";--> statement-breakpoint
ALTER TABLE "role_billing_policies" DROP COLUMN "restriction_types";