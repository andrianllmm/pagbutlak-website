import type { RequiredDataFromCollectionSlug } from 'payload'

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

type SeedMultimediaInput = {
  title: string
  url: string
  caption: string
  publishedAt: string
}

const MULTIMEDIA: SeedMultimediaInput[] = [
  {
    title: '#WOKAWT2025 Round Up: UPV Community Marches Against Corruption',
    url: 'https://www.tiktok.com/@pagbutlakupv/video/7558099711979228424',
    caption:
      "Bilang tugon sa isyung korapsyon, mahigit 800 estudyante, guro, at kawani ng UP Visayas ang sabay-sabay na nanawagan ng pananagutan sa isinagawang multisectoral walkout kaninang hapon, Oktubre 6. Nagsimula ang martsa ng mga iskolar sa kani-kanilang kolehiyo patungo sa New Admin Building, dala ang sigaw laban sa korapsyon at ang panawagan para sa mas mataas na suporta sa sektor ng edukasyon. Sa gitna ng programa, nagtanghal ang ilang estudyante at nagsalita ang mga kinatawan ng iba't ibang sektor bilang pagpapahayag ng kanilang paninindigan at patuloy na paglaban. Narito sina Adrian Cortoñea, Bea Sibal, at John Mathew Inocencio para sa mga detalye.",
    publishedAt: '2025-10-06T12:00:00.000Z',
  },
  {
    title: 'PAGTUKIB: What Is the USC Convention?',
    url: 'https://www.tiktok.com/@pagbutlakupv/video/7575938621073607953',
    caption:
      "Sa darating na Lunes, Nobyembre 24, 2025, gaganapin ang University Student Council (USC) Convention, ang taunang pagtitipon ng mga nahalal na kinatawan mula sa iba't ibang kolehiyo ng UP Visayas upang talakayin at isagawa ang pagpili ng bagong liderato ng USC. Sa konbensiyong ito isinasagawa ang proseso ng pagpili ng mga susunod na Chairperson, Vice Chairpersons, at Counselors ng USC. Narito sina Junel Arellano at Alluna Hervi Pacion upang ipaliwanag nang mas detalyado ang proseso.",
    publishedAt: '2025-11-20T12:00:00.000Z',
  },
  {
    title: 'Lightning Rally Briefly Intercepted at UPV Commencement Exercises',
    url: 'https://www.tiktok.com/@pagbutlakupv/video/7660883750619778311',
    caption:
      "The lightning rally, a longstanding systemwide tradition where students carry the calls of the masses, was intercepted before it could begin as UP Visayas USC Chairperson Aljo Benedicto was barricaded by a group of security personnel who had been preemptively stationed near the stage. The incident occurred after the formal program, following a flash mob performance during this year's Commencement Exercises. However, after a brief struggle, he was eventually let through and the lightning rally proceeded with no further interference.",
    publishedAt: '2026-04-15T12:00:00.000Z',
  },
  {
    title: 'UPV Students Hold Protest for National Students Day 2025',
    url: 'https://www.tiktok.com/@pagbutlakupv/video/7574417233015754004',
    caption:
      "PANUORIN: Nagkasa ng kilos-protesta ang mga mag-aaral ng University of the Philippines Visayas bilang pagdiriwang ng National Students' Day noong ika-17 ng Nobyembre. #NSD2025",
    publishedAt: '2025-11-17T12:00:00.000Z',
  },
  {
    title: 'Short Documentary: Stories of Struggle on Labor Day',
    url: 'https://www.tiktok.com/@pagbutlakupv/video/7636784889093688593',
    caption:
      'Sa paggunita sa Araw ng mga Manggagawa, nagsilbing entablado ang lansangan para sa mga magsasaka, kaguruan, drayber, at iba pang mga manggagawa bitbit ang kani-kanilang kwento ng pakikibaka sa gitna ng patuloy na pag-igting ng krisis sa kabuhayan. Inilantad nito ang araw-araw na realidad ng mga manggagawang Pilipino: ang bigat ng kahirapan sa kabila ng limitadong oportunidad, ang kawalang-katiyakan dulot ng kontraktuwalisasyon, at ang patuloy na panawagan para sa makatarungang sahod na sasapat sa tumataas na gastusin. Panoorin ang maikling dokyu ng Pagbutlak hatid nina Alluna Pacio at Bea Sibal. Inedit ni: Kent Cortocena #MayoUno',
    publishedAt: '2026-05-01T12:00:00.000Z',
  },
  {
    title: 'EDSA40: Iloilo Groups Gather to Condemn Corruption, Martial Law Legacy',
    url: 'https://www.tiktok.com/@pagbutlakupv/video/7610735858848779541',
    caption:
      "PANUORIN: Bilang pagtanda sa ika-40 na anibersaryo ng EDSA People Power Revolution nitong Pebrero 25, nagtipon sa harap ng Iloilo Provincial Capitol ang iba't ibang panlipunang sektor kasama ang simbahan upang kondenahin ang pamanang kurapsyon at iba pang krisis na iniugnay sa panahon ng Martial Law sa ilalim ng rehimeng Marcos. Narito si Trisha Ann Taladhay para sa mga detalye. #EDSA40",
    publishedAt: '2026-02-25T12:00:00.000Z',
  },
]

export function generateSeedMultimedia(): RequiredDataFromCollectionSlug<'multimedia'>[] {
  return MULTIMEDIA.map(({ title, url, caption, publishedAt }) => ({
    title,
    platform: 'tiktok',
    url,
    caption,
    publishedAt,
    slug: slugify(title),
    _status: 'published',
  }))
}
