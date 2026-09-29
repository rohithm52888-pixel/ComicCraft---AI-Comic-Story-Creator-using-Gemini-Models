'use client'

import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ART_STYLES, SETTINGS, TONES, type ComicRequest } from '@/lib/comic'

type Props = {
  busy: boolean
  defaults: ComicRequest
  onSubmit: (values: ComicRequest) => void
}

const fieldClass =
  'w-full rounded-md border-2 border-foreground/80 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40'

function ChipGroup({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string
  label: string
  options: readonly string[]
  defaultValue: string
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="cursor-pointer">
            <input type="radio" name={name} value={option} defaultChecked={option === defaultValue} className="peer sr-only" />
            <span className="inline-block rounded-full border-2 border-foreground/70 px-3 py-1 text-xs font-medium capitalize text-foreground transition peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50 hover:border-primary">
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function ComicForm({ busy, defaults, onSubmit }: Props) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    onSubmit({
      prompt: String(data.get('prompt') ?? ''),
      characterName: String(data.get('characterName') ?? ''),
      setting: data.get('setting') as ComicRequest['setting'],
      tone: data.get('tone') as ComicRequest['tone'],
      artStyle: data.get('artStyle') as ComicRequest['artStyle'],
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-xl border-[3px] border-foreground bg-card p-6 shadow-[6px_6px_0_0_var(--primary)]"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="prompt" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Story prompt
        </label>
        <textarea
          id="prompt"
          name="prompt"
          required
          minLength={5}
          maxLength={500}
          rows={3}
          defaultValue={defaults.prompt}
          className={`${fieldClass} resize-none`}
          placeholder="A brave fox exploring an enchanted forest"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="characterName" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Main character
        </label>
        <input
          id="characterName"
          name="characterName"
          required
          maxLength={40}
          defaultValue={defaults.characterName}
          className={fieldClass}
          placeholder="Rusty"
        />
      </div>

      <ChipGroup name="setting" label="Setting" options={SETTINGS} defaultValue={defaults.setting} />
      <ChipGroup name="tone" label="Tone" options={TONES} defaultValue={defaults.tone} />
      <ChipGroup name="artStyle" label="Art style" options={ART_STYLES} defaultValue={defaults.artStyle} />

      <Button
        type="submit"
        disabled={busy}
        size="lg"
        className="h-12 border-2 border-foreground font-display text-xl tracking-wider"
      >
        <Sparkles className="size-5" aria-hidden="true" />
        {busy ? 'Creating…' : 'Create my comic'}
      </Button>
    </form>
  )
}
