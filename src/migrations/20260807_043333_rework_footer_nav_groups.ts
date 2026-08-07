import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_footer_nav_groups_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "footer_nav_groups_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_nav_groups_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer_nav_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  DROP TABLE "footer_nav_items" CASCADE;
  ALTER TABLE "footer" ADD COLUMN "description" varchar;
  ALTER TABLE "footer" ADD COLUMN "social_links_facebook" varchar;
  ALTER TABLE "footer" ADD COLUMN "social_links_x" varchar;
  ALTER TABLE "footer" ADD COLUMN "social_links_instagram" varchar;
  ALTER TABLE "footer" ADD COLUMN "social_links_youtube" varchar;
  ALTER TABLE "footer_nav_groups_nav_items" ADD CONSTRAINT "footer_nav_groups_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_nav_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_groups" ADD CONSTRAINT "footer_nav_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "footer_nav_groups_nav_items_order_idx" ON "footer_nav_groups_nav_items" USING btree ("_order");
  CREATE INDEX "footer_nav_groups_nav_items_parent_id_idx" ON "footer_nav_groups_nav_items" USING btree ("_parent_id");
  CREATE INDEX "footer_nav_groups_order_idx" ON "footer_nav_groups" USING btree ("_order");
  CREATE INDEX "footer_nav_groups_parent_id_idx" ON "footer_nav_groups" USING btree ("_parent_id");
  DROP TYPE "public"."enum_footer_nav_items_link_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_footer_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "footer_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  DROP TABLE "footer_nav_groups_nav_items" CASCADE;
  DROP TABLE "footer_nav_groups" CASCADE;
  ALTER TABLE "footer_nav_items" ADD CONSTRAINT "footer_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "footer_nav_items_order_idx" ON "footer_nav_items" USING btree ("_order");
  CREATE INDEX "footer_nav_items_parent_id_idx" ON "footer_nav_items" USING btree ("_parent_id");
  ALTER TABLE "footer" DROP COLUMN "description";
  ALTER TABLE "footer" DROP COLUMN "social_links_facebook";
  ALTER TABLE "footer" DROP COLUMN "social_links_x";
  ALTER TABLE "footer" DROP COLUMN "social_links_instagram";
  ALTER TABLE "footer" DROP COLUMN "social_links_youtube";
  DROP TYPE "public"."enum_footer_nav_groups_nav_items_link_type";`)
}
