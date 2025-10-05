"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Plus, Eye, Download, FileText } from "lucide-react"

export default function MyLoansPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [showContractModal, setShowContractModal] = useState(false)
  const [contractData, setContractData] = useState<null | { pdfUrl: string; hashContrato: string; simulatedAddress: string }>(null)

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header com gradiente moderno */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="w-10 h-10 text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Meus Empréstimos</h1>
                <p className="text-blue-100 mt-1">Gerencie seus empréstimos ativos</p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/borrower/request-loan")}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Empréstimo
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {loans.length === 0 ? (
          <div className="flex justify-center">
            <Card className="max-w-md w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Nenhum empréstimo encontrado</h3>
                <p className="text-gray-600 mb-8">Você ainda não possui empréstimos ativos. Que tal solicitar seu primeiro empréstimo?</p>
                <Button 
                  onClick={() => router.push("/borrower/request-loan")} 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Solicitar Empréstimo
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {loans.map((loan) => (
              <Card key={loan.id} className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">R$ {loan.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                      <p className="text-gray-600 mt-1">{loan.purpose}</p>
                    </div>
                    <Badge className={`px-4 py-2 text-sm font-medium ${
                      loan.status === "active" 
                        ? "bg-green-100 text-green-800 border-green-200" 
                        : "bg-yellow-100 text-yellow-800 border-yellow-200"
                    }`}>
                      {loan.status === "active" ? "Ativo" : "Pendente"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Taxa de Juros</p>
                      <p className="text-xl font-bold text-blue-600">{loan.interestRate}% a.m.</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Prazo</p>
                      <p className="text-xl font-bold text-green-600">{loan.term} meses</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Data de Criação</p>
                      <p className="text-xl font-bold text-purple-600">{loan.createdAt.toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Progresso de Financiamento</span>
                      <span className="text-sm font-bold text-blue-600">{loan.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${loan.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">R$ {loan.fundedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} financiado</span>
                      <span className="text-gray-600">R$ {loan.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} total</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <Button variant="outline" size="sm" className="flex-1 border-gray-300 hover:bg-gray-50">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    {loan.status === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                        onClick={async () => {
                          try {
                            const resp = await fetch(`/api/contracts/${loan.id}`)
                            const data = await resp.json()
                            if (data?.success && data.contract) {
                              setContractData({
                                pdfUrl: data.contract.pdfUrl ?? `/api/contracts/${loan.id}/pdf?userType=tomador`,
                                hashContrato: data.contract.hashContrato ?? '—',
                                simulatedAddress: data.contract.simulatedAddress ?? '—'
                              })
                            } else {
                              setContractData({
                                pdfUrl: `/api/contracts/${loan.id}/pdf?userType=tomador`,
                                hashContrato: '—',
                                simulatedAddress: '—'
                              })
                            }
                          } catch (_) {
                            setContractData({
                              pdfUrl: `/api/contracts/${loan.id}/pdf?userType=tomador`,
                              hashContrato: '—',
                              simulatedAddress: '—'
                            })
                          }
                          setShowContractModal(true)
                        }}
                      >
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
      {showContractModal && contractData && (
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
          <div className="p-4 border-b border-border flex-shrink-0">
            <h2 className="text-lg font-semibold text-foreground">Contrato CCB</h2>
          </div>
          <div className="p-4 space-y-3 text-sm flex-shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Hash</span><span className="text-foreground break-all text-xs">{contractData.hashContrato}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Smart Contract</span><span className="text-foreground break-all text-xs">{contractData.simulatedAddress}</span></div>
            </div>
          </div>
          <div className="flex-1 min-h-0 p-4">
            <div className="h-full border border-border rounded overflow-hidden">
              <iframe src={contractData.pdfUrl} className="w-full h-full" title="Contrato PDF" />
            </div>
          </div>
          <div className="p-4 border-t border-border flex justify-between flex-shrink-0 bg-background">
            <a href={contractData.pdfUrl} download className="inline-flex items-center px-4 py-2 rounded-md border border-border text-sm hover:bg-muted">Salvar PDF</a>
            <Button onClick={() => setShowContractModal(false)}>Fechar</Button>
          </div>
        </div>
      )}
    </div>
  )
}
