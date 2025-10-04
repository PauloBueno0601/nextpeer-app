"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
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
  Eye,
} from "lucide-react"

export default function InvestorDashboard() {
  const [activeTab, setActiveTab] = useState("oportunidades")
  const [loading, setLoading] = useState(true)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()

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

  const dashboardData = {
    user: {
      id: user?.id || "2",
      name: user?.name || "Investidor",
      email: user?.email || "investidor@nexpeer.com",
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

  const myInvestments = [
    {
      id: "1",
      borrower: {
        name: "Ana C.",
        email: "ana@nexpeer.com",
        phone: "(11) 99999-9999",
        cpf: "123.456.789-00",
        profession: "Artesã",
        monthlyIncome: 8000,
        employmentStatus: "Autônoma",
        address: "São Paulo, SP",
        score: 780
      },
      loan: {
        amount: 5000,
        purpose: "Reforma da loja de artesanato",
        interestRate: 1.8,
        term: 12,
        monthlyPayment: 506.90,
        totalAmount: 6082.80,
        startDate: "2025-07-04",
        endDate: "2026-07-04",
        status: "Ativo",
        progress: 25,
        paidInstallments: 3,
        totalInstallments: 12
      },
      investment: {
        amount: 5000,
        expectedReturn: 1080,
        currentReturn: 0,
        nextPayment: "2025-11-15",
        nextPaymentAmount: 506.90
      }
    },
    {
      id: "2",
      borrower: {
        name: "Carlos S.",
        email: "carlos@nexpeer.com",
        phone: "(11) 88888-8888",
        cpf: "987.654.321-00",
        profession: "Comerciante",
        monthlyIncome: 12000,
        employmentStatus: "Empregado",
        address: "São Paulo, SP",
        score: 650
      },
      loan: {
        amount: 8000,
        purpose: "Expansão do negócio",
        interestRate: 2.1,
        term: 18,
        monthlyPayment: 206.50,
        totalAmount: 3717.00,
        startDate: "2025-09-01",
        endDate: "2027-03-01",
        status: "Ativo",
        progress: 6,
        paidInstallments: 1,
        totalInstallments: 18
      },
      investment: {
        amount: 3000,
        expectedReturn: 720,
        currentReturn: 0,
        nextPayment: "2025-11-01",
        nextPaymentAmount: 206.50
      }
    }
  ]

  const handleViewDetails = (investment: any) => {
    setSelectedInvestment(investment)
    setShowDetailsModal(true)
  }

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
    setShowProfilePopup(true)
  }

  // Loading states
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, não renderizar nada (será redirecionado)
  if (!isAuthenticated) {
    return null
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
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("notificacoes")}>
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Cards - Fixed */}
      <div className="px-6 py-6">
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
      </div>

      {/* Tab Content - Dynamic */}
      <div className="px-6 pb-24">
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Meus Investimentos</h2>
                <p className="text-sm text-muted-foreground">Acompanhe seus investimentos ativos</p>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-700">
                {dashboardData.metrics.activeCount} ativo(s)
              </Badge>
            </div>

            {/* Investimento 1 - Ana C. */}
            <Card className="border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-lg">A</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">Ana C.</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Score de Crédito</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">780</Badge>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">Ativo</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Valor Investido</span>
                    <p className="font-semibold text-foreground text-lg">R$ 5.000</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Retorno Esperado</span>
                    <p className="font-semibold text-green-600 text-lg">R$ 1.080</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Taxa de Juros</span>
                    <p className="font-semibold text-foreground">1.8% a.m.</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Prazo</span>
                    <p className="font-semibold text-foreground">12 meses</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progresso do Pagamento</span>
                    <span className="font-medium">3/12 parcelas (25%)</span>
                  </div>
                  <Progress value={25} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Próximo Pagamento:</span>
                    <span className="font-medium">15 Nov 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor da Parcela:</span>
                    <span className="font-medium">R$ 506,90</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewDetails(myInvestments[0])}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Ver Contrato
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Investimento 2 - Carlos S. */}
            <Card className="border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">C</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">Carlos S.</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Score de Crédito</span>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">650</Badge>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">Ativo</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Valor Investido</span>
                    <p className="font-semibold text-foreground text-lg">R$ 3.000</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Retorno Esperado</span>
                    <p className="font-semibold text-green-600 text-lg">R$ 720</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Taxa de Juros</span>
                    <p className="font-semibold text-foreground">2.1% a.m.</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Prazo</span>
                    <p className="font-semibold text-foreground">18 meses</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progresso do Pagamento</span>
                    <span className="font-medium">1/18 parcelas (6%)</span>
                  </div>
                  <Progress value={6} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Próximo Pagamento:</span>
                    <span className="font-medium">20 Nov 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor da Parcela:</span>
                    <span className="font-medium">R$ 206,50</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewDetails(myInvestments[1])}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Ver Contrato
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resumo dos Investimentos */}
            <Card className="bg-muted/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Resumo dos Investimentos</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Investido:</span>
                      <span className="font-semibold text-foreground">R$ 8.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Retorno Esperado:</span>
                      <span className="font-semibold text-green-600">R$ 1.800</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ROI Médio:</span>
                      <span className="font-semibold text-foreground">22.5%</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Investimentos Ativos:</span>
                      <span className="font-semibold text-foreground">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Próximo Recebimento:</span>
                      <span className="font-semibold text-primary">15 Nov</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status Geral:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">Em Dia</Badge>
                    </div>
                  </div>
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
          <div className="space-y-6">
            {/* Gráfico de Lucro dos Últimos 5 Meses */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Lucro dos Últimos 5 Meses</h3>
                    <p className="text-sm text-muted-foreground">Evolução do seu retorno mensal (Jun - Out 2024)</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">+R$ 2.020</div>
                    <div className="text-sm text-muted-foreground">Total acumulado</div>
                  </div>
                </div>
                
                {/* Gráfico de Linhas */}
                <div className="relative h-64 bg-muted/20 rounded-lg p-4">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    {/* Grid lines */}
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Data points and line */}
                    {(() => {
                      const data = [
                        { month: "Jun", profit: 320, x: 40, y: 160 },
                        { month: "Jul", profit: 380, x: 120, y: 140 },
                        { month: "Ago", profit: 420, x: 200, y: 120 },
                        { month: "Set", profit: 380, x: 280, y: 140 },
                        { month: "Out", profit: 520, x: 360, y: 80 }
                      ];
                      
                      const points = data.map(d => `${d.x},${d.y}`).join(' ');
                      
                      return (
                        <>
                          {/* Line */}
                          <polyline
                            points={points}
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          
                          {/* Data points */}
                          {data.map((point, index) => (
                            <g key={index}>
                              <circle
                                cx={point.x}
                                cy={point.y}
                                r="6"
                                fill="hsl(var(--primary))"
                                stroke="hsl(var(--background))"
                                strokeWidth="2"
                              />
                              <text
                                x={point.x}
                                y={point.y - 15}
                                textAnchor="middle"
                                className="text-xs font-semibold fill-foreground"
                              >
                                R$ {point.profit}
                              </text>
                              <text
                                x={point.x}
                                y={point.y + 25}
                                textAnchor="middle"
                                className="text-xs fill-muted-foreground"
                              >
                                {point.month}
                              </text>
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                  
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2">
                    <span className="text-xs text-muted-foreground">R$ 600</span>
                    <span className="text-xs text-muted-foreground">R$ 450</span>
                    <span className="text-xs text-muted-foreground">R$ 300</span>
                    <span className="text-xs text-muted-foreground">R$ 150</span>
                    <span className="text-xs text-muted-foreground">R$ 0</span>
                  </div>
                </div>
                
                {/* Estatísticas */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">R$ 520</div>
                    <div className="text-xs text-muted-foreground">Maior lucro</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">R$ 320</div>
                    <div className="text-xs text-muted-foreground">Menor lucro</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">+62.5%</div>
                    <div className="text-xs text-muted-foreground">Crescimento</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo de Performance */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Resumo de Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">ROI Médio</span>
                      <span className="font-semibold text-foreground">8.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Investimentos Ativos</span>
                      <span className="font-semibold text-foreground">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Taxa de Sucesso</span>
                      <span className="font-semibold text-green-600">100%</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Valor Total Investido</span>
                      <span className="font-semibold text-foreground">R$ 15.000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Retorno Total</span>
                      <span className="font-semibold text-green-600">R$ 2.020</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Próximo Pagamento</span>
                      <span className="font-semibold text-primary">15 Jan</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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

      {/* Modal de Detalhes do Investimento */}
      {showDetailsModal && selectedInvestment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Detalhes do Investimento</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Informações do Tomador */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Informações do Tomador</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Nome:</span>
                      <p className="font-semibold text-foreground">{selectedInvestment.borrower.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <p className="font-medium text-foreground">{selectedInvestment.borrower.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Profissão:</span>
                      <p className="font-medium text-foreground">{selectedInvestment.borrower.profession}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Renda Mensal:</span>
                      <p className="font-medium text-foreground">R$ {selectedInvestment.borrower.monthlyIncome.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Score de Crédito:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {selectedInvestment.borrower.score}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Localização:</span>
                      <p className="font-medium text-foreground">{selectedInvestment.borrower.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações do Empréstimo */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Informações do Empréstimo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Valor do Empréstimo:</span>
                      <p className="font-semibold text-foreground text-lg">R$ {selectedInvestment.loan.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Finalidade:</span>
                      <p className="font-medium text-foreground">{selectedInvestment.loan.purpose}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Taxa de Juros:</span>
                      <p className="font-medium text-foreground">{selectedInvestment.loan.interestRate}% a.m.</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Prazo:</span>
                      <p className="font-medium text-foreground">{selectedInvestment.loan.term} meses</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Parcela Mensal:</span>
                      <p className="font-semibold text-foreground">R$ {selectedInvestment.loan.monthlyPayment.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Valor Total:</span>
                      <p className="font-semibold text-foreground">R$ {selectedInvestment.loan.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Data de Início:</span>
                      <p className="font-medium text-foreground">{new Date(selectedInvestment.loan.startDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Data de Vencimento:</span>
                      <p className="font-medium text-foreground">{new Date(selectedInvestment.loan.endDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progresso do Pagamento */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Progresso do Pagamento</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Parcelas Pagas</span>
                      <span className="font-medium">{selectedInvestment.loan.paidInstallments}/{selectedInvestment.loan.totalInstallments}</span>
                    </div>
                    <Progress value={selectedInvestment.loan.progress} className="h-3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Próximo Pagamento:</span>
                      <p className="font-medium text-foreground">{new Date(selectedInvestment.investment.nextPayment).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Valor da Próxima Parcela:</span>
                      <p className="font-medium text-foreground">R$ {selectedInvestment.investment.nextPaymentAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border bg-muted/30">
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Fechar
                </Button>
                <Button className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Ver Contrato Completo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup de Perfil do Usuário */}
      {showProfilePopup && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Perfil do Investidor</h2>
                  <p className="text-sm text-muted-foreground">Dados da sua conta</p>
                </div>
              </div>
              <button
                onClick={() => setShowProfilePopup(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Informações Pessoais */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Informações Pessoais</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Nome Completo</label>
                      <p className="font-medium text-foreground">{user?.name || "Investidor"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      <p className="font-medium text-foreground">{user?.email || "investidor@nexpeer.com"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">CPF</label>
                      <p className="font-medium text-foreground">{user?.cpf || "123.456.789-00"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Telefone</label>
                      <p className="font-medium text-foreground">{user?.phone || "(11) 99999-9999"}</p>
                    </div>
                  </div>
                </div>

                {/* Status da Conta */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Status da Conta</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tipo de Perfil</span>
                      <Badge className="bg-primary/10 text-primary">
                        Investidor
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className="bg-green-100 text-green-800">
                        <Activity className="w-3 h-3 mr-1" />
                        Ativo
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Data de Cadastro</span>
                      <span className="font-medium text-foreground">15/03/2024</span>
                    </div>
                  </div>
                </div>

                {/* Estatísticas de Investimento */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Estatísticas de Investimento</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-foreground">R$ 8.000</div>
                      <div className="text-sm text-muted-foreground">Total Investido</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-foreground">2</div>
                      <div className="text-sm text-muted-foreground">Investimentos Ativos</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-foreground">R$ 720</div>
                      <div className="text-sm text-muted-foreground">Retorno Esperado</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-foreground">9.0%</div>
                      <div className="text-sm text-muted-foreground">Taxa Média</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border bg-muted/30">
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowProfilePopup(false)}
                >
                  Fechar
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowProfilePopup(false)
                    router.push("/profile")
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
                <Button 
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    setShowProfilePopup(false)
                    router.push("/login")
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
