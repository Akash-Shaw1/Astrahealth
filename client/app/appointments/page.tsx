"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Phone,
  Video,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import DashboardLayout from "@/components/dashboard-layout"

const appointments = [
  {
    id: 1,
    patient: "Olivia Carter",
    patientAvatar: "/generic-hospital-patient.png",
    date: "2024-12-20",
    time: "09:00 AM",
    duration: "30 min",
    type: "Consultation",
    status: "Confirmed",
    doctor: "Dr. Emma Hayes",
    location: "Room 201",
    appointmentType: "In-Person",
    reason: "Hypertension follow-up",
    phone: "+1 (555) 123-4567",
    notes: "Patient reports feeling better with current medication",
  },
  {
    id: 2,
    patient: "Marcus Johnson",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    date: "2024-12-20",
    time: "10:30 AM",
    duration: "45 min",
    type: "Check-up",
    status: "Pending",
    doctor: "Dr. Emma Hayes",
    location: "Video Call",
    appointmentType: "Virtual",
    reason: "Diabetes management review",
    phone: "+1 (555) 234-5678",
    notes: "Review recent blood sugar logs",
  },
  {
    id: 3,
    patient: "Sarah Williams",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    date: "2024-12-20",
    time: "02:00 PM",
    duration: "30 min",
    type: "Consultation",
    status: "Completed",
    doctor: "Dr. Emma Hayes",
    location: "Room 203",
    appointmentType: "In-Person",
    reason: "Asthma symptoms evaluation",
    phone: "+1 (555) 345-6789",
    notes: "Prescribed new inhaler, follow-up in 2 weeks",
  },
  {
    id: 4,
    patient: "James Wilson",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    date: "2024-12-21",
    time: "11:00 AM",
    duration: "60 min",
    type: "Surgery Consultation",
    status: "Confirmed",
    doctor: "Dr. Emma Hayes",
    location: "Room 205",
    appointmentType: "In-Person",
    reason: "Pre-operative assessment",
    phone: "+1 (555) 456-7890",
    notes: "Discuss surgical procedure and recovery plan",
  },
  {
    id: 5,
    patient: "Emily Davis",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    date: "2024-12-21",
    time: "03:30 PM",
    duration: "30 min",
    type: "Follow-up",
    status: "Cancelled",
    doctor: "Dr. Emma Hayes",
    location: "Room 201",
    appointmentType: "In-Person",
    reason: "Post-treatment check",
    phone: "+1 (555) 567-8901",
    notes: "Patient requested to reschedule",
  },
]

const upcomingAppointments = appointments.filter((apt) => apt.status === "Confirmed" || apt.status === "Pending")

const todayAppointments = appointments.filter((apt) => apt.date === "2024-12-20")

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Confirmed":
      return <CheckCircle className="w-4 h-4 text-green-500" />
    case "Pending":
      return <AlertCircle className="w-4 h-4 text-yellow-500" />
    case "Completed":
      return <CheckCircle className="w-4 h-4 text-blue-500" />
    case "Cancelled":
      return <XCircle className="w-4 h-4 text-red-500" />
    default:
      return <Clock className="w-4 h-4 text-gray-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-800"
    case "Pending":
      return "bg-yellow-100 text-yellow-800"
    case "Completed":
      return "bg-blue-100 text-blue-800"
    case "Cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointments</h1>
            <p className="text-gray-600">Manage and schedule patient appointments efficiently.</p>
          </div>
          <Button className="bg-slate-800 hover:bg-slate-700">
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Today's Appointments</p>
                  <p className="text-2xl font-bold">{todayAppointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold">
                    {appointments.filter((apt) => apt.status === "Confirmed").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{appointments.filter((apt) => apt.status === "Pending").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Virtual Appointments</p>
                  <p className="text-2xl font-bold">
                    {appointments.filter((apt) => apt.appointmentType === "Virtual").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search appointments by patient, reason, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/50"
                />
              </div>
              <Button variant="outline" className="bg-white/50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" className="bg-white/50">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/60 backdrop-blur-sm border-white/20">
            <TabsTrigger value="all">All Appointments</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-white/30 rounded-lg hover:bg-white/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={appointment.patientAvatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {appointment.patient
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{appointment.patient}</h4>
                          <p className="text-sm text-gray-600">{appointment.reason}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {appointment.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {appointment.time}
                            </div>
                            <div className="flex items-center gap-1">
                              {appointment.appointmentType === "Virtual" ? (
                                <Video className="w-3 h-3" />
                              ) : (
                                <MapPin className="w-3 h-3" />
                              )}
                              {appointment.location}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1">{appointment.status}</span>
                        </Badge>
                        <Badge variant="outline">{appointment.type}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Appointment
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="w-4 h-4 mr-2" />
                              Call Patient
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Cancel Appointment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="today" className="space-y-4">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center gap-4 p-4 bg-white/30 rounded-lg">
                      <div className="text-center min-w-[60px]">
                        <p className="text-lg font-bold">{appointment.time.split(" ")[0]}</p>
                        <p className="text-xs text-gray-500">{appointment.time.split(" ")[1]}</p>
                      </div>
                      <div className="w-px h-12 bg-gray-300"></div>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={appointment.patientAvatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {appointment.patient
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{appointment.patient}</h4>
                        <p className="text-sm text-gray-600">{appointment.reason}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {appointment.type}
                          </Badge>
                          <span className="text-xs text-gray-500">• {appointment.duration}</span>
                          <span className="text-xs text-gray-500">• {appointment.location}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-white/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={appointment.patientAvatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {appointment.patient
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{appointment.patient}</h4>
                          <p className="text-sm text-gray-600">{appointment.reason}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span>
                              {appointment.date} at {appointment.time}
                            </span>
                            <span>• {appointment.duration}</span>
                            <span>• {appointment.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                        <Button size="sm" variant="outline" className="bg-white/50">
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Completed Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments
                    .filter((apt) => apt.status === "Completed")
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 bg-white/30 rounded-lg opacity-75"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={appointment.patientAvatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {appointment.patient
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{appointment.patient}</h4>
                            <p className="text-sm text-gray-600">{appointment.reason}</p>
                            <p className="text-xs text-gray-500 mt-1">{appointment.notes}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1">{appointment.status}</span>
                          </Badge>
                          <Button size="sm" variant="outline" className="bg-white/50">
                            View Notes
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
