import { ValidationModel, type ValidationResult } from "@/models/Validation"

// Interface para campos de formulário
export interface FormField {
  name: string
  value: any
  validators: ((value: any) => ValidationResult)[]
  required?: boolean
}

// Interface para estado do formulário
export interface FormState {
  fields: Record<string, any>
  errors: Record<string, string>
  isValid: boolean
  isSubmitting: boolean
  isDirty: boolean
}

// Controlador responsável por gerenciar formulários e validações
export class FormController {
  private fields: FormField[] = []
  private state: FormState = {
    fields: {},
    errors: {},
    isValid: false,
    isSubmitting: false,
    isDirty: false,
  }

  // Construtor que inicializa o formulário com campos definidos
  constructor(fields: FormField[]) {
    this.fields = fields
    this.initializeState()
  }

  // Inicializa o estado do formulário com valores padrão
  private initializeState() {
    const initialFields: Record<string, any> = {}
    const initialErrors: Record<string, string> = {}

    // Configura campos iniciais e erros vazios
    this.fields.forEach((field) => {
      initialFields[field.name] = field.value || ""
      initialErrors[field.name] = ""
    })

    this.state = {
      fields: initialFields,
      errors: initialErrors,
      isValid: false,
      isSubmitting: false,
      isDirty: false,
    }
  }

  // Atualiza valor de um campo e valida
  updateField(name: string, value: any): FormState {
    this.state.fields[name] = value
    this.state.isDirty = true

    // Limpa erro anterior do campo
    this.state.errors[name] = ""

    // Valida o campo atualizado
    const field = this.fields.find((f) => f.name === name)
    if (field) {
      const validationResult = this.validateField(field, value)
      if (!validationResult.isValid) {
        this.state.errors[name] = validationResult.errors[0] || ""
      }
    }

    // Atualiza validade geral do formulário
    this.state.isValid = this.validateForm().isValid

    return { ...this.state }
  }

  // Valida um campo específico
  private validateField(field: FormField, value: any): ValidationResult {
    // Verifica se campo obrigatório está preenchido
    if (field.required && (!value || value.toString().trim() === "")) {
      return {
        isValid: false,
        errors: [`${field.name} é obrigatório`],
      }
    }

    // Executa validadores customizados
    for (const validator of field.validators) {
      const result = validator(value)
      if (!result.isValid) {
        return result
      }
    }

    return { isValid: true, errors: [] }
  }

  // Valida todo o formulário
  validateForm(): ValidationResult {
    const errors: string[] = []

    // Valida cada campo do formulário
    this.fields.forEach((field) => {
      const value = this.state.fields[field.name]
      const result = this.validateField(field, value)

      if (!result.isValid) {
        this.state.errors[field.name] = result.errors[0] || ""
        errors.push(...result.errors)
      } else {
        this.state.errors[field.name] = ""
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  // Submete o formulário com handler customizado
  async submit<T>(
    submitHandler: (data: Record<string, any>) => Promise<T>,
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    this.state.isSubmitting = true

    // Valida formulário antes de submeter
    const validationResult = this.validateForm()
    if (!validationResult.isValid) {
      this.state.isSubmitting = false
      return {
        success: false,
        error: "Por favor, corrija os erros no formulário",
      }
    }

    try {
      // Executa handler de submissão
      const result = await submitHandler(this.state.fields)
      this.state.isSubmitting = false
      return { success: true, data: result }
    } catch (error) {
      this.state.isSubmitting = false
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao enviar formulário",
      }
    }
  }

  // Retorna estado atual do formulário
  getState(): FormState {
    return { ...this.state }
  }

  // Reseta formulário para estado inicial
  reset() {
    this.initializeState()
  }

  // Métodos estáticos para criar formulários comuns
  // Cria formulário de login
  static createLoginForm(): FormController {
    return new FormController([
      {
        name: "email",
        value: "",
        required: true,
        validators: [ValidationModel.validateEmail],
      },
      {
        name: "password",
        value: "",
        required: true,
        validators: [ValidationModel.validatePassword],
      },
    ])
  }

  // Cria formulário de cadastro
  static createSignupForm(): FormController {
    return new FormController([
      {
        name: "name",
        value: "",
        required: true,
        validators: [
          (value) => ({
            isValid: value.length >= 2,
            errors: value.length < 2 ? ["Nome deve ter pelo menos 2 caracteres"] : [],
          }),
        ],
      },
      {
        name: "email",
        value: "",
        required: true,
        validators: [ValidationModel.validateEmail],
      },
      {
        name: "cpf",
        value: "",
        required: true,
        validators: [ValidationModel.validateCPF],
      },
      {
        name: "phone",
        value: "",
        required: true,
        validators: [ValidationModel.validatePhone],
      },
      {
        name: "password",
        value: "",
        required: true,
        validators: [ValidationModel.validatePassword],
      },
    ])
  }

  // Cria formulário de solicitação de empréstimo
  static createLoanRequestForm(): FormController {
    return new FormController([
      {
        name: "amount",
        value: 0,
        required: true,
        validators: [(value) => ValidationModel.validateLoanAmount(Number(value))],
      },
      {
        name: "purpose",
        value: "",
        required: true,
        validators: [
          (value) => ({
            isValid: value.length >= 10,
            errors: value.length < 10 ? ["Descreva o propósito com pelo menos 10 caracteres"] : [],
          }),
        ],
      },
      {
        name: "monthlyIncome",
        value: 0,
        required: true,
        validators: [
          (value) => ({
            isValid: Number(value) > 0,
            errors: Number(value) <= 0 ? ["Renda mensal deve ser maior que zero"] : [],
          }),
        ],
      },
    ])
  }
}
