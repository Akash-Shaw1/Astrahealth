import doctorsData from "./data/doctors.json"
import consultationsData from "./data/consultations.json"
import medicalRecordsData from "./data/medical-records.json"

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
  reason: string
  severity: "low" | "medium" | "high"
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
      name: string
      dosage: string
      duration: string
      instructions: string
    }>
  }
  attachments: string[]
  followUp?: string
  createdAt: string
}

// In-memory storage (simulating persistent storage)
const doctors: Doctor[] = [...doctorsData]
const consultations: Consultation[] = [...consultationsData]
const medicalRecords: MedicalRecord[] = [...medicalRecordsData]

// Doctor operations
export const getDoctors = (): Doctor[] => {
  return doctors
}

export const getDoctorById = (id: string): Doctor | undefined => {
  return doctors.find((doctor) => doctor.id === id)
}

export const getDoctorsBySpecialty = (specialty: string): Doctor[] => {
  return doctors.filter((doctor) => doctor.specialty.toLowerCase().includes(specialty.toLowerCase()))
}

// Consultation operations
export const getConsultations = (): Consultation[] => {
  return consultations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const getConsultationById = (id: string): Consultation | undefined => {
  return consultations.find((consultation) => consultation.id === id)
}

export const getConsultationsByStatus = (status: string): Consultation[] => {
  if (status === "all") return getConsultations()
  return consultations.filter((consultation) => consultation.status === status)
}

export const getUpcomingConsultations = (): Consultation[] => {
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

export const createConsultation = (
  consultationData: Omit<Consultation, "id" | "createdAt" | "updatedAt">,
): Consultation => {
  const newConsultation: Consultation = {
    ...consultationData,
    id: `cons-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  consultations.push(newConsultation)
  return newConsultation
}

export const updateConsultation = (id: string, updates: Partial<Consultation>): Consultation | null => {
  const index = consultations.findIndex((consultation) => consultation.id === id)
  if (index === -1) return null

  consultations[index] = {
    ...consultations[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return consultations[index]
}

export const deleteConsultation = (id: string): boolean => {
  const index = consultations.findIndex((consultation) => consultation.id === id)
  if (index === -1) return false

  consultations.splice(index, 1)
  return true
}

// Medical Records operations
export const getMedicalRecords = (): MedicalRecord[] => {
  return medicalRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const getMedicalRecordById = (id: string): MedicalRecord | undefined => {
  return medicalRecords.find((record) => record.id === id)
}

export const getMedicalRecordsByConsultation = (consultationId: string): MedicalRecord[] => {
  return medicalRecords.filter((record) => record.consultationId === consultationId)
}

export const createMedicalRecord = (recordData: Omit<MedicalRecord, "id" | "createdAt">): MedicalRecord => {
  const newRecord: MedicalRecord = {
    ...recordData,
    id: `record-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  medicalRecords.push(newRecord)
  return newRecord
}

// Utility functions
export const getConsultationStats = () => {
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

export const getDoctorAvailability = (doctorId: string, date: string): string[] => {
  const doctor = getDoctorById(doctorId)
  if (!doctor) return []

  const dayOfWeek = new Date(date).toLocaleDateString("en", { weekday: "long" }).toLowerCase()
  const availableSlots = doctor.availability[dayOfWeek] || []

  // Filter out already booked slots
  const bookedSlots = consultations
    .filter((c) => c.doctorId === doctorId && c.date === date && c.status !== "cancelled")
    .map((c) => c.time)

  return availableSlots.filter((slot) => !bookedSlots.includes(slot))
}

export const searchDoctors = (query: string): Doctor[] => {
  const searchTerm = query.toLowerCase()
  return doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm) ||
      doctor.specialty.toLowerCase().includes(searchTerm) ||
      doctor.languages.some((lang) => lang.toLowerCase().includes(searchTerm)),
  )
}

export const getConsultationsForCalendar = () => {
  return consultations.map((consultation) => {
    const doctor = getDoctorById(consultation.doctorId)
    return {
      id: consultation.id,
      title: `${doctor?.name} - ${consultation.reason}`,
      start: new Date(`${consultation.date}T${consultation.time}`),
      end: new Date(new Date(`${consultation.date}T${consultation.time}`).getTime() + consultation.duration * 60000),
      status: consultation.status,
      doctor: doctor?.name,
      type: consultation.type,
    }
  })
}
