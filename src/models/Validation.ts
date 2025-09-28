export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export class ValidationModel {
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = []
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email) {
      errors.push("Email é obrigatório")
    } else if (!emailRegex.test(email)) {
      errors.push("Email deve ter um formato válido")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validateCPF(cpf: string): ValidationResult {
    const errors: string[] = []
    const cleanCPF = cpf.replace(/\D/g, "")

    if (!cpf) {
      errors.push("CPF é obrigatório")
    } else if (cleanCPF.length !== 11) {
      errors.push("CPF deve ter 11 dígitos")
    } else if (!/^\d{11}$/.test(cleanCPF)) {
      errors.push("CPF deve conter apenas números")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validatePhone(phone: string): ValidationResult {
    const errors: string[] = []
    const phoneRegex = /^$$\d{2}$$\s\d{4,5}-\d{4}$/

    if (!phone) {
      errors.push("Telefone é obrigatório")
    } else if (!phoneRegex.test(phone)) {
      errors.push("Telefone deve estar no formato (XX) XXXXX-XXXX")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validatePassword(password: string): ValidationResult {
    const errors: string[] = []

    if (!password) {
      errors.push("Senha é obrigatória")
    } else {
      if (password.length < 8) {
        errors.push("Senha deve ter pelo menos 8 caracteres")
      }
      if (!/[A-Z]/.test(password)) {
        errors.push("Senha deve ter pelo menos uma letra maiúscula")
      }
      if (!/[a-z]/.test(password)) {
        errors.push("Senha deve ter pelo menos uma letra minúscula")
      }
      if (!/\d/.test(password)) {
        errors.push("Senha deve ter pelo menos um número")
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validateLoanAmount(amount: number, maxAmount = 50000): ValidationResult {
    const errors: string[] = []

    if (!amount || amount <= 0) {
      errors.push("Valor do empréstimo deve ser maior que zero")
    } else if (amount > maxAmount) {
      errors.push(`Valor máximo permitido é R$ ${maxAmount.toLocaleString()}`)
    } else if (amount < 1000) {
      errors.push("Valor mínimo é R$ 1.000")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validateInvestmentAmount(amount: number, availableAmount: number): ValidationResult {
    const errors: string[] = []

    if (!amount || amount <= 0) {
      errors.push("Valor do investimento deve ser maior que zero")
    } else if (amount > availableAmount) {
      errors.push(`Valor disponível para investimento é R$ ${availableAmount.toLocaleString()}`)
    } else if (amount < 100) {
      errors.push("Valor mínimo de investimento é R$ 100")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
