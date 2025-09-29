"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Camera, Shield } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function VerificationContent() {
  const searchParams = useSearchParams()
  const userType = searchParams.get("type") // 'investor' or null (default to borrower)
  
  // Dados do usuário
  const firstName = searchParams.get("firstName") || ""
  const lastName = searchParams.get("lastName") || ""
  const email = searchParams.get("email") || ""
  const cpf = searchParams.get("cpf") || ""
  const phone = searchParams.get("phone") || ""

  const nextStep = userType === "investor" ? "/investor/financial-data" : "/credit-analysis"

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-2xl" />

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-md w-full space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up text-center" style={{ animationDelay: "0.2s" }}>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">Verificação de Segurança</h1>
          <p className="text-muted-foreground text-sm">Complete as duas etapas para prosseguir</p>
        </div>

        {/* User Info Summary */}
        {firstName && lastName && (
          <div className="animate-fade-in-up w-full" style={{ animationDelay: "0.3s" }}>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">Dados do Usuário</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Nome:</span> {firstName} {lastName}</p>
                  <p><span className="text-muted-foreground">Email:</span> {email}</p>
                  <p><span className="text-muted-foreground">CPF:</span> {cpf}</p>
                  <p><span className="text-muted-foreground">Telefone:</span> {phone}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Verification steps */}
        <div className="animate-fade-in-up w-full space-y-4" style={{ animationDelay: "0.4s" }}>
          {/* Step 1: Document verification */}
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">Documento de Identidade</h3>
                  <p className="text-sm text-muted-foreground">Escaneie seu RG ou CNH para verificação</p>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <FileText className="w-4 h-4 mr-2" />
                Escanear CNH/RG
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Facial verification */}
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-accent font-semibold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">Verificação de Identidade</h3>
                  <p className="text-sm text-muted-foreground">
                    Faça a verificação facial para confirmar sua identidade
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                asChild
              >
                <Link href={nextStep}>
                  <Camera className="w-4 h-4 mr-2" />
                  Fazer Verificação Facial
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Progress indicator */}
        <div className="animate-fade-in-up w-full" style={{ animationDelay: "0.6s" }}>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">Etapa 2 de 3</p>
        </div>
      </div>
    </div>
  )
}

export default function VerificationPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VerificationContent />
    </Suspense>
  )
}
