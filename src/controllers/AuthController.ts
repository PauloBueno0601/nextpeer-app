import { type User } from "@/types"
import { UserModel } from "@/models/User"

// Interface para credenciais de login
export interface LoginCredentials {
  email: string
  password: string
}

// Interface para dados de cadastro, estendendo LoginCredentials
export interface SignupData extends LoginCredentials {
  name: string
  cpf: string
  phone: string
  birthDate: string
  profileType: "BORROWER" | "INVESTOR"
}

// Controlador responsável por autenticação e autorização de usuários
export class AuthController {
  // Realiza login do usuário com email e senha
  static async login(credentials: LoginCredentials): Promise<{ user: User; token: string } | null> {
    try {
      // Faz requisição para API de login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()
      
      // Verifica se login foi bem-sucedido
      if (!data.success) {
        return null
      }

      // Retorna dados do usuário e token de autenticação
      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.nome,
          cpf: data.user.cpf,
          cnpj: data.user.cnpj,
          razaoSocial: data.user.razaoSocial,
          nomeFantasia: data.user.nomeFantasia,
          phone: data.user.telefone,
          profileType: data.user.tipoPerfil === 'TOMADOR' ? 'BORROWER' : 'INVESTOR',
          personType: data.user.tipoPessoa === 'FISICA' ? 'FISICA' : 'JURIDICA',
          kycStatus: data.user.statusKyc
        },
        token: data.token
      }
    } catch (error) {
      console.error('Erro no login:', error)
      return null
    }
  }

  // Realiza cadastro de novo usuário
  static async signup(data: SignupData): Promise<{ user: User; token: string }> {
    try {
      // Faz requisição para API de cadastro
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
      
      // Verifica se cadastro foi bem-sucedido
      if (!result.success) {
        throw new Error(result.error || 'Erro no cadastro')
      }

      // Retorna dados do usuário cadastrado e token
      return {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.nome,
          cpf: result.user.cpf,
          cnpj: result.user.cnpj,
          razaoSocial: result.user.razaoSocial,
          nomeFantasia: result.user.nomeFantasia,
          phone: result.user.telefone,
          profileType: result.user.tipoPerfil === 'TOMADOR' ? 'BORROWER' : 'INVESTOR',
          personType: result.user.tipoPessoa === 'FISICA' ? 'FISICA' : 'JURIDICA',
          kycStatus: result.user.statusKyc
        },
        token: result.token
      }
    } catch (error) {
      console.error('Erro no cadastro:', error)
      throw error
    }
  }

  // Busca dados do usuário atual usando token de autenticação
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

      // Retorna dados do usuário autenticado
      return {
        id: data.user.id,
        email: data.user.email,
        name: data.user.nome,
        cpf: data.user.cpf,
        cnpj: data.user.cnpj,
        razaoSocial: data.user.razaoSocial,
        nomeFantasia: data.user.nomeFantasia,
        phone: data.user.telefone,
        profileType: data.user.tipoPerfil === 'TOMADOR' ? 'BORROWER' : 'INVESTOR',
        personType: data.user.tipoPessoa === 'FISICA' ? 'FISICA' : 'JURIDICA',
        kycStatus: data.user.statusKyc
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      return null
    }
  }

  // Função obsoleta - não é mais necessária com integração do banco
  static getUserByEmail(email: string): User | null {
    return null
  }

  // Verifica se usuário é investidor
  static isInvestor(user: User): boolean {
    return user.profileType === "INVESTOR"
  }

  // Verifica se usuário é tomador de empréstimo
  static isBorrower(user: User): boolean {
    return user.profileType === "BORROWER"
  }
}
