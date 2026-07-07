"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  X,
  History,
  FileImage,
  Camera,
  User,
  Search,
  Filter,
  Download,
  Eye,
  Pill,
  CheckCircle2,
  Edit3,
  Plus,
  Trash2,
} from "lucide-react"
import { medicineDataService, type MedicineRecord } from "@/lib/medicine-data-service"

interface MedicineRecordsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MedicineRecordsModal({ isOpen, onClose }: MedicineRecordsModalProps) {
  const [records, setRecords] = useState<MedicineRecord[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<
    "all" | "prescription_scan" | "pill_identification" | "medicine_completed" | "dosage_update" | "manual_entry"
  >("all")
  const [selectedRecord, setSelectedRecord] = useState<MedicineRecord | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadRecords()
    }
  }, [isOpen])

  const loadRecords = async () => {
    const allRecords = await medicineDataService.getRecords()
    setRecords(allRecords)
  }

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      searchQuery === "" ||
      record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.extractedMedicines?.some((med) => med.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      record.identifiedMedicine?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.completedMedicine?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.changes?.some((change) => change.medicine.toLowerCase().includes(searchQuery.toLowerCase()))

    if (!matchesSearch) return false

    if (filterType === "all") return true
    return record.type === filterType
  })

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "prescription_scan":
        return <Camera className="w-4 h-4 text-green-600" />
      case "pill_identification":
        return <Pill className="w-4 h-4 text-blue-600" />
      case "medicine_completed":
        return <CheckCircle2 className="w-4 h-4 text-purple-600" />
      case "dosage_update":
        return <Edit3 className="w-4 h-4 text-orange-600" />
      case "manual_entry":
        return <User className="w-4 h-4 text-gray-600" />
      default:
        return <History className="w-4 h-4 text-gray-600" />
    }
  }

  const getRecordTypeLabel = (type: string) => {
    switch (type) {
      case "prescription_scan":
        return "Prescription Scan"
      case "pill_identification":
        return "Pill Identification"
      case "medicine_completed":
        return "Medicine Completed"
      case "dosage_update":
        return "Dosage Update"
      case "manual_entry":
        return "Manual Entry"
      default:
        return "Unknown"
    }
  }

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case "prescription_scan":
        return "bg-green-100 text-green-800"
      case "pill_identification":
        return "bg-blue-100 text-blue-800"
      case "medicine_completed":
        return "bg-purple-100 text-purple-800"
      case "dosage_update":
        return "bg-orange-100 text-orange-800"
      case "manual_entry":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const RecordCard = ({ record }: { record: MedicineRecord }) => {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedRecord(record)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {getRecordIcon(record.type)}
              <div>
                <h3 className="font-semibold text-sm">{record.description}</h3>
                <p className="text-xs text-gray-500">{formatDate(record.date)}</p>
              </div>
            </div>
            <Badge className={getRecordTypeColor(record.type)}>{getRecordTypeLabel(record.type)}</Badge>
          </div>

          {/* Record-specific content */}
          {record.type === "prescription_scan" && record.extractedMedicines && (
            <div className="space-y-2">
              <p className="text-xs text-gray-600">Extracted {record.extractedMedicines.length} medicines:</p>
              <div className="flex flex-wrap gap-1">
                {record.extractedMedicines.slice(0, 3).map((med, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {med.name}
                  </Badge>
                ))}
                {record.extractedMedicines.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{record.extractedMedicines.length - 3} more
                  </Badge>
                )}
              </div>
              {record.imageRef && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <FileImage className="w-3 h-3" />
                  <span>Prescription image: {record.imageRef}</span>
                </div>
              )}
            </div>
          )}

          {record.type === "pill_identification" && record.identifiedMedicine && (
            <div className="space-y-2">
              <p className="text-xs text-gray-600">Identified medicine:</p>
              <Badge variant="outline" className="text-xs">
                {record.identifiedMedicine.name}
              </Badge>
              <div className="flex items-center gap-2 text-xs">
                <Badge
                  className={
                    record.identifiedMedicine.confidence > 0.9
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {Math.round(record.identifiedMedicine.confidence * 100)}% confidence
                </Badge>
                {record.identifiedMedicine.added && (
                  <Badge className="bg-blue-100 text-blue-800">Added to medicines</Badge>
                )}
              </div>
              {record.imageRef && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <Camera className="w-3 h-3" />
                  <span>Pill image: {record.imageRef}</span>
                </div>
              )}
            </div>
          )}

          {record.type === "medicine_completed" && record.completedMedicine && (
            <div className="space-y-2">
              <p className="text-xs text-gray-600">Completed medicine:</p>
              <Badge variant="outline" className="text-xs">
                {record.completedMedicine.name}
              </Badge>
              <p className="text-xs text-gray-500">Reason: {record.completedMedicine.reason}</p>
            </div>
          )}

          {record.type === "dosage_update" && record.changes && (
            <div className="space-y-2">
              <p className="text-xs text-gray-600">Changes made:</p>
              <div className="space-y-1">
                {record.changes.slice(0, 2).map((change, index) => (
                  <div key={index} className="text-xs">
                    <span className="font-medium">{change.medicine}</span>
                    {change.field && (
                      <span className="text-gray-500">
                        {" "}
                        - {change.field}: {change.oldValue} → {change.newValue}
                      </span>
                    )}
                  </div>
                ))}
                {record.changes.length > 2 && (
                  <p className="text-xs text-gray-500">+{record.changes.length - 2} more changes</p>
                )}
              </div>
            </div>
          )}

          {record.type === "manual_entry" && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Manually added to medicine database</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const RecordDetailModal = ({ record }: { record: MedicineRecord }) => {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getRecordIcon(record.type)}
                <div>
                  <CardTitle className="text-lg">{record.description}</CardTitle>
                  <p className="text-sm text-gray-600">{formatDate(record.date)}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedRecord(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {/* Record Type */}
              <div>
                <h4 className="font-semibold mb-2">Record Type</h4>
                <Badge className={getRecordTypeColor(record.type)}>{getRecordTypeLabel(record.type)}</Badge>
              </div>

              {/* Image Reference */}
              {record.imageRef && (
                <div>
                  <h4 className="font-semibold mb-2">Source Image</h4>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    {record.type === "prescription_scan" ? (
                      <FileImage className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Camera className="w-4 h-4 text-blue-600" />
                    )}
                    <span className="text-sm">{record.imageRef}</span>
                    <Button variant="outline" size="sm" className="ml-auto bg-transparent">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              )}

              {/* Prescription Scan Details */}
              {record.type === "prescription_scan" && record.extractedMedicines && (
                <div>
                  <h4 className="font-semibold mb-2">Extracted Medicines</h4>
                  <div className="space-y-3">
                    {record.extractedMedicines.map((med, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{med.name}</h5>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                med.confidence > 0.9 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {Math.round(med.confidence * 100)}% confidence
                            </Badge>
                            {med.added && <Badge className="bg-blue-100 text-blue-800">Added</Badge>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pill Identification Details */}
              {record.type === "pill_identification" && record.identifiedMedicine && (
                <div>
                  <h4 className="font-semibold mb-2">Identified Medicine</h4>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{record.identifiedMedicine.name}</h5>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            record.identifiedMedicine.confidence > 0.9
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {Math.round(record.identifiedMedicine.confidence * 100)}% confidence
                        </Badge>
                        {record.identifiedMedicine.added && (
                          <Badge className="bg-blue-100 text-blue-800">Added to medicines</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Completed Medicine Details */}
              {record.type === "medicine_completed" && record.completedMedicine && (
                <div>
                  <h4 className="font-semibold mb-2">Completed Medicine</h4>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-1">{record.completedMedicine.name}</h5>
                    <p className="text-sm text-gray-600">Medicine ID: {record.completedMedicine.id}</p>
                    <p className="text-sm text-gray-600">Reason: {record.completedMedicine.reason}</p>
                  </div>
                </div>
              )}

              {/* Changes Details */}
              {record.changes && record.changes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Changes Made</h4>
                  <div className="space-y-2">
                    {record.changes.map((change, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          {change.action === "added" && <Plus className="w-4 h-4 text-green-600" />}
                          {change.action === "updated" && <Edit3 className="w-4 h-4 text-orange-600" />}
                          {change.action === "removed" && <Trash2 className="w-4 h-4 text-red-600" />}
                          {change.action === "completed" && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                          <span className="font-medium capitalize">{change.action}</span>
                          <span className="text-sm text-gray-600">{change.medicine}</span>
                        </div>
                        {change.field && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">{change.field}:</span>
                            <span className="ml-2">
                              {change.oldValue} → {change.newValue}
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{formatDate(change.timestamp)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Record ID */}
              <div>
                <h4 className="font-semibold mb-2">Record Information</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Record ID:</span> {record.id}
                  </p>
                  <p>
                    <span className="font-medium">Created:</span> {formatDate(record.date)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                Medicine Records
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">View your complete medicine history and activity log</p>
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Records</SelectItem>
                  <SelectItem value="prescription_scan">Prescription Scans</SelectItem>
                  <SelectItem value="pill_identification">Pill Identifications</SelectItem>
                  <SelectItem value="medicine_completed">Completed Medicines</SelectItem>
                  <SelectItem value="dosage_update">Dosage Updates</SelectItem>
                  <SelectItem value="manual_entry">Manual Entries</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filter
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <Card className="bg-blue-50">
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-blue-600">{records.length}</div>
                <div className="text-xs text-blue-700">Total Records</div>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-green-600">
                  {records.filter((r) => r.type === "prescription_scan").length}
                </div>
                <div className="text-xs text-green-700">Prescriptions</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50">
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-blue-600">
                  {records.filter((r) => r.type === "pill_identification").length}
                </div>
                <div className="text-xs text-blue-700">Pill IDs</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50">
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-purple-600">
                  {records.filter((r) => r.type === "medicine_completed").length}
                </div>
                <div className="text-xs text-purple-700">Completed</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-50">
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-orange-600">
                  {records.filter((r) => r.type === "dosage_update").length}
                </div>
                <div className="text-xs text-orange-700">Updates</div>
              </CardContent>
            </Card>
          </div>

          {/* Records List */}
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No records found</h3>
              <p className="text-gray-500">
                {searchQuery || filterType !== "all"
                  ? "Try adjusting your search or filter"
                  : "Your medicine activity will appear here"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <RecordCard key={record.id} record={record} />
              ))}
            </div>
          )}

          {/* Record Detail Modal */}
          {selectedRecord && <RecordDetailModal record={selectedRecord} />}
        </CardContent>
      </Card>
    </div>
  )
}
