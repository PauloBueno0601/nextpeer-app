"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  User,
  CreditCard,
  FileText,
  BarChart3,
  TrendingUp,
  CheckCircle,
  Download,
  Calendar,
  DollarSign,
  Bell,
  Plus,
  Activity,
  PieChart,
  Send,
  Eye,
  Clock,
  AlertCircle,
  TrendingDown,
  Target,
} from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
  type?: string
}

export default function BorrowerDashboard() {
  const [activeTab, setActiveTab] = useState("emprestimos-ativos")
  const [showCongratulations, setShowCongratulations] = useState(true)
  const [loading, setLoading] = useState(true)
  const [showBoletoModal, setShowBoletoModal] = useState(false)
  const [selectedBoleto, setSelectedBoleto] = useState<any>(null)
  const [showNotificationsPopup, setShowNotificationsPopup] = useState(false)
  const [showLoanDetailsModal, setShowLoanDetailsModal] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<any>(null)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()

  // Proteção de rotas
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Redirecionar se não for tomador
  useEffect(() => {
    if (user && user.profileType !== "BORROWER") {
      router.push("/investor/dashboard")
    }
  }, [user, router])

  const dashboardData = {
    user: {
      id: user?.id || "1",
      name: user?.name || "Usuário",
      email: user?.email || "user@nexpeer.com",
      cpf: user?.cpf || "123.456.789-00",
      phone: user?.phone || "(11) 99999-9999",
      profileType: "BORROWER" as const,
    },
    metrics: {
      totalAmount: 5000,
      activeCount: 1,
      creditScore: 780,
      availableLimit: 15000,
    },
    notifications: [
      {
        id: "1",
        title: "Empréstimo Aprovado",
        message: "Seu empréstimo de R$ 5.000 foi 100% financiado!",
        read: false,
        createdAt: new Date().toISOString(),
      },
    ],
  }

  const [notifications, setNotifications] = useState<Notification[]>(dashboardData.notifications)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    const congratsTimer = setTimeout(() => {
      setShowCongratulations(false)
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearTimeout(congratsTimer)
    }
  }, [])

  const handleProfileClick = () => {
    setShowProfilePopup(true)
  }

  const boletosData = [
    {
      id: "1",
      parcela: "1/12",
      valor: 506.90,
      vencimento: "2025-10-15",
      status: "Pendente",
      investidor: {
        nome: "Maria Oliveira",
        banco: "Banco do Brasil",
        agencia: "1234-5",
        conta: "12345-6",
        cnpj: "12.345.678/0001-90"
      },
      codigoBarras: "23791234567890123456789012345678901234567890",
      qrCodePix: "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865405506.905802BR5913NexPeer LTDA6008Brasilia62070503***6304"
    },
    {
      id: "2", 
      parcela: "2/12",
      valor: 506.90,
      vencimento: "2025-10-01",
      status: "Vencido",
      investidor: {
        nome: "João Costa",
        banco: "Itaú",
        agencia: "5678-9",
        conta: "67890-1",
        cnpj: "98.765.432/0001-10"
      },
      codigoBarras: "34191234567890123456789012345678901234567890",
      qrCodePix: "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865405506.905802BR5913NexPeer LTDA6008Brasilia62070503***6304"
    },
    {
      id: "3",
      parcela: "3/12", 
      valor: 506.90,
      vencimento: "2025-10-08",
      status: "Próximo do vencimento",
      investidor: {
        nome: "Ana Silva",
        banco: "Bradesco",
        agencia: "9876-5",
        conta: "54321-0",
        cnpj: "11.222.333/0001-44"
      },
      codigoBarras: "23791234567890123456789012345678901234567890",
      qrCodePix: "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865405506.905802BR5913NexPeer LTDA6008Brasilia62070503***6304"
    }
  ]

  const handleViewBoleto = (boleto: any) => {
    setSelectedBoleto(boleto)
    setShowBoletoModal(true)
  }

  const handleNotificationClick = (notificationId: string) => {
    setNotifications((prev: Notification[]) => 
      prev.map((notif: Notification) => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev: Notification[]) => 
      prev.map((notif: Notification) => ({ ...notif, read: true }))
    )
  }

  const loansData = [
    {
      id: "1",
      amount: 5000,
      purpose: "Reforma da minha loja de artesanato",
      status: "Aprovado",
      progress: 100,
      term: 12,
      interestRate: 1.8,
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      monthlyPayment: 506.90,
      totalAmount: 6082.80,
      paidInstallments: 3,
      totalInstallments: 12,
      investors: [
        {
          name: "Maria Oliveira",
          email: "maria@investor.com",
          bank: "Banco do Brasil",
          account: "12345-6",
          investmentAmount: 5000,
          percentage: 100
        }
      ]
    },
    {
      id: "2",
      amount: 8000,
      purpose: "Capital de giro para expansão",
      status: "Aprovado",
      progress: 100,
      term: 18,
      interestRate: 2.1,
      startDate: "2024-10-01",
      endDate: "2026-04-01",
      monthlyPayment: 0,
      totalAmount: 0,
      paidInstallments: 0,
      totalInstallments: 18,
      investors: [
        {
          name: "Ana Silva",
          email: "ana@investor.com",
          bank: "Bradesco",
          account: "54321-0",
          investmentAmount: 5000,
          percentage: 62.5
        },
        {
          name: "Carlos Santos",
          email: "carlos@investor.com",
          bank: "Santander",
          account: "98765-4",
          investmentAmount: 3000,
          percentage: 37.5
        }
      ]
    }
  ]

  const handleViewLoanDetails = (loan: any) => {
    setSelectedLoan(loan)
    setShowLoanDetailsModal(true)
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
    <div className="min-h-screen bg-background pb-20">
      {showCongratulations && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full animate-fade-in-up shadow-2xl">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Parabéns!</h2>
              <p className="text-muted-foreground">
                Seu empréstimo de <span className="font-semibold text-foreground">R$ 5.000</span> foi 100% financiado.
              </p>
              <Button
                onClick={() => setShowCongratulations(false)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleProfileClick}
              className="w-10 h-10 bg-green-100 rounded-full hover:bg-green-200 border-2 border-green-300"
            >
              <User className="w-5 h-5 text-green-600" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Olá, {dashboardData.user.name}</h1>
              <p className="text-muted-foreground">Bem-vindo de volta!</p>
            </div>
          </div>
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowNotificationsPopup(true)}
              className="hover:bg-accent/10"
            >
              <Bell className="h-5 w-5" />
              {notifications.filter((n: Notification) => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Emprestado</p>
                  <p className="text-lg font-bold">R$ {dashboardData.metrics.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Empréstimos Ativos</p>
                  <p className="text-lg font-bold">{dashboardData.metrics.activeCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Score de Crédito</p>
                  <p className="text-lg font-bold">{dashboardData.metrics.creditScore}</p>
                  <p className="text-xs text-green-600">Excelente</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Limite Disponível</p>
                  <p className="text-lg font-bold">R$ {dashboardData.metrics.availableLimit.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Content */}
        {activeTab === "emprestimos-ativos" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Empréstimos Ativos</h2>
              <Badge variant="default">2 aprovado(s)</Badge>
            </div>

            <div className="space-y-4">
              {/* Empréstimo Aprovado e Ativo */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">R$ 5.000,00</h3>
                      <p className="text-sm text-muted-foreground">Reforma da minha loja de artesanato</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Aprovado
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso do Financiamento</span>
                      <span className="text-foreground font-medium">100%</span>
                    </div>
                    <Progress value={100} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>R$ 5.000</span>
                      <span>R$ 5.000</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-muted-foreground">Prazo:</span>
                      <span className="ml-2 text-foreground">12 meses</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Taxa:</span>
                      <span className="ml-2 text-foreground">1.8% a.m.</span>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewLoanDetails(loansData[0])}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    <Button size="sm" variant="default">
                      <FileText className="w-4 h-4 mr-2" />
                      Contrato
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Empréstimo Aprovado */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">R$ 8.000,00</h3>
                      <p className="text-sm text-muted-foreground">Capital de giro para expansão</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Aprovado
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso do Financiamento</span>
                      <span className="text-foreground font-medium">100%</span>
                    </div>
                    <Progress value={100} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>R$ 8.000</span>
                      <span>R$ 8.000</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-muted-foreground">Prazo:</span>
                      <span className="ml-2 text-foreground">18 meses</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Taxa:</span>
                      <span className="ml-2 text-foreground">2.1% a.m.</span>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewLoanDetails(loansData[1])}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    <Button size="sm" variant="default">
                      <FileText className="w-4 h-4 mr-2" />
                      Contrato
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "pedir-emprestimos" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Solicitar Empréstimo</h2>
              <Badge variant="outline">Novo</Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados do Empréstimo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Valor Solicitado</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">R$</span>
                    <input
                      type="number"
                      placeholder="0,00"
                      className="w-full pl-8 pr-4 py-2 border border-border rounded-md bg-background text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Finalidade</label>
                  <select className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground">
                    <option>Capital de giro</option>
                    <option>Expansão do negócio</option>
                    <option>Equipamentos</option>
                    <option>Reforma</option>
                    <option>Outros</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Prazo (meses)</label>
                  <input
                    type="number"
                    placeholder="12"
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  />
                </div>

                <Button className="w-full" size="lg">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Solicitar Análise
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "boletos" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Boletos Abertos</h2>
              <Badge variant="outline">3 disponíveis</Badge>
            </div>

            <div className="space-y-3">
              {/* Boleto Pendente */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Parcela 1/12</h3>
                        <p className="text-xs text-muted-foreground">Empréstimo R$ 5.000</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">R$ 506,90</p>
                      <p className="text-xs text-muted-foreground">Venc: 15/10/2025</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-600 font-medium">Pendente</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleViewBoleto(boletosData[0])}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Boleto
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Boleto Vencido */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Parcela 2/12</h3>
                        <p className="text-xs text-muted-foreground">Empréstimo R$ 5.000</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">R$ 506,90</p>
                      <p className="text-xs text-red-600">Venc: 01/10/2025</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600 font-medium">Vencido</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleViewBoleto(boletosData[1])}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Boleto
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Boleto Próximo do Vencimento */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Parcela 3/12</h3>
                        <p className="text-xs text-muted-foreground">Empréstimo R$ 5.000</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">R$ 506,90</p>
                      <p className="text-xs text-yellow-600">Venc: 08/10/2025</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-600 font-medium">Próximo do vencimento</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      onClick={() => handleViewBoleto(boletosData[2])}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Boleto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "notificacoes" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Notificações</h2>
            {dashboardData.notifications.map((notification) => (
              <Card key={notification.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "analises" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Análises</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              {/* Gráfico de Evolução de Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Evolução do Score (5 meses)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Score atual */}
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">780</div>
                      <div className="text-sm text-muted-foreground">Score Atual</div>
                    </div>

                    {/* Gráfico de linha SVG */}
                    <div className="h-48 w-full">
                      <svg width="100%" height="100%" viewBox="0 0 400 200" className="overflow-visible">
                        {/* Grid lines */}
                        <defs>
                          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--muted))" strokeWidth="0.5" opacity="0.3"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        
                        {/* Data points and line */}
                        <polyline
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points="40,160 120,140 200,120 280,100 360,80"
                        />
                        
                        {/* Data points */}
                        <circle cx="40" cy="160" r="4" fill="hsl(var(--primary))" />
                        <circle cx="120" cy="140" r="4" fill="hsl(var(--primary))" />
                        <circle cx="200" cy="120" r="4" fill="hsl(var(--primary))" />
                        <circle cx="280" cy="100" r="4" fill="hsl(var(--primary))" />
                        <circle cx="360" cy="80" r="6" fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth="2" />
                        
                        {/* Labels */}
                        <text x="40" y="190" textAnchor="middle" className="text-xs fill-muted-foreground">Jan</text>
                        <text x="120" y="190" textAnchor="middle" className="text-xs fill-muted-foreground">Fev</text>
                        <text x="200" y="190" textAnchor="middle" className="text-xs fill-muted-foreground">Mar</text>
                        <text x="280" y="190" textAnchor="middle" className="text-xs fill-muted-foreground">Abr</text>
                        <text x="360" y="190" textAnchor="middle" className="text-xs fill-muted-foreground">Mai</text>
                        
                        {/* Score values */}
                        <text x="40" y="150" textAnchor="middle" className="text-xs font-medium fill-foreground">720</text>
                        <text x="120" y="130" textAnchor="middle" className="text-xs font-medium fill-foreground">740</text>
                        <text x="200" y="110" textAnchor="middle" className="text-xs font-medium fill-foreground">750</text>
                        <text x="280" y="90" textAnchor="middle" className="text-xs font-medium fill-foreground">760</text>
                        <text x="360" y="70" textAnchor="middle" className="text-xs font-medium fill-primary">780</text>
                      </svg>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Evolução:</span>
                        <span className="text-green-600 font-medium">+60 pontos</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Distribuição de Risco */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Distribuição de Risco</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Risco Baixo */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Baixo Risco</span>
                      </div>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>

                    {/* Risco Médio */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Médio Risco</span>
                      </div>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>

                    {/* Risco Alto */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Alto Risco</span>
                      </div>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Classificação:</span>
                          <div className="font-medium text-green-600">Baixo Risco</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Probabilidade:</span>
                          <div className="font-medium">85%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumo das Análises */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo das Análises</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-muted/20 rounded-lg border border-border">
                    <div className="text-2xl font-bold text-foreground mb-1">780</div>
                    <div className="text-sm text-muted-foreground">Score Atual</div>
                    <div className="text-xs text-green-600 font-medium">Excelente</div>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-lg border border-border">
                    <div className="text-2xl font-bold text-foreground mb-1">0%</div>
                    <div className="text-sm text-muted-foreground">Inadimplência</div>
                    <div className="text-xs text-green-600 font-medium">Perfeito</div>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-lg border border-border">
                    <div className="text-2xl font-bold text-foreground mb-1">85%</div>
                    <div className="text-sm text-muted-foreground">Probabilidade</div>
                    <div className="text-xs text-green-600 font-medium">Alta</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "perfil" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Perfil da Conta</h2>

            <div className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{dashboardData.user.name}</h3>
                <p className="text-sm text-muted-foreground">Tomadora de Empréstimo</p>
                <div className="flex items-center space-x-2 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">Conta Verificada</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="text-foreground">{dashboardData.user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CPF:</span>
                    <span className="text-foreground">{dashboardData.user.cpf}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Telefone:</span>
                    <span className="text-foreground">{dashboardData.user.phone}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Status da Conta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Emprestado:</span>
                    <span className="text-foreground font-semibold">
                      R$ {dashboardData.metrics.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Empréstimos Ativos:</span>
                    <span className="text-foreground">{dashboardData.metrics.activeCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Histórico:</span>
                    <span className="text-green-600 font-medium">Em dia</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="flex items-center justify-around py-3 px-6">
          <button onClick={() => setActiveTab("pedir-emprestimos")} className="flex flex-col items-center space-y-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                activeTab === "pedir-emprestimos" ? "bg-primary text-primary-foreground shadow-lg scale-110" : "bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <DollarSign className={`w-5 h-5 ${activeTab === "pedir-emprestimos" ? "text-primary-foreground" : "text-muted-foreground"}`} />
            </div>
            <span
              className={`text-xs transition-all duration-200 ${activeTab === "pedir-emprestimos" ? "text-primary font-bold" : "text-muted-foreground"}`}
            >
              Pedir Empréstimo
            </span>
          </button>

          <button onClick={() => setActiveTab("boletos")} className="flex flex-col items-center space-y-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                activeTab === "boletos" ? "bg-primary text-primary-foreground shadow-lg scale-110" : "bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <FileText className={`w-5 h-5 ${activeTab === "boletos" ? "text-primary-foreground" : "text-muted-foreground"}`} />
            </div>
            <span
              className={`text-xs transition-all duration-200 ${activeTab === "boletos" ? "text-primary font-bold" : "text-muted-foreground"}`}
            >
              Boletos
            </span>
          </button>

          <button onClick={() => setActiveTab("emprestimos-ativos")} className="flex flex-col items-center space-y-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                activeTab === "emprestimos-ativos" ? "bg-primary text-primary-foreground shadow-lg scale-110" : "bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <TrendingUp className={`w-5 h-5 ${activeTab === "emprestimos-ativos" ? "text-primary-foreground" : "text-muted-foreground"}`} />
            </div>
            <span
              className={`text-xs transition-all duration-200 ${activeTab === "emprestimos-ativos" ? "text-primary font-bold" : "text-muted-foreground"}`}
            >
              Empréstimos Ativos
            </span>
          </button>

          <button onClick={() => setActiveTab("analises")} className="flex flex-col items-center space-y-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                activeTab === "analises" ? "bg-primary text-primary-foreground shadow-lg scale-110" : "bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <PieChart className={`w-5 h-5 ${activeTab === "analises" ? "text-primary-foreground" : "text-muted-foreground"}`} />
            </div>
            <span
              className={`text-xs transition-all duration-200 ${activeTab === "analises" ? "text-primary font-bold" : "text-muted-foreground"}`}
            >
              Análises
            </span>
          </button>
        </div>
      </div>

      {/* Modal do Boleto */}
      {showBoletoModal && selectedBoleto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Boleto de Pagamento</h2>
              <button
                onClick={() => setShowBoletoModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content - Boleto Febraban */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="bg-white border-2 border-gray-300 p-6 rounded-lg shadow-lg">
                {/* Cabeçalho do Boleto */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-lg">BB</span>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">BANCO DO BRASIL</h1>
                      <p className="text-sm text-gray-600">Agência: {selectedBoleto.investidor.agencia}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Vencimento</p>
                    <p className="text-lg font-bold text-gray-800">{new Date(selectedBoleto.vencimento).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                {/* Linha Digitável */}
                <div className="mb-6 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 mb-2">Linha Digitável:</p>
                  <p className="text-lg font-mono text-gray-800 tracking-wider">
                    {selectedBoleto.codigoBarras.match(/.{1,5}/g)?.join(' ')}
                  </p>
                </div>

                {/* Beneficiário */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Beneficiário</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nome:</p>
                      <p className="font-semibold text-gray-800">{selectedBoleto.investidor.nome}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CNPJ:</p>
                      <p className="font-semibold text-gray-800">{selectedBoleto.investidor.cnpj}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Banco:</p>
                      <p className="font-semibold text-gray-800">{selectedBoleto.investidor.banco}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Conta:</p>
                      <p className="font-semibold text-gray-800">{selectedBoleto.investidor.conta}</p>
                    </div>
                  </div>
                </div>

                {/* Valor e Instruções */}
                <div className="mb-6">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded">
                    <div>
                      <p className="text-sm text-gray-600">Valor do Documento</p>
                      <p className="text-2xl font-bold text-blue-800">R$ {selectedBoleto.valor.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Parcela</p>
                      <p className="text-lg font-bold text-blue-800">{selectedBoleto.parcela}</p>
                    </div>
                  </div>
                </div>

                {/* Código de Barras */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Código de Barras</h3>
                  <div className="bg-white border-2 border-gray-300 p-4 rounded text-center">
                    <div className="text-xs text-gray-600 mb-2">Representação visual do código de barras</div>
                    <div className="h-12 bg-gray-200 rounded flex items-center justify-center">
                      <div className="flex space-x-1">
                        {Array.from({length: 44}, (_, i) => (
                          <div key={i} className={`w-1 h-8 ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`}></div>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-mono">{selectedBoleto.codigoBarras}</p>
                  </div>
                </div>

                {/* QR Code PIX */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">PIX - Pagamento Instantâneo</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-gray-300 rounded mb-2"></div>
                        <p className="text-xs text-gray-600">QR Code</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">Escaneie o QR Code ou copie o código PIX:</p>
                      <div className="bg-gray-50 p-3 rounded border">
                        <p className="text-xs font-mono text-gray-700 break-all">{selectedBoleto.qrCodePix}</p>
                      </div>
                      <Button size="sm" className="mt-2">
                        <Download className="w-4 h-4 mr-2" />
                        Copiar Código PIX
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Instruções */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Instruções de Pagamento</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Pague até a data de vencimento para evitar juros</li>
                      <li>• Use o código de barras para pagamento em bancos</li>
                      <li>• Use o QR Code para pagamento via PIX</li>
                      <li>• Guarde o comprovante de pagamento</li>
                    </ul>
                  </div>
                </div>

                {/* Status */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      selectedBoleto.status === 'Pendente' ? 'bg-blue-500' : 
                      selectedBoleto.status === 'Vencido' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">Status: {selectedBoleto.status}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Emitido em: {new Date().toLocaleDateString('pt-BR')}
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
                  onClick={() => setShowBoletoModal(false)}
                >
                  Fechar
                </Button>
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Boleto
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup de Notificações */}
      {showNotificationsPopup && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Header do Popup */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Notificações</h2>
                  <p className="text-sm text-muted-foreground">
                    {notifications.filter((n: Notification) => !n.read).length} não lidas
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {notifications.filter((n: Notification) => !n.read).length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={markAllAsRead}
                    className="text-xs h-8"
                  >
                    Marcar todas como lidas
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotificationsPopup(false)}
                  className="h-8 w-8 hover:bg-muted"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Lista de Notificações */}
            <div className="max-h-[60vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Nenhuma notificação</h3>
                  <p className="text-sm text-muted-foreground">Você está em dia com todas as notificações</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification: Notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted/50 cursor-pointer transition-all duration-200 ${
                        !notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-muted/30'
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                          !notification.read ? 'bg-primary' : 'bg-muted-foreground/30'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className={`font-semibold text-sm ${
                                !notification.read ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {notification.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                {notification.message}
                              </p>
                              {notification.type && (
                                <div className="mt-3">
                                  <Badge 
                                    variant={notification.type === 'success' ? 'default' : 
                                            notification.type === 'warning' ? 'secondary' : 'destructive'}
                                    className="text-xs"
                                  >
                                    {notification.type === 'success' ? 'Sucesso' :
                                     notification.type === 'warning' ? 'Atenção' : 'Importante'}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end space-y-1 ml-3">
                              <span className="text-xs text-muted-foreground">
                                {new Date(notification.createdAt).toLocaleDateString('pt-BR')}
                              </span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer do Popup */}
            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>
                    {notifications.filter((n: Notification) => !n.read).length} não lidas
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotificationsPopup(false)}
                  className="h-8"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Empréstimo */}
      {showLoanDetailsModal && selectedLoan && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Detalhes do Empréstimo</h2>
                  <p className="text-sm text-muted-foreground">R$ {selectedLoan.amount.toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => setShowLoanDetailsModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Informações do Empréstimo */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Informações do Empréstimo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Valor:</span>
                      <p className="font-semibold text-foreground text-lg">R$ {selectedLoan.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Finalidade:</span>
                      <p className="font-medium text-foreground">{selectedLoan.purpose}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge className={selectedLoan.status === 'Aprovado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {selectedLoan.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Prazo:</span>
                      <p className="font-medium text-foreground">{selectedLoan.term} meses</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Taxa de Juros:</span>
                      <p className="font-medium text-foreground">{selectedLoan.interestRate}% a.m.</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Data de Início:</span>
                      <p className="font-medium text-foreground">{new Date(selectedLoan.startDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progresso do Financiamento */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Progresso do Financiamento</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">{selectedLoan.progress}%</span>
                    </div>
                    <Progress value={selectedLoan.progress} className="h-3" />
                  </div>
                  {selectedLoan.status === 'Aprovado' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Parcelas Pagas:</span>
                        <p className="font-medium text-foreground">{selectedLoan.paidInstallments}/{selectedLoan.totalInstallments}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Próximo Vencimento:</span>
                        <p className="font-medium text-foreground">15/11/2024</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Investidores */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Investidores</h3>
                <div className="space-y-4">
                  {selectedLoan.investors.map((investor: any, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">{investor.name}</h4>
                              <p className="text-sm text-muted-foreground">{investor.email}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Banco:</span>
                              <p className="font-medium text-foreground">{investor.bank}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Conta:</span>
                              <p className="font-medium text-foreground">{investor.account}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="bg-primary/10 rounded-lg p-3">
                            <p className="text-sm text-muted-foreground">Investimento</p>
                            <p className="font-bold text-lg text-primary">R$ {investor.investmentAmount.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{investor.percentage}% do total</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border bg-muted/30">
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowLoanDetailsModal(false)}
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
                  <h2 className="text-lg font-semibold text-foreground">Perfil do Usuário</h2>
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
                      <p className="font-medium text-foreground">{user?.name || "Usuário"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      <p className="font-medium text-foreground">{user?.email || "user@nexpeer.com"}</p>
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
                        {user?.profileType === "BORROWER" ? "Tomador" : "Investidor"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ativo
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Score de Crédito</span>
                      <span className="font-semibold text-foreground">780</span>
                    </div>
                  </div>
                </div>

                {/* Estatísticas */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Estatísticas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-foreground">R$ 5.000</div>
                      <div className="text-sm text-muted-foreground">Total Emprestado</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-foreground">1</div>
                      <div className="text-sm text-muted-foreground">Empréstimos Ativos</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-foreground">R$ 15.000</div>
                      <div className="text-sm text-muted-foreground">Limite Disponível</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-foreground">780</div>
                      <div className="text-sm text-muted-foreground">Score Atual</div>
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
                    // Aqui você pode adicionar a lógica de logout
                    // Por exemplo: logout() do useAuth
                    router.push("/login")
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
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
