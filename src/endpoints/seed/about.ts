import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'
import { bulletList, heading, paragraph, richText, simpleHero } from './richtext'

type AboutArgs = {
  metaImage: Media
}

export const about: (args: AboutArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  metaImage,
}) => {
  return {
    slug: 'about',
    _status: 'published',
    title: 'About',
    hero: simpleHero('About UPV Pagbutlak'),
    layout: [
      {
        blockName: 'Content Block',
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: richText([
              paragraph(
                'UPV Pagbutlak is the official student and community publication of the University of the Philippines Visayas College of Arts and Sciences (UPV CAS). We report on campus and community issues and produce original writing across four sections: News, Features, Opinion, and Kultura.',
              ),
              heading('Our mission'),
              paragraph(
                'We exist to inform, represent, and give voice to the UP Visayas community. We cover the issues that matter to students, faculty, and the broader community we serve, and we provide a platform for original journalism, creative writing, and critical commentary.',
              ),
              heading('What we cover'),
              bulletList([
                'News: campus decisions, events, and developments that affect the UPV community.',
                'Features: in-depth stories about people, programs, and issues within and around the university.',
                'Opinion: commentary and analysis from staff writers and community contributors.',
                'Kultura: creative and cultural work, including literary and artistic pieces.',
              ]),
              heading('Editorial independence'),
              paragraph(
                'As a student publication, we operate under an editorial board and staff of student writers, editors, and artists. We are committed to accurate, fair, and responsible reporting, and to giving space to perspectives from across the university community. Opinion pieces reflect the views of their individual authors, not necessarily those of UPV Pagbutlak as an organization.',
              ),
              heading('Get involved'),
              paragraph(
                'UPV Pagbutlak welcomes students interested in writing, editing, photography, and art. We also welcome contributions, tips, and feedback from the wider UPV community.',
              ),
              heading('Contact us'),
              paragraph(
                'You can reach us through our official social media pages or by email. See the footer of this site for our current contact details.',
              ),
            ]),
          },
        ],
      },
    ],
    meta: {
      description:
        'About UPV Pagbutlak, the official student and community publication of UP Visayas College of Arts and Sciences.',
      image: metaImage.id,
      title: 'About',
    },
  }
}
