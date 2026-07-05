import doctorsData from "./data/doctors.json"
import consultationsData from "./data/consultations.json"
import medicalRecordsData from "./data/medical-records.json"
import { apiAdapter } from "./api-adapter"

export interface Doctor {
  id: string
  name: string
  specialty: string
  avatar: string
  rating: number
  experience: number
  education: string
  languages: string[]
  availability: {
    [key: string]: string[]
  }
  consultationFee: number
  bio: string
}

export interface Consultation {
  id: string
  doctorId: string
  patientName: string
  date: string
  time: string
  duration: number
  type: string
  status: "upcoming" | "completed" | "cancelled" | "missed"
  severity: "low" | "medium" | "high"
  reason: string
  notes: string
  patientNotes: string
  prescription: string | null
  attachments: string[]
  rating?: number
  createdAt: string
  updatedAt: string
}

export interface MedicalRecord {
  id: string
  consultationId: string
  doctorId: string
  patientName: string
  date: string
  type: string
  title: string
  summary: string
  details: any
  prescription?: {
    medications: Array<{
      name: string;
      dosage: string;
      duration: string;
      instructions: string;
    }>;
  }
  attachments: string[]
  followUp?: string
  createdAt: string
}

// In-memory storage (simulating persistent storage)
const doctors: Doctor[] = doctorsData as Doctor[]
const consultations: Consultation[] = consultationsData as unknown as Consultation[]
const medicalRecords: MedicalRecord[] = medicalRecordsData as MedicalRecord[]

// Helper to determine if we are in Live Database Server mode
function isLive(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("astra_data_mode") === "live"
}

// Doctor operations
export const getDoctors = async (): Promise<Doctor[]> => {
  if (isLive()) {
    return apiAdapter.getDoctors()
  }
  return doctors
}

export const getDoctorById = async (id: string): Promise<Doctor | undefined> => {
  if (isLive()) {
    return apiAdapter.getDoctorById(id)
  }
  return doctors.find((doctor) => doctor.id === id)
}

export const getDoctorsBySpecialty = async (specialty: string): Promise<Doctor[]> => {
  if (isLive()) {
    return apiAdapter.getDoctors(specialty)
  }
  return doctors.filter((doctor) => doctor.specialty.toLowerCase().includes(specialty.toLowerCase()))
}

// Consultation operations
export const getConsultations = async (): Promise<Consultation[]> => {
  if (isLive()) {
    const list = await apiAdapter.getConsultations()
    return list as any[]
  }
  return [...consultations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const getConsultationById = async (id: string): Promise<Consultation | undefined> => {
  if (isLive()) {
    return apiAdapter.getConsultationById(id)
  }
  return consultations.find((consultation) => consultation.id === id)
}

export const getConsultationsByStatus = async (status: string): Promise<Consultation[]> => {
  if (isLive()) {
    const list = await apiAdapter.getConsultations(status)
    return list as any[]
  }
  if (status === "all") return getConsultations()
  return consultations.filter((consultation) => consultation.status === status)
}

export const getUpcomingConsultations = async (): Promise<Consultation[]> => {
  if (isLive()) {
    const list = await apiAdapter.getConsultations('upcoming')
    return list as any[]
  }
  const now = new Date()
  return consultations
    .filter((consultation) => {
      const consultationDate = new Date(`${consultation.date}T${consultation.time}`)
      return consultation.status === "upcoming" && consultationDate > now
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return dateA.getTime() - dateB.getTime()
    })
}

export const createConsultation = async (
  consultationData: Omit<Consultation, "id" | "createdAt" | "updatedAt">,
): Promise<Consultation> => {
  if (isLive()) {
    return apiAdapter.createConsultation(consultationData)
  }
  const newConsultation: Consultation = {
    ...consultationData,
    id: `cons-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  consultations.push(newConsultation)
  return newConsultation
}

export const updateConsultation = async (id: string, updates: Partial<Consultation>): Promise<Consultation | null> => {
  if (isLive()) {
    return apiAdapter.updateConsultation(id, updates)
  }
  const index = consultations.findIndex((consultation) => consultation.id === id)
  if (index === -1) return null

  consultations[index] = {
    ...consultations[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return consultations[index]
}

export const deleteConsultation = async (id: string): Promise<boolean> => {
  if (isLive()) {
    return apiAdapter.deleteConsultation(id)
  }
  const index = consultations.findIndex((consultation) => consultation.id === id)
  if (index === -1) return false

  consultations.splice(index, 1)
  return true
}

// Medical Records operations
export const getMedicalRecords = async (): Promise<MedicalRecord[]> => {
  if (isLive()) {
    const list = await apiAdapter.getMedicalRecords()
    return list as any[]
  }
  return [...medicalRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const getMedicalRecordById = async (id: string): Promise<MedicalRecord | undefined> => {
  if (isLive()) {
    return apiAdapter.getMedicalRecordById(id)
  }
  return medicalRecords.find((record) => record.id === id)
}

export const getMedicalRecordsByConsultation = async (consultationId: string): Promise<MedicalRecord[]> => {
  if (isLive()) {
    const records = await apiAdapter.getMedicalRecords()
    return records.filter((r) => r.consultationId === consultationId)
  }
  return medicalRecords.filter((record) => record.consultationId === consultationId)
}

export const createMedicalRecord = async (recordData: Omit<MedicalRecord, "id" | "createdAt">): Promise<MedicalRecord> => {
  if (isLive()) {
    return apiAdapter.createMedicalRecord(recordData)
  }
  const newRecord: MedicalRecord = {
    ...recordData,
    id: `record-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  medicalRecords.push(newRecord)
  return newRecord
}

// Utility functions
export const getConsultationStats = async () => {
  if (isLive()) {
    return apiAdapter.getConsultationStats()
  }
  const total = consultations.length
  const completed = consultations.filter((c) => c.status === "completed").length
  const upcoming = consultations.filter((c) => c.status === "upcoming").length
  const cancelled = consultations.filter((c) => c.status === "cancelled").length

  const completedWithRatings = consultations.filter((c) => c.status === "completed" && c.rating)
  const averageRating =
    completedWithRatings.length > 0
      ? completedWithRatings.reduce((sum, c) => sum + (c.rating || 0), 0) / completedWithRatings.length
      : 0

  return {
    total,
    completed,
    upcoming,
    cancelled,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    averageRating: Math.round(averageRating * 10) / 10,
  }
}

export const getDoctorAvailability = async (doctorId: string, date: string): Promise<string[]> => {
  if (isLive()) {
    return apiAdapter.getDoctorAvailability(doctorId, date)
  }
  const doctor = await getDoctorById(doctorId)
  if (!doctor) return []

  const dayOfWeek = new Date(date).toLocaleDateString("en", { weekday: "long" }).toLowerCase()
  const availableSlots = doctor.availability[dayOfWeek] || []

  // Filter out already booked slots
  const bookedSlots = consultations
    .filter((c) => c.doctorId === doctorId && c.date === date && c.status !== "cancelled")
    .map((c) => c.time)

  return availableSlots.filter((slot) => !bookedSlots.includes(slot))
}

export const searchDoctors = async (query: string): Promise<Doctor[]> => {
  if (isLive()) {
    return apiAdapter.searchDoctors(query)
  }
  const searchTerm = query.toLowerCase()
  return doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm) ||
      doctor.specialty.toLowerCase().includes(searchTerm) ||
      doctor.languages.some((lang) => lang.toLowerCase().includes(searchTerm)),
  )
}

export const getConsultationsForCalendar = async () => {
  const currentConsultations = await getConsultations()
  const resolved = await Promise.all(
    currentConsultations.map(async (consultation) => {
      const doctor = await getDoctorById(consultation.doctorId)
      return {
        id: consultation.id,
        title: `${doctor?.name || consultation.patientName} - ${consultation.reason}`,
        start: new Date(`${consultation.date}T${consultation.time}`),
        end: new Date(new Date(`${consultation.date}T${consultation.time}`).getTime() + consultation.duration * 60000),
        status: consultation.status,
        doctor: doctor?.name,
        type: consultation.type,
      }
    })
  )
  return resolved
}
