import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfileCardProps {
  name: string
  location: string
  rating: number
  reviewCount: number
  distance: string
  status?: "emergency" | "available" | "busy"
  avatar?: string
  specialtyIndex?: React.ReactNode
  className?: string
}

export function ProfileCard({
  name,
  location,
  rating,
  reviewCount,
  distance,
  status,
  avatar,
  specialtyIndex,
  className,
}: ProfileCardProps) {
  const statusConfig = {
    emergency: { label: "Emergency", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
    available: { label: "Available", variant: "default" as const, color: "bg-green-100 text-green-800" },
    busy: { label: "Busy", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
  }

  return (
    <Card className={cn("bg-white/60 backdrop-blur-sm border-white/20", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Profile View
        </CardTitle>
        {status && <Badge className={statusConfig[status].color}>{statusConfig[status].label}</Badge>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          {avatar ? (
            <img src={avatar || "/placeholder.svg"} alt={name} className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="text-center">
          <h3 className="font-bold text-lg">{name}</h3>
          <p className="text-gray-600">{location}</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
            <span className="text-gray-500">({reviewCount})</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{distance}</p>
        </div>
        {specialtyIndex && <div className="flex items-center justify-center">{specialtyIndex}</div>}
      </CardContent>
    </Card>
  )
}
