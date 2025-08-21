import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface EducationModuleCardProps {
  title: string
  description: string
  duration: string
  completion: number
  type: string
  badges: string[]
  image?: string
  className?: string
}

export function EducationModuleCard({
  title,
  description,
  duration,
  completion,
  type,
  badges,
  image,
  className,
}: EducationModuleCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors cursor-pointer",
        className,
      )}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-white font-bold text-lg">{type.charAt(0)}</div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {badges.map((badge) => (
            <Badge key={badge} variant="secondary" className="text-xs bg-green-100 text-green-800">
              ✓ {badge}
            </Badge>
          ))}
        </div>
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <p className="text-xs text-gray-600 mb-2">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{duration}</span>
            <span>{completion}% complete</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{type}</span>
            <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${completion}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
