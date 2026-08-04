import type { Page } from '@/payload-types'

export type PageRichText = NonNullable<Page['hero']['richText']>

export type LexicalNode = Record<string, unknown>

export const text = (value: string, format = 0): LexicalNode => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text: value,
  version: 1,
})

export const heading = (value: string, tag: 'h2' | 'h3' = 'h2'): LexicalNode => ({
  type: 'heading',
  children: [text(value)],
  direction: 'ltr',
  format: '',
  indent: 0,
  tag,
  version: 1,
})

export const paragraph = (value: string): LexicalNode => ({
  type: 'paragraph',
  children: [text(value)],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  version: 1,
})

export const bulletList = (items: string[]): LexicalNode => ({
  type: 'list',
  tag: 'ul',
  listType: 'bullet',
  start: 1,
  children: items.map((item, index) => ({
    type: 'listitem',
    children: [text(item)],
    direction: 'ltr',
    format: '',
    indent: 0,
    value: index + 1,
    version: 1,
  })),
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

const buildRoot = (children: LexicalNode[]) => ({
  root: {
    type: 'root',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

export const richText = (children: LexicalNode[]): PageRichText =>
  buildRoot(children) as unknown as PageRichText

/** Same shape as `richText`, cast to whatever richText-like type the caller needs (e.g. form field/email message). */
export const richTextAs = <T>(children: LexicalNode[]): T => buildRoot(children) as unknown as T

export const simpleHero = (title: string, type: 'lowImpact' | 'mediumImpact' = 'lowImpact') => ({
  type,
  richText: richText([heading(title, 'h2')]),
})
