"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (email) {
      // Simular envio de email de recuperação
      setIsSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-sm w-full space-y-8">
        {/* App name */}
        <div className="animate-fade-in-up text-center relative" style={{ animationDelay: "0.2s" }}>
          <h1 className="text-3xl font-bold text-foreground tracking-tight relative">
            <span className="relative z-10">NextPeer</span>
            <div className="absolute inset-0 bg-[#34D399]/15 blur-sm rounded-lg"></div>
          </h1>
        </div>

        {!isSubmitted ? (
          <>
            {/* Title */}
            <div className="animate-fade-in-up text-center" style={{ animationDelay: "0.4s" }}>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Esqueci minha senha</h2>
              <p className="text-muted-foreground text-sm">
                Digite seu email para receber instruções de recuperação
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="animate-fade-in-up w-full space-y-6" style={{ animationDelay: "0.6s" }}>
              <div className="space-y-4">
                {/* Email field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-semibold text-black shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                style={{ backgroundColor: 'oklch(0.65 0.15 160)' }}
              >
                Enviar instruções
              </Button>
            </form>
          </>
        ) : (
          <>
            {/* Success message */}
            <div className="animate-fade-in-up text-center" style={{ animationDelay: "0.4s" }}>
              <div className="w-16 h-16 bg-[#34D399]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#34D399]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Email enviado!</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Enviamos instruções de recuperação para <strong>{email}</strong>
              </p>
            </div>

            {/* Back to login button */}
            <div className="animate-fade-in-up w-full" style={{ animationDelay: "0.6s" }}>
              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full h-12 text-base font-semibold text-black shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ backgroundColor: 'oklch(0.65 0.15 160)' }}
                >
                  Voltar ao login
                </Button>
              </Link>
            </div>
          </>
        )}

        {/* Back to login link */}
        <div className="animate-fade-in-up text-center" style={{ animationDelay: "0.8s" }}>
          <p className="text-muted-foreground text-sm">
            Lembrou da senha?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
