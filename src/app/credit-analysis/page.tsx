"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CreditAnalysisPage() {
  const router = useRouter()

  const handleAuthorizeConnection = () => {
    router.push("/dashboard")
  }

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
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">Análise de Crédito Inteligente</h1>
          <p className="text-muted-foreground text-sm text-center leading-relaxed">
            Para um score mais justo e personalizado, conecte seus bancos via Open Finance de forma 100% segura
          </p>
        </div>

        {/* Security features */}
        <div className="animate-fade-in-up w-full" style={{ animationDelay: "0.4s" }}>
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-foreground">Conexão Segura e Criptografada</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-foreground">Dados Protegidos pelo Banco Central</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bank logos */}
        <div className="animate-fade-in-up w-full" style={{ animationDelay: "0.6s" }}>
          <p className="text-center text-sm text-muted-foreground mb-4">Bancos compatíveis:</p>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* Bank logo placeholders */}
            <div className="aspect-square bg-card border border-border rounded-lg flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground">ITAÚ</span>
            </div>
            <div className="aspect-square bg-card border border-border rounded-lg flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground">BB</span>
            </div>
            <div className="aspect-square bg-card border border-border rounded-lg flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground">CEF</span>
            </div>
            <div className="aspect-square bg-card border border-border rounded-lg flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground">NUBANK</span>
            </div>
            <div className="aspect-square bg-card border border-border rounded-lg flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground">SANTANDER</span>
            </div>
            <div className="aspect-square bg-card border border-border rounded-lg flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground">BRADESCO</span>
            </div>
            <div className="aspect-square bg-card border border-border rounded-lg flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground">INTER</span>
            </div>
            <div className="aspect-square bg-card border border-border rounded-lg flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground">+50</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="animate-fade-in-up w-full" style={{ animationDelay: "0.8s" }}>
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-base"
            onClick={handleAuthorizeConnection}
          >
            <Shield className="w-5 h-5 mr-2" />
            Autorizar Conexão Segura
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-3 leading-relaxed">
            Seus dados bancários são protegidos e nunca compartilhados. Você pode revogar o acesso a qualquer momento.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="animate-fade-in-up w-full" style={{ animationDelay: "1s" }}>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">Etapa 3 de 3</p>
        </div>
      </div>
    </div>
  )
}
