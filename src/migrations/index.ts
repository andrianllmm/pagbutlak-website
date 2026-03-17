import * as migration_20260316_141145_initial from './20260316_141145_initial'
import * as migration_20260316_141257_rename_posts_to_articles from './20260316_141257_rename_posts_to_articles'

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
]
