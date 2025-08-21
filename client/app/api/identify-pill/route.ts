import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const PillIdentificationSchema = z.object({
  identified: z.boolean().describe("Whether the pill could be confidently identified"),
  name: z.string().nullable().describe("Full display name or null"),
  genericName: z.string().nullable().describe("Generic/active ingredient name or null"),
  brandNames: z.array(z.string()).default([]).describe("Array of known brand names"),
  strength: z.string().nullable().describe("Dosage strength if visible or null"),
  form: z.string().nullable().describe("Form of medication (tablet, capsule, etc.) or null"),
  color: z.string().nullable().describe("Color of the pill or null"),
  shape: z.string().nullable().describe("Shape of the pill or null"),
  markings: z.string().nullable().describe("Any visible text, numbers, or markings or null"),
  overview: z.string().nullable().describe("Short plain-language overview or null"),
  uses: z.array(z.string()).default([]).describe("Array of uses"),
  usesText: z.string().default("").describe("Joined human-friendly string of uses"),
  benefits: z.array(z.string()).default([]).describe("Array of benefits"),
  benefitsText: z.string().default("").describe("Joined string of benefits"),
  sideEffects: z
    .object({
      common: z.array(z.string()).default([]),
      serious: z.array(z.string()).default([]),
      rare: z.array(z.string()).default([]),
    })
    .describe("Categorized side effects"),
  sideEffectsText: z.string().default("").describe("Safe string representation of side effects"),
  howToUse: z.string().nullable().describe("Usage instructions or null"),
  mechanism: z.string().nullable().describe("How the medication works or null"),
  safetyAdvice: z
    .object({
      pregnancy: z.string().default("Unknown"),
      driving: z.string().default("Unknown"),
      kidneyLiver: z.string().default("Unknown"),
      alcohol: z.string().default("Unknown"),
    })
    .optional()
    .describe("Safety advice categories"),
  safetyAdviceText: z.string().default("").describe("Safe string representation of safety advice"),
  missedDoseGuidance: z.string().nullable().describe("What to do if dose is missed or null"),
  substitutes: z.array(z.string()).default([]).describe("Available substitutes"),
  quickTips: z.array(z.string()).default([]).describe("Quick tips for usage"),
  factBox: z
    .object({
      strengths: z.array(z.string()).default([]),
      forms: z.array(z.string()).default([]),
      brandGeneric: z.string().default(""),
    })
    .optional()
    .describe("Fact box information"),
  interactions: z
    .object({
      drugs: z.array(z.string()).default([]),
      alcohol: z.string().default(""),
      foods: z.array(z.string()).default([]),
    })
    .describe("Drug interactions"),
  interactionsText: z.string().default("").describe("Safe string representation of interactions"),
  commonConcerns: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .default([])
    .describe("Array of Q/A objects"),
  confidence: z.number().min(0).max(1).describe("Confidence level as float 0-1"),
  disclaimer: z.string().default("Identification is visual-only; confirm with pharmacist.").describe("Disclaimer"),
  raw: z.any().optional().describe("Raw AI output for debugging"),
})

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    const { imageData, imageType } = body

    if (!imageData) {
      console.error("Missing required fields:", { hasImage: !!imageData, hasImageType: !!imageType })
      return NextResponse.json({ error: "Missing image data" }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not configured")
      return NextResponse.json(
        {
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
        },
        { status: 500 },
      )
    }

    const imageUrl = imageData.startsWith("data:image/")
      ? imageData
      : `data:${imageType || "image/png"};base64,${imageData}`

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a pharmaceutical expert. Analyze this pill image and return ONLY valid JSON matching the exact schema.

RULES:
- If identified with confidence ≥0.7: set "identified": true, populate all fields with real data
- If confidence <0.7: set "identified": false, use null/empty values appropriately
- Confidence must be 0.0-1.0 float (convert percentages: 95% = 0.95)
- Provide both array fields AND text fields for safe UI rendering
- Include raw field with your complete analysis

REQUIRED RESPONSE FORMAT (return ONLY this JSON structure):
{
  "identified": true/false,
  "name": "Full medication name" or null,
  "genericName": "Generic name" or null,
  "brandNames": ["Brand1", "Brand2"] or [],
  "strength": "20mg" or null,
  "form": "tablet" or null,
  "color": "white" or null,
  "shape": "round" or null,
  "markings": "visible markings" or null,
  "overview": "Brief description" or null,
  "uses": ["use1", "use2"] or [],
  "usesText": "use1, use2" or "",
  "benefits": ["benefit1"] or [],
  "benefitsText": "benefit1" or "",
  "sideEffects": {"common": [], "serious": [], "rare": []},
  "sideEffectsText": "common: none. serious: none." or "",
  "howToUse": "instructions" or null,
  "mechanism": "how it works" or null,
  "safetyAdvice": {"pregnancy": "info", "driving": "info", "kidneyLiver": "info", "alcohol": "info"},
  "safetyAdviceText": "pregnancy info. driving info." or "",
  "missedDoseGuidance": "guidance" or null,
  "substitutes": [] or ["sub1"],
  "quickTips": [] or ["tip1"],
  "factBox": {"strengths": [], "forms": [], "brandGeneric": ""},
  "interactions": {"drugs": [], "alcohol": "", "foods": []},
  "interactionsText": "drugs: none. foods: none." or "",
  "commonConcerns": [] or [{"question": "Q?", "answer": "A."}],
  "confidence": 0.85,
  "disclaimer": "Visual identification only; confirm with pharmacist.",
  "raw": "Your complete analysis here"
}

Analyze the pill image now:`,
            },
            {
              type: "image",
              image: imageUrl,
            },
          ],
        },
      ],
      schema: PillIdentificationSchema,
      maxTokens: 3000,
      temperature: 0.1,
    })

    return NextResponse.json(result.object)
  } catch (error) {
    console.error("Pill identification error:", error)

    return NextResponse.json(
      {
        error: "Failed to identify pill",
        details: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      },
      { status: 500 },
    )
  }
}
