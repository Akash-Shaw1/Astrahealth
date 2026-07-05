"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@clerk/nextjs"
import { apiAdapter } from "@/lib/api-adapter"
import { useDataSource } from "@/hooks/use-data-source"
import {
  User,
  Heart,
  Plus,
  Trash2,
  Bell,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react"

// Mock Demo Data Pool
const DEMO_PROFILES = [
  {
    phone: "+91 98301 23456",
    dateOfBirth: "1973-04-12",
    gender: "Male",
    address: "Flat 3B, Lake Gardens, Kolkata, WB 700045",
    bloodGroup: "B+",
    emergencyContactName: "Madhumita Chatterjee",
    emergencyContactPhone: "+91 98740 56789",
    emergencyContactRelationship: "Spouse",
  },
  {
    phone: "+91 98765 43210",
    dateOfBirth: "1988-11-22",
    gender: "Female",
    address: "12A Park Street, Flat 401, Kolkata, WB 700016",
    bloodGroup: "O+",
    emergencyContactName: "Rajesh Sen",
    emergencyContactPhone: "+91 99033 11223",
    emergencyContactRelationship: "Spouse",
  }
]

const DEMO_FAMILY = [
  [
    { name: "Madhumita Chatterjee", relationship: "Spouse", dateOfBirth: "1975-11-03", gender: "Female", knownConditions: "Hypothyroidism", allergies: "None", bloodGroup: "O+" },
    { name: "Riya Chatterjee", relationship: "Child", dateOfBirth: "2011-06-18", gender: "Female", knownConditions: "Seasonal Allergies", allergies: "Dust mites, Pollen", bloodGroup: "B+" }
  ],
  [
    { name: "Rajesh Sen", relationship: "Spouse", dateOfBirth: "1985-05-15", gender: "Male", knownConditions: "Mild Hypertension", allergies: "Penicillin", bloodGroup: "A+" }
  ]
]

const DEMO_MEDICAL = [
  {
    knownConditions: "Hypertension, Mild Diabetes",
    allergies: "None",
    preferredHospital: "Apollo Gleneagles Hospital, Kolkata",
    insuranceProvider: "Star Health Insurance",
    insurancePolicyNumber: "SH-983021-99",
  },
  {
    knownConditions: "Asthma",
    allergies: "Sulfonamides",
    preferredHospital: "Fortis Hospital, Anandapur, Kolkata",
    insuranceProvider: "HDFC ERGO Health Optima",
    insurancePolicyNumber: "HE-392019-21",
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const { userId } = useAuth()
  const { dataMode } = useDataSource()
  
  const [step, setStep] = useState(1)
  const [demoIndex, setDemoIndex] = useState(0)

  // Step 1: User Profile
  const [profile, setProfile] = useState({
    phone: "",
    dateOfBirth: "",
    gender: "Unspecified",
    address: "",
    bloodGroup: "B+",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
  })

  // Step 2: Dependents / Family Members
  const [familyMembers, setFamilyMembers] = useState<any[]>([])
  const [newMember, setNewMember] = useState({
    name: "",
    relationship: "Spouse",
    dateOfBirth: "",
    gender: "Unspecified",
    phone: "",
    email: "",
    knownConditions: "",
    allergies: "",
    bloodGroup: "",
  })

  // Step 3: Medical profile
  const [medical, setMedical] = useState({
    knownConditions: "",
    allergies: "",
    preferredLanguage: "en",
    preferredHospital: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
  })

  // Step 4: Notification Preferences
  const [notifications, setNotifications] = useState({
    appointments: true,
    medications: true,
    updates: false,
    marketing: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load draft if available in live mode
  useEffect(() => {
    if (userId && dataMode === "live") {
      apiAdapter.getProfile().then((res: any) => {
        if (res && res.onboardingDraft) {
          try {
            const draft = res.onboardingDraft;
            if (draft.profile) setProfile(draft.profile);
            if (draft.familyMembers) setFamilyMembers(draft.familyMembers);
            if (draft.medical) setMedical(draft.medical);
            if (draft.notifications) setNotifications(draft.notifications);
            if (draft.step) setStep(draft.step);
            toast({
              title: "Draft Restored",
              description: "Restored your partial onboarding progress.",
            });
          } catch (e) {
            console.error("Failed to restore onboarding draft:", e);
          }
        }
      }).catch(console.error);
    }
  }, [userId, dataMode])

  // Save draft when changing steps
  const saveDraftProgress = async (nextStep: number) => {
    setStep(nextStep)
    if (dataMode === "live") {
      try {
        await apiAdapter.updateOnboardingDraft({
          profile,
          familyMembers,
          medical,
          notifications,
          step: nextStep,
        });
      } catch (e) {
        console.error("Failed to save draft:", e);
      }
    }
  }

  // ✨ Fill Demo Data Button Handler
  const handleFillDemoData = () => {
    const nextDemoIndex = (demoIndex + 1) % DEMO_PROFILES.length
    setDemoIndex(nextDemoIndex)

    if (step === 1) {
      setProfile(DEMO_PROFILES[demoIndex])
      toast({ title: "Profile Filled", description: "Sample profile details injected." })
    } else if (step === 2) {
      setFamilyMembers(DEMO_FAMILY[demoIndex])
      toast({ title: "Family Added", description: `Added dependents.` })
    } else if (step === 3) {
      setMedical(DEMO_MEDICAL[demoIndex])
      toast({ title: "Medical Details Filled", description: "Diagnoses & insurance injected." })
    }
  }

  const handleAddFamilyMember = () => {
    if (!newMember.name) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" })
      return
    }
    setFamilyMembers((prev) => [...prev, { ...newMember }])
    setNewMember({
      name: "",
      relationship: "Spouse",
      dateOfBirth: "",
      gender: "Unspecified",
      phone: "",
      email: "",
      knownConditions: "",
      allergies: "",
      bloodGroup: "",
    })
  }

  const handleRemoveFamilyMember = (index: number) => {
    setFamilyMembers((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmitOnboarding = async () => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...profile,
        ...medical,
        knownConditions: medical.knownConditions.split(",").map((s) => s.trim()).filter(Boolean),
        allergies: medical.allergies.split(",").map((s) => s.trim()).filter(Boolean),
        notificationPrefs: notifications,
        familyMembers: familyMembers.map((m) => ({
          ...m,
          knownConditions: m.knownConditions.split(",").map((s) => s.trim()).filter(Boolean),
          allergies: m.allergies.split(",").map((s) => s.trim()).filter(Boolean),
        })),
        onboardingComplete: true,
      }

      if (dataMode === "live") {
        await apiAdapter.completeOnboarding(payload)
      } else {
        // Fallback: Save to localStorage dummy adapter database
        localStorage.setItem("astra_onboarding_data", JSON.stringify(payload))
        localStorage.setItem("astra_onboarding_complete", "true")
      }

      toast({
        title: "Setup Complete!",
        description: "Welcome to AstraHealth. Redirecting to dashboard...",
      })

      // Force a page refresh to trigger routing guard checks
      window.location.href = "/dashboard"
    } catch (error) {
      console.error(error)
      toast({
        title: "Submission Failed",
        description: "An error occurred while saving your profile.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Card className="w-full max-w-2xl bg-white/70 backdrop-blur-md border-white/20 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 animate-pulse" />
              AstraHealth Onboarding
            </CardTitle>
            <CardDescription className="text-slate-500 mt-1">
              Step {step} of 5 — Set up your health portal profile
            </CardDescription>
          </div>
          {step < 4 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleFillDemoData}
              className="bg-white/80 hover:bg-slate-50 text-indigo-700 border-indigo-200 shadow-sm hover:shadow"
            >
              <Sparkles className="w-4 h-4 mr-1 text-indigo-500 animate-spin" />
              ✨ Demo Fill
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* STEP 1: PERSONAL PROFILE */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-1.5 border-b pb-2">
                <User className="w-5 h-5 text-blue-500" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile((p) => ({ ...p, dateOfBirth: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={profile.gender}
                    onValueChange={(val) => setProfile((p) => ({ ...p, gender: val }))}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Unspecified">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select
                    value={profile.bloodGroup}
                    onValueChange={(val) => setProfile((p) => ({ ...p, bloodGroup: val }))}
                  >
                    <SelectTrigger id="bloodGroup">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address">Residential Address</Label>
                <Textarea
                  id="address"
                  placeholder="Street address, apartment unit, Kolkata"
                  value={profile.address}
                  onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                />
              </div>

              <h4 className="font-semibold text-sm text-slate-700 pt-2 border-t">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="ecName">Contact Name</Label>
                  <Input
                    id="ecName"
                    placeholder="Full Name"
                    value={profile.emergencyContactName}
                    onChange={(e) => setProfile((p) => ({ ...p, emergencyContactName: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ecPhone">Contact Phone</Label>
                  <Input
                    id="ecPhone"
                    placeholder="+91 XXXXX XXXXX"
                    value={profile.emergencyContactPhone}
                    onChange={(e) => setProfile((p) => ({ ...p, emergencyContactPhone: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ecRel">Relationship</Label>
                  <Input
                    id="ecRel"
                    placeholder="e.g. Spouse, Parent"
                    value={profile.emergencyContactRelationship}
                    onChange={(e) => setProfile((p) => ({ ...p, emergencyContactRelationship: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FAMILY MEMBERS */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-1.5 border-b pb-2">
                👥 Manage Dependents (Family Members)
              </h3>
              <p className="text-xs text-slate-500">
                Register family members whose medical records, appointments, and prescriptions you wish to oversee.
              </p>

              {familyMembers.length > 0 && (
                <div className="space-y-2 border p-3.5 rounded-xl bg-slate-50/50">
                  <Label className="text-xs font-bold text-slate-700">ADDED FAMILY MEMBERS</Label>
                  <div className="flex flex-wrap gap-2">
                    {familyMembers.map((m, idx) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1 bg-white border flex items-center gap-1.5 text-slate-700 shadow-sm text-sm">
                        <span>{m.name} ({m.relationship})</span>
                        <Trash2
                          className="w-3.5 h-3.5 text-red-500 cursor-pointer hover:text-red-700"
                          onClick={() => handleRemoveFamilyMember(idx)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Card className="border border-slate-200 bg-slate-50/20">
                <CardContent className="p-4 space-y-4">
                  <Label className="text-xs font-extrabold text-slate-600 uppercase">Add Dependents Form</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="fmName">Name</Label>
                      <Input
                        id="fmName"
                        value={newMember.name}
                        onChange={(e) => setNewMember((m) => ({ ...m, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="fmRel">Relationship</Label>
                      <Select
                        value={newMember.relationship}
                        onValueChange={(val) => setNewMember((m) => ({ ...m, relationship: val }))}
                      >
                        <SelectTrigger id="fmRel">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Spouse">Spouse</SelectItem>
                          <SelectItem value="Child">Child</SelectItem>
                          <SelectItem value="Parent">Parent</SelectItem>
                          <SelectItem value="Sibling">Sibling</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="fmDob">Date of Birth</Label>
                      <Input
                        id="fmDob"
                        type="date"
                        value={newMember.dateOfBirth}
                        onChange={(e) => setNewMember((m) => ({ ...m, dateOfBirth: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="fmConditions">Known Diagnoses (Comma separated)</Label>
                      <Input
                        id="fmConditions"
                        placeholder="e.g. Asthma, Diabetes"
                        value={newMember.knownConditions}
                        onChange={(e) => setNewMember((m) => ({ ...m, knownConditions: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="fmAllergies">Allergies (Comma separated)</Label>
                      <Input
                        id="fmAllergies"
                        placeholder="e.g. Penicillin, Pollen"
                        value={newMember.allergies}
                        onChange={(e) => setNewMember((m) => ({ ...m, allergies: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddFamilyMember}
                    className="w-full bg-white hover:bg-slate-50 text-slate-700"
                  >
                    <Plus className="w-4 h-4 mr-1.5 text-blue-600" /> Add dependent profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* STEP 3: MEDICAL PROFILE */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-1.5 border-b pb-2">
                🩺 Health Profile & Medical Details
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="conditions">Your Known Diagnoses (Comma separated)</Label>
                  <Input
                    id="conditions"
                    placeholder="Hypertension, Mild Diabetes, etc."
                    value={medical.knownConditions}
                    onChange={(e) => setMedical((m) => ({ ...m, knownConditions: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="allergies">Your Allergies (Comma separated)</Label>
                  <Input
                    id="allergies"
                    placeholder="e.g. Penicillin, Shellfish, Peanuts, None"
                    value={medical.allergies}
                    onChange={(e) => setMedical((m) => ({ ...m, allergies: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="prefHospital">Preferred Hospital / Clinic</Label>
                  <Input
                    id="prefHospital"
                    placeholder="e.g. Apollo Hospital, Fortis Hospital"
                    value={medical.preferredHospital}
                    onChange={(e) => setMedical((m) => ({ ...m, preferredHospital: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="insProvider">Insurance Provider</Label>
                    <Input
                      id="insProvider"
                      placeholder="e.g. Star Health, HDFC Ergo"
                      value={medical.insuranceProvider}
                      onChange={(e) => setMedical((m) => ({ ...m, insuranceProvider: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="insPolicy">Insurance Policy Number</Label>
                    <Input
                      id="insPolicy"
                      placeholder="Policy ID / Number"
                      value={medical.insurancePolicyNumber}
                      onChange={(e) => setMedical((m) => ({ ...m, insurancePolicyNumber: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PREFERENCES */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-1.5 border-b pb-2">
                <Bell className="w-5 h-5 text-purple-500" />
                Notification & Language preferences
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="language">Preferred Interface Language</Label>
                  <Select
                    value={medical.preferredLanguage}
                    onValueChange={(val) => setMedical((m) => ({ ...m, preferredLanguage: val }))}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
                      <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />
                <Label className="text-base font-semibold text-slate-800">Alert Preferences</Label>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium text-slate-700">Appointment Reminders</Label>
                      <p className="text-xs text-slate-500">Get notified 24h prior to doctor consultation slots.</p>
                    </div>
                    <Switch
                      checked={notifications.appointments}
                      onCheckedChange={(checked) => setNotifications((n) => ({ ...n, appointments: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium text-slate-700">Medication Reminders</Label>
                      <p className="text-xs text-slate-500">Get scheduled pill-intake alerts based on prescriptions.</p>
                    </div>
                    <Switch
                      checked={notifications.medications}
                      onCheckedChange={(checked) => setNotifications((n) => ({ ...n, medications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium text-slate-700">Health Campaign Alerts</Label>
                      <p className="text-xs text-slate-500">Be informed of immunization drives and campaigns in Kolkata.</p>
                    </div>
                    <Switch
                      checked={notifications.updates}
                      onCheckedChange={(checked) => setNotifications((n) => ({ ...n, updates: checked }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & SUBMIT */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-1.5 border-b pb-2 text-emerald-700">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Review & Confirm Setup
              </h3>
              <div className="space-y-4 text-sm divide-y">
                <div className="pt-2">
                  <Label className="font-bold text-slate-700 block">Personal Profile</Label>
                  <p className="text-slate-600 mt-1">
                    Gender: {profile.gender} | Birth Date: {profile.dateOfBirth} | Blood: {profile.bloodGroup}
                  </p>
                  <p className="text-slate-600">Address: {profile.address}</p>
                </div>
                <div className="pt-4">
                  <Label className="font-bold text-slate-700 block">Family dependents ({familyMembers.length})</Label>
                  {familyMembers.length > 0 ? (
                    <p className="text-slate-600 mt-1">
                      {familyMembers.map((m) => `${m.name} (${m.relationship})`).join(", ")}
                    </p>
                  ) : (
                    <p className="text-slate-500 italic mt-1">No dependents added. You can add them anytime.</p>
                  )}
                </div>
                <div className="pt-4">
                  <Label className="font-bold text-slate-700 block">Health & Insurance</Label>
                  <p className="text-slate-600 mt-1">Diagnoses: {medical.knownConditions || "None reported"}</p>
                  <p className="text-slate-600">Allergies: {medical.allergies || "None reported"}</p>
                  <p className="text-slate-600">
                    Insurance: {medical.insuranceProvider || "None"} | {medical.insurancePolicyNumber || "N/A"}
                  </p>
                </div>
                <div className="pt-4 pb-2">
                  <Label className="font-bold text-slate-700 block">Preferred Interface Language</Label>
                  <p className="text-slate-600 mt-1">
                    {medical.preferredLanguage === "en" ? "English" : medical.preferredLanguage === "bn" ? "Bengali (বাংলা)" : "Hindi (हिंदी)"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardHeader className="border-t border-slate-100 bg-slate-50/50 p-4 flex flex-row items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => saveDraftProgress(step - 1)}
            disabled={step === 1 || isSubmitting}
            className="text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
          </Button>

          {step < 5 ? (
            <Button
              onClick={() => saveDraftProgress(step + 1)}
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl"
            >
              Continue <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmitOnboarding}
              disabled={isSubmitting}
              className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSubmitting ? "Completing Setup..." : "Complete Setup"}
            </Button>
          )}
        </CardHeader>
      </Card>
    </div>
  )
}

const Separator = () => <div className="border-b border-slate-100 my-4" />
