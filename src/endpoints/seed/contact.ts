import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Form, Media } from '@/payload-types'
import { paragraph, richText, simpleHero } from './richtext'

type ContactArgs = {
  form: Form
  metaImage: Media
}

export const contact: (args: ContactArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  form,
  metaImage,
}) => {
  return {
    slug: 'contact',
    _status: 'published',
    title: 'Contact',
    hero: { ...simpleHero('Contact Us'), centered: true },
    layout: [
      {
        blockName: 'Content Block',
        blockType: 'content',
        centered: true,
        columns: [
          {
            size: 'full',
            richText: richText([
              paragraph(
                'Have a tip, a correction, feedback, or a question for UPV Pagbutlak? Send us a message and we’ll get back to you.',
              ),
            ]),
          },
        ],
      },
      {
        blockName: 'Contact Form',
        blockType: 'formBlock',
        enableIntro: false,
        form: form.id,
      },
    ],
    meta: {
      description: 'Get in touch with UPV Pagbutlak.',
      image: metaImage.id,
      title: 'Contact',
    },
  }
}
