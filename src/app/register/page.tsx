"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Mail, Lock, Phone, CreditCard } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    phone: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Nome é obrigatório"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Sobrenome é obrigatório"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória"
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem"
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório"
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = "CPF deve estar no formato 000.000.000-00"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório"
    } else if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = "Telefone deve estar no formato (00) 00000-0000"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      // Simular delay de validação
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirecionar para a tela de signup com os dados
      const queryParams = new URLSearchParams({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        cpf: formData.cpf,
        phone: formData.phone
      })
      
      router.push(`/signup?${queryParams.toString()}`)
    } catch (error) {
      console.error("Erro no cadastro:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-md w-full space-y-6">
        {/* Header */}
        <div className="animate-fade-in-up text-center" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-center mb-4">
            <Link href="/login" className="absolute left-0">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground tracking-tight relative">
              <span className="relative z-10">NextPeer</span>
              <div className="absolute inset-0 bg-[#34D399]/15 blur-sm rounded-lg"></div>
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">Crie sua conta para começar</p>
        </div>

        {/* Registration form */}
        <Card className="w-full animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle className="text-xl text-center">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome e Sobrenome */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground font-medium">
                    Nome *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Seu nome"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`pl-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary ${
                        errors.firstName ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-xs">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground font-medium">
                    Sobrenome *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Seu sobrenome"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`pl-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary ${
                        errors.lastName ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-xs">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              {/* CPF */}
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-foreground font-medium">
                  CPF *
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="cpf"
                    name="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value)
                      setFormData(prev => ({ ...prev, cpf: formatted }))
                    }}
                    maxLength={14}
                    className={`pl-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary ${
                      errors.cpf ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.cpf && (
                  <p className="text-red-500 text-xs">{errors.cpf}</p>
                )}
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-medium">
                  Telefone *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value)
                      setFormData(prev => ({ ...prev, phone: formatted }))
                    }}
                    maxLength={15}
                    className={`pl-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary ${
                      errors.phone ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone}</p>
                )}
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Senha *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>

              {/* Confirmação de Senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                  Confirmar Senha *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pl-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full h-12 text-base font-semibold text-black shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                style={{ backgroundColor: 'oklch(0.65 0.15 160)' }}
              >
                {loading ? "Processando..." : "Continuar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Login link */}
        <div className="animate-fade-in-up text-center" style={{ animationDelay: "0.6s" }}>
          <p className="text-muted-foreground text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}