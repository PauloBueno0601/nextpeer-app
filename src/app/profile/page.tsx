"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Shield, 
  Camera, 
  Save, 
  ArrowLeft,
  Edit,
  CheckCircle,
  DollarSign,
  TrendingUp,
  BarChart3,
  FileText,
  Bell,
  Settings,
  LogOut
} from "lucide-react"

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const [userData, setUserData] = useState({
    name: "Usuário",
    email: "usuario@email.com",
    cpf: "000.000.000-00",
    phone: "(00) 00000-0000",
    profileType: "BORROWER" as const,
    profileImage: null,
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567"
  })

  const [editData, setEditData] = useState(userData)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleEdit = () => {
    setEditing(true)
    setEditData(userData)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUserData(editData)
      setEditing(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error("Erro ao salvar:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setEditData(userData)
  }

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogout = () => {
    // Limpar dados de autenticação
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    // Redirecionar para a tela inicial
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    )
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
            <h1 className="text-xl font-bold text-foreground">Meu Perfil</h1>
            <p className="text-sm text-muted-foreground">Gerencie suas informações pessoais</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
                  {userData.profileImage ? (
                    <img 
                      src={userData.profileImage} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-accent" />
                  )}
                </div>
                <Button
                  size="icon"
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary hover:bg-primary/90"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">{userData.name}</h2>
                <p className="text-muted-foreground">{userData.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={userData.profileType === "BORROWER" ? "default" : "secondary"}>
                    {userData.profileType === "BORROWER" ? "Tomador" : "Investidor"}
                  </Badge>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verificado
                  </Badge>
                </div>
              </div>
              {!editing && (
                <Button onClick={handleEdit} variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        {showSuccess && (
          <Card className="border-green-500 bg-green-500/10">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Perfil atualizado com sucesso!</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Informações Pessoais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                {editing ? (
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                ) : (
                  <p className="text-foreground">{userData.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {editing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                ) : (
                  <p className="text-foreground">{userData.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                {editing ? (
                  <Input
                    id="cpf"
                    value={editData.cpf}
                    onChange={(e) => handleInputChange("cpf", e.target.value)}
                  />
                ) : (
                  <p className="text-foreground">{userData.cpf}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                {editing ? (
                  <Input
                    id="phone"
                    value={editData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                ) : (
                  <p className="text-foreground">{userData.phone}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Endereço</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                {editing ? (
                  <Input
                    id="address"
                    value={editData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                ) : (
                  <p className="text-foreground">{userData.address}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                {editing ? (
                  <Input
                    id="city"
                    value={editData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                ) : (
                  <p className="text-foreground">{userData.city}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                {editing ? (
                  <Input
                    id="state"
                    value={editData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                ) : (
                  <p className="text-foreground">{userData.state}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                {editing ? (
                  <Input
                    id="zipCode"
                    value={editData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  />
                ) : (
                  <p className="text-foreground">{userData.zipCode}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Resumo Financeiro</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">R$ 5.000</p>
                <p className="text-sm text-muted-foreground">Total Emprestado</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">1</p>
                <p className="text-sm text-muted-foreground">Empréstimos Ativos</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">780</p>
                <p className="text-sm text-muted-foreground">Score de Crédito</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <CreditCard className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">R$ 15.000</p>
                <p className="text-sm text-muted-foreground">Limite Disponível</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
          {editing && (
            <div className="flex space-x-3">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
              <Button onClick={handleCancel} variant="outline">
                Cancelar
              </Button>
            </div>
          )}
          
          {/* Logout Button */}
          <div className="pt-4 border-t border-border">
            <Button 
              onClick={handleLogout} 
              variant="destructive" 
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair da Conta
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}