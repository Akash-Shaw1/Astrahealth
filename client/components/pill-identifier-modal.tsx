"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2, AlertTriangle, FileImage, AlertCircle, Info, Pill } from "lucide-react"
import { medicineDataService, type PillIdentificationResult } from "@/lib/medicine-data-service"
import { useToast } from "@/hooks/use-toast"

interface PillIdentifierModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface AddMedicineForm {
  dosageInstructions: string
  frequency: string
  timing: string
  mealTiming: string
  startDate: string
  endDate: string
  remainingDoses: number
  reminderEnabled: boolean
}

export default function PillIdentifierModal({ isOpen, onClose, onSuccess }: PillIdentifierModalProps) {
  const [step, setStep] = useState<"upload" | "processing" | "results" | "add_medicine">("upload")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [identificationResult, setIdentificationResult] = useState<PillIdentificationResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    uses: false,
    sideEffects: false,
    howToUse: false,
    mechanism: false,
    safety: false,
    interactions: false,
    concerns: false,
  })
  const [addMedicineForm, setAddMedicineForm] = useState<AddMedicineForm>({
    dosageInstructions: "",
    frequency: "once daily",
    timing: "morning",
    mealTiming: "with or without food",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    remainingDoses: 30,
    reminderEnabled: true,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

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

  const identifyPill = async () => {
    if (!uploadedFile) return

    setIsProcessing(true)
    setStep("processing")
    setError(null)

    try {
      console.log("[v0] Starting pill identification")

      if (!previewUrl) {
        throw new Error("No image preview available")
      }

      const base64Data = previewUrl.split(",")[1] // Remove data:image/...;base64, prefix
      const imageType = uploadedFile.type

      console.log("[v0] Making API call to /api/identify-pill")

      const response = await fetch("/api/identify-pill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: base64Data, // Send base64 data instead of full data URL
          imageType: imageType, // Send image type separately
        }),
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        let errorMessage = `API request failed with status ${response.status}`

        const responseClone = response.clone()

        try {
          const errorData = await response.json()
          console.log("[v0] API error response (JSON):", errorData)
          errorMessage = errorData?.details || errorData?.error || errorMessage
        } catch (jsonError) {
          console.log("[v0] Failed to parse JSON error response, trying text")
          try {
            const errorText = await responseClone.text()
            console.log("[v0] API error response (text):", errorText)
            // Extract meaningful error from HTML or text response
            if (errorText.includes("Internal Server Error")) {
              errorMessage = "Internal server error. Please check your OpenAI API key configuration."
            } else if (errorText.includes("timeout")) {
              errorMessage = "Request timeout. Please try again."
            } else if (errorText.length > 0 && errorText.length < 200) {
              errorMessage = errorText
            }
          } catch (textError) {
            console.error("[v0] Failed to get error response text:", textError)
          }
        }

        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log("[v0] Pill identification result:", result)

      setIdentificationResult(result)
      setAddMedicineForm((prev) => ({
        ...prev,
        dosageInstructions: result.howToUse || "",
      }))
      setStep("results")

      toast({
        variant: "success",
        title: "Pill identified successfully",
        description: `Identified ${result.name} with ${Math.round(result.confidence * 100)}% confidence`,
      })
    } catch (err) {
      console.error("[v0] Pill identification error:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to identify pill. Please try again."
      setError(errorMessage)
      setStep("upload")
      toast({
        variant: "destructive",
        title: "Identification failed",
        description: errorMessage,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const confirmAddMedicine = async () => {
    if (!identificationResult) return

    // Check for existing medicine
    const existingMedicine = await medicineDataService.findSimilarMedicine(
      identificationResult.name,
      identificationResult.strength,
    )

    if (existingMedicine) {
      const shouldMerge = confirm(
        `${identificationResult.name} already exists in your medicines. Do you want to update the existing course?`,
      )

      if (shouldMerge) {
        medicineDataService.mergeMedicineWithExisting(existingMedicine.id, {
          dosageInstructions: addMedicineForm.dosageInstructions,
          frequency: addMedicineForm.frequency,
          timing: addMedicineForm.timing,
          mealTiming: addMedicineForm.mealTiming,
          endDate: addMedicineForm.endDate,
          remainingDoses: addMedicineForm.remainingDoses,
          reminderEnabled: addMedicineForm.reminderEnabled,
        })

        toast({
          variant: "success",
          title: "Medicine updated",
          description: `Updated existing ${identificationResult.name} course`,
        })
      }
    } else {
      // Add as new medicine
      medicineDataService.addMedicine({
        name: identificationResult.name,
        genericName: identificationResult.genericName,
        brand: (identificationResult.brandNames && identificationResult.brandNames.length > 0) ? identificationResult.brandNames[0] : "Unknown", // Handle brandNames array
        strength: identificationResult.strength,
        form: identificationResult.form,
        purpose: identificationResult.uses?.[0] || "As prescribed", // Safe array access
        dosageInstructions: addMedicineForm.dosageInstructions,
        frequency: addMedicineForm.frequency,
        timing: addMedicineForm.timing,
        mealTiming: addMedicineForm.mealTiming,
        startDate: addMedicineForm.startDate,
        endDate: addMedicineForm.endDate,
        remainingDoses: addMedicineForm.remainingDoses,
        totalDoses: addMedicineForm.remainingDoses,
        reminderEnabled: addMedicineForm.reminderEnabled,
        reminderTimes: addMedicineForm.timing.includes("morning") ? ["08:00"] : ["20:00"],
        precautions: [
          identificationResult.safetyAdvice?.pregnancy,
          identificationResult.safetyAdvice?.kidneyLiver,
          identificationResult.safetyAdvice?.alcohol,
        ].filter(Boolean), // Safe object access with filter
        sideEffects: identificationResult.sideEffectsText ? [identificationResult.sideEffectsText] : ["Consult healthcare provider"], // Use text field
        contraindications: identificationResult.interactions?.drugs || [],
        missedDoseInstructions: identificationResult.missedDoseGuidance,
        practicalTips: identificationResult.quickTips || [], // Safe array access
        addedBy: "pill_identifier",
        pillImageRef: uploadedFile?.name,
        isActive: true,
      })

      toast({
        variant: "success",
        title: "Medicine added",
        description: `Added ${identificationResult.name} to your medicines`,
      })
    }

    // Log the identification in records
    medicineDataService.addRecord({
      type: "pill_identification",
      description: `Identified ${identificationResult.name} from pill image`,
      imageRef: uploadedFile?.name,
      identifiedMedicine: {
        name: identificationResult.name,
        confidence: identificationResult.confidence,
        added: true,
      },
    })

    onSuccess()
    handleClose()
  }

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

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleAddToMedicines = () => {
    if (!identificationResult) return
    setStep("add_medicine")
  }

  const handleClose = () => {
    setStep("upload")
    setUploadedFile(null)
    setPreviewUrl(null)
    setIdentificationResult(null)
    setError(null)
    setIsProcessing(false)
    setExpandedSections({
      overview: true,
      uses: false,
      sideEffects: false,
      howToUse: false,
      mechanism: false,
      safety: false,
      interactions: false,
      concerns: false,
    })
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
                <Pill className="w-5 h-5 text-blue-600" />
                Pill Identifier
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Upload a photo of your pill to get comprehensive medicine information
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
                      alt="Pill preview"
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
                      <p className="text-lg font-medium text-gray-900 mb-2">Drop your pill image here</p>
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

              {/* Tips for better identification */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 mb-1">Tips for better identification</p>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Take a clear photo with good lighting</li>
                      <li>• Include any text, numbers, or markings on the pill</li>
                      <li>• Show both sides if possible</li>
                      <li>• Avoid blurry or dark images</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Medical Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800 mb-1">Medical Disclaimer</p>
                    <p className="text-amber-700">
                      This AI identification is for informational purposes only. Always consult your healthcare provider
                      or pharmacist for accurate medicine identification and medical advice.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={identifyPill}
                  disabled={!uploadedFile}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Pill className="w-4 h-4 mr-2" />
                  Identify Pill
                </Button>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Identifying Pill</h3>
              <p className="text-gray-600 mb-4">
                Our AI is analyzing your pill image and gathering comprehensive medicine information...
              </p>
              <div className="max-w-md mx-auto bg-gray-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "75%" }} />
              </div>
            </div>
          )}

          {step === "results" && identificationResult && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Medicine Information</h3>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      identificationResult.confidence > 0.9
                        ? "bg-green-100 text-green-800"
                        : identificationResult.confidence > 0.7
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {Math.round(identificationResult.confidence * 100)}% confidence
                  </span>
                </div>
              </div>

              {/* Medicine Header */}
              <Card className="border-2 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Identified pill"
                      className="w-20 h-20 rounded-lg object-cover border"
                    />
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900">{identificationResult.name}</h4>
                      <p className="text-gray-600">Generic: {identificationResult.genericName}</p>
                      <p className="text-gray-600">
                        Brand:{" "}
                        {identificationResult.brandNames && identificationResult.brandNames.length > 0
                          ? identificationResult.brandNames.join(", ")
                          : "Unknown"}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">{identificationResult.strength}</span>
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">{identificationResult.form}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Expandable Sections */}
              <div className="space-y-3">
                {/* Overview */}
                <Card>
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleSection("overview")}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className="font-medium">Overview</span>
                      <span
                        className={`transform transition-transform ${expandedSections.overview ? "rotate-180" : ""}`}
                      >
                        ▼
                      </span>
                    </button>
                    {expandedSections.overview && (
                      <div className="px-4 pb-4 border-t">
                        <p className="text-gray-700">{identificationResult.overview}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Uses & Benefits */}
                <Card>
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleSection("uses")}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className="font-medium">Uses & Benefits</span>
                      <span className={`transform transition-transform ${expandedSections.uses ? "rotate-180" : ""}`}>
                        ▼
                      </span>
                    </button>
                    {expandedSections.uses && (
                      <div className="px-4 pb-4 border-t space-y-3">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Primary Uses:</h5>
                          {identificationResult.usesText ? (
                            <p className="text-gray-700">{identificationResult.usesText}</p>
                          ) : (
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {(identificationResult.uses || []).map((use, index) => (
                                <li key={index}>{use}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Benefits:</h5>
                          {identificationResult.benefitsText ? (
                            <p className="text-gray-700">{identificationResult.benefitsText}</p>
                          ) : (
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {(identificationResult.benefits || []).map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Side Effects */}
                <Card>
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleSection("sideEffects")}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className="font-medium">Side Effects</span>
                      <span
                        className={`transform transition-transform ${expandedSections.sideEffects ? "rotate-180" : ""}`}
                      >
                        ▼
                      </span>
                    </button>
                    {expandedSections.sideEffects && (
                      <div className="px-4 pb-4 border-t">
                        {identificationResult.sideEffectsText ? (
                          <p className="text-gray-700">{identificationResult.sideEffectsText}</p>
                        ) : (
                          <div className="space-y-3">
                            {identificationResult.sideEffects?.common &&
                              identificationResult.sideEffects.common.length > 0 && (
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-1">Common:</h5>
                                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {identificationResult.sideEffects.common.map((effect: string, index: number) => (
                                      <li key={index}>{effect}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            {identificationResult.sideEffects?.serious &&
                              identificationResult.sideEffects.serious.length > 0 && (
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-1">Serious:</h5>
                                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {identificationResult.sideEffects.serious.map((effect: string, index: number) => (
                                      <li key={index}>{effect}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            {identificationResult.sideEffects?.rare &&
                              identificationResult.sideEffects.rare.length > 0 && (
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-1">Rare:</h5>
                                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {identificationResult.sideEffects.rare.map((effect: string, index: number) => (
                                      <li key={index}>{effect}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* How to Use */}
                <Card>
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleSection("howToUse")}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className="font-medium">How to Use</span>
                      <span
                        className={`transform transition-transform ${expandedSections.howToUse ? "rotate-180" : ""}`}
                      >
                        ▼
                      </span>
                    </button>
                    {expandedSections.howToUse && (
                      <div className="px-4 pb-4 border-t">
                        <p className="text-gray-700">{identificationResult.howToUse}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* How it Works */}
                <Card>
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleSection("mechanism")}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className="font-medium">How it Works</span>
                      <span
                        className={`transform transition-transform ${expandedSections.mechanism ? "rotate-180" : ""}`}
                      >
                        ▼
                      </span>
                    </button>
                    {expandedSections.mechanism && (
                      <div className="px-4 pb-4 border-t">
                        <p className="text-gray-700">{identificationResult.mechanism}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Safety Advice */}
                <Card>
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleSection("safety")}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className="font-medium">Safety Advice</span>
                      <span className={`transform transition-transform ${expandedSections.safety ? "rotate-180" : ""}`}>
                        ▼
                      </span>
                    </button>
                    {expandedSections.safety && (
                      <div className="px-4 pb-4 border-t space-y-3">
                        {identificationResult.safetyAdviceText ? (
                          <p className="text-gray-700">{identificationResult.safetyAdviceText}</p>
                        ) : (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-1">Pregnancy:</h5>
                              <p className="text-sm text-gray-700">
                                {identificationResult.safetyAdvice?.pregnancy || "Unknown"}
                              </p>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-1">Driving:</h5>
                              <p className="text-sm text-gray-700">
                                {identificationResult.safetyAdvice?.driving || "Unknown"}
                              </p>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-1">Kidney/Liver:</h5>
                              <p className="text-sm text-gray-700">
                                {identificationResult.safetyAdvice?.kidneyLiver || "Unknown"}
                              </p>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-1">Alcohol:</h5>
                              <p className="text-sm text-gray-700">
                                {identificationResult.safetyAdvice?.alcohol || "Unknown"}
                              </p>
                            </div>
                          </div>
                        )}
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Missed Dose:</h5>
                          <p className="text-sm text-gray-700">
                            {identificationResult.missedDoseGuidance || "Consult healthcare provider"}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Interactions */}
                <Card>
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleSection("interactions")}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className="font-medium">Interactions</span>
                      <span
                        className={`transform transition-transform ${expandedSections.interactions ? "rotate-180" : ""}`}
                      >
                        ▼
                      </span>
                    </button>
                    {expandedSections.interactions && (
                      <div className="px-4 pb-4 border-t space-y-3">
                        {identificationResult.interactionsText ? (
                          <p className="text-gray-700">{identificationResult.interactionsText}</p>
                        ) : (
                          <>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Drug Interactions:</h5>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {(identificationResult.interactions?.drugs || []).map((drug, index) => (
                                  <li key={index}>{drug}</li>
                                ))}
                                {(!identificationResult.interactions?.drugs ||
                                  identificationResult.interactions.drugs.length === 0) && (
                                  <li className="text-gray-500 italic">No specific drug interactions identified</li>
                                )}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-1">Alcohol:</h5>
                              <p className="text-sm text-gray-700">
                                {identificationResult.interactions?.alcohol || "No specific alcohol interactions known"}
                              </p>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Food Interactions:</h5>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {(identificationResult.interactions?.foods || []).map((food, index) => (
                                  <li key={index}>{food}</li>
                                ))}
                                {(!identificationResult.interactions?.foods ||
                                  identificationResult.interactions.foods.length === 0) && (
                                  <li className="text-gray-500 italic">No specific food interactions identified</li>
                                )}
                              </ul>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Common Concerns */}
                <Card>
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleSection("concerns")}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className="font-medium">Common Patient Concerns</span>
                      <span
                        className={`transform transition-transform ${expandedSections.concerns ? "rotate-180" : ""}`}
                      >
                        ▼
                      </span>
                    </button>
                    {expandedSections.concerns && (
                      <div className="px-4 pb-4 border-t space-y-3">
                        {(identificationResult.commonConcerns || []).map((concern, index) => (
                          <div key={index} className="border-l-4 border-blue-200 pl-4">
                            <h5 className="font-medium text-gray-900 mb-1">Q: {concern.question}</h5>
                            <p className="text-sm text-gray-700">A: {concern.answer}</p>
                          </div>
                        ))}
                        {(!identificationResult.commonConcerns || identificationResult.commonConcerns.length === 0) && (
                          <p className="text-gray-500 italic">No common concerns available</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setStep("upload")}>
                  Identify Another Pill
                </Button>
                <Button onClick={handleAddToMedicines} className="bg-green-600 hover:bg-green-700 text-white">
                  Add to My Medicines
                </Button>
              </div>
            </div>
          )}

          {step === "add_medicine" && identificationResult && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Medicine"
                  className="w-12 h-12 rounded-lg object-cover border"
                />
                <div>
                  <h3 className="text-lg font-semibold">Add {identificationResult.name}</h3>
                  <p className="text-sm text-gray-600">Configure your medicine schedule</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Instructions</label>
                  <textarea
                    value={addMedicineForm.dosageInstructions}
                    onChange={(e) => setAddMedicineForm((prev) => ({ ...prev, dosageInstructions: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="e.g., Take 1 tablet daily"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select
                    value={addMedicineForm.frequency}
                    onChange={(e) => setAddMedicineForm((prev) => ({ ...prev, frequency: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="once daily">Once daily</option>
                    <option value="twice daily">Twice daily</option>
                    <option value="three times daily">Three times daily</option>
                    <option value="four times daily">Four times daily</option>
                    <option value="as needed">As needed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timing</label>
                  <select
                    value={addMedicineForm.timing}
                    onChange={(e) => setAddMedicineForm((prev) => ({ ...prev, timing: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="morning">Morning</option>
                    <option value="evening">Evening</option>
                    <option value="morning and evening">Morning and Evening</option>
                    <option value="with meals">With Meals</option>
                    <option value="bedtime">Bedtime</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Timing</label>
                  <select
                    value={addMedicineForm.mealTiming}
                    onChange={(e) => setAddMedicineForm((prev) => ({ ...prev, mealTiming: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="with or without food">With or without food</option>
                    <option value="with food">With food</option>
                    <option value="before food">Before food</option>
                    <option value="after food">After food</option>
                    <option value="on empty stomach">On empty stomach</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={addMedicineForm.startDate}
                    onChange={(e) => setAddMedicineForm((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={addMedicineForm.endDate}
                    onChange={(e) => setAddMedicineForm((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remaining Doses</label>
                  <input
                    type="number"
                    value={addMedicineForm.remainingDoses}
                    onChange={(e) =>
                      setAddMedicineForm((prev) => ({ ...prev, remainingDoses: Number.parseInt(e.target.value) || 0 }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="1"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="reminder"
                    checked={addMedicineForm.reminderEnabled}
                    onChange={(e) => setAddMedicineForm((prev) => ({ ...prev, reminderEnabled: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="reminder" className="text-sm font-medium text-gray-700">
                    Enable reminders
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setStep("results")}>
                  Back to Results
                </Button>
                <Button onClick={confirmAddMedicine} className="bg-green-600 hover:bg-green-700 text-white">
                  Add Medicine
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
