import { type User } from "@/types"
import { UserModel } from "@/models/User"

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData extends LoginCredentials {
  name: string
  cpf: string
  phone: string
  birthDate: string
  profileType: "BORROWER" | "INVESTOR"
}

export class AuthController {
  static async login(credentials: LoginCredentials): Promise<{ user: User; token: string } | null> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()
      
      if (!data.success) {
        return null
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.nome,
          cpf: data.user.cpf,
          phone: data.user.telefone,
          profileType: data.user.tipoPerfil === 'TOMADOR' ? 'BORROWER' : 'INVESTOR',
          kycStatus: data.user.statusKyc
        },
        token: data.token
      }
    } catch (error) {
      console.error('Erro no login:', error)
      return null
    }
  }

  static async signup(data: SignupData): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          nome: data.name,
          cpf: data.cpf,
          telefone: data.phone,
          tipoPerfil: data.profileType === 'BORROWER' ? 'TOMADOR' : 'INVESTOR'
        }),
      })

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Erro no cadastro')
      }

      return {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.nome,
          cpf: result.user.cpf,
          phone: result.user.telefone,
          profileType: result.user.tipoPerfil === 'TOMADOR' ? 'BORROWER' : 'INVESTOR',
          kycStatus: result.user.statusKyc
        },
        token: result.token
      }
    } catch (error) {
      console.error('Erro no cadastro:', error)
      throw error
    }
  }

  static async getCurrentUser(token: string): Promise<User | null> {
    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      
      if (!data.success) {
        return null
      }

      return {
        id: data.user.id,
        email: data.user.email,
        name: data.user.nome,
        cpf: data.user.cpf,
        phone: data.user.telefone,
        profileType: data.user.tipoPerfil === 'TOMADOR' ? 'BORROWER' : 'INVESTOR',
        kycStatus: data.user.statusKyc
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      return null
    }
  }

  static getUserByEmail(email: string): User | null {
    // Esta função não é mais necessária com a integração do banco
    return null
  }

  static isInvestor(user: User): boolean {
    return user.profileType === "INVESTOR"
  }

  static isBorrower(user: User): boolean {
    return user.profileType === "BORROWER"
  }
}
