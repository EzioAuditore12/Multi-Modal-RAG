ALTER TABLE "project_settings" ALTER COLUMN "embedding_model" SET DEFAULT 'gemini-embedding-001';--> statement-breakpoint
ALTER TABLE "project_settings" ALTER COLUMN "embedding_model" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_settings" ALTER COLUMN "rag_stratergy" SET DEFAULT 'basic'::"rag_strategy";--> statement-breakpoint
ALTER TABLE "project_settings" ALTER COLUMN "rag_stratergy" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_settings" ALTER COLUMN "reranking_model" SET DEFAULT 'not defined';--> statement-breakpoint
ALTER TABLE "project_settings" ALTER COLUMN "reranking_model" SET NOT NULL;