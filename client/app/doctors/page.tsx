"use client"

import { useState } from "react"
import {
  Search,
  MapPin,
  Star,
  Clock,
  Phone,
  Calendar,
  Filter,
  Heart,
  Brain,
  Eye,
  Stethoscope,
  Baby,
  Bone,
  Shield,
  User,
  Award,
  CheckCircle2,
  Video,
  MessageSquare,
  Navigation,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/dashboard-layout"

const specialties = [
  { id: "all", name: "All Specialties", icon: Stethoscope, count: 1247 },
  { id: "cardiology", name: "Cardiology", icon: Heart, count: 156 },
  { id: "neurology", name: "Neurology", icon: Brain, count: 89 },
  { id: "ophthalmology", name: "Ophthalmology", icon: Eye, count: 67 },
  { id: "pediatrics", name: "Pediatrics", icon: Baby, count: 134 },
  { id: "orthopedics", name: "Orthopedics", icon: Bone, count: 98 },
  { id: "dermatology", name: "Dermatology", icon: Shield, count: 76 },
]

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 234,
    experience: "15 years",
    location: "Heart Care Center, Downtown",
    distance: "0.8 miles",
    avatar: "/female-doctor.png",
    nextAvailable: "Today 2:30 PM",
    consultationFee: 150,
    languages: ["English", "Spanish"],
    education: "Harvard Medical School",
    certifications: ["Board Certified Cardiologist", "FACC"],
    acceptsInsurance: true,
    telemedicine: true,
    inNetwork: true,
    about: "Specialized in preventive cardiology and heart disease management with over 15 years of experience.",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    rating: 4.8,
    reviews: 189,
    experience: "12 years",
    location: "Neuro Specialists, Midtown",
    distance: "1.2 miles",
    avatar: "/male-doctor.png",
    nextAvailable: "Tomorrow 9:00 AM",
    consultationFee: 180,
    languages: ["English", "Mandarin"],
    education: "Johns Hopkins University",
    certifications: ["Board Certified Neurologist", "Epilepsy Specialist"],
    acceptsInsurance: true,
    telemedicine: true,
    inNetwork: true,
    about: "Expert in treating neurological disorders including epilepsy, migraines, and movement disorders.",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Dermatologist",
    rating: 4.7,
    reviews: 156,
    experience: "10 years",
    location: "Skin Health Clinic, Uptown",
    distance: "2.1 miles",
    avatar: "/emma-hayes-doctor.png",
    nextAvailable: "Dec 25, 11:00 AM",
    consultationFee: 120,
    languages: ["English", "Spanish", "Portuguese"],
    education: "Stanford Medical School",
    certifications: ["Board Certified Dermatologist", "Mohs Surgery"],
    acceptsInsurance: true,
    telemedicine: false,
    inNetwork: true,
    about: "Specializes in medical and cosmetic dermatology with expertise in skin cancer treatment.",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Orthopedist",
    rating: 4.6,
    reviews: 198,
    experience: "18 years",
    location: "Orthopedic Associates, Westside",
    distance: "3.4 miles",
    avatar: "/male-doctor-glasses.png",
    nextAvailable: "Dec 26, 3:15 PM",
    consultationFee: 200,
    languages: ["English"],
    education: "Mayo Clinic",
    certifications: ["Board Certified Orthopedic Surgeon", "Sports Medicine"],
    acceptsInsurance: true,
    telemedicine: false,
    inNetwork: false,
    about: "Specializes in sports medicine and joint replacement surgery with extensive surgical experience.",
  },
]

const quickFilters = [
  { id: "available-today", label: "Available Today", count: 23 },
  { id: "telemedicine", label: "Telemedicine", count: 156 },
  { id: "in-network", label: "In Network", count: 89 },
  { id: "highly-rated", label: "4.5+ Rating", count: 234 },
]

const topRatedDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.9,
    avatar: "/female-doctor.png",
  },
  {
    id: 2,
    name: "Dr. Lisa Park",
    specialty: "Pediatrician",
    rating: 4.8,
    avatar: "/female-doctor.png",
  },
  {
    id: 3,
    name: "Dr. Robert Kim",
    specialty: "Orthopedist",
    rating: 4.7,
    avatar: "/male-doctor.png",
  },
]

export default function DoctorFacilitySearch() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState<(typeof doctors)[0] | null>(null)
  const [activeTab, setActiveTab] = useState("doctors")

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedSpecialty === "all") return matchesSearch
    return matchesSearch && doctor.specialty.toLowerCase().includes(selectedSpecialty)
  })

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor & Facility Search</h1>
              <p className="text-gray-600">Find and book appointments with healthcare providers near you</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/60 backdrop-blur-sm">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Quick Filters */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search doctors, specialties, or medical facilities..."
              className="pl-12 h-12 bg-white/60 backdrop-blur-sm border-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8">
              <Navigation className="w-4 h-4 mr-2" />
              Near Me
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-3 mb-6">
            {quickFilters.map((filter) => (
              <Button
                key={filter.id}
                variant="outline"
                className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-blue-50"
              >
                {filter.label}
                <Badge variant="secondary" className="ml-2">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Specialty Filters */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {specialties.map((specialty) => {
              const Icon = specialty.icon
              return (
                <Button
                  key={specialty.id}
                  variant={selectedSpecialty === specialty.id ? "default" : "outline"}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    selectedSpecialty === specialty.id
                      ? "bg-blue-500 text-white"
                      : "bg-white/60 backdrop-blur-sm border-white/20"
                  }`}
                  onClick={() => setSelectedSpecialty(specialty.id)}
                >
                  <Icon className="w-4 h-4" />
                  {specialty.name}
                  <Badge variant="secondary" className="ml-1">
                    {specialty.count}
                  </Badge>
                </Button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="bg-white/60 backdrop-blur-sm">
                <TabsTrigger value="doctors">Doctors ({filteredDoctors.length})</TabsTrigger>
                <TabsTrigger value="facilities">Medical Facilities (45)</TabsTrigger>
                <TabsTrigger value="urgent-care">Urgent Care (12)</TabsTrigger>
              </TabsList>
            </Tabs>

            <TabsContent value="doctors">
              <div className="space-y-4">
                {filteredDoctors.map((doctor) => (
                  <Card key={doctor.id} className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        {/* Doctor Avatar */}
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {doctor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        {/* Doctor Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                              <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
                              <div className="flex items-center gap-4 mb-2">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{doctor.rating}</span>
                                  <span className="text-gray-500">({doctor.reviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-500">
                                  <User className="w-4 h-4" />
                                  {doctor.experience} experience
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600 mb-3">
                                <MapPin className="w-4 h-4" />
                                {doctor.location} • {doctor.distance}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600 mb-1">${doctor.consultationFee}</div>
                              <p className="text-sm text-gray-500 mb-2">Consultation fee</p>
                              <div className="flex gap-2">
                                {doctor.telemedicine && (
                                  <Badge className="bg-blue-100 text-blue-800">
                                    <Video className="w-3 h-3 mr-1" />
                                    Telemedicine
                                  </Badge>
                                )}
                                {doctor.inNetwork && (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    In Network
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-4">{doctor.about}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-1 text-green-600">
                                <Clock className="w-4 h-4" />
                                Next: {doctor.nextAvailable}
                              </div>
                              <div className="flex items-center gap-1 text-gray-500">
                                <Award className="w-4 h-4" />
                                {doctor.education}
                              </div>
                              <div className="text-gray-500">Languages: {doctor.languages.join(", ")}</div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setSelectedDoctor(doctor)}>
                                View Profile
                              </Button>
                              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                                <Calendar className="w-4 h-4 mr-2" />
                                Book Appointment
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="facilities">
              <div className="text-center py-12">
                <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Medical Facilities</h3>
                <p className="text-gray-600">Search and discover medical facilities in your area</p>
              </div>
            </TabsContent>

            <TabsContent value="urgent-care">
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Urgent Care Centers</h3>
                <p className="text-gray-600">Find urgent care centers for immediate medical attention</p>
              </div>
            </TabsContent>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Rated Doctors */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Top Rated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topRatedDoctors.map((doctor) => (
                    <div key={doctor.id} className="flex items-center gap-3 p-3 bg-yellow-50/50 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{doctor.name}</div>
                        <div className="text-xs text-gray-500">{doctor.specialty}</div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{doctor.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">Quick Actions</span>
                </div>
                <div className="space-y-3">
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20">
                    <Video className="w-4 h-4 mr-2" />
                    Virtual Consultation
                  </Button>
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Doctor
                  </Button>
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Search Tips */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-sm">Search Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>Use specific symptoms or conditions for better results</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>Check if the doctor accepts your insurance</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>Read reviews and ratings from other patients</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>Consider telemedicine for convenience</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Doctor Profile Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={selectedDoctor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedDoctor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{selectedDoctor.name}</CardTitle>
                      <p className="text-blue-600 font-medium">{selectedDoctor.specialty}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{selectedDoctor.rating}</span>
                        <span className="text-gray-500">({selectedDoctor.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedDoctor(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">About</h4>
                    <p className="text-gray-600">{selectedDoctor.about}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Education & Certifications</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <strong>Education:</strong> {selectedDoctor.education}
                      </p>
                      <div>
                        <strong className="text-sm">Certifications:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedDoctor.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Location</h4>
                      <p className="text-sm text-gray-600">{selectedDoctor.location}</p>
                      <p className="text-sm text-gray-500">{selectedDoctor.distance} away</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Languages</h4>
                      <p className="text-sm text-gray-600">{selectedDoctor.languages.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t">
                    <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Appointment - ${selectedDoctor.consultationFee}
                    </Button>
                    {selectedDoctor.telemedicine && (
                      <Button variant="outline">
                        <Video className="w-4 h-4 mr-2" />
                        Video Call
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
