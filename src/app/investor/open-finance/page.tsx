"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  Shield, 
  Building2, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  Banknote,
  TrendingUp,
  Users
} from "lucide-react"

export default function OpenFinancePage() {
  const [loading, setLoading] = useState(false)
  const [connectedBanks, setConnectedBanks] = useState<string[]>([])
  const [showDetails, setShowDetails] = useState(false)
  const router = useRouter()

  const availableBanks = [
    {
      id: "nubank",
      name: "Nubank",
      logo: (
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">N</span>
        </div>
      ),
      status: "disponivel",
      features: ["Conta corrente", "Cartão de crédito", "Investimentos"]
    },
    {
      id: "itau",
      name: "Itaú",
      logo: (
        <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">I</span>
        </div>
      ),
      status: "disponivel", 
      features: ["Conta corrente", "Poupança", "Investimentos", "Cartões"]
    },
    {
      id: "bradesco",
      name: "Bradesco",
      logo: (
        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">B</span>
        </div>
      ),
      status: "disponivel",
      features: ["Conta corrente", "Poupança", "Investimentos"]
    },
    {
      id: "santander",
      name: "Santander",
      logo: (
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
      ),
      status: "disponivel",
      features: ["Conta corrente", "Investimentos", "Cartões"]
    },
    {
      id: "caixa",
      name: "Caixa Econômica",
      logo: (
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">C</span>
        </div>
      ),
      status: "disponivel",
      features: ["Conta corrente", "Poupança", "FGTS"]
    },
    {
      id: "banco-do-brasil",
      name: "Banco do Brasil",
      logo: (
        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">BB</span>
        </div>
      ),
      status: "disponivel",
      features: ["Conta corrente", "Poupança", "Investimentos", "FGTS"]
    },
    {
      id: "btg",
      name: "BTG Pactual",
      logo: (
        <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">BTG</span>
        </div>
      ),
      status: "disponivel",
      features: ["Investimentos", "Cartões", "Conta digital"]
    },
    {
      id: "inter",
      name: "Banco Inter",
      logo: (
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">I</span>
        </div>
      ),
      status: "disponivel",
      features: ["Conta digital", "Investimentos", "Cartões"]
    },
    {
      id: "outros",
      name: "Outros Bancos",
      logo: (
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
          <Building2 className="w-4 h-4 text-white" />
        </div>
      ),
      status: "disponivel",
      features: ["Mais de 100 bancos", "Cooperativas", "Fintechs"]
    }
  ]

  const handleConnectBank = async (bankId: string) => {
    setLoading(true)
    try {
      // Simular conexão com banco
      await new Promise(resolve => setTimeout(resolve, 2000))
      setConnectedBanks(prev => [...prev, bankId])
    } catch (error) {
      console.error("Erro ao conectar banco:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOtherBanks = () => {
    // Simular abertura de modal ou página com outros bancos
    alert("Funcionalidade em desenvolvimento. Em breve você poderá conectar mais de 100 bancos, cooperativas e fintechs.")
  }

  const handleContinue = () => {
    router.push("/investor/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="w-10 h-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Open Finance</h1>
            <p className="text-sm text-muted-foreground">Conecte suas contas bancárias</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Progress */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Progresso da Configuração</h2>
              <Badge variant="outline">3 de 4</Badge>
            </div>
            <Progress value={75} className="mb-4" />
            <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Dados Pessoais</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Dados Financeiros</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Perfil de Risco</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 border-2 border-primary rounded-full"></div>
                <span>Open Finance</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-600 mb-2">Segurança Garantida</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Suas informações bancárias são protegidas com criptografia de ponta a ponta. 
                  Utilizamos as mesmas tecnologias de segurança dos bancos.
                </p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Criptografia SSL</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>Certificação BACEN</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Benefícios do Open Finance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <Banknote className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Análise Completa</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize sua situação financeira completa
                </p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Limites Maiores</h3>
                <p className="text-sm text-muted-foreground">
                  Acesse limites de investimento mais altos
                </p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Segurança</h3>
                <p className="text-sm text-muted-foreground">
                  Proteção total dos seus dados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Banks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-primary" />
              <span>Bancos Disponíveis</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Conecte suas contas para uma análise financeira completa
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableBanks.map((bank) => (
              <div key={bank.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors">
                <div className="flex items-center space-x-3">
                  <div>{bank.logo}</div>
                  <div>
                    <h3 className="font-semibold">{bank.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {bank.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {connectedBanks.includes(bank.id) ? (
                    <Badge className="bg-green-500/20 text-green-400 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Conectado
                    </Badge>
                  ) : (
                    <Button
                      onClick={bank.id === "outros" ? handleOtherBanks : () => handleConnectBank(bank.id)}
                      disabled={loading}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {loading ? "Conectando..." : bank.id === "outros" ? "Ver Opções" : "Conectar"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Connected Accounts Summary */}
        {connectedBanks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Contas Conectadas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {connectedBanks.map((bankId) => {
                  const bank = availableBanks.find(b => b.id === bankId)
                  return (
                    <div key={bankId} className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div>{bank?.logo}</div>
                        <div>
                          <h4 className="font-medium">{bank?.name}</h4>
                          <p className="text-sm text-muted-foreground">Conectado com sucesso</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDetails(!showDetails)}
                      >
                        {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleContinue}
            disabled={connectedBanks.length === 0}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {connectedBanks.length === 0 
              ? "Conecte pelo menos um banco para continuar"
              : "Continuar para Dashboard"
            }
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/investor/dashboard")}
          >
            Pular por enquanto
          </Button>
        </div>
      </div>
    </div>
  )
}
