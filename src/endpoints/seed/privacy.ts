import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'
import { bulletList, heading, paragraph, richText, simpleHero } from './richtext'

type PrivacyArgs = {
  metaImage: Media
}

export const privacy: (args: PrivacyArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  metaImage,
}) => {
  return {
    slug: 'privacy',
    _status: 'published',
    title: 'Privacy Policy',
    hero: simpleHero('Privacy Policy'),
    layout: [
      {
        blockName: 'Content Block',
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: richText([
              paragraph(
                'This Privacy Policy explains what information UPV Pagbutlak collects through this website, how we use it, and the choices you have.',
              ),
              heading('Information we collect'),
              paragraph('We may collect the following information when you use this site:'),
              bulletList([
                'Information you provide directly, such as your name and email address when submitting a comment, letter, contact form, or contribution.',
                'Basic technical information collected automatically, such as your browser type, device, and pages visited, used to keep the site running and to understand general usage.',
              ]),
              heading('How we use your information'),
              paragraph('We use the information we collect to:'),
              bulletList([
                'Publish and respond to submissions such as comments, letters, or contact form messages.',
                'Maintain, secure, and improve the website.',
                'Communicate with you if you reach out to us directly.',
              ]),
              paragraph('We do not sell your personal information.'),
              heading('Cookies'),
              paragraph(
                'The site may use essential cookies required for basic functionality, such as remembering your session in the admin panel. We do not use cookies for third-party advertising.',
              ),
              heading('Third-party services'),
              paragraph(
                'We may rely on third-party services for hosting, media storage, and analytics to operate this website. These providers only process the data necessary to deliver their service to us.',
              ),
              heading('Data retention'),
              paragraph(
                'We keep submitted information only for as long as needed for the purpose it was collected for, such as responding to an inquiry or moderating a published comment, unless a longer retention period is required by law.',
              ),
              heading('Your rights'),
              paragraph(
                'You may ask us to access, correct, or delete personal information you have submitted to us by contacting us directly. We will respond to reasonable requests within a reasonable time.',
              ),
              heading('Children'),
              paragraph(
                'This site is not directed at children under 13, and we do not knowingly collect personal information from them.',
              ),
              heading('Changes to this policy'),
              paragraph(
                'We may update this Privacy Policy from time to time. Material changes will be reflected by an updated revision date on this page.',
              ),
              heading('Contact us'),
              paragraph(
                'If you have questions about this Privacy Policy or how your information is handled, please contact us through our official channels or email.',
              ),
            ]),
          },
        ],
      },
    ],
    meta: {
      description: 'Privacy Policy for the UPV Pagbutlak website.',
      image: metaImage.id,
      title: 'Privacy Policy',
    },
  }
}
