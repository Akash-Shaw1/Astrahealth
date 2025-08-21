"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  Settings,
  Bot,
  User,
  Loader2,
  Paperclip,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  FileText,
  ImageIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import DashboardLayout from "@/components/dashboard-layout"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  attachments?: Array<{
    type: "image" | "pdf"
    name: string
    url: string
    size: number
  }>
}

interface ChatSettings {
  model: string
  temperature: number
  useCustomPrompt: boolean
  voiceEnabled: boolean
  autoSpeak: boolean
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<ChatSettings>({
    model: "gpt-4o-mini",
    temperature: 0.7,
    useCustomPrompt: true,
    voiceEnabled: false,
    autoSpeak: false,
  })
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [attachments, setAttachments] = useState<
    Array<{
      type: "image" | "pdf"
      name: string
      url: string
      size: number
    }>
  >([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("healthcare-chat-messages")
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages)
      setMessages(
        parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      )
    }
  }, [])

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      // Keep only last 20 messages
      const messagesToSave = messages.slice(-20)
      localStorage.setItem("healthcare-chat-messages", JSON.stringify(messagesToSave))
    }
  }, [messages])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        await transcribeAudio(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.wav")

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { text } = await response.json()
        setInput(text)
      }
    } catch (error) {
      console.error("Transcription error:", error)
    }
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      // Stop any current speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      speechSynthesisRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        const url = URL.createObjectURL(file)
        const attachment = {
          type: file.type.startsWith("image/") ? ("image" as const) : ("pdf" as const),
          name: file.name,
          url,
          size: file.size,
        }
        setAttachments((prev) => [...prev, attachment])
      }
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const newAttachments = [...prev]
      URL.revokeObjectURL(newAttachments[index].url)
      newAttachments.splice(index, 1)
      return newAttachments
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!input.trim() && attachments.length === 0) || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input.trim() || "Attached files for analysis",
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setAttachments([])
    setIsLoading(true)

    try {
      const requestBody = {
        messages: [...messages, userMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
          attachments: msg.attachments,
        })),
        model: settings.model,
        temperature: settings.temperature,
        useCustomPrompt: settings.useCustomPrompt,
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader available")

      const assistantMessage: Message = {
        role: "assistant",
        content: "",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      let fullResponse = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.choices?.[0]?.delta?.content) {
                const content = parsed.choices[0].delta.content
                fullResponse += content
                setMessages((prev) => {
                  const newMessages = [...prev]
                  const lastMessage = newMessages[newMessages.length - 1]
                  if (lastMessage.role === "assistant") {
                    lastMessage.content += content
                  }
                  return newMessages
                })
              }
            } catch (e) {
              // Ignore parsing errors for partial chunks
            }
          }
        }
      }

      if (settings.voiceEnabled && settings.autoSpeak && fullResponse) {
        speakText(fullResponse)
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <DashboardLayout>
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Health Assistant</h1>
            <p className="text-gray-600">Get personalized health guidance and medical information</p>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-white/20">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Chat Settings</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Select
                    value={settings.model}
                    onValueChange={(value) => setSettings((prev) => ({ ...prev, model: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="temperature">Temperature: {settings.temperature}</Label>
                  <Slider
                    value={[settings.temperature]}
                    onValueChange={([value]) => setSettings((prev) => ({ ...prev, temperature: value }))}
                    max={1}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="custom-prompt"
                    checked={settings.useCustomPrompt}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, useCustomPrompt: checked }))}
                  />
                  <Label htmlFor="custom-prompt">Use Healthcare System Prompt</Label>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Voice Settings</h4>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="voice-enabled"
                      checked={settings.voiceEnabled}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, voiceEnabled: checked }))}
                    />
                    <Label htmlFor="voice-enabled">Enable Voice Mode</Label>
                  </div>

                  {settings.voiceEnabled && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-speak"
                        checked={settings.autoSpeak}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoSpeak: checked }))}
                      />
                      <Label htmlFor="auto-speak">Auto-speak Responses</Label>
                    </div>
                  )}
                </div>

                {settings.useCustomPrompt && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Label className="text-sm font-medium">Active System Prompt:</Label>
                    <p className="text-xs text-gray-600 mt-1">
                      "You are a helpful healthcare AI assistant. Provide accurate medical information while emphasizing
                      that users should consult healthcare professionals for diagnosis and treatment."
                    </p>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Chat Container */}
        <Card className="flex-1 bg-white/60 backdrop-blur-sm border-white/20 flex flex-col">
          <CardHeader className="border-b border-gray-200/50">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-500" />
              Health Chat
              <Badge variant="secondary" className="ml-auto">
                {settings.model}
              </Badge>
              {settings.voiceEnabled && (
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  Voice Enabled
                </Badge>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Welcome to your AI Health Assistant</p>
                  <p className="text-sm">
                    Ask me about symptoms, medications, health tips, or share images and documents for analysis.
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`max-w-[70%] ${message.role === "user" ? "order-1" : ""}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.role === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((attachment, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-black/10 rounded">
                              {attachment.type === "image" ? (
                                <ImageIcon className="w-4 h-4" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                              <span className="text-xs">{attachment.name}</span>
                              <span className="text-xs opacity-70">({formatFileSize(attachment.size)})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1 px-1">
                      <p className="text-xs text-gray-500">{formatTime(message.timestamp)}</p>
                      {message.role === "assistant" && settings.voiceEnabled && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => (isSpeaking ? stopSpeaking() : speakText(message.content))}
                        >
                          {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        </Button>
                      )}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="bg-green-100 text-green-600">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {attachments.length > 0 && (
              <div className="border-t border-gray-200/50 p-4">
                <div className="flex flex-wrap gap-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                      {attachment.type === "image" ? (
                        <ImageIcon className="w-4 h-4 text-blue-500" />
                      ) : (
                        <FileText className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">{attachment.name}</span>
                      <span className="text-xs text-gray-500">({formatFileSize(attachment.size)})</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeAttachment(index)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-gray-200/50 p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>

                {settings.voiceEnabled && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isLoading}
                    className={isRecording ? "bg-red-100 border-red-300" : ""}
                  >
                    {isRecording ? <MicOff className="w-4 h-4 text-red-500" /> : <Mic className="w-4 h-4" />}
                  </Button>
                )}

                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about symptoms, medications, or health advice..."
                  disabled={isLoading}
                  className="flex-1 bg-white/80"
                />
                <Button type="submit" disabled={isLoading || (!input.trim() && attachments.length === 0)}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
