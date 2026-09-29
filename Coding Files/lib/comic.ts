import { z } from 'zod'

export const PANEL_COUNT = 5

export const SETTINGS = ['forest', 'school', 'space', 'city', 'ocean', 'castle'] as const
export const TONES = ['light-hearted', 'dramatic', 'poetic', 'funny', 'mysterious'] as const
export const ART_STYLES = ['comic book', 'anime', 'pixel art', 'realistic', 'watercolor'] as const

export const comicRequestSchema = z.object({
  prompt: z.string().trim().min(5, 'Describe your story in a few words').max(500),
  characterName: z.string().trim().min(1, 'Give your hero a name').max(40),
  setting: z.enum(SETTINGS),
  tone: z.enum(TONES),
  artStyle: z.enum(ART_STYLES),
})

export type ComicRequest = z.infer<typeof comicRequestSchema>

export const outlineSchema = z.object({
  title: z.string().describe('Catchy comic title'),
  characterDescription: z
    .string()
    .describe('Concise, consistent visual description of the main character (species, colors, clothing)'),
  panels: z
    .array(
      z.object({
        title: z.string().describe('Short panel title'),
        description: z.string().describe('One or two sentence scene description'),
        imagePrompt: z.string().describe('Detailed visual prompt for illustrating this panel, no text or speech bubbles'),
      }),
    )
    .length(PANEL_COUNT),
})

export const storySchema = z.object({
  panels: z
    .array(
      z.object({
        narration: z.string().describe('Narration caption for the panel, 1-3 sentences'),
        dialogue: z
          .array(z.object({ speaker: z.string(), line: z.string() }))
          .max(3)
          .describe('Up to 3 short lines of character dialogue'),
      }),
    )
    .length(PANEL_COUNT),
})

export type ComicPanel = {
  index: number
  title: string
  description: string
  imagePrompt: string
  narration: string
  dialogue: { speaker: string; line: string }[]
}

export type ComicScript = {
  title: string
  characterDescription: string
  request: ComicRequest
  panels: ComicPanel[]
}

export const panelImageRequestSchema = z.object({
  imagePrompt: z.string().min(1).max(2000),
  characterDescription: z.string().max(1000),
  artStyle: z.enum(ART_STYLES),
  setting: z.enum(SETTINGS),
})
