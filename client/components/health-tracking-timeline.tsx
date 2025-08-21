"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Moon, Droplets, Activity, TrendingUp, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface HealthDay {
  date: string
  isHealthy: boolean
  streak: number
  metrics: {
    sleep: number
    hrv: number
    oxygen: number
    mood: number
    hydration: number
    activity: number
  }
}

const healthData: HealthDay[] = [
  {
    date: "2024-12-15",
    isHealthy: true,
    streak: 5,
    metrics: { sleep: 8.2, hrv: 45, oxygen: 98, mood: 8, hydration: 2.1, activity: 85 },
  },
  {
    date: "2024-12-16",
    isHealthy: true,
    streak: 6,
    metrics: { sleep: 7.8, hrv: 42, oxygen: 97, mood: 7, hydration: 2.3, activity: 92 },
  },
  {
    date: "2024-12-17",
    isHealthy: false,
    streak: 0,
    metrics: { sleep: 5.2, hrv: 32, oxygen: 95, mood: 5, hydration: 1.2, activity: 45 },
  },
  {
    date: "2024-12-18",
    isHealthy: true,
    streak: 1,
    metrics: { sleep: 8.5, hrv: 48, oxygen: 99, mood: 9, hydration: 2.5, activity: 88 },
  },
  {
    date: "2024-12-19",
    isHealthy: true,
    streak: 2,
    metrics: { sleep: 8.0, hrv: 46, oxygen: 98, mood: 8, hydration: 2.2, activity: 90 },
  },
  {
    date: "2024-12-20",
    isHealthy: true,
    streak: 3,
    metrics: { sleep: 7.9, hrv: 44, oxygen: 97, mood: 8, hydration: 2.4, activity: 87 },
  },
  {
    date: "2024-12-21",
    isHealthy: true,
    streak: 4,
    metrics: { sleep: 8.1, hrv: 47, oxygen: 98, mood: 9, hydration: 2.3, activity: 91 },
  },
]

export default function HealthTrackingTimeline() {
  const [selectedDay, setSelectedDay] = useState<HealthDay | null>(null)
  const currentStreak = Math.max(...healthData.map((d) => d.streak))

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en", { month: "short" }),
    }
  }

  const MetricCard = ({
    icon: Icon,
    label,
    value,
    unit,
    progress,
  }: {
    icon: any
    label: string
    value: number
    unit: string
    progress: number
  }) => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-teal-400" />
        <span className="text-sm text-gray-300">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-sm text-gray-400">{unit}</span>
      </div>
      <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-teal-400 to-teal-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Health Streak Tracker</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Track your wellness journey day by day</p>
        </div>
        {currentStreak > 0 && (
          <div className="flex items-center gap-2">
            <div className="animate-pulse">
              <TrendingUp className="w-5 h-5 text-teal-500" />
            </div>
            <Badge className="bg-teal-100 text-teal-800 font-semibold">{currentStreak} day streak!</Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/* Timeline */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {healthData.map((day, index) => {
            const { day: dayNum, month } = formatDate(day.date)
            return (
              <div key={day.date} className="flex flex-col items-center gap-2 min-w-[80px]">
                <div className="text-xs text-gray-500 text-center">
                  <div>{month}</div>
                  <div className="font-medium">{dayNum}</div>
                </div>

                <button
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "relative w-16 h-16 rounded-full border-4 transition-all duration-300 hover:scale-110",
                    day.isHealthy
                      ? "border-teal-400 bg-teal-50 shadow-lg shadow-teal-200/50 animate-pulse"
                      : "border-gray-300 bg-gray-50",
                  )}
                >
                  {day.isHealthy && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400/20 to-teal-500/20 animate-pulse" />
                  )}
                  <div
                    className={cn(
                      "absolute inset-2 rounded-full flex items-center justify-center",
                      day.isHealthy ? "bg-teal-400 text-white" : "bg-gray-200 text-gray-500",
                    )}
                  >
                    <Heart className="w-4 h-4" />
                  </div>

                  {day.streak > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-400 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {day.streak}
                    </div>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* Streak Achievement */}
        {currentStreak >= 3 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200">
            <div className="flex items-center gap-3">
              <div className="animate-bounce">
                <div className="w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-teal-800">Wellness Milestone Unlocked!</h4>
                <p className="text-sm text-teal-600">
                  You've maintained {currentStreak} consecutive healthy days. Keep it up!
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {formatDate(selectedDay.date).month} {formatDate(selectedDay.date).day}
                </h3>
                <p className="text-gray-400">Wellness Overview</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDay(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                icon={Moon}
                label="Sleep"
                value={selectedDay.metrics.sleep}
                unit="hrs"
                progress={(selectedDay.metrics.sleep / 10) * 100}
              />
              <MetricCard
                icon={Heart}
                label="HRV"
                value={selectedDay.metrics.hrv}
                unit="ms"
                progress={(selectedDay.metrics.hrv / 60) * 100}
              />
              <MetricCard
                icon={Activity}
                label="O2 Sat"
                value={selectedDay.metrics.oxygen}
                unit="%"
                progress={selectedDay.metrics.oxygen}
              />
              <MetricCard
                icon={Droplets}
                label="Hydration"
                value={selectedDay.metrics.hydration}
                unit="L"
                progress={(selectedDay.metrics.hydration / 3) * 100}
              />
            </div>

            <div className="mt-6 p-4 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Overall Wellness Score</span>
                <span className="text-2xl font-bold text-white">{selectedDay.metrics.mood}/10</span>
              </div>
              <div className="mt-2 w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-teal-400 to-emerald-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(selectedDay.metrics.mood / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
