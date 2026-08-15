import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultTwitter: Metadata['twitter'] = {
  card: 'summary_large_image',
  creator: '@pagbutlakupv',
  description: 'Official website of Pagbutlak UPV',
  images: [`${getServerSideURL()}/og.webp`],
  title: 'Pagbutlak',
}

export const mergeTwitter = (twitter?: Metadata['twitter']): Metadata['twitter'] => {
  return {
    ...defaultTwitter,
    ...twitter,
    images: twitter?.images ? twitter.images : defaultTwitter.images,
  }
}
