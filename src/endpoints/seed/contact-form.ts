import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Form } from '@/payload-types'
import { paragraph, richTextAs } from './richtext'

type ConfirmationMessage = Form['confirmationMessage']
type EmailMessage = NonNullable<Form['emails']>[number]['message']

export const contactForm: () => RequiredDataFromCollectionSlug<'forms'> = () => {
  return {
    title: 'Contact Form',
    fields: [
      {
        blockType: 'text',
        name: 'name',
        label: 'Name',
        required: true,
        width: 100,
      },
      {
        blockType: 'email',
        name: 'email',
        label: 'Email',
        required: true,
        width: 100,
      },
      {
        blockType: 'textarea',
        name: 'message',
        label: 'Message',
        required: true,
        width: 100,
      },
    ],
    submitButtonLabel: 'Send message',
    confirmationType: 'message',
    confirmationMessage: richTextAs<ConfirmationMessage>([
      paragraph("Thanks for reaching out! We'll get back to you soon."),
    ]),
    // No email adapter is configured yet (see payload.config.ts), so this notification
    // won't actually send until one is added — but the form is ready to go once it is.
    emails: [
      {
        emailTo: 'contact@upvpagbutlak.org',
        replyTo: '{{email}}',
        subject: 'New contact form message from {{name}}',
        message: richTextAs<EmailMessage>([
          paragraph('You have a new message from the Pagbutlak website contact form.'),
          paragraph('Name: {{name}}'),
          paragraph('Email: {{email}}'),
          paragraph('Message: {{message}}'),
        ]),
      },
    ],
  }
}
