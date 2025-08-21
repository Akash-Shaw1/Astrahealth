"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SearchInputProps {
  placeholder?: string
  shortcut?: string
  className?: string
  value?: string
  onChange?: (value: string) => void
}

export function SearchInput({
  placeholder = "Search...",
  shortcut = "⌘K",
  className,
  value,
  onChange,
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="pl-12 pr-16 bg-slate-50/80 border-slate-200/50 focus:bg-white focus:border-blue-300 transition-all duration-200"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600 border-slate-200">
          {shortcut}
        </Badge>
      </div>
    </div>
  )
}
