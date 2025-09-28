import { type User as UserType } from "@/types"

export interface User extends UserType {
  cpf: string
  phone: string
  birthDate: string
  createdAt: Date
  updatedAt: Date
}

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

export interface InvestorProfile extends User {
  profileType: "INVESTOR"
  riskProfile: "conservative" | "moderate" | "aggressive"
  investmentCapacity: number
  totalInvested: number
  activeInvestments: number
  portfolioValue: number
}

export class UserModel {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static validateCPF(cpf: string): boolean {
    // Simplified CPF validation
    return cpf.replace(/\D/g, "").length === 11
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^$$\d{2}$$\s\d{4,5}-\d{4}$/
    return phoneRegex.test(phone)
  }

  static createUser(userData: Partial<User>): User {
    return {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData,
    } as User
  }
}
