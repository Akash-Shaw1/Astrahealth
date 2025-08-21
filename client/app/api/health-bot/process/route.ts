import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    console.log("[SERVER][v0] Starting health bot processing")

    const body = await request.json()
    const { query, classification, answers, lang = "en" } = body

    if (!query || !classification || !answers) {
      console.log("[SERVER][v0] Missing required fields for processing")
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[SERVER][v0] Processing answers for category:", classification.category)
    console.log("[SERVER][v0] Answer count:", Object.keys(answers).length)
    console.log("[SERVER][v0] Full answers object:", JSON.stringify(answers, null, 2))

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system: `You are a compassionate and knowledgeable AI health assistant. Based on the user's query, classification, and answers, provide detailed, helpful health guidance.

IMPORTANT: Be descriptive, thorough, and detailed in your response. Do not worry about following any specific format - just provide the best possible health guidance.

CATEGORY-SPECIFIC GUIDANCE:

**TRIAGE**: Focus on medical urgency and symptom assessment
- Provide clear medical context and reasoning
- Include specific advice about when and where to seek care
- Explain the urgency level and why
- Give actionable next steps

**MENTAL_HEALTH**: Focus on emotional support and mental health resources
- Use empathetic, supportive language
- Include mental health resources and hotlines when appropriate
- Address safety concerns seriously
- Offer practical coping strategies

**WELLNESS**: Focus on lifestyle, prevention, and health optimization
- Create actionable wellness recommendations
- Provide specific lifestyle advice
- Include goal-setting and progress tracking suggestions
- Focus on sustainable health improvements

URGENCY LEVELS:
- **EMERGENCY/ER**: Life-threatening conditions requiring immediate medical attention
- **TELECONSULT**: Symptoms that need professional medical evaluation
- **SELF-CARE**: Minor issues that can be managed at home

RESPONSE FORMAT:
Start with a clear urgency assessment, then provide detailed guidance including:
- Medical context and explanation
- Specific next steps
- Self-care recommendations (when appropriate)
- Resources and support information
- Timeline expectations

Always include: "This is not a diagnosis. If symptoms worsen or you're concerned, seek medical care."

Be thorough, caring, and provide actionable advice. Use markdown formatting for better readability.`,
      prompt: `
User Query: ${query}

Classification: ${JSON.stringify(classification, null, 2)}

User Answers: ${JSON.stringify(answers, null, 2)}

Language: ${lang}

Please provide comprehensive health guidance based on this information. Be detailed and thorough.`,
    })

    console.log("[SERVER][v0] AI response received")
    console.log("[SERVER][v0] Response length:", result.text.length)
    console.log("[SERVER][v0] Full AI response:", result.text)

    return Response.json({
      type: "final_result",
      message_markdown: result.text,
      category: classification.category,
      confidence: classification.confidence,
      raw_response: result.text, // For debugging
    })
  } catch (error) {
    console.error("[SERVER][v0] Processing error:", error)
    console.error("[SERVER][v0] Error details:", JSON.stringify(error, null, 2))
    return Response.json({ error: "Failed to process health answers" }, { status: 500 })
  }
}
