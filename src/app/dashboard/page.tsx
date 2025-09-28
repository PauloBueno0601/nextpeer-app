"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
} from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("emprestimos")
  const [showCongratulations, setShowCongratulations] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const dashboardData = {
    user: {
      id: "1",
      name: "Usuário",
      email: "usuario@email.com",
      cpf: "000.000.000-00",
      phone: "(00) 00000-0000",
      profileType: "BORROWER",
    },
    metrics: {
      totalAmount: 5000,
      activeCount: 1,
      creditScore: 780,
      availableLimit: 15000,
    },
    notifications: [] as Array<{
      id: string
      title: string
      message: string
      read: boolean
      createdAt: string
    }>,
  }

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
              className="w-10 h-10 bg-accent/10 rounded-full hover:bg-accent/20"
            >
              <User className="w-5 h-5 text-accent" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Olá, {dashboardData.user.name}</h1>
              <p className="text-muted-foreground">Bem-vinda de volta!</p>
            </div>
          </div>
          <div className="relative">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              {dashboardData.notifications.length > 0 && (
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
        {activeTab === "emprestimos" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Seus Empréstimos</h2>
              <Badge variant="default">{dashboardData.metrics.activeCount} ativo(s)</Badge>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">R$ 5.000,00</h3>
                    <p className="text-sm text-muted-foreground">Reforma da minha loja de artesanato</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Ativo
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

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Prazo:</span>
                    <span className="ml-2 text-foreground">12 meses</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Taxa:</span>
                    <span className="ml-2 text-foreground">1.8% a.m.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "boletos" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Boletos</h2>
              <Badge variant="outline">1 disponível</Badge>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Parcela 1/12</h3>
                      <p className="text-xs text-muted-foreground">Empréstimo R$ 5.000</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">R$ 506,90</p>
                    <p className="text-xs text-muted-foreground">Venc: 15/01/2025</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Disponível para pagamento</span>
                  </div>
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "notificacoes" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Notificações</h2>
            {dashboardData.notifications.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Nenhuma notificação no momento</p>
                </CardContent>
              </Card>
            ) : (
              dashboardData.notifications.map((notification) => (
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
              ))
            )}
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
          <button onClick={() => setActiveTab("emprestimos")} className="flex flex-col items-center space-y-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                activeTab === "emprestimos" 
                  ? "bg-primary text-primary-foreground shadow-lg scale-110" 
                  : "bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <TrendingUp className="w-5 h-5" />
            </div>
            <span
              className={`text-xs transition-all duration-200 ${
                activeTab === "emprestimos" 
                  ? "text-primary font-bold" 
                  : "text-muted-foreground"
              }`}
            >
              Empréstimos
            </span>
          </button>

          <button onClick={() => setActiveTab("boletos")} className="flex flex-col items-center space-y-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                activeTab === "boletos" 
                  ? "bg-primary text-primary-foreground shadow-lg scale-110" 
                  : "bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <span
              className={`text-xs transition-all duration-200 ${
                activeTab === "boletos" 
                  ? "text-primary font-bold" 
                  : "text-muted-foreground"
              }`}
            >
              Boletos
            </span>
          </button>

          <button onClick={() => setActiveTab("notificacoes")} className="flex flex-col items-center space-y-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                activeTab === "notificacoes" 
                  ? "bg-primary text-primary-foreground shadow-lg scale-110" 
                  : "bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
            </div>
            <span
              className={`text-xs transition-all duration-200 ${
                activeTab === "notificacoes" 
                  ? "text-primary font-bold" 
                  : "text-muted-foreground"
              }`}
            >
              Notificações
            </span>
          </button>

          <button onClick={() => setActiveTab("perfil")} className="flex flex-col items-center space-y-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                activeTab === "perfil" 
                  ? "bg-primary text-primary-foreground shadow-lg scale-110" 
                  : "bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <User className="w-5 h-5" />
            </div>
            <span
              className={`text-xs transition-all duration-200 ${
                activeTab === "perfil" 
                  ? "text-primary font-bold" 
                  : "text-muted-foreground"
              }`}
            >
              Perfil
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
