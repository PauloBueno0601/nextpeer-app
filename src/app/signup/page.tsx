"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { DollarSign, TrendingUp } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function SignupContent() {
  const searchParams = useSearchParams()
  
  // Dados recebidos do formulário anterior
  const firstName = searchParams.get("firstName") || ""
  const lastName = searchParams.get("lastName") || ""
  const email = searchParams.get("email") || ""
  const cpf = searchParams.get("cpf") || ""
  const phone = searchParams.get("phone") || ""

  // Construir URLs com os dados
  const borrowerUrl = `/verification?type=borrower&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&email=${encodeURIComponent(email)}&cpf=${encodeURIComponent(cpf)}&phone=${encodeURIComponent(phone)}`
  const investorUrl = `/verification?type=investor&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&email=${encodeURIComponent(email)}&cpf=${encodeURIComponent(cpf)}&phone=${encodeURIComponent(phone)}`

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-2xl" />

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-md w-full space-y-8">
        {/* Title */}
        <div className="animate-fade-in-up text-center">
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">Qual seu objetivo?</h1>
          <p className="text-muted-foreground text-sm">Escolha como você quer usar o NextPeer</p>
        </div>

        {/* Option cards */}
        <div className="animate-fade-in-up w-full space-y-4">
          {/* Borrower card */}
          <Link href={borrowerUrl} className="block">
            <Card className="border-border bg-card hover:bg-accent/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">Preciso de um empréstimo</h3>
                  <p className="text-sm text-muted-foreground">Tomador</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Investor card - Fixed to go through proper KYC flow */}
          <Link href={investorUrl} className="block">
            <Card className="border-border bg-card hover:bg-accent/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">Quero investir</h3>
                  <p className="text-sm text-muted-foreground">Investidor</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Back to login link */}
        <div className="animate-fade-in-up text-center">
          <p className="text-muted-foreground text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SignupContent />
    </Suspense>
  )
}
