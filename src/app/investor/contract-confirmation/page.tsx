"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, FileText, CheckCircle, Download } from "lucide-react"

export default function ContractConfirmationPage() {
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const router = useRouter()

  const contractData = {
    borrowerName: "Ana C.",
    amount: 5000,
    interestRate: 1.8,
    term: 12,
    monthlyPayment: 506.90,
    totalAmount: 6082.80,
    startDate: "15/01/2025",
    endDate: "15/01/2026"
  }

  const handleConfirm = async () => {
    if (!agreed) return

    setLoading(true)
    try {
      // Simula confirmação do contrato
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Aqui você integraria com o controller para confirmar o investimento
      // await InvestmentController.confirmContract(contractData)
      
      router.push("/investor/dashboard")
    } catch (error) {
      console.error("Erro ao confirmar contrato:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
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
            <h1 className="text-xl font-bold text-foreground">Confirmação de Contrato</h1>
            <p className="text-sm text-muted-foreground">Revise os termos antes de confirmar</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Contrato de Investimento</CardTitle>
                <p className="text-sm text-muted-foreground">Empréstimo para {contractData.borrowerName}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Valor Investido</p>
                <p className="text-lg font-bold text-foreground">
                  R$ {contractData.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Juros</p>
                <p className="text-lg font-bold text-foreground">
                  {contractData.interestRate}% a.m.
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prazo</p>
                <p className="text-lg font-bold text-foreground">
                  {contractData.term} meses
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parcela Mensal</p>
                <p className="text-lg font-bold text-foreground">
                  R$ {contractData.monthlyPayment.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Cronograma de Pagamentos</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data de Início:</span>
                  <span className="text-foreground">{contractData.startDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data de Vencimento:</span>
                  <span className="text-foreground">{contractData.endDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total a Receber:</span>
                  <span className="text-foreground font-semibold">
                    R$ {contractData.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Termos e Condições</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• O investimento será processado após a confirmação</p>
                <p>• Os pagamentos serão realizados mensalmente</p>
                <p>• Em caso de inadimplência, serão aplicadas as penalidades previstas</p>
                <p>• O contrato pode ser rescindido conforme as cláusulas acordadas</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreement"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
              />
              <Label htmlFor="agreement" className="text-sm">
                Li e aceito os termos e condições do contrato
              </Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  // Simula download do contrato
                  console.log("Download do contrato")
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Contrato
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!agreed || loading}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Confirmando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirmar Investimento
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}