import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_multimedia_platform" AS ENUM('youtube', 'facebook', 'tiktok');
  CREATE TYPE "public"."enum_multimedia_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__multimedia_v_version_platform" AS ENUM('youtube', 'facebook', 'tiktok');
  CREATE TYPE "public"."enum__multimedia_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "multimedia" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"platform" "enum_multimedia_platform",
  	"url" varchar,
  	"thumbnail_id" integer,
  	"auto_thumbnail_url" varchar,
  	"caption" varchar,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_multimedia_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_multimedia_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_platform" "enum__multimedia_v_version_platform",
  	"version_url" varchar,
  	"version_thumbnail_id" integer,
  	"version_auto_thumbnail_url" varchar,
  	"version_caption" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__multimedia_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "multimedia_id" integer;
  ALTER TABLE "multimedia" ADD CONSTRAINT "multimedia_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_multimedia_v" ADD CONSTRAINT "_multimedia_v_parent_id_multimedia_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."multimedia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_multimedia_v" ADD CONSTRAINT "_multimedia_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "multimedia_thumbnail_idx" ON "multimedia" USING btree ("thumbnail_id");
  CREATE UNIQUE INDEX "multimedia_slug_idx" ON "multimedia" USING btree ("slug");
  CREATE INDEX "multimedia_updated_at_idx" ON "multimedia" USING btree ("updated_at");
  CREATE INDEX "multimedia_created_at_idx" ON "multimedia" USING btree ("created_at");
  CREATE INDEX "multimedia__status_idx" ON "multimedia" USING btree ("_status");
  CREATE INDEX "_multimedia_v_parent_idx" ON "_multimedia_v" USING btree ("parent_id");
  CREATE INDEX "_multimedia_v_version_version_thumbnail_idx" ON "_multimedia_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_multimedia_v_version_version_slug_idx" ON "_multimedia_v" USING btree ("version_slug");
  CREATE INDEX "_multimedia_v_version_version_updated_at_idx" ON "_multimedia_v" USING btree ("version_updated_at");
  CREATE INDEX "_multimedia_v_version_version_created_at_idx" ON "_multimedia_v" USING btree ("version_created_at");
  CREATE INDEX "_multimedia_v_version_version__status_idx" ON "_multimedia_v" USING btree ("version__status");
  CREATE INDEX "_multimedia_v_created_at_idx" ON "_multimedia_v" USING btree ("created_at");
  CREATE INDEX "_multimedia_v_updated_at_idx" ON "_multimedia_v" USING btree ("updated_at");
  CREATE INDEX "_multimedia_v_latest_idx" ON "_multimedia_v" USING btree ("latest");
  CREATE INDEX "_multimedia_v_autosave_idx" ON "_multimedia_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_multimedia_fk" FOREIGN KEY ("multimedia_id") REFERENCES "public"."multimedia"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_multimedia_id_idx" ON "payload_locked_documents_rels" USING btree ("multimedia_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "multimedia" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_multimedia_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "multimedia" CASCADE;
  DROP TABLE "_multimedia_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_multimedia_fk";
  
  DROP INDEX "payload_locked_documents_rels_multimedia_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "multimedia_id";
  DROP TYPE "public"."enum_multimedia_platform";
  DROP TYPE "public"."enum_multimedia_status";
  DROP TYPE "public"."enum__multimedia_v_version_platform";
  DROP TYPE "public"."enum__multimedia_v_version_status";`)
}
