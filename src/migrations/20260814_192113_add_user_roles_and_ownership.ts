import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'writer');
  ALTER TABLE "pages" ADD COLUMN "created_by_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_created_by_id" integer;
  ALTER TABLE "articles" ADD COLUMN "created_by_id" integer;
  ALTER TABLE "_articles_v" ADD COLUMN "version_created_by_id" integer;
  ALTER TABLE "multimedia" ADD COLUMN "created_by_id" integer;
  ALTER TABLE "_multimedia_v" ADD COLUMN "version_created_by_id" integer;
  ALTER TABLE "issues" ADD COLUMN "created_by_id" integer;
  ALTER TABLE "_issues_v" ADD COLUMN "version_created_by_id" integer;
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'writer' NOT NULL;
  ALTER TABLE "users" ADD COLUMN "author_id" integer;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "multimedia" ADD CONSTRAINT "multimedia_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_multimedia_v" ADD CONSTRAINT "_multimedia_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "issues" ADD CONSTRAINT "issues_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_issues_v" ADD CONSTRAINT "_issues_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_created_by_idx" ON "pages" USING btree ("created_by_id");
  CREATE INDEX "_pages_v_version_version_created_by_idx" ON "_pages_v" USING btree ("version_created_by_id");
  CREATE INDEX "articles_created_by_idx" ON "articles" USING btree ("created_by_id");
  CREATE INDEX "_articles_v_version_version_created_by_idx" ON "_articles_v" USING btree ("version_created_by_id");
  CREATE INDEX "multimedia_created_by_idx" ON "multimedia" USING btree ("created_by_id");
  CREATE INDEX "_multimedia_v_version_version_created_by_idx" ON "_multimedia_v" USING btree ("version_created_by_id");
  CREATE INDEX "issues_created_by_idx" ON "issues" USING btree ("created_by_id");
  CREATE INDEX "_issues_v_version_version_created_by_idx" ON "_issues_v" USING btree ("version_created_by_id");
  CREATE INDEX "users_author_idx" ON "users" USING btree ("author_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP CONSTRAINT "pages_created_by_id_users_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_created_by_id_users_id_fk";
  
  ALTER TABLE "articles" DROP CONSTRAINT "articles_created_by_id_users_id_fk";
  
  ALTER TABLE "_articles_v" DROP CONSTRAINT "_articles_v_version_created_by_id_users_id_fk";
  
  ALTER TABLE "multimedia" DROP CONSTRAINT "multimedia_created_by_id_users_id_fk";
  
  ALTER TABLE "_multimedia_v" DROP CONSTRAINT "_multimedia_v_version_created_by_id_users_id_fk";
  
  ALTER TABLE "issues" DROP CONSTRAINT "issues_created_by_id_users_id_fk";
  
  ALTER TABLE "_issues_v" DROP CONSTRAINT "_issues_v_version_created_by_id_users_id_fk";
  
  ALTER TABLE "users" DROP CONSTRAINT "users_author_id_authors_id_fk";
  
  DROP INDEX "pages_created_by_idx";
  DROP INDEX "_pages_v_version_version_created_by_idx";
  DROP INDEX "articles_created_by_idx";
  DROP INDEX "_articles_v_version_version_created_by_idx";
  DROP INDEX "multimedia_created_by_idx";
  DROP INDEX "_multimedia_v_version_version_created_by_idx";
  DROP INDEX "issues_created_by_idx";
  DROP INDEX "_issues_v_version_version_created_by_idx";
  DROP INDEX "users_author_idx";
  ALTER TABLE "pages" DROP COLUMN "created_by_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_created_by_id";
  ALTER TABLE "articles" DROP COLUMN "created_by_id";
  ALTER TABLE "_articles_v" DROP COLUMN "version_created_by_id";
  ALTER TABLE "multimedia" DROP COLUMN "created_by_id";
  ALTER TABLE "_multimedia_v" DROP COLUMN "version_created_by_id";
  ALTER TABLE "issues" DROP COLUMN "created_by_id";
  ALTER TABLE "_issues_v" DROP COLUMN "version_created_by_id";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "users" DROP COLUMN "author_id";
  DROP TYPE "public"."enum_users_role";`)
}
