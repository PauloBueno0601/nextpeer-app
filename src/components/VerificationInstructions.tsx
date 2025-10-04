"use client"

import { AlertCircle, Lightbulb, Camera, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface VerificationInstructionsProps {
  type: 'document' | 'selfie'
}

export function VerificationInstructions({ type }: VerificationInstructionsProps) {
  const isDocument = type === 'document'

  const documentInstructions = {
    title: "Escaneamento de Documento",
    icon: <FileText className="w-6 h-6" />,
    tips: [
      "Posicione o documento dentro do quadro retangular",
      "Certifique-se de que está em ambiente bem iluminado",
      "Mantenha o documento reto e sem dobras",
      "Evite reflexos e sombras sobre o documento",
      "Aguarde o reconhecimento automático dos dados"
    ],
    warnings: [
      "Ambiente claro é essencial para a legitimidade da verificação",
      "Documento deve estar legível e sem obstruções",
      "Certifique-se de que todos os dados estão visíveis"
    ]
  }

  const selfieInstructions = {
    title: "Verificação Facial",
    icon: <Camera className="w-6 h-6" />,
    tips: [
      "Posicione seu rosto no centro do círculo",
      "Mantenha boa iluminação no ambiente",
      "Olhe diretamente para a câmera",
      "Remova óculos escuros e acessórios se possível",
      "Mantenha uma expressão neutra"
    ],
    warnings: [
      "Certifique-se de estar em ambiente bem iluminado",
      "Evite sombras no rosto",
      "Mantenha o rosto centralizado na tela"
    ]
  }

  const instructions = isDocument ? documentInstructions : selfieInstructions

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            {instructions.icon}
          </div>
          
          <div className="flex-1 space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                {instructions.title}
              </h4>
              
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-blue-800 mb-1">
                      Instruções:
                    </p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      {instructions.tips.map((tip, index) => (
                        <li key={index}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-orange-800 mb-1">
                      Importante:
                    </p>
                    <ul className="text-xs text-orange-700 space-y-1">
                      {instructions.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
