import { cn } from "@/lib/utils"

interface ActivityItemProps {
  patient: string
  action: string
  time: string
  type: "consultation" | "appointment" | "results" | "emergency"
  className?: string
}

const typeConfig = {
  consultation: { icon: "👨‍⚕️", bgColor: "bg-blue-100" },
  appointment: { icon: "📅", bgColor: "bg-green-100" },
  results: { icon: "📋", bgColor: "bg-purple-100" },
  emergency: { icon: "🚨", bgColor: "bg-red-100" },
}

export function ActivityItem({ patient, action, time, type, className }: ActivityItemProps) {
  const config = typeConfig[type]

  return (
    <div className={cn("flex items-center gap-4 p-3 hover:bg-gray-50/50 rounded-lg transition-colors", className)}>
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", config.bgColor)}>{config.icon}</div>
      <div className="flex-1">
        <p className="font-medium text-sm">{patient}</p>
        <p className="text-xs text-gray-600">{action}</p>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  )
}
