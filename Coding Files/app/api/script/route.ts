import { generateText, Output } from 'ai'
import { describeAiError, withModel } from '@/lib/ai'
import { comicRequestSchema, outlineSchema, PANEL_COUNT, storySchema, type ComicScript } from '@/lib/comic'

export const maxDuration = 120

export async function POST(req: Request) {
  const parsed = comicRequestSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }
  const input = parsed.data

  try {
    const { output: outline } = await withModel('flash', (model) => generateText({
      model,
      output: Output.object({ schema: outlineSchema }),
      prompt: `Create a ${PANEL_COUNT}-panel comic outline.
Story idea: ${input.prompt}
Main character: ${input.characterName}
Setting: ${input.setting}
Tone: ${input.tone}
Art style: ${input.artStyle}

The panels must form a complete arc (setup, rising action, climax, resolution). Each imagePrompt must describe the scene visually and mention ${input.characterName} by appearance so the character stays consistent.`,
    }))

    const { output: story } = await withModel('pro', (model) => generateText({
      model,
      output: Output.object({ schema: storySchema }),
      prompt: `You are a comic writer. Write narration and dialogue for this ${input.tone} comic titled "${outline.title}".
Main character: ${input.characterName} (${outline.characterDescription}).

Panels:
${outline.panels.map((p, i) => `${i + 1}. ${p.title}: ${p.description}`).join('\n')}

Return exactly ${PANEL_COUNT} panels in order. Keep narration vivid but short and dialogue punchy.`,
    }))

    const script: ComicScript = {
      title: outline.title,
      characterDescription: outline.characterDescription,
      request: input,
      panels: outline.panels.map((p, i) => ({
        index: i,
        ...p,
        narration: story.panels[i]?.narration ?? '',
        dialogue: story.panels[i]?.dialogue ?? [],
      })),
    }

    return Response.json(script)
  } catch (error) {
    console.error('Script generation failed:', error)
    return Response.json({ error: describeAiError(error, 'The writers hit a block. Please try again.') }, { status: 500 })
  }
}
