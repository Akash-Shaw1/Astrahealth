import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: string
    direction: "up" | "down" | "neutral"
    icon?: React.ReactNode
  }
  className?: string
}

export function MetricCard({ title, value, subtitle, icon, trend, className }: MetricCardProps) {
  return (
    <Card
      className={cn(
        "bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-200",
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-1 text-sm",
                  trend.direction === "up"
                    ? "text-green-600"
                    : trend.direction === "down"
                      ? "text-red-600"
                      : "text-gray-600",
                )}
              >
                {trend.icon}
                {trend.value}
              </div>
            )}
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          {icon && <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
