import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "multimedia_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "_multimedia_v_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "multimedia_rels" ADD CONSTRAINT "multimedia_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_multimedia_v_rels" ADD CONSTRAINT "_multimedia_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "multimedia_rels_categories_id_idx" ON "multimedia_rels" USING btree ("categories_id");
  CREATE INDEX "_multimedia_v_rels_categories_id_idx" ON "_multimedia_v_rels" USING btree ("categories_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "multimedia_rels" DROP CONSTRAINT "multimedia_rels_categories_fk";
  
  ALTER TABLE "_multimedia_v_rels" DROP CONSTRAINT "_multimedia_v_rels_categories_fk";
  
  DROP INDEX "multimedia_rels_categories_id_idx";
  DROP INDEX "_multimedia_v_rels_categories_id_idx";
  ALTER TABLE "multimedia_rels" DROP COLUMN "categories_id";
  ALTER TABLE "_multimedia_v_rels" DROP COLUMN "categories_id";`)
}
