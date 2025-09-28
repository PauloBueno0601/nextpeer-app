"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  Wallet,
  PieChart,
  BarChart3,
  Search,
  Target,
  Activity,
  FileText,
  Clock,
  DollarSign,
  Bell,
  User,
  LogOut,
} from "lucide-react"

export default function InvestorDashboard() {
  const [activeTab, setActiveTab] = useState("oportunidades")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const dashboardData = {
    user: {
      id: "2",
      name: "Investidor",
      email: "investidor@email.com",
      profileType: "INVESTOR" as const,
    },
    metrics: {
      totalAmount: 5000,
      averageReturn: 450,
      activeCount: 1,
    },
    notifications: [
      {
        id: "1",
        title: "Novo pagamento recebido",
        message: "Ana C. realizou o pagamento da parcela 1/12",
        read: false,
        createdAt: new Date(),
      },
    ],
  }

  const availableInvestments = [
    {
      id: "2",
      borrower: { name: "Maria S.", score: 720 },
      amount: 8000,
      purpose: "Capital de giro",
      interestRate: 2.1,
      term: 18,
      riskLevel: "Médio",
      funded: 60,
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleInvest = (loanId: string) => {
    router.push(`/investor/loan-details/${loanId}`)
  }

  const handleLogout = () => {
    router.push("/")
  }

  const handleProfileClick = () => {
    router.push("/profile")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
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
              onClick={handleProfileClick}
              className="w-10 h-10 bg-primary/10 rounded-full hover:bg-primary/20"
            >
              <User className="w-5 h-5 text-primary" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Olá, {dashboardData.user.name}!</h1>
              <p className="text-sm text-muted-foreground">Bem-vindo ao seu painel de investimentos</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 pb-20 space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo em Carteira</p>
                  <p className="text-lg font-bold text-foreground">R$ 20.000</p>
                  <p className="text-xs text-green-600">+5.2%</p>
                </div>
                <Wallet className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Investido</p>
                  <p className="text-lg font-bold text-foreground">
                    R$ {dashboardData.metrics.totalAmount.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Retornos</p>
                  <p className="text-lg font-bold text-foreground">
                    R$ {dashboardData.metrics.averageReturn.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600">+2.1%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Investimentos Ativos</p>
                  <p className="text-lg font-bold text-foreground">{dashboardData.metrics.activeCount}</p>
                </div>
                <PieChart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Content */}
        {activeTab === "oportunidades" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Oportunidades Disponíveis</h2>
              <Badge variant="outline">{availableInvestments.length} disponíveis</Badge>
            </div>

            <div className="grid gap-4">
              {availableInvestments.map((loan) => (
                <Card key={loan.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold text-sm">{loan.borrower.name[0]}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{loan.borrower.name}</h3>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-muted-foreground">Score</span>
                            <span className="text-sm font-medium text-green-600">{loan.borrower.score}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">R$ {loan.amount.toLocaleString()}</p>
                        <Badge variant="secondary">{loan.riskLevel}</Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Progresso de Financiamento</span>
                        <span className="text-sm font-medium text-foreground">{loan.funded}%</span>
                      </div>
                      <Progress value={loan.funded} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Taxa</p>
                          <p className="text-sm font-medium text-foreground">{loan.interestRate}% a.m.</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Prazo</p>
                          <p className="text-sm font-medium text-foreground">{loan.term} meses</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Finalidade:</span>
                        <span className="text-foreground">{loan.purpose}</span>
                      </div>
                      <Button onClick={() => handleInvest(loan.id)} size="sm">
                        Investir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "investimentos" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Meus Investimentos</h2>
              <Badge variant="default">{dashboardData.metrics.activeCount} ativo(s)</Badge>
            </div>

            {/* Ana's loan investment */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">A</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Ana C.</h3>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-muted-foreground">Score</span>
                        <span className="text-sm font-medium text-green-600">780</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">R$ 5.000</p>
                    <Badge className="bg-green-100 text-green-800">100% Financiado</Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progresso de Pagamentos</span>
                    <span className="text-sm font-medium text-foreground">0 de 12 parcelas</span>
                  </div>
                  <Progress value={0} />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Taxa</p>
                      <p className="text-sm font-medium text-foreground">1.8% a.m.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Prazo</p>
                      <p className="text-sm font-medium text-foreground">12 meses</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Finalidade:</span>
                  <span className="text-foreground">Reforma de loja</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "notificacoes" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Notificações</h2>
            {dashboardData.notifications.map((notification) => (
              <Card key={notification.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "analises" && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Análises</h3>
                <p className="text-muted-foreground text-sm">Relatórios e análises do seu portfólio</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="flex items-center justify-around py-3 px-6">
          {[
            { id: "oportunidades", label: "Oportunidades", icon: Search },
            { id: "investimentos", label: "Investimentos", icon: Target },
            { id: "notificacoes", label: "Notificações", icon: Activity },
            { id: "analises", label: "Análises", icon: FileText },
          ].map((tab) => {
            const IconComponent = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center space-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg scale-110" 
                      : "bg-muted/20 hover:bg-muted/40"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs transition-all duration-200 ${
                    isActive 
                      ? "text-primary font-bold" 
                      : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
