import { generateText, Output } from 'ai'
import { z } from 'zod'

const improvedBulletsSchema = z.object({
  standard: z.string().describe('The improved version of the bullet with better wording and impact'),
  achievementFocused: z.string().describe('A version that emphasizes measurable achievements and results'),
  concise: z.string().describe('A shorter, more concise version that maintains impact'),
})

export async function POST(req: Request) {
  const { bullet, jobTitle, tone } = await req.json()

  const systemPrompt = `You are an expert resume writer and career coach. Your task is to improve resume bullet points to make them more impactful, professional, and compelling.

Key principles:
- Use strong action verbs at the beginning
- Quantify achievements when possible (numbers, percentages, dollar amounts)
- Focus on results and impact, not just responsibilities
- Use industry-appropriate terminology
- Keep language concise but powerful
- Avoid passive voice and weak phrases

${jobTitle ? `The user is targeting a ${jobTitle} position, so tailor the language accordingly.` : ''}

Tone preference: ${tone || 'Professional'}
- Professional: Balanced, polished language suitable for any industry
- Stronger: More assertive action verbs and confident language
- Concise: Extremely brief while maintaining impact
- Achievement-focused: Heavy emphasis on metrics and measurable outcomes`

  const { output } = await generateText({
    model: 'anthropic/claude-sonnet-4.6',
    output: Output.object({
      schema: improvedBulletsSchema,
    }),
    system: systemPrompt,
    prompt: `Please improve this resume bullet point and provide three versions:
1. A standard improved version
2. An achievement-focused version with emphasis on metrics and outcomes
3. A concise version that's shorter but impactful

Original bullet: "${bullet}"`,
  })

  return Response.json({ improvements: output })
}
