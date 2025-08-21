"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, MoreHorizontal, ArrowUpRight, Phone, Mail, MapPin, Plus, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
import { type Patient, initialPatients, STORAGE_KEYS, loadFromStorage, saveToStorage } from "@/lib/data"

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    diagnosis: "",
    phone: "",
    email: "",
    address: "",
    status: "Active" as "Active" | "Inactive",
    heartRate: "",
    bloodPressure: "",
    glucose: "",
  })

  useEffect(() => {
    const storedPatients = loadFromStorage(STORAGE_KEYS.PATIENTS, initialPatients)
    setPatients(storedPatients)
  }, [])

  useEffect(() => {
    if (patients.length > 0) {
      saveToStorage(STORAGE_KEYS.PATIENTS, patients)
    }
  }, [patients])

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddPatient = () => {
    if (!formData.name || !formData.age || !formData.diagnosis) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newPatient: Patient = {
      id: Math.max(...patients.map((p) => p.id), 0) + 1,
      name: formData.name,
      age: Number.parseInt(formData.age),
      diagnosis: formData.diagnosis,
      avatar: "/placeholder.svg?height=40&width=40",
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      lastVisit: new Date().toLocaleDateString(),
      status: formData.status,
      heartRate: Number.parseInt(formData.heartRate) || 0,
      bloodPressure: formData.bloodPressure,
      glucose: Number.parseInt(formData.glucose) || 0,
    }

    setPatients([...patients, newPatient])
    setIsAddDialogOpen(false)
    resetForm()
    toast({
      title: "Success",
      description: "Patient added successfully",
    })
  }

  const handleUpdatePatient = () => {
    if (!editingPatient || !formData.name || !formData.age || !formData.diagnosis) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const updatedPatient: Patient = {
      ...editingPatient,
      name: formData.name,
      age: Number.parseInt(formData.age),
      diagnosis: formData.diagnosis,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      status: formData.status,
      heartRate: Number.parseInt(formData.heartRate) || 0,
      bloodPressure: formData.bloodPressure,
      glucose: Number.parseInt(formData.glucose) || 0,
    }

    setPatients(patients.map((p) => (p.id === editingPatient.id ? updatedPatient : p)))
    setIsEditDialogOpen(false)
    setEditingPatient(null)
    resetForm()
    toast({
      title: "Success",
      description: "Patient updated successfully",
    })
  }

  const handleDeletePatient = (patientId: number) => {
    setPatients(patients.filter((p) => p.id !== patientId))
    toast({
      title: "Success",
      description: "Patient deleted successfully",
    })
  }

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient)
    setFormData({
      name: patient.name,
      age: patient.age.toString(),
      diagnosis: patient.diagnosis,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      status: patient.status,
      heartRate: patient.heartRate.toString(),
      bloodPressure: patient.bloodPressure,
      glucose: patient.glucose.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      diagnosis: "",
      phone: "",
      email: "",
      address: "",
      status: "Active",
      heartRate: "",
      bloodPressure: "",
      glucose: "",
    })
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Profiles</h1>
          <p className="text-gray-600">Manage and view detailed patient information and medical records.</p>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search patients by name or diagnosis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/50"
                />
              </div>
              <Button variant="outline" className="bg-white/50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-slate-800 hover:bg-slate-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Patient
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Patient</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Patient name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        placeholder="Age"
                      />
                    </div>
                    <div>
                      <Label htmlFor="diagnosis">Diagnosis *</Label>
                      <Input
                        id="diagnosis"
                        value={formData.diagnosis}
                        onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                        placeholder="Primary diagnosis"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: "Active" | "Inactive") => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddPatient} className="flex-1">
                        Add Patient
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Patient</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Patient name"
                />
              </div>
              <div>
                <Label htmlFor="edit-age">Age *</Label>
                <Input
                  id="edit-age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Age"
                />
              </div>
              <div>
                <Label htmlFor="edit-diagnosis">Diagnosis *</Label>
                <Input
                  id="edit-diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="Primary diagnosis"
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email address"
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "Active" | "Inactive") => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdatePatient} className="flex-1">
                  Update Patient
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Patient Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-colors"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{patient.name}</h3>
                    <p className="text-sm text-gray-500">{patient.age} years old</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleEditPatient(patient)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Patient
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeletePatient(patient.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Patient
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Diagnosis</p>
                  <p className="font-medium">{patient.diagnosis}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge
                    variant={patient.status === "Active" ? "default" : "secondary"}
                    className={
                      patient.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }
                  >
                    {patient.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Heart Rate</span>
                    <span className="font-medium">{patient.heartRate} bpm</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Blood Pressure</span>
                    <span className="font-medium">{patient.bloodPressure}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Glucose</span>
                    <span className="font-medium">{patient.glucose} mg/dL</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/50">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Phone className="w-3 h-3" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Mail className="w-3 h-3" />
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{patient.address}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1" asChild>
                    <Link href={`/patients/${patient.id}`}>
                      View Details
                      <ArrowUpRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/50">
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
