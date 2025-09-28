export interface RiskQuestion {
  id: string
  question: string
  options: RiskOption[]
  weight: number
}

export interface RiskOption {
  id: string
  text: string
  score: number
}

export interface RiskAssessment {
  userId: string
  answers: Record<string, string>
  totalScore: number
  profile: "conservative" | "moderate" | "aggressive"
  completedAt: Date
}

export class RiskProfileModel {
  static readonly questions: RiskQuestion[] = [
    {
      id: "investment_experience",
      question: "Qual é a sua experiência com investimentos?",
      weight: 1.5,
      options: [
        { id: "beginner", text: "Iniciante - Nunca investi antes", score: 1 },
        { id: "basic", text: "Básico - Já investi em poupança/CDB", score: 2 },
        { id: "intermediate", text: "Intermediário - Invisto em ações e fundos", score: 3 },
        { id: "advanced", text: "Avançado - Tenho portfólio diversificado", score: 4 },
      ],
    },
    {
      id: "risk_tolerance",
      question: "Como você reagiria a uma perda de 20% no seu investimento?",
      weight: 2.0,
      options: [
        { id: "panic", text: "Venderia tudo imediatamente", score: 1 },
        { id: "worried", text: "Ficaria preocupado mas manteria", score: 2 },
        { id: "calm", text: "Manteria com tranquilidade", score: 3 },
        { id: "opportunity", text: "Veria como oportunidade de comprar mais", score: 4 },
      ],
    },
    {
      id: "investment_goal",
      question: "Qual é o seu principal objetivo de investimento?",
      weight: 1.2,
      options: [
        { id: "preservation", text: "Preservar capital", score: 1 },
        { id: "income", text: "Gerar renda mensal", score: 2 },
        { id: "growth", text: "Crescimento a longo prazo", score: 3 },
        { id: "aggressive_growth", text: "Crescimento agressivo", score: 4 },
      ],
    },
    {
      id: "time_horizon",
      question: "Por quanto tempo pretende manter os investimentos?",
      weight: 1.3,
      options: [
        { id: "short", text: "Menos de 1 ano", score: 1 },
        { id: "medium_short", text: "1 a 3 anos", score: 2 },
        { id: "medium_long", text: "3 a 10 anos", score: 3 },
        { id: "long", text: "Mais de 10 anos", score: 4 },
      ],
    },
    {
      id: "financial_situation",
      question: "Como está sua situação financeira atual?",
      weight: 1.4,
      options: [
        { id: "tight", text: "Justa - Preciso do dinheiro em breve", score: 1 },
        { id: "stable", text: "Estável - Tenho reserva de emergência", score: 2 },
        { id: "comfortable", text: "Confortável - Posso assumir alguns riscos", score: 3 },
        { id: "excellent", text: "Excelente - Posso assumir riscos altos", score: 4 },
      ],
    },
  ]

  static calculateRiskProfile(answers: Record<string, string>): RiskAssessment {
    let totalScore = 0
    let weightSum = 0

    for (const question of this.questions) {
      const answerId = answers[question.id]
      if (answerId) {
        const option = question.options.find((opt) => opt.id === answerId)
        if (option) {
          totalScore += option.score * question.weight
          weightSum += question.weight
        }
      }
    }

    const averageScore = totalScore / weightSum
    let profile: "conservative" | "moderate" | "aggressive"

    if (averageScore <= 2) {
      profile = "conservative"
    } else if (averageScore <= 3) {
      profile = "moderate"
    } else {
      profile = "aggressive"
    }

    return {
      userId: "",
      answers,
      totalScore: averageScore,
      profile,
      completedAt: new Date(),
    }
  }

  static getProfileDescription(profile: "conservative" | "moderate" | "aggressive"): string {
    switch (profile) {
      case "conservative":
        return "Perfil Conservador - Prioriza segurança e preservação do capital"
      case "moderate":
        return "Perfil Moderado - Busca equilíbrio entre segurança e rentabilidade"
      case "aggressive":
        return "Perfil Agressivo - Aceita riscos maiores em busca de rentabilidade"
    }
  }
}
