"use client"

import { useState } from "react"
import {
  Search,
  MapPin,
  Star,
  Clock,
  Phone,
  Navigation,
  Filter,
  Building2,
  Heart,
  Brain,
  Baby,
  Ambulance,
  Award,
  Bed,
  Car,
  Wifi,
  Coffee,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/dashboard-layout"

const hospitalTypes = [
  { id: "all", name: "All Hospitals", icon: Building2, count: 156 },
  { id: "general", name: "General Hospital", icon: Building2, count: 89 },
  { id: "specialty", name: "Specialty Center", icon: Heart, count: 34 },
  { id: "emergency", name: "Emergency Care", icon: Ambulance, count: 23 },
  { id: "pediatric", name: "Pediatric", icon: Baby, count: 18 },
  { id: "psychiatric", name: "Psychiatric", icon: Brain, count: 12 },
]

const hospitals = [
  {
    id: 1,
    name: "Apollo Gleneagles Hospitals",
    type: "Multispecialty Hospital",
    rating: 4.7,
    reviews: 1523,
    distance: "2.4 km",
    address: "58, Canal Circular Road, Kadapara, Phool Bagan, Kolkata",
    phone: "+91 33 2320 3040",
    website: "www.apollogleneagles.in",
    emergencyRoom: true,
    trauma: "Level 1",
    beds: 700,
    specialties: ["Cardiology", "Oncology", "Neurology", "Orthopedics", "Emergency Medicine"],
    amenities: ["Parking", "Pharmacy", "Cafeteria", "WiFi", "Blood Bank"],
    insurance: ["Star Health", "HDFC Ergo", "ICICI Lombard", "Medi Assist", "Care Health"],
    waitTime: "20 min",
    status: "Open 24/7",
    image: "/hospitals-placeholder.jpg",
    accreditation: ["NABH", "JCI"],
    description: "One of Kolkata’s most reputed multispecialty hospitals with international standards of care."
  },
  {
    id: 2,
    name: "Fortis Hospital Anandapur",
    type: "Multispecialty Hospital",
    rating: 4.6,
    reviews: 987,
    distance: "5.1 km",
    address: "730, Anandapur, E.M. Bypass, Kolkata",
    phone: "+91 33 6628 4444",
    website: "www.fortishealthcare.com",
    emergencyRoom: true,
    trauma: "Level 2",
    beds: 400,
    specialties: ["Neurosciences", "Orthopedics", "Gastroenterology", "Critical Care"],
    amenities: ["Parking", "Pharmacy", "WiFi", "Cafeteria"],
    insurance: ["Star Health", "New India Assurance", "HDFC Ergo"],
    waitTime: "25 min",
    status: "Open 24/7",
    image: "/hospitals-placeholder.jpg",
    accreditation: ["NABH"],
    description: "Modern facility offering advanced treatments across multiple specialties in Eastern India."
  },
  {
    id: 3,
    name: "AMRI Hospitals Dhakuria",
    type: "General Hospital",
    rating: 4.5,
    reviews: 1134,
    distance: "7.8 km",
    address: "P-4 & 5, Gariahat Road (S), Dhakuria, Kolkata",
    phone: "+91 33 6626 0000",
    website: "www.amrihospitals.in",
    emergencyRoom: true,
    trauma: "Level 2",
    beds: 350,
    specialties: ["Internal Medicine", "Cardiology", "Oncology", "Urology", "Gynecology"],
    amenities: ["Parking", "Cafeteria", "Pharmacy", "WiFi"],
    insurance: ["Medi Assist", "ICICI Lombard", "Oriental Insurance"],
    waitTime: "18 min",
    status: "Open 24/7",
    image: "/hospitals-placeholder.jpg",
    accreditation: ["NABH"],
    description: "Trusted healthcare brand in Kolkata with multiple specialties and advanced diagnostic services."
  },
  {
    id: 4,
    name: "Peerless Hospital & B.K. Roy Research Center",
    type: "General Hospital",
    rating: 4.4,
    reviews: 856,
    distance: "9.2 km",
    address: "360 Panchasayar, E.M. Bypass, Kolkata",
    phone: "+91 33 2462 1234",
    website: "www.peerlesshospital.com",
    emergencyRoom: true,
    trauma: "Level 2",
    beds: 400,
    specialties: ["Cardiology", "Nephrology", "General Surgery", "Pediatrics"],
    amenities: ["Pharmacy", "WiFi", "Parking", "Cafeteria"],
    insurance: ["Star Health", "HDFC Ergo", "Bajaj Allianz"],
    waitTime: "22 min",
    status: "Open 24/7",
    image: "/hospitals-placeholder.jpg",
    accreditation: ["NABH"],
    description: "Comprehensive tertiary care hospital with focus on patient-friendly services."
  },
  {
    id: 5,
    name: "Belle Vue Clinic",
    type: "Specialty Hospital",
    rating: 4.6,
    reviews: 945,
    distance: "3.5 km",
    address: "9, U.N. Brahmachari Street, Kolkata",
    phone: "+91 33 2287 2321",
    website: "www.bellevueclinic.com",
    emergencyRoom: true,
    trauma: "Level 1",
    beds: 241,
    specialties: ["Cardiology", "Gastroenterology", "Critical Care", "ENT"],
    amenities: ["Parking", "Pharmacy", "Cafeteria", "WiFi"],
    insurance: ["United India Insurance", "ICICI Lombard", "Care Health"],
    waitTime: "15 min",
    status: "Open 24/7",
    image: "/hospitals-placeholder.jpg",
    accreditation: ["NABH"],
    description: "Heritage hospital in central Kolkata known for emergency and specialty care."
  },
  {
    id: 6,
    name: "Institute of Neurosciences Kolkata (INK)",
    type: "Specialty Center",
    rating: 4.8,
    reviews: 672,
    distance: "4.7 km",
    address: "185/1, A.J.C. Bose Road, Kolkata",
    phone: "+91 33 6161 6161",
    website: "www.neurokolkata.org",
    emergencyRoom: true,
    trauma: "Neuro Emergency",
    beds: 210,
    specialties: ["Neurology", "Neurosurgery", "Stroke Care", "Rehabilitation"],
    amenities: ["WiFi", "Parking", "Neuro Rehab", "Pharmacy"],
    insurance: ["Star Health", "HDFC Ergo", "Reliance Health"],
    waitTime: "12 min",
    status: "Open 24/7",
    image: "/hospitals-placeholder.jpg",
    accreditation: ["NABH"],
    description: "Dedicated center for neurological care and one of the best in Eastern India."
  },
  {
    id: 7,
    name: "Ruby General Hospital",
    type: "Multispecialty Hospital",
    rating: 4.3,
    reviews: 1105,
    distance: "6.3 km",
    address: "Kasba Golpark, E.M. Bypass, Kolkata",
    phone: "+91 33 3987 6000",
    website: "www.rubyhospital.com",
    emergencyRoom: true,
    trauma: "Level 1",
    beds: 400,
    specialties: ["Cardiology", "Oncology", "Orthopedics", "General Medicine"],
    amenities: ["Parking", "Cafeteria", "Pharmacy", "WiFi"],
    insurance: ["Max Bupa", "Star Health", "Religare"],
    waitTime: "30 min",
    status: "Open 24/7",
    image: "/hospitals-placeholder.jpg",
    accreditation: ["NABH"],
    description: "Large multispecialty hospital along E.M. Bypass catering to a wide range of patients."
  },
  {
    id: 8,
    name: "AMRI Salt Lake",
    type: "General Hospital",
    rating: 4.4,
    reviews: 765,
    distance: "8.0 km",
    address: "JC 16 & 17, Salt Lake, Sector III, Kolkata",
    phone: "+91 33 6626 0000",
    website: "www.amrihospitals.in",
    emergencyRoom: true,
    trauma: "Level 2",
    beds: 250,
    specialties: ["Internal Medicine", "Orthopedics", "Gynecology", "ENT"],
    amenities: ["WiFi", "Parking", "Cafeteria", "Pharmacy"],
    insurance: ["Star Health", "ICICI Lombard", "Care Health"],
    waitTime: "19 min",
    status: "Open 24/7",
    image: "/hospitals-placeholder.jpg",
    accreditation: ["NABH"],
    description: "Well-equipped hospital in Salt Lake providing quality care across multiple departments."
  }
];

const emergencyServices = [
  {
    id: 1,
    name: "Apollo Emergency & Trauma Center",
    distance: "2.2 km",
    waitTime: "15 min",
    severity: "All Levels",
    status: "Open",
  },
  {
    id: 2,
    name: "Fortis Anandapur ER",
    distance: "5.0 km",
    waitTime: "18 min",
    severity: "All Levels",
    status: "Open",
  },
  {
    id: 3,
    name: "AMRI Dhakuria Emergency",
    distance: "7.5 km",
    waitTime: "12 min",
    severity: "Critical & Non-Critical",
    status: "Open",
  },
  {
    id: 4,
    name: "Peerless Trauma & Emergency",
    distance: "9.0 km",
    waitTime: "20 min",
    severity: "All Levels",
    status: "Open",
  },
  {
    id: 5,
    name: "Belle Vue 24/7 Emergency",
    distance: "3.2 km",
    waitTime: "10 min",
    severity: "Critical Care",
    status: "Open",
  },
  {
    id: 6,
    name: "Ruby General Emergency",
    distance: "6.1 km",
    waitTime: "22 min",
    severity: "All Levels",
    status: "Open",
  },
];

const quickStats = [
  { label: "Hospitals Nearby", value: "8", icon: Building2, color: "blue" },
  { label: "Emergency Rooms", value: "6", icon: Ambulance, color: "red" },
  { label: "Specialty Centers", value: "12", icon: Heart, color: "purple" },
  { label: "Avg Wait Time", value: "19 min", icon: Clock, color: "green" },
];


const colorClasses: Record<string, { bg: string; icon: string }> = {
  blue: { bg: "bg-blue-100", icon: "text-blue-600" },
  red: { bg: "bg-red-100", icon: "text-red-600" },
  purple: { bg: "bg-purple-100", icon: "text-purple-600" },
  green: { bg: "bg-green-100", icon: "text-green-600" },
}

export default function HospitalFinder() {
  const [selectedType, setSelectedType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedHospital, setSelectedHospital] = useState<(typeof hospitals)[0] | null>(null)
  const [activeTab, setActiveTab] = useState("hospitals")

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch =
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.specialties.some((specialty) => specialty.toLowerCase().includes(searchQuery.toLowerCase()))

    if (selectedType === "all") return matchesSearch
    return matchesSearch && hospital.type.toLowerCase().includes(selectedType)
  })

  const getStatusColor = (status: string) => {
    if (status.includes("24/7")) return "text-green-600"
    if (status.includes("Open")) return "text-green-600"
    return "text-orange-600"
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Hospital Finder</h1>
              <p className="text-gray-600">Locate hospitals, emergency rooms, and medical facilities near you</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/60 backdrop-blur-sm">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
              <Button className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                <Ambulance className="w-4 h-4 mr-2" />
                Emergency Services
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon
            const cls = colorClasses[stat.color] || colorClasses.blue
            return (
              <Card key={index} className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${cls.bg} p-2 rounded-lg`}>
                      <Icon className={`w-5 h-5 ${cls.icon}`} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search hospitals, specialties, or services..."
              className="pl-12 h-12 bg-white/60 backdrop-blur-sm border-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8">
              <Navigation className="w-4 h-4 mr-2" />
              Near Me
            </Button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {hospitalTypes.map((type) => {
              const Icon = type.icon
              return (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    selectedType === type.id ? "bg-blue-500 text-white" : "bg-white/60 backdrop-blur-sm border-white/20"
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <Icon className="w-4 h-4" />
                  {type.name}
                  <Badge variant="secondary" className="ml-1">
                    {type.count}
                  </Badge>
                </Button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="col-span-3">
            {/* *** FIX: TabsContent must be children of Tabs. Put TabsList + TabsContent inside same Tabs root. *** */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="bg-white/60 backdrop-blur-sm">
                <TabsTrigger value="hospitals">Hospitals ({filteredHospitals.length})</TabsTrigger>
                <TabsTrigger value="emergency">Emergency Services (8)</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
              </TabsList>

              <TabsContent value="hospitals">
                <div className="space-y-6">
                  {filteredHospitals.map((hospital) => (
                    <Card key={hospital.id} className="bg-white/60 backdrop-blur-sm border-white/20 overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          {/* Hospital Image */}
                          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg overflow-hidden">
                            <img
                              src={hospital.image || "/placeholder.svg"}
                              alt={hospital.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Hospital Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{hospital.name}</h3>
                                <p className="text-blue-600 font-medium mb-2">{hospital.type}</p>
                                <div className="flex items-center gap-4 mb-2">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">{hospital.rating}</span>
                                    <span className="text-gray-500">({hospital.reviews} reviews)</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-gray-500">
                                    <MapPin className="w-4 h-4" />
                                    {hospital.distance}
                                  </div>
                                  <div className="flex items-center gap-1 text-gray-500">
                                    <Bed className="w-4 h-4" />
                                    {hospital.beds} beds
                                  </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{hospital.address}</p>
                              </div>
                              <div className="text-right">
                                <div className={`font-medium mb-2 ${getStatusColor(hospital.status)}`}>
                                  {hospital.status}
                                </div>
                                {hospital.emergencyRoom && (
                                  <div className="flex gap-2 mb-2">
                                    <Badge className="bg-red-100 text-red-800">
                                      <Ambulance className="w-3 h-3 mr-1" />
                                      Emergency Room
                                    </Badge>
                                    {hospital.trauma && (
                                      <Badge className="bg-orange-100 text-orange-800">{hospital.trauma} Trauma</Badge>
                                    )}
                                  </div>
                                )}
                                {hospital.waitTime !== "N/A" && (
                                  <div className="text-sm text-gray-500">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    Wait: {hospital.waitTime}
                                  </div>
                                )}
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">{hospital.description}</p>

                            {/* Specialties */}
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties</h4>
                              <div className="flex flex-wrap gap-2">
                                {hospital.specialties.slice(0, 4).map((specialty, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {specialty}
                                  </Badge>
                                ))}
                                {hospital.specialties.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{hospital.specialties.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Amenities */}
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Amenities</h4>
                              <div className="flex gap-4 text-xs text-gray-500">
                                {hospital.amenities.includes("Parking") && (
                                  <div className="flex items-center gap-1">
                                    <Car className="w-3 h-3" />
                                    Parking
                                  </div>
                                )}
                                {hospital.amenities.includes("WiFi") && (
                                  <div className="flex items-center gap-1">
                                    <Wifi className="w-3 h-3" />
                                    WiFi
                                  </div>
                                )}
                                {hospital.amenities.includes("Cafeteria") && (
                                  <div className="flex items-center gap-1">
                                    <Coffee className="w-3 h-3" />
                                    Cafeteria
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1 text-gray-500">
                                  <Phone className="w-4 h-4" />
                                  {hospital.phone}
                                </div>
                                <div className="flex items-center gap-1">
                                  {hospital.accreditation.map((acc, index) => (
                                    <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                                      <Award className="w-3 h-3 mr-1" />
                                      {acc}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setSelectedHospital(hospital)}>
                                  <Info className="w-4 h-4 mr-2" />
                                  Details
                                </Button>
                                <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                                  <Navigation className="w-4 h-4 mr-2" />
                                  Get Directions
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

              <TabsContent value="emergency">
                <div className="space-y-4">
                  {emergencyServices.map((service) => (
                    <Card key={service.id} className="bg-white/60 backdrop-blur-sm border-white/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                              <Ambulance className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{service.name}</h3>
                              <p className="text-sm text-gray-500">
                                {service.distance} • {service.severity}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-600 font-medium">{service.status}</div>
                            <div className="text-sm text-gray-500">Wait: {service.waitTime}</div>
                          </div>
                          <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                            <Phone className="w-4 h-4 mr-2" />
                            Call Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="map">
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardContent className="p-8 text-center">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Map</h3>
                    <p className="text-gray-600">View hospitals and medical facilities on an interactive map</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Emergency Alert */}
            <Card className="bg-gradient-to-br from-red-500 to-pink-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Ambulance className="w-5 h-5" />
                  <span className="font-semibold">Emergency</span>
                </div>
                <h3 className="font-bold mb-2">Need Immediate Care?</h3>
                <p className="text-red-100 text-sm mb-4">Call 911 for life-threatening emergencies</p>
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20">
                  <Phone className="w-4 h-4 mr-2" />
                  Call 911
                </Button>
              </CardContent>
            </Card>

            {/* Nearest Emergency Rooms */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ambulance className="w-5 h-5" />
                  Nearest ERs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emergencyServices.slice(0, 3).map((service) => (
                    <div key={service.id} className="p-3 bg-red-50/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{service.name}</h4>
                        <Badge className="bg-green-100 text-green-800 text-xs">{service.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{service.distance}</span>
                        <span>Wait: {service.waitTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hospital Quality Ratings */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-sm">Quality Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Patient Safety</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">4.8/5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Care Quality</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">4.7/5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Patient Experience</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">4.6/5</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insurance Information */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-sm">Insurance Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <p>Verify your insurance coverage before visiting</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                    <p>Emergency care is covered regardless of network status</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                    <p>Call your insurance for pre-authorization when possible</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hospital Details Modal */}
        {selectedHospital && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedHospital.name}</CardTitle>
                    <p className="text-blue-600 font-medium">{selectedHospital.type}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedHospital(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Contact Information</h4>
                      <div className="space-y-1 text-sm">
                        <p>{selectedHospital.address}</p>
                        <p>{selectedHospital.phone}</p>
                        <p className="text-blue-600">{selectedHospital.website}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedHospital.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Insurance Accepted</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedHospital.insurance.map((ins, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                            {ins}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Amenities</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {selectedHospital.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            {amenity}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Accreditation</h4>
                      <div className="space-y-1">
                        {selectedHospital.accreditation.map((acc, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Award className="w-4 h-4 text-yellow-500" />
                            {acc}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-6 border-t mt-6">
                  <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Hospital
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
