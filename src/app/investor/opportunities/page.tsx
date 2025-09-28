"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Search, Filter, TrendingUp, DollarSign, Clock, User } from "lucide-react"

export default function OpportunitiesPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const opportunities = [
    {
      id: "2",
      borrowerName: "Maria S.",
      borrowerScore: 720,
      amount: 8000,
      purpose: "Capital de giro",
      interestRate: 2.1,
      term: 18,
      riskLevel: "Médio",
      funded: 60,
      availableAmount: 3200,
      monthlyIncome: 12000,
      profession: "Empresária",
    },
    {
      id: "3",
      borrowerName: "João P.",
      borrowerScore: 650,
      amount: 3000,
      purpose: "Reforma da casa",
      interestRate: 2.8,
      term: 12,
      riskLevel: "Alto",
      funded: 30,
      availableAmount: 2100,
      monthlyIncome: 6000,
      profession: "Vendedor",
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleInvest = (opportunityId: string) => {
    router.push(`/investor/opportunities/${opportunityId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando oportunidades...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="w-10 h-10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Oportunidades</h1>
              <p className="text-sm text-muted-foreground">Encontre investimentos que combinam com você</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {opportunities.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma oportunidade disponível</h3>
              <p className="text-muted-foreground">
                No momento não há oportunidades de investimento disponíveis. Tente novamente mais tarde.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {opportunity.borrowerName[0]}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{opportunity.borrowerName}</CardTitle>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-muted-foreground">Score</span>
                          <span className="text-sm font-medium text-green-600">
                            {opportunity.borrowerScore}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        R$ {opportunity.amount.toLocaleString()}
                      </p>
                      <Badge 
                        variant={opportunity.riskLevel === "Baixo" ? "default" : 
                                opportunity.riskLevel === "Médio" ? "secondary" : "destructive"}
                      >
                        {opportunity.riskLevel}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso de Financiamento</span>
                      <span className="text-foreground font-medium">{opportunity.funded}%</span>
                    </div>
                    <Progress value={opportunity.funded} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>R$ {(opportunity.amount - opportunity.availableAmount).toLocaleString()}</span>
                      <span>R$ {opportunity.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Taxa</p>
                        <p className="font-medium">{opportunity.interestRate}% a.m.</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Prazo</p>
                        <p className="font-medium">{opportunity.term} meses</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Profissão</p>
                        <p className="font-medium">{opportunity.profession}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Renda Mensal</p>
                      <p className="font-medium">R$ {opportunity.monthlyIncome.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Finalidade:</p>
                    <p className="text-sm text-foreground">{opportunity.purpose}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Disponível para investir:</span>
                      <span className="ml-2 font-semibold text-foreground">
                        R$ {opportunity.availableAmount.toLocaleString()}
                      </span>
                    </div>
                    <Button 
                      onClick={() => handleInvest(opportunity.id)}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Investir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
