"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Search,
  Download,
  Calendar,
  User,
  Pill,
  Activity,
  Heart,
  Eye,
  ChevronRight,
  Stethoscope,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getMedicalRecords, getDoctorById, getConsultationById, type MedicalRecord } from "@/lib/data-service"

interface MedicalRecordsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function MedicalRecordsModal({ open, onOpenChange }: MedicalRecordsModalProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  useEffect(() => {
    if (open) {
      loadMedicalRecords()
    }
  }, [open])

  const loadMedicalRecords = () => {
    const medicalRecords = getMedicalRecords()
    setRecords(medicalRecords)
    if (medicalRecords.length > 0 && !selectedRecord) {
      setSelectedRecord(medicalRecords[0])
    }
  }

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      searchQuery === "" ||
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab = selectedTab === "all" || record.type.toLowerCase().includes(selectedTab.toLowerCase())

    return matchesSearch && matchesTab
  })

  const getRecordTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "consultation report":
        return <Stethoscope className="w-4 h-4" />
      case "dermatology report":
        return <Eye className="w-4 h-4" />
      case "cardiology report":
        return <Heart className="w-4 h-4" />
      case "lab results":
        return <Activity className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getRecordTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "consultation report":
        return "bg-blue-100 text-blue-800"
      case "dermatology report":
        return "bg-purple-100 text-purple-800"
      case "cardiology report":
        return "bg-red-100 text-red-800"
      case "lab results":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderRecordDetails = (record: MedicalRecord) => {
    const doctor = getDoctorById(record.doctorId)
    const consultation = getConsultationById(record.consultationId)

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{record.title}</h3>
              <p className="text-gray-600 mt-1">{record.summary}</p>
            </div>
            <Badge className={getRecordTypeColor(record.type)}>
              {getRecordTypeIcon(record.type)}
              <span className="ml-1">{record.type}</span>
            </Badge>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(record.date)}</span>
            </div>
            {doctor && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>
                  {doctor.name} - {doctor.specialty}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Doctor Information */}
        {doctor && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                Healthcare Provider
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{doctor.name}</h4>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  <p className="text-xs text-gray-500">{doctor.education}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medical Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-green-600" />
              Medical Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Vitals */}
            {record.details.vitals && (
              <div>
                <h5 className="font-semibold mb-3 text-gray-900">Vital Signs</h5>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(record.details.vitals).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                      <div className="font-semibold text-gray-900">{value as string}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Diagnosis */}
            {record.details.diagnosis && (
              <div>
                <h5 className="font-semibold mb-2 text-gray-900">Diagnosis</h5>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-blue-900 font-medium">{record.details.diagnosis}</p>
                  {record.details.severity && (
                    <p className="text-blue-700 text-sm mt-1">Severity: {record.details.severity}</p>
                  )}
                </div>
              </div>
            )}

            {/* Findings */}
            {record.details.findings && (
              <div>
                <h5 className="font-semibold mb-2 text-gray-900">Clinical Findings</h5>
                <div className="space-y-2">
                  {record.details.findings.map((finding: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Symptoms */}
            {record.details.symptoms && (
              <div>
                <h5 className="font-semibold mb-2 text-gray-900">Symptoms</h5>
                <div className="space-y-2">
                  {record.details.symptoms.map((symptom: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Treatment */}
            {record.details.treatment && (
              <div>
                <h5 className="font-semibold mb-2 text-gray-900">Treatment Plan</h5>
                <div className="space-y-2">
                  {record.details.treatment.map((treatment: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <Activity className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{treatment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {record.details.recommendations && (
              <div>
                <h5 className="font-semibold mb-2 text-gray-900">Recommendations</h5>
                <div className="space-y-2">
                  {record.details.recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Factors */}
            {record.details.riskFactors && (
              <div>
                <h5 className="font-semibold mb-2 text-gray-900">Risk Factors</h5>
                <div className="space-y-2">
                  {record.details.riskFactors.map((factor: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prescriptions */}
        {record.prescription && record.prescription.medications && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Pill className="w-5 h-5 text-purple-600" />
                Prescriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {record.prescription.medications.map((medication, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-purple-50">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-purple-900">{medication.name}</h5>
                      <Badge variant="outline" className="text-purple-700 border-purple-300">
                        {medication.duration}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Dosage:</span> {medication.dosage}
                      </p>
                      <p>
                        <span className="font-medium">Instructions:</span> {medication.instructions}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attachments */}
        {record.attachments && record.attachments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                Attachments & Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {record.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">{attachment}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Follow-up */}
        {record.followUp && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="font-semibold text-orange-900">Follow-up Required</span>
              </div>
              <p className="text-sm text-orange-800">Next appointment scheduled for: {formatDate(record.followUp)}</p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Medical Records
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 h-[75vh]">
          {/* Records List */}
          <div className="w-80 border-r pr-6">
            <div className="space-y-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search records..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Tabs */}
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all" className="text-xs">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="consultation" className="text-xs">
                    Consult
                  </TabsTrigger>
                  <TabsTrigger value="lab" className="text-xs">
                    Labs
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Records List */}
            <ScrollArea className="h-[calc(100%-120px)]">
              <div className="space-y-3">
                {filteredRecords.map((record) => {
                  const doctor = getDoctorById(record.doctorId)
                  return (
                    <Card
                      key={record.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-md",
                        selectedRecord?.id === record.id ? "ring-2 ring-blue-500 bg-blue-50/50" : "hover:bg-gray-50",
                      )}
                      onClick={() => setSelectedRecord(record)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={cn("text-xs", getRecordTypeColor(record.type))}>
                            {getRecordTypeIcon(record.type)}
                            <span className="ml-1">{record.type}</span>
                          </Badge>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>

                        <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">{record.title}</h4>

                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{record.summary}</p>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatDate(record.date)}</span>
                          {doctor && <span>{doctor.name}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Record Details */}
          <div className="flex-1">
            {selectedRecord ? (
              <ScrollArea className="h-full">
                <div className="pr-4">{renderRecordDetails(selectedRecord)}</div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">Select a medical record to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{records.length}</div>
              <div className="text-xs text-gray-600">Total Records</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {records.filter((r) => r.type.includes("Consultation")).length}
              </div>
              <div className="text-xs text-gray-600">Consultations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {records.filter((r) => r.prescription?.medications?.length).length}
              </div>
              <div className="text-xs text-gray-600">With Prescriptions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{records.filter((r) => r.followUp).length}</div>
              <div className="text-xs text-gray-600">Follow-ups</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
