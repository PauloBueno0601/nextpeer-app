"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Plus, Eye, Download } from "lucide-react"

export default function MyLoansPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loans = [
    {
      id: "1",
      amount: 5000,
      purpose: "Reforma da minha loja de artesanato",
      status: "active",
      progress: 100,
      term: 12,
      interestRate: 1.8,
      fundedAmount: 5000,
      totalAmount: 5000,
      createdAt: new Date("2024-01-15"),
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando empréstimos...</p>
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
              onClick={() => router.back()}
              className="w-10 h-10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Meus Empréstimos</h1>
              <p className="text-sm text-muted-foreground">Gerencie seus empréstimos ativos</p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/borrower/request-loan")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Empréstimo
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {loans.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum empréstimo encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não possui empréstimos. Que tal solicitar o seu primeiro?
              </p>
              <Button
                onClick={() => router.push("/borrower/request-loan")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Solicitar Empréstimo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => (
              <Card key={loan.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">R$ {loan.amount.toLocaleString()}</CardTitle>
                    <Badge 
                      variant={loan.status === "active" ? "default" : "secondary"}
                      className={loan.status === "active" ? "bg-green-100 text-green-800" : ""}
                    >
                      {loan.status === "active" ? "Ativo" : "Pendente"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{loan.purpose}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso do Financiamento</span>
                      <span className="text-foreground font-medium">{loan.progress}%</span>
                    </div>
                    <Progress value={loan.progress} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>R$ {loan.fundedAmount.toLocaleString()}</span>
                      <span>R$ {loan.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Prazo:</span>
                      <span className="ml-2 text-foreground font-medium">{loan.term} meses</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Taxa:</span>
                      <span className="ml-2 text-foreground font-medium">{loan.interestRate}% a.m.</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Solicitado em:</span>
                      <span className="ml-2 text-foreground font-medium">
                        {loan.createdAt.toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="ml-2 text-foreground font-medium">
                        {loan.status === "active" ? "Em andamento" : "Aguardando"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    {loan.status === "active" && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Contrato
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
