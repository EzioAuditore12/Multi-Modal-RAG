CREATE TABLE "article_chat" (
	"id" bigint PRIMARY KEY NOT NULL,
	"article_id" bigint NOT NULL,
	"resulting_version_id" bigint,
	"role" varchar(20) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article" (
	"id" bigint PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255),
	"current_content" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_version" (
	"id" bigint PRIMARY KEY NOT NULL,
	"article_id" bigint NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "article_chat" ADD CONSTRAINT "chat_article_fk" FOREIGN KEY ("article_id") REFERENCES "public"."article"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_chat" ADD CONSTRAINT "chat_version_fk" FOREIGN KEY ("resulting_version_id") REFERENCES "public"."article_version"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article" ADD CONSTRAINT "article_user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_version" ADD CONSTRAINT "version_article_fk" FOREIGN KEY ("article_id") REFERENCES "public"."article"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_article_id_idx" ON "article_chat" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "article_user_id_idx" ON "article" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "version_article_id_idx" ON "article_version" USING btree ("article_id");