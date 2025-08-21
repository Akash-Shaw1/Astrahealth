"use client"

import { useState } from "react"
import { Clock, Users, Star, BookOpen, Play, CheckCircle, Award } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

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
    fullContent: string
    modules: Array<{
      title: string
      duration: string
      type: string
    }>
    resources: Array<{
      title: string
      type: string
      url: string
    }>
  }
}

interface LearningModalProps {
  module: Module | null
  isOpen: boolean
  onClose: () => void
}

export default function LearningModal({ module, isOpen, onClose }: LearningModalProps) {
  const [activeTab, setActiveTab] = useState("content")

  if (!module) return null

  const formatContent = (content: string) => {
    return content.split("\n").map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-gray-900">
            {line.substring(2)}
          </h1>
        )
      } else if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-xl font-semibold mt-5 mb-3 text-gray-800">
            {line.substring(3)}
          </h2>
        )
      } else if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-lg font-medium mt-4 mb-2 text-gray-700">
            {line.substring(4)}
          </h3>
        )
      } else if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={index} className="font-semibold mt-3 mb-2 text-gray-800">
            {line.substring(2, line.length - 2)}
          </p>
        )
      } else if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
        return (
          <p key={index} className="italic mt-2 mb-2 text-gray-600">
            {line.substring(1, line.length - 1)}
          </p>
        )
      } else if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-4 mb-1 text-gray-700">
            {line.substring(2)}
          </li>
        )
      } else if (line.trim() === "") {
        return <br key={index} />
      } else {
        return (
          <p key={index} className="mb-3 text-gray-700 leading-relaxed">
            {line}
          </p>
        )
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <div className="flex h-full">
          {/* Left Sidebar */}
          <div className="w-80 bg-gray-50 p-6 border-r">
            <DialogHeader className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  className={`text-xs ${
                    module.source === "WHO"
                      ? "bg-blue-100 text-blue-800"
                      : module.source === "CDC"
                        ? "bg-green-100 text-green-800"
                        : module.source === "MoHFW"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {module.source}
                </Badge>
                {module.verified && <Badge className="bg-emerald-100 text-emerald-800 text-xs">Verified</Badge>}
              </div>
              <DialogTitle className="text-xl font-bold text-left">{module.title}</DialogTitle>
              <p className="text-sm text-gray-600 text-left">{module.description}</p>
            </DialogHeader>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                {module.instructor}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {module.duration}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="w-4 h-4" />
                {module.lessons} lessons
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {module.rating} ({module.students.toLocaleString()})
              </div>
            </div>

            {module.progress > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-500">{module.progress}%</span>
                </div>
                <Progress value={module.progress} className="h-2" />
              </div>
            )}

            <div className="space-y-2">
              <Button
                variant={activeTab === "content" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("content")}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Course Content
              </Button>
              <Button
                variant={activeTab === "instructor" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("instructor")}
              >
                <Users className="w-4 h-4 mr-2" />
                Instructor
              </Button>
              <Button
                variant={activeTab === "resources" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("resources")}
              >
                <Award className="w-4 h-4 mr-2" />
                Resources
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <ScrollArea className="h-full">
              {activeTab === "content" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Learning Objectives</h3>
                    <ul className="space-y-2">
                      {module.content.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Course Modules</h3>
                    <div className="space-y-3">
                      {module.content.modules.map((moduleItem, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Play className="w-5 h-5 text-blue-500" />
                          <div className="flex-1">
                            <div className="font-medium">{moduleItem.title}</div>
                            <div className="text-sm text-gray-500">
                              {moduleItem.duration} • {moduleItem.type}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Full Course Content</h3>
                    <div className="prose prose-gray max-w-none">{formatContent(module.content.fullContent)}</div>
                  </div>
                </div>
              )}

              {activeTab === "instructor" && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={module.instructorImage || "/placeholder.svg"}
                      alt={module.instructor}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{module.instructor}</h3>
                      <p className="text-gray-600 mt-2">{module.instructorBio}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {module.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="capitalize">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Course Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{module.students.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Students Enrolled</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{module.rating}</div>
                        <div className="text-sm text-gray-500">Average Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "resources" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Course Resources</h3>
                    <div className="space-y-3">
                      {module.content.resources.map((resource, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{resource.title}</div>
                            <div className="text-sm text-gray-500 capitalize">{resource.type}</div>
                          </div>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Level:</span>
                        <Badge
                          variant={
                            module.level === "Beginner"
                              ? "default"
                              : module.level === "Intermediate"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {module.level}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="capitalize">{module.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span>{new Date(module.lastUpdated).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Languages:</span>
                        <span>{module.language.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>

            <div className="border-t pt-4 mt-6">
              <div className="flex gap-3">
                <Button className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  {module.progress > 0 ? "Continue Learning" : "Start Learning"}
                </Button>
                <Button variant="outline">Add to Favorites</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
