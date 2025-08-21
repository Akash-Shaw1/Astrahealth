"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  MapPin,
  Star,
  Phone,
  Navigation,
  Heart,
  Brain,
  Bone,
  Eye,
  Baby,
  Stethoscope,
  Map,
  Grid3X3,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Hospital {
  id: string
  name: string
  type: "government" | "private" | "specialty"
  location: string
  coordinates: { lat: number; lng: number }
  distance: number
  overallRating: number
  reviewCount: number
  phone: string
  website?: string
  image: string
  departments: {
    name: string
    rating: number
    sentiment: "positive" | "neutral" | "negative"
    keyStrengths: string[]
    keyWeaknesses: string[]
    icon: any
  }[]
  nlpInsights: {
    strengths: string[]
    weaknesses: string[]
    specialtyIndex: number
    emergencyRating: number
  }
  isEmergencyAvailable: boolean
}

const hospitals: Hospital[] = [
  {
    id: "1",
    name: "Apollo Hospital",
    type: "private",
    location: "Greams Lane, Chennai",
    coordinates: { lat: 13.0827, lng: 80.2707 },
    distance: 2.1,
    overallRating: 4.6,
    reviewCount: 1247,
    phone: "+91-44-2829-3333",
    website: "apollohospitals.com",
    image: "/apollo-hospital.png",
    departments: [
      {
        name: "Cardiology",
        rating: 4.8,
        sentiment: "positive",
        keyStrengths: ["excellent surgeons", "advanced equipment", "quick response"],
        keyWeaknesses: ["expensive", "long wait times"],
        icon: Heart,
      },
      {
        name: "Neurology",
        rating: 4.7,
        sentiment: "positive",
        keyStrengths: ["experienced doctors", "good facilities"],
        keyWeaknesses: ["limited slots"],
        icon: Brain,
      },
      {
        name: "Orthopedics",
        rating: 4.2,
        sentiment: "neutral",
        keyStrengths: ["skilled surgeons"],
        keyWeaknesses: ["slow paperwork", "crowded"],
        icon: Bone,
      },
      {
        name: "Emergency",
        rating: 4.5,
        sentiment: "positive",
        keyStrengths: ["24/7 available", "quick response"],
        keyWeaknesses: ["expensive"],
        icon: Stethoscope,
      },
    ],
    nlpInsights: {
      strengths: ["excellent cardiac care", "advanced technology", "experienced doctors"],
      weaknesses: ["high costs", "long waiting times", "complex billing"],
      specialtyIndex: 9.2,
      emergencyRating: 4.5,
    },
    isEmergencyAvailable: true,
  },
  {
    id: "2",
    name: "Government General Hospital",
    type: "government",
    location: "Park Town, Chennai",
    coordinates: { lat: 13.0878, lng: 80.2785 },
    distance: 3.8,
    overallRating: 3.9,
    reviewCount: 892,
    phone: "+91-44-2819-2000",
    image: "/government-hospital.png",
    departments: [
      {
        name: "Emergency",
        rating: 4.1,
        sentiment: "positive",
        keyStrengths: ["always available", "affordable", "good trauma care"],
        keyWeaknesses: ["overcrowded", "long queues"],
        icon: Stethoscope,
      },
      {
        name: "General Medicine",
        rating: 3.8,
        sentiment: "neutral",
        keyStrengths: ["experienced doctors", "affordable"],
        keyWeaknesses: ["outdated equipment", "slow service"],
        icon: Heart,
      },
      {
        name: "Pediatrics",
        rating: 4.0,
        sentiment: "positive",
        keyStrengths: ["caring staff", "affordable"],
        keyWeaknesses: ["limited resources"],
        icon: Baby,
      },
    ],
    nlpInsights: {
      strengths: ["affordable healthcare", "good emergency care", "experienced staff"],
      weaknesses: ["overcrowded", "outdated facilities", "long wait times"],
      specialtyIndex: 6.8,
      emergencyRating: 4.1,
    },
    isEmergencyAvailable: true,
  },
  {
    id: "3",
    name: "Sankara Eye Hospital",
    type: "specialty",
    location: "Nungambakkam, Chennai",
    coordinates: { lat: 13.0569, lng: 80.2378 },
    distance: 4.2,
    overallRating: 4.8,
    reviewCount: 567,
    phone: "+91-44-2827-1616",
    website: "sankaraeye.com",
    image: "/sankara-eye-hospital.png",
    departments: [
      {
        name: "Ophthalmology",
        rating: 4.9,
        sentiment: "positive",
        keyStrengths: ["world-class surgeons", "latest technology", "excellent outcomes"],
        keyWeaknesses: ["expensive", "booking challenges"],
        icon: Eye,
      },
      {
        name: "Retina Services",
        rating: 4.8,
        sentiment: "positive",
        keyStrengths: ["specialized care", "advanced procedures"],
        keyWeaknesses: ["limited availability"],
        icon: Eye,
      },
    ],
    nlpInsights: {
      strengths: ["world-class eye care", "cutting-edge technology", "excellent success rates"],
      weaknesses: ["high costs", "limited to eye care only"],
      specialtyIndex: 9.8,
      emergencyRating: 3.2,
    },
    isEmergencyAvailable: false,
  },
]

export default function HospitalFinder() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  const [hoveredHospital, setHoveredHospital] = useState<string | null>(null)

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.departments.some((dept) => dept.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getSentimentIcon = (sentiment: string, trend?: "up" | "down" | "stable") => {
    if (trend === "up") return TrendingUp
    if (trend === "down") return TrendingDown
    if (trend === "stable") return Minus
    return sentiment === "positive" ? TrendingUp : sentiment === "negative" ? TrendingDown : Minus
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  const HospitalCube = ({ hospital }: { hospital: Hospital }) => {
    const isHovered = hoveredHospital === hospital.id

    return (
      <div
        className="relative w-full h-80 perspective-1000 cursor-pointer"
        onMouseEnter={() => setHoveredHospital(hospital.id)}
        onMouseLeave={() => setHoveredHospital(null)}
        onClick={() => setSelectedHospital(hospital)}
      >
        <div
          className={cn(
            "relative w-full h-full transition-transform duration-700 transform-style-preserve-3d",
            isHovered && "rotate-y-180",
          )}
        >
          {/* Front Face */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-2xl border border-white/20 backface-hidden p-6">
            {/* Hospital Type Badge */}
            <div className="absolute top-4 right-4">
              <Badge
                className={cn(
                  "capitalize text-xs",
                  hospital.type === "private"
                    ? "bg-blue-100 text-blue-800"
                    : hospital.type === "government"
                      ? "bg-green-100 text-green-800"
                      : "bg-purple-100 text-purple-800",
                )}
              >
                {hospital.type}
              </Badge>
            </div>

            {/* Emergency Badge */}
            {hospital.isEmergencyAvailable && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-red-100 text-red-800 text-xs animate-pulse">
                  <Stethoscope className="w-3 h-3 mr-1" />
                  Emergency
                </Badge>
              </div>
            )}

            {/* Hospital Avatar */}
            <div className="flex justify-center mb-4 mt-8">
              <div
                className={cn(
                  "w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold animate-float",
                  hospital.specialtyIndex > 8 && "shadow-lg shadow-blue-200 animate-glow-pulse",
                )}
              >
                {hospital.name.charAt(0)}
              </div>
            </div>

            {/* Hospital Info */}
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg text-gray-800 mb-1">{hospital.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{hospital.location}</p>

              {/* Rating */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{hospital.overallRating}</span>
                <span className="text-sm text-gray-500">({hospital.reviewCount})</span>
              </div>

              {/* Distance */}
              <div className="flex items-center justify-center gap-1 mb-4">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{hospital.distance} km away</span>
              </div>
            </div>

            {/* Specialty Index Ring */}
            <div className="flex justify-center">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" stroke="rgba(0,0,0,0.1)" strokeWidth="4" fill="none" />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke={
                      hospital.specialtyIndex > 8 ? "#10B981" : hospital.specialtyIndex > 6 ? "#F59E0B" : "#EF4444"
                    }
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - hospital.specialtyIndex / 10)}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">{hospital.specialtyIndex}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-center text-gray-500 mt-2">Specialty Index</p>
          </div>

          {/* Back Face */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/20 backface-hidden rotate-y-180 p-6 text-white overflow-y-auto">
            <h4 className="font-bold text-lg mb-4 text-center">Department Analysis</h4>

            <div className="space-y-4">
              {hospital.departments.map((dept, index) => {
                const Icon = dept.icon
                const SentimentIcon = getSentimentIcon(dept.sentiment)

                return (
                  <div key={index} className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-blue-400" />
                        <span className="font-medium text-sm">{dept.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <SentimentIcon className={cn("w-4 h-4", getSentimentColor(dept.sentiment))} />
                        <span className="text-sm font-bold">{dept.rating}</span>
                      </div>
                    </div>

                    <Progress value={dept.rating * 20} className="h-2 mb-2" />

                    <div className="text-xs space-y-1">
                      <div>
                        <span className="text-green-400">Strengths: </span>
                        <span className="text-gray-300">{dept.keyStrengths.join(", ")}</span>
                      </div>
                      {dept.keyWeaknesses.length > 0 && (
                        <div>
                          <span className="text-red-400">Issues: </span>
                          <span className="text-gray-300">{dept.keyWeaknesses.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const MapView = () => (
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 h-96 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {/* Map Pins */}
      {filteredHospitals.map((hospital, index) => (
        <div
          key={hospital.id}
          className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 animate-bounce"
          style={{
            left: `${20 + index * 25}%`,
            top: `${30 + (index % 2) * 20}%`,
          }}
          onClick={() => setSelectedHospital(hospital)}
        >
          <div
            className={cn(
              "relative w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg",
              hospital.specialtyIndex > 8
                ? "bg-green-500 animate-glow-green"
                : hospital.specialtyIndex > 6
                  ? "bg-yellow-500 animate-glow-yellow"
                  : "bg-red-500 animate-glow-red",
            )}
          >
            {hospital.name.charAt(0)}
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded px-2 py-1 text-xs font-medium shadow-md whitespace-nowrap">
            {hospital.name}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
        <h4 className="font-semibold text-sm mb-2">Specialty Index</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Excellent (8.0+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Good (6.0-7.9)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Average (6.0-)</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            Hospital Finder
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">AI-powered hospital analysis with sentiment insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-100 text-purple-800">
            <Brain className="w-3 h-3 mr-1" />
            NLP Powered
          </Badge>
          <Badge className="bg-green-100 text-green-800">{filteredHospitals.length} Hospitals</Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search hospitals, departments, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm border-white/30 rounded-full text-gray-800 placeholder-gray-500 focus:bg-white/30 transition-all duration-300"
          />
        </div>

        {/* View Toggle */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "map")} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              Profile View
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Map View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            <div className="grid grid-cols-3 gap-6">
              {filteredHospitals.map((hospital) => (
                <HospitalCube key={hospital.id} hospital={hospital} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map">
            <MapView />
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Hospital Detail Modal */}
      {selectedHospital && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{selectedHospital.name}</h3>
                  <p className="text-gray-600">{selectedHospital.location}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedHospital(null)}>
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* NLP Insights */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">AI Analysis</h4>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h5 className="font-medium text-green-800 mb-2">Key Strengths</h5>
                    <ul className="space-y-1">
                      {selectedHospital.nlpInsights.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-green-700 flex items-center gap-2">
                          <TrendingUp className="w-3 h-3" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4">
                    <h5 className="font-medium text-red-800 mb-2">Areas for Improvement</h5>
                    <ul className="space-y-1">
                      {selectedHospital.nlpInsights.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm text-red-700 flex items-center gap-2">
                          <TrendingDown className="w-3 h-3" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Department Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Department Ratings</h4>
                  {selectedHospital.departments.map((dept, index) => {
                    const Icon = dept.icon
                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">{dept.name}</span>
                          </div>
                          <span className="font-bold text-lg">{dept.rating}/5</span>
                        </div>
                        <Progress value={dept.rating * 20} className="mb-2" />
                        <div className="text-sm text-gray-600">
                          <p>
                            <strong>Strengths:</strong> {dept.keyStrengths.join(", ")}
                          </p>
                          {dept.keyWeaknesses.length > 0 && (
                            <p>
                              <strong>Issues:</strong> {dept.keyWeaknesses.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Hospital
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
