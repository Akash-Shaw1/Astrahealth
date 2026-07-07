"use client"

import { useState, useEffect } from "react"
import {
  Video,
  Calendar,
  Clock,
  MessageSquare,
  Phone,
  FileText,
  Star,
  CheckCircle2,
  AlertCircle,
  Plus,
  Filter,
  Search,
  Download,
  Eye,
  MoreHorizontal,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import DashboardLayout from "@/components/dashboard-layout"
import ScheduleConsultationModal from "@/components/schedule-consultation-modal"
import CalendarModal from "@/components/calendar-modal"
import MedicalRecordsModal from "@/components/medical-records-modal"
import ConsultationDetailsModal from "@/components/consultation-details-modal"
import {
  getConsultations,
  getUpcomingConsultations,
  getConsultationStats,
  getDoctors,
  type Consultation,
  type Doctor,
} from "@/lib/data-service"

export default function EConsultationTracker() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [showMedicalRecordsModal, setShowMedicalRecordsModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<Consultation[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    upcoming: 0,
    cancelled: 0,
    completionRate: 0,
    averageRating: 0,
  })

  const loadData = async () => {
    try {
      const list = await getConsultations()
      setConsultations(list)
      const upcoming = await getUpcomingConsultations()
      setUpcomingAppointments(upcoming)
      const statsData = await getConsultationStats()
      setStats(statsData)
      const docs = await getDoctors()
      setDoctors(docs)
    } catch (err) {
      console.error("Failed to load consultations:", err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleConsultationScheduled = () => {
    loadData() // Refresh data after scheduling
  }

  const handleConsultationUpdated = () => {
    loadData() // Refresh data after updates
  }

  const handleViewDetails = (consultation: Consultation) => {
    setSelectedConsultation(consultation)
    setShowDetailsModal(true)
  }

  const handleJoinCall = (consultation: Consultation) => {
    const doctor = doctors.find((d) => d.id === consultation.doctorId)
    console.log("[v0] Joining consultation call:", consultation.id)
    alert(`Joining ${consultation.type} with ${doctor?.name}...`)
  }

  const handleDownloadReport = (consultation: Consultation) => {
    const doctor = doctors.find((d) => d.id === consultation.doctorId)
    console.log("[v0] Downloading report for consultation:", consultation.id)
    const reportName = `${doctor?.name.replace(/\s+/g, "_")}_${consultation.date}_Report.pdf`
    alert(`Downloading ${reportName}...`)
  }

  const handleRateConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation)
    setShowDetailsModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Clock className="w-4 h-4" />
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredConsultations = consultations.filter((consultation) => {
    if (selectedTab !== "all" && consultation.status !== selectedTab) return false
    if (!searchQuery) return true
    const doctor = doctors.find((d) => d.id === consultation.doctorId)
    return (
      doctor?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor?.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.reason.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const quickStats = [
    { label: "Total Consultations", value: stats.total, change: "+3 this month", color: "blue" },
    { label: "Completed", value: stats.completed, change: `${stats.completionRate}% completion rate`, color: "green" },
    {
      label: "Upcoming",
      value: stats.upcoming,
      change:
        upcomingAppointments.length > 0
          ? `Next: ${upcomingAppointments[0]?.date} ${upcomingAppointments[0]?.time}`
          : "No upcoming",
      color: "orange",
    },
    {
      label: "Average Rating",
      value: stats.averageRating.toString(),
      change: `Based on ${stats.completed} reviews`,
      color: "purple",
    },
  ]

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">E-Consultation Tracker</h1>
              <p className="text-gray-600">Manage and track your virtual healthcare consultations</p>
            </div>
            <Button
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
              onClick={() => setShowScheduleModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Consultation
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                    {index === 0 && <Video className={`w-5 h-5 text-${stat.color}-600`} />}
                    {index === 1 && <CheckCircle2 className={`w-5 h-5 text-${stat.color}-600`} />}
                    {index === 2 && <Clock className={`w-5 h-5 text-${stat.color}-600`} />}
                    {index === 3 && <Star className={`w-5 h-5 text-${stat.color}-600`} />}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.change}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="col-span-3">
            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search consultations..."
                  className="pl-10 bg-white/60 backdrop-blur-sm border-white/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-white/20">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Consultation Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
              <TabsList className="bg-white/60 backdrop-blur-sm">
                <TabsTrigger value="all">All Consultations</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Consultations List */}
            <div className="space-y-4">
              {filteredConsultations.map((consultation) => {
                const doctor = doctors.find((d) => d.id === consultation.doctorId)
                if (!doctor) return null

                return (
                  <Card key={consultation.id} className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {doctor.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">{doctor.name}</h3>
                            <p className="text-gray-600 mb-2">{doctor.specialty}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(consultation.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {consultation.time}
                              </div>
                              <div className="flex items-center gap-1">
                                {consultation.type === "Video Call" ? (
                                  <Video className="w-4 h-4" />
                                ) : (
                                  <Phone className="w-4 h-4" />
                                )}
                                {consultation.type}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(consultation.status)}>
                            {getStatusIcon(consultation.status)}
                            <span className="ml-1 capitalize">{consultation.status}</span>
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleViewDetails(consultation)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {consultation.status === "completed" && (
                                <DropdownMenuItem onClick={() => handleDownloadReport(consultation)}>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download Report
                                </DropdownMenuItem>
                              )}
                              {consultation.status === "upcoming" && (
                                <DropdownMenuItem onClick={() => handleJoinCall(consultation)}>
                                  <Video className="w-4 h-4 mr-2" />
                                  Join Call
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="bg-gray-50/50 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm text-gray-900 mb-1">Reason for Consultation</div>
                            <p className="text-sm text-gray-600">{consultation.reason}</p>
                          </div>
                        </div>
                        {consultation.notes && (
                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-sm text-gray-900 mb-1">Notes</div>
                              <p className="text-sm text-gray-600">{consultation.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {consultation.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{consultation.rating}</span>
                            </div>
                          )}
                          {consultation.prescription && (
                            <Badge variant="outline" className="text-xs">
                              <FileText className="w-3 h-3 mr-1" />
                              Prescription Available
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {consultation.status === "upcoming" && (
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleJoinCall(consultation)}
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Join Call
                            </Button>
                          )}
                          {consultation.status === "completed" && !consultation.rating && (
                            <Button size="sm" variant="outline" onClick={() => handleRateConsultation(consultation)}>
                              <Star className="w-4 h-4 mr-2" />
                              Rate Consultation
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.slice(0, 3).map((appointment) => {
                    const doctor = doctors.find((d) => d.id === appointment.doctorId)
                    if (!doctor) return null

                    return (
                      <div key={appointment.id} className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-lg">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {doctor.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{doctor.name}</div>
                          <div className="text-xs text-gray-500">{doctor.specialty}</div>
                          <div className="text-xs text-blue-600 font-medium">
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Video className="w-5 h-5" />
                  <span className="font-semibold">Quick Actions</span>
                </div>
                <div className="space-y-3">
                  <Button
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20"
                    onClick={() => setShowScheduleModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Consultation
                  </Button>
                  <Button
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20"
                    onClick={() => setShowCalendarModal(true)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                  <Button
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20"
                    onClick={() => setShowMedicalRecordsModal(true)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Medical Records
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Consultation Tips */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-sm">Consultation Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>Test your camera and microphone before the call</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>Prepare a list of questions and symptoms</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>Have your medical history and medications ready</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ScheduleConsultationModal
        open={showScheduleModal}
        onOpenChange={setShowScheduleModal}
        onConsultationScheduled={handleConsultationScheduled}
      />

      <CalendarModal open={showCalendarModal} onOpenChange={setShowCalendarModal} />

      <MedicalRecordsModal open={showMedicalRecordsModal} onOpenChange={setShowMedicalRecordsModal} />

      <ConsultationDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        consultation={selectedConsultation}
        doctor={doctors.find((d) => d.id === selectedConsultation?.doctorId)}
        onConsultationUpdated={handleConsultationUpdated}
      />
    </DashboardLayout>
  )
}
