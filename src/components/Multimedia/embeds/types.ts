export type MultimediaEmbedProps = {
  className?: string
  title: string
  url: string
}

// Matches the fixed width TikTok/Reels/Shorts embeds use natively, so the
// player doesn't stretch to fill the viewport on narrow screens.
export const EMBED_WIDTH_CLASS = 'w-[325px] max-w-full'
