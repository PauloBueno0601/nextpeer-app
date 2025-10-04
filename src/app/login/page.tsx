"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await login(email, password)
      
      if (result) {
        // Redirecionar baseado no tipo de perfil
        if (result.user.profileType === "INVESTOR") {
          router.push("/investor/dashboard")
        } else {
          router.push("/borrower/dashboard")
        }
      } else {
        setError("Email ou senha inválidos")
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
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
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ana@nexpeer.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary focus:bg-input focus:text-foreground"
                style={{ backgroundColor: 'hsl(var(--input))', color: 'hsl(var(--foreground))' }}
                required
                disabled={isLoading}
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
                disabled={isLoading}
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
            className="w-full h-12 text-base font-semibold text-black shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'oklch(0.65 0.15 160)' }}
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        {/* Test credentials */}
        <div className="animate-fade-in-up bg-blue-50 border border-blue-200 rounded-lg p-4 w-full" style={{ animationDelay: "0.6s" }}>
          <h3 className="text-sm font-semibold text-blue-900 mb-2">🧪 Dados de Teste:</h3>
          <div className="space-y-1 text-xs text-blue-700">
            <div><strong>Tomador:</strong> ana@nexpeer.com / 123456</div>
            <div><strong>Investidor:</strong> maria@nexpeer.com / 123456</div>
          </div>
        </div>

        {/* Sign up link */}
        <div className="animate-fade-in-up text-center" style={{ animationDelay: "0.8s" }}>
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
