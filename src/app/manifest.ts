import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pagbutlak',
    short_name: 'Pagbutlak',
    description: 'Official website of Pagbutlak UPV',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdfbf2',
    theme_color: '#7e102c',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
