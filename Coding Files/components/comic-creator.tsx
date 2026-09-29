'use client'

import { useRef, useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ComicForm } from '@/components/comic-form'
import { ComicPanel } from '@/components/comic-panel'
import { exportComicPdf } from '@/lib/export-pdf'
import type { ComicPanel as Panel, ComicRequest, ComicScript } from '@/lib/comic'

const DEFAULTS: ComicRequest = {
  prompt: 'A brave fox exploring an enchanted forest',
  characterName: 'Rusty',
  setting: 'forest',
  tone: 'dramatic',
  artStyle: 'anime',
}

type Status = 'idle' | 'writing' | 'drawing' | 'done' | 'error'

export function ComicCreator() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [script, setScript] = useState<ComicScript | null>(null)
  const [images, setImages] = useState<Record<number, string>>({})
  const [imageErrors, setImageErrors] = useState<Record<number, string>>({})
  const [exporting, setExporting] = useState(false)
  const runId = useRef(0)

  async function drawPanel(current: ComicScript, panel: Panel, id: number) {
    setImageErrors((prev) => {
      const next = { ...prev }
      delete next[panel.index]
      return next
    })
    try {
      const res = await fetch('/api/panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imagePrompt: panel.imagePrompt,
          characterDescription: current.characterDescription,
          artStyle: current.request.artStyle,
          setting: current.request.setting,
        }),
      })
      const data = await res.json()
      if (id !== runId.current) return
      if (!res.ok) throw new Error(data.error ?? 'Image failed')
      setImages((prev) => ({ ...prev, [panel.index]: data.image }))
    } catch (e) {
      if (id !== runId.current) return
      setImageErrors((prev) => ({ ...prev, [panel.index]: e instanceof Error ? e.message : 'Image failed' }))
    }
  }

  async function handleCreate(values: ComicRequest) {
    const id = ++runId.current
    setStatus('writing')
    setError(null)
    setScript(null)
    setImages({})
    setImageErrors({})

    try {
      const res = await fetch('/api/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (id !== runId.current) return
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')

      const newScript = data as ComicScript
      setScript(newScript)
      setStatus('drawing')
      await Promise.all(newScript.panels.map((p) => drawPanel(newScript, p, id)))
      if (id === runId.current) setStatus('done')
    } catch (e) {
      if (id !== runId.current) return
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setStatus('error')
    }
  }

  async function handleExport() {
    if (!script) return
    setExporting(true)
    try {
      await exportComicPdf(script, images)
    } finally {
      setExporting(false)
    }
  }

  const busy = status === 'writing' || status === 'drawing'
  const drawnCount = Object.keys(images).length

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <ComicForm busy={busy} defaults={DEFAULTS} onSubmit={handleCreate} />
      </aside>

      <section aria-live="polite" className="flex min-h-[400px] flex-col gap-6">
        {status === 'idle' && (
          <div className="halftone flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border-[3px] border-dashed border-foreground/40 p-10 text-center">
            <p className="font-display text-3xl tracking-wide text-foreground">Your comic appears here</p>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Gemini Flash plots a 5-panel outline, Gemini Pro writes the narration and dialogue, and Gemini Image
              illustrates every panel.
            </p>
          </div>
        )}

        {status === 'writing' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border-[3px] border-foreground bg-card p-10 text-center" role="status">
            <Loader2 className="size-10 animate-spin text-primary" aria-hidden="true" />
            <p className="font-display text-2xl tracking-wide text-foreground">Writing your story…</p>
            <p className="text-sm text-muted-foreground">Outlining with Gemini Flash, then scripting with Gemini Pro.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-xl border-[3px] border-destructive bg-card p-6" role="alert">
            <p className="font-display text-2xl tracking-wide text-destructive">Oops!</p>
            <p className="text-sm text-foreground">{error}</p>
          </div>
        )}

        {script && (
          <>
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Starring {script.request.characterName} · {script.request.tone} · {script.request.artStyle}
                </p>
                <h2 className="font-display text-4xl tracking-wide text-foreground text-balance md:text-5xl">{script.title}</h2>
              </div>
              <Button
                onClick={handleExport}
                disabled={busy || exporting}
                variant="outline"
                size="lg"
                className="border-2 border-foreground font-semibold"
              >
                {exporting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Download className="size-4" aria-hidden="true" />}
                {status === 'drawing' ? `Drawing ${drawnCount}/${script.panels.length}` : 'Download PDF'}
              </Button>
            </header>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {script.panels.map((panel) => (
                <ComicPanel
                  key={panel.index}
                  panel={panel}
                  image={images[panel.index]}
                  error={imageErrors[panel.index]}
                  onRetry={() => drawPanel(script, panel, runId.current)}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
