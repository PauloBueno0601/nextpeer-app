"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingUp, DollarSign, Calendar, Eye } from "lucide-react"

export default function InvestmentsPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const investments = [
    {
      id: "1",
      loanId: "emp_1",
      borrowerName: "Ana C.",
      amount: 5000,
      expectedReturn: 1080,
      actualReturn: 0,
      status: "active",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2025-01-15"),
      interestRate: 1.8,
      term: 12,
      progress: 0,
    },
  ]

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

  const handleViewContract = async (inv: typeof investments[number]) => {
    setContractLoading(true)
    try {
      const resp = await fetch('/api/investor/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanId: inv.loanId,
          investorId: 'u_maria',
          principal: inv.amount,
          monthlyRate: inv.interestRate / 100,
          termMonths: inv.term
        })
      })
      const data = await resp.json()
      if (data?.success) {
        setContract(data.contract)
        setContractOpen(true)
      }
    } catch (e) {
      // noop MVP
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando investimentos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
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
            <h1 className="text-xl font-bold text-foreground">Meus Investimentos</h1>
            <p className="text-sm text-muted-foreground">Acompanhe seus investimentos ativos</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {investments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum investimento encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não possui investimentos. Que tal explorar as oportunidades disponíveis?
              </p>
              <Button
                onClick={() => router.push("/investor/opportunities")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Ver Oportunidades
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {investments.map((investment) => (
              <Card key={investment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">R$ {investment.amount.toLocaleString()}</CardTitle>
                    <Badge 
                      variant={investment.status === "active" ? "default" : "secondary"}
                      className={investment.status === "active" ? "bg-green-100 text-green-800" : ""}
                    >
                      {investment.status === "active" ? "Ativo" : "Finalizado"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Investimento em {investment.borrowerName}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso dos Pagamentos</span>
                      <span className="text-foreground font-medium">{investment.progress}%</span>
                    </div>
                    <Progress value={investment.progress} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0 de {investment.term} parcelas</span>
                      <span>R$ {investment.actualReturn.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Taxa</p>
                        <p className="font-medium">{investment.interestRate}% a.m.</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Prazo</p>
                        <p className="font-medium">{investment.term} meses</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Início:</span>
                      <span className="ml-2 text-foreground font-medium">
                        {investment.startDate.toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Vencimento:</span>
                      <span className="ml-2 text-foreground font-medium">
                        {investment.endDate.toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Retorno Esperado</p>
                      <p className="text-lg font-bold text-green-600">
                        R$ {investment.expectedReturn.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Retorno Atual</p>
                      <p className="text-lg font-bold text-foreground">
                        R$ {investment.actualReturn.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewContract(investment)} disabled={contractLoading}>
                      <Calendar className="w-4 h-4 mr-2" />
                      {contractLoading ? 'Carregando...' : 'Contrato'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {contractOpen && contract && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Contrato (simulado)</h2>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Empréstimo</span><span className="text-foreground">{contract.loanId}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Investidor</span><span className="text-foreground">{contract.investorId}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tomador</span><span className="text-foreground">{contract.borrowerId}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Hash</span><span className="text-foreground break-all">{contract.hashContrato}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Endereço (simulado)</span><span className="text-foreground break-all">{contract.simulatedAddress}</span></div>
              <div className="h-[70vh] border border-border rounded overflow-hidden">
                <iframe src={contract.pdfUrl} className="w-full h-full" title="Contrato PDF" />
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-between">
              <a href={contract.pdfUrl} download className="inline-flex items-center px-4 py-2 rounded-md border border-border text-sm">Salvar PDF</a>
              <Button onClick={() => setContractOpen(false)}>Fechar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
