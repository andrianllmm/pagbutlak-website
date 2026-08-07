import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { about } from './about'
import { contact } from './contact'
import { contactForm } from './contact-form'
import { terms } from './terms'
import { privacy } from './privacy'
import { image1 } from './image'
import { generateSeedArticles } from './articles'
import path from 'path'
import fs from 'fs'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'articles',
  'authors',
  'forms',
  'form-submissions',
  'search',
]

const globals: GlobalSlug[] = ['header', 'footer']

const categories = ['Technology', 'News', 'Finance', 'Design', 'Software', 'Engineering']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: {},
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  )

  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        in: ['demo-author@example.com', 'demo-user@example.com'],
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const image = loadLocalFile('image.jpg')

  const [, imageDoc] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo User',
        email: 'demo-user@example.com',
        password: 'demo-password',
      },
    }),
    payload.create({
      collection: 'media',
      data: image1,
      file: image,
    }),
    categories.map((category) =>
      payload.create({
        collection: 'categories',
        data: {
          title: category,
          slug: category,
        },
      }),
    ),
  ])

  payload.logger.info(`— Seeding authors...`)

  const authors = await Promise.all(
    [
      { name: 'Juan Dela Cruz', role: 'Editor-in-Chief' },
      { name: 'Maria Santos', role: 'Staff Writer' },
      { name: 'Ana Reyes', role: 'Staff Writer' },
      { name: 'Mark Villanueva', role: 'Contributing Writer' },
      { name: 'Liza Fernandez', role: 'Staff Writer' },
    ].map(({ name, role }) =>
      payload.create({
        collection: 'authors',
        data: {
          name,
          role,
          avatar: imageDoc.id,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
        },
      }),
    ),
  )

  payload.logger.info(`— Seeding articles...`)

  // Do not create articles with `Promise.all` because we want the articles to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  for (const articleData of generateSeedArticles({ heroImage: imageDoc, authors })) {
    await payload.create({
      collection: 'articles',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: articleData,
    })
  }

  payload.logger.info(`— Seeding forms...`)

  const contactFormDoc = await payload.create({
    collection: 'forms',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: contactForm(),
  })

  payload.logger.info(`— Seeding pages...`)

  await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: about({ metaImage: imageDoc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: contact({ form: contactFormDoc, metaImage: imageDoc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: terms({ metaImage: imageDoc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: privacy({ metaImage: imageDoc }),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      context: {
        disableRevalidate: true,
      },
      data: {
        navItems: [],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      context: {
        disableRevalidate: true,
      },
      data: {
        description:
          'The official student and community publication of UP Visayas College of Arts and Sciences.',
        socialLinks: {
          facebook: 'https://facebook.com/pagbutlakupv',
          x: 'https://x.com/pagbutlakupv',
          instagram: 'https://instagram.com/pagbutlakupv',
          youtube: 'https://youtube.com/@pagbutlakupv',
        },
        navGroups: [
          {
            title: 'Sections',
            navItems: [
              { link: { type: 'custom', label: 'News', url: '/news' } },
              { link: { type: 'custom', label: 'Opinion', url: '/opinion' } },
              { link: { type: 'custom', label: 'Features', url: '/features' } },
              { link: { type: 'custom', label: 'Kultura', url: '/kultura' } },
            ],
          },
          {
            title: 'Company',
            navItems: [
              { link: { type: 'custom', label: 'About', url: '/about' } },
              { link: { type: 'custom', label: 'Contact', url: '/contact' } },
              { link: { type: 'custom', label: 'Admin', url: '/admin' } },
              {
                link: {
                  type: 'custom',
                  label: 'Source Code',
                  newTab: true,
                  url: 'https://github.com/pagbutlakupv/website',
                },
              },
            ],
          },
          {
            title: 'Legal',
            navItems: [
              { link: { type: 'custom', label: 'Terms of Use', url: '/terms' } },
              { link: { type: 'custom', label: 'Privacy Policy', url: '/privacy' } },
            ],
          },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

function loadLocalFile(fileName: string): File {
  const seedDir = path.join(process.cwd(), 'src', 'endpoints', 'seed')
  const filePath = path.join(seedDir, fileName)
  const data = fs.readFileSync(filePath)
  const ext = fileName.split('.').pop()
  const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`

  return {
    name: `${Date.now()}-${fileName}`,
    data,
    mimetype: mime,
    size: data.byteLength,
  }
}
