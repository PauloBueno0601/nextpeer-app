"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, DollarSign, Clock, User, TrendingUp, FileText } from "lucide-react"

export default function LoanDetailsPage() {
  const [loading, setLoading] = useState(true)
  const [investing, setInvesting] = useState(false)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const router = useRouter()
  const params = useParams()

  const loanData = {
    id: params.id,
    borrowerName: "Ana C.",
    borrowerScore: 780,
    amount: 5000,
    purpose: "Reforma da minha loja de artesanato",
    interestRate: 1.8,
    term: 12,
    riskLevel: "Baixo",
    funded: 100,
    availableAmount: 0,
    monthlyIncome: 8000,
    profession: "Artesã",
    employmentStatus: "Autônoma",
    creditScore: 780,
    monthlyPayment: 506.90,
    totalAmount: 6082.80,
    expectedReturn: 1082.80,
    description: "Ana é uma artesã experiente que precisa de capital para reformar sua loja e expandir seus negócios. Ela possui um histórico de pagamentos impecável e uma renda estável."
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
      //   loanData.id, 
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
          <p className="text-muted-foreground">Carregando detalhes...</p>
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
            <h1 className="text-xl font-bold text-foreground">Detalhes do Empréstimo</h1>
            <p className="text-sm text-muted-foreground">Informações completas para investimento</p>
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
                      {loanData.borrowerName[0]}
                    </span>
                </div>
                <div>
                    <CardTitle className="text-xl">{loanData.borrowerName}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Score de Crédito</span>
                      <Badge className="bg-green-100 text-green-800">
                        {loanData.borrowerScore}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    R$ {loanData.amount.toLocaleString()}
                  </p>
                  <Badge 
                    variant={loanData.riskLevel === "Baixo" ? "default" : 
                            loanData.riskLevel === "Médio" ? "secondary" : "destructive"}
                  >
                    Risco {loanData.riskLevel}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{loanData.description}</p>
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
                      <p className="font-semibold">{loanData.interestRate}% a.m.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Prazo</p>
                      <p className="font-semibold">{loanData.term} meses</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Parcela Mensal</span>
                    <span className="font-semibold">R$ {loanData.monthlyPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total a Pagar</span>
                    <span className="font-semibold">R$ {loanData.totalAmount.toLocaleString()}</span>
              </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Juros Totais</span>
                    <span className="font-semibold text-green-600">R$ {loanData.expectedReturn.toLocaleString()}</span>
              </div>
            </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso de Financiamento</span>
                    <span className="font-semibold">{loanData.funded}%</span>
              </div>
                  <Progress value={loanData.funded} />
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
                    <p className="font-semibold">{loanData.profession}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Situação Profissional</p>
                    <p className="font-semibold">{loanData.employmentStatus}</p>
                </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Renda Mensal</p>
                    <p className="font-semibold">R$ {loanData.monthlyIncome.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Score de Crédito</p>
                    <p className="font-semibold text-green-600">{loanData.creditScore}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
              </div>

          {/* Investment Section */}
          {loanData.funded < 100 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Investir neste Empréstimo</span>
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
                      max={loanData.availableAmount}
                    />
                    <p className="text-xs text-muted-foreground">
                      Disponível: R$ {loanData.availableAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Retorno Esperado</Label>
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Em {loanData.term} meses</p>
                      <p className="text-lg font-bold text-green-600">
                        R$ {investmentAmount ? 
                          (parseFloat(investmentAmount) * Math.pow(1 + loanData.interestRate/100, loanData.term) - parseFloat(investmentAmount)).toFixed(2) 
                          : "0,00"}
                      </p>
              </div>
              </div>
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
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Empréstimo 100% Financiado</h3>
                <p className="text-muted-foreground">
                  Este empréstimo já foi totalmente financiado por outros investidores.
                </p>
          </CardContent>
        </Card>
          )}
        </div>
      </div>
    </div>
  )
}