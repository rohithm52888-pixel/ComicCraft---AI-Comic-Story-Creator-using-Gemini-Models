'use client'

import { ImageOff, Loader2, RotateCw } from 'lucide-react'
import type { ComicPanel as Panel } from '@/lib/comic'

type Props = {
  panel: Panel
  image?: string
  error?: string
  onRetry: () => void
}

export function ComicPanel({ panel, image, error, onRetry }: Props) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border-[3px] border-foreground bg-card">
      <div className="relative aspect-[4/3] w-full border-b-[3px] border-foreground bg-muted">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={panel.description} className="size-full object-cover" />
        ) : error ? (
          <div className="flex size-full flex-col items-center justify-center gap-3 p-4 text-center">
            <ImageOff className="size-8 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground px-3 py-1 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground"
            >
              <RotateCw className="size-3.5" aria-hidden="true" />
              Redraw panel
            </button>
          </div>
        ) : (
          <div className="halftone flex size-full flex-col items-center justify-center gap-2" role="status">
            <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Inking panel…</span>
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-sm border-2 border-foreground bg-primary px-2 py-0.5 font-display text-sm tracking-wider text-primary-foreground">
          {panel.index + 1}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-display text-xl tracking-wide text-foreground text-balance">{panel.title}</h3>
        <p className="rounded-sm border-l-4 border-primary bg-muted/60 px-3 py-2 text-sm italic leading-relaxed text-foreground">
          {panel.narration}
        </p>
        {panel.dialogue.length > 0 && (
          <ul className="flex flex-col gap-2">
            {panel.dialogue.map((d, i) => (
              <li key={i} className="rounded-2xl border-2 border-foreground/70 bg-background px-3 py-2 text-sm leading-relaxed">
                <span className="font-semibold text-accent">{d.speaker}: </span>
                <span className="text-foreground">{d.line}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
