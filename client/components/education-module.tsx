"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Shield, BookOpen, Play, CheckCircle, AlertTriangle, Globe, X, Award, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface EducationContent {
  id: string
  title: string
  description: string
  source: "WHO" | "CDC" | "MoHFW" | "Local"
  type: "course" | "infographic" | "video" | "quiz"
  progress: number
  duration: string
  language: string[]
  category: "pandemic" | "hygiene" | "vaccines" | "digital-literacy"
  thumbnail: string
  verified: boolean
}

const educationContent: EducationContent[] = [
  {
    id: "1",
    title: "COVID-19 Prevention Basics",
    description: "Essential guidelines for preventing COVID-19 transmission",
    source: "WHO",
    type: "course",
    progress: 85,
    duration: "15 min",
    language: ["English", "Hindi", "Spanish"],
    category: "pandemic",
    thumbnail: "/covid-prevention-infographic.png",
    verified: true,
  },
  {
    id: "2",
    title: "Vaccine Safety & Efficacy",
    description: "Understanding how vaccines work and their safety profile",
    source: "CDC",
    type: "infographic",
    progress: 100,
    duration: "8 min",
    language: ["English", "French"],
    category: "vaccines",
    thumbnail: "/vaccine-safety-chart.png",
    verified: true,
  },
  {
    id: "3",
    title: "Spotting Health Misinformation",
    description: "Learn to identify and combat health-related fake news",
    source: "MoHFW",
    type: "video",
    progress: 45,
    duration: "12 min",
    language: ["English", "Hindi"],
    category: "digital-literacy",
    thumbnail: "/misinformation-detection.png",
    verified: true,
  },
  {
    id: "4",
    title: "Hand Hygiene Techniques",
    description: "Proper handwashing and sanitization methods",
    source: "WHO",
    type: "quiz",
    progress: 0,
    duration: "5 min",
    language: ["English", "Hindi", "Arabic"],
    category: "hygiene",
    thumbnail: "/hand-washing-steps.png",
    verified: true,
  },
  {
    id: "5",
    title: "Mental Health During Pandemics",
    description: "Coping strategies for pandemic-related stress",
    source: "Local",
    type: "course",
    progress: 30,
    duration: "20 min",
    language: ["English"],
    category: "pandemic",
    thumbnail: "/mental-health-support.png",
    verified: false,
  },
  {
    id: "6",
    title: "Food Safety Guidelines",
    description: "Safe food handling and preparation practices",
    source: "CDC",
    type: "infographic",
    progress: 70,
    duration: "10 min",
    language: ["English", "Spanish"],
    category: "hygiene",
    thumbnail: "/food-safety-guidelines.png",
    verified: true,
  },
]

const infodemicAlerts = [
  { type: "warning", message: "False claim about vaccine side effects trending", severity: "high" },
  { type: "info", message: "New WHO guidelines published", severity: "low" },
  { type: "alert", message: "Misinformation about home remedies detected", severity: "medium" },
]

export default function EducationModule() {
  const [selectedContent, setSelectedContent] = useState<EducationContent | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showInfodemicRadar, setShowInfodemicRadar] = useState(true)

  const getSourceColor = (source: string) => {
    switch (source) {
      case "WHO":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "CDC":
        return "bg-green-100 text-green-800 border-green-200"
      case "MoHFW":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "pandemic":
        return Shield
      case "hygiene":
        return CheckCircle
      case "vaccines":
        return Award
      case "digital-literacy":
        return Eye
      default:
        return BookOpen
    }
  }

  const ContentCard = ({ content }: { content: EducationContent }) => {
    const Icon = getCategoryIcon(content.category)

    return (
      <div
        className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={() => setSelectedContent(content)}
      >
        {/* Verified Badge */}
        {content.verified && (
          <div className="absolute -top-2 -right-2 z-10">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full p-2 shadow-lg">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        {/* Progress Ring */}
        <div className="absolute -top-1 -left-1 w-8 h-8">
          <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="12" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
            <circle
              cx="16"
              cy="16"
              r="12"
              stroke="#10B981"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 12}`}
              strokeDashoffset={`${2 * Math.PI * 12 * (1 - content.progress / 100)}`}
              className="transition-all duration-500"
            />
          </svg>
        </div>

        {/* Thumbnail */}
        <div className="relative mb-3 rounded-lg overflow-hidden">
          <img src={content.thumbnail || "/placeholder.svg"} alt={content.title} className="w-full h-24 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-2 left-2 flex items-center gap-1">
            <Icon className="w-3 h-3 text-white" />
            <span className="text-xs text-white font-medium">{content.type}</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm text-gray-800 line-clamp-2">{content.title}</h4>
            <Badge className={cn("text-xs", getSourceColor(content.source))}>{content.source}</Badge>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2">{content.description}</p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{content.duration}</span>
            <span>{content.progress}% complete</span>
          </div>

          {/* Languages */}
          <div className="flex flex-wrap gap-1">
            {content.language.slice(0, 2).map((lang) => (
              <Badge key={lang} variant="outline" className="text-xs px-1 py-0">
                {lang}
              </Badge>
            ))}
            {content.language.length > 2 && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                +{content.language.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Health Education Hub
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">Verified health information and learning resources</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Fact-Checked
          </Badge>
          <Button variant="outline" size="sm">
            <Globe className="w-4 h-4 mr-1" />
            Multi-language
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {educationContent.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-4">
          {["pandemic", "hygiene", "vaccines", "digital-literacy"].map((category) => {
            const Icon = getCategoryIcon(category)
            return (
              <Button key={category} variant="outline" size="sm" className="capitalize bg-transparent">
                <Icon className="w-4 h-4 mr-1" />
                {category.replace("-", " ")}
              </Button>
            )
          })}
        </div>
      </CardContent>

      {/* Infodemic Radar Widget */}
      {showInfodemicRadar && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="bg-gradient-to-br from-red-500 to-orange-500 text-white border-0 w-64">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 animate-pulse" />
                  <span className="text-sm font-semibold">Infodemic Radar</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 text-white hover:bg-white/20"
                  onClick={() => setShowInfodemicRadar(false)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {infodemicAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mt-1 flex-shrink-0",
                        alert.severity === "high"
                          ? "bg-red-300 animate-pulse"
                          : alert.severity === "medium"
                            ? "bg-yellow-300"
                            : "bg-green-300",
                      )}
                    />
                    <span className="text-red-100">{alert.message}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedContent.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getSourceColor(selectedContent.source)}>{selectedContent.source}</Badge>
                    {selectedContent.verified && (
                      <Badge className="bg-emerald-100 text-emerald-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedContent(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <img
                  src={selectedContent.thumbnail || "/placeholder.svg"}
                  alt={selectedContent.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              <p className="text-gray-600 mb-4">{selectedContent.description}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">{selectedContent.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{selectedContent.language.join(", ")}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-500">{selectedContent.progress}%</span>
                </div>
                <Progress value={selectedContent.progress} className="h-2" />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
                <Button variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Resources
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
