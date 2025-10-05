"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useLoans } from "@/contexts/LoansContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  DollarSign,
  Clock,
  User,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Target
} from "lucide-react"

export default function LoanDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { loans, updateLoan } = useLoans()
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [isInvesting, setIsInvesting] = useState(false)
  const [loan, setLoan] = useState<any>(null)

  // Proteção de rotas
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Redirecionar se não for investidor
  useEffect(() => {
    if (user && user.profileType !== "INVESTOR") {
      router.push("/borrower/dashboard")
    }
  }, [user, router])

  // Buscar empréstimo específico
  useEffect(() => {
    if (params.id) {
      // Primeiro, tentar encontrar nos empréstimos do contexto
      const foundLoan = loans.find(l => l.id === params.id)
      if (foundLoan) {
        setLoan(foundLoan)
        return
      }
      
      // Se não encontrou, verificar se é uma oportunidade de exemplo
      if (typeof params.id === 'string' && params.id.startsWith('opp_')) {
        const exampleLoan = {
          id: params.id,
          amount: params.id === 'opp_1' ? 3000 : params.id === 'opp_2' ? 5000 : 2500,
          purpose: params.id === 'opp_1' ? 'Expansão da padaria' : params.id === 'opp_2' ? 'Equipamentos para oficina' : 'Capital de giro',
          interestRate: params.id === 'opp_1' ? 2.2 : params.id === 'opp_2' ? 2.5 : 1.9,
          term: params.id === 'opp_1' ? 12 : params.id === 'opp_2' ? 18 : 8,
          status: 'Pendente',
          progress: 0,
          borrower: {
            name: params.id === 'opp_1' ? 'Carlos M.' : params.id === 'opp_2' ? 'Ana L.' : 'Roberto S.',
            email: params.id === 'opp_1' ? 'carlos@email.com' : params.id === 'opp_2' ? 'ana@email.com' : 'roberto@email.com',
            score: params.id === 'opp_1' ? 720 : params.id === 'opp_2' ? 680 : 750
          }
        }
        setLoan(exampleLoan)
        return
      }
      
      // Se não encontrou nem é uma oportunidade de exemplo, redirecionar
      router.push("/investor/dashboard")
    }
  }, [params.id, loans, router])

  if (authLoading || !loan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando detalhes...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Calcular valores de investimento possíveis
  const calculateInvestmentOptions = (totalAmount: number) => {
    const options = []
    
    // Opção 1: 25% do valor total
    const option1 = Math.round(totalAmount * 0.25)
    if (option1 >= 100) {
      options.push({
        value: option1,
        percentage: 25,
        label: "25% do empréstimo",
        description: "Investimento conservador"
      })
    }

    // Opção 2: 50% do valor total
    const option2 = Math.round(totalAmount * 0.5)
    if (option2 >= 100) {
      options.push({
        value: option2,
        percentage: 50,
        label: "50% do empréstimo",
        description: "Investimento moderado"
      })
    }

    // Opção 3: 75% do valor total
    const option3 = Math.round(totalAmount * 0.75)
    if (option3 >= 100) {
      options.push({
        value: option3,
        percentage: 75,
        label: "75% do empréstimo",
        description: "Investimento arrojado"
      })
    }

    // Opção 4: 100% do valor total
    options.push({
      value: totalAmount,
      percentage: 100,
      label: "100% do empréstimo",
      description: "Financiamento completo"
    })

    return options
  }

  const investmentOptions = calculateInvestmentOptions(loan.amount)

  const handleInvest = async () => {
    if (!selectedAmount) return

    setIsInvesting(true)
    
    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Atualizar o empréstimo com o investimento
      const newProgress = Math.round((selectedAmount / loan.amount) * 100)
      const newStatus = newProgress === 100 ? "Aprovado" : "Parcialmente Financiado"
      
      updateLoan(loan.id, {
        progress: newProgress,
        status: newStatus,
        monthlyPayment: selectedAmount * (loan.interestRate / 100),
        totalAmount: selectedAmount + (selectedAmount * (loan.interestRate / 100) * loan.term)
      })

      // Redirecionar para dashboard com sucesso
      router.push("/investor/dashboard?invested=true")
    } catch (error) {
      console.error("Erro ao investir:", error)
    } finally {
      setIsInvesting(false)
    }
  }

  const expectedReturn = selectedAmount 
    ? selectedAmount * (loan.interestRate / 100) * loan.term 
    : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/investor/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Detalhes do Empréstimo</h1>
            <p className="text-sm text-muted-foreground">Escolha quanto deseja investir</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações do Empréstimo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <span>Informações do Empréstimo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Valor Solicitado</p>
                  <p className="text-lg font-semibold text-foreground">
                    R$ {loan.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Finalidade</p>
                  <p className="text-sm font-medium text-foreground">{loan.purpose}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Juros</p>
                  <p className="text-sm font-medium text-foreground">{loan.interestRate}% a.m.</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prazo</p>
                  <p className="text-sm font-medium text-foreground">{loan.term} meses</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progresso de Financiamento</span>
                  <span className="font-medium">{loan.progress}%</span>
                </div>
                <Progress value={loan.progress} />
              </div>
            </CardContent>
          </Card>

          {/* Informações do Tomador */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <span>Informações do Tomador</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold text-lg">
                    {loan.borrower?.name?.[0] || "U"}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {loan.borrower?.name || "Usuário"}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Score</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {loan.borrower?.score || 750}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">
                    {loan.borrower?.email || "usuario@nexpeer.com"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nível de Risco</p>
                  <Badge variant="outline" className={
                    (loan.borrower?.score || 750) > 700 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                  }>
                    {(loan.borrower?.score || 750) > 700 ? "Baixo" : "Médio"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Opções de Investimento */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Escolha o Valor do Investimento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {investmentOptions.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedAmount === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedAmount(option.value)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">
                      R$ {option.value.toLocaleString()}
                    </h3>
                    <Badge variant={selectedAmount === option.value ? "default" : "outline"}>
                      {option.percentage}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              ))}
            </div>

            {/* Resumo do Investimento */}
            {selectedAmount && (
              <div className="bg-muted/30 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-foreground mb-4">Resumo do Investimento</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor a Investir</p>
                    <p className="text-lg font-semibold text-foreground">
                      R$ {selectedAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Retorno Esperado</p>
                    <p className="text-lg font-semibold text-green-600">
                      R$ {expectedReturn.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa Mensal</p>
                    <p className="text-sm font-medium text-foreground">{loan.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prazo</p>
                    <p className="text-sm font-medium text-foreground">{loan.term} meses</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botão de Investir */}
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push("/investor/dashboard")}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleInvest}
                disabled={!selectedAmount || isInvesting}
                className="min-w-[120px]"
              >
                {isInvesting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Investir
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}