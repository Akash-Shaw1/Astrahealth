"use client"

import { useState } from "react"
import { ChevronDown, ArrowUpRight, TrendingUp, Calendar, Heart, Pill, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import DashboardLayout from "@/components/dashboard-layout"
import { MetricCard } from "@/components/ui/metric-card"
import { EducationModuleCard } from "@/components/ui/education-module-card"
import { ActivityItem } from "@/components/ui/activity-item"
import { ProfileCard } from "@/components/ui/profile-card"
import { AdvancedChart } from "@/components/ui/advanced-chart"
import { AnalyticsDashboard, type AnalyticsMetric } from "@/components/ui/analytics-dashboard"
import { RealTimeMonitor, type MonitorData } from "@/components/ui/real-time-monitor"
import Link from "next/link"

const personalHealthMetrics = [
  { name: "Jan", steps: 8200, heartRate: 72, stepsScaled: 82, weight: 68.5 },
  { name: "Feb", steps: 9300, heartRate: 70, stepsScaled: 93, weight: 68.2 },
  { name: "Mar", steps: 7800, heartRate: 74, stepsScaled: 78, weight: 68.0 },
  { name: "Apr", steps: 10500, heartRate: 69, stepsScaled: 105, weight: 67.8 },
  { name: "May", steps: 9200, heartRate: 71, stepsScaled: 92, weight: 67.5 },
  { name: "Jun", steps: 11800, heartRate: 68, stepsScaled: 118, weight: 67.2 },
]

const educationModules = [
  {
    id: 1,
    title: "Managing Monsoon Health",
    description: "Stay healthy during Kolkata's monsoon season",
    duration: "8 min",
    completion: 65,
    type: "Video",
    badges: ["Seasonal", "Essential"],
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nXFmFEEZW2kvKfbEHpOpVF9h94Ssax.png",
  },
  {
    id: 2,
    title: "Heart-Healthy Bengali Diet",
    description: "Nutritious Bengali recipes for cardiovascular health",
    duration: "12 min",
    completion: 30,
    type: "Article",
    badges: ["Local", "Wellness"],
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nXFmFEEZW2kvKfbEHpOpVF9h94Ssax.png",
  },
]

const recentActivity: Array<{
  id: number
  patient: string
  action: string
  time: string
  type: "consultation" | "appointment" | "results" | "emergency"
}> = [
  {
    id: 1,
    patient: "Dr. Priya Sharma",
    action: "Consultation completed at AMRI Hospital",
    time: "2 days ago",
    type: "consultation",
  },
  {
    id: 2,
    patient: "Apollo Pharmacy, Salt Lake",
    action: "Prescription filled",
    time: "1 week ago",
    type: "consultation",
  },
  {
    id: 3,
    patient: "Peerless Hospital Lab",
    action: "Blood work results available",
    time: "2 weeks ago",
    type: "results",
  },
]

const healthMetrics: AnalyticsMetric[] = [
  { label: "Health Score", value: 85, target: 90, unit: "points", trend: "up", color: "bg-green-500" },
  { label: "Exercise Goal", value: 75, target: 100, unit: "percent", trend: "stable", color: "bg-purple-500" },
  { label: "Sleep Quality", value: 78, target: 85, unit: "percent", trend: "up", color: "bg-indigo-500" },
]

const upcomingReminders: MonitorData[] = [
  { id: "1", label: "Next Appointment", value: 3, status: "normal", unit: "days", lastUpdated: new Date() },
  { id: "2", label: "Medication Refill", value: 7, status: "warning", unit: "days", lastUpdated: new Date() },
  { id: "3", label: "Health Checkup", value: 45, status: "normal", unit: "days", lastUpdated: new Date() },
  { id: "4", label: "Lab Test Due", value: 14, status: "critical", unit: "days", lastUpdated: new Date() },
]

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 6 months")

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Health Dashboard</h1>
              <p className="text-gray-600">
                Track your health journey in Kolkata • Manage appointments and wellness goals
              </p>
            </div>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white/60 backdrop-blur-sm">
                  {selectedPeriod} <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedPeriod("Last 30 days")}>Last 30 days</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPeriod("Last 6 months")}>Last 6 months</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPeriod("Last year")}>Last year</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
            <Button
            variant="outline"
            className="bg-white/60 backdrop-blur-sm"
            onClick={() => window.open("http://localhost:8502/", "_blank")}
            >
              Visit Site
            </Button>

          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Next Appointment"
              value="3 days"
              subtitle="Dr. Priya Sharma, AMRI"
              icon={<Calendar className="w-6 h-6 text-blue-600" />}
            />
            <MetricCard
              title="Active Prescriptions"
              value="4"
              trend={{ value: "+1", direction: "up", icon: <TrendingUp className="w-4 h-4" /> }}
              subtitle="medications"
              icon={<Pill className="w-6 h-6 text-green-600" />}
            />
            <MetricCard
              title="Health Score"
              value="85"
              trend={{ value: "+5", direction: "up", icon: <TrendingUp className="w-4 h-4" /> }}
              subtitle="out of 100"
              icon={<Heart className="w-6 h-6 text-red-600" />}
            />
            <MetricCard
              title="Pending Results"
              value="2"
              subtitle="lab reports"
              icon={<FileText className="w-6 h-6 text-purple-600" />}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Tracking Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            <AdvancedChart
              title="Daily Activity & Heart Rate"
              data={personalHealthMetrics}
              type="line"
              dataKeys={["stepsScaled", "heartRate"]}
              colors={["#3B82F6", "#EF4444"]}
              showTrend={true}
              showComparison={true}
              customLabels={{
                stepsScaled: "Steps (×100)",
                heartRate: "Heart Rate (BPM)",
              }}
            />
          </div>

          {/* Health Metrics Sidebar */}
          <AnalyticsDashboard title="Health Metrics" metrics={healthMetrics} />
        </div>

        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Education Modules */}
          <Card className="lg:col-span-2 bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Recommended for You</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {educationModules.map((module) => (
                <EducationModuleCard
                  key={module.id}
                  title={module.title}
                  description={module.description}
                  duration={module.duration}
                  completion={module.completion}
                  type={module.type}
                  badges={module.badges}
                  image={module.image}
                />
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Reminders */}
          <RealTimeMonitor title="Upcoming Reminders" data={upcomingReminders} />
        </div>

        {/* Bottom Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProfileCard
            name="Dr. Priya Sharma"
            location="AMRI Hospital, Salt Lake"
            rating={4.9}
            reviewCount={245}
            distance="2.1 km away"
            status="available"
            specialtyIndex={
              <div className="w-16 h-16 border-4 border-green-500 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              </div>
            }
          />

          {/* Recent Activity */}
          <Card className="lg:col-span-2 bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
              <Button variant="outline" size="sm" className="bg-transparent">
                View All <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    patient={activity.patient}
                    action={activity.action}
                    time={activity.time}
                    type={activity.type}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
            <p className="text-blue-100 mb-6">Access your healthcare services in Kolkata</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/appointments">
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0">Book Appointment</Button>
              </Link>
              <Link href="/medicine">
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0">View Prescriptions</Button>
              </Link>
              <Link href="/health-bot">
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0">Chat with Specialised Bot</Button>
              </Link>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
