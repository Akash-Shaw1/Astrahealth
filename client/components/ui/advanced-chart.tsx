"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, TrendingUp, TrendingDown, Minus } from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { cn } from "@/lib/utils"

export interface ChartData {
  name: string
  value?: number
  [key: string]: string | number | undefined
}

interface TooltipPayload {
  color: string
  dataKey: string
  value: number | string
  payload: ChartData
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

interface AdvancedChartProps {
  title: string
  data: ChartData[]
  type: "line" | "area" | "bar" | "pie"
  dataKeys: string[]
  colors: string[]
  showTrend?: boolean
  showComparison?: boolean
  className?: string
  customLabels?: Record<string, string>
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

export function AdvancedChart({
  title,
  data,
  type,
  dataKeys,
  colors = COLORS,
  showTrend = true,
  showComparison = false,
  className,
}: AdvancedChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days")
  const [chartType, setChartType] = useState(type)

  // Calculate trend
  const calculateTrend = () => {
    if (data.length < 2) return { value: 0, direction: "neutral" as const }
    const current = data[data.length - 1].value ?? 0
    const previous = data[data.length - 2].value ?? 0
    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change).toFixed(1),
      direction: change > 0 ? ("up" as const) : change < 0 ? ("down" as const) : ("neutral" as const),
    }
  }

  const trend = calculateTrend()

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-slate-800 mb-2">{label}</p>
          {payload.map((entry: TooltipPayload, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-slate-600">{entry.dataKey}:</span>
              <span className="font-semibold text-slate-800">{entry.value}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    }

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} />
            <Tooltip content={<CustomTooltip />} />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: colors[index % colors.length] }}
              />
            ))}
          </LineChart>
        )

      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} />
            <Tooltip content={<CustomTooltip />} />
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        )

      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} />
            <Tooltip content={<CustomTooltip />} />
            {dataKeys.map((key, index) => (
              <Bar key={key} dataKey={key} fill={colors[index % colors.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        )

      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        )

      default:
        return null
    }
  }

  return (
    <Card className={cn("bg-white/60 backdrop-blur-sm border-white/20", className)}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <CardTitle className="text-base sm:text-lg font-semibold">{title}</CardTitle>
          {showTrend && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.direction === "up"
                  ? "text-green-600"
                  : trend.direction === "down"
                    ? "text-red-600"
                    : "text-gray-600",
              )}
            >
              {trend.direction === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : trend.direction === "down" ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
              {trend.value}%
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs bg-transparent w-full sm:w-auto">
                <span className="hidden sm:inline">{chartType.charAt(0).toUpperCase() + chartType.slice(1)}</span>
                <span className="sm:hidden">Chart</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setChartType("line")}>Line Chart</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChartType("area")}>Area Chart</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChartType("bar")}>Bar Chart</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChartType("pie")}>Pie Chart</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs bg-transparent w-full sm:w-auto">
                <span className="hidden sm:inline">{selectedPeriod}</span>
                <span className="sm:hidden">Period</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedPeriod("Last 7 days")}>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod("Last 30 days")}>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod("Last 3 months")}>Last 3 months</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod("Last year")}>Last year</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
        {showComparison && (
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 text-sm">
            {dataKeys.map((key, index) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></div>
                <span className="text-gray-600 capitalize text-xs sm:text-sm">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
