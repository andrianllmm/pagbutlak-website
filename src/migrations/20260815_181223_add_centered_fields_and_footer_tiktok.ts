import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_content" ADD COLUMN "centered" boolean DEFAULT false;
  ALTER TABLE "pages" ADD COLUMN "hero_centered" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "centered" boolean DEFAULT false;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_centered" boolean DEFAULT false;
  ALTER TABLE "footer" ADD COLUMN "social_links_tiktok" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_content" DROP COLUMN "centered";
  ALTER TABLE "pages" DROP COLUMN "hero_centered";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "centered";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_centered";
  ALTER TABLE "footer" DROP COLUMN "social_links_tiktok";`)
}
