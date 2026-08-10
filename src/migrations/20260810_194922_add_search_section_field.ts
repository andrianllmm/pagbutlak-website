import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_search_section" AS ENUM('news', 'opinion', 'feature', 'kultura');
  ALTER TABLE "search" ADD COLUMN "section" "enum_search_section";
  CREATE INDEX "search_section_idx" ON "search" USING btree ("section");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "search_section_idx";
  ALTER TABLE "search" DROP COLUMN "section";
  DROP TYPE "public"."enum_search_section";`)
}
