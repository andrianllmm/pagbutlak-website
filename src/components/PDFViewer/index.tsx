import React from 'react'

type Props = {
  src: string
  title: string
}

export const PDFViewer: React.FC<Props> = ({ src, title }) => {
  return (
    <div className="w-full max-w-[800px] mx-auto rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      <iframe className="w-full aspect-[3/4]" src={src} title={title} />
    </div>
  )
}
