"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"

export default function FinancialDataPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    monthlyIncome: "",
    monthlyExpenses: "",
    investmentCapacity: "",
    investmentGoals: "",
    experience: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Salvar dados financeiros no localStorage para usar na risk-profile
      const financialData = {
        rendaMensal: parseFloat(formData.monthlyIncome),
        gastosMensais: parseFloat(formData.monthlyExpenses),
        capacidadeInvestimento: parseFloat(formData.investmentCapacity),
        patrimonio: parseFloat(formData.monthlyIncome) * 12 * 2, // Estimativa baseada na renda
        objetivos: formData.investmentGoals,
        experiencia: formData.experience
      }
      
      localStorage.setItem('financialData', JSON.stringify(financialData))
      
      // Simula envio dos dados
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirecionar para o questionário de adequação
      router.push("/investor/risk-profile")
    } catch (error) {
      console.error("Erro ao salvar dados:", error)
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
            <h1 className="text-xl font-bold text-foreground">Dados Financeiros</h1>
            <p className="text-sm text-muted-foreground">Informe seus dados financeiros para análise</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Informações Financeiras</CardTitle>
            <p className="text-sm text-muted-foreground">
              Seu perfil de risco será determinado através de um questionário de adequação CVM
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Renda Mensal (R$)</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    min="0"
                    placeholder="Ex: 15000"
                    value={formData.monthlyIncome}
                    onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyExpenses">Gastos Mensais (R$)</Label>
                  <Input
                    id="monthlyExpenses"
                    type="number"
                    min="0"
                    placeholder="Ex: 8000"
                    value={formData.monthlyExpenses}
                    onChange={(e) => handleInputChange("monthlyExpenses", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="investmentCapacity">Capacidade de Investimento (R$)</Label>
                <Input
                  id="investmentCapacity"
                  type="number"
                  min="0"
                  placeholder="Ex: 5000"
                  value={formData.investmentCapacity}
                  onChange={(e) => handleInputChange("investmentCapacity", e.target.value)}
                  required
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="investmentGoals">Objetivos de Investimento</Label>
                <Select value={formData.investmentGoals} onValueChange={(value) => handleInputChange("investmentGoals", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seus objetivos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retirement">Aposentadoria</SelectItem>
                    <SelectItem value="education">Educação</SelectItem>
                    <SelectItem value="property">Compra de Imóvel</SelectItem>
                    <SelectItem value="business">Investimento em Negócio</SelectItem>
                    <SelectItem value="other">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experiência com Investimentos</Label>
                <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua experiência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Iniciante</SelectItem>
                    <SelectItem value="intermediate">Intermediário</SelectItem>
                    <SelectItem value="advanced">Avançado</SelectItem>
                    <SelectItem value="expert">Especialista</SelectItem>
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
                      <Save className="w-4 h-4 mr-2" />
                      Continuar para Questionário
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