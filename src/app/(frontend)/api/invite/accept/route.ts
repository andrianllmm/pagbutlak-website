import { getPayload, APIError, ValidationError } from 'payload'
import config from '@payload-config'

import { acceptInvitation } from '@/endpoints/acceptInvitation'

export async function POST(request: Request): Promise<Response> {
  const { name, password, token } = await request.json()

  if (typeof name !== 'string' || typeof password !== 'string' || typeof token !== 'string') {
    return Response.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  try {
    const user = await acceptInvitation({ name, password, payload, token })

    return Response.json({ user })
  } catch (err) {
    if (err instanceof APIError || err instanceof ValidationError) {
      return Response.json({ error: err.message }, { status: 400 })
    }

    payload.logger.error({ err }, 'Failed to accept invitation')

    return Response.json({ error: 'Unable to accept this invite.' }, { status: 400 })
  }
}
