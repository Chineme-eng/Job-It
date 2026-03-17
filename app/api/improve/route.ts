import { generateText, Output } from 'ai'
import { z } from 'zod'

const improvedBulletsSchema = z.object({
  standard: z.string().describe('The improved version of the bullet with better wording and impact'),
  achievementFocused: z.string().describe('A version that emphasizes measurable achievements and results'),
  concise: z.string().describe('A shorter, more concise version that maintains impact'),
})

export async function POST(req: Request) {
  try {
    const { bullet, jobTitle, tone } = await req.json()

    if (!bullet || typeof bullet !== 'string' || !bullet.trim()) {
      return Response.json({ error: 'Please provide a resume bullet to improve' }, { status: 400 })
    }

    const systemPrompt = `You are an expert resume writer and career coach. Improve resume bullet points to be more impactful and professional.

CRITICAL RULES:
- DO NOT invent fake metrics, numbers, percentages, or dollar amounts that weren't in the original
- DO NOT add specific achievements or experiences that weren't mentioned
- Start with strong action verbs (Led, Developed, Implemented, Streamlined, etc.)
- Use active voice, never passive voice
- Keep outputs SHORT - each bullet should be 1-2 lines maximum
- If the original has metrics, preserve them; if not, don't fabricate any
- Make it job-ready and professional
- Focus on impact and results implied by the original text

${jobTitle ? `Target position: ${jobTitle} - use relevant industry terminology.` : ''}

Tone: ${tone || 'Professional'}
- Professional: Polished, industry-standard language
- Stronger: Assertive action verbs and confident phrasing
- Concise: Maximum brevity while preserving impact
- Achievement-focused: Emphasize outcomes and results (but only from what's provided)`

    console.log('[v0] Starting generation with bullet:', bullet.trim())
    
    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      output: Output.object({
        schema: improvedBulletsSchema,
      }),
      system: systemPrompt,
      prompt: `Improve this resume bullet point. Provide three versions - keep each SHORT (1-2 lines max). Do NOT invent metrics or experiences not in the original.

Original bullet: "${bullet.trim()}"`,
    })

    console.log('[v0] Generation result:', JSON.stringify(result, null, 2))
    console.log('[v0] Output:', result.output)
    
    if (!result.output) {
      console.log('[v0] No output received from model')
      return Response.json(
        { error: 'Failed to generate improvements. Please try again.' },
        { status: 500 }
      )
    }

    return Response.json({ improvements: result.output })
  } catch (error) {
    console.error('Error improving bullet:', error)
    return Response.json(
      { error: 'Failed to improve bullet. Please try again.' },
      { status: 500 }
    )
  }
}
