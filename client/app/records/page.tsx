"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  FileText,
  Download,
  Eye,
  Plus,
  Calendar,
  User,
  Activity,
  Heart,
  Pill,
  TestTube,
  Stethoscope,
  MoreHorizontal,
  Upload,
  Share,
  Archive,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import DashboardLayout from "@/components/dashboard-layout"

const medicalRecords = [
  {
    id: 1,
    patient: "Arindam Chatterjee",
    patientId: "P001",
    patientAvatar: "/patient-arindam.png",
    recordType: "Lab Results",
    title: "Lipid Profile",
    date: "2025-07-28",
    doctor: "Dr. Anirban Dutta",
    category: "Laboratory",
    status: "Final",
    fileSize: "2.1 MB",
    description: "Cholesterol slightly elevated, triglycerides normal",
    tags: ["Blood Test", "Cholesterol"],
    priority: "Normal",
  },
  {
    id: 2,
    patient: "Madhumita Chatterjee",
    patientId: "P002",
    patientAvatar: "/patient-madhumita.png",
    recordType: "Lab Results",
    title: "HbA1c Test",
    date: "2025-07-15",
    doctor: "Dr. Priya Banerjee",
    category: "Endocrinology",
    status: "Final",
    fileSize: "1.8 MB",
    description: "HbA1c at 7.2%, indicating moderate diabetes control",
    tags: ["Diabetes", "Blood Sugar"],
    priority: "High",
  },
  {
    id: 3,
    patient: "Riya Chatterjee",
    patientId: "P003",
    patientAvatar: "/patient-riya.png",
    recordType: "Prescription",
    title: "Allergy Medication",
    date: "2025-08-10",
    doctor: "Dr. Sunita Sen",
    category: "Allergy & Immunology",
    status: "Active",
    fileSize: "1.2 MB",
    description: "Cetirizine syrup prescribed for 5 days",
    tags: ["Allergy", "Prescription"],
    priority: "Normal",
  },
  {
    id: 4,
    patient: "Anirban Chatterjee",
    patientId: "P004",
    patientAvatar: "/patient-anirban.png",
    recordType: "Imaging",
    title: "Knee MRI",
    date: "2025-08-15",
    doctor: "Dr. Soumitra Ghosh",
    category: "Orthopedics",
    status: "Preliminary",
    fileSize: "9.4 MB",
    description: "Minor ligament strain suspected, awaiting final report",
    tags: ["MRI", "Knee Injury"],
    priority: "High",
  },
  {
    id: 5,
    patient: "Sudha Chatterjee",
    patientId: "P005",
    patientAvatar: "/patient-sudha.png",
    recordType: "Consultation Notes",
    title: "Arthritis Pain Management",
    date: "2025-08-12",
    doctor: "Dr. Kunal Mukherjee",
    category: "Rheumatology",
    status: "Final",
    fileSize: "3.3 MB",
    description: "Advised physiotherapy and prescribed calcium supplements",
    tags: ["Arthritis", "Joint Pain"],
    priority: "Normal",
  },
]

const recordCategories = [
  { name: "Laboratory", count: 12, icon: TestTube, color: "bg-blue-100 text-blue-600" },
  { name: "Radiology", count: 8, icon: Activity, color: "bg-green-100 text-green-600" },
  { name: "Pharmacy", count: 15, icon: Pill, color: "bg-purple-100 text-purple-600" },
  { name: "Cardiology", count: 6, icon: Heart, color: "bg-red-100 text-red-600" },
  { name: "Surgery", count: 4, icon: Stethoscope, color: "bg-orange-100 text-orange-600" },
  { name: "General", count: 23, icon: FileText, color: "bg-gray-100 text-gray-600" },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Final":
      return "bg-green-100 text-green-800"
    case "Active":
      return "bg-blue-100 text-blue-800"
    case "Draft":
      return "bg-yellow-100 text-yellow-800"
    case "Archived":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800"
    case "Medium":
      return "bg-yellow-100 text-yellow-800"
    case "Normal":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function MedicalRecordsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredRecords = medicalRecords.filter((record) => {
    const matchesSearch =
      record.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.recordType.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === "all" || record.category.toLowerCase() === selectedCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Records</h1>
            <p className="text-gray-600">Comprehensive patient medical records and documentation management.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/50">
              <Upload className="w-4 h-4 mr-2" />
              Upload Record
            </Button>
            <Button className="bg-slate-800 hover:bg-slate-700">
              <Plus className="w-4 h-4 mr-2" />
              New Record
            </Button>
          </div>
        </div>

        {/* Categories Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {recordCategories.map((category) => {
            const Icon = category.icon
            return (
              <Card
                key={category.name}
                className={`bg-white/60 backdrop-blur-sm border-white/20 cursor-pointer transition-colors hover:bg-white/70 ${
                  selectedCategory === category.name.toLowerCase() ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.name.toLowerCase() ? "all" : category.name.toLowerCase(),
                  )
                }
              >
                <CardContent className="p-4 text-center">
                  <div
                    className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-2`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-sm">{category.name}</p>
                  <p className="text-xs text-gray-500">{category.count} records</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search records by patient, title, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/50"
                />
              </div>
              <Button variant="outline" className="bg-white/50">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filter
              </Button>
              <Button variant="outline" className="bg-white/50">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
              {selectedCategory !== "all" && (
                <Button
                  variant="outline"
                  className="bg-blue-50 text-blue-600 border-blue-200"
                  onClick={() => setSelectedCategory("all")}
                >
                  Clear Filter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Records Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/60 backdrop-blur-sm border-white/20">
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>All Medical Records</span>
                  <span className="text-sm font-normal text-gray-500">{filteredRecords.length} records found</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 bg-white/30 rounded-lg hover:bg-white/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{record.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {record.recordType}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{record.patient}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{record.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Stethoscope className="w-3 h-3" />
                              <span>{record.doctor}</span>
                            </div>
                            <span>• {record.fileSize}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{record.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {record.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-gray-100">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                        <Badge className={getPriorityColor(record.priority)}>{record.priority}</Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="bg-white/50">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="bg-white/50">
                            <Download className="w-3 h-3" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline" className="bg-white/50">
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Share className="w-4 h-4 mr-2" />
                                Share Record
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Archive className="w-4 h-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/patients/${record.patientId}`}>
                                  <User className="w-4 h-4 mr-2" />
                                  View Patient
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Recent Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRecords.slice(0, 3).map((record) => (
                    <div key={record.id} className="flex items-center gap-4 p-4 bg-white/30 rounded-lg">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={record.patientAvatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {record.patient
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{record.title}</h4>
                        <p className="text-sm text-gray-600">
                          {record.patient} • {record.date}
                        </p>
                        <p className="text-sm text-gray-500">{record.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                        <Button size="sm" variant="outline" className="bg-white/50">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRecords
                    .filter((record) => record.status === "Draft")
                    .map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-4 bg-yellow-50/50 rounded-lg border border-yellow-200/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{record.title}</h4>
                            <p className="text-sm text-gray-600">
                              {record.patient} • {record.date}
                            </p>
                            <p className="text-sm text-gray-500">{record.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="archived" className="space-y-4">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Archived Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Archived Records</h3>
                  <p className="text-gray-500">Archived medical records will appear here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
