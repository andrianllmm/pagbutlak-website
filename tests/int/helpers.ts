import type { Payload } from 'payload'

type Role = 'admin' | 'editor' | 'writer'

// Seeds an admin so the users collection isn't empty
// (which would make the next created user the "first" user and force it to admin).
// Must be awaited before any other user create.
// forceFirstUserAdmin promotes whichever create sees an empty collection,
// so running this concurrently with other creates is a race that can promote more than one to admin.
export const seedAdmin = (payload: Payload, email: string) =>
  payload.create({
    collection: 'users',
    data: {
      name: 'Seed Admin',
      email,
      password: 'a-real-password-123',
      role: 'admin',
    },
    overrideAccess: true,
  })

export const createTestUser = (
  payload: Payload,
  { name, email, role }: { name: string; email: string; role: Role },
) =>
  payload.create({
    collection: 'users',
    data: { name, email, password: 'xK9!mQ2wZv#Lp7Fj', role },
    overrideAccess: true,
  })

export const createTestAuthor = (
  payload: Payload,
  { name, slug }: { name: string; slug: string },
) =>
  payload.create({
    collection: 'authors',
    data: { name, role: 'Writer', slug } as never,
    context: { disableRevalidate: true },
  })
