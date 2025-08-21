import { cn } from "@/lib/utils"

interface DepartmentCardProps {
  name: string
  rating: number
  icon: string
  strengths: string
  issues: string
  color: string
  className?: string
}

export function DepartmentCard({ name, rating, icon, strengths, issues, color, className }: DepartmentCardProps) {
  return (
    <div className={cn("bg-slate-700/50 rounded-lg p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{icon}</div>
          <h3 className="font-semibold text-lg text-white">{name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-bold">{rating}</span>
        </div>
      </div>
      <div className="w-full bg-slate-600 rounded-full h-2 mb-3">
        <div className={cn("h-2 rounded-full", color)} style={{ width: `${rating * 20}%` }}></div>
      </div>
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-green-400 font-medium">Strengths: </span>
          <span className="text-gray-300">{strengths}</span>
        </div>
        <div>
          <span className="text-red-400 font-medium">Issues: </span>
          <span className="text-gray-300">{issues}</span>
        </div>
      </div>
    </div>
  )
}
