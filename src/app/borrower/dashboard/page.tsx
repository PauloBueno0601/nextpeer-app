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

export default function BorrowerDashboard() {
  const [activeTab, setActiveTab] = useState("emprestimos-ativos")
  const [showCongratulations, setShowCongratulations] = useState(true)
  const [loading, setLoading] = useState(true)
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
              onClick={() => setActiveTab("notificacoes")}
              className="hover:bg-accent/10"
            >
              <Bell className="h-5 w-5" />
              {dashboardData.notifications.filter((n) => !n.read).length > 0 && (
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
              <Badge variant="default">2 ativo(s)</Badge>
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

                  <div className="flex justify-end">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Empréstimo Pendente */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">R$ 8.000,00</h3>
                      <p className="text-sm text-muted-foreground">Capital de giro para expansão</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="w-4 h-4 mr-1" />
                      Em Análise
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso do Financiamento</span>
                      <span className="text-foreground font-medium">60%</span>
                    </div>
                    <Progress value={60} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>R$ 4.800</span>
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

                  <div className="flex justify-end">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
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
                      <p className="text-xs text-muted-foreground">Venc: 15/01/2025</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-600 font-medium">Pendente</span>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
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
                      <p className="text-xs text-red-600">Venc: 10/01/2025</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600 font-medium">Vencido</span>
                    </div>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
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
                      <p className="text-xs text-yellow-600">Venc: 20/01/2025</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-600 font-medium">Próximo do vencimento</span>
                    </div>
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
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

                    {/* Gráfico simples de evolução */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Jan 2024</span>
                        <span className="font-medium">720</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Fev 2024</span>
                        <span className="font-medium">740</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '74%' }}></div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Mar 2024</span>
                        <span className="font-medium">750</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Abr 2024</span>
                        <span className="font-medium">760</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Mai 2024</span>
                        <span className="font-medium text-green-600">780</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
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
    </div>
  )
}
