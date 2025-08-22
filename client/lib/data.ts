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
    name: "Anirban Mukherjee",
    age: 48,
    diagnosis: "Hypertension & Mild Diabetes",
    avatar: "/",
    phone: "+91 98300 11223",
    email: "anirban.mukherjee@email.com",
    address: "Lake Gardens, Kolkata, West Bengal",
    lastVisit: "Feb 15, 2025",
    status: "Active",
    heartRate: 94,
    bloodPressure: "145/92",
    glucose: 132,
  },
  {
    id: 2,
    name: "Sangeeta Mukherjee",
    age: 45,
    diagnosis: "Hypothyroidism & Anxiety",
    avatar: "/",
    phone: "+91 98745 33445",
    email: "sangeeta.mukherjee@email.com",
    address: "Lake Gardens, Kolkata, West Bengal",
    lastVisit: "Feb 10, 2025",
    status: "Active",
    heartRate: 82,
    bloodPressure: "122/80",
    glucose: 95,
  },
  {
    id: 3,
    name: "Ritvik Mukherjee",
    age: 19,
    diagnosis: "Seasonal Allergic Rhinitis",
    avatar: "/",
    phone: "+91 99035 77889",
    email: "ritvik.mukherjee@email.com",
    address: "Lake Gardens, Kolkata, West Bengal",
    lastVisit: "Jan 28, 2025",
    status: "Active",
    heartRate: 76,
    bloodPressure: "118/75",
    glucose: 88,
  },
  {
    id: 4,
    name: "Riya Mukherjee",
    age: 14,
    diagnosis: "Mild Asthma (exercise-induced)",
    avatar: "/",
    phone: "+91 98360 44567",
    email: "riya.mukherjee@email.com",
    address: "Lake Gardens, Kolkata, West Bengal",
    lastVisit: "Feb 5, 2025",
    status: "Active",
    heartRate: 84,
    bloodPressure: "110/72",
    glucose: 90,
  },
  {
    id: 5,
    name: "Ishaan Mukherjee",
    age: 9,
    diagnosis: "Healthy (Routine Checkup)",
    avatar: "/",
    phone: "+91 98360 77812",
    email: "ishaan.mukherjee@email.com",
    address: "Lake Gardens, Kolkata, West Bengal",
    lastVisit: "Dec 20, 2024",
    status: "Active",
    heartRate: 88,
    bloodPressure: "108/70",
    glucose: 85,
  },
]

export const initialAppointments: Appointment[] = [
  {
    id: 1,
    patientName: "Anirban Mukherjee",
    patientId: 1,
    doctorName: "Dr. Abhijit Roy",
    doctorAvatar: "/",
    date: "2025-02-20",
    time: "10:00 AM",
    type: "Follow-up",
    status: "Scheduled",
    duration: "30 min",
    location: "Apollo Gleneagles Hospital, Kolkata",
    notes: "Monitoring blood pressure and diabetes medication adjustment",
  },
  {
    id: 2,
    patientName: "Sangeeta Mukherjee",
    patientId: 2,
    doctorName: "Dr. Shreya Sen",
    doctorAvatar: "/",
    date: "2025-02-22",
    time: "11:30 AM",
    type: "Consultation",
    status: "Scheduled",
    duration: "45 min",
    location: "Fortis Hospital, Anandapur, Kolkata",
    notes: "Routine thyroid check and anxiety management consultation",
  },
  {
    id: 3,
    patientName: "Ritvik Mukherjee",
    patientId: 3,
    doctorName: "Dr. Anindita Bose",
    doctorAvatar: "/",
    date: "2025-01-28",
    time: "3:00 PM",
    type: "Consultation",
    status: "Completed",
    duration: "30 min",
    location: "Peerless Hospital, Kolkata",
    notes: "Allergy flare-up, prescribed antihistamines",
  },
  {
    id: 4,
    patientName: "Riya Mukherjee",
    patientId: 4,
    doctorName: "Dr. Kunal Banerjee",
    doctorAvatar: "/",
    date: "2025-02-05",
    time: "9:30 AM",
    type: "Routine",
    status: "Completed",
    duration: "30 min",
    location: "Medica Superspecialty Hospital, Kolkata",
    notes: "Asthma review, advised inhaler before sports",
  },
  {
    id: 5,
    patientName: "Ishaan Mukherjee",
    patientId: 5,
    doctorName: "Dr. Rupa Chatterjee",
    doctorAvatar: "/",
    date: "2024-12-20",
    time: "12:00 PM",
    type: "Routine",
    status: "Completed",
    duration: "20 min",
    location: "AMRI Hospital, Dhakuria, Kolkata",
    notes: "General pediatric health check-up, no concerns",
  },
]

export const initialMedicalRecords: MedicalRecord[] = [
  {
    id: 1,
    patient: "Anirban Mukherjee",
    patientId: "P001",
    patientAvatar: "/",
    recordType: "Lab Results",
    title: "Blood Sugar & Lipid Profile",
    date: "2025-02-15",
    doctor: "Dr. Abhijit Roy",
    category: "Pathology",
    status: "Final",
    fileSize: "3.2 MB",
    description: "Elevated fasting glucose and borderline cholesterol levels",
    tags: ["Diabetes", "Lipid", "Hypertension"],
    priority: "High",
  },
  {
    id: 2,
    patient: "Sangeeta Mukherjee",
    patientId: "P002",
    patientAvatar: "/",
    recordType: "Thyroid Panel",
    title: "TSH & T3/T4 Report",
    date: "2025-02-10",
    doctor: "Dr. Shreya Sen",
    category: "Endocrinology",
    status: "Final",
    fileSize: "2.1 MB",
    description: "TSH slightly elevated, advised continuation of thyroid medication",
    tags: ["Thyroid", "Hormone"],
    priority: "Medium",
  },
  {
    id: 3,
    patient: "Ritvik Mukherjee",
    patientId: "P003",
    patientAvatar: "/",
    recordType: "Allergy Test",
    title: "Skin Prick Test",
    date: "2025-01-28",
    doctor: "Dr. Anindita Bose",
    category: "Allergy & Immunology",
    status: "Final",
    fileSize: "1.5 MB",
    description: "Positive response to dust mites and pollen",
    tags: ["Allergy", "Rhinitis"],
    priority: "Normal",
  },
  {
    id: 4,
    patient: "Riya Mukherjee",
    patientId: "P004",
    patientAvatar: "/",
    recordType: "Pulmonary Function Test",
    title: "Spirometry Report",
    date: "2025-02-05",
    doctor: "Dr. Kunal Banerjee",
    category: "Pulmonology",
    status: "Final",
    fileSize: "2.9 MB",
    description: "Mild obstruction consistent with exercise-induced asthma",
    tags: ["Asthma", "Respiratory"],
    priority: "Medium",
  },
  {
    id: 5,
    patient: "Ishaan Mukherjee",
    patientId: "P005",
    patientAvatar: "/",
    recordType: "Routine Check-up",
    title: "Pediatric Growth Chart",
    date: "2024-12-20",
    doctor: "Dr. Rupa Chatterjee",
    category: "Pediatrics",
    status: "Final",
    fileSize: "1.2 MB",
    description: "Normal growth and development parameters for age",
    tags: ["Pediatric", "Routine"],
    priority: "Normal",
  },
]

export const initialHealthCampaigns: HealthCampaign[] = [
  {
    id: "HC001",
    type: "IMD",
    title: "COVID-19 Booster Drive",
    description: "Free COVID-19 booster vaccination for eligible adults and high-risk individuals.",
    organiser: "Kolkata Municipal Corporation Health Dept",
    location: "Community Hall, Park Circus",
    startDate: "2025-08-25",
    endDate: "2025-08-27",
    capacity: 500,
    registeredUsers: 342,
    registrationRequired: true,
    vaccines: ["Covishield", "Covaxin"],
    contactInfo: {
      phone: "+91-33-2287-1234",
      email: "covidbooster@kmc.gov.in",
    },
  },
  {
    id: "HC002",
    type: "FHC",
    title: "Annual Free Health Checkup Camp",
    description: "Comprehensive health screening including diabetes, BP, and cholesterol checks.",
    organiser: "Apollo Gleneagles Hospitals",
    location: "Apollo Gleneagles, Salt Lake",
    startDate: "2025-08-29",
    endDate: "2025-08-31",
    capacity: 200,
    registeredUsers: 156,
    registrationRequired: true,
    contactInfo: {
      phone: "+91-33-2320-3040",
      email: "checkup@apollohospitalskolkata.com",
    },
  },
  {
    id: "HC003",
    type: "MHC",
    title: "Mental Wellness Awareness Workshop",
    description: "Stress management and mental health counseling for students and professionals.",
    organiser: "Institute of Psychiatry, Kolkata",
    location: "Institute of Psychiatry, Shakespeare Sarani",
    startDate: "2025-09-02",
    endDate: "2025-09-02",
    registeredUsers: 95,
    registrationRequired: false,
    contactInfo: {
      phone: "+91-33-2282-2542",
      email: "wellness@iopkolkata.org",
    },
  },
  {
    id: "HC004",
    type: "BDC",
    title: "Blood Donation Marathon",
    description: "Large-scale blood donation camp for thalassemia and accident patients.",
    organiser: "Indian Red Cross Society, Kolkata Chapter",
    location: "Netaji Indoor Stadium, Eden Gardens",
    startDate: "2025-09-04",
    endDate: "2025-09-04",
    capacity: 400,
    registeredUsers: 210,
    registrationRequired: true,
    contactInfo: {
      phone: "+91-33-2473-4000",
      email: "bloodcamp@redcrosskolkata.org",
    },
  },
  {
    id: "HC005",
    type: "WPC",
    title: "Diabetes & Lifestyle Workshop",
    description: "Seminar on preventing diabetes through diet, yoga, and regular health checks.",
    organiser: "Diabetes Research Society of Kolkata",
    location: "MDRF Center, Ballygunge",
    startDate: "2025-09-07",
    endDate: "2025-09-07",
    capacity: 150,
    registeredUsers: 87,
    registrationRequired: true,
    contactInfo: {
      phone: "+91-33-2835-9048",
      email: "diabetes@drskolkata.in",
    },
  },
  {
    id: "HC006",
    type: "IMD",
    title: "Polio Immunisation Week",
    description: "Mass polio vaccination drive for children under 5 years of age.",
    organiser: "WB Health & Family Welfare Dept",
    location: "Ward Health Units across Kolkata",
    startDate: "2025-09-10",
    endDate: "2025-09-15",
    capacity: 1000,
    registeredUsers: 642,
    registrationRequired: false,
    vaccines: ["Oral Polio Vaccine"],
    contactInfo: {
      phone: "+91-33-2245-6789",
      email: "polio@wbhealth.gov.in",
    },
  },
  {
    id: "HC007",
    type: "FHC",
    title: "Free Eye & Dental Screening",
    description: "Free consultation for eye and dental health. Spectacles and oral kits distributed.",
    organiser: "Peerless Hospital",
    location: "Peerless Hospital, Panchasayar",
    startDate: "2025-09-12",
    endDate: "2025-09-13",
    capacity: 180,
    registeredUsers: 134,
    registrationRequired: true,
    contactInfo: {
      phone: "+91-33-2432-5000",
      email: "eyecamp@peerlesshospital.com",
    },
  },
  {
    id: "HC008",
    type: "MHC",
    title: "Adolescent Stress Management Workshop",
    description: "Interactive session for teenagers on exam stress, anxiety, and mental health.",
    organiser: "Kolkata University Psychology Dept",
    location: "University of Calcutta Auditorium, College Street",
    startDate: "2025-09-16",
    endDate: "2025-09-16",
    registeredUsers: 60,
    registrationRequired: false,
    contactInfo: {
      phone: "+91-33-2257-1000",
      email: "mentalhealth@caluniv.ac.in",
    },
  },
  {
    id: "HC009",
    type: "BDC",
    title: "Youth Blood Donation Drive",
    description: "Encouraging college students and youth to donate blood for emergency needs.",
    organiser: "Rotary Club of Kolkata",
    location: "Rotary Sadan, AJC Bose Road",
    startDate: "2025-09-20",
    endDate: "2025-09-20",
    capacity: 200,
    registeredUsers: 102,
    registrationRequired: true,
    contactInfo: {
      phone: "+91-33-2287-2321",
      email: "blooddonation@rotarykolkata.org",
    },
  },
  {
    id: "HC010",
    type: "WPC",
    title: "Women’s Health Awareness Camp",
    description: "Focus on maternal health, gynecology consultations, and nutrition counseling.",
    organiser: "Belle Vue Clinic",
    location: "Belle Vue Clinic, Elgin Road",
    startDate: "2025-09-25",
    endDate: "2025-09-26",
    capacity: 220,
    registeredUsers: 134,
    registrationRequired: true,
    contactInfo: {
      phone: "+91-33-2287-2321",
      email: "womenshealth@bellevueclinic.com",
    },
  },
];

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
