import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

export const runtime = "nodejs"

// Define the schema for prescription data
const prescriptionSchema = z.object({
  medicines: z.array(
    z.object({
      name: z.string(),
      genericName: z.string(),
      strength: z.string(),
      dosageInstructions: z.string(),
      frequency: z.string(),
      timing: z.string(),
      mealTiming: z.string(),
      purpose: z.string(),
      sideEffects: z.array(z.string()),
      precautions: z.array(z.string()),
      contraindications: z.array(z.string()),
      missedDoseInstructions: z.string(),
      practicalTips: z.array(z.string()),
      confidence: z.number(),
    }),
  ),
  confidence: z.number(),
  ambiguities: z.array(z.string()),
})

export async function POST(request: NextRequest) {
  try {
    // Check OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not configured")
      return NextResponse.json(
        {
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
        },
        { status: 500 },
      )
    }

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    const { imageData, imageType } = body

    // Validate required fields
    if (!imageData || !imageType) {
      console.error("Missing required fields:", { hasImageData: !!imageData, hasImageType: !!imageType })
      return NextResponse.json({ error: "Missing image data or type" }, { status: 400 })
    }

    if (!imageType || typeof imageType !== "string") {
      console.error("Invalid image type:", imageType)
      return NextResponse.json({ error: "Invalid image type provided" }, { status: 400 })
    }

    const normalizedImageType = imageType.toLowerCase().trim()
    if (!normalizedImageType.startsWith("image/")) {
      console.error("Image type doesn't start with 'image/':", normalizedImageType)
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 })
    }

    const imageUrl = `data:${normalizedImageType};base64,${imageData}`

    let result
    try {
      result = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: prescriptionSchema,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this prescription image and extract all medications with their details. Be thorough and accurate. If you can't read something clearly, note it in ambiguities and set a lower confidence score.`,
              },
              {
                type: "image",
                image: imageUrl,
              },
            ],
          },
        ],
        maxTokens: 3000,
        temperature: 0.1,
      })
    } catch (aiError) {
      console.error("AI SDK call failed:", aiError)
      if (aiError instanceof Error) {
        console.error("AI error message:", aiError.message)
        console.error("AI error stack:", aiError.stack)
      }
      throw aiError // Re-throw to be handled by outer catch
    }

    if (!result.object) {
      console.error("No object in AI response")
      return NextResponse.json({ error: "No response from AI service" }, { status: 500 })
    }

    return NextResponse.json(result.object)
  } catch (error) {
    console.error("Prescription scan error:", error)

    // Handle specific errors
    if (error instanceof Error) {
      console.error("Error message:", error.message)

      if (error.message.includes("timeout")) {
        return NextResponse.json({ error: "AI processing timeout. Please try again." }, { status: 408 })
      }
      if (error.message.includes("rate limit")) {
        return NextResponse.json({ error: "AI service rate limit exceeded. Please try again later." }, { status: 429 })
      }
      if (error.message.includes("invalid_api_key")) {
        return NextResponse.json({ error: "Invalid OpenAI API key. Please check your configuration." }, { status: 401 })
      }
      if (error.message.includes("insufficient_quota")) {
        return NextResponse.json({ error: "OpenAI API quota exceeded. Please check your billing." }, { status: 402 })
      }

      return NextResponse.json(
        {
          error: "Failed to process prescription",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to process prescription",
        details: "An unexpected error occurred. Please try again.",
      },
      { status: 500 },
    )
  }
}
