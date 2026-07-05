"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Users, Phone, Mail, Filter, Search, CheckCircle, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
import { useDataSource } from "@/hooks/use-data-source"
import { apiAdapter } from "@/lib/api-adapter"

const typeLabels = {
  IMD: "Immunisation Drive",
  FHC: "Full Health Checkup",
  MHC: "Mental Health Camp",
  BDC: "Blood Donation Camp",
  WPC: "Wellness Program",
}

const typeColors = {
  IMD: "bg-green-100 text-green-800 border-green-200",
  FHC: "bg-blue-100 text-blue-800 border-blue-200",
  MHC: "bg-purple-100 text-purple-800 border-purple-200",
  BDC: "bg-red-100 text-red-800 border-red-200",
  WPC: "bg-orange-100 text-orange-800 border-orange-200",
}

export default function HealthCampaignsPage() {
  const { dataMode } = useDataSource()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [myRegistrations, setMyRegistrations] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState("self")
  const [familyMembers, setFamilyMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Load family members
  useEffect(() => {
    const fetchFamily = async () => {
      try {
        if (dataMode === "live") {
          const list = await apiAdapter.getFamilyMembers()
          setFamilyMembers(list)
          if (list.length > 0) {
            setSelectedFamilyMemberId(list[0].id)
          }
        } else {
          setFamilyMembers([
            { id: "self", name: "Arindam Chatterjee", relationship: "Self" },
            { id: "spouse", name: "Madhumita Chatterjee", relationship: "Spouse" },
          ])
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchFamily()
  }, [dataMode])

  const loadCampaignsData = async () => {
    setLoading(true)
    try {
      if (dataMode === "live") {
        const list = await apiAdapter.getCampaigns(
          filterType === "all" ? undefined : filterType,
          searchTerm || undefined
        )
        setCampaigns(list)

        const regs = await apiAdapter.getMyCampaignRegistrations()
        setMyRegistrations(regs)
      } else {
        // Fallback dummy campaigns
        const dummyCampaigns = [
          {
            id: "camp-001",
            type: "IMD",
            title: "Kolkata Polio Immunisation Drive",
            description: "Pulse polio immunization drive for children under 5 years.",
            organiser: "Kolkata Municipal Corporation",
            location: "Health Center 4, Salt Lake, Kolkata",
            startDate: new Date(Date.now() + 3600000 * 24 * 3).toISOString(),
            endDate: new Date(Date.now() + 3600000 * 24 * 5).toISOString(),
            capacity: 300,
            vaccines: ["Polio Vaccine"],
            contactPhone: "+91 33 2286 1000",
            contactEmail: "health@kmc.gov.in"
          },
          {
            id: "camp-002",
            type: "FHC",
            title: "Community Free General Health Camp",
            description: "Free general health consultation, BP monitoring, and blood sugar testing.",
            organiser: "Apollo Outreach Program",
            location: "Community Hall, Gariahat, Kolkata",
            startDate: new Date(Date.now() + 3600000 * 24 * 10).toISOString(),
            endDate: new Date(Date.now() + 3600000 * 24 * 11).toISOString(),
            capacity: 150,
            vaccines: [],
            contactPhone: "+91 98300 98300",
            contactEmail: "outreach@apollo.com"
          }
        ]

        setCampaigns(
          dummyCampaigns.filter((c) => {
            const matchesSearch =
              c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.description.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesType = filterType === "all" || c.type === filterType
            return matchesSearch && matchesType
          })
        )
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCampaignsData()
  }, [searchTerm, filterType, dataMode])

  const handleRegister = async (campaignId: string) => {
    try {
      if (dataMode === "live") {
        await apiAdapter.registerForCampaign(campaignId, selectedFamilyMemberId)
      } else {
        const matchingCampaign = campaigns.find((c) => c.id === campaignId)
        const dummyReg = {
          id: `reg-${Date.now()}`,
          campaignId,
          campaign: matchingCampaign,
          familyMemberId: selectedFamilyMemberId,
        }
        setMyRegistrations((prev) => [...prev, dummyReg])
      }

      toast({
        title: "Registration Confirmed",
        description: "You have successfully registered for the health campaign.",
      })
      loadCampaignsData()
    } catch (err) {
      console.error(err)
      toast({
        title: "Registration Failed",
        description: "Already registered or error registering.",
        variant: "destructive",
      })
    }
  }

  const handleCancelRegistration = async (campaignId: string) => {
    try {
      if (dataMode === "live") {
        await apiAdapter.cancelCampaignRegistration(campaignId, selectedFamilyMemberId)
      } else {
        setMyRegistrations((prev) => prev.filter((r) => r.campaignId !== campaignId))
      }

      toast({
        title: "Registration Cancelled",
        description: "Your campaign registration slot has been released.",
      })
      loadCampaignsData()
    } catch (err) {
      console.error(err)
    }
  }

  const isRegistered = (campaignId: string) => {
    return myRegistrations.some((r) => r.campaignId === campaignId)
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Health Campaigns & Camps</h1>
            <p className="text-slate-500 mt-1">
              Discover and register for health camps, vaccination drives, and wellness programs in Kolkata.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="fmSelect" className="font-bold text-slate-700 whitespace-nowrap">Register For:</Label>
            <Select value={selectedFamilyMemberId} onValueChange={setSelectedFamilyMemberId}>
              <SelectTrigger id="fmSelect" className="w-56 bg-white shadow-sm rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {familyMembers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} ({m.relationship})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white/50 p-4 border border-slate-200/50 rounded-2xl shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
            <Input
              placeholder="Search campaigns by title, description, or organizer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 bg-white border-slate-200"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-60 bg-white border-slate-200">
              <SelectValue placeholder="All Campaign Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaign Types</SelectItem>
              {Object.entries(typeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Campaign Cards */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Available Campaigns</h2>
            {loading ? (
              <div className="p-8 text-center text-slate-400 italic">Loading health campaigns...</div>
            ) : campaigns.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {campaigns.map((camp) => (
                  <Card key={camp.id} className="bg-white border-slate-100 hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden">
                    <CardHeader className="flex flex-row items-start justify-between p-6">
                      <div className="space-y-1.5">
                        <Badge className={`px-2.5 py-0.5 border font-semibold rounded-md ${typeColors[camp.type as keyof typeof typeColors] || 'bg-slate-100'}`}>
                          {typeLabels[camp.type as keyof typeof typeLabels] || camp.type}
                        </Badge>
                        <CardTitle className="text-lg font-bold text-slate-800">{camp.title}</CardTitle>
                        <CardDescription className="text-slate-500">Organized by {camp.organiser}</CardDescription>
                      </div>
                      {isRegistered(camp.id) && (
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Registered
                        </Badge>
                      )}
                    </CardHeader>

                    <CardContent className="px-6 pb-6 space-y-4">
                      <p className="text-slate-600 text-sm">{camp.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-sm text-slate-500 border-t pt-4 border-slate-50">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>
                            {new Date(camp.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                            {new Date(camp.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="truncate">{camp.location}</span>
                        </div>
                        {camp.contactPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span>{camp.contactPhone}</span>
                          </div>
                        )}
                        {camp.capacity && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span>Capacity: {camp.capacity} maximum</span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        {isRegistered(camp.id) ? (
                          <Button
                            variant="outline"
                            onClick={() => handleCancelRegistration(camp.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            Cancel Registration
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleRegister(camp.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                          >
                            Register Dependent
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 border rounded-2xl bg-slate-50/50 italic">
                No matching campaigns found.
              </div>
            )}
          </div>

          {/* Right Summary Sidebar (Registrations overview) */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-slate-200/50 shadow-sm rounded-2xl">
              <CardHeader className="p-5">
                <CardTitle className="text-lg font-bold text-slate-800">My Registrations ({myRegistrations.length})</CardTitle>
                <CardDescription>All drives you or your family registered for</CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                {myRegistrations.length > 0 ? (
                  <div className="space-y-3">
                    {myRegistrations.map((reg) => (
                      <div key={reg.id} className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col gap-1.5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400 uppercase">
                            REG ID: {reg.id.substring(0, 8)}
                          </span>
                          <span
                            className="text-xs text-red-600 hover:underline cursor-pointer font-semibold"
                            onClick={() => handleCancelRegistration(reg.campaignId)}
                          >
                            Cancel
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-800 line-clamp-1">
                          {reg.campaign?.title || "Health Drive"}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{reg.campaign ? new Date(reg.campaign.startDate).toLocaleDateString() : ""}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-400 text-sm italic py-4 text-center">
                    No active registrations. Register for a campaign on the left.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
