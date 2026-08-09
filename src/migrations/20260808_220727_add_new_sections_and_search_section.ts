import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_search_section" AS ENUM('news', 'opinion', 'feature', 'kultura', 'sports', 'multimedia', 'issues');
  ALTER TYPE "public"."enum_articles_section" ADD VALUE 'sports';
  ALTER TYPE "public"."enum_articles_section" ADD VALUE 'multimedia';
  ALTER TYPE "public"."enum_articles_section" ADD VALUE 'issues';
  ALTER TYPE "public"."enum__articles_v_version_section" ADD VALUE 'sports';
  ALTER TYPE "public"."enum__articles_v_version_section" ADD VALUE 'multimedia';
  ALTER TYPE "public"."enum__articles_v_version_section" ADD VALUE 'issues';
  ALTER TABLE "search" ADD COLUMN "section" "enum_search_section";
  CREATE INDEX "search_section_idx" ON "search" USING btree ("section");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" ALTER COLUMN "section" SET DATA TYPE text;
  DROP TYPE "public"."enum_articles_section";
  CREATE TYPE "public"."enum_articles_section" AS ENUM('news', 'opinion', 'feature', 'kultura');
  ALTER TABLE "articles" ALTER COLUMN "section" SET DATA TYPE "public"."enum_articles_section" USING "section"::"public"."enum_articles_section";
  ALTER TABLE "_articles_v" ALTER COLUMN "version_section" SET DATA TYPE text;
  DROP TYPE "public"."enum__articles_v_version_section";
  CREATE TYPE "public"."enum__articles_v_version_section" AS ENUM('news', 'opinion', 'feature', 'kultura');
  ALTER TABLE "_articles_v" ALTER COLUMN "version_section" SET DATA TYPE "public"."enum__articles_v_version_section" USING "version_section"::"public"."enum__articles_v_version_section";
  DROP INDEX "search_section_idx";
  ALTER TABLE "search" DROP COLUMN "section";
  DROP TYPE "public"."enum_search_section";`)
}
