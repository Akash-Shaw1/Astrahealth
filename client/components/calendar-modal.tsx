"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Clock,
  Video,
  Phone,
  MessageSquare,
  User,
  FileText,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getConsultations, getDoctorById, type Consultation } from "@/lib/data-service"

interface CalendarModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface CalendarEvent {
  id: string
  consultation: Consultation
  doctor: {
    name: string
    specialty: string
    avatar: string
  }
  date: Date
  title: string
  status: string
  type: string
}

export default function CalendarModal({ open, onOpenChange }: CalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    if (open) {
      loadCalendarEvents()
    }
  }, [open])

  const loadCalendarEvents = () => {
    const consultations = getConsultations()
    const calendarEvents: CalendarEvent[] = consultations.map((consultation) => {
      const doctor = getDoctorById(consultation.doctorId)
      return {
        id: consultation.id,
        consultation,
        doctor: {
          name: doctor?.name || "Unknown Doctor",
          specialty: doctor?.specialty || "General",
          avatar: doctor?.avatar || "/placeholder.svg",
        },
        date: new Date(`${consultation.date}T${consultation.time}`),
        title: `${doctor?.name} - ${consultation.reason}`,
        status: consultation.status,
        type: consultation.type,
      }
    })
    setEvents(calendarEvents)
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      case "missed":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video Call":
        return <Video className="w-3 h-3" />
      case "Phone Call":
        return <Phone className="w-3 h-3" />
      case "Chat":
        return <MessageSquare className="w-3 h-3" />
      default:
        return <Video className="w-3 h-3" />
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const today = new Date()

    const days = []
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    // Day headers
    dayNames.forEach((day) => {
      days.push(
        <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
          {day}
        </div>,
      )
    })

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border-b border-r"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayEvents = getEventsForDate(date)
      const isToday = date.toDateString() === today.toDateString()

      days.push(
        <div key={day} className="p-1 border-b border-r min-h-[100px] relative">
          <div
            className={cn(
              "text-sm font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full",
              isToday ? "bg-blue-600 text-white" : "text-gray-900",
            )}
          >
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((event, index) => (
              <div
                key={event.id}
                className={cn(
                  "text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity",
                  getStatusColor(event.status),
                  "text-white",
                )}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-center gap-1 truncate">
                  {getTypeIcon(event.type)}
                  <span className="truncate">{formatTime(event.date)}</span>
                </div>
                <div className="truncate font-medium">{event.doctor.name}</div>
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500 font-medium">+{dayEvents.length - 3} more</div>
            )}
          </div>
        </div>,
      )
    }

    return days
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            Consultation Calendar
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 h-[70vh]">
          {/* Calendar View */}
          <div className="flex-1 flex flex-col">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">
                  {currentDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Upcoming</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Cancelled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span>Missed</span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 border rounded-lg overflow-hidden">
              <div className="grid grid-cols-7 h-full">{renderCalendarGrid()}</div>
            </div>
          </div>

          {/* Event Details Sidebar */}
          <div className="w-80 border-l pl-6">
            {selectedEvent ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Consultation Details</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)}>
                    ×
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-4">
                    {/* Doctor Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={selectedEvent.doctor.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {selectedEvent.doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{selectedEvent.doctor.name}</h4>
                        <p className="text-sm text-gray-600">{selectedEvent.doctor.specialty}</p>
                      </div>
                    </div>

                    {/* Consultation Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {selectedEvent.date.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{formatTime(selectedEvent.date)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {getTypeIcon(selectedEvent.type)}
                        <span className="text-sm">{selectedEvent.type}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          className={cn(
                            "capitalize",
                            selectedEvent.status === "upcoming" && "bg-blue-100 text-blue-800",
                            selectedEvent.status === "completed" && "bg-green-100 text-green-800",
                            selectedEvent.status === "cancelled" && "bg-red-100 text-red-800",
                            selectedEvent.status === "missed" && "bg-orange-100 text-orange-800",
                          )}
                        >
                          {selectedEvent.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm mb-1">Reason for Consultation</div>
                          <p className="text-sm text-gray-600">{selectedEvent.consultation.reason}</p>
                        </div>
                      </div>
                    </div>

                    {/* Patient Notes */}
                    {selectedEvent.consultation.patientNotes && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-blue-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm mb-1 text-blue-900">Patient Notes</div>
                            <p className="text-sm text-blue-700">{selectedEvent.consultation.patientNotes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Doctor Notes (for completed consultations) */}
                    {selectedEvent.consultation.notes && selectedEvent.status === "completed" && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm mb-1 text-green-900">Doctor's Notes</div>
                            <p className="text-sm text-green-700">{selectedEvent.consultation.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rating (for completed consultations) */}
                    {selectedEvent.consultation.rating && (
                      <div className="mt-3 flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">Rated {selectedEvent.consultation.rating}/5</span>
                      </div>
                    )}

                    {/* Prescription */}
                    {selectedEvent.consultation.prescription && (
                      <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-purple-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm mb-1 text-purple-900">Prescription</div>
                            <p className="text-sm text-purple-700">{selectedEvent.consultation.prescription}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-4 space-y-2">
                      {selectedEvent.status === "upcoming" && (
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                          <Video className="w-4 h-4 mr-2" />
                          Join Consultation
                        </Button>
                      )}
                      {selectedEvent.status === "completed" && (
                        <Button variant="outline" className="w-full bg-transparent">
                          <FileText className="w-4 h-4 mr-2" />
                          Download Report
                        </Button>
                      )}
                      {selectedEvent.status === "completed" && !selectedEvent.consultation.rating && (
                        <Button variant="outline" className="w-full bg-transparent">
                          <Star className="w-4 h-4 mr-2" />
                          Rate Consultation
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">Click on a consultation to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {events.filter((e) => e.status === "upcoming").length}
              </div>
              <div className="text-xs text-gray-600">Upcoming</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {events.filter((e) => e.status === "completed").length}
              </div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {events.filter((e) => e.status === "cancelled").length}
              </div>
              <div className="text-xs text-gray-600">Cancelled</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">{events.length}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
