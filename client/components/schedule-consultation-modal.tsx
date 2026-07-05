"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import {
  Clock,
  Star,
  Upload,
  X,
  Video,
  Phone,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { getDoctors, getDoctorAvailability, createConsultation, type Doctor } from "@/lib/data-service"

interface ScheduleConsultationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConsultationScheduled?: () => void
}

export default function ScheduleConsultationModal({
  open,
  onOpenChange,
  onConsultationScheduled,
}: ScheduleConsultationModalProps) {
  const [step, setStep] = useState(1)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [consultationType, setConsultationType] = useState("Video Call")
  const [reason, setReason] = useState("")
  const [severity, setSeverity] = useState("medium")
  const [patientNotes, setPatientNotes] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [doctors, setDoctors] = useState<Doctor[]>([])

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setStep(1)
      setSelectedDoctor(null)
      setSelectedDate(undefined)
      setSelectedTime("")
      setAvailableSlots([])
      setConsultationType("Video Call")
      setReason("")
      setSeverity("medium")
      setPatientNotes("")
      setAttachments([])
      setIsSubmitting(false)
    }
  }, [open])

  // Load doctors list
  useEffect(() => {
    if (open) {
      getDoctors().then(setDoctors).catch(console.error)
    }
  }, [open])

  // Update available slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      getDoctorAvailability(selectedDoctor.id, dateStr)
        .then(setAvailableSlots)
        .catch(console.error)
      setSelectedTime("")
    }
  }, [selectedDoctor, selectedDate])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason) return

    setIsSubmitting(true)

    try {
      const consultationData = {
        doctorId: selectedDoctor.id,
        patientName: "John Doe", // In a real app, this would come from user context
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        duration: 30, // Default duration
        type: consultationType,
        status: "upcoming" as const,
        reason,
        severity: severity as "low" | "medium" | "high",
        notes: "",
        patientNotes,
        prescription: null,
        attachments: attachments.map((file) => file.name),
      }

      const newConsultation = await createConsultation(consultationData)
      console.log("[v0] Created consultation:", newConsultation)

      onConsultationScheduled?.()
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error creating consultation:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSeverityColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "high":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getSeverityIcon = (level: string) => {
    switch (level) {
      case "low":
        return <CheckCircle2 className="w-4 h-4" />
      case "medium":
        return <Clock className="w-4 h-4" />
      case "high":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-600" />
            Schedule New Consultation
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step >= stepNum ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600",
                  )}
                >
                  {stepNum}
                </div>
                <span className={cn("text-sm font-medium", step >= stepNum ? "text-blue-600" : "text-gray-500")}>
                  {stepNum === 1 && "Select Doctor"}
                  {stepNum === 2 && "Choose Date & Time"}
                  {stepNum === 3 && "Consultation Details"}
                </span>
                {stepNum < 3 && (
                  <div className={cn("w-8 h-0.5 mx-2", step > stepNum ? "bg-blue-600" : "bg-gray-200")} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select Doctor */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Choose a Doctor</Label>
              <p className="text-sm text-gray-600 mb-4">Select from our available healthcare professionals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {doctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    selectedDoctor?.id === doctor.id ? "ring-2 ring-blue-500 bg-blue-50/50" : "hover:bg-gray-50",
                  )}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{doctor.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{doctor.experience} years</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            ${doctor.consultationFee}
                          </Badge>
                          <div className="flex gap-1">
                            {doctor.languages.slice(0, 2).map((lang) => (
                              <Badge key={lang} variant="secondary" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} disabled={!selectedDoctor} className="bg-blue-600 hover:bg-blue-700">
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Date & Time */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Select Date & Time</Label>
              <p className="text-sm text-gray-600">Choose your preferred appointment slot</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calendar */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date: Date) => date < new Date() || date < new Date(Date.now() - 86400000)}
                  className="rounded-md border"
                />
              </div>

              {/* Time Slots */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Available Time Slots</Label>
                {selectedDate ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.map((slot) => (
                          <Button
                            key={slot}
                            variant={selectedTime === slot ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(slot)}
                            className="justify-start"
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            {slot}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-8">No available slots for this date</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">Please select a date first</p>
                )}
              </div>
            </div>

            {/* Consultation Type */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Consultation Type</Label>
              <RadioGroup value={consultationType} onValueChange={setConsultationType}>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="Video Call" id="video" />
                    <Label htmlFor="video" className="flex items-center gap-2 cursor-pointer">
                      <Video className="w-4 h-4" />
                      Video Call
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="Phone Call" id="phone" />
                    <Label htmlFor="phone" className="flex items-center gap-2 cursor-pointer">
                      <Phone className="w-4 h-4" />
                      Phone Call
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="Chat" id="chat" />
                    <Label htmlFor="chat" className="flex items-center gap-2 cursor-pointer">
                      <MessageSquare className="w-4 h-4" />
                      Chat
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Consultation Details */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Consultation Details</Label>
              <p className="text-sm text-gray-600">Provide information about your health concern</p>
            </div>

            <div className="space-y-4">
              {/* Reason for Consultation */}
              <div>
                <Label htmlFor="reason" className="text-sm font-medium">
                  Reason for Consultation *
                </Label>
                <Input
                  id="reason"
                  placeholder="e.g., Follow-up for hypertension, Annual checkup, Skin rash..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Severity Level */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Severity Level</Label>
                <RadioGroup value={severity} onValueChange={setSeverity}>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low" className="flex items-center gap-2 cursor-pointer">
                        <div className={cn("p-1 rounded", getSeverityColor("low"))}>{getSeverityIcon("low")}</div>
                        <div>
                          <div className="font-medium">Low</div>
                          <div className="text-xs text-gray-500">Routine/Preventive</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="flex items-center gap-2 cursor-pointer">
                        <div className={cn("p-1 rounded", getSeverityColor("medium"))}>{getSeverityIcon("medium")}</div>
                        <div>
                          <div className="font-medium">Medium</div>
                          <div className="text-xs text-gray-500">Moderate concern</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high" className="flex items-center gap-2 cursor-pointer">
                        <div className={cn("p-1 rounded", getSeverityColor("high"))}>{getSeverityIcon("high")}</div>
                        <div>
                          <div className="font-medium">High</div>
                          <div className="text-xs text-gray-500">Urgent attention</div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Patient Notes */}
              <div>
                <Label htmlFor="notes" className="text-sm font-medium">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Describe your symptoms, concerns, or any additional information..."
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>

              {/* File Upload */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Medical Documents (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload medical reports, test results, or images</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>Choose Files</span>
                    </Button>
                  </Label>
                </div>

                {/* Uploaded Files */}
                {attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Consultation Summary</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Doctor:</span> {selectedDoctor?.name}
                </p>
                <p>
                  <span className="font-medium">Date:</span> {selectedDate && format(selectedDate, "PPP")}
                </p>
                <p>
                  <span className="font-medium">Time:</span> {selectedTime}
                </p>
                <p>
                  <span className="font-medium">Type:</span> {consultationType}
                </p>
                <p>
                  <span className="font-medium">Fee:</span> ${selectedDoctor?.consultationFee}
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!reason || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Scheduling..." : "Schedule Consultation"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
