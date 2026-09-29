import { generateText } from 'ai'
import { describeAiError, withModel } from '@/lib/ai'
import { panelImageRequestSchema } from '@/lib/comic'

export const maxDuration = 120

export async function POST(req: Request) {
  const parsed = panelImageRequestSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return Response.json({ error: 'Invalid panel request' }, { status: 400 })
  }
  const { imagePrompt, characterDescription, artStyle, setting } = parsed.data

  try {
    const result = await withModel('image', async (model) => {
      const res = await generateText({
      model,
      prompt: `Generate a single comic panel illustration in ${artStyle} style.
Scene: ${imagePrompt}
Setting: ${setting}
Main character (keep consistent): ${characterDescription}
Landscape 4:3 composition, bold clean linework, expressive lighting. Do not include any text, letters, captions or speech bubbles.`,
      providerOptions: {
        google: { imageConfig: { aspectRatio: '4:3' } },
      },
      })
      if (!res.files.some((f) => f.mediaType.startsWith('image/'))) throw new Error('No image returned')
      return res
    })

    const file = result.files.find((f) => f.mediaType.startsWith('image/'))
    if (!file) {
      return Response.json({ error: 'No image was returned' }, { status: 502 })
    }

    const image = file.base64.startsWith('data:') ? file.base64 : `data:${file.mediaType};base64,${file.base64}`
    return Response.json({ image })
  } catch (error) {
    console.error('Panel image generation failed:', error)
    return Response.json({ error: describeAiError(error, 'The artist dropped their pen. Try again.') }, { status: 500 })
  }
}
