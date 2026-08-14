import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_issues_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__issues_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "issues" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"volume" numeric,
  	"issue_number" numeric,
  	"cover_image_id" integer,
  	"pdf_id" integer,
  	"description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_issues_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_issues_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_volume" numeric,
  	"version_issue_number" numeric,
  	"version_cover_image_id" integer,
  	"version_pdf_id" integer,
  	"version_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__issues_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "issues_id" integer;
  ALTER TABLE "issues" ADD CONSTRAINT "issues_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "issues" ADD CONSTRAINT "issues_pdf_id_media_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_issues_v" ADD CONSTRAINT "_issues_v_parent_id_issues_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."issues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_issues_v" ADD CONSTRAINT "_issues_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_issues_v" ADD CONSTRAINT "_issues_v_version_pdf_id_media_id_fk" FOREIGN KEY ("version_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "issues_cover_image_idx" ON "issues" USING btree ("cover_image_id");
  CREATE INDEX "issues_pdf_idx" ON "issues" USING btree ("pdf_id");
  CREATE INDEX "issues_updated_at_idx" ON "issues" USING btree ("updated_at");
  CREATE INDEX "issues_created_at_idx" ON "issues" USING btree ("created_at");
  CREATE INDEX "issues__status_idx" ON "issues" USING btree ("_status");
  CREATE INDEX "_issues_v_parent_idx" ON "_issues_v" USING btree ("parent_id");
  CREATE INDEX "_issues_v_version_version_cover_image_idx" ON "_issues_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_issues_v_version_version_pdf_idx" ON "_issues_v" USING btree ("version_pdf_id");
  CREATE INDEX "_issues_v_version_version_updated_at_idx" ON "_issues_v" USING btree ("version_updated_at");
  CREATE INDEX "_issues_v_version_version_created_at_idx" ON "_issues_v" USING btree ("version_created_at");
  CREATE INDEX "_issues_v_version_version__status_idx" ON "_issues_v" USING btree ("version__status");
  CREATE INDEX "_issues_v_created_at_idx" ON "_issues_v" USING btree ("created_at");
  CREATE INDEX "_issues_v_updated_at_idx" ON "_issues_v" USING btree ("updated_at");
  CREATE INDEX "_issues_v_latest_idx" ON "_issues_v" USING btree ("latest");
  CREATE INDEX "_issues_v_autosave_idx" ON "_issues_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_issues_fk" FOREIGN KEY ("issues_id") REFERENCES "public"."issues"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_issues_id_idx" ON "payload_locked_documents_rels" USING btree ("issues_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "issues" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_issues_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "issues" CASCADE;
  DROP TABLE "_issues_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_issues_fk";
  
  DROP INDEX "payload_locked_documents_rels_issues_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "issues_id";
  DROP TYPE "public"."enum_issues_status";
  DROP TYPE "public"."enum__issues_v_version_status";`)
}
