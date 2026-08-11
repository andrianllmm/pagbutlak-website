import type { RequiredDataFromCollectionSlug } from 'payload'

import type { Category } from '@/payload-types'

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

type SeedMultimediaInput = {
  title: string
  links: { url: string }[]
  caption: string
  publishedAt: string
}

const MULTIMEDIA: SeedMultimediaInput[] = [
  {
    title: '#WOKAWT2025 Round Up: UPV Community Marches Against Corruption',
    links: [{ url: 'https://www.tiktok.com/@pagbutlakupv/video/7558099711979228424' }],
    caption:
      "Bilang tugon sa isyung korapsyon, mahigit 800 estudyante, guro, at kawani ng UP Visayas ang sabay-sabay na nanawagan ng pananagutan sa isinagawang multisectoral walkout kaninang hapon, Oktubre 6. Nagsimula ang martsa ng mga iskolar sa kani-kanilang kolehiyo patungo sa New Admin Building, dala ang sigaw laban sa korapsyon at ang panawagan para sa mas mataas na suporta sa sektor ng edukasyon. Sa gitna ng programa, nagtanghal ang ilang estudyante at nagsalita ang mga kinatawan ng iba't ibang sektor bilang pagpapahayag ng kanilang paninindigan at patuloy na paglaban. Narito sina Adrian Cortoñea, Bea Sibal, at John Mathew Inocencio para sa mga detalye.",
    publishedAt: '2025-10-06T12:00:00.000Z',
  },
  {
    title: 'PAGTUKIB: What Is the USC Convention?',
    links: [{ url: 'https://www.tiktok.com/@pagbutlakupv/video/7575938621073607953' }],
    caption:
      "Sa darating na Lunes, Nobyembre 24, 2025, gaganapin ang University Student Council (USC) Convention, ang taunang pagtitipon ng mga nahalal na kinatawan mula sa iba't ibang kolehiyo ng UP Visayas upang talakayin at isagawa ang pagpili ng bagong liderato ng USC. Sa konbensiyong ito isinasagawa ang proseso ng pagpili ng mga susunod na Chairperson, Vice Chairpersons, at Counselors ng USC. Narito sina Junel Arellano at Alluna Hervi Pacion upang ipaliwanag nang mas detalyado ang proseso.",
    publishedAt: '2025-11-20T12:00:00.000Z',
  },
  {
    title: 'Lightning Rally Briefly Intercepted at UPV Commencement Exercises',
    links: [
      { url: 'https://www.facebook.com/share/v/1BWrGrvjEs/' },
      { url: 'https://www.tiktok.com/@pagbutlakupv/video/7660883750619778311' },
    ],
    caption:
      "The lightning rally, a longstanding systemwide tradition where students carry the calls of the masses, was intercepted before it could begin as UP Visayas USC Chairperson Aljo Benedicto was barricaded by a group of security personnel who had been preemptively stationed near the stage. The incident occurred after the formal program, following a flash mob performance during this year's Commencement Exercises. However, after a brief struggle, he was eventually let through and the lightning rally proceeded with no further interference.",
    publishedAt: '2026-04-15T12:00:00.000Z',
  },
  {
    title: 'UPV Students Hold Protest for National Students Day 2025',
    links: [{ url: 'https://www.tiktok.com/@pagbutlakupv/video/7574417233015754004' }],
    caption:
      "PANUORIN: Nagkasa ng kilos-protesta ang mga mag-aaral ng University of the Philippines Visayas bilang pagdiriwang ng National Students' Day noong ika-17 ng Nobyembre. #NSD2025",
    publishedAt: '2025-11-17T12:00:00.000Z',
  },
  {
    title: 'Short Documentary: Stories of Struggle on Labor Day',
    links: [{ url: 'https://www.tiktok.com/@pagbutlakupv/video/7636784889093688593' }],
    caption:
      'Sa paggunita sa Araw ng mga Manggagawa, nagsilbing entablado ang lansangan para sa mga magsasaka, kaguruan, drayber, at iba pang mga manggagawa bitbit ang kani-kanilang kwento ng pakikibaka sa gitna ng patuloy na pag-igting ng krisis sa kabuhayan. Inilantad nito ang araw-araw na realidad ng mga manggagawang Pilipino: ang bigat ng kahirapan sa kabila ng limitadong oportunidad, ang kawalang-katiyakan dulot ng kontraktuwalisasyon, at ang patuloy na panawagan para sa makatarungang sahod na sasapat sa tumataas na gastusin. Panoorin ang maikling dokyu ng Pagbutlak hatid nina Alluna Pacio at Bea Sibal. Inedit ni: Kent Cortocena #MayoUno',
    publishedAt: '2026-05-01T12:00:00.000Z',
  },
  {
    title: 'EDSA40: Iloilo Groups Gather to Condemn Corruption, Martial Law Legacy',
    links: [{ url: 'https://www.tiktok.com/@pagbutlakupv/video/7610735858848779541' }],
    caption:
      "PANUORIN: Bilang pagtanda sa ika-40 na anibersaryo ng EDSA People Power Revolution nitong Pebrero 25, nagtipon sa harap ng Iloilo Provincial Capitol ang iba't ibang panlipunang sektor kasama ang simbahan upang kondenahin ang pamanang kurapsyon at iba pang krisis na iniugnay sa panahon ng Martial Law sa ilalim ng rehimeng Marcos. Narito si Trisha Ann Taladhay para sa mga detalye. #EDSA40",
    publishedAt: '2026-02-25T12:00:00.000Z',
  },
]

const MULTIMEDIA_CATEGORIES: Record<string, string[]> = {
  '#WOKAWT2025 Round Up: UPV Community Marches Against Corruption': [
    'Social Movements',
    'Student Welfare',
  ],
  'PAGTUKIB: What Is the USC Convention?': ['UPV Student Government'],
  'Lightning Rally Briefly Intercepted at UPV Commencement Exercises': [
    'UPV Student Government',
    'Social Movements',
  ],
  'UPV Students Hold Protest for National Students Day 2025': [
    'Student Welfare',
    'Social Movements',
  ],
  'Short Documentary: Stories of Struggle on Labor Day': ['Labor'],
  'EDSA40: Iloilo Groups Gather to Condemn Corruption, Martial Law Legacy': [
    'National Politics',
    'Human Rights',
  ],
}

// Deliberately varied: some entries have no related multimedia, others have several.
export const MULTIMEDIA_RELATED: Record<string, string[]> = {
  '#WOKAWT2025 Round Up: UPV Community Marches Against Corruption': [
    'PAGTUKIB: What Is the USC Convention?',
    'Lightning Rally Briefly Intercepted at UPV Commencement Exercises',
    'UPV Students Hold Protest for National Students Day 2025',
    'EDSA40: Iloilo Groups Gather to Condemn Corruption, Martial Law Legacy',
  ],
  'PAGTUKIB: What Is the USC Convention?': [],
  'Lightning Rally Briefly Intercepted at UPV Commencement Exercises': [
    '#WOKAWT2025 Round Up: UPV Community Marches Against Corruption',
    'UPV Students Hold Protest for National Students Day 2025',
  ],
  'UPV Students Hold Protest for National Students Day 2025': [
    '#WOKAWT2025 Round Up: UPV Community Marches Against Corruption',
  ],
  'Short Documentary: Stories of Struggle on Labor Day': [],
  'EDSA40: Iloilo Groups Gather to Condemn Corruption, Martial Law Legacy': [
    '#WOKAWT2025 Round Up: UPV Community Marches Against Corruption',
    'Lightning Rally Briefly Intercepted at UPV Commencement Exercises',
    'Short Documentary: Stories of Struggle on Labor Day',
  ],
}

export function generateSeedMultimedia({
  categories,
}: {
  categories: Category[]
}): RequiredDataFromCollectionSlug<'multimedia'>[] {
  const categoryIdsByTitle = new Map(categories.map((category) => [category.title, category.id]))

  return MULTIMEDIA.map(({ title, links, caption, publishedAt }) => ({
    title,
    links,
    caption,
    publishedAt,
    slug: slugify(title),
    _status: 'published',
    categories: (MULTIMEDIA_CATEGORIES[title] ?? [])
      .map((categoryTitle) => categoryIdsByTitle.get(categoryTitle))
      .filter((id): id is number => id !== undefined),
  }))
}
