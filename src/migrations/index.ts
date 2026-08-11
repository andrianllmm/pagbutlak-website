import * as migration_20260316_141145_initial from './20260316_141145_initial'
import * as migration_20260316_141257_rename_posts_to_articles from './20260316_141257_rename_posts_to_articles'
import * as migration_20260317_131609_add_article_section_field from './20260317_131609_add_article_section_field'
import * as migration_20260715_024628_add_authors from './20260715_024628_add_authors'
import * as migration_20260723_051537_add_search_published_at_and_reading_time_fields from './20260723_051537_add_search_published_at_and_reading_time_fields'
import * as migration_20260723_120033_add_articles_reading_time_field from './20260723_120033_add_articles_reading_time_field'
import * as migration_20260804_062947_add_media_prefix_field from './20260804_062947_add_media_prefix_field'
import * as migration_20260807_043333_rework_footer_nav_groups from './20260807_043333_rework_footer_nav_groups'
import * as migration_20260810_184715_add_multimedia_collection from './20260810_184715_add_multimedia_collection'

export const migrations = [
  {
    up: migration_20260316_141145_initial.up,
    down: migration_20260316_141145_initial.down,
    name: '20260316_141145_initial',
  },
  {
    up: migration_20260316_141257_rename_posts_to_articles.up,
    down: migration_20260316_141257_rename_posts_to_articles.down,
    name: '20260316_141257_rename_posts_to_articles',
  },
  {
    up: migration_20260317_131609_add_article_section_field.up,
    down: migration_20260317_131609_add_article_section_field.down,
    name: '20260317_131609_add_article_section_field',
  },
  {
    up: migration_20260715_024628_add_authors.up,
    down: migration_20260715_024628_add_authors.down,
    name: '20260715_024628_add_authors',
  },
  {
    up: migration_20260723_051537_add_search_published_at_and_reading_time_fields.up,
    down: migration_20260723_051537_add_search_published_at_and_reading_time_fields.down,
    name: '20260723_051537_add_search_published_at_and_reading_time_fields',
  },
  {
    up: migration_20260723_120033_add_articles_reading_time_field.up,
    down: migration_20260723_120033_add_articles_reading_time_field.down,
    name: '20260723_120033_add_articles_reading_time_field',
  },
  {
    up: migration_20260804_062947_add_media_prefix_field.up,
    down: migration_20260804_062947_add_media_prefix_field.down,
    name: '20260804_062947_add_media_prefix_field',
  },
  {
    up: migration_20260807_043333_rework_footer_nav_groups.up,
    down: migration_20260807_043333_rework_footer_nav_groups.down,
    name: '20260807_043333_rework_footer_nav_groups',
  },
  {
    up: migration_20260810_184715_add_multimedia_collection.up,
    down: migration_20260810_184715_add_multimedia_collection.down,
    name: '20260810_184715_add_multimedia_collection',
  },
]
