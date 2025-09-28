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
  private static users: User[] = [
    // Usuários de exemplo removidos - agora será baseado no email cadastrado
  ]

  static async login(credentials: LoginCredentials): Promise<{ user: User; token: string } | null> {
    const user = this.users.find((u) => u.email === credentials.email)

    if (!user) {
      return null
    }

    // In a real app, you'd verify the password hash
    const token = btoa(`${user.id}:${Date.now()}`)

    return { user, token }
  }

  static async signup(data: SignupData): Promise<{ user: User; token: string }> {
    if (!UserModel.validateEmail(data.email)) {
      throw new Error("Email inválido")
    }

    if (!UserModel.validateCPF(data.cpf)) {
      throw new Error("CPF inválido")
    }

    const existingUser = this.users.find((u) => u.email === data.email)
    if (existingUser) {
      throw new Error("Email já cadastrado")
    }

    // Usar email como nome de usuário
    const emailName = data.email.split('@')[0]
    const displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1)

    const user = UserModel.createUser({
      email: data.email,
      name: displayName, // Usar email como nome
      cpf: data.cpf,
      phone: data.phone,
      birthDate: data.birthDate,
      profileType: data.profileType,
    })

    this.users.push(user)
    const token = btoa(`${user.id}:${Date.now()}`)

    return { user, token }
  }

  static async getCurrentUser(token: string): Promise<User | null> {
    try {
      const decoded = atob(token)
      const [userId] = decoded.split(":")
      return this.users.find((u) => u.id === userId) || null
    } catch {
      return null
    }
  }

  static getUserByEmail(email: string): User | null {
    return this.users.find((u) => u.email === email) || null
  }

  static isInvestor(user: User): boolean {
    return user.profileType === "INVESTOR"
  }

  static isBorrower(user: User): boolean {
    return user.profileType === "BORROWER"
  }
}
