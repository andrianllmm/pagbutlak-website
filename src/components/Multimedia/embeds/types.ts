export type MultimediaEmbedProps = {
  autoplay?: boolean
  className?: string
  muted?: boolean
  title: string
  url: string
}

// Fixed width used natively by TikTok/Reels/Shorts embeds.
export const EMBED_WIDTH_CLASS = 'w-[325px] max-w-full'
