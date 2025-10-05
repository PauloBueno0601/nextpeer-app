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
  Building2,
} from "lucide-react"
import { LineChart } from "@/components/ui/line-chart"

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState("oportunidades")
  const [loading, setLoading] = useState(true)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [contractOpen, setContractOpen] = useState(false)
  const [contractLoading, setContractLoading] = useState(false)
  const [contract, setContract] = useState<null | {
    id: string
    loanId: string
    investorId: string
    borrowerId: string
    hashContrato: string
    simulatedAddress: string
    pdfUrl: string
  }>(null)
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()

  // Proteção de rotas
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Redirecionar se não for empresa (apenas se for pessoa física)
  useEffect(() => {
    if (user && user.tipoPessoa === "FISICA") {
      router.push("/borrower/dashboard")
    }
  }, [user, router])

  const dashboardData = {
    user: {
      id: user?.id || "2",
      name: user?.razaoSocial || user?.nome || "Empresa",
      email: user?.email || "empresa@nexpeer.com",
      tipoPessoa: "JURIDICA" as const,
    },
    metrics: {
      totalAmount: 15000,
      averageReturn: 1200,
      activeCount: 3,
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
        startDate: "2025-08-01",
        endDate: "2026-08-01",
        status: "Ativo",
        progress: 25,
        paidInstallments: 3,
        totalInstallments: 12
      },
      investment: {
        amount: 5000,
        expectedReturn: 1080,
        currentReturn: 0,
        nextPayment: "2025-11-01",
        nextPaymentAmount: 506.90
      }
    },
  ]

  // Dados dos lucros dos últimos 5 meses (considerando outubro 2025)
  const monthlyProfits = [
    { month: "Jun", value: 1250, label: "Junho 2025" },
    { month: "Jul", value: 1680, label: "Julho 2025" },
    { month: "Ago", value: 1420, label: "Agosto 2025" },
    { month: "Set", value: 1950, label: "Setembro 2025" },
    { month: "Out", value: 2200, label: "Outubro 2025" }
  ]

  const handleViewDetails = (investment: any) => {
    setSelectedInvestment(investment)
    setShowDetailsModal(true)
  }

  const handleViewContract = async (loanId: string) => {
    setContractLoading(true)
    try {
      const mockContract = {
        id: loanId,
        loanId: loanId,
        investorId: user?.id || 'empresa_1',
        borrowerId: 'u_ana',
        hashContrato: `0x${Math.random().toString(16).slice(2, 42)}`,
        simulatedAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
        pdfUrl: `/api/contracts/${loanId}/pdf?userType=empresa`
      }
      
      setContract(mockContract)
      setContractOpen(true)
    } catch (e) {
      console.error('Erro ao carregar contrato:', e)
    } finally {
      setContractLoading(false)
    }
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
              <Building2 className="w-5 h-5 text-primary" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Olá, {user?.razaoSocial || dashboardData.user.name}!</h1>
              <p className="text-sm text-muted-foreground">Bem-vindo ao painel de investimentos da empresa</p>
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
                  <p className="text-lg font-bold text-foreground">R$ 50.000</p>
                  <p className="text-xs text-green-600">+8.2%</p>
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
                  <p className="text-xs text-green-600">+3.2%</p>
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
                <h2 className="text-xl font-semibold text-foreground">Investimentos da Empresa</h2>
                <p className="text-sm text-muted-foreground">Acompanhe os investimentos ativos da empresa</p>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-700">
                {dashboardData.metrics.activeCount} ativo(s)
              </Badge>
            </div>

            {myInvestments.map((investment) => (
              <Card key={investment.id} className="border border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-lg">{investment.borrower.name[0]}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{investment.borrower.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Score de Crédito</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">{investment.borrower.score}</Badge>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">Ativo</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Valor Investido</span>
                      <p className="font-semibold text-foreground text-lg">R$ {investment.investment.amount.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Retorno Esperado</span>
                      <p className="font-semibold text-green-600 text-lg">R$ {investment.investment.expectedReturn.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Taxa de Juros</span>
                      <p className="font-semibold text-foreground">{investment.loan.interestRate}% a.m.</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Prazo</span>
                      <p className="font-semibold text-foreground">{investment.loan.term} meses</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progresso do Pagamento</span>
                      <span className="font-medium">{investment.loan.paidInstallments}/{investment.loan.totalInstallments} parcelas ({investment.loan.progress}%)</span>
                    </div>
                    <Progress value={investment.loan.progress} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Próximo Pagamento:</span>
                      <span className="font-medium">{new Date(investment.investment.nextPayment).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor da Parcela:</span>
                      <span className="font-medium">R$ {investment.investment.nextPaymentAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewDetails(investment)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewContract(investment.id)}
                      disabled={contractLoading}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {contractLoading ? 'Carregando...' : 'Ver Contrato'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
            {/* Gráfico de Lucros dos Últimos 5 Meses */}
            <Card>
              <CardContent className="p-6">
                <LineChart
                  data={monthlyProfits}
                  title="Lucros Recebidos - Últimos 5 Meses"
                  subtitle="Evolução dos retornos mensais da empresa (Jun - Out 2025)"
                  height={300}
                  showGrid={true}
                  showValues={true}
                />
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
                      <span className="font-semibold text-foreground">12.5%</span>
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
                      <span className="font-semibold text-green-600">R$ 1.875</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Próximo Pagamento</span>
                      <span className="font-semibold text-primary">15 Jan</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas Adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    R$ {monthlyProfits.reduce((sum, month) => sum + month.value, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total em 5 meses</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    R$ {Math.round(monthlyProfits.reduce((sum, month) => sum + month.value, 0) / monthlyProfits.length).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Média mensal</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    +{Math.round(((monthlyProfits[monthlyProfits.length - 1].value - monthlyProfits[0].value) / monthlyProfits[0].value) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Crescimento</div>
                </CardContent>
              </Card>
            </div>
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

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
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
            </div>

            <div className="p-6 border-t border-border bg-muted/30">
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Fechar
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => handleViewContract('emp_1')}
                  disabled={contractLoading}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {contractLoading ? 'Carregando...' : 'Ver Contrato Completo'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal do Contrato */}
      {contractOpen && contract && (
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
          <div className="p-4 border-b border-border flex-shrink-0">
            <h2 className="text-lg font-semibold text-foreground">Contrato (simulado)</h2>
          </div>
          <div className="p-4 space-y-3 text-sm flex-shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Empréstimo</span><span className="text-foreground">{contract.loanId}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Investidor</span><span className="text-foreground">{contract.investorId}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tomador</span><span className="text-foreground">{contract.borrowerId}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Hash</span><span className="text-foreground break-all text-xs">{contract.hashContrato}</span></div>
            </div>
          </div>
          <div className="flex-1 min-h-0 p-4">
            <div className="h-full border border-border rounded overflow-hidden">
              <iframe src={contract.pdfUrl} className="w-full h-full" title="Contrato PDF" />
            </div>
          </div>
          <div className="p-4 border-t border-border flex justify-between flex-shrink-0 bg-background">
            <a href={contract.pdfUrl} download className="inline-flex items-center px-4 py-2 rounded-md border border-border text-sm hover:bg-muted">Salvar PDF</a>
            <Button onClick={() => setContractOpen(false)}>Fechar</Button>
          </div>
        </div>
      )}

      {/* Popup de Perfil da Empresa */}
      {showProfilePopup && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{user?.razaoSocial || "Empresa"}</h2>
                  <p className="text-sm text-muted-foreground">Dados da conta empresarial</p>
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

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Informações da Empresa</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Razão Social</label>
                      <p className="font-semibold text-foreground text-lg">{user?.razaoSocial || "Empresa Exemplo Ltda"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Nome Fantasia</label>
                      <p className="font-medium text-foreground">{user?.nomeFantasia || "Empresa Exemplo"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">CNPJ</label>
                      <p className="font-medium text-foreground">{user?.cnpj || "12.345.678/0001-90"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      <p className="font-medium text-foreground">{user?.email || "empresa@nexpeer.com"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Status da Conta</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tipo de Perfil</span>
                      <Badge className="bg-primary/10 text-primary">
                        Empresa
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className="bg-green-100 text-green-800">
                        <Activity className="w-3 h-3 mr-1" />
                        Ativo
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-muted/30">
              <div className="flex flex-col space-y-3">
                {/* Botão Sair - Mais proeminente */}
                <Button 
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    setShowProfilePopup(false)
                    router.push("/login")
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair da Conta
                </Button>
                
                {/* Outros botões */}
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowProfilePopup(false)}
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
