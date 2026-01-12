CREATE TABLE "blacklisted_refresh_token" (
	"id" serial PRIMARY KEY NOT NULL,
	"refreshToken" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"expiredAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"email" varchar(240) NOT NULL,
	"password" text NOT NULL,
	"avatar" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
