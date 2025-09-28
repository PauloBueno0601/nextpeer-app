"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { Loan } from "@/models/Loan"

interface LoanCardProps {
  loan: Loan
  onInvest?: (loanId: string) => void
  onViewDetails?: (loanId: string) => void
  showInvestButton?: boolean
  className?: string
}

export function LoanCard({ loan, onInvest, onViewDetails, showInvestButton = false, className }: LoanCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "funding":
        return "secondary"
      case "completed":
        return "outline"
      case "pending":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "funding":
        return "Captando"
      case "completed":
        return "Finalizado"
      case "pending":
        return "Pendente"
      default:
        return status
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{loan.borrowerName}</CardTitle>
          <Badge variant={getStatusColor(loan.status)}>{getStatusText(loan.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Valor</p>
            <p className="font-semibold">R$ {loan.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Taxa</p>
            <p className="font-semibold">{loan.interestRate}% a.m.</p>
          </div>
          <div>
            <p className="text-muted-foreground">Prazo</p>
            <p className="font-semibold">{loan.term} meses</p>
          </div>
          <div>
            <p className="text-muted-foreground">Score</p>
            <p className="font-semibold">{loan.creditScore}</p>
          </div>
        </div>

        {loan.status === "funding" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{loan.fundingProgress.toFixed(1)}%</span>
            </div>
            <Progress value={loan.fundingProgress} />
          </div>
        )}

        <div className="flex gap-2">
          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={() => onViewDetails(loan.id)} className="flex-1">
              Ver Detalhes
            </Button>
          )}
          {showInvestButton && onInvest && loan.status === "funding" && (
            <Button size="sm" onClick={() => onInvest(loan.id)} className="flex-1">
              Investir
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
