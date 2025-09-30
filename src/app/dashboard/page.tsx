"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  const [showNotifications, setShowNotifications] = useState(false)
  // Estado do formulário "Pedir Empréstimo"
  const [loanAmount, setLoanAmount] = useState("")
  const [loanPurpose, setLoanPurpose] = useState("")
  const [loanTerm, setLoanTerm] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<string | null>(null)
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
    <div className="min-h-screen bg-background">
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

      {/* Notification Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="max-w-md w-full animate-fade-in-up">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Notificações</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowNotifications(false)}>
                X
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
              {dashboardData.notifications.length === 0 ? (
                <p className="text-muted-foreground text-center">Nenhuma notificação no momento</p>
              ) : (
                dashboardData.notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3 p-3 bg-muted/10 rounded-lg">
                    <div className={`w-2 h-2 ${notification.read ? 'bg-muted' : 'bg-primary'} rounded-full mt-2 flex-shrink-0`}></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-foreground">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header - fixed */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleProfileClick}
              className="w-12 h-12 bg-primary/20 rounded-full hover:bg-primary/30 border-2 border-primary/30 hover:border-primary/50 transition-all duration-200"
            >
              <User className="w-6 h-6 text-primary" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Olá, {dashboardData.user.name}</h1>
              <p className="text-muted-foreground">Bem-vinda de volta!</p>
            </div>
          </div>
          <div className="relative">
            <Button variant="ghost" size="icon" onClick={() => setShowNotifications(true)}>
              <Bell className="h-5 w-5" />
              {dashboardData.notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </div>
        </div>

        {/* Metrics Cards - fixed */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
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
      </div>

      {/* Tab Content - dynamic */}
      <div className="px-6 pb-24">
        {activeTab === "emprestimos" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Pedir Empréstimo</h2>
              <Badge variant="outline">Análise de crédito</Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Solicitação de novo empréstimo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor solicitado (R$)</Label>
                  <Input id="valor" type="number" min="0" placeholder="5000" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="finalidade">Finalidade</Label>
                  <Input id="finalidade" type="text" placeholder="Ex: Reforma do negócio" value={loanPurpose} onChange={(e) => setLoanPurpose(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prazo">Prazo (meses)</Label>
                  <Input id="prazo" type="number" min="1" placeholder="12" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} />
                </div>

                <div className="pt-2">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-95 disabled:hover:scale-100 disabled:hover:shadow-none"
                    disabled={submitting || !loanAmount || !loanPurpose || !loanTerm}
                    onClick={async () => {
                      setSubmitting(true)
                      setSubmitResult(null)
                      try {
                        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
                        const res = await fetch('/api/loans', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                          },
                          body: JSON.stringify({
                            valorSolicitado: loanAmount,
                            finalidade: loanPurpose,
                            prazoMeses: loanTerm,
                            taxaJuros: 1.8,
                          }),
                        })
                        const data = await res.json()
                        if (!data.success) throw new Error(data.error || 'Falha ao enviar solicitação')
                        setSubmitResult('Solicitação enviada para análise com sucesso!')
                        setLoanAmount("")
                        setLoanPurpose("")
                        setLoanTerm("")
                      } catch (err: any) {
                        setSubmitResult(err.message || 'Erro ao solicitar análise')
                      } finally {
                        setSubmitting(false)
                      }
                    }}
                  >
                    {submitting ? 'Enviando...' : 'Solicitar Análise'}
                  </Button>
                </div>

                {submitResult && (
                  <div className="text-sm text-center text-muted-foreground">{submitResult}</div>
                )}
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

        {activeTab === "ativos" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Empréstimos Ativos</h2>
                <Badge variant="default">{dashboardData.metrics.activeCount}</Badge>
              </div>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Reforma da loja</p>
                      <p className="text-lg font-semibold">R$ 5.000,00</p>
                      <p className="text-xs text-muted-foreground mt-1">Investidor: Investidor X</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 flex items-center"><CheckCircle className="w-4 h-4 mr-1"/>Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href="#" target="_blank" rel="noreferrer">Contrato (PDF)</a>
                    </Button>
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-white">Detalhes</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Em análise pelos investidores</h3>
                <Badge variant="outline">1</Badge>
              </div>
              <Card>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Capital de giro</p>
                      <p className="text-lg font-semibold">R$ 8.000,00</p>
                      <p className="text-xs text-muted-foreground mt-1">Status: Em análise</p>
                    </div>
                    <Badge variant="outline">Pendente</Badge>
                  </div>
                  <div className="flex items-center justify-end">
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-white">Detalhes</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "analises" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Análises</h2>

            {/* Evolução do Score - últimos 5 meses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Evolução do Score (últimos 5 meses)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-3 items-end h-40">
                  {[
                    { m: "Mai", v: 720 },
                    { m: "Jun", v: 735 },
                    { m: "Jul", v: 750 },
                    { m: "Ago", v: 770 },
                    { m: "Set", v: 780 },
                  ].map((p) => (
                    <div key={p.m} className="flex flex-col items-center">
                      <div
                        className="w-8 bg-primary rounded-t"
                        style={{ height: `${(p.v / 800) * 100}%` }}
                      ></div>
                      <span className="mt-2 text-xs text-muted-foreground">{p.m}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Distribuição de Risco */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Distribuição de Risco</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Baixo", value: 55, color: "bg-green-500" },
                  { label: "Médio", value: 30, color: "bg-yellow-500" },
                  { label: "Alto", value: 15, color: "bg-red-500" },
                ].map((r) => (
                  <div key={r.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{r.label}</span>
                      <span className="text-foreground">{r.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted/30 rounded">
                      <div className={`h-2 rounded ${r.color}`} style={{ width: `${r.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
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
              <DollarSign className="w-5 h-5" />
            </div>
            <span
              className={`text-xs transition-all duration-200 ${
                activeTab === "emprestimos" ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              Pedir Empréstimo
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
                activeTab === "boletos" ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              Boletos
            </span>
          </button>

          <button onClick={() => setActiveTab("ativos")} className="flex flex-col items-center space-y-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                activeTab === "ativos"
                  ? "bg-primary text-primary-foreground shadow-lg scale-110"
                  : "bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <CheckCircle className="w-5 h-5" />
            </div>
            <span
              className={`text-xs transition-all duration-200 ${
                activeTab === "ativos" ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              Empréstimos Ativos
            </span>
          </button>

          <button onClick={() => setActiveTab("analises")} className="flex flex-col items-center space-y-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                activeTab === "analises"
                  ? "bg-primary text-primary-foreground shadow-lg scale-110"
                  : "bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
            </div>
            <span
              className={`text-xs transition-all duration-200 ${
                activeTab === "analises" ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              Análises
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
