CREATE TYPE "message_type" AS ENUM('human', 'ai');--> statement-breakpoint
CREATE TYPE "rag_strategy" AS ENUM('basic', 'hybrid', 'multi-query-vector', 'multi-query-hybrid');--> statement-breakpoint
CREATE TABLE "blacklist_refresh_token" (
	"id" serial PRIMARY KEY,
	"refresh_token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"expired_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat" (
	"id" bigint PRIMARY KEY,
	"project_id" uuid NOT NULL,
	"title" varchar(100) NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" bigint PRIMARY KEY,
	"chat_id" bigint NOT NULL,
	"type" "message_type" NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_file_embedding" (
	"id" bigint PRIMARY KEY,
	"embedding" vector(1536) NOT NULL,
	"content" text NOT NULL,
	"meta_data" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_file" (
	"id" bigint PRIMARY KEY,
	"project_id" uuid NOT NULL,
	"url" text NOT NULL,
	"filename" varchar(255),
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_settings" (
	"id" uuid PRIMARY KEY,
	"embedding_model" varchar(100) NOT NULL,
	"rag_stratergy" "rag_strategy" NOT NULL,
	"reranking_model" varchar(100),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"name" varchar(60) NOT NULL,
	"description" varchar(240),
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(50) NOT NULL,
	"email" varchar(240) NOT NULL UNIQUE,
	"password" text NOT NULL,
	"avatar" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX "chat_project_id_idx" ON "chat" ("project_id");--> statement-breakpoint
CREATE INDEX "message_chat_id_idx" ON "message" ("chat_id");--> statement-breakpoint
CREATE INDEX "embedding_index" ON "project_file_embedding" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "project_user_id_idx" ON "project" ("user_id");--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_project_id_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_chat_id_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "project_file_embedding" ADD CONSTRAINT "project_file_embedding_id_project_file_id_fkey" FOREIGN KEY ("id") REFERENCES "project_file"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "project_file" ADD CONSTRAINT "project_file_project_id_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "project_settings" ADD CONSTRAINT "project_settings_id_project_id_fkey" FOREIGN KEY ("id") REFERENCES "project"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;