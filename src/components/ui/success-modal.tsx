"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Building2, ArrowRight } from "lucide-react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  actionText?: string
  onAction?: () => void
  type?: "success" | "company"
}

export function SuccessModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  actionText = "Continuar",
  onAction,
  type = "success"
}: SuccessModalProps) {
  if (!isOpen) return null

  const handleAction = () => {
    if (onAction) {
      onAction()
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          {/* Ícone de Sucesso */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {type === "company" ? (
              <Building2 className="w-10 h-10 text-green-600" />
            ) : (
              <CheckCircle className="w-10 h-10 text-green-600" />
            )}
          </div>

          {/* Título */}
          <h2 className="text-2xl font-bold text-foreground mb-3">
            {title}
          </h2>

          {/* Mensagem */}
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {message}
          </p>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border hover:bg-muted"
            >
              Fechar
            </Button>
            <Button
              onClick={handleAction}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {actionText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
