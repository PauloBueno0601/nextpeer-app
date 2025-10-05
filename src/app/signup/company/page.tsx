"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Building2, User, Mail, Phone, FileText, Shield } from "lucide-react"
import Link from "next/link"
import { SuccessModal } from "@/components/ui/success-modal"

export default function CompanySignupPage() {
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successData, setSuccessData] = useState<{
    title: string
    message: string
    actionText: string
  } | null>(null)
  const [formData, setFormData] = useState({
    // Dados da empresa
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",
    email: "",
    telefone: "",
    
    // Dados do representante
    nomeRepresentante: "",
    sobrenomeRepresentante: "",
    cpfRepresentante: "",
    cargoRepresentante: "",
    
    // Dados de acesso
    senha: "",
    confirmarSenha: "",
    
    // Termos
    aceitarTermos: false,
    aceitarPrivacidade: false,
    aceitarComunicacoes: false
  })

  const router = useRouter()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  const validateForm = () => {
    if (!formData.razaoSocial || !formData.nomeFantasia || !formData.cnpj || !formData.email) {
      setSuccessData({
        title: "Campos Obrigatórios",
        message: "Por favor, preencha todos os campos obrigatórios da empresa.",
        actionText: "Entendi"
      })
      setShowSuccessModal(true)
      return false
    }
    
    if (!formData.nomeRepresentante || !formData.cpfRepresentante) {
      setSuccessData({
        title: "Dados do Representante",
        message: "Por favor, preencha os dados do representante legal da empresa.",
        actionText: "Entendi"
      })
      setShowSuccessModal(true)
      return false
    }
    
    if (formData.senha !== formData.confirmarSenha) {
      setSuccessData({
        title: "Senhas Diferentes",
        message: "As senhas não coincidem. Verifique e tente novamente.",
        actionText: "Entendi"
      })
      setShowSuccessModal(true)
      return false
    }
    
    if (formData.senha.length < 6) {
      setSuccessData({
        title: "Senha Muito Curta",
        message: "A senha deve ter pelo menos 6 caracteres para maior segurança.",
        actionText: "Entendi"
      })
      setShowSuccessModal(true)
      return false
    }
    
    if (!formData.aceitarTermos || !formData.aceitarPrivacidade) {
      setSuccessData({
        title: "Termos e Condições",
        message: "Você deve aceitar os termos de uso e política de privacidade para continuar.",
        actionText: "Entendi"
      })
      setShowSuccessModal(true)
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/register-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tipoPerfil: 'INVESTOR',
          tipoPessoa: 'JURIDICA'
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSuccessData({
          title: "Conta Empresa Criada!",
          message: "Sua conta empresa foi criada com sucesso. Clique em 'Ir para Dashboard' para continuar.",
          actionText: "Ir para Dashboard"
        })
        setShowSuccessModal(true)
        // Simular login automático
        localStorage.setItem('user', JSON.stringify(data.usuario))
      } else {
        setSuccessData({
          title: "Erro ao Criar Conta",
          message: data.error || "Ocorreu um erro ao criar sua conta. Tente novamente.",
          actionText: "Tentar Novamente"
        })
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error('Erro ao criar conta:', error)
      setSuccessData({
        title: "Erro Interno",
        message: "Ocorreu um erro interno. Tente novamente em alguns instantes.",
        actionText: "Tentar Novamente"
      })
      setShowSuccessModal(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="animate-fade-in-up text-center" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-center mb-4">
            <Link href="/login" className="absolute left-0">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground tracking-tight relative">
              <span className="relative z-10">NexPeer</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-xl" />
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Cadastro de Empresa</p>
          <p className="text-sm text-muted-foreground mt-2">Crie sua conta como investidor empresa</p>
        </div>

        {/* Form Card */}
        <Card className="animate-fade-in-up w-full shadow-xl border-0 bg-card/80 backdrop-blur-sm" style={{ animationDelay: "0.4s" }}>
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Dados da Empresa</CardTitle>
            <p className="text-muted-foreground mt-2">Preencha os dados da sua empresa para começar a investir</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados da Empresa */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Dados da Empresa</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="razaoSocial" className="text-sm font-medium text-foreground">
                      Razão Social *
                    </Label>
                    <Input
                      id="razaoSocial"
                      type="text"
                      value={formData.razaoSocial}
                      onChange={(e) => handleInputChange("razaoSocial", e.target.value)}
                      placeholder="Ex: NextPeer Tecnologia Ltda"
                      className="border-border focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nomeFantasia" className="text-sm font-medium text-foreground">
                      Nome da Empresa *
                    </Label>
                    <Input
                      id="nomeFantasia"
                      type="text"
                      value={formData.nomeFantasia}
                      onChange={(e) => handleInputChange("nomeFantasia", e.target.value)}
                      placeholder="Ex: NextPeer"
                      className="border-border focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cnpj" className="text-sm font-medium text-foreground">
                      CNPJ *
                    </Label>
                    <Input
                      id="cnpj"
                      type="text"
                      value={formData.cnpj}
                      onChange={(e) => handleInputChange("cnpj", formatCNPJ(e.target.value))}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                      className="border-border focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      E-mail da Empresa *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="contato@empresa.com"
                      className="border-border focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-sm font-medium text-foreground">
                      Telefone
                    </Label>
                    <Input
                      id="telefone"
                      type="text"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange("telefone", formatPhone(e.target.value))}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                      className="border-border focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Dados do Representante */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Representante Legal</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeRepresentante" className="text-sm font-medium text-foreground">
                      Nome *
                    </Label>
                    <Input
                      id="nomeRepresentante"
                      type="text"
                      value={formData.nomeRepresentante}
                      onChange={(e) => handleInputChange("nomeRepresentante", e.target.value)}
                      placeholder="Nome do representante"
                      className="border-border focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sobrenomeRepresentante" className="text-sm font-medium text-foreground">
                      Sobrenome
                    </Label>
                    <Input
                      id="sobrenomeRepresentante"
                      type="text"
                      value={formData.sobrenomeRepresentante}
                      onChange={(e) => handleInputChange("sobrenomeRepresentante", e.target.value)}
                      placeholder="Sobrenome do representante"
                      className="border-border focus:border-primary focus:ring-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cpfRepresentante" className="text-sm font-medium text-foreground">
                      CPF *
                    </Label>
                    <Input
                      id="cpfRepresentante"
                      type="text"
                      value={formData.cpfRepresentante}
                      onChange={(e) => handleInputChange("cpfRepresentante", formatCPF(e.target.value))}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className="border-border focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cargoRepresentante" className="text-sm font-medium text-foreground">
                      Cargo
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("cargoRepresentante", value)}>
                      <SelectTrigger className="border-border focus:border-primary focus:ring-primary">
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="socio">Sócio</SelectItem>
                        <SelectItem value="diretor">Diretor</SelectItem>
                        <SelectItem value="gerente">Gerente</SelectItem>
                        <SelectItem value="procurador">Procurador</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Dados de Acesso */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Dados de Acesso</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="senha" className="text-sm font-medium text-foreground">
                      Senha *
                    </Label>
                    <Input
                      id="senha"
                      type="password"
                      value={formData.senha}
                      onChange={(e) => handleInputChange("senha", e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="border-border focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha" className="text-sm font-medium text-foreground">
                      Confirmar Senha *
                    </Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      value={formData.confirmarSenha}
                      onChange={(e) => handleInputChange("confirmarSenha", e.target.value)}
                      placeholder="Digite a senha novamente"
                      className="border-border focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Termos e Condições */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Termos e Condições</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="aceitarTermos"
                      checked={formData.aceitarTermos}
                      onCheckedChange={(checked) => handleInputChange("aceitarTermos", checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="aceitarTermos" className="text-sm text-foreground">
                      Aceito os <a href="#" className="text-primary hover:underline">Termos de Uso</a> da plataforma *
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="aceitarPrivacidade"
                      checked={formData.aceitarPrivacidade}
                      onCheckedChange={(checked) => handleInputChange("aceitarPrivacidade", checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="aceitarPrivacidade" className="text-sm text-foreground">
                      Aceito a <a href="#" className="text-primary hover:underline">Política de Privacidade</a> *
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="aceitarComunicacoes"
                      checked={formData.aceitarComunicacoes}
                      onCheckedChange={(checked) => handleInputChange("aceitarComunicacoes", checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="aceitarComunicacoes" className="text-sm text-foreground">
                      Desejo receber comunicações sobre investimentos e novidades da plataforma
                    </Label>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 border-border hover:bg-muted"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {loading ? "Criando conta..." : "Criar Conta Empresa"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Sucesso */}
      {successData && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title={successData.title}
          message={successData.message}
          actionText={successData.actionText}
          type={successData.title.includes("Empresa") ? "company" : "success"}
          onAction={() => {
            if (successData.title.includes("Empresa")) {
              router.push("/company/dashboard")
            }
          }}
        />
      )}
    </div>
  )
}