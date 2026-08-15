import React from 'react'

type JsonLdProps = {
  data: Record<string, unknown>
}

// Escapes closing script tags so embedded content can't break out of the JSON-LD block.
export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
      suppressHydrationWarning
    />
  )
}
