"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, DollarSign, Clock, User, TrendingUp, FileText, CheckCircle } from "lucide-react"

export default function OpportunityDetailsPage() {
  const [loading, setLoading] = useState(true)
  const [investing, setInvesting] = useState(false)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const router = useRouter()
  const params = useParams()

  const opportunityData = {
    id: params.id,
    borrowerName: "Maria S.",
    borrowerScore: 720,
    amount: 8000,
    purpose: "Capital de giro para expansão do negócio",
    interestRate: 2.1,
    term: 18,
    riskLevel: "Médio",
    funded: 60,
    availableAmount: 3200,
    monthlyIncome: 12000,
    profession: "Empresária",
    employmentStatus: "Empresária",
    creditScore: 720,
    monthlyPayment: 580.50,
    totalAmount: 10449.00,
    expectedReturn: 2449.00,
    description: "Maria é uma empresária experiente que precisa de capital para expandir seu negócio de consultoria. Ela possui um histórico sólido e uma renda estável."
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleInvest = async () => {
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) return

    setInvesting(true)
    try {
      // Simula processo de investimento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Aqui você integraria com o InvestmentController
      // const result = await InvestmentController.createInvestment(
      //   userId, 
      //   opportunityData.id, 
      //   parseFloat(investmentAmount)
      // )
      
      router.push("/investor/contract-confirmation")
    } catch (error) {
      console.error("Erro ao investir:", error)
    } finally {
      setInvesting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando oportunidade...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-6 py-4">
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
            <h1 className="text-xl font-bold text-foreground">Oportunidade de Investimento</h1>
            <p className="text-sm text-muted-foreground">Detalhes completos para sua decisão</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-lg">
                      {opportunityData.borrowerName[0]}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">{opportunityData.borrowerName}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Score de Crédito</span>
                      <Badge className="bg-green-100 text-green-800">
                        {opportunityData.borrowerScore}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    R$ {opportunityData.amount.toLocaleString()}
                  </p>
                  <Badge 
                    variant={opportunityData.riskLevel === "Baixo" ? "default" : 
                            opportunityData.riskLevel === "Médio" ? "secondary" : "destructive"}
                  >
                    Risco {opportunityData.riskLevel}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{opportunityData.description}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Loan Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Detalhes do Empréstimo</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Taxa de Juros</p>
                      <p className="font-semibold">{opportunityData.interestRate}% a.m.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Prazo</p>
                      <p className="font-semibold">{opportunityData.term} meses</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Parcela Mensal</span>
                    <span className="font-semibold">R$ {opportunityData.monthlyPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total a Pagar</span>
                    <span className="font-semibold">R$ {opportunityData.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Juros Totais</span>
                    <span className="font-semibold text-green-600">R$ {opportunityData.expectedReturn.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso de Financiamento</span>
                    <span className="font-semibold">{opportunityData.funded}%</span>
                  </div>
                  <Progress value={opportunityData.funded} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>R$ {(opportunityData.amount - opportunityData.availableAmount).toLocaleString()}</span>
                    <span>R$ {opportunityData.amount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Borrower Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Informações do Tomador</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Profissão</p>
                    <p className="font-semibold">{opportunityData.profession}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Situação Profissional</p>
                    <p className="font-semibold">{opportunityData.employmentStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Renda Mensal</p>
                    <p className="font-semibold">R$ {opportunityData.monthlyIncome.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Score de Crédito</p>
                    <p className="font-semibold text-green-600">{opportunityData.creditScore}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Investment Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Investir nesta Oportunidade</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor do Investimento (R$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    placeholder="Ex: 1000"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    max={opportunityData.availableAmount}
                  />
                  <p className="text-xs text-muted-foreground">
                    Disponível: R$ {opportunityData.availableAmount.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Retorno Esperado</Label>
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Em {opportunityData.term} meses</p>
                    <p className="text-lg font-bold text-green-600">
                      R$ {investmentAmount ? 
                        (parseFloat(investmentAmount) * Math.pow(1 + opportunityData.interestRate/100, opportunityData.term) - parseFloat(investmentAmount)).toFixed(2) 
                        : "0,00"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Vantagens deste investimento:</span>
                </div>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• Taxa de juros competitiva de {opportunityData.interestRate}% ao mês</li>
                  <li>• Tomador com score de crédito alto ({opportunityData.creditScore})</li>
                  <li>• Renda mensal estável de R$ {opportunityData.monthlyIncome.toLocaleString()}</li>
                  <li>• Prazo adequado para diversificação do portfólio</li>
                </ul>
              </div>

              <Button
                onClick={handleInvest}
                disabled={!investmentAmount || parseFloat(investmentAmount) <= 0 || investing}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {investing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Investir R$ {investmentAmount || "0"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
