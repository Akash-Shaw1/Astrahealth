import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const attachmentSchema = z.object({
  type: z.enum(["image", "pdf"]),
  name: z.string(),
  url: z.string(),
  size: z.number(),
})

const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().max(4000), // Limit message length
      attachments: z.array(attachmentSchema).optional(),
    }),
  ),
  model: z.string().optional().default("gpt-4o-mini"),
  temperature: z.number().min(0).max(1).optional().default(0.7),
  useCustomPrompt: z.boolean().optional().default(true),
})

const SYSTEM_PROMPT =
  process.env.SYSTEM_PROMPT ||
  "You are a helpful healthcare AI assistant. Provide accurate medical information while emphasizing that users should consult healthcare professionals for diagnosis and treatment. Always remind users that this is not a substitute for professional medical advice."

// Simple in-memory rate limiter
const rateLimiter = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10 // requests per minute
const RATE_WINDOW = 60 * 1000 // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const userLimit = rateLimiter.get(ip)

  if (!userLimit || now > userLimit.resetTime) {
    rateLimiter.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false
  }

  userLimit.count++
  return true
}

function processMessageWithAttachments(message: any) {
  let content = message.content

  if (message.attachments && message.attachments.length > 0) {
    const attachmentDescriptions = message.attachments
      .map((att: any) => {
        if (att.type === "image") {
          return `[Image attached: ${att.name} (${(att.size / 1024).toFixed(1)}KB)]`
        } else if (att.type === "pdf") {
          return `[PDF document attached: ${att.name} (${(att.size / 1024).toFixed(1)}KB)]`
        }
        return `[File attached: ${att.name}]`
      })
      .join(" ")

    content = `${content}\n\n${attachmentDescriptions}\n\nPlease analyze the attached files and provide relevant health information or guidance based on their content.`
  }

  return {
    role: message.role,
    content: content,
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || "unknown"
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
    }

    // Validate request body
    const body = await request.json()
    const { messages, model, temperature, useCustomPrompt } = chatRequestSchema.parse(body)

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    // Prepare messages with system prompt
    const systemMessage = {
      role: "system" as const,
      content: useCustomPrompt ? SYSTEM_PROMPT : "You are a helpful assistant.",
    }

    const processedMessages = messages.filter((m) => m.role !== "system").map(processMessageWithAttachments)

    const messagesWithSystem = [systemMessage, ...processedMessages]

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: messagesWithSystem,
        temperature,
        stream: true,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("OpenAI API error:", error)
      return NextResponse.json({ error: "Failed to get response from AI service" }, { status: response.status })
    }

    // Return streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = new TextDecoder().decode(value)
            const lines = chunk.split("\n")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6)
                if (data === "[DONE]") {
                  controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
                  continue
                }

                try {
                  // Validate and forward the chunk
                  JSON.parse(data)
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`))
                } catch (e) {
                  // Skip invalid JSON chunks
                }
              }
            }
          }
        } catch (error) {
          console.error("Streaming error:", error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request format", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
