import 'server-only'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import type { LanguageModel } from 'ai'

const GOOGLE_MODEL_IDS = {
  flash: ['gemini-3.5-flash', 'gemini-3-flash-preview'],
  // Pro is paid-only on the Gemini API; free-tier keys fall back to Flash.
  pro: ['gemini-3.1-pro-preview', 'gemini-3.5-flash'],
  image: ['gemini-3.1-flash-image-preview'],
} as const

const GATEWAY_MODEL_IDS = {
  flash: 'google/gemini-3.5-flash',
  pro: 'google/gemini-3.1-pro-preview',
  image: 'google/gemini-3.1-flash-image',
} as const

export type ModelRole = keyof typeof GOOGLE_MODEL_IDS

const apiKey = process.env.GEMINI_API_KEY
const google = apiKey ? createGoogleGenerativeAI({ apiKey }) : null

export function describeAiError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : ''
  if (/credit card|customer_verification|unauthenticated|api key|API_KEY_INVALID|permission/i.test(message)) {
    return 'AI is not configured yet. Add your GEMINI_API_KEY in the Vars panel and try again.'
  }
  if (/quota|rate limit|429/i.test(message)) {
    return 'Gemini quota reached. Image models need billing enabled on your Google AI Studio key.'
  }
  return fallback
}

/** Your Gemini key models first (in order), then Vercel AI Gateway as a last resort. */
function candidates(role: ModelRole): LanguageModel[] {
  const direct = google ? GOOGLE_MODEL_IDS[role].map((id) => google(id)) : []
  return [...direct, GATEWAY_MODEL_IDS[role]]
}

export async function withModel<T>(role: ModelRole, run: (model: LanguageModel) => Promise<T>): Promise<T> {
  let firstError: unknown
  for (const model of candidates(role)) {
    try {
      return await run(model)
    } catch (error) {
      firstError ??= error
      const label = typeof model === 'string' ? model : model.modelId
      console.warn(`Model ${label} failed, trying next:`, error instanceof Error ? error.message.slice(0, 160) : error)
    }
  }
  throw firstError
}
