"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, TrendingUp } from "lucide-react"
import type { Investment } from "@/models/Investment"

interface InvestmentCardProps {
  investment: Investment
  onViewDetails?: (investmentId: string) => void
  className?: string
}

export function InvestmentCard({ investment, onViewDetails, className }: InvestmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "outline"
      case "defaulted":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "completed":
        return "Finalizado"
      case "defaulted":
        return "Inadimplente"
      default:
        return status
    }
  }

  const returnPercentage = ((investment.actualReturn / investment.amount) * 100).toFixed(1)
  const progressPercentage = investment.monthlyReturns
    ? (investment.monthlyReturns.filter((r) => r.status === "received").length / investment.monthlyReturns.length) * 100
    : 0

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Investimento #{investment.id.slice(-6)}</CardTitle>
          <Badge variant={getStatusColor(investment.status)}>{getStatusText(investment.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Investido</p>
              <p className="font-semibold">R$ {investment.amount.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Retorno</p>
              <p className="font-semibold text-green-600">+{returnPercentage}%</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Período</p>
            <p className="text-sm">
              {investment.startDate.toLocaleDateString()} - {investment.endDate.toLocaleDateString()}
            </p>
          </div>
        </div>

        {investment.status === "active" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercentage} />
          </div>
        )}

        {onViewDetails && (
          <Button variant="outline" size="sm" onClick={() => onViewDetails(investment.id)} className="w-full">
            Ver Detalhes
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
