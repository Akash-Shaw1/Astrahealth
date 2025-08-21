"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  Award,
  CheckCircle,
  Download,
  Share2,
  Heart,
  Eye,
  ExternalLink,
  FileText,
  Video,
  Link,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import DashboardLayout from "@/components/dashboard-layout"
import type { JSX } from "react/jsx-runtime"

interface Module {
  id: string
  title: string
  description: string
  detailedDescription: string
  instructor: string
  instructorBio: string
  instructorImage: string
  duration: string
  lessons: number
  rating: number
  students: number
  category: string
  tags: string[]
  image: string
  progress: number
  level: string
  type: string
  language: string[]
  source: string
  verified: boolean
  lastUpdated: string
  popularity: number
  content: {
    overview: string
    objectives: string[]
    fullContent?: string
    modules: Array<{
      title: string
      duration: string
      type: string
    }>
    resources: Array<{
      title: string
      type: string
      url: string
      description?: string
      duration?: string
      external?: boolean
    }>
  }
}

interface ModuleDetailPageProps {
  module: Module
}

export default function ModuleDetailPage({ module }: ModuleDetailPageProps) {
  const router = useRouter()
  const [currentLesson, setCurrentLesson] = useState(0)

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

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
        return Video
      case "pdf":
        return FileText
      case "article":
        return BookOpen
      case "link":
        return Link
      default:
        return Download
    }
  }

  const formatContent = (content: string) => {
    if (!content) return null

    const lines = content.split("\n")
    const elements: JSX.Element[] = []
    let key = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={key++} className="text-3xl font-bold text-gray-900 mb-6 mt-8">
            {line.substring(2)}
          </h1>,
        )
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={key++} className="text-2xl font-semibold text-gray-800 mb-4 mt-6">
            {line.substring(3)}
          </h2>,
        )
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={key++} className="text-xl font-semibold text-gray-800 mb-3 mt-5">
            {line.substring(4)}
          </h3>,
        )
      } else if (line.startsWith("**") && line.endsWith("**")) {
        elements.push(
          <h4 key={key++} className="text-lg font-semibold text-gray-700 mb-2 mt-4">
            {line.substring(2, line.length - 2)}
          </h4>,
        )
      } else if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
        elements.push(
          <h5 key={key++} className="text-base font-medium text-gray-700 mb-2 mt-3 italic">
            {line.substring(1, line.length - 1)}
          </h5>,
        )
      } else if (line.startsWith("- ")) {
        // Handle bullet points
        const listItems = [line.substring(2)]
        let j = i + 1
        while (j < lines.length && lines[j].trim().startsWith("- ")) {
          listItems.push(lines[j].trim().substring(2))
          j++
        }
        elements.push(
          <ul key={key++} className="list-disc list-inside space-y-1 mb-4 ml-4">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>,
        )
        i = j - 1
      } else if (line.match(/^\d+\. /)) {
        // Handle numbered lists
        const listItems = [line.substring(line.indexOf(". ") + 2)]
        let j = i + 1
        while (j < lines.length && lines[j].trim().match(/^\d+\. /)) {
          const nextLine = lines[j].trim()
          listItems.push(nextLine.substring(nextLine.indexOf(". ") + 2))
          j++
        }
        elements.push(
          <ol key={key++} className="list-decimal list-inside space-y-1 mb-4 ml-4">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-gray-700">
                {item}
              </li>
            ))}
          </ol>,
        )
        i = j - 1
      } else if (line.length > 0) {
        elements.push(
          <p key={key++} className="text-gray-700 mb-4 leading-relaxed">
            {line}
          </p>,
        )
      }
    }

    return elements
  }

  const handleResourceClick = (resource: any) => {
    if (resource.external) {
      window.open(resource.url, "_blank", "noopener,noreferrer")
    } else {
      // Handle internal resources (downloads, etc.)
      window.open(resource.url, "_blank")
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 hover:bg-white/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Education Hub
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Module Header */}
              <div className="mb-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
                    <img
                      src={module.image || "/placeholder.svg"}
                      alt={module.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getSourceColor(module.source)}>{module.source}</Badge>
                      {module.verified && (
                        <Badge className="bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge className={getLevelColor(module.level)}>{module.level}</Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{module.title}</h1>
                    <p className="text-gray-600 mb-4">{module.description}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {module.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {module.lessons} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {module.students.toLocaleString()} students
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {module.rating}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {module.progress > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Your Progress</span>
                      <span className="text-sm text-gray-500">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-3" />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mb-8">
                  <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500">
                    <Play className="w-4 h-4 mr-2" />
                    {module.progress > 0 ? "Continue Learning" : "Start Learning"}
                  </Button>
                  <Button variant="outline">
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Tabs Content */}
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="mt-6">
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6">
                      <ScrollArea className="h-[800px] pr-4">
                        <div className="prose prose-gray max-w-none">
                          {module.content.fullContent ? (
                            formatContent(module.content.fullContent)
                          ) : (
                            <div>
                              <h3 className="text-xl font-semibold mb-4">Course Content</h3>
                              <p className="text-gray-700">
                                Comprehensive educational content will be displayed here. This module contains detailed
                                information about {module.title.toLowerCase()}.
                              </p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="overview" className="mt-6">
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">About This Course</h3>
                      <p className="text-gray-700 mb-6">{module.detailedDescription}</p>

                      <h4 className="text-lg font-semibold mb-3">Learning Objectives</h4>
                      <ul className="space-y-2">
                        {module.content.objectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{objective}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-lg font-semibold mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {module.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="capitalize">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="curriculum" className="mt-6">
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Course Curriculum</h3>
                      <div className="space-y-4">
                        {module.content.modules.map((lesson, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            onClick={() => setCurrentLesson(index)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-medium">{lesson.title}</h4>
                                <p className="text-sm text-gray-500 capitalize">{lesson.type}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-500">{lesson.duration}</span>
                              <Play className="w-4 h-4 text-blue-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="instructor" className="mt-6">
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
                          <img
                            src={module.instructorImage || "/placeholder.svg"}
                            alt={module.instructor}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{module.instructor}</h3>
                          <p className="text-gray-600">Course Instructor</p>
                        </div>
                      </div>
                      <p className="text-gray-700">{module.instructorBio}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="resources" className="mt-6">
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Course Resources</h3>
                      <div className="space-y-3">
                        {module.content.resources.map((resource, index) => {
                          const IconComponent = getResourceIcon(resource.type)
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                              onClick={() => handleResourceClick(resource)}
                            >
                              <div className="flex items-center gap-3">
                                <IconComponent className="w-5 h-5 text-blue-500" />
                                <div>
                                  <h4 className="font-medium">{resource.title}</h4>
                                  <p className="text-sm text-gray-500 uppercase">{resource.type}</p>
                                  {resource.description && (
                                    <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                                  )}
                                  {resource.duration && (
                                    <p className="text-xs text-gray-500 mt-1">Duration: {resource.duration}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {resource.external && <ExternalLink className="w-4 h-4 text-gray-400" />}
                                <Button variant="outline" size="sm">
                                  {resource.external ? "Open" : "Download"}
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Info */}
              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-lg">Course Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{module.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Lessons</span>
                    <span className="font-medium">{module.lessons}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Level</span>
                    <Badge className={getLevelColor(module.level)}>{module.level}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Language</span>
                    <div className="flex gap-1">
                      {module.language.slice(0, 2).map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                      {module.language.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{module.language.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Students</span>
                    <span className="font-medium">{module.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{module.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Certificate */}
              <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-6 h-6" />
                    <span className="font-semibold">Certificate</span>
                  </div>
                  <p className="text-purple-100 text-sm mb-4">
                    Earn a certificate upon successful completion of this course
                  </p>
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Certificate
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
