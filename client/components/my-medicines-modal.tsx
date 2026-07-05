"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  X,
  Pill,
  Edit3,
  Trash2,
  Plus,
  Minus,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Bell,
  BellOff,
  Save,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { medicineDataService, type Medicine } from "@/lib/medicine-data-service"

interface MyMedicinesModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

interface EditingMedicine extends Medicine {
  isEditing: boolean
}

export default function MyMedicinesModal({ isOpen, onClose, onUpdate }: MyMedicinesModalProps) {
  const [medicines, setMedicines] = useState<EditingMedicine[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "low_doses" | "expiring">("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMedicine, setNewMedicine] = useState<Partial<Medicine>>({
    name: "",
    genericName: "",
    brand: "",
    strength: "",
    form: "tablet",
    purpose: "",
    dosageInstructions: "",
    frequency: "once daily",
    timing: "morning",
    mealTiming: "with or without food",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    remainingDoses: 30,
    totalDoses: 30,
    reminderEnabled: true,
    reminderTimes: ["08:00"],
    precautions: [],
    sideEffects: [],
    contraindications: [],
    missedDoseInstructions: "",
    practicalTips: [],
    addedBy: "manual_entry",
    isActive: true,
  })

  useEffect(() => {
    if (isOpen) {
      loadMedicines()
    }
  }, [isOpen])

  const loadMedicines = async () => {
    try {
      const currentMedicines = await medicineDataService.getCurrentMedicines()
      setMedicines(currentMedicines.map((med) => ({ ...med, isEditing: false })))
    } catch (err) {
      console.error("Failed to load medicines:", err)
    }
  }

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.purpose.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    switch (filterStatus) {
      case "active":
        return medicine.isActive
      case "low_doses":
        return medicine.remainingDoses <= 10
      case "expiring":
        const endDate = new Date(medicine.endDate)
        const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        return endDate <= thirtyDaysFromNow
      default:
        return true
    }
  })

  const handleEditMedicine = (id: string) => {
    setMedicines((prev) =>
      prev.map((med) => (med.id === id ? { ...med, isEditing: !med.isEditing } : { ...med, isEditing: false })),
    )
  }

  const handleSaveMedicine = async (id: string, updates: Partial<Medicine>) => {
    const updatedMedicine = await medicineDataService.updateMedicine(id, updates)
    if (updatedMedicine) {
      setMedicines((prev) => prev.map((med) => (med.id === id ? { ...updatedMedicine, isEditing: false } : med)))
      onUpdate()
    }
  }

  const handleDeleteMedicine = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      const success = await medicineDataService.deleteMedicine(id)
      if (success) {
        setMedicines((prev) => prev.filter((med) => med.id !== id))
        onUpdate()
      }
    }
  }

  const handleCompleteMedicine = async (id: string, name: string) => {
    if (confirm(`Mark ${name} as completed? This will move it to your medicine records.`)) {
      const success = await medicineDataService.completeMedicine(id, "Course completed by user")
      if (success) {
        setMedicines((prev) => prev.filter((med) => med.id !== id))
        onUpdate()
      }
    }
  }

  const handleTakeDose = async (id: string) => {
    const success = await medicineDataService.decrementDose(id, 1)
    if (success) {
      setMedicines((prev) =>
        prev.map((med) => {
          if (med.id === id) {
            const newRemaining = Math.max(0, med.remainingDoses - 1)
            return { ...med, remainingDoses: newRemaining }
          }
          return med
        }),
      )
      onUpdate()
    }
  }

  const handleRefillMedicine = async (id: string, name: string) => {
    const refillAmount = prompt(`How many doses would you like to add to ${name}?`, "30")
    if (refillAmount && !isNaN(Number(refillAmount))) {
      const success = await medicineDataService.refillMedicine(id, Number(refillAmount))
      if (success) {
        setMedicines((prev) =>
          prev.map((med) => {
            if (med.id === id) {
              return {
                ...med,
                remainingDoses: med.remainingDoses + Number(refillAmount),
                totalDoses: med.totalDoses + Number(refillAmount),
              }
            }
            return med
          }),
        )
        onUpdate()
      }
    }
  }

  const handleToggleReminder = (id: string, enabled: boolean) => {
    handleSaveMedicine(id, { reminderEnabled: enabled })
  }

  const handleAddNewMedicine = async () => {
    if (!newMedicine.name || !newMedicine.dosageInstructions) {
      alert("Please fill in at least the medicine name and dosage instructions.")
      return
    }

    const addedMedicine = await medicineDataService.addMedicine(newMedicine as Omit<Medicine, "id" | "addedDate">)
    setMedicines((prev) => [...prev, { ...addedMedicine, isEditing: false }])
    setNewMedicine({
      name: "",
      genericName: "",
      brand: "",
      strength: "",
      form: "tablet",
      purpose: "",
      dosageInstructions: "",
      frequency: "once daily",
      timing: "morning",
      mealTiming: "with or without food",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      remainingDoses: 30,
      totalDoses: 30,
      reminderEnabled: true,
      reminderTimes: ["08:00"],
      precautions: [],
      sideEffects: [],
      contraindications: [],
      missedDoseInstructions: "",
      practicalTips: [],
      addedBy: "manual_entry",
      isActive: true,
    })
    setShowAddForm(false)
    onUpdate()
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusColor = (medicine: Medicine) => {
    const daysRemaining = getDaysRemaining(medicine.endDate)
    if (medicine.remainingDoses <= 5) return "bg-red-100 text-red-800"
    if (medicine.remainingDoses <= 10) return "bg-orange-100 text-orange-800"
    if (daysRemaining <= 7) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  const MedicineCard = ({ medicine }: { medicine: EditingMedicine }) => {
    const daysRemaining = getDaysRemaining(medicine.endDate)
    const progressPercentage = ((medicine.totalDoses - medicine.remainingDoses) / medicine.totalDoses) * 100

    if (medicine.isEditing) {
      return (
        <Card className="border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`edit-name-${medicine.id}`}>Medicine Name</Label>
                  <Input
                    id={`edit-name-${medicine.id}`}
                    defaultValue={medicine.name}
                    onBlur={(e) => handleSaveMedicine(medicine.id, { name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor={`edit-strength-${medicine.id}`}>Strength</Label>
                  <Input
                    id={`edit-strength-${medicine.id}`}
                    defaultValue={medicine.strength}
                    onBlur={(e) => handleSaveMedicine(medicine.id, { strength: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`edit-dosage-${medicine.id}`}>Dosage Instructions</Label>
                  <Textarea
                    id={`edit-dosage-${medicine.id}`}
                    defaultValue={medicine.dosageInstructions}
                    onBlur={(e) => handleSaveMedicine(medicine.id, { dosageInstructions: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor={`edit-frequency-${medicine.id}`}>Frequency</Label>
                  <Select
                    defaultValue={medicine.frequency}
                    onValueChange={(value) => handleSaveMedicine(medicine.id, { frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once daily">Once daily</SelectItem>
                      <SelectItem value="twice daily">Twice daily</SelectItem>
                      <SelectItem value="three times daily">Three times daily</SelectItem>
                      <SelectItem value="four times daily">Four times daily</SelectItem>
                      <SelectItem value="as needed">As needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`edit-timing-${medicine.id}`}>Timing</Label>
                  <Select
                    defaultValue={medicine.timing}
                    onValueChange={(value) => handleSaveMedicine(medicine.id, { timing: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="morning and evening">Morning and Evening</SelectItem>
                      <SelectItem value="with meals">With Meals</SelectItem>
                      <SelectItem value="bedtime">Bedtime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`edit-remaining-${medicine.id}`}>Remaining Doses</Label>
                  <Input
                    id={`edit-remaining-${medicine.id}`}
                    type="number"
                    min="0"
                    defaultValue={medicine.remainingDoses}
                    onBlur={(e) =>
                      handleSaveMedicine(medicine.id, { remainingDoses: Number.parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`edit-end-date-${medicine.id}`}>End Date</Label>
                  <Input
                    id={`edit-end-date-${medicine.id}`}
                    type="date"
                    defaultValue={medicine.endDate}
                    onBlur={(e) => handleSaveMedicine(medicine.id, { endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEditMedicine(medicine.id)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => handleEditMedicine(medicine.id)}>
                  <Save className="w-4 h-4 mr-2" />
                  Done
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{medicine.name}</h3>
                <Badge className={getStatusColor(medicine)}>{medicine.remainingDoses} doses left</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                {medicine.strength} • {medicine.form} • {medicine.purpose}
              </p>
              <p className="text-sm text-gray-500">{medicine.dosageInstructions}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEditMedicine(medicine.id)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRefillMedicine(medicine.id, medicine.name)}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refill
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleCompleteMedicine(medicine.id, medicine.name)}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark Complete
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteMedicine(medicine.id, medicine.name)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}% taken</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Schedule and Timing */}
          <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{medicine.frequency}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{daysRemaining > 0 ? `${daysRemaining} days left` : "Course ended"}</span>
            </div>
          </div>

          {/* Timing Details */}
          <div className="text-xs text-gray-500 mb-3">
            <span className="font-medium">Timing:</span> {medicine.timing} • {medicine.mealTiming}
          </div>

          {/* Warnings */}
          {(medicine.remainingDoses <= 10 || daysRemaining <= 7) && (
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg mb-3">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-700">
                {medicine.remainingDoses <= 5
                  ? "Very low doses remaining"
                  : medicine.remainingDoses <= 10
                    ? "Low doses remaining"
                    : "Course ending soon"}
              </span>
            </div>
          )}

          {/* Precautions */}
          {medicine.precautions.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-700 mb-1">Precautions:</p>
              <p className="text-xs text-gray-600">{medicine.precautions[0]}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => handleTakeDose(medicine.id)}
                disabled={medicine.remainingDoses <= 0}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Minus className="w-4 h-4 mr-1" />
                Take Dose
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleRefillMedicine(medicine.id, medicine.name)}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Refill
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={medicine.reminderEnabled}
                onCheckedChange={(checked) => handleToggleReminder(medicine.id, checked)}
              />
              {medicine.reminderEnabled ? (
                <Bell className="w-4 h-4 text-blue-500" />
              ) : (
                <BellOff className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-600" />
                My Medicines
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">Manage your current medications and track doses</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Medicines</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="low_doses">Low Doses</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Medicine
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{medicines.length}</div>
                <div className="text-sm text-blue-700">Total Medicines</div>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{medicines.filter((m) => m.isActive).length}</div>
                <div className="text-sm text-green-700">Active</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {medicines.filter((m) => m.remainingDoses <= 10).length}
                </div>
                <div className="text-sm text-orange-700">Low Doses</div>
              </CardContent>
            </Card>
            <Card className="bg-red-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {medicines.filter((m) => getDaysRemaining(m.endDate) <= 7).length}
                </div>
                <div className="text-sm text-red-700">Expiring Soon</div>
              </CardContent>
            </Card>
          </div>

          {/* Add Medicine Form */}
          {showAddForm && (
            <Card className="mb-6 border-2 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">Add New Medicine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="new-name">Medicine Name *</Label>
                    <Input
                      id="new-name"
                      value={newMedicine.name}
                      onChange={(e) => setNewMedicine((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Lisinopril 10mg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-strength">Strength</Label>
                    <Input
                      id="new-strength"
                      value={newMedicine.strength}
                      onChange={(e) => setNewMedicine((prev) => ({ ...prev, strength: e.target.value }))}
                      placeholder="e.g., 10mg"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="new-dosage">Dosage Instructions *</Label>
                    <Textarea
                      id="new-dosage"
                      value={newMedicine.dosageInstructions}
                      onChange={(e) => setNewMedicine((prev) => ({ ...prev, dosageInstructions: e.target.value }))}
                      placeholder="e.g., Take 1 tablet once daily with food"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-frequency">Frequency</Label>
                    <Select
                      value={newMedicine.frequency}
                      onValueChange={(value) => setNewMedicine((prev) => ({ ...prev, frequency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once daily">Once daily</SelectItem>
                        <SelectItem value="twice daily">Twice daily</SelectItem>
                        <SelectItem value="three times daily">Three times daily</SelectItem>
                        <SelectItem value="four times daily">Four times daily</SelectItem>
                        <SelectItem value="as needed">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new-remaining">Remaining Doses</Label>
                    <Input
                      id="new-remaining"
                      type="number"
                      min="1"
                      value={newMedicine.remainingDoses}
                      onChange={(e) =>
                        setNewMedicine((prev) => ({ ...prev, remainingDoses: Number.parseInt(e.target.value) || 0 }))
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddNewMedicine} className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Medicine
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medicines List */}
          {filteredMedicines.length === 0 ? (
            <div className="text-center py-12">
              <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No medicines found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filter"
                  : "Add your first medicine to get started"}
              </p>
              {!searchQuery && filterStatus === "all" && (
                <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Medicine
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMedicines.map((medicine) => (
                <MedicineCard key={medicine.id} medicine={medicine} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
