import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { seed } from '@/endpoints/seed'

const run = async (): Promise<void> => {
  console.log('Connecting to database...')

  const payload = await getPayload({ config })

  console.log('Payload initialized. Querying users...')

  const { docs: users } = await payload.find({
    collection: 'users',
    limit: 1,
  })

  console.log(`Found ${users.length} user(s).`)

  const user = users[0]

  if (!user) {
    console.error('No user found to seed as. Create an admin user first.')
    await payload.destroy()
    process.exit(1)
  }

  const req = await createLocalReq({ user }, payload)

  await seed({ payload, req })

  console.log('Seed complete.')

  await payload.destroy()
  process.exit(0)
}

await run().catch((err) => {
  console.error('Seed script failed:')
  console.error(err)
  process.exit(1)
})
