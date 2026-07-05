import medicinesData from "./data/medicines.json"
import { apiAdapter } from "./api-adapter"

export interface Medicine {
  id: string
  name: string
  genericName: string
  brand: string
  strength: string
  form: string
  purpose: string
  dosageInstructions: string
  frequency: string
  timing: string
  mealTiming: string
  startDate: string
  endDate: string
  remainingDoses: number
  totalDoses: number
  reminderEnabled: boolean
  reminderTimes: string[]
  precautions: string[]
  sideEffects: string[]
  contraindications: string[]
  missedDoseInstructions: string
  practicalTips: string[]
  addedDate: string
  addedBy: "prescription_scan" | "pill_identifier" | "manual_entry"
  prescriptionImageRef?: string
  pillImageRef?: string
  isActive: boolean
}

export interface MedicineRecord {
  id: string
  type: "prescription_scan" | "pill_identification" | "medicine_completed" | "dosage_update" | "manual_entry"
  date: string
  description: string
  imageRef?: string
  extractedMedicines?: Array<{
    name: string
    confidence: number
    added: boolean
  }>
  identifiedMedicine?: {
    name: string
    confidence: number
    added: boolean
  }
  completedMedicine?: {
    id: string
    name: string
    reason: string
  }
  changes?: Array<{
    action: "added" | "updated" | "removed" | "completed"
    medicine: string
    field?: string
    oldValue?: string
    newValue?: string
    timestamp: string
  }>
}

export interface PrescriptionScanResult {
  medicines: Array<{
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
  }>
  confidence: number
  ambiguities: string[]
}

export interface PillIdentificationResult {
  identified?: boolean
  name: string
  genericName: string
  brand: string
  brandNames?: string[]
  strength: string
  form: string
  overview: string
  uses: string[]
  usesText?: string
  benefits: string[]
  benefitsText?: string
  sideEffects: {
    common: string[]
    serious: string[]
    rare: string[]
  }
  sideEffectsText?: string
  howToUse: string
  mechanism: string
  safetyAdvice: {
    pregnancy: string
    driving: string
    kidneyLiver: string
    alcohol: string
  }
  safetyAdviceText?: string
  missedDoseGuidance: string
  substitutes: string[]
  quickTips: string[]
  factBox: {
    strengths: string[]
    forms: string[]
    brandGeneric: string
  }
  interactions: {
    drugs: string[]
    alcohol: string
    foods: string[]
  }
  interactionsText?: string
  commonConcerns: Array<{
    question: string
    answer: string
  }>
  confidence: number
  disclaimer?: string
}

function isLive(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("astra_data_mode") === "live"
}

class MedicineDataService {
  private data = medicinesData as unknown as {
    currentMedicines: Medicine[]
    pastRecords: MedicineRecord[]
  }

  // Current Medicines CRUD
  async getCurrentMedicines(): Promise<Medicine[]> {
    if (isLive()) {
      const list = await apiAdapter.getMedicines()
      return list as any[]
    }
    return this.data.currentMedicines.filter((med) => med.isActive)
  }

  async getMedicineById(id: string): Promise<Medicine | null> {
    if (isLive()) {
      return apiAdapter.getMedicineById(id)
    }
    return this.data.currentMedicines.find((med) => med.id === id) || null
  }

  async addMedicine(medicine: Omit<Medicine, "id" | "addedDate">): Promise<Medicine> {
    if (isLive()) {
      return apiAdapter.addMedicine(medicine)
    }

    const newMedicine: Medicine = {
      ...medicine,
      id: `med_${Date.now()}`,
      addedDate: new Date().toISOString(),
    }

    this.data.currentMedicines.push(newMedicine)
    this.saveData()

    // Log the addition
    this.addRecord({
      type: "manual_entry",
      description: `Added ${medicine.name} manually`,
      changes: [
        {
          action: "added",
          medicine: medicine.name,
          timestamp: new Date().toISOString(),
        },
      ],
    })

    return newMedicine
  }

  async updateMedicine(id: string, updates: Partial<Medicine>): Promise<Medicine | null> {
    if (isLive()) {
      return apiAdapter.updateMedicine(id, updates)
    }

    const medicineIndex = this.data.currentMedicines.findIndex((med) => med.id === id)
    if (medicineIndex === -1) return null

    const oldMedicine = { ...this.data.currentMedicines[medicineIndex] }
    const updatedMedicine = { ...oldMedicine, ...updates }
    this.data.currentMedicines[medicineIndex] = updatedMedicine
    this.saveData()

    // Log the update
    const changes = Object.keys(updates).map((key) => ({
      action: "updated" as const,
      medicine: oldMedicine.name,
      field: key,
      oldValue: String(oldMedicine[key as keyof Medicine]),
      newValue: String(updates[key as keyof Medicine]),
      timestamp: new Date().toISOString(),
    }))

    this.addRecord({
      type: "dosage_update",
      description: `Updated ${oldMedicine.name}`,
      changes,
    })

    return updatedMedicine
  }

  async deleteMedicine(id: string): Promise<boolean> {
    if (isLive()) {
      return apiAdapter.deleteMedicine(id)
    }

    const medicineIndex = this.data.currentMedicines.findIndex((med) => med.id === id)
    if (medicineIndex === -1) return false

    const medicine = this.data.currentMedicines[medicineIndex]
    this.data.currentMedicines.splice(medicineIndex, 1)
    this.saveData()

    // Log the deletion
    this.addRecord({
      type: "medicine_completed",
      description: `Removed ${medicine.name}`,
      completedMedicine: {
        id: medicine.id,
        name: medicine.name,
        reason: "Manually deleted",
      },
    })

    return true
  }

  async completeMedicine(id: string, reason = "Course completed"): Promise<boolean> {
    if (isLive()) {
      await apiAdapter.completeMedicine(id)
      return true
    }

    const medicine = await this.getMedicineById(id)
    if (!medicine) return false

    medicine.isActive = false
    medicine.remainingDoses = 0
    this.saveData()

    // Log the completion
    this.addRecord({
      type: "medicine_completed",
      description: `Completed ${medicine.name}`,
      completedMedicine: {
        id: medicine.id,
        name: medicine.name,
        reason,
      },
    })

    return true
  }

  async decrementDose(id: string, amount = 1): Promise<boolean> {
    if (isLive()) {
      await apiAdapter.decrementDose(id, amount)
      return true
    }

    const medicine = await this.getMedicineById(id)
    if (!medicine || medicine.remainingDoses <= 0) return false

    medicine.remainingDoses = Math.max(0, medicine.remainingDoses - amount)
    this.saveData()

    // Auto-complete if no doses remaining
    if (medicine.remainingDoses === 0) {
      await this.completeMedicine(id, "All doses taken")
    }

    return true
  }

  async refillMedicine(id: string, additionalDoses: number): Promise<boolean> {
    if (isLive()) {
      await apiAdapter.refillMedicine(id, additionalDoses)
      return true
    }

    const medicine = await this.getMedicineById(id)
    if (!medicine) return false

    const oldDoses = medicine.remainingDoses
    medicine.remainingDoses += additionalDoses
    medicine.totalDoses += additionalDoses
    this.saveData()

    // Log the refill
    this.addRecord({
      type: "dosage_update",
      description: `Refilled ${medicine.name}`,
      changes: [
        {
          action: "updated",
          medicine: medicine.name,
          field: "remainingDoses",
          oldValue: String(oldDoses),
          newValue: String(medicine.remainingDoses),
          timestamp: new Date().toISOString(),
        },
      ],
    })

    return true
  }

  // Check for existing medicine (for deduplication)
  async findSimilarMedicine(name: string, strength?: string): Promise<Medicine | null> {
    const list = await this.getCurrentMedicines()
    const normalizedName = name.toLowerCase().trim()
    return (
      list.find(
        (med) =>
          med.isActive &&
          (med.name.toLowerCase().includes(normalizedName) ||
            med.genericName.toLowerCase().includes(normalizedName) ||
            normalizedName.includes(med.name.toLowerCase()) ||
            normalizedName.includes(med.genericName.toLowerCase())) &&
          (!strength || med.strength === strength),
      ) || null
    )
  }

  // Records CRUD
  async getRecords(): Promise<MedicineRecord[]> {
    if (isLive()) {
      // In live mode, we map prescription files and activities to records logs
      const list = await apiAdapter.getMedicalRecords()
      return list.map((record) => ({
        id: record.id,
        type: record.recordType === 'Prescription' ? 'prescription_scan' : 'manual_entry',
        date: record.date,
        description: record.description || record.title,
      }))
    }
    return [...this.data.pastRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  async addRecord(record: Omit<MedicineRecord, "id" | "date">): Promise<MedicineRecord> {
    const newRecord: MedicineRecord = {
      ...record,
      id: `record_${Date.now()}`,
      date: new Date().toISOString(),
    }

    this.data.pastRecords.push(newRecord)
    this.saveData()
    return newRecord
  }

  async searchRecords(query: string): Promise<MedicineRecord[]> {
    const list = await this.getRecords()
    const normalizedQuery = query.toLowerCase()
    return list.filter(
      (record) =>
        record.description.toLowerCase().includes(normalizedQuery) ||
        record.type.toLowerCase().includes(normalizedQuery) ||
        record.extractedMedicines?.some((med) => med.name.toLowerCase().includes(normalizedQuery)) ||
        record.identifiedMedicine?.name.toLowerCase().includes(normalizedQuery),
    )
  }

  // Prescription scanning integration
  async processPrescriptionScan(imageFile: File): Promise<PrescriptionScanResult> {
    // This will be implemented with OpenAI Vision API (frontend router handles it)
    return {
      medicines: [],
      confidence: 0,
      ambiguities: [],
    }
  }

  // Pill identification integration
  async processPillIdentification(imageFile: File): Promise<PillIdentificationResult> {
    // This will be implemented with OpenAI Vision API (frontend router handles it)
    return {
      name: "",
      genericName: "",
      brand: "",
      strength: "",
      form: "",
      overview: "",
      uses: [],
      benefits: [],
      sideEffects: { common: [], serious: [], rare: [] },
      howToUse: "",
      mechanism: "",
      safetyAdvice: {
        pregnancy: "",
        driving: "",
        kidneyLiver: "",
        alcohol: "",
      },
      missedDoseGuidance: "",
      substitutes: [],
      quickTips: [],
      factBox: {
        strengths: [],
        forms: [],
        brandGeneric: "",
      },
      interactions: {
        drugs: [],
        alcohol: "",
        foods: [],
      },
      commonConcerns: [],
      confidence: 0,
    }
  }

  // Merge medicine with existing (for deduplication)
  async mergeMedicineWithExisting(existingId: string, newMedicine: Partial<Medicine>): Promise<Medicine | null> {
    const existing = await this.getMedicineById(existingId)
    if (!existing) return null

    // Merge logic: extend end date, update dosage if different, add remaining doses
    const updates: Partial<Medicine> = {}

    if (newMedicine.endDate && new Date(newMedicine.endDate) > new Date(existing.endDate)) {
      updates.endDate = newMedicine.endDate
    }

    if (newMedicine.dosageInstructions && newMedicine.dosageInstructions !== existing.dosageInstructions) {
      updates.dosageInstructions = newMedicine.dosageInstructions
    }

    if (newMedicine.remainingDoses) {
      updates.remainingDoses = existing.remainingDoses + newMedicine.remainingDoses
      updates.totalDoses = existing.totalDoses + newMedicine.remainingDoses
    }

    return this.updateMedicine(existingId, updates)
  }

  private saveData(): void {
    console.log("[v0] Medicine data updated:", this.data)
  }
}

export const medicineDataService = new MedicineDataService()
