import { type User as UserType } from "@/types"

// Interface base para usuário
export interface User extends UserType {
  cpf: string
  phone: string
  birthDate: string
  createdAt: Date
  updatedAt: Date
}

// Interface para perfil de tomador de empréstimo
export interface BorrowerProfile extends User {
  profileType: "BORROWER"
  creditScore: number
  monthlyIncome: number
  profession: string
  employmentStatus: string
  requestedAmount: number
  loanPurpose: string
  hasActiveLoans: boolean
}

// Interface para perfil de investidor
export interface InvestorProfile extends User {
  profileType: "INVESTOR"
  riskProfile: "conservative" | "moderate" | "aggressive"
  investmentCapacity: number
  totalInvested: number
  activeInvestments: number
  portfolioValue: number
}

// Classe modelo para operações com usuários
export class UserModel {
  // Valida formato de email
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Valida formato de CPF (validação simplificada)
  static validateCPF(cpf: string): boolean {
    return cpf.replace(/\D/g, "").length === 11
  }

  // Valida formato de telefone
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^$$\d{2}$$\s\d{4,5}-\d{4}$/
    return phoneRegex.test(phone)
  }

  // Cria novo usuário com dados fornecidos
  static createUser(userData: Partial<User>): User {
    return {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData,
    } as User
  }
}
