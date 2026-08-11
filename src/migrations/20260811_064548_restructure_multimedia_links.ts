import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "multimedia_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "_multimedia_v_version_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "multimedia_links" ADD CONSTRAINT "multimedia_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."multimedia"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_multimedia_v_version_links" ADD CONSTRAINT "_multimedia_v_version_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_multimedia_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "multimedia_links_order_idx" ON "multimedia_links" USING btree ("_order");
  CREATE INDEX "multimedia_links_parent_id_idx" ON "multimedia_links" USING btree ("_parent_id");
  CREATE INDEX "_multimedia_v_version_links_order_idx" ON "_multimedia_v_version_links" USING btree ("_order");
  CREATE INDEX "_multimedia_v_version_links_parent_id_idx" ON "_multimedia_v_version_links" USING btree ("_parent_id");
  ALTER TABLE "multimedia" DROP COLUMN "platform";
  ALTER TABLE "multimedia" DROP COLUMN "url";
  ALTER TABLE "_multimedia_v" DROP COLUMN "version_platform";
  ALTER TABLE "_multimedia_v" DROP COLUMN "version_url";
  DROP TYPE "public"."enum_multimedia_platform";
  DROP TYPE "public"."enum__multimedia_v_version_platform";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_multimedia_platform" AS ENUM('youtube', 'facebook', 'tiktok');
  CREATE TYPE "public"."enum__multimedia_v_version_platform" AS ENUM('youtube', 'facebook', 'tiktok');
  DROP TABLE "multimedia_links" CASCADE;
  DROP TABLE "_multimedia_v_version_links" CASCADE;
  ALTER TABLE "multimedia" ADD COLUMN "platform" "enum_multimedia_platform";
  ALTER TABLE "multimedia" ADD COLUMN "url" varchar;
  ALTER TABLE "_multimedia_v" ADD COLUMN "version_platform" "enum__multimedia_v_version_platform";
  ALTER TABLE "_multimedia_v" ADD COLUMN "version_url" varchar;`)
}
