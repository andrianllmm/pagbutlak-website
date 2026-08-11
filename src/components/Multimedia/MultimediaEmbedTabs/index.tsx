'use client'
import { Link as LinkIcon } from 'lucide-react'
import React from 'react'

import { MultimediaEmbed } from '@/components/Multimedia/embeds'
import { MULTIMEDIA_PLATFORM_ICONS } from '@/components/Multimedia/platformIcons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/utilities/ui'
import { getPlatformFromUrl } from '@/utilities/multimediaEmbed'

type Props = {
  className?: string
  links: { url: string }[]
  title: string
}

export const MultimediaEmbedTabs: React.FC<Props> = ({ className, links, title }) => {
  if (links.length === 0) {
    return null
  }

  if (links.length === 1) {
    return <MultimediaEmbed className={className} title={title} url={links[0].url} />
  }

  return (
    <Tabs className={cn('flex flex-col items-center', className)} defaultValue="0">
      {links.map((link, index) => (
        <TabsContent key={index} value={String(index)}>
          <MultimediaEmbed title={title} url={link.url} />
        </TabsContent>
      ))}
      <TabsList className="mt-2 w-fit p-1">
        {links.map((link, index) => {
          const platform = getPlatformFromUrl(link.url)
          const Icon = platform ? MULTIMEDIA_PLATFORM_ICONS[platform] : LinkIcon
          return (
            <TabsTrigger key={index} value={String(index)} className="p-1 w-fit aspect-square">
              <Icon className="size-4" title={platform ?? 'Link'} />
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
