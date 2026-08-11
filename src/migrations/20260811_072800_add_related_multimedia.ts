import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "multimedia_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"multimedia_id" integer
  );
  
  CREATE TABLE "_multimedia_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"multimedia_id" integer
  );
  
  ALTER TABLE "multimedia_rels" ADD CONSTRAINT "multimedia_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."multimedia"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "multimedia_rels" ADD CONSTRAINT "multimedia_rels_multimedia_fk" FOREIGN KEY ("multimedia_id") REFERENCES "public"."multimedia"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_multimedia_v_rels" ADD CONSTRAINT "_multimedia_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_multimedia_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_multimedia_v_rels" ADD CONSTRAINT "_multimedia_v_rels_multimedia_fk" FOREIGN KEY ("multimedia_id") REFERENCES "public"."multimedia"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "multimedia_rels_order_idx" ON "multimedia_rels" USING btree ("order");
  CREATE INDEX "multimedia_rels_parent_idx" ON "multimedia_rels" USING btree ("parent_id");
  CREATE INDEX "multimedia_rels_path_idx" ON "multimedia_rels" USING btree ("path");
  CREATE INDEX "multimedia_rels_multimedia_id_idx" ON "multimedia_rels" USING btree ("multimedia_id");
  CREATE INDEX "_multimedia_v_rels_order_idx" ON "_multimedia_v_rels" USING btree ("order");
  CREATE INDEX "_multimedia_v_rels_parent_idx" ON "_multimedia_v_rels" USING btree ("parent_id");
  CREATE INDEX "_multimedia_v_rels_path_idx" ON "_multimedia_v_rels" USING btree ("path");
  CREATE INDEX "_multimedia_v_rels_multimedia_id_idx" ON "_multimedia_v_rels" USING btree ("multimedia_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "multimedia_rels" CASCADE;
  DROP TABLE "_multimedia_v_rels" CASCADE;`)
}
