"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle } from "lucide-react"

export default function RiskProfilePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [completed, setCompleted] = useState(false)
  const router = useRouter()

  const questions = [
    {
      id: 1,
      question: "Qual é o seu objetivo principal com os investimentos?",
      options: [
        { value: "conservative", label: "Preservar o capital com baixo risco" },
        { value: "moderate", label: "Crescimento moderado com risco controlado" },
        { value: "aggressive", label: "Máximo crescimento, aceito riscos altos" }
      ]
    },
    {
      id: 2,
      question: "Como você reagiria a uma queda de 20% no valor dos seus investimentos?",
      options: [
        { value: "conservative", label: "Venderia imediatamente para evitar mais perdas" },
        { value: "moderate", label: "Aguardaria para ver se recupera" },
        { value: "aggressive", label: "Aumentaria os investimentos aproveitando a oportunidade" }
      ]
    },
    {
      id: 3,
      question: "Qual é o seu horizonte de investimento?",
      options: [
        { value: "conservative", label: "Até 1 ano" },
        { value: "moderate", label: "1 a 3 anos" },
        { value: "aggressive", label: "Mais de 3 anos" }
      ]
    },
    {
      id: 4,
      question: "Que porcentagem da sua renda você está disposto a investir?",
      options: [
        { value: "conservative", label: "Até 10%" },
        { value: "moderate", label: "10% a 25%" },
        { value: "aggressive", label: "Mais de 25%" }
      ]
    }
  ]

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      } else {
      setCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const calculateRiskProfile = () => {
    const values = Object.values(answers)
    const conservative = values.filter(v => v === "conservative").length
    const moderate = values.filter(v => v === "moderate").length
    const aggressive = values.filter(v => v === "aggressive").length

    if (aggressive >= moderate && aggressive >= conservative) return "aggressive"
    if (moderate >= conservative) return "moderate"
    return "conservative"
  }

  const getRiskProfileInfo = (profile: string) => {
    switch (profile) {
      case "conservative":
        return {
          title: "Perfil Conservador",
          description: "Você prefere segurança e estabilidade nos investimentos.",
          characteristics: [
            "Baixa tolerância ao risco",
            "Foco na preservação do capital",
            "Retornos mais previsíveis",
            "Ideal para objetivos de curto prazo"
          ]
        }
      case "moderate":
        return {
          title: "Perfil Moderado",
          description: "Você busca equilíbrio entre risco e retorno.",
          characteristics: [
            "Tolerância média ao risco",
            "Busca crescimento com segurança",
            "Diversificação de investimentos",
            "Ideal para objetivos de médio prazo"
          ]
        }
      case "aggressive":
        return {
          title: "Perfil Agressivo",
          description: "Você está disposto a assumir riscos para obter maiores retornos.",
          characteristics: [
            "Alta tolerância ao risco",
            "Foco no crescimento do capital",
            "Aceita volatilidade",
            "Ideal para objetivos de longo prazo"
          ]
        }
      default:
        return { title: "", description: "", characteristics: [] }
    }
  }

  if (completed) {
    const riskProfile = calculateRiskProfile()
    const profileInfo = getRiskProfileInfo(riskProfile)

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
                disabled={!answers[currentQuestion]}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {currentQuestion === questions.length - 1 ? "Finalizar" : "Próxima"}
              </Button>
                </div>
              </CardContent>
            </Card>
          </div>
    </div>
  )
}