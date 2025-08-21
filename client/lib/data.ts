// Centralized data store for all application data
export interface Patient {
  id: number
  name: string
  age: number
  diagnosis: string
  avatar: string
  phone: string
  email: string
  address: string
  lastVisit: string
  status: "Active" | "Inactive"
  heartRate: number
  bloodPressure: string
  glucose: number
}

export interface Appointment {
  id: number
  patientName: string
  patientId: number
  doctorName: string
  doctorAvatar: string
  date: string
  time: string
  type: "Consultation" | "Follow-up" | "Emergency" | "Routine"
  status: "Scheduled" | "Completed" | "Cancelled" | "No-show"
  duration: string
  notes?: string
  location: string
}

export interface MedicalRecord {
  id: number
  patient: string
  patientId: string
  patientAvatar: string
  recordType: string
  title: string
  date: string
  doctor: string
  category: string
  status: "Final" | "Active" | "Draft" | "Archived"
  fileSize: string
  description: string
  tags: string[]
  priority: "High" | "Medium" | "Normal"
}

export interface HealthCampaign {
  id: string
  type: "IMD" | "FHC" | "MHC" | "BDC" | "WPC"
  title: string
  description: string
  organiser: string
  location: string
  startDate: string
  endDate: string
  capacity?: number
  registeredUsers: number
  registrationRequired: boolean
  vaccines?: string[]
  contactInfo: {
    phone: string
    email: string
  }
}

export interface HealthGoal {
  id: number
  title: string
  target: number
  current: number
  unit: string
  icon: string
  color: string
  streak: number
}

export interface Consultation {
  id: number
  doctor: string
  specialty: string
  avatar: string
  date: string
  time: string
  duration: string
  type: "Video Call" | "Phone Call"
  status: "upcoming" | "completed" | "cancelled"
  reason: string
  notes: string
  rating?: number
  prescription?: string
}

export interface FeedbackRecord {
  id: string
  name: string
  location: string
  services?: string[]
  specialization?: string
  ratings: Record<string, number>
  review_text: string
  reviewer: string
  referral_count: number
  escalation: boolean
  timestamp: string
}

// Initial data
export const initialPatients: Patient[] = [
  {
    id: 1,
    name: "Olivia Carter",
    age: 27,
    diagnosis: "Mild Hypertension",
    avatar: "/generic-hospital-patient.png",
    phone: "+1 (555) 123-4567",
    email: "olivia.carter@email.com",
    address: "123 Main St, City, State",
    lastVisit: "Dec 19, 2024",
    status: "Active",
    heartRate: 112,
    bloodPressure: "140/90",
    glucose: 95,
  },
  {
    id: 2,
    name: "Marcus Johnson",
    age: 34,
    diagnosis: "Type 2 Diabetes",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "+1 (555) 234-5678",
    email: "marcus.johnson@email.com",
    address: "456 Oak Ave, City, State",
    lastVisit: "Dec 18, 2024",
    status: "Active",
    heartRate: 88,
    bloodPressure: "125/80",
    glucose: 145,
  },
  {
    id: 3,
    name: "Sarah Williams",
    age: 45,
    diagnosis: "Asthma",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "+1 (555) 345-6789",
    email: "sarah.williams@email.com",
    address: "789 Pine St, City, State",
    lastVisit: "Dec 15, 2024",
    status: "Inactive",
    heartRate: 76,
    bloodPressure: "118/75",
    glucose: 88,
  },
  {
    id: 4,
    name: "David Chen",
    age: 52,
    diagnosis: "Coronary Artery Disease",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "+1 (555) 456-7890",
    email: "david.chen@email.com",
    address: "321 Elm St, City, State",
    lastVisit: "Dec 20, 2024",
    status: "Active",
    heartRate: 95,
    bloodPressure: "135/85",
    glucose: 110,
  },
  {
    id: 5,
    name: "Emily Rodriguez",
    age: 29,
    diagnosis: "Anxiety Disorder",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "+1 (555) 567-8901",
    email: "emily.rodriguez@email.com",
    address: "654 Maple Ave, City, State",
    lastVisit: "Dec 21, 2024",
    status: "Active",
    heartRate: 82,
    bloodPressure: "120/78",
    glucose: 92,
  },
  {
    id: 6,
    name: "Robert Thompson",
    age: 67,
    diagnosis: "Chronic Kidney Disease",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "+1 (555) 678-9012",
    email: "robert.thompson@email.com",
    address: "987 Cedar Ln, City, State",
    lastVisit: "Dec 16, 2024",
    status: "Active",
    heartRate: 78,
    bloodPressure: "145/92",
    glucose: 105,
  },
]

export const initialAppointments: Appointment[] = [
  {
    id: 1,
    patientName: "Olivia Carter",
    patientId: 1,
    doctorName: "Dr. Emma Hayes",
    doctorAvatar: "/emma-hayes-doctor.png",
    date: "2024-12-22",
    time: "10:00 AM",
    type: "Follow-up",
    status: "Scheduled",
    duration: "30 min",
    location: "Room 201",
    notes: "Follow-up for hypertension treatment",
  },
  {
    id: 2,
    patientName: "Marcus Johnson",
    patientId: 2,
    doctorName: "Dr. Sarah Wilson",
    doctorAvatar: "/female-doctor.png",
    date: "2024-12-23",
    time: "2:30 PM",
    type: "Consultation",
    status: "Scheduled",
    duration: "45 min",
    location: "Room 105",
    notes: "Diabetes management consultation",
  },
  {
    id: 3,
    patientName: "David Chen",
    patientId: 4,
    doctorName: "Dr. Michael Roberts",
    doctorAvatar: "/male-doctor.png",
    date: "2024-12-24",
    time: "9:00 AM",
    type: "Emergency",
    status: "Completed",
    duration: "60 min",
    location: "Emergency Room",
    notes: "Chest pain evaluation - stable condition",
  },
  {
    id: 4,
    patientName: "Emily Rodriguez",
    patientId: 5,
    doctorName: "Dr. Lisa Park",
    doctorAvatar: "/female-doctor.png",
    date: "2024-12-25",
    time: "11:30 AM",
    type: "Routine",
    status: "Scheduled",
    duration: "30 min",
    location: "Room 302",
    notes: "Mental health check-up and medication review",
  },
  {
    id: 5,
    patientName: "Robert Thompson",
    patientId: 6,
    doctorName: "Dr. James Anderson",
    doctorAvatar: "/male-doctor-glasses.png",
    date: "2024-12-26",
    time: "3:00 PM",
    type: "Follow-up",
    status: "Scheduled",
    duration: "45 min",
    location: "Room 150",
    notes: "Kidney function monitoring and treatment adjustment",
  },
]

export const initialMedicalRecords: MedicalRecord[] = [
  {
    id: 1,
    patient: "Olivia Carter",
    patientId: "P001",
    patientAvatar: "/generic-hospital-patient.png",
    recordType: "Lab Results",
    title: "Complete Blood Count",
    date: "2024-12-19",
    doctor: "Dr. Emma Hayes",
    category: "Laboratory",
    status: "Final",
    fileSize: "2.4 MB",
    description: "Routine blood work showing normal values across all parameters",
    tags: ["Blood Test", "Routine", "Normal"],
    priority: "Normal",
  },
  {
    id: 2,
    patient: "Marcus Johnson",
    patientId: "P002",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    recordType: "Imaging",
    title: "Chest X-Ray",
    date: "2024-12-18",
    doctor: "Dr. Sarah Wilson",
    category: "Radiology",
    status: "Final",
    fileSize: "8.7 MB",
    description: "Clear chest X-ray with no abnormalities detected",
    tags: ["X-Ray", "Chest", "Clear"],
    priority: "Normal",
  },
  {
    id: 3,
    patient: "David Chen",
    patientId: "P004",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    recordType: "Cardiac Report",
    title: "Echocardiogram",
    date: "2024-12-20",
    doctor: "Dr. Michael Roberts",
    category: "Cardiology",
    status: "Final",
    fileSize: "15.2 MB",
    description: "Echocardiogram showing mild left ventricular dysfunction",
    tags: ["Echo", "Cardiac", "LV Dysfunction"],
    priority: "High",
  },
  {
    id: 4,
    patient: "Emily Rodriguez",
    patientId: "P005",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    recordType: "Psychiatric Evaluation",
    title: "Mental Health Assessment",
    date: "2024-12-21",
    doctor: "Dr. Lisa Park",
    category: "Psychiatry",
    status: "Active",
    fileSize: "1.8 MB",
    description: "Comprehensive mental health evaluation and treatment plan",
    tags: ["Mental Health", "Anxiety", "Treatment Plan"],
    priority: "Medium",
  },
  {
    id: 5,
    patient: "Robert Thompson",
    patientId: "P006",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    recordType: "Lab Results",
    title: "Kidney Function Panel",
    date: "2024-12-16",
    doctor: "Dr. James Anderson",
    category: "Nephrology",
    status: "Final",
    fileSize: "3.1 MB",
    description: "Kidney function tests showing stage 3 chronic kidney disease",
    tags: ["Kidney", "CKD", "Stage 3"],
    priority: "High",
  },
]

export const initialHealthCampaigns: HealthCampaign[] = [
  {
    id: "HC001",
    type: "IMD",
    title: "COVID-19 Vaccination Drive",
    description: "Free COVID-19 vaccination for all age groups. Walk-ins welcome.",
    organiser: "City Health Department",
    location: "Community Center, Downtown",
    startDate: "2024-12-25",
    endDate: "2024-12-27",
    capacity: 500,
    registeredUsers: 342,
    registrationRequired: true,
    vaccines: ["COVID-19", "Flu Shot"],
    contactInfo: {
      phone: "+1 (555) 123-4567",
      email: "health@city.gov",
    },
  },
  {
    id: "HC002",
    type: "FHC",
    title: "Free Health Checkup Camp",
    description: "Comprehensive health screening including blood pressure, diabetes, and cholesterol checks.",
    organiser: "Apollo Hospital",
    location: "Apollo Hospital, Main Branch",
    startDate: "2024-12-28",
    endDate: "2024-12-30",
    capacity: 200,
    registeredUsers: 156,
    registrationRequired: true,
    contactInfo: {
      phone: "+1 (555) 234-5678",
      email: "checkup@apollo.com",
    },
  },
]

export const initialHealthGoals: HealthGoal[] = [
  {
    id: 1,
    title: "Daily Steps",
    target: 10000,
    current: 8750,
    unit: "steps",
    icon: "Activity",
    color: "blue",
    streak: 12,
  },
  {
    id: 2,
    title: "Water Intake",
    target: 8,
    current: 6,
    unit: "glasses",
    icon: "Droplets",
    color: "cyan",
    streak: 8,
  },
  {
    id: 3,
    title: "Sleep Hours",
    target: 8,
    current: 7.5,
    unit: "hours",
    icon: "Moon",
    color: "purple",
    streak: 5,
  },
  {
    id: 4,
    title: "Exercise",
    target: 60,
    current: 45,
    unit: "minutes",
    icon: "Heart",
    color: "red",
    streak: 15,
  },
]

export const initialConsultations: Consultation[] = [
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    avatar: "/female-doctor.png",
    date: "Dec 22, 2024",
    time: "2:30 PM",
    duration: "30 min",
    type: "Video Call",
    status: "upcoming",
    reason: "Follow-up consultation for hypertension",
    notes: "Patient reports improved symptoms with current medication",
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialty: "General Practitioner",
    avatar: "/male-doctor.png",
    date: "Dec 20, 2024",
    time: "10:00 AM",
    duration: "25 min",
    type: "Video Call",
    status: "completed",
    reason: "Annual health checkup",
    notes: "Overall health is good. Recommended lifestyle changes discussed.",
    rating: 4.8,
    prescription: "Vitamin D supplement, Exercise routine",
  },
  {
    id: 3,
    doctor: "Dr. Emily Rodriguez",
    specialty: "Dermatologist",
    avatar: "/emma-hayes-doctor.png",
    date: "Dec 18, 2024",
    time: "4:15 PM",
    duration: "20 min",
    type: "Phone Call",
    status: "completed",
    reason: "Skin condition consultation",
    notes: "Prescribed topical treatment. Follow-up in 2 weeks.",
    rating: 4.9,
    prescription: "Hydrocortisone cream 1%, Apply twice daily",
  },
  {
    id: 4,
    doctor: "Dr. James Wilson",
    specialty: "Orthopedist",
    avatar: "/male-doctor-glasses.png",
    date: "Dec 15, 2024",
    time: "11:30 AM",
    duration: "35 min",
    type: "Video Call",
    status: "cancelled",
    reason: "Knee pain evaluation",
    notes: "Consultation cancelled by patient. Rescheduled for next week.",
  },
  {
    id: 5,
    doctor: "Dr. Lisa Park",
    specialty: "Psychiatrist",
    avatar: "/female-doctor.png",
    date: "Dec 25, 2024",
    time: "1:00 PM",
    duration: "45 min",
    type: "Video Call",
    status: "upcoming",
    reason: "Mental health follow-up",
    notes: "Regular check-in for anxiety management and medication review",
  },
]

export const initialFeedbackHospitals: FeedbackRecord[] = [
  {
    id: "HOSP001",
    name: "Apollo Hospital",
    location: "Kolkata, WB",
    services: ["Cardiology", "Emergency", "Orthopedics"],
    ratings: { hospitality: 4, service_quality: 5, treatment_speed: 3, pricing: 4, overall: 4 },
    review_text: "Good doctors but waiting time was long.",
    reviewer: "User123",
    referral_count: 12,
    escalation: false,
    timestamp: "2025-08-19T10:15:00Z",
  },
]

export const initialFeedbackDoctors: FeedbackRecord[] = [
  {
    id: "DOC045",
    name: "Dr. S. Mukherjee",
    specialization: "Pediatrics",
    location: "Kolkata, WB",
    ratings: { hospitality: 5, service_quality: 4, treatment_speed: 4, pricing: 3, overall: 4 },
    review_text: "Explains well and very friendly with kids.",
    reviewer: "User567",
    referral_count: 8,
    escalation: false,
    timestamp: "2025-08-18T14:30:00Z",
  },
]

// Storage utilities
export const STORAGE_KEYS = {
  PATIENTS: "astra_patients",
  APPOINTMENTS: "astra_appointments",
  MEDICAL_RECORDS: "astra_medical_records",
  HEALTH_CAMPAIGNS: "astra_health_campaigns",
  HEALTH_GOALS: "astra_health_goals",
  CONSULTATIONS: "astra_consultations",
  FEEDBACK_HOSPITALS: "astra_feedback_hospitals",
  FEEDBACK_DOCTORS: "astra_feedback_doctors",
}

export function loadFromStorage<T>(key: string, defaultValue: T[]): T[] {
  if (typeof window === "undefined") return defaultValue
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

export function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}
