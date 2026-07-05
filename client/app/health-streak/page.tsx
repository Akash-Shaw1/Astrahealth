"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
import { useDataSource } from "@/hooks/use-data-source"
import { apiAdapter } from "@/lib/api-adapter"
import {
  TrendingUp,
  Heart,
  Activity,
  Droplets,
  Thermometer,
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
  Scale,
} from "lucide-react"
import {
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"

export default function VitalsManualLogger() {
  const { dataMode } = useDataSource()
  const [vitalsList, setVitalsList] = useState<any[]>([])
  const [trends, setTrends] = useState<any[]>([])
  const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState("self")
  const [familyMembers, setFamilyMembers] = useState<any[]>([])

  // Form State
  const [form, setForm] = useState({
    heartRate: "",
    systolic: "",
    diastolic: "",
    temperature: "",
    spO2: "",
    bloodSugar: "",
    weight: "",
    notes: "",
    measuredAt: new Date().toISOString().substring(0, 16),
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch Family Members to populate dropdown
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
          // Dummy data
          const list = [
            { id: "self", name: "Arindam Chatterjee", relationship: "Self" },
            { id: "spouse", name: "Madhumita Chatterjee", relationship: "Spouse" },
            { id: "child", name: "Riya Chatterjee", relationship: "Child" },
          ]
          setFamilyMembers(list)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchFamily()
  }, [dataMode])

  // Load vitals history
  const loadVitalsHistory = async () => {
    try {
      if (dataMode === "live") {
        const list = await apiAdapter.getVitals(selectedFamilyMemberId)
        setVitalsList(list)

        const chartData = await apiAdapter.getVitalsTrends(selectedFamilyMemberId)
        setTrends(chartData)
      } else {
        // Dummy data pools
        const dummyLogs = [
          { id: "log-1", heartRate: 72, systolic: 120, diastolic: 80, temperature: 36.8, spO2: 98, weight: 74.5, bloodSugar: 98, measuredAt: new Date(Date.now() - 3600000 * 2).toISOString(), notes: "Feeling good" },
          { id: "log-2", heartRate: 75, systolic: 122, diastolic: 81, temperature: 37.0, spO2: 99, weight: 74.6, bloodSugar: 104, measuredAt: new Date(Date.now() - 3600000 * 24).toISOString(), notes: "Post-walk vitals" },
          { id: "log-3", heartRate: 68, systolic: 118, diastolic: 79, temperature: 36.5, spO2: 97, weight: 74.3, bloodSugar: 92, measuredAt: new Date(Date.now() - 3600000 * 48).toISOString(), notes: "Morning reading" },
        ]
        setVitalsList(dummyLogs)

        const dummyTrends = [
          { date: "Jul 2", heartRate: 68, systolic: 118, diastolic: 79, bloodPressure: "118/79", spO2: 97, weight: 74.3, bloodSugar: 92 },
          { date: "Jul 3", heartRate: 75, systolic: 122, diastolic: 81, bloodPressure: "122/81", spO2: 99, weight: 74.6, bloodSugar: 104 },
          { date: "Jul 4", heartRate: 72, systolic: 120, diastolic: 80, bloodPressure: "120/80", spO2: 98, weight: 74.5, bloodSugar: 98 },
        ]
        setTrends(dummyTrends)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadVitalsHistory()
  }, [selectedFamilyMemberId, dataMode])

  // ✨ Demo Fill Button Handler
  const handleFillDemoData = () => {
    setForm({
      heartRate: String(Math.floor(Math.random() * 20) + 65), // 65-85
      systolic: String(Math.floor(Math.random() * 15) + 115), // 115-130
      diastolic: String(Math.floor(Math.random() * 10) + 75), // 75-85
      temperature: String((Math.random() * 0.8 + 36.4).toFixed(1)), // 36.4 - 37.2
      spO2: String(Math.floor(Math.random() * 3) + 97), // 97-99
      bloodSugar: String(Math.floor(Math.random() * 30) + 85), // 85-115
      weight: "74.5",
      notes: "Demo vital logs",
      measuredAt: new Date().toISOString().substring(0, 16),
    })
    toast({
      title: "Demo Data Filled",
      description: "Sample healthy vitals generated.",
    })
  }

  const handleLogVitals = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        familyMemberId: selectedFamilyMemberId,
        heartRate: form.heartRate ? Number(form.heartRate) : null,
        systolic: form.systolic ? Number(form.systolic) : null,
        diastolic: form.diastolic ? Number(form.diastolic) : null,
        temperature: form.temperature ? Number(form.temperature) : null,
        spO2: form.spO2 ? Number(form.spO2) : null,
        bloodSugar: form.bloodSugar ? Number(form.bloodSugar) : null,
        weight: form.weight ? Number(form.weight) : null,
        notes: form.notes || null,
        measuredAt: new Date(form.measuredAt).toISOString(),
      }

      if (dataMode === "live") {
        await apiAdapter.logVitals(payload)
      } else {
        const dummyNew = {
          id: `log-${Date.now()}`,
          ...payload,
        }
        setVitalsList((prev) => [dummyNew, ...prev])
      }

      toast({
        title: "Vitals Logged Successfully",
        description: "Your health metrics have been saved.",
      })

      // Reset Form (except date/weight)
      setForm((prev) => ({
        ...prev,
        heartRate: "",
        systolic: "",
        diastolic: "",
        temperature: "",
        spO2: "",
        bloodSugar: "",
        notes: "",
      }))

      loadVitalsHistory()
    } catch (err) {
      console.error(err)
      toast({
        title: "Logging Failed",
        description: "An error occurred while saving your vitals.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteLog = async (id: string) => {
    if (confirm("Delete this vital entry?")) {
      try {
        if (dataMode === "live") {
          await apiAdapter.deleteVitals(id)
        } else {
          setVitalsList((prev) => prev.filter((item) => item.id !== id))
        }
        toast({ title: "Entry Deleted" })
        loadVitalsHistory()
      } catch (err) {
        console.error(err)
      }
    }
  }

  // Get current readings for quick indicators
  const latest = vitalsList[0] || {}

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Vitals Log & Trends</h1>
            <p className="text-slate-500 mt-1">Manual vitals tracking and health charting for family dependents.</p>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="familySelector" className="font-bold text-slate-700">Member:</Label>
            <Select value={selectedFamilyMemberId} onValueChange={setSelectedFamilyMemberId}>
              <SelectTrigger id="familySelector" className="w-56 bg-white shadow-sm rounded-xl">
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

        {/* Quick Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-red-50/50 border-red-100 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-red-600/80 uppercase">Heart Rate</span>
                <h3 className="text-2xl font-black text-red-950 mt-1">
                  {latest.heartRate ? `${latest.heartRate} bpm` : "--"}
                </h3>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </CardContent>
          </Card>

          <Card className="bg-blue-50/50 border-blue-100 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600/80 uppercase">Blood Pressure</span>
                <h3 className="text-2xl font-black text-blue-950 mt-1">
                  {latest.systolic && latest.diastolic ? `${latest.systolic}/${latest.diastolic}` : "--"}
                </h3>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </CardContent>
          </Card>

          <Card className="bg-sky-50/50 border-sky-100 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-sky-600/80 uppercase">SPO2 %</span>
                <h3 className="text-2xl font-black text-sky-950 mt-1">
                  {latest.spO2 ? `${latest.spO2} %` : "--"}
                </h3>
              </div>
              <Droplets className="w-8 h-8 text-sky-500" />
            </CardContent>
          </Card>

          <Card className="bg-amber-50/50 border-amber-100 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-600/80 uppercase">Temperature</span>
                <h3 className="text-2xl font-black text-amber-950 mt-1">
                  {latest.temperature ? `${latest.temperature} °C` : "--"}
                </h3>
              </div>
              <Thermometer className="w-8 h-8 text-amber-500" />
            </CardContent>
          </Card>

          <Card className="bg-indigo-50/50 border-indigo-100 shadow-sm rounded-2xl col-span-2 md:col-span-1">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-600/80 uppercase">Weight</span>
                <h3 className="text-2xl font-black text-indigo-950 mt-1">
                  {latest.weight ? `${latest.weight} kg` : "--"}
                </h3>
              </div>
              <Scale className="w-8 h-8 text-indigo-500" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vitals Form */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-md rounded-2xl lg:col-span-1 flex flex-col justify-between">
            <CardHeader className="border-b bg-slate-50/30 flex flex-row items-center justify-between p-5">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800">Log Vitals</CardTitle>
                <CardDescription>Submit current diagnostic readings</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFillDemoData}
                className="bg-white hover:bg-slate-50 text-indigo-700 border-indigo-200"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Fill Demo
              </Button>
            </CardHeader>
            <form onSubmit={handleLogVitals}>
              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
                    <Input
                      id="heartRate"
                      type="number"
                      placeholder="e.g. 72"
                      value={form.heartRate}
                      onChange={(e) => setForm((f) => ({ ...f, heartRate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="temp">Temp (°C)</Label>
                    <Input
                      id="temp"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 36.8"
                      value={form.temperature}
                      onChange={(e) => setForm((f) => ({ ...f, temperature: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="systolic">BP (Systolic)</Label>
                    <Input
                      id="systolic"
                      type="number"
                      placeholder="e.g. 120"
                      value={form.systolic}
                      onChange={(e) => setForm((f) => ({ ...f, systolic: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="diastolic">BP (Diastolic)</Label>
                    <Input
                      id="diastolic"
                      type="number"
                      placeholder="e.g. 80"
                      value={form.diastolic}
                      onChange={(e) => setForm((f) => ({ ...f, diastolic: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1 col-span-1">
                    <Label htmlFor="spO2">SpO2 %</Label>
                    <Input
                      id="spO2"
                      type="number"
                      placeholder="98"
                      value={form.spO2}
                      onChange={(e) => setForm((f) => ({ ...f, spO2: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1 col-span-1">
                    <Label htmlFor="sugar">Sugar</Label>
                    <Input
                      id="sugar"
                      type="number"
                      placeholder="mg/dL"
                      value={form.bloodSugar}
                      onChange={(e) => setForm((f) => ({ ...f, bloodSugar: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1 col-span-1">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="74.5"
                      value={form.weight}
                      onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="notes">Notes / Observations</Label>
                  <Input
                    id="notes"
                    placeholder="e.g. Resting vitals"
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="measuredAt">Date & Time</Label>
                  <Input
                    id="measuredAt"
                    type="datetime-local"
                    value={form.measuredAt}
                    onChange={(e) => setForm((f) => ({ ...f, measuredAt: e.target.value }))}
                  />
                </div>
              </CardContent>
              <div className="p-5 border-t bg-slate-50/20">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-1" /> {isSubmitting ? "Logging Vitals..." : "Log Vitals Entry"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Vitals Trends Charts */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-md rounded-2xl">
              <CardHeader className="p-5 border-b bg-slate-50/10">
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Vitals Chart (Last 30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {trends.length > 0 ? (
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="heartRate"
                          name="Heart Rate (BPM)"
                          stroke="#EF4444"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="systolic"
                          name="Systolic BP"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="spO2"
                          name="SpO2 %"
                          stroke="#0EA5E9"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-72 w-full flex items-center justify-center text-slate-400 italic">
                    Log at least one vitals entry to generate trend charts.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Historical Entries */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-md rounded-2xl">
              <CardHeader className="p-5 border-b bg-slate-50/10">
                <CardTitle className="text-lg font-bold text-slate-800">Recent Readings Log</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {vitalsList.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                      <thead className="text-xs text-slate-700 uppercase bg-slate-50/80 border-b">
                        <tr>
                          <th className="px-6 py-3.5">Measured At</th>
                          <th className="px-6 py-3.5">HR (BPM)</th>
                          <th className="px-6 py-3.5">Blood Pressure</th>
                          <th className="px-6 py-3.5">SpO2 %</th>
                          <th className="px-6 py-3.5">Temp (°C)</th>
                          <th className="px-6 py-3.5">Weight (kg)</th>
                          <th className="px-6 py-3.5">Notes</th>
                          <th className="px-6 py-3.5 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {vitalsList.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50/50 bg-white/40">
                            <td className="px-6 py-3 font-semibold text-slate-700 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                {new Date(log.measuredAt).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-3">{log.heartRate || "--"}</td>
                            <td className="px-6 py-3">
                              {log.systolic && log.diastolic ? `${log.systolic}/${log.diastolic}` : "--"}
                            </td>
                            <td className="px-6 py-3">{log.spO2 || "--"} %</td>
                            <td className="px-6 py-3">{log.temperature || "--"} °C</td>
                            <td className="px-6 py-3">{log.weight || "--"} kg</td>
                            <td className="px-6 py-3 italic truncate max-w-xs">{log.notes || "None"}</td>
                            <td className="px-6 py-3 text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
                                onClick={() => handleDeleteLog(log.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 italic">No vitals entries logged yet.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
