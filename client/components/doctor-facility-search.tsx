"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MapPin, Star, Phone, Globe, ChevronLeft, ChevronRight, Zap, Award, Heart, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface Doctor {
  id: string
  name: string
  specialty: string
  qualification: string
  experience: number
  rating: number
  reviewCount: number
  location: string
  distance: number
  phone: string
  website?: string
  availability: "available" | "busy" | "offline"
  consultationFee: number
  image: string
  source: "Practo" | "JustDial" | "Healthgrades" | "Local Directory"
  isLoading: boolean
  reviewHighlights: string[]
  specialBadges: string[]
  emergencyAvailable: boolean
}

const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiologist",
    qualification: "MD, DM Cardiology",
    experience: 15,
    rating: 4.8,
    reviewCount: 342,
    location: "Apollo Hospital, Delhi",
    distance: 2.3,
    phone: "+91-9876543210",
    website: "drrajeshkumar.com",
    availability: "available",
    consultationFee: 800,
    image: "/male-doctor.png",
    source: "Practo",
    isLoading: false,
    reviewHighlights: ["excellent cardiologist", "very experienced", "patient friendly"],
    specialBadges: ["Heart Specialist", "Emergency Care"],
    emergencyAvailable: true,
  },
  {
    id: "2",
    name: "Dr. Priya Sharma",
    specialty: "Neurologist",
    qualification: "MBBS, MD Neurology",
    experience: 12,
    rating: 4.9,
    reviewCount: 256,
    location: "Max Hospital, Mumbai",
    distance: 1.8,
    phone: "+91-9876543211",
    availability: "busy",
    consultationFee: 1200,
    image: "/female-doctor.png",
    source: "JustDial",
    isLoading: true,
    reviewHighlights: ["best neurologist", "accurate diagnosis", "caring doctor"],
    specialBadges: ["Brain Specialist", "Migraine Expert"],
    emergencyAvailable: false,
  },
  {
    id: "3",
    name: "Dr. Michael Chen",
    specialty: "Orthopedic Surgeon",
    qualification: "MS Orthopedics",
    experience: 18,
    rating: 4.7,
    reviewCount: 189,
    location: "Fortis Hospital, Bangalore",
    distance: 3.1,
    phone: "+91-9876543212",
    availability: "available",
    consultationFee: 1000,
    image: "/male-doctor-glasses.png",
    source: "Healthgrades",
    isLoading: false,
    reviewHighlights: ["skilled surgeon", "joint replacement expert", "quick recovery"],
    specialBadges: ["Joint Specialist", "Sports Medicine"],
    emergencyAvailable: true,
  },
  {
    id: "4",
    name: "Dr. Sarah Williams",
    specialty: "Pediatrician",
    qualification: "MBBS, MD Pediatrics",
    experience: 10,
    rating: 4.6,
    reviewCount: 423,
    location: "Children's Hospital, Chennai",
    distance: 4.2,
    phone: "+91-9876543213",
    availability: "offline",
    consultationFee: 600,
    image: "/emma-hayes-doctor.png",
    source: "Local Directory",
    isLoading: true,
    reviewHighlights: ["child friendly", "gentle approach", "experienced pediatrician"],
    specialBadges: ["Child Care", "Vaccination Expert"],
    emergencyAvailable: false,
  },
]

export default function DoctorFacilitySearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filteredDoctors, setFilteredDoctors] = useState(doctors)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true)
      // Simulate search delay
      const timer = setTimeout(() => {
        const filtered = doctors.filter(
          (doctor) =>
            doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.location.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        setFilteredDoctors(filtered)
        setIsSearching(false)
      }, 1500)
      return () => clearTimeout(timer)
    } else {
      setFilteredDoctors(doctors)
      setIsSearching(false)
    }
  }, [searchQuery])

  const getAvailabilityConfig = (availability: string) => {
    switch (availability) {
      case "available":
        return { color: "bg-green-500", textColor: "text-green-800", bgColor: "bg-green-100" }
      case "busy":
        return { color: "bg-yellow-500", textColor: "text-yellow-800", bgColor: "bg-yellow-100" }
      case "offline":
        return { color: "bg-red-500", textColor: "text-red-800", bgColor: "bg-red-100" }
      default:
        return { color: "bg-gray-500", textColor: "text-gray-800", bgColor: "bg-gray-100" }
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case "Practo":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "JustDial":
        return "bg-green-100 text-green-800 border-green-200"
      case "Healthgrades":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, filteredDoctors.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + Math.max(1, filteredDoctors.length - 2)) % Math.max(1, filteredDoctors.length - 2),
    )
  }

  const DoctorCard = ({ doctor, isVisible }: { doctor: Doctor; isVisible: boolean }) => {
    const availabilityConfig = getAvailabilityConfig(doctor.availability)

    return (
      <div
        className={cn(
          "relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 transition-all duration-500 min-w-[320px]",
          isVisible ? "opacity-100 scale-100" : "opacity-60 scale-95",
          doctor.isLoading && "overflow-hidden",
        )}
      >
        {/* Shimmer Loading Effect */}
        {(doctor.isLoading || isSearching) && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        )}

        {/* Scanning Bar Animation */}
        {(doctor.isLoading || isSearching) && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500 animate-scan" />
        )}

        {/* Source Badge */}
        <div className="absolute top-4 right-4">
          <Badge className={cn("text-xs", getSourceColor(doctor.source))}>
            <Globe className="w-3 h-3 mr-1" />
            {doctor.source}
          </Badge>
        </div>

        {/* Emergency Badge */}
        {doctor.emergencyAvailable && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-100 text-red-800 text-xs animate-pulse">
              <Zap className="w-3 h-3 mr-1" />
              24/7 Emergency
            </Badge>
          </div>
        )}

        <div className="flex items-start gap-4 mt-8">
          {/* Doctor Avatar */}
          <div className="relative">
            <Avatar className="w-16 h-16 ring-2 ring-white/20">
              <AvatarImage src={doctor.image || "/placeholder.svg"} />
              <AvatarFallback>
                {doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {/* Availability Indicator */}
            <div
              className={cn(
                "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white",
                availabilityConfig.color,
              )}
            />
          </div>

          {/* Doctor Details */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-lg text-gray-800 mb-1">{doctor.name}</h4>
            <p className="text-blue-600 font-medium mb-1">{doctor.specialty}</p>
            <p className="text-sm text-gray-600 mb-2">{doctor.qualification}</p>

            {/* Rating & Experience */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{doctor.rating}</span>
                <span className="text-sm text-gray-500">({doctor.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">{doctor.experience}y exp</span>
              </div>
            </div>

            {/* Location & Distance */}
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{doctor.location}</span>
              <span className="text-sm text-blue-600">• {doctor.distance} km</span>
            </div>

            {/* Special Badges */}
            <div className="flex flex-wrap gap-1 mb-3">
              {doctor.specialBadges.map((badge, index) => (
                <Badge key={index} className="bg-purple-100 text-purple-800 text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  {badge}
                </Badge>
              ))}
            </div>

            {/* Review Highlights */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Review Highlights:</p>
              <div className="flex flex-wrap gap-1">
                {doctor.reviewHighlights.map((highlight, index) => (
                  <Badge
                    key={index}
                    className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 text-xs animate-glow"
                  >
                    "{highlight}"
                  </Badge>
                ))}
              </div>
            </div>

            {/* Consultation Fee & Availability */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-lg font-bold text-green-600">₹{doctor.consultationFee}</span>
                <span className="text-sm text-gray-500 ml-1">consultation</span>
              </div>
              <Badge className={cn("capitalize", availabilityConfig.bgColor, availabilityConfig.textColor)}>
                {doctor.availability}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" disabled={doctor.availability === "offline"}>
                <Heart className="w-4 h-4 mr-2" />
                Book Now
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
            </div>
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
            <Search className="w-5 h-5 text-blue-600" />
            Doctor & Facility Search
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">Find healthcare providers from multiple platforms</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800">
            <Globe className="w-3 h-3 mr-1" />
            Web Scraped
          </Badge>
          <Badge className="bg-green-100 text-green-800">{filteredDoctors.length} Providers Found</Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search doctors, specialties, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm border-white/30 rounded-full text-gray-800 placeholder-gray-500 focus:bg-white/30 transition-all duration-300"
          />
          {isSearching && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Doctor Cards Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm"
            onClick={prevSlide}
            disabled={filteredDoctors.length <= 3}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm"
            onClick={nextSlide}
            disabled={filteredDoctors.length <= 3}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Cards Container */}
          <div className="overflow-hidden px-12">
            <div
              className="flex gap-4 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 340}px)` }}
            >
              {filteredDoctors.map((doctor, index) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  isVisible={index >= currentIndex && index < currentIndex + 3}
                />
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isSearching && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Searching across platforms...</p>
              </div>
            </div>
          )}
        </div>

        {/* Platform Sources */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <p className="text-sm text-gray-500">Data sources:</p>
          <div className="flex gap-2">
            {["Practo", "JustDial", "Healthgrades", "Local Directory"].map((source) => (
              <Badge key={source} variant="outline" className="text-xs">
                {source}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
