export type ModerationResult = {
  abusive: boolean
  categories: string[]
  source: "ai" | "local_fallback"
}

const localAbusePattern = /\b(?:f+u+c+k+|s+h+i+t+|b+i+t+c+h+|a+s+s+h+o+l+e+|b+a+s+t+a+r+d+|c+u+n+t+)\b/i

/**
 * Uses OpenAI's moderation model when configured. The local detector keeps the
 * safety rule working in development and during a provider outage.
 */
export async function moderateComment(text: string): Promise<ModerationResult> {
  const apiKey = process.env.OPENAI_API_KEY
  if (apiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/moderations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({ model: "omni-moderation-latest", input: text })
      })

      if (response.ok) {
        const payload = await response.json()
        const result = payload.results?.[0]
        const categories = Object.entries(result?.categories ?? {})
          .filter(([, flagged]) => flagged)
          .map(([category]) => category)
        return { abusive: Boolean(result?.flagged), categories, source: "ai" }
      }
    } catch {
      // Fall through to the deterministic safety net rather than allowing an
      // outage to bypass moderation.
    }
  }

  return {
    abusive: localAbusePattern.test(text),
    categories: localAbusePattern.test(text) ? ["abusive_language"] : [],
    source: "local_fallback"
  }
}
