import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

export const runtime = "nodejs"

const classificationSchema = z.object({
  category: z.enum(["TRIAGE", "MENTAL_HEALTH", "WELLNESS"]),
  triage_level: z.enum(["Self-care", "Teleconsult", "ER"]).nullable(),
  confidence: z.number().min(0).max(1),
  reason: z.string().max(200), // Increased from 100 to 200 characters
  questions: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().max(300), // Increased from 200 to 300 characters
        type: z.enum(["dropdown", "radio", "text", "number", "checkbox"]),
        options: z.array(z.string()).optional(),
        required: z.boolean().default(true),
        placeholder: z.string().optional(),
      }),
    )
    .min(3)
    .max(10), // Increased from 8 to 10 questions max
})

export async function POST(request: Request) {
  try {
    console.log("[SERVER][v0] Starting health bot classification")

    const body = await request.json()
    const { query, lang = "en" } = body

    if (!query || typeof query !== "string") {
      console.log("[SERVER][v0] Missing or invalid query")
      return Response.json({ error: "Query is required" }, { status: 400 })
    }

    console.log("[SERVER][v0] Classifying query:", query.substring(0, 100))

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      system: `You are a medical triage assistant. Analyze the user's health query and return a JSON response.

CATEGORIES:
- TRIAGE: Physical symptoms, pain, illness, injuries (set triage_level to "Self-care", "Teleconsult", or "ER")
- MENTAL_HEALTH: Anxiety, depression, stress, emotional issues (set triage_level to null)
- WELLNESS: General health, prevention, lifestyle questions (set triage_level to null)

TRIAGE LEVELS (only for TRIAGE category, set to null for others):
- Self-care: Minor issues, home remedies
- Teleconsult: Moderate concerns needing professional advice
- ER: Severe/urgent symptoms requiring immediate care

Generate 3-10 relevant questions to gather more information. Keep reason under 200 characters and question text under 300 characters.

IMPORTANT: Always return valid JSON matching this exact structure:
{
  "category": "TRIAGE" | "MENTAL_HEALTH" | "WELLNESS",
  "triage_level": "Self-care" | "Teleconsult" | "ER" | null,
  "confidence": 0.0-1.0,
  "reason": "Brief explanation under 200 chars",
  "questions": [
    {
      "id": "unique_id",
      "text": "Question text under 300 chars",
      "type": "dropdown" | "radio" | "text" | "number" | "checkbox",
      "options": ["option1", "option2"] (only for dropdown/radio/checkbox),
      "required": true | false,
      "placeholder": "hint text" (optional)
    }
  ]
}`,
      prompt: `Classify this health query and generate appropriate follow-up questions: "${query}"`,
      schema: classificationSchema,
    })

    console.log("[SERVER][v0] Raw AI response:", JSON.stringify(result.object, null, 2))
    console.log("[SERVER][v0] Classification successful:", {
      category: result.object.category,
      confidence: result.object.confidence,
      questionCount: result.object.questions.length,
    })

    return Response.json(result.object)
  } catch (error: any) {
    console.error("[SERVER][v0] Classification error:", error)
    if (error.message && error.message.includes("response did not match schema")) {
      console.error("[SERVER][v0] Schema validation failed - AI response format issue")
    }
    return Response.json({ error: "Classification failed", details: error.message || "Unknown error" }, { status: 500 })
  }
}
