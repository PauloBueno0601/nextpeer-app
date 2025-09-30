"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send } from "lucide-react"

export default function RequestLoanPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    amount: "",
    purpose: "",
    term: "",
    monthlyIncome: "",
    profession: "",
    employmentStatus: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simula envio do formulário
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Aqui você integraria com o LoanController
      // const result = await LoanController.createLoan(formData)
      
      router.push("/borrower/dashboard")
    } catch (error) {
      console.error("Erro ao solicitar empréstimo:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
            <h1 className="text-xl font-bold text-foreground">Solicitar Empréstimo</h1>
            <p className="text-sm text-muted-foreground">Preencha os dados para sua solicitação</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Dados da Solicitação</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor Solicitado (R$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    placeholder="Ex: 5000"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="term">Prazo (meses)</Label>
                  <Select value={formData.term} onValueChange={(value) => handleInputChange("term", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o prazo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 meses</SelectItem>
                      <SelectItem value="12">12 meses</SelectItem>
                      <SelectItem value="18">18 meses</SelectItem>
                      <SelectItem value="24">24 meses</SelectItem>
                      <SelectItem value="36">36 meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Finalidade do Empréstimo</Label>
                <Textarea
                  id="purpose"
                  placeholder="Descreva para que será usado o empréstimo..."
                  value={formData.purpose}
                  onChange={(e) => handleInputChange("purpose", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Renda Mensal (R$)</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    min="0"
                    placeholder="Ex: 8000"
                    value={formData.monthlyIncome}
                    onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profession">Profissão</Label>
                  <Input
                    id="profession"
                    placeholder="Ex: Desenvolvedor"
                    value={formData.profession}
                    onChange={(e) => handleInputChange("profession", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentStatus">Situação Profissional</Label>
                <Select value={formData.employmentStatus} onValueChange={(value) => handleInputChange("employmentStatus", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua situação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Empregado CLT</SelectItem>
                    <SelectItem value="self-employed">Autônomo</SelectItem>
                    <SelectItem value="business-owner">Empresário</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                    <SelectItem value="retired">Aposentado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Solicitar Empréstimo
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
