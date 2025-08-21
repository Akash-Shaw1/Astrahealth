"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
import {
  Star,
  Download,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  TrendingUp,
  Search,
  Building2,
  Stethoscope,
  Pill,
  TestTube,
  Truck,
  MessageSquare,
} from "lucide-react"

// Import JSON data
import hospitalsData from "@/data/feedback/hospitals.json"
import doctorsData from "@/data/feedback/doctors.json"
import medicineShopsData from "@/data/feedback/medicine-shops.json"
import testingCentersData from "@/data/feedback/testing-centers.json"
import ambulanceServicesData from "@/data/feedback/ambulance-services.json"
import generalReferralsData from "@/data/feedback/general-referrals.json"

interface Rating {
  [key: string]: number
  overall: number
}

interface BaseReview {
  id: string
  location: string
  ratings: Rating
  review_text: string
  reviewer: string
  referral_count: number
  escalation: boolean
  timestamp: string
}

interface HospitalReview extends BaseReview {
  name: string
  services: string[]
}

interface DoctorReview extends BaseReview {
  name: string
  specialization: string
  hospital_affiliation: string
}

interface MedicineShopReview extends BaseReview {
  shop_name: string
}

interface TestingCenterReview extends BaseReview {
  center_name: string
  services: string[]
}

interface AmbulanceServiceReview extends BaseReview {
  service_name: string
}

type ReviewData = HospitalReview | DoctorReview | MedicineShopReview | TestingCenterReview | AmbulanceServiceReview

export default function FeedbackReferralsPage() {
  const [activeTab, setActiveTab] = useState("hospitals")
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState("newest")

  // Form states
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [isReferral, setIsReferral] = useState(false)
  const [referralTo, setReferralTo] = useState("")
  const [isEscalation, setIsEscalation] = useState(false)
  const [escalationReason, setEscalationReason] = useState("")

  // Data states
  const [hospitals, setHospitals] = useState<HospitalReview[]>(hospitalsData)
  const [doctors, setDoctors] = useState<DoctorReview[]>(doctorsData)
  const [medicineShops, setMedicineShops] = useState<MedicineShopReview[]>(medicineShopsData)
  const [testingCenters, setTestingCenters] = useState<TestingCenterReview[]>(testingCentersData)
  const [ambulanceServices, setAmbulanceServices] = useState<AmbulanceServiceReview[]>(ambulanceServicesData)

  // Calculate stats
  const totalReviews =
    hospitals.length + doctors.length + medicineShops.length + testingCenters.length + ambulanceServices.length
  const averageRating = (
    [...hospitals, ...doctors, ...medicineShops, ...testingCenters, ...ambulanceServices].reduce(
      (sum, review) => sum + review.ratings.overall,
      0,
    ) / totalReviews
  ).toFixed(1)
  const issuesResolved = [...hospitals, ...doctors, ...medicineShops, ...testingCenters, ...ambulanceServices].filter(
    (review) => !review.escalation,
  ).length
  const pendingEscalations = [
    ...hospitals,
    ...doctors,
    ...medicineShops,
    ...testingCenters,
    ...ambulanceServices,
  ].filter((review) => review.escalation).length

  const getCurrentData = (): ReviewData[] => {
    switch (activeTab) {
      case "hospitals":
        return hospitals
      case "doctors":
        return doctors
      case "medicine-shops":
        return medicineShops
      case "testing-centers":
        return testingCenters
      case "ambulance-services":
        return ambulanceServices
      default:
        return []
    }
  }

  const getFilteredData = () => {
    let data = getCurrentData()

    if (searchTerm) {
      data = data.filter((item) => {
        const name =
          "name" in item
            ? item.name
            : "shop_name" in item
              ? item.shop_name
              : "center_name" in item
                ? item.center_name
                : "service_name" in item
                  ? item.service_name
                  : ""
        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }

    if (locationFilter !== "all") {
      data = data.filter((item) => item.location.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    if (minRating > 0) {
      data = data.filter((item) => item.ratings.overall >= minRating)
    }

    // Sort data
    data.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.ratings.overall - a.ratings.overall
        case "referrals":
          return b.referral_count - a.referral_count
        case "newest":
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      }
    })

    return data
  }

  const handleSubmit = () => {
    if (rating === 0 || !reviewText.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rating and review text.",
        variant: "destructive",
      })
      return
    }

    // Reset form
    setRating(0)
    setReviewText("")
    setIsReferral(false)
    setReferralTo("")
    setIsEscalation(false)
    setEscalationReason("")

    toast({
      title: "Success",
      description: "Feedback submitted successfully!",
    })
  }

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    )
  }

  const getEntityName = (item: ReviewData) => {
    if ("name" in item) return item.name
    if ("shop_name" in item) return item.shop_name
    if ("center_name" in item) return item.center_name
    if ("service_name" in item) return item.service_name
    return "Unknown"
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "hospitals":
        return <Building2 className="w-4 h-4" />
      case "doctors":
        return <Stethoscope className="w-4 h-4" />
      case "medicine-shops":
        return <Pill className="w-4 h-4" />
      case "testing-centers":
        return <TestTube className="w-4 h-4" />
      case "ambulance-services":
        return <Truck className="w-4 h-4" />
      case "general-referrals":
        return <MessageSquare className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Feedback & Referrals</h1>
              <p className="text-slate-600 mt-1">Collect reviews, log referrals, manage escalations</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Reviews Collected</p>
                    <p className="text-2xl font-bold text-slate-800">{totalReviews}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+5%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Average Rating</p>
                    <p className="text-2xl font-bold text-slate-800">{averageRating}</p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  {renderStars(Math.round(Number.parseFloat(averageRating)))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Issues Resolved</p>
                    <p className="text-2xl font-bold text-slate-800">{issuesResolved}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Pending Escalations</p>
                    <p className="text-2xl font-bold text-slate-800">{pendingEscalations}</p>
                  </div>
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-slate-500">Requires attention</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm border border-slate-200/50">
              <TabsTrigger value="hospitals" className="flex items-center gap-2">
                {getTabIcon("hospitals")}
                <span className="hidden sm:inline">Hospitals</span>
              </TabsTrigger>
              <TabsTrigger value="doctors" className="flex items-center gap-2">
                {getTabIcon("doctors")}
                <span className="hidden sm:inline">Doctors</span>
              </TabsTrigger>
              <TabsTrigger value="medicine-shops" className="flex items-center gap-2">
                {getTabIcon("medicine-shops")}
                <span className="hidden sm:inline">Medicine</span>
              </TabsTrigger>
              <TabsTrigger value="testing-centers" className="flex items-center gap-2">
                {getTabIcon("testing-centers")}
                <span className="hidden sm:inline">Testing</span>
              </TabsTrigger>
              <TabsTrigger value="ambulance-services" className="flex items-center gap-2">
                {getTabIcon("ambulance-services")}
                <span className="hidden sm:inline">Ambulance</span>
              </TabsTrigger>
              <TabsTrigger value="general-referrals" className="flex items-center gap-2">
                {getTabIcon("general-referrals")}
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            {["hospitals", "doctors", "medicine-shops", "testing-centers", "ambulance-services"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Submission Form */}
                  <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Submit Feedback</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Entity Name</Label>
                        <Input placeholder={`Search ${tab.replace("-", " ")}...`} />
                      </div>

                      <div>
                        <Label>Overall Rating</Label>
                        <div className="mt-2">{renderStars(rating, true, setRating)}</div>
                      </div>

                      <div>
                        <Label>Review</Label>
                        <Textarea
                          placeholder="Share your experience..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <p className="text-xs text-slate-500 mt-1">{reviewText.length}/500 characters</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="referral" checked={isReferral} onCheckedChange={setIsReferral} />
                        <Label htmlFor="referral">Mark as referral</Label>
                      </div>

                      {isReferral && (
                        <div>
                          <Label>Referred to</Label>
                          <Input
                            placeholder="Who did you refer this to?"
                            value={referralTo}
                            onChange={(e) => setReferralTo(e.target.value)}
                          />
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Switch id="escalation" checked={isEscalation} onCheckedChange={setIsEscalation} />
                        <Label htmlFor="escalation">Escalate issue</Label>
                      </div>

                      {isEscalation && (
                        <div>
                          <Label>Escalation Reason</Label>
                          <Textarea
                            placeholder="Describe the issue that needs escalation..."
                            value={escalationReason}
                            onChange={(e) => setEscalationReason(e.target.value)}
                          />
                        </div>
                      )}

                      <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
                        Submit Feedback
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Aggregated List */}
                  <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Recent Feedback</CardTitle>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="rating">Top Rated</SelectItem>
                            <SelectItem value="referrals">Most Referred</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Filters */}
                      <div className="flex gap-2 mt-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <Input
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <Select value={locationFilter} onValueChange={setLocationFilter}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            <SelectItem value="kolkata">Kolkata</SelectItem>
                            <SelectItem value="salt lake">Salt Lake</SelectItem>
                            <SelectItem value="park street">Park Street</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                      {getFilteredData().map((item) => (
                        <div key={item.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-slate-800">{getEntityName(item)}</h4>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <MapPin className="w-3 h-3" />
                                {item.location}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {renderStars(item.ratings.overall)}
                              <span className="text-sm font-medium">{item.ratings.overall}</span>
                            </div>
                          </div>

                          <p className="text-sm text-slate-700 mb-3">{item.review_text}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {item.referral_count} referrals
                              </Badge>
                              {item.escalation && (
                                <Badge variant="destructive" className="text-xs">
                                  Escalated
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />
                              {new Date(item.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Rating Trend Chart Placeholder */}
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Average Rating Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-slate-100 rounded-lg flex items-center justify-center">
                      <p className="text-slate-500">Rating trend chart placeholder</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}

            <TabsContent value="general-referrals" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
                <CardHeader>
                  <CardTitle>General Referrals & Escalations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generalReferralsData.map((referral) => (
                      <div key={referral.id} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{referral.entity_type}</Badge>
                          <span className="text-sm text-slate-500">
                            {new Date(referral.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">{referral.reason}</p>
                        <p className="text-xs text-slate-500 mt-1">By: {referral.referrer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
