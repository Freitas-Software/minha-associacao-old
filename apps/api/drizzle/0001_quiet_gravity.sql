ALTER TYPE "public"."stored_file_status"
ADD VALUE 'PENDING' BEFORE 'READY';

--> statement-breakpoint
ALTER TABLE "users"
RENAME COLUMN "cpf" TO "document_number";

--> statement-breakpoint
ALTER TABLE "users"
DROP CONSTRAINT "users_cpf_unique";

--> statement-breakpoint
ALTER TABLE "users"
ADD CONSTRAINT "users_document_number_unique" UNIQUE ("document_number");