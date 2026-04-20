ALTER TABLE "project" ALTER COLUMN "name" SET DATA TYPE varchar(30) USING "name"::varchar(30);--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_name_key" UNIQUE("name");