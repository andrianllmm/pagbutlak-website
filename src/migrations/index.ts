import * as migration_20260316_141145_initial from './20260316_141145_initial'

export const migrations = [
  {
    up: migration_20260316_141145_initial.up,
    down: migration_20260316_141145_initial.down,
    name: '20260316_141145_initial',
  },
]
