import { ComicCreator } from '@/components/comic-creator'

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-4 py-8 md:px-8">
      <header className="flex flex-col gap-3">
        <p className="w-fit -rotate-2 rounded-sm border-2 border-foreground bg-accent px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-accent-foreground">
          Powered by Gemini
        </p>
        <h1 className="font-display text-5xl tracking-wide text-foreground md:text-7xl">
          Comic<span className="text-primary">Craft</span>
        </h1>
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Turn a one-line idea into a fully illustrated 5-panel comic, with a story, dialogue and artwork, then download it as a PDF.
        </p>
      </header>
      <ComicCreator />
    </main>
  )
}
