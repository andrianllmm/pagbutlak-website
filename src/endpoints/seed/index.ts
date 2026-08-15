import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'
import type { Category } from '@/payload-types'

import { about } from './about'
import { contact } from './contact'
import { contactForm } from './contact-form'
import { terms } from './terms'
import { privacy } from './privacy'
import { image1 } from './image'
import { generateSeedArticles } from './articles'
import { generateSeedMultimedia, MULTIMEDIA_RELATED } from './multimedia'
import { ISSUES, fetchAsPayloadFile } from './issues'
import path from 'path'
import fs from 'fs'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'articles',
  'authors',
  'multimedia',
  'issues',
  'forms',
  'form-submissions',
  'search',
]

const globals: GlobalSlug[] = ['header', 'footer']

const categories: { title: string; children?: string[] }[] = [
  {
    title: 'UPV',
    children: [
      'UPV Administration',
      'UPV Student Government',
      'Student Affairs',
      'Academics',
      'Research',
      'Campus Development',
    ],
  },
  {
    title: 'UP System',
    children: [
      'UP System Student Government',
      'Student Regent',
      'Student Councils',
      'General Assembly of Student Councils',
    ],
  },
  {
    title: 'Education',
    children: ['Higher Education', 'Academic Policies', 'Student Welfare'],
  },
  {
    title: 'Politics & Governance',
    children: ['Elections', 'National Politics', 'Local Politics', 'Student Politics'],
  },
  {
    title: 'Society',
    children: ['Human Rights', 'Labor', 'Social Movements', 'Gender'],
  },
  {
    title: 'Environment',
    children: ['Climate Change', 'Sustainability', 'Disaster & Resilience'],
  },
  {
    title: 'Transportation',
    children: ['Public Transportation', 'Campus Transportation'],
  },
  {
    title: 'Culture',
    children: ['Arts', 'Literature', 'Music', 'Heritage'],
  },
]

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

  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
  }

  for (const collection of collections) {
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  payload.logger.info(`— Seeding demo author and users...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        in: [
          'demo-author@example.com',
          'demo-user@example.com',
          'demo-admin@example.com',
          'demo-editor@example.com',
          'demo-writer@example.com',
        ],
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const image = loadLocalFile('image.jpg')

  const [adminUser, editorUser, writerUser, imageDoc] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Admin',
        email: 'demo-admin@example.com',
        password: 'Pagbutlak-Demo-2026!',
        role: 'admin',
      },
    }),
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Editor',
        email: 'demo-editor@example.com',
        password: 'Pagbutlak-Demo-2026!',
        role: 'editor',
      },
    }),
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Writer',
        email: 'demo-writer@example.com',
        password: 'Pagbutlak-Demo-2026!',
        role: 'writer',
      },
    }),
    payload.create({
      collection: 'media',
      data: image1,
      file: image,
    }),
  ])

  const categoryDocs: Category[] = []

  for (const { title, children } of categories) {
    const parent = await payload.create({
      collection: 'categories',
      data: {
        title,
        slug: title,
      },
    })

    if (children) {
      categoryDocs.push(
        ...(await Promise.all(
          children.map((child) =>
            payload.create({
              collection: 'categories',
              data: {
                title: child,
                slug: child,
                parent: parent.id,
              },
            }),
          ),
        )),
      )
    }
  }

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

  await payload.update({
    collection: 'users',
    id: writerUser.id,
    depth: 0,
    data: {
      author: authors[1].id,
    },
  })

  payload.logger.info(`— Seeding articles...`)

  // Do not create articles with `Promise.all` because we want the articles to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  for (const articleData of generateSeedArticles({
    heroImage: imageDoc,
    authors,
    categories: categoryDocs,
  })) {
    await payload.create({
      collection: 'articles',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: { ...articleData, createdBy: writerUser.id },
    })
  }

  payload.logger.info(`— Seeding multimedia...`)

  const multimediaIdsByTitle = new Map<string, number>()

  // Do not use `Promise.all` here. Related multimedia are linked by title in
  // a second pass below, which needs every doc to already have an id.
  for (const multimediaData of generateSeedMultimedia({ categories: categoryDocs })) {
    const multimediaDoc = await payload.create({
      collection: 'multimedia',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: { ...multimediaData, createdBy: writerUser.id },
    })
    multimediaIdsByTitle.set(multimediaData.title, multimediaDoc.id)
  }

  await Promise.all(
    Object.entries(MULTIMEDIA_RELATED).map(([title, relatedTitles]) => {
      const id = multimediaIdsByTitle.get(title)
      const relatedIds = relatedTitles
        .map((relatedTitle) => multimediaIdsByTitle.get(relatedTitle))
        .filter((relatedId): relatedId is number => relatedId !== undefined)

      if (!id || relatedIds.length === 0) {
        return null
      }

      return payload.update({
        collection: 'multimedia',
        id,
        depth: 0,
        context: {
          disableRevalidate: true,
        },
        data: { relatedMultimedia: relatedIds },
      })
    }),
  )

  payload.logger.info(`— Seeding issues...`)

  for (const issueData of ISSUES) {
    const { title, volume, issueNumber, description, publishedAt, coverImageUrl, pdfUrl } =
      issueData

    const [coverImageFile, pdfFile] = await Promise.all([
      fetchAsPayloadFile(coverImageUrl),
      fetchAsPayloadFile(pdfUrl),
    ])

    const [coverImageDoc, pdfDoc] = await Promise.all([
      payload.create({
        collection: 'media',
        context: {
          disableRevalidate: true,
        },
        data: { alt: `${title} cover` },
        file: coverImageFile,
      }),
      payload.create({
        collection: 'media',
        context: {
          disableRevalidate: true,
        },
        data: { alt: `${title} PDF` },
        file: pdfFile,
      }),
    ])

    await payload.create({
      collection: 'issues',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: {
        title,
        volume,
        issueNumber,
        description,
        publishedAt,
        coverImage: coverImageDoc.id,
        pdf: pdfDoc.id,
        createdBy: editorUser.id,
        _status: 'published',
      },
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
      data: { ...about({ metaImage: imageDoc }), createdBy: adminUser.id },
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: { ...contact({ form: contactFormDoc, metaImage: imageDoc }), createdBy: adminUser.id },
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: { ...terms({ metaImage: imageDoc }), createdBy: adminUser.id },
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: { ...privacy({ metaImage: imageDoc }), createdBy: adminUser.id },
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
