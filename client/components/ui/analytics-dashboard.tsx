"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface AnalyticsMetric {
  label: string
  value: number
  target: number
  unit: string
  trend: "up" | "down" | "stable"
  color: string
}

interface AnalyticsDashboardProps {
  title: string
  metrics: AnalyticsMetric[]
  className?: string
}

export function AnalyticsDashboard({ title, metrics, className }: AnalyticsDashboardProps) {
  return (
    <Card className={cn("bg-white/60 backdrop-blur-sm border-white/20", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {metrics.map((metric, index) => {
          const percentage = (metric.value / metric.target) * 100
          const isOnTarget = percentage >= 90

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-3 h-3 rounded-full", metric.color)}></div>
                  <span className="font-medium text-sm">{metric.label}</span>
                  <Badge
                    variant={isOnTarget ? "default" : "secondary"}
                    className={cn(
                      "text-xs",
                      isOnTarget ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800",
                    )}
                  >
                    {metric.trend === "up" ? "↗" : metric.trend === "down" ? "↘" : "→"} {metric.trend}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {metric.value}
                    <span className="text-sm font-normal text-gray-500">/{metric.target}</span>
                  </div>
                  <div className="text-xs text-gray-500">{metric.unit}</div>
                </div>
              </div>
              <Progress value={percentage} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span className="font-medium">{percentage.toFixed(1)}% of target</span>
                <span>{metric.target}</span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
