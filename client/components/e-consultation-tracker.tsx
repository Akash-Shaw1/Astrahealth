"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Video,
  Calendar,
  Clock,
  FileText,
  Download,
  MessageSquare,
  X,
  Play,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Consultation {
  id: string
  doctorName: string
  doctorSpecialty: string
  doctorAvatar: string
  date: string
  time: string
  duration: number
  status: "scheduled" | "ongoing" | "completed" | "missed" | "cancelled"
  type: "video" | "audio" | "chat"
  notes: string
  aiSummary: string
  prescriptions: string[]
  reports: string[]
  sessionRecording?: string
}

const consultations: Consultation[] = [
  {
    id: "1",
    doctorName: "Dr. Sarah Chen",
    doctorSpecialty: "Cardiologist",
    doctorAvatar: "/",
    date: "2024-12-21",
    time: "14:30",
    duration: 30,
    status: "ongoing",
    type: "video",
    notes:
      "Patient reports chest discomfort during exercise. Recommended stress test and ECG monitoring. Blood pressure slightly elevated at 140/90. Advised dietary modifications and regular monitoring.",
    aiSummary:
      "Key concerns: Exercise-induced chest discomfort, elevated BP. Action items: Schedule stress test, continue BP monitoring, dietary consultation.",
    prescriptions: ["Lisinopril 10mg daily", "Aspirin 81mg daily"],
    reports: ["ECG_Report_Dec21.pdf", "Blood_Pressure_Log.pdf"],
    sessionRecording: "session_recording_1.mp4",
  },
  {
    id: "2",
    doctorName: "Dr. Michael Rodriguez",
    doctorSpecialty: "Endocrinologist",
    doctorAvatar: "/",
    date: "2024-12-20",
    time: "10:00",
    duration: 25,
    status: "completed",
    type: "video",
    notes:
      "Diabetes management review. HbA1c improved to 7.2% from 8.1%. Patient adherent to medication regimen. Discussed continuous glucose monitoring benefits.",
    aiSummary:
      "Positive progress: HbA1c improvement, good medication adherence. Next steps: Consider CGM, maintain current treatment plan.",
    prescriptions: ["Metformin 1000mg twice daily", "Insulin glargine 20 units bedtime"],
    reports: ["HbA1c_Results_Dec20.pdf", "Glucose_Trends_Report.pdf"],
  },
  {
    id: "3",
    doctorName: "Dr. Emily Watson",
    doctorSpecialty: "Dermatologist",
    doctorAvatar: "/",
    date: "2024-12-19",
    time: "16:15",
    duration: 20,
    status: "completed",
    type: "video",
    notes:
      "Follow-up for eczema treatment. Significant improvement noted with topical corticosteroids. Skin barrier function restored. Recommended maintenance therapy.",
    aiSummary:
      "Treatment success: Eczema well-controlled, skin barrier improved. Plan: Continue maintenance therapy, follow-up in 3 months.",
    prescriptions: ["Hydrocortisone cream 1%", "Cetaphil moisturizer"],
    reports: ["Skin_Assessment_Dec19.pdf"],
  },
  {
    id: "4",
    doctorName: "Dr. James Park",
    doctorSpecialty: "Psychiatrist",
    doctorAvatar: "/",
    date: "2024-12-22",
    time: "11:00",
    duration: 45,
    status: "scheduled",
    type: "video",
    notes: "",
    aiSummary: "",
    prescriptions: [],
    reports: [],
  },
  {
    id: "5",
    doctorName: "Dr. Lisa Thompson",
    doctorSpecialty: "General Practitioner",
    doctorAvatar: "/",
    date: "2024-12-18",
    time: "09:30",
    duration: 15,
    status: "missed",
    type: "video",
    notes: "",
    aiSummary: "",
    prescriptions: [],
    reports: [],
  },
]

export default function EConsultationTracker() {
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "scheduled":
        return {
          color: "bg-blue-500",
          textColor: "text-blue-800",
          bgColor: "bg-blue-100",
          icon: Calendar,
          pulse: false,
        }
      case "ongoing":
        return {
          color: "bg-green-500",
          textColor: "text-green-800",
          bgColor: "bg-green-100",
          icon: Loader2,
          pulse: true,
        }
      case "completed":
        return {
          color: "bg-emerald-500",
          textColor: "text-emerald-800",
          bgColor: "bg-emerald-100",
          icon: CheckCircle,
          pulse: false,
        }
      case "missed":
        return {
          color: "bg-red-500",
          textColor: "text-red-800",
          bgColor: "bg-red-100",
          icon: AlertCircle,
          pulse: false,
        }
      case "cancelled":
        return {
          color: "bg-gray-500",
          textColor: "text-gray-800",
          bgColor: "bg-gray-100",
          icon: X,
          pulse: false,
        }
      default:
        return {
          color: "bg-gray-500",
          textColor: "text-gray-800",
          bgColor: "bg-gray-100",
          icon: Calendar,
          pulse: false,
        }
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en", { month: "short" }),
      weekday: date.toLocaleDateString("en", { weekday: "short" }),
    }
  }

  const ConsultationTile = ({ consultation }: { consultation: Consultation }) => {
    const statusConfig = getStatusConfig(consultation.status)
    const StatusIcon = statusConfig.icon
    const dateInfo = formatDate(consultation.date)

    return (
      <div
        className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg"
        onClick={() => setSelectedConsultation(consultation)}
      >
        {/* Status Indicator */}
        <div
          className={cn(
            "absolute -left-3 top-6 w-6 h-6 rounded-full flex items-center justify-center",
            statusConfig.color,
            statusConfig.pulse && "animate-pulse",
          )}
        >
          <StatusIcon className="w-3 h-3 text-white" />
        </div>

        {/* Date Badge */}
        <div className="absolute -top-2 -right-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg px-2 py-1 text-xs text-white font-medium">
            {dateInfo.month} {dateInfo.day}
          </div>
        </div>

        <div className="flex items-start gap-4">
          {/* Doctor Avatar with Gradient Border */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full p-0.5">
              <div className="bg-white rounded-full p-0.5">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={consultation.doctorAvatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {consultation.doctorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          {/* Consultation Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-800">{consultation.doctorName}</h4>
                <p className="text-sm text-gray-600">{consultation.doctorSpecialty}</p>
              </div>
              <Badge className={cn("capitalize", statusConfig.bgColor, statusConfig.textColor)}>
                {consultation.status}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{consultation.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Video className="w-4 h-4" />
                <span>{consultation.duration} min</span>
              </div>
            </div>

            {/* Preview of notes/summary for completed consultations */}
            {consultation.status === "completed" && consultation.aiSummary && (
              <div className="bg-gray-50/50 rounded-lg p-3 mt-3">
                <p className="text-xs text-gray-600 line-clamp-2">{consultation.aiSummary}</p>
              </div>
            )}

            {/* Action indicators */}
            <div className="flex items-center gap-2 mt-3">
              {consultation.reports.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <FileText className="w-3 h-3" />
                  <span>{consultation.reports.length} reports</span>
                </div>
              )}
              {consultation.prescriptions.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <MessageSquare className="w-3 h-3" />
                  <span>{consultation.prescriptions.length} prescriptions</span>
                </div>
              )}
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
            <Video className="w-5 h-5 text-blue-600" />
            E-Consultation Tracker
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">Track your virtual healthcare appointments and sessions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />1 Ongoing
          </Badge>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-1" />
            Schedule New
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-gray-200"></div>

          {/* Consultation Tiles */}
          <div className="space-y-6">
            {consultations.map((consultation) => (
              <ConsultationTile key={consultation.id} consultation={consultation} />
            ))}
          </div>
        </div>
      </CardContent>

      {/* Slide-out Drawer */}
      {selectedConsultation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex">
          <div className="ml-auto w-full max-w-2xl bg-white h-full overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full p-0.5">
                    <div className="bg-white rounded-full p-0.5">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={selectedConsultation.doctorAvatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {selectedConsultation.doctorName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedConsultation.doctorName}</h3>
                  <p className="text-gray-600">{selectedConsultation.doctorSpecialty}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className={cn(
                        "capitalize",
                        getStatusConfig(selectedConsultation.status).bgColor,
                        getStatusConfig(selectedConsultation.status).textColor,
                      )}
                    >
                      {selectedConsultation.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatDate(selectedConsultation.date).month} {formatDate(selectedConsultation.date).day} •{" "}
                      {selectedConsultation.time}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedConsultation(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Session Recording */}
              {selectedConsultation.sessionRecording && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Session Recording
                  </h4>
                  <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                    <Button className="bg-white/20 hover:bg-white/30 text-white">
                      <Play className="w-6 h-6 mr-2" />
                      Play Recording
                    </Button>
                  </div>
                </div>
              )}

              {/* AI Summary */}
              {selectedConsultation.aiSummary && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    AI Summary
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{selectedConsultation.aiSummary}</p>
                </div>
              )}

              {/* Doctor's Notes */}
              {selectedConsultation.notes && (
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    Doctor's Notes
                  </h4>
                  <div className="max-h-40 overflow-y-auto">
                    <p className="text-gray-700 leading-relaxed">{selectedConsultation.notes}</p>
                  </div>
                </div>
              )}

              {/* Prescriptions */}
              {selectedConsultation.prescriptions.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    Prescriptions
                  </h4>
                  <div className="space-y-2">
                    {selectedConsultation.prescriptions.map((prescription, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="font-medium text-gray-800">{prescription}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reports */}
              {selectedConsultation.reports.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Reports & Documents
                  </h4>
                  <div className="space-y-2">
                    {selectedConsultation.reports.map((report, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white rounded-lg p-3 border border-blue-200"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-red-500" />
                          <span className="font-medium text-gray-800">{report}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
