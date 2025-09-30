"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation - in a real app, this would authenticate with a backend
    if (email && password) {
      // More robust email detection
      const emailLower = email.toLowerCase()

      if (emailLower.includes("lucas") || emailLower.includes("investidor")) {
        router.push("/investor/dashboard")
      } else {
        router.push("/dashboard")
      }
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
            <span className="relative z-10">NexPeer</span>
            <div className="absolute inset-0 bg-[#34D399]/15 blur-sm rounded-lg"></div>
          </h1>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="animate-fade-in-up w-full space-y-6" style={{ animationDelay: "0.4s" }}>
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
                className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary focus:bg-input focus:text-foreground"
                style={{ backgroundColor: 'hsl(var(--input))', color: 'hsl(var(--foreground))' }}
                required
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary focus:bg-input focus:text-foreground"
                style={{ backgroundColor: 'hsl(var(--input))', color: 'hsl(var(--foreground))' }}
                required
              />
            </div>

            {/* Forgot password link */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Esqueci minha senha?
              </Link>
            </div>
          </div>

          {/* Login button */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base font-semibold text-black shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            style={{ backgroundColor: 'oklch(0.65 0.15 160)' }}
          >
            Entrar
          </Button>
        </form>

        {/* Sign up link */}
            <div className="animate-fade-in-up text-center" style={{ animationDelay: "0.6s" }}>
              <p className="text-muted-foreground text-sm">
                Ainda não tem uma conta?{" "}
                <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Crie aqui
                </Link>
              </p>
            </div>
      </div>
    </div>
  )
}
