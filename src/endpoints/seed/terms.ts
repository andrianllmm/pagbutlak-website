import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'
import { bulletList, heading, paragraph, richText, simpleHero } from './richtext'

type TermsArgs = {
  metaImage: Media
}

export const terms: (args: TermsArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  metaImage,
}) => {
  return {
    slug: 'terms',
    _status: 'published',
    title: 'Terms of Use',
    hero: simpleHero('Terms of Use'),
    layout: [
      {
        blockName: 'Content Block',
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: richText([
              paragraph(
                'These Terms of Use govern your access to and use of the UPV Pagbutlak website. By visiting or using this site, you agree to these terms. If you do not agree, please do not use the site.',
              ),
              heading('Who we are'),
              paragraph(
                'UPV Pagbutlak is the official student and community publication of the University of the Philippines Visayas College of Arts and Sciences. This website publishes news, features, opinion, and Kultura content produced by our staff and contributors.',
              ),
              heading('Use of content'),
              paragraph(
                'All articles, photos, and other original content on this site are the property of UPV Pagbutlak or its contributing writers and artists unless otherwise credited. You may:',
              ),
              bulletList([
                'Read, share, and link to our published articles for personal, non-commercial use.',
                'Quote short excerpts with clear attribution and a link back to the original article.',
              ]),
              paragraph('You may not, without our prior written permission:'),
              bulletList([
                'Republish, reproduce, or distribute our articles or images in full on another platform.',
                'Use our content for commercial purposes.',
                'Modify or present our work in a way that misrepresents its original meaning or authorship.',
              ]),
              heading('Comments and submissions'),
              paragraph(
                'If the site allows comments, letters, or other submissions, you are responsible for what you post. We reserve the right to moderate, edit, or remove any submission that is unlawful, defamatory, harassing, or otherwise inappropriate, and to restrict access for users who violate these terms.',
              ),
              heading('Accuracy of content'),
              paragraph(
                'We strive for accuracy and fairness in our reporting. If you believe an article contains an error, please contact us so we can review and, if warranted, issue a correction. Opinion pieces reflect the views of their individual authors and not necessarily those of UPV Pagbutlak as an organization.',
              ),
              heading('External links'),
              paragraph(
                'Our site may link to third-party websites for reference or context. We are not responsible for the content, accuracy, or practices of those external sites.',
              ),
              heading('Disclaimer'),
              paragraph(
                'This website and its content are provided "as is" without warranties of any kind. UPV Pagbutlak is not liable for any damages arising from your use of, or inability to use, this site.',
              ),
              heading('Changes to these terms'),
              paragraph(
                'We may update these Terms of Use from time to time to reflect changes in how the site operates. Continued use of the site after an update constitutes acceptance of the revised terms.',
              ),
              heading('Contact us'),
              paragraph(
                'Questions about these terms can be sent to us through our official contact channels or email.',
              ),
            ]),
          },
        ],
      },
    ],
    meta: {
      description: 'Terms of Use for the UPV Pagbutlak website.',
      image: metaImage.id,
      title: 'Terms of Use',
    },
  }
}
