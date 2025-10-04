"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"

// Contas de teste disponíveis
const TEST_ACCOUNTS = [
  {
    id: "borrower-ana",
    name: "Ana Silva",
    email: "ana@nexpeer.com",
    password: "123456",
    role: "Tomador",
    description: "Solicitante de empréstimo"
  },
  {
    id: "borrower-carlos",
    name: "Carlos Santos", 
    email: "carlos@nexpeer.com",
    password: "123456",
    role: "Tomador",
    description: "Solicitante de empréstimo"
  },
  {
    id: "investor-maria",
    name: "Maria Oliveira",
    email: "maria@nexpeer.com", 
    password: "123456",
    role: "Investidor",
    description: "Investidor ativo"
  },
  {
    id: "investor-joao",
    name: "João Costa",
    email: "joao@nexpeer.com",
    password: "123456", 
    role: "Investidor",
    description: "Investidor ativo"
  }
]

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showTestModal, setShowTestModal] = useState(false)

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

  const handleQuickLogin = async (account: typeof TEST_ACCOUNTS[0]) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await login(account.email, account.password)
      
      if (result) {
        // Redirecionar baseado no tipo de perfil
        if (result.user.profileType === "INVESTOR") {
          router.push("/investor/dashboard")
        } else {
          router.push("/borrower/dashboard")
        }
      } else {
        setError("Erro ao fazer login rápido")
      }
    } catch (err) {
      setError("Erro ao fazer login rápido. Tente novamente.")
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
                name="login-email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary focus:bg-input focus:text-foreground"
                style={{ backgroundColor: 'hsl(var(--input))', color: 'hsl(var(--foreground))' }}
                autoComplete="off"
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
                name="login-password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary focus:bg-input focus:text-foreground"
                style={{ backgroundColor: 'hsl(var(--input))', color: 'hsl(var(--foreground))' }}
                autoComplete="off"
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

        {/* Test credentials button */}
        <div className="animate-fade-in-up w-full" style={{ animationDelay: "0.6s" }}>
          <Button
            variant="outline"
            onClick={() => setShowTestModal(true)}
            className="w-full h-12 text-sm font-medium border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
          >
            Ver Dados de Teste
          </Button>
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

      {/* Test Accounts Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Contas de Teste</h2>
              <button
                onClick={() => setShowTestModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              <p className="text-sm text-muted-foreground mb-4">
                Clique em uma conta para fazer login automaticamente:
              </p>
              
              {TEST_ACCOUNTS.map((account) => (
                <div key={account.id} className="border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-foreground">{account.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      account.role === "Tomador" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-green-500/10 text-green-600"
                    }`}>
                      {account.role}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{account.email}</p>
                  <p className="text-xs text-muted-foreground mb-3">{account.description}</p>
                  <Button
                    onClick={() => handleQuickLogin(account)}
                    disabled={isLoading}
                    className="w-full h-8 text-xs"
                    size="sm"
                    style={{ backgroundColor: 'oklch(0.65 0.15 160)' }}
                  >
                    {isLoading ? "Entrando..." : "Fazer Login"}
                  </Button>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                Todas as contas usam a senha: <strong>123456</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
