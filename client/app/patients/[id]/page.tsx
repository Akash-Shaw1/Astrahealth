"use client"

import { use, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Heart,
  Activity,
  Thermometer,
  Weight,
  Edit,
  MoreHorizontal,
  Download,
  Eye,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts"
import DashboardLayout from "@/components/dashboard-layout"

// Mock patient data - in real app this would come from API
const patientData = {
  id: 1,
  name: "Arindam Chatterjee",
  age: 52,
  dateOfBirth: "April 12, 1973",
  gender: "Male",
  diagnosis: "Hypertension",
  avatar: "/patient-arindam.png",
  phone: "+91 98301 23456",
  email: "arindam.chatterjee@email.com",
  address: "Flat 3B, Lake Gardens, Kolkata, WB 700045",
  emergencyContact: {
    name: "Madhumita Chatterjee",
    relationship: "Wife",
    phone: "+91 98740 56789",
  },
  insurance: "Star Health Insurance",
  allergies: ["None"],
  medications: ["Telmisartan 40mg", "Amlodipine 5mg"],
  lastVisit: "July 28, 2025",
  nextAppointment: "August 25, 2025",
  status: "Active",
}

// Father (Arindam) Vitals
const vitalSigns = [
  { date: "Aug 20", heartRate: 88, bloodPressure: 142, temperature: 98.4, weight: 74 },
  { date: "Aug 21", heartRate: 92, bloodPressure: 145, temperature: 98.5, weight: 74 },
  { date: "Aug 22", heartRate: 86, bloodPressure: 140, temperature: 98.6, weight: 73 },
  { date: "Aug 23", heartRate: 90, bloodPressure: 144, temperature: 98.5, weight: 73 },
  { date: "Aug 24", heartRate: 87, bloodPressure: 141, temperature: 98.6, weight: 73 },
]

// Father (Arindam) BP Logs
const bloodPressureData = [
  { date: "Aug 20", systolic: 142, diastolic: 92 },
  { date: "Aug 21", systolic: 145, diastolic: 94 },
  { date: "Aug 22", systolic: 140, diastolic: 90 },
  { date: "Aug 23", systolic: 144, diastolic: 91 },
  { date: "Aug 24", systolic: 141, diastolic: 89 },
]


const medicalHistory = [
  {
    id: 1,
    date: "Jul 28, 2025",
    type: "Follow-up",
    doctor: "Dr. Anirban Dutta",
    specialty: "Cardiologist",
    diagnosis: "Hypertension stable",
    notes: "Continue Telmisartan, added Amlodipine for better control",
    documents: ["BP_Monitoring.pdf", "Blood_Test_Results.pdf"],
  },
  {
    id: 2,
    date: "Jun 12, 2025",
    type: "Consultation",
    doctor: "Dr. Anirban Dutta",
    specialty: "Cardiologist",
    diagnosis: "Elevated blood pressure",
    notes: "Increased Telmisartan dosage, advised lifestyle changes",
    documents: ["ECG_Report.pdf"],
  },
]


export default function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/patients">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Patients
            </Link>
          </Button>
        </div>

        {/* Patient Header */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={patientData.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {patientData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{patientData.name}</h1>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Age:</span> {patientData.age} years old
                    </div>
                    <div>
                      <span className="font-medium">DOB:</span> {patientData.dateOfBirth}
                    </div>
                    <div>
                      <span className="font-medium">Gender:</span> {patientData.gender}
                    </div>
                    <div>
                      <span className="font-medium">Patient ID:</span> #{patientData.id.toString().padStart(6, "0")}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {patientData.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-white/50">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="bg-white/50">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-500" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{patientData.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{patientData.email}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <span>{patientData.address}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{patientData.emergencyContact.name}</p>
                <p className="text-sm text-gray-600">{patientData.emergencyContact.relationship}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{patientData.emergencyContact.phone}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" />
                Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Last Visit</p>
                <p className="font-medium">{patientData.lastVisit}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Appointment</p>
                <p className="font-medium">{patientData.nextAppointment}</p>
              </div>
              <Button size="sm" className="w-full">
                Schedule Appointment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/60 backdrop-blur-sm border-white/20">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle>Current Diagnosis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg">{patientData.diagnosis}</h4>
                      <p className="text-sm text-gray-600 mt-2">
                        Patient is currently being monitored for mild hypertension. Blood pressure readings have been
                        consistently elevated but manageable with current medication regimen.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Current Medications</h5>
                      <div className="space-y-1">
                        {patientData.medications.map((med, index) => (
                          <Badge key={index} variant="outline" className="mr-2">
                            {med}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Known Allergies</h5>
                      <div className="space-y-1">
                        {patientData.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive" className="mr-2 bg-red-100 text-red-800">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle>Current Vital Signs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                      <Heart className="w-8 h-8 text-red-500" />
                      <div>
                        <p className="text-sm text-gray-600">Heart Rate</p>
                        <p className="font-bold text-lg">112 bpm</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                      <Activity className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Blood Pressure</p>
                        <p className="font-bold text-lg">140/90</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                      <Thermometer className="w-8 h-8 text-orange-500" />
                      <div>
                        <p className="text-sm text-gray-600">Temperature</p>
                        <p className="font-bold text-lg">98.6°F</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                      <Weight className="w-8 h-8 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">Weight</p>
                        <p className="font-bold text-lg">135 lbs</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle>Heart Rate Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={vitalSigns}>
                        <XAxis dataKey="date" />
                        <YAxis domain={[80, 120]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle>Blood Pressure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={bloodPressureData}>
                        <XAxis dataKey="date" />
                        <YAxis domain={[70, 160]} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="systolic"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="diastolic"
                          stackId="2"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicalHistory.map((record) => (
                    <div key={record.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50/30 rounded-r-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{record.type}</Badge>
                            <span className="text-sm text-gray-500">{record.date}</span>
                          </div>
                          <h4 className="font-semibold">{record.diagnosis}</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">{record.doctor}</span> - {record.specialty}
                          </p>
                          <p className="text-sm">{record.notes}</p>
                          {record.documents.length > 0 && (
                            <div className="mt-2 flex gap-2">
                              {record.documents.map((doc, index) => (
                                <Button key={index} variant="outline" size="sm" className="text-xs bg-transparent">
                                  <FileText className="w-3 h-3 mr-1" />
                                  {doc}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Patient Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Blood_Test_Results.pdf", date: "Dec 19, 2024", size: "2.4 MB" },
                    { name: "ECG_Report.pdf", date: "Dec 19, 2024", size: "1.8 MB" },
                    { name: "General_Checkup.pdf", date: "Nov 15, 2024", size: "3.1 MB" },
                    { name: "Initial_Assessment.pdf", date: "Oct 10, 2024", size: "2.7 MB" },
                    { name: "Treatment_Plan.pdf", date: "Oct 10, 2024", size: "1.5 MB" },
                  ].map((doc, index) => (
                    <div key={index} className="p-4 border border-gray-200/50 rounded-lg bg-white/30">
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="w-8 h-8 text-red-500" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {doc.date} • {doc.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                          <Download className="w-3 h-3 mr-1" />
                          Download
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
