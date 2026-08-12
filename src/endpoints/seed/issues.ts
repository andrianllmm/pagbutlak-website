import type { File } from 'payload'

export type SeedIssueInput = {
  title: string
  volume: number
  issueNumber: number
  description: string
  publishedAt: string
  coverImageUrl: string
  pdfUrl: string
}

export const ISSUES: SeedIssueInput[] = [
  {
    title: 'Year 51, Issue 1',
    volume: 51,
    issueNumber: 1,
    description:
      'Resistance at the forefront as the Filipino masses confront and move to cut loose the rotten heads of power.',
    publishedAt: '2026-02-23T00:00:00.000Z',
    coverImageUrl:
      'https://pagbutlak.org/wp-content/uploads/2026/02/screenshot-2026-02-23-234825.png',
    pdfUrl: 'https://pagbutlak.org/wp-content/uploads/2026/02/pagbutlak51-year-51-issue-1.pdf',
  },
]

export async function fetchAsPayloadFile(url: string): Promise<File> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  const data = Buffer.from(arrayBuffer)
  const name = decodeURIComponent(url.split('/').pop() || 'file')
  const mimetype = response.headers.get('content-type') || 'application/octet-stream'

  return {
    name: `${Date.now()}-${name}`,
    data,
    mimetype,
    size: data.byteLength,
  }
}
