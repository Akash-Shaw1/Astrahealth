"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertTriangle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface MonitorData {
  id: string
  label: string
  value: number
  status: "normal" | "warning" | "critical"
  unit: string
  lastUpdated: Date
}

interface RealTimeMonitorProps {
  title: string
  data: MonitorData[]
  className?: string
}

export function RealTimeMonitor({ title, data, className }: RealTimeMonitorProps) {
  const [currentData, setCurrentData] = useState(data)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentData((prev) =>
        prev.map((item) => ({
          ...item,
          value: item.value + (Math.random() - 0.5) * 10,
          lastUpdated: new Date(),
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusConfig = (status: MonitorData["status"]) => {
    switch (status) {
      case "normal":
        return {
          color: "bg-green-500",
          badge: "bg-green-100 text-green-800",
          icon: CheckCircle,
        }
      case "warning":
        return {
          color: "bg-yellow-500",
          badge: "bg-yellow-100 text-yellow-800",
          icon: AlertTriangle,
        }
      case "critical":
        return {
          color: "bg-red-500",
          badge: "bg-red-100 text-red-800",
          icon: AlertTriangle,
        }
    }
  }

  return (
    <Card className={cn("bg-white/60 backdrop-blur-sm border-white/20", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentData.map((item) => {
          const config = getStatusConfig(item.status)
          const StatusIcon = config.icon

          return (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={cn("w-3 h-3 rounded-full animate-pulse", config.color)}></div>
                <div>
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-gray-500">Updated {item.lastUpdated.toLocaleTimeString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {item.value.toFixed(1)} <span className="text-sm font-normal">{item.unit}</span>
                  </div>
                </div>
                <Badge className={config.badge}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {item.status}
                </Badge>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
