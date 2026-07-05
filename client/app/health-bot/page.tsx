"use client"

import DashboardLayout from "@/components/dashboard-layout"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertTriangle,
  MessageCircle,
  Send,
  Loader2,
  Phone,
  AlertCircle,
  CheckCircle,
  Stethoscope,
  Brain,
  Heart,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Question {
  id: string
  text: string
  type: "dropdown" | "radio" | "text" | "number" | "checkbox"
  options?: string[]
  required: boolean
  placeholder?: string
}

interface Classification {
  category: "TRIAGE" | "MENTAL_HEALTH" | "WELLNESS"
  triage_level?: "Self-care" | "Teleconsult" | "ER" | null
  confidence: number
  reason: string
  questions: Question[]
}

interface ProcessResult {
  type: "final_result"
  message_markdown: string
  category: string
  confidence: number
  raw_response?: string
  next_steps?: string[]
  self_care?: string[]
  can_book?: boolean
}

const EMERGENCY_KEYWORDS = [
  "chest pain",
  "heart attack",
  "stroke",
  "can't breathe",
  "suicide",
  "overdose",
  "severe bleeding",
  "unconscious",
  "choking",
  "severe allergic reaction",
]

const markdownToHtml = (markdown: string): string => {
  return (
    markdown
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-slate-800 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-slate-800 mt-5 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-slate-800 mt-6 mb-4">$1</h1>')

      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

      // Lists - handle bullet points
      .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4 mb-1">$1. $2</li>')

      // Wrap consecutive list items in ul tags
      .replace(/(<li.*<\/li>\s*)+/g, (match) => `<ul class="space-y-1 mb-3">${match}</ul>`)

      // Code blocks and inline code
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-2 py-1 rounded text-sm font-mono">$1</code>')

      // Line breaks and paragraphs
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, "<br>")

      // Wrap in paragraph tags
      .replace(/^(?!<[h|u|l])/, '<p class="mb-3">')
      .replace(/(?<!>)$/, "</p>")

      // Clean up empty paragraphs
      .replace(/<p class="mb-3"><\/p>/g, "")
  )
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "TRIAGE":
      return <Stethoscope className="w-5 h-5 text-blue-600" />
    case "MENTAL_HEALTH":
      return <Brain className="w-5 h-5 text-purple-600" />
    case "WELLNESS":
      return <Heart className="w-5 h-5 text-green-600" />
    default:
      return <MessageCircle className="w-5 h-5 text-blue-600" />
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "TRIAGE":
      return "border-blue-200 bg-blue-50"
    case "MENTAL_HEALTH":
      return "border-purple-200 bg-purple-50"
    case "WELLNESS":
      return "border-green-200 bg-green-50"
    default:
      return "border-blue-200 bg-blue-50"
  }
}

export default function HealthBotPage() {
  const [step, setStep] = useState<"input" | "questions" | "result">("input")
  const [userQuery, setUserQuery] = useState("")
  const [classification, setClassification] = useState<Classification | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<ProcessResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [step, classification, result])

  const checkEmergency = (query: string): boolean => {
    const lowerQuery = query.toLowerCase()
    return EMERGENCY_KEYWORDS.some((keyword) => lowerQuery.includes(keyword))
  }

  const handleInitialSubmit = async () => {
    if (!userQuery.trim()) return

    console.log("[v0] Starting health bot with query:", userQuery)

    // Emergency check
    if (checkEmergency(userQuery)) {
      console.log("[v0] Emergency keywords detected")
      setResult({
        type: "final_result",
        message_markdown:
          "**EMERGENCY** — Your symptoms require immediate medical attention.\n\n**Next steps:**\n- Call 911 or go to the nearest emergency room immediately\n- Do not drive yourself - call an ambulance\n- Stay on the line with emergency services\n\nThis is not a diagnosis. Seek immediate medical care.",
        category: "TRIAGE",
        confidence: 1,
        next_steps: ["Call 911 immediately", "Go to nearest ER", "Do not drive yourself"],
        self_care: [],
        can_book: false,
      })
      setStep("result")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("[v0] Calling classify API")
      const classifyResponse = await fetch("/api/health-bot/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery, lang: "en" }),
      })

      if (!classifyResponse.ok) {
        throw new Error(`Classification failed: ${classifyResponse.status}`)
      }

      const classificationData = await classifyResponse.json()
      console.log("[v0] Classification result:", classificationData)

      setClassification(classificationData)
      setStep("questions")
    } catch (err) {
      console.error("[v0] Classification error:", err)
      setError("Failed to analyze your query. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionsSubmit = async () => {
    if (!classification) return

    // Check required fields
    const missingRequired = classification.questions.filter((q) => q.required && !answers[q.id]).map((q) => q.text)

    if (missingRequired.length > 0) {
      setError(`Please answer all required questions: ${missingRequired.join(", ")}`)
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("[v0] Processing answers:", answers)
      console.log(
        "[v0] Full request payload:",
        JSON.stringify(
          {
            query: userQuery,
            classification,
            answers,
            lang: "en",
          },
          null,
          2,
        ),
      )

      const processResponse = await fetch("/api/health-bot/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userQuery,
          classification,
          answers,
          lang: "en",
        }),
      })

      if (!processResponse.ok) {
        const errorText = await processResponse.text()
        console.error("[v0] API error response:", errorText)
        throw new Error(`Processing failed: ${processResponse.status}`)
      }

      const processResult = await processResponse.json()
      console.log("[v0] Process result:", processResult)
      console.log("[v0] Raw AI response:", processResult.raw_response)

      setResult(processResult)
      setStep("result")
    } catch (err) {
      console.error("[v0] Processing error:", err)
      setError("Failed to process your answers. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderQuestion = (question: Question) => {
    const value = answers[question.id] || ""

    switch (question.type) {
      case "dropdown":
        return (
          <Select value={value} onValueChange={(val) => setAnswers((prev) => ({ ...prev, [question.id]: val }))}>
            <SelectTrigger>
              <SelectValue placeholder={question.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "radio":
        return (
          <RadioGroup value={value} onValueChange={(val) => setAnswers((prev) => ({ ...prev, [question.id]: val }))}>
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${option}`}
                  checked={value.split(",").includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = value ? value.split(",") : []
                    const newValues = checked ? [...currentValues, option] : currentValues.filter((v) => v !== option)
                    setAnswers((prev) => ({ ...prev, [question.id]: newValues.join(",") }))
                  }}
                />
                <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        )

      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))}
            placeholder={question.placeholder}
          />
        )

      case "text":
      default:
        return (
          <Textarea
            value={value}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))}
            placeholder={question.placeholder}
            rows={2}
          />
        )
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "ER":
      case "EMERGENCY":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "Teleconsult":
        return <Phone className="w-5 h-5 text-orange-500" />
      case "Self-care":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "ER":
      case "EMERGENCY":
        return "border-red-200 bg-red-50"
      case "Teleconsult":
        return "border-orange-200 bg-orange-50"
      case "Self-care":
        return "border-green-200 bg-green-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-3 py-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Stethoscope className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900">AI Health Assistant</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get personalized health guidance, symptom assessment, and professional recommendations
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {step === "input" && (
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <MessageCircle className="w-6 h-6 text-blue-600" />
                What's concerning you today?
              </CardTitle>
              <p className="text-slate-600 text-sm">
                Describe your symptoms, health concerns, or wellness questions in detail
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="For example: 'I've been having headaches for 3 days with nausea' or 'I'm feeling anxious and having trouble sleeping'..."
                rows={5}
                className="resize-none border-slate-200 focus:border-blue-400 focus:ring-blue-400"
              />
              <Button
                onClick={handleInitialSubmit}
                disabled={!userQuery.trim() || loading}
                className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing your symptoms...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Get Health Guidance
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "questions" && classification && (
          <div className="space-y-6">
            <Card className="shadow-md border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Your Health Query</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                  <p className="text-slate-800 leading-relaxed">{userQuery}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(classification.category)}
                    <Badge variant="outline" className="text-sm">
                      {classification.category.replace("_", " ")}
                    </Badge>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {Math.round(classification.confidence * 100)}% confidence
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Help us understand better</CardTitle>
                <p className="text-slate-600">Please answer these questions to provide personalized guidance</p>
              </CardHeader>
              <CardContent className="space-y-8">
                {classification.questions.map((question, index) => (
                  <div key={question.id} className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <Label className="text-base font-medium text-slate-800 block">
                      <span className="text-blue-600 font-semibold mr-2">{index + 1}.</span>
                      {question.text}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <div className="pl-6">{renderQuestion(question)}</div>
                  </div>
                ))}

                <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Label className="text-base font-medium text-slate-800 block">
                    <span className="text-blue-600 font-semibold mr-2">{classification.questions.length + 1}.</span>
                    Anything else you want to add or mention?
                  </Label>
                  <div className="pl-6">
                    <Textarea
                      value={answers["additional_context"] || ""}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, additional_context: e.target.value }))}
                      placeholder="Any additional symptoms, concerns, medications you're taking, or context you'd like to share..."
                      rows={4}
                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleQuestionsSubmit}
                  disabled={loading}
                  className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing your responses...
                    </>
                  ) : (
                    <>
                      <Stethoscope className="w-5 h-5 mr-2" />
                      Get My Health Recommendations
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "result" && result && (
          <div className="space-y-6">
            <Card className={`shadow-lg border-2 ${getCategoryColor(result.category || "")}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  {getCategoryIcon(result.category || "")}
                  <CardTitle className="text-2xl text-slate-900">Your Health Assessment</CardTitle>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-sm font-medium">
                    {result.category?.replace("_", " ")}
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    {Math.round((result.confidence || 0) * 100)}% confidence
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-slate max-w-none">
                  <div
                    className="text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: markdownToHtml(result.message_markdown || ""),
                    }}
                  />
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">Important Disclaimer</p>
                      <p>
                        This assessment is for informational purposes only and does not replace professional medical
                        advice. Always consult with a healthcare provider for proper diagnosis and treatment.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setStep("input")
                  setUserQuery("")
                  setClassification(null)
                  setAnswers({})
                  setResult(null)
                  setError("")
                }}
                className="h-12 px-8 text-base border-slate-300 hover:bg-slate-50"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Ask Another Question
              </Button>
              <Button onClick={() => window.print()} variant="secondary" className="h-12 px-8 text-base">
                Print Assessment
              </Button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </DashboardLayout>
  )
}
