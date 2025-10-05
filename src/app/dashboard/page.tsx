"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DynamicScoreCard } from "@/components/DynamicScoreCard" // 1. IMPORTAMOS O NOVO COMPONENTE
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
  Loader2, // Ícone para o loading
} from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("emprestimos")
  const [showCongratulations, setShowCongratulations] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  
  // 2. GERENCIAMENTO DE DADOS (AGORA DINÂMICO)
  const [dashboardData, setDashboardData] = useState<any>(null) // Começa como nulo
  const [loading, setLoading] = useState(true)

  // Estados do formulário (sem alteração)
  const [loanAmount, setLoanAmount] = useState("")
  const [loanPurpose, setLoanPurpose] = useState("")
  const [loanTerm, setLoanTerm] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<string | null>(null)
  const router = useRouter()

  // 3. BUSCA DE DADOS (AGORA SIMULA UMA API)
  useEffect(() => {
    async function fetchDashboardData() {
      // No futuro, aqui você fará: const response = await fetch('/api/dashboard/user-id')
      // Por enquanto, vamos simular a busca para a "Ana Silva" (userId: "1") do seu seed.
      const mockData = {
        user: {
          id: "1", // ID importante para o DynamicScoreCard
          name: "Ana Silva",
          email: "ana@nexpeer.com",
          profileType: "TOMADOR",
        },
        metrics: {
          totalAmount: 5000,
          activeCount: 1,
          creditScore: 780, // Score tradicional
          availableLimit: 15000,
        },
        notifications: [
            { id: '1', title: 'Empréstimo Aprovado', message: 'Seu empréstimo de R$ 5.000 foi 100% financiado!', read: false, createdAt: new Date().toISOString() },
            { id: '2', title: 'Pagamento Confirmado', message: 'O pagamento da sua primeira parcela foi recebido com sucesso.', read: true, createdAt: new Date().toISOString() }
        ],
      };

      // Simula um delay da rede
      setTimeout(() => {
        setDashboardData(mockData);
        setLoading(false);
      }, 1500); // Aumentei um pouco para vermos o loading
    }

    fetchDashboardData();
  }, [])

  const handleProfileClick = () => {
    router.push("/profile")
  }

  // Tela de Loading agora verifica se os dados chegaram
  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ... seu código dos modais de Parabéns e Notificações (sem alteração) ... */}

      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <Button variant="ghost" size="icon" onClick={handleProfileClick} className="w-12 h-12 bg-primary/20 rounded-full">
               <User className="w-6 h-6 text-primary" />
             </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Olá, {dashboardData.user.name}</h1>
              <p className="text-muted-foreground">Bem-vinda de volta!</p>
            </div>
          </div>
          {/* ... botão de notificações ... */}
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {/* Card: Total Emprestado */}
            <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><DollarSign className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Total Emprestado</p><p className="text-lg font-bold">R$ {dashboardData.metrics.totalAmount.toLocaleString()}</p></div></div></CardContent></Card>
            {/* Card: Empréstimos Ativos */}
            <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><TrendingUp className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Empréstimos Ativos</p><p className="text-lg font-bold">{dashboardData.metrics.activeCount}</p></div></div></CardContent></Card>
            {/* Card: Score de Crédito */}
            <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><BarChart3 className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Score Tradicional</p><p className="text-lg font-bold">{dashboardData.metrics.creditScore}</p></div></div></CardContent></Card>
            {/* Card: Limite Disponível */}
            <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><CreditCard className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Limite Disponível</p><p className="text-lg font-bold">R$ {dashboardData.metrics.availableLimit.toLocaleString()}</p></div></div></CardContent></Card>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 pb-24">
        {/* Aba de Pedir Empréstimo (sem alteração na lógica) */}
        {activeTab === "emprestimos" && (
           <div className="space-y-4">{/* ... seu formulário de empréstimo ... */}</div>
        )}

        {/* Aba de Boletos (sem alteração na lógica) */}
        {activeTab === "boletos" && (
          <div className="space-y-4">{/* ... sua listagem de boletos ... */}</div>
        )}

        {/* Aba de Ativos (sem alteração na lógica) */}
        {activeTab === "ativos" && (
          <div className="space-y-6">{/* ... sua listagem de empréstimos ativos ... */}</div>
        )}

        {/* 4. INTEGRAÇÃO DO SCORE DINÂMICO NA ABA "ANÁLISES" */}
        {activeTab === "analises" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Análise de Perfil</h2>
            </div>
            
            {/* COMPONENTE INTEGRADO AQUI */}
            <DynamicScoreCard userId={dashboardData.user.id} />

            {/* Seus gráficos antigos podem continuar aqui, se quiser */}
            <Card>{/* ... Gráfico de Evolução ... */}</Card>
            <Card>{/* ... Gráfico de Distribuição ... */}</Card>
          </div>
        )}
      </div>

      {/* Bottom Tab Bar (sem alteração na lógica) */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border">
          {/* ... seus botões da tab bar ... */}
      </div>
    </div>
  )
}