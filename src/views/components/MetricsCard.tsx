import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricsCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon?: React.ReactNode
  className?: string
}

export function MetricsCard({ title, value, subtitle, trend, trendValue, icon, className }: MetricsCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "neutral":
        return <Minus className="h-4 w-4 text-muted-foreground" />
      default:
        return null
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-500"
      case "down":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {trend && trendValue && (
          <div className="flex items-center space-x-1 mt-2">
            {getTrendIcon()}
            <span className={cn("text-xs font-medium", getTrendColor())}>{trendValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
