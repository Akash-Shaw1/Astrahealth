"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Play,
  Clock,
  Users,
  Star,
  Search,
  Filter,
  Award,
  TrendingUp,
  Heart,
  Brain,
  Activity,
  Shield,
  Pill,
  Baby,
  SortAsc,
  SortDesc,
  Grid,
  List,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import DashboardLayout from "@/components/dashboard-layout"
import educationData from "@/data/education-modules.json"

const categoryIcons = {
  all: BookOpen,
  cardiology: Heart,
  psychology: Brain,
  nutrition: Activity,
  prevention: Shield,
  hygiene: Pill,
  emergency: Baby,
  endocrinology: Activity,
}

export default function HealthEducationHub() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popularity")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredAndSortedModules = useMemo(() => {
    const filtered = educationData.modules.filter((module) => {
      // Category filter
      if (selectedCategory !== "all" && module.category !== selectedCategory) {
        return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = module.title.toLowerCase().includes(query)
        const matchesDescription = module.description.toLowerCase().includes(query)
        const matchesTags = module.tags.some((tag) => tag.toLowerCase().includes(query))
        const matchesInstructor = module.instructor.toLowerCase().includes(query)

        if (!matchesTitle && !matchesDescription && !matchesTags && !matchesInstructor) {
          return false
        }
      }

      // Level filter
      if (selectedLevels.length > 0 && !selectedLevels.includes(module.level)) {
        return false
      }

      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(module.type)) {
        return false
      }

      // Source filter
      if (selectedSources.length > 0 && !selectedSources.includes(module.source)) {
        return false
      }

      return true
    })

    // Sort modules
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "duration":
          aValue = Number.parseInt(a.duration.replace(/[^\d]/g, ""))
          bValue = Number.parseInt(b.duration.replace(/[^\d]/g, ""))
          break
        case "rating":
          aValue = a.rating
          bValue = b.rating
          break
        case "students":
          aValue = a.students
          bValue = b.students
          break
        case "lastUpdated":
          aValue = new Date(a.lastUpdated)
          bValue = new Date(b.lastUpdated)
          break
        case "popularity":
        default:
          aValue = a.popularity
          bValue = b.popularity
          break
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [selectedCategory, searchQuery, sortBy, sortOrder, selectedLevels, selectedTypes, selectedSources])

  const categoriesWithCounts = useMemo(() => {
    return educationData.categories.map((category) => ({
      ...category,
      count:
        category.id === "all"
          ? educationData.modules.length
          : educationData.modules.filter((m) => m.category === category.id).length,
    }))
  }, [])

  const handleStartLearning = (moduleId: string) => {
    router.push(`/education/${moduleId}`)
  }

  const clearFilters = () => {
    setSelectedLevels([])
    setSelectedTypes([])
    setSelectedSources([])
    setSearchQuery("")
    setSelectedCategory("all")
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Education Hub</h1>
              <p className="text-gray-600">Expand your medical knowledge with expert-led courses and resources</p>
            </div>
            <div className="flex gap-3">
              <div className="flex bg-white/60 backdrop-blur-sm rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="bg-white/60 backdrop-blur-sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                    {selectedLevels.length + selectedTypes.length + selectedSources.length > 0 && (
                      <Badge className="ml-2 bg-blue-500 text-white">
                        {selectedLevels.length + selectedTypes.length + selectedSources.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filters</h4>
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear All
                      </Button>
                    </div>

                    {/* Level Filter */}
                    <div>
                      <h5 className="text-sm font-medium mb-2">Level</h5>
                      <div className="space-y-2">
                        {educationData.filters.levels.map((level) => (
                          <div key={level} className="flex items-center space-x-2">
                            <Checkbox
                              id={`level-${level}`}
                              checked={selectedLevels.includes(level)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedLevels([...selectedLevels, level])
                                } else {
                                  setSelectedLevels(selectedLevels.filter((l) => l !== level))
                                }
                              }}
                            />
                            <label htmlFor={`level-${level}`} className="text-sm">
                              {level}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Type Filter */}
                    <div>
                      <h5 className="text-sm font-medium mb-2">Type</h5>
                      <div className="space-y-2">
                        {educationData.filters.types.map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`type-${type}`}
                              checked={selectedTypes.includes(type)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedTypes([...selectedTypes, type])
                                } else {
                                  setSelectedTypes(selectedTypes.filter((t) => t !== type))
                                }
                              }}
                            />
                            <label htmlFor={`type-${type}`} className="text-sm capitalize">
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Source Filter */}
                    <div>
                      <h5 className="text-sm font-medium mb-2">Source</h5>
                      <div className="space-y-2">
                        {educationData.filters.sources.map((source) => (
                          <div key={source} className="flex items-center space-x-2">
                            <Checkbox
                              id={`source-${source}`}
                              checked={selectedSources.includes(source)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedSources([...selectedSources, source])
                                } else {
                                  setSelectedSources(selectedSources.filter((s) => s !== source))
                                }
                              }}
                            />
                            <label htmlFor={`source-${source}`} className="text-sm">
                              {source}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Catalog
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="mb-8">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search courses, topics, or instructors..."
                className="pl-12 h-12 bg-white/60 backdrop-blur-sm border-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-white/60 backdrop-blur-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="students">Students</SelectItem>
                <SelectItem value="lastUpdated">Last Updated</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              className="bg-white/60 backdrop-blur-sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {categoriesWithCounts.map((category) => {
              const Icon = categoryIcons[category.id as keyof typeof categoryIcons] || BookOpen
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    selectedCategory === category.id
                      ? "bg-blue-500 text-white"
                      : "bg-white/60 backdrop-blur-sm border-white/20"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                  <Badge variant="secondary" className="ml-1">
                    {category.count}
                  </Badge>
                </Button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="col-span-3 space-y-8">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Search Results (${filteredAndSortedModules.length})` : "All Courses"}
              </h2>
              <div className="text-sm text-gray-500">
                Showing {filteredAndSortedModules.length} of {educationData.modules.length} courses
              </div>
            </div>

            <div className={viewMode === "grid" ? "grid grid-cols-1 gap-6" : "space-y-4"}>
              {filteredAndSortedModules.map((module) => (
                <Card
                  key={module.id}
                  className="bg-white/60 backdrop-blur-sm border-white/20 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className={viewMode === "grid" ? "flex" : "flex items-center"}>
                    <div className={viewMode === "grid" ? "w-80 h-48" : "w-32 h-24"}>
                      <img
                        src={module.image || "/placeholder.svg"}
                        alt={module.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
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
                            <Badge className="text-xs capitalize">{module.category}</Badge>
                            {module.verified && (
                              <Badge className="bg-emerald-100 text-emerald-800 text-xs">Verified</Badge>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                          <p className="text-gray-600 mb-4">{module.description}</p>
                        </div>
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

                      <div className="flex items-center gap-6 mb-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {module.instructor}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {module.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {module.lessons} lessons
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {module.rating} ({module.students.toLocaleString()})
                        </div>
                      </div>

                      {module.progress > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-gray-500">{module.progress}%</span>
                          </div>
                          <Progress value={module.progress} className="h-2" />
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button className="flex-1" onClick={() => handleStartLearning(module.id)}>
                          <Play className="w-4 h-4 mr-2" />
                          {module.progress > 0 ? "Continue Learning" : "Start Learning"}
                        </Button>
                        <Button variant="outline">Preview</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredAndSortedModules.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Progress */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">12</div>
                    <div className="text-sm text-gray-500">Courses Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">47h</div>
                    <div className="text-sm text-gray-500">Total Learning Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">8</div>
                    <div className="text-sm text-gray-500">Certificates Earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 1, title: "Knowledge Seeker", description: "Complete 5 courses", progress: 80, total: 5 },
                    { id: 2, title: "Health Expert", description: "Earn 10 certificates", progress: 60, total: 10 },
                    { id: 3, title: "Daily Learner", description: "7-day learning streak", progress: 100, total: 7 },
                  ].map((achievement) => (
                    <div key={achievement.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">{achievement.title}</div>
                        <div className="text-xs text-gray-500">
                          {Math.round((achievement.progress / 100) * achievement.total)}/{achievement.total}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">{achievement.description}</div>
                      <Progress value={achievement.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended for You */}
            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-semibold">Recommended</span>
                </div>
                <h3 className="font-bold mb-2">Advanced Diagnostics</h3>
                <p className="text-purple-100 text-sm mb-4">
                  Master modern diagnostic techniques and interpretation methods
                </p>
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20">
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
