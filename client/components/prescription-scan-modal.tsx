"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X, Loader2, AlertTriangle, Edit3, Plus, FileImage, Camera, AlertCircle } from "lucide-react"
import { medicineDataService, type Medicine } from "@/lib/medicine-data-service"
import { useToast } from "@/hooks/use-toast"

interface ExtractedMedicine {
  name: string
  genericName: string
  strength: string
  dosageInstructions: string
  frequency: string
  timing: string
  mealTiming: string
  purpose: string
  sideEffects: string[]
  precautions: string[]
  contraindications: string[]
  missedDoseInstructions: string
  practicalTips: string[]
  confidence: number
  selected: boolean
  editing: boolean
  existingMedicine?: Medicine | null
}

interface PrescriptionScanModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function PrescriptionScanModal({ isOpen, onClose, onSuccess }: PrescriptionScanModalProps) {
  const [step, setStep] = useState<"upload" | "processing" | "review">("upload")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [extractedMedicines, setExtractedMedicines] = useState<ExtractedMedicine[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }, [])

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, WebP)",
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
      })
      return
    }

    setUploadedFile(file)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const processPrescription = async () => {
    if (!uploadedFile) return

    setIsProcessing(true)
    setStep("processing")
    setError(null)

    try {
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string
          // Strip the data URL prefix to get raw base64
          const base64Data = result.split(",")[1]
          resolve(base64Data)
        }
        reader.onerror = reject
        reader.readAsDataURL(uploadedFile)
      })

      const base64Data = await base64Promise

      const response = await fetch("/api/scan-prescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: base64Data,
          imageType: uploadedFile.type,
        }),
      })

      if (!response.ok) {
        let errorMessage = `API request failed with status ${response.status}`

        try {
          const errorData = await response.json()
          errorMessage = errorData?.error || errorData?.details || errorMessage
        } catch (jsonError) {
          const errorText = await response.text()

          if (errorText.includes("dangerouslyAllowBrowser")) {
            errorMessage = "Configuration error: OpenAI client misconfigured. Please contact support."
          } else if (errorText.includes("Internal Server Error")) {
            errorMessage = "Server error. Please check your OpenAI API key configuration."
          }
        }

        throw new Error(errorMessage)
      }

      const result = await response.json()

      if (!result.medicines || !Array.isArray(result.medicines)) {
        console.error("Invalid response structure:", result)
        throw new Error("Invalid response format from AI")
      }

      // Transform the result into our format
      const medicines: ExtractedMedicine[] = result.medicines.map((med: any) => ({
        ...med,
        selected: true,
        editing: false,
        existingMedicine: medicineDataService.findSimilarMedicine(med.name, med.strength),
      }))

      setExtractedMedicines(medicines)
      setStep("review")

      toast({
        variant: "success",
        title: "Prescription processed successfully",
        description: `Found ${medicines.length} medicine${medicines.length !== 1 ? "s" : ""} in your prescription`,
      })
    } catch (err) {
      console.error("Prescription processing error:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to process prescription. Please try again."
      setError(errorMessage)
      setStep("upload")
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: errorMessage,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const updateMedicine = (index: number, updates: Partial<ExtractedMedicine>) => {
    setExtractedMedicines((prev) => prev.map((med, i) => (i === index ? { ...med, ...updates } : med)))
  }

  const addToMedicines = async () => {
    const selectedMedicines = extractedMedicines.filter((med) => med.selected)

    if (selectedMedicines.length === 0) {
      toast({
        variant: "destructive",
        title: "No medicines selected",
        description: "Please select at least one medicine to add",
      })
      return
    }

    let addedCount = 0
    let updatedCount = 0

    for (const med of selectedMedicines) {
      if (med.existingMedicine) {
        // Merge with existing medicine
        const shouldMerge = confirm(
          `${med.name} already exists in your medicines. Do you want to update the existing course?`,
        )

        if (shouldMerge) {
          medicineDataService.mergeMedicineWithExisting(med.existingMedicine.id, {
            dosageInstructions: med.dosageInstructions,
            frequency: med.frequency,
            timing: med.timing,
            mealTiming: med.mealTiming,
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 1 year from now
            remainingDoses: 90, // Default refill amount
          })
          updatedCount++
        }
      } else {
        // Add as new medicine
        medicineDataService.addMedicine({
          name: med.name,
          genericName: med.genericName,
          brand: med.genericName, // Use generic as brand if not specified
          strength: med.strength,
          form: "tablet", // Default form
          purpose: med.purpose,
          dosageInstructions: med.dosageInstructions,
          frequency: med.frequency,
          timing: med.timing,
          mealTiming: med.mealTiming,
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          remainingDoses: 90,
          totalDoses: 90,
          reminderEnabled: true,
          reminderTimes: med.timing.includes("morning") ? ["08:00"] : ["20:00"],
          precautions: med.precautions,
          sideEffects: med.sideEffects,
          contraindications: med.contraindications,
          missedDoseInstructions: med.missedDoseInstructions,
          practicalTips: med.practicalTips,
          addedBy: "prescription_scan",
          prescriptionImageRef: uploadedFile?.name,
          isActive: true,
        })
        addedCount++
      }
    }

    // Log the scan in records
    medicineDataService.addRecord({
      type: "prescription_scan",
      description: `Scanned prescription - ${selectedMedicines.length} medicines processed`,
      imageRef: uploadedFile?.name,
      extractedMedicines: selectedMedicines.map((med) => ({
        name: med.name,
        confidence: med.confidence,
        added: true,
      })),
    })

    toast({
      variant: "success",
      title: "Medicines added successfully",
      description: `Added ${addedCount} new medicine${addedCount !== 1 ? "s" : ""} and updated ${updatedCount} existing medicine${updatedCount !== 1 ? "s" : ""}`,
    })

    onSuccess()
    handleClose()
  }

  const handleClose = () => {
    setStep("upload")
    setUploadedFile(null)
    setPreviewUrl(null)
    setExtractedMedicines([])
    setError(null)
    setIsProcessing(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                Scan Prescription
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Upload your prescription image to automatically extract medicine information
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {step === "upload" && (
            <div className="space-y-6">
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Prescription preview"
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <div className="flex items-center justify-center gap-2">
                      <FileImage className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">{uploadedFile?.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setUploadedFile(null)
                        setPreviewUrl(null)
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-2">Drop your prescription image here</p>
                      <p className="text-sm text-gray-600 mb-4">or click to browse files</p>
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        Choose File
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Supports JPG, PNG, WebP up to 10MB</p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file)
                }}
              />

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              {/* Medical Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800 mb-1">Medical Disclaimer</p>
                    <p className="text-amber-700">
                      This AI analysis is for informational purposes only. Always consult your healthcare provider
                      before making changes to your medication regimen. Verify all extracted information against your
                      original prescription.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={processPrescription}
                  disabled={!uploadedFile}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Scan Prescription
                </Button>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Processing Prescription</h3>
              <p className="text-gray-600 mb-4">
                Our AI is analyzing your prescription image and extracting medicine information...
              </p>
              <div className="max-w-md mx-auto bg-gray-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }} />
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Review Extracted Medicines</h3>
                <Badge className="bg-green-100 text-green-800">
                  {extractedMedicines.filter((med) => med.selected).length} selected
                </Badge>
              </div>

              <div className="space-y-4">
                {extractedMedicines.map((medicine, index) => (
                  <Card key={index} className="border-2 border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={medicine.selected}
                          onCheckedChange={(checked) => updateMedicine(index, { selected: !!checked })}
                          className="mt-1"
                        />

                        <div className="flex-1 space-y-4">
                          {/* Medicine Header */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-lg">{medicine.name}</h4>
                              <p className="text-sm text-gray-600">Generic: {medicine.genericName}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={
                                  medicine.confidence > 0.9
                                    ? "bg-green-100 text-green-800"
                                    : medicine.confidence > 0.7
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }
                              >
                                {Math.round(medicine.confidence * 100)}% confidence
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateMedicine(index, { editing: !medicine.editing })}
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Existing Medicine Warning */}
                          {medicine.existingMedicine && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">
                                  Similar medicine found in your current medicines
                                </span>
                              </div>
                              <p className="text-sm text-blue-700 mt-1">
                                Adding this will update your existing {medicine.existingMedicine.name} course
                              </p>
                            </div>
                          )}

                          {/* Medicine Details */}
                          {medicine.editing ? (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`name-${index}`}>Medicine Name</Label>
                                <Input
                                  id={`name-${index}`}
                                  value={medicine.name}
                                  onChange={(e) => updateMedicine(index, { name: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`strength-${index}`}>Strength</Label>
                                <Input
                                  id={`strength-${index}`}
                                  value={medicine.strength}
                                  onChange={(e) => updateMedicine(index, { strength: e.target.value })}
                                />
                              </div>
                              <div className="col-span-2">
                                <Label htmlFor={`dosage-${index}`}>Dosage Instructions</Label>
                                <Textarea
                                  id={`dosage-${index}`}
                                  value={medicine.dosageInstructions}
                                  onChange={(e) => updateMedicine(index, { dosageInstructions: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`frequency-${index}`}>Frequency</Label>
                                <Select
                                  value={medicine.frequency}
                                  onValueChange={(value) => updateMedicine(index, { frequency: value })}
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
                                <Label htmlFor={`timing-${index}`}>Timing</Label>
                                <Input
                                  id={`timing-${index}`}
                                  value={medicine.timing}
                                  onChange={(e) => updateMedicine(index, { timing: e.target.value })}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Strength:</span>
                                <span className="ml-2">{medicine.strength}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Frequency:</span>
                                <span className="ml-2">{medicine.frequency}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="font-medium text-gray-700">Instructions:</span>
                                <span className="ml-2">{medicine.dosageInstructions}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Timing:</span>
                                <span className="ml-2">{medicine.timing}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">With meals:</span>
                                <span className="ml-2">{medicine.mealTiming}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setStep("upload")}>
                  Back to Upload
                </Button>
                <Button
                  onClick={addToMedicines}
                  disabled={extractedMedicines.filter((med) => med.selected).length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to My Medicines ({extractedMedicines.filter((med) => med.selected).length})
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
