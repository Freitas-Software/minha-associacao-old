CREATE SCHEMA "auth";

--> statement-breakpoint
CREATE TABLE
	"auth"."account" (
		"id" TEXT PRIMARY KEY NOT NULL,
		"account_id" TEXT NOT NULL,
		"provider_id" TEXT NOT NULL,
		"user_id" TEXT NOT NULL,
		"access_token" TEXT,
		"refresh_token" TEXT,
		"id_token" TEXT,
		"access_token_expires_at" TIMESTAMP,
		"refresh_token_expires_at" TIMESTAMP,
		"scope" TEXT,
		"password" TEXT,
		"created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
		"updated_at" TIMESTAMP NOT NULL
	);

--> statement-breakpoint
CREATE TABLE
	"auth"."session" (
		"id" TEXT PRIMARY KEY NOT NULL,
		"expires_at" TIMESTAMP NOT NULL,
		"token" TEXT NOT NULL,
		"created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
		"updated_at" TIMESTAMP NOT NULL,
		"ip_address" TEXT,
		"user_agent" TEXT,
		"user_id" TEXT NOT NULL,
		CONSTRAINT "session_token_unique" UNIQUE ("token")
	);

--> statement-breakpoint
CREATE TABLE
	"auth"."user" (
		"id" TEXT PRIMARY KEY NOT NULL,
		"name" TEXT NOT NULL,
		"email" TEXT NOT NULL,
		"email_verified" BOOLEAN DEFAULT FALSE NOT NULL,
		"image" TEXT,
		"created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
		"updated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
		"username" TEXT,
		"display_username" TEXT,
		CONSTRAINT "user_email_unique" UNIQUE ("email"),
		CONSTRAINT "user_username_unique" UNIQUE ("username")
	);

--> statement-breakpoint
CREATE TABLE
	"auth"."verification" (
		"id" TEXT PRIMARY KEY NOT NULL,
		"identifier" TEXT NOT NULL,
		"value" TEXT NOT NULL,
		"expires_at" TIMESTAMP NOT NULL,
		"created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
		"updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
	);

--> statement-breakpoint
ALTER TABLE "auth"."account"
ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "auth"."session"
ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "users"
ADD CONSTRAINT "users_auth_user_id_user_id_fk" FOREIGN KEY ("auth_user_id") REFERENCES "auth"."user" ("id") ON DELETE SET NULL ON UPDATE NO ACTION;

--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "auth"."account" USING btree ("user_id");

--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "auth"."session" USING btree ("user_id");

--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "auth"."verification" USING btree ("identifier");