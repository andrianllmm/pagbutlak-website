import { SiFacebook, SiTiktok, SiYoutube } from '@icons-pack/react-simple-icons'

import type { MultimediaPlatform } from '@/constants/multimediaPlatforms'

export const MULTIMEDIA_PLATFORM_ICONS: Record<MultimediaPlatform, typeof SiFacebook> = {
  facebook: SiFacebook,
  tiktok: SiTiktok,
  youtube: SiYoutube,
}
