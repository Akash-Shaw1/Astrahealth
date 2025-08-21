"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  CalendarIcon,
  Clock,
  Video,
  Phone,
  MessageSquare,
  User,
  FileText,
  Star,
  Download,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getDoctorById, updateConsultation, type Consultation } from "@/lib/data-service"

interface ConsultationDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  consultation: Consultation | null
  onConsultationUpdated?: () => void
}

export default function ConsultationDetailsModal({
  open,
  onOpenChange,
  consultation,
  onConsultationUpdated,
}: ConsultationDetailsModalProps) {
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!consultation) return null

  const doctor = getDoctorById(consultation.doctorId)
  if (!doctor) return null

  const handleJoinCall = () => {
    console.log("[v0] Joining consultation call:", consultation.id)
    // In a real app, this would open the video call interface
    alert(`Joining ${consultation.type} with ${doctor.name}...`)
  }

  const handleDownloadReport = () => {
    console.log("[v0] Downloading report for consultation:", consultation.id)
    // In a real app, this would download the actual report
    const reportName = `${doctor.name.replace(/\s+/g, "_")}_${consultation.date}_Report.pdf`
    alert(`Downloading ${reportName}...`)
  }

  const handleRateConsultation = async () => {
    if (!consultation) return

    setIsSubmitting(true)
    try {
      const updatedConsultation = updateConsultation(consultation.id, {
        rating: rating,
        notes: consultation.notes + (feedback ? `\n\nPatient Feedback: ${feedback}` : ""),
      })

      console.log("[v0] Consultation rated:", updatedConsultation)
      onConsultationUpdated?.()
      setShowRatingForm(false)
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error rating consultation:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "missed":
        return "bg-orange-100 text-orange-800"
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
      case "missed":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            Consultation Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-gray-600">{doctor.specialty}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{doctor.rating}</span>
                  <span className="text-sm text-gray-500">• {doctor.experience} years</span>
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(consultation.status)}>
              {getStatusIcon(consultation.status)}
              <span className="ml-1 capitalize">{consultation.status}</span>
            </Badge>
          </div>

          {/* Consultation Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consultation Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="font-medium">{formatDate(consultation.date)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Time</div>
                    <div className="font-medium">{consultation.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {consultation.type === "Video Call" ? (
                    <Video className="w-4 h-4 text-gray-500" />
                  ) : consultation.type === "Phone Call" ? (
                    <Phone className="w-4 h-4 text-gray-500" />
                  ) : (
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                  )}
                  <div>
                    <div className="text-sm text-gray-500">Type</div>
                    <div className="font-medium">{consultation.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-medium">{consultation.duration} minutes</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Reason for Consultation</span>
                  <Badge className={getSeverityColor(consultation.severity)}>{consultation.severity} priority</Badge>
                </div>
                <p className="text-gray-700">{consultation.reason}</p>
              </div>

              {consultation.patientNotes && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Patient Notes</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-blue-900 text-sm">{consultation.patientNotes}</p>
                  </div>
                </div>
              )}

              {consultation.notes && consultation.status === "completed" && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Doctor's Notes</span>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-green-900 text-sm">{consultation.notes}</p>
                  </div>
                </div>
              )}

              {consultation.prescription && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">Prescription</span>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-purple-900 text-sm">{consultation.prescription}</p>
                  </div>
                </div>
              )}

              {consultation.attachments && consultation.attachments.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Attachments</span>
                  </div>
                  <div className="space-y-2">
                    {consultation.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{attachment}</span>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {consultation.rating && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">Your Rating: {consultation.rating}/5</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rating Form */}
          {showRatingForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rate Your Consultation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Rating</Label>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setRating(star)} className="p-1">
                        <Star
                          className={cn(
                            "w-6 h-6",
                            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="feedback" className="text-sm font-medium">
                    Feedback (Optional)
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Share your experience with this consultation..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleRateConsultation}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Rating"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowRatingForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {consultation.status === "upcoming" && (
              <Button onClick={handleJoinCall} className="bg-green-600 hover:bg-green-700 text-white">
                <Video className="w-4 h-4 mr-2" />
                Join {consultation.type}
              </Button>
            )}
            {consultation.status === "completed" && (
              <Button onClick={handleDownloadReport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            )}
            {consultation.status === "completed" && !consultation.rating && (
              <Button onClick={() => setShowRatingForm(true)} variant="outline">
                <Star className="w-4 h-4 mr-2" />
                Rate Consultation
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
