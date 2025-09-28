"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RiskProfileModel } from "@/models/RiskProfile"

interface RiskProfileQuizProps {
  onComplete: (answers: Record<string, string>) => void
  className?: string
}

export function RiskProfileQuiz({ onComplete, className }: RiskProfileQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const questions = RiskProfileModel.questions
  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleAnswer = (questionId: string, optionId: string) => {
    const newAnswers = { ...answers, [questionId]: optionId }
    setAnswers(newAnswers)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setIsCompleted(true)
      onComplete(newAnswers)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  if (isCompleted) {
    const assessment = RiskProfileModel.calculateRiskProfile(answers)
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-center">Perfil de Risco Calculado</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Badge variant="default" className="text-lg px-4 py-2">
            {RiskProfileModel.getProfileDescription(assessment.profile)}
          </Badge>
          <p className="text-muted-foreground">Pontuação: {assessment.totalScore.toFixed(1)}/4.0</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>Questionário de Perfil de Risco</CardTitle>
            <Badge variant="outline">
              {currentQuestionIndex + 1} de {questions.length}
            </Badge>
          </div>
          <Progress value={progress} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="w-full text-left justify-start h-auto p-4 bg-transparent"
                onClick={() => handleAnswer(currentQuestion.id, option.id)}
              >
                {option.text}
              </Button>
            ))}
          </div>
        </div>

        {currentQuestionIndex > 0 && (
          <div className="flex justify-between">
            <Button variant="ghost" onClick={goToPreviousQuestion}>
              Anterior
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
