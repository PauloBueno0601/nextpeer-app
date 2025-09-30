"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react"

export default function RiskProfilePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [completed, setCompleted] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const questions = [
    {
      id: 1,
      question: "Qual é o seu principal objetivo com este investimento?",
      options: [
        { value: "A", label: "Preservar meu capital com baixo risco", points: 1 },
        { value: "B", label: "Um equilíbrio entre segurança e rentabilidade", points: 2 },
        { value: "C", label: "Maximizar os retornos, mesmo que isso envolva mais risco", points: 3 }
      ]
    },
    {
      id: 2,
      question: "Por quanto tempo você pretende manter seus investimentos nesta plataforma?",
      options: [
        { value: "A", label: "Curto prazo (até 1 ano)", points: 1 },
        { value: "B", label: "Médio prazo (de 1 a 3 anos)", points: 2 },
        { value: "C", label: "Longo prazo (mais de 3 anos)", points: 3 }
      ]
    },
    {
      id: 3,
      question: "Como você reagiria se sua carteira de investimentos P2P caísse 20% em um mês devido à inadimplência?",
      options: [
        { value: "A", label: "Resgataria todo o dinheiro para evitar mais perdas", points: 1 },
        { value: "B", label: "Manteria a posição, pois entendo a volatilidade", points: 2 },
        { value: "C", label: "Investiria mais, aproveitando a oportunidade", points: 3 }
      ]
    },
    {
      id: 4,
      question: "Qual é a sua experiência com investimentos em renda fixa?",
      options: [
        { value: "A", label: "Nenhuma experiência", points: 1 },
        { value: "B", label: "Alguma experiência (1-3 anos)", points: 2 },
        { value: "C", label: "Experiência significativa (mais de 3 anos)", points: 3 }
      ]
    },
    {
      id: 5,
      question: "Qual é a sua experiência com investimentos em renda variável?",
      options: [
        { value: "A", label: "Nenhuma experiência", points: 1 },
        { value: "B", label: "Alguma experiência (1-3 anos)", points: 2 },
        { value: "C", label: "Experiência significativa (mais de 3 anos)", points: 3 }
      ]
    },
    {
      id: 6,
      question: "Que porcentagem da sua renda mensal você está disposto a investir?",
      options: [
        { value: "A", label: "Até 10% da renda", points: 1 },
        { value: "B", label: "10% a 25% da renda", points: 2 },
        { value: "C", label: "Mais de 25% da renda", points: 3 }
      ]
    },
    {
      id: 7,
      question: "Qual é a sua tolerância a perdas temporárias?",
      options: [
        { value: "A", label: "Não tolero perdas", points: 1 },
        { value: "B", label: "Tolero perdas de até 10%", points: 2 },
        { value: "C", label: "Tolero perdas de mais de 10%", points: 3 }
      ]
    }
  ]

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }))
  }

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Calcular e salvar o perfil de risco
      const riskProfile = calculateRiskProfile()
      
      // Buscar dados financeiros do localStorage ou usar valores padrão
      const financialData = JSON.parse(localStorage.getItem('financialData') || '{}')
      const rendaMensal = financialData.rendaMensal || 10000
      const patrimonio = financialData.patrimonio || 50000
      
      try {
        await saveRiskProfile(riskProfile, rendaMensal, patrimonio)
        setCompleted(true)
      } catch (error) {
        console.error('Erro ao salvar perfil:', error)
        // Ainda assim mostrar o resultado, mas sem salvar
        setCompleted(true)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const calculateRiskProfile = () => {
    let totalPoints = 0
    
    // Calcular pontos baseados nas respostas
    Object.entries(answers).forEach(([questionIndex, answerValue]) => {
      const question = questions[parseInt(questionIndex)]
      const selectedOption = question.options.find(opt => opt.value === answerValue)
      if (selectedOption) {
        totalPoints += selectedOption.points
      }
    })

    // Determinar perfil baseado na pontuação
    const maxPoints = questions.length * 3 // Máximo possível
    const percentage = (totalPoints / maxPoints) * 100

    if (percentage <= 40) return "CONSERVADOR"
    if (percentage <= 70) return "MODERADO"
    return "AGRESSIVO"
  }

  const calculateInvestmentLimit = (riskProfile: string, rendaMensal: number, patrimonio: number) => {
    // Fatores de segurança
    const fatorRenda = 0.3 // 30% da renda mensal
    const fatorPatrimonio = 0.1 // 10% do patrimônio

    // Calcular base segura
    const baseRenda = rendaMensal * fatorRenda
    const basePatrimonio = patrimonio * fatorPatrimonio
    const base = Math.min(baseRenda, basePatrimonio)

    // Multiplicadores por perfil
    const multiplicadores = {
      'CONSERVADOR': 0.5,
      'MODERADO': 1.0,
      'AGRESSIVO': 2.0
    }

    const multiplicador = multiplicadores[riskProfile as keyof typeof multiplicadores] || 1.0
    const limiteFinal = base * multiplicador

    return {
      base,
      multiplicador,
      limiteFinal: Math.round(limiteFinal),
      rendaMensal,
      patrimonio
    }
  }

  const saveRiskProfile = async (riskProfile: string, rendaMensal: number, patrimonio: number) => {
    setSaving(true)
    try {
      // Calcular limite de investimento
      const limiteCalculado = calculateInvestmentLimit(riskProfile, rendaMensal, patrimonio)

      const response = await fetch('/api/investor/risk-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          perfilRisco: riskProfile,
          rendaMensal: limiteCalculado.rendaMensal,
          patrimonioTotal: limiteCalculado.patrimonio,
          limiteInvestimento: limiteCalculado.limiteFinal
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Erro ao salvar perfil de risco')
      }

      return { ...data, limiteCalculado }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      throw error
    } finally {
      setSaving(false)
    }
  }

  const getRiskProfileInfo = (profile: string) => {
    switch (profile) {
      case "CONSERVADOR":
        return {
          title: "Perfil Conservador",
          description: "Você prefere segurança e estabilidade nos investimentos P2P.",
          characteristics: [
            "Baixa tolerância ao risco",
            "Foco na preservação do capital",
            "Investimentos de curto prazo",
            "Prioriza liquidez e segurança"
          ]
        }
      case "MODERADO":
        return {
          title: "Perfil Moderado",
          description: "Você busca equilíbrio entre risco e retorno nos investimentos P2P.",
          characteristics: [
            "Tolerância média ao risco",
            "Busca crescimento com segurança",
            "Diversificação de investimentos",
            "Horizonte de médio prazo"
          ]
        }
      case "AGRESSIVO":
        return {
          title: "Perfil Arrojado",
          description: "Você está disposto a assumir riscos para obter maiores retornos nos investimentos P2P.",
          characteristics: [
            "Alta tolerância ao risco",
            "Foco no crescimento do capital",
            "Aceita volatilidade do mercado",
            "Horizonte de longo prazo"
          ]
        }
      default:
        return { title: "", description: "", characteristics: [] }
    }
  }

  if (completed) {
    const riskProfile = calculateRiskProfile()
    const profileInfo = getRiskProfileInfo(riskProfile)
    
    // Buscar dados financeiros para calcular limite
    const financialData = JSON.parse(localStorage.getItem('financialData') || '{}')
    const rendaMensal = financialData.rendaMensal || 10000
    const patrimonio = financialData.patrimonio || 50000
    const limiteCalculado = calculateInvestmentLimit(riskProfile, rendaMensal, patrimonio)

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
              <h1 className="text-xl font-bold text-foreground">Perfil de Risco</h1>
              <p className="text-sm text-muted-foreground">Resultado da sua avaliação</p>
        </div>
      </div>
        </div>

        <div className="p-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
              <CardTitle className="text-2xl">{profileInfo.title}</CardTitle>
              <p className="text-muted-foreground">{profileInfo.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Características do seu perfil:</h3>
                <ul className="space-y-2">
                  {profileInfo.characteristics.map((characteristic, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-foreground">{characteristic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-muted/20 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3">Limite de Investimento Calculado:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Renda Mensal:</span>
                    <span className="text-foreground">R$ {rendaMensal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Patrimônio:</span>
                    <span className="text-foreground">R$ {patrimonio.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Segura:</span>
                    <span className="text-foreground">R$ {limiteCalculado.base.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Multiplicador:</span>
                    <span className="text-foreground">{limiteCalculado.multiplicador}x</span>
                  </div>
                  <div className="flex justify-between font-semibold text-primary border-t pt-2">
                    <span>Limite Total:</span>
                    <span>R$ {limiteCalculado.limiteFinal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  onClick={() => router.push("/investor/dashboard")}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Continuar para o Dashboard
                </Button>
            </div>
            </CardContent>
          </Card>
          </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

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
            <h1 className="text-xl font-bold text-foreground">Perfil de Risco</h1>
            <p className="text-sm text-muted-foreground">
              Questão {currentQuestion + 1} de {questions.length}
            </p>
                    </div>
                  </div>
                </div>

      <div className="p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={answers[currentQuestion] || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {currentQ.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Anterior
              </Button>
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion] || saving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  currentQuestion === questions.length - 1 ? "Finalizar" : "Próxima"
                )}
              </Button>
                </div>
              </CardContent>
            </Card>
          </div>
    </div>
  )
}