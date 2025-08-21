"use client"

import { useState } from "react"
import { ChevronDown, Star, ArrowUpRight, TrendingUp, Users, Calendar, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import DashboardLayout from "@/components/dashboard-layout"
import { MetricCard } from "@/components/ui/metric-card"
import { DepartmentCard } from "@/components/ui/department-card"
import { EducationModuleCard } from "@/components/ui/education-module-card"
import { ActivityItem } from "@/components/ui/activity-item"
import { ProfileCard } from "@/components/ui/profile-card"
import { AdvancedChart } from "@/components/ui/advanced-chart"
import { AnalyticsDashboard } from "@/components/ui/analytics-dashboard"
import { RealTimeMonitor } from "@/components/ui/real-time-monitor"

const healthMetrics = [
  { name: "Jan", patients: 240, consultations: 180, satisfaction: 4.2 },
  { name: "Feb", patients: 300, consultations: 220, satisfaction: 4.4 },
  { name: "Mar", patients: 280, consultations: 200, satisfaction: 4.1 },
  { name: "Apr", patients: 350, consultations: 280, satisfaction: 4.6 },
  { name: "May", patients: 320, consultations: 250, satisfaction: 4.5 },
  { name: "Jun", patients: 380, consultations: 300, satisfaction: 4.8 },
]

const departmentData = [
  {
    id: 1,
    name: "Cardiology",
    rating: 4.8,
    icon: "❤️",
    strengths: "excellent surgeons, advanced equipment, quick response",
    issues: "expensive, long wait times",
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Neurology",
    rating: 4.7,
    icon: "🧠",
    strengths: "experienced doctors, good facilities",
    issues: "limited slots",
    color: "bg-purple-500",
  },
  {
    id: 3,
    name: "Emergency",
    rating: 4.9,
    icon: "🚨",
    strengths: "24/7 availability, rapid response",
    issues: "high volume, stress",
    color: "bg-red-500",
  },
]

const educationModules = [
  {
    id: 1,
    title: "Spotting Health Misinformation",
    description: "Learn to identify and combat health-related fake news",
    duration: "12 min",
    completion: 45,
    type: "Video",
    badges: ["Fact-Checked", "Multi-language"],
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nXFmFEEZW2kvKfbEHpOpVF9h94Ssax.png",
  },
  {
    id: 2,
    title: "Food Safety Guidelines",
    description: "Safe food handling and preparation practices",
    duration: "10 min",
    completion: 70,
    type: "Infographic",
    badges: ["Local", "CDC"],
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nXFmFEEZW2kvKfbEHpOpVF9h94Ssax.png",
  },
]

const recentActivity = [
  {
    id: 1,
    patient: "Sarah Johnson",
    action: "Completed consultation",
    time: "2 hours ago",
    type: "consultation",
  },
  {
    id: 2,
    patient: "Michael Chen",
    action: "Scheduled follow-up",
    time: "4 hours ago",
    type: "appointment",
  },
  {
    id: 3,
    patient: "Emma Davis",
    action: "Lab results reviewed",
    time: "6 hours ago",
    type: "results",
  },
]

const performanceMetrics = [
  { label: "Patient Satisfaction", value: 4.8, target: 5.0, unit: "stars", trend: "up", color: "bg-green-500" },
  { label: "Response Time", value: 12, target: 15, unit: "minutes", trend: "down", color: "bg-blue-500" },
  { label: "Bed Occupancy", value: 85, target: 90, unit: "percent", trend: "stable", color: "bg-yellow-500" },
  { label: "Staff Efficiency", value: 92, target: 95, unit: "percent", trend: "up", color: "bg-purple-500" },
]

const realTimeData = [
  { id: "1", label: "Emergency Queue", value: 8, status: "warning", unit: "patients", lastUpdated: new Date() },
  { id: "2", label: "ICU Capacity", value: 75, status: "normal", unit: "percent", lastUpdated: new Date() },
  { id: "3", label: "Wait Time", value: 25, status: "critical", unit: "minutes", lastUpdated: new Date() },
  { id: "4", label: "Staff on Duty", value: 45, status: "normal", unit: "people", lastUpdated: new Date() },
]

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 6 months")

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Healthcare Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Monitor patient care, track health metrics, and manage medical operations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white/60 backdrop-blur-sm text-sm">
                    {selectedPeriod} <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedPeriod("Last 30 days")}>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedPeriod("Last 6 months")}>Last 6 months</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedPeriod("Last year")}>Last year</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <MetricCard
              title="Total Patients"
              value="2,847"
              trend={{ value: "+12%", direction: "up", icon: <TrendingUp className="w-4 h-4" /> }}
              subtitle="from last month"
              icon={<Users className="w-6 h-6 text-blue-600" />}
            />
            <MetricCard
              title="Consultations"
              value="1,630"
              trend={{ value: "+8%", direction: "up", icon: <TrendingUp className="w-4 h-4" /> }}
              subtitle="from last month"
              icon={<Activity className="w-6 h-6 text-green-600" />}
            />
            <MetricCard
              title="Appointments"
              value="156"
              subtitle="Today's schedule"
              icon={<Calendar className="w-6 h-6 text-purple-600" />}
            />
            <MetricCard
              title="Satisfaction"
              value="4.8"
              trend={{ value: "+0.2", direction: "up", icon: <TrendingUp className="w-4 h-4" /> }}
              subtitle="Average rating"
              icon={<Star className="w-6 h-6 text-yellow-600 fill-current" />}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <AdvancedChart
            title="Patient Analytics"
            data={healthMetrics}
            type="line"
            dataKeys={["patients", "consultations"]}
            colors={["#3B82F6", "#10B981"]}
            showTrend={true}
            showComparison={true}
            className="lg:col-span-2"
          />
          <AnalyticsDashboard title="Performance Metrics" metrics={performanceMetrics} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <Card className="lg:col-span-2 bg-slate-800 text-white border-0">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-semibold">Department Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {departmentData.map((dept) => (
                <DepartmentCard
                  key={dept.id}
                  name={dept.name}
                  rating={dept.rating}
                  icon={dept.icon}
                  strengths={dept.strengths}
                  issues={dept.issues}
                  color={dept.color}
                />
              ))}
            </CardContent>
          </Card>

          <RealTimeMonitor title="Real-Time Monitor" data={realTimeData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <ProfileCard
            name="Government General Hospital"
            location="Park Town, Chennai"
            rating={3.9}
            reviewCount={892}
            distance="3.8 km away"
            status="emergency"
            specialtyIndex={
              <div className="w-16 h-16 border-4 border-red-500 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-red-500 rounded-full"></div>
              </div>
            }
            className="lg:order-last"
          />

          <Card className="lg:col-span-2 bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Health Education Hub</CardTitle>
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <Card className="lg:col-span-2 bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <CardTitle className="text-lg sm:text-xl font-semibold">Recent Activity</CardTitle>
              <Button variant="outline" size="sm" className="text-xs bg-transparent self-start sm:self-auto">
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

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <CardContent className="pt-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Quick Actions</h3>
              <p className="text-blue-100 text-sm mb-6">Access frequently used features</p>
              <div className="space-y-3">
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 text-sm">
                  Schedule Appointment
                </Button>
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 text-sm">
                  View Patient Records
                </Button>
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 text-sm">
                  Emergency Protocol
                </Button>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
