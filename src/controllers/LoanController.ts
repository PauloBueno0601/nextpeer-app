import { type Loan, LoanModel, type LoanInstallment } from "@/models/Loan"
import type { BorrowerProfile } from "@/models/User"

// Controlador responsável por gerenciar empréstimos
export class LoanController {
  // Lista de empréstimos (dados mockados para demonstração)
  private static loans: Loan[] = [
    {
      id: "1",
      borrowerId: "1",
      borrowerName: "Ana Costa",
      amount: 5000,
      interestRate: 2.5,
      term: 12,
      purpose: "Capital de giro",
      status: "active",
      creditScore: 720,
      monthlyIncome: 8000,
      profession: "Desenvolvedora",
      fundingProgress: 100,
      fundedAmount: 5000,
      investors: [
        {
          investorId: "2",
          investorName: "Lucas Silva",
          amount: 5000,
          investedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  // Cria novo empréstimo baseado no perfil do tomador
  static async createLoan(borrowerProfile: BorrowerProfile): Promise<Loan> {
    const loan: Loan = {
      id: Math.random().toString(36).substr(2, 9),
      borrowerId: borrowerProfile.id,
      borrowerName: borrowerProfile.name,
      amount: borrowerProfile.requestedAmount,
      interestRate: 2.5, // Seria calculado baseado no risco
      term: 12,
      purpose: borrowerProfile.loanPurpose,
      status: "pending",
      creditScore: borrowerProfile.creditScore,
      monthlyIncome: borrowerProfile.monthlyIncome,
      profession: borrowerProfile.profession,
      fundingProgress: 0,
      fundedAmount: 0,
      investors: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.loans.push(loan)
    return loan
  }

  // Busca empréstimos de um tomador específico
  static async getLoansByBorrower(borrowerId: string): Promise<Loan[]> {
    return this.loans.filter((loan) => loan.borrowerId === borrowerId)
  }

  // Busca empréstimos disponíveis para investimento
  static async getAvailableLoans(): Promise<Loan[]> {
    return this.loans.filter((loan) => loan.status === "funding" || loan.status === "pending")
  }

  // Busca empréstimo por ID
  static async getLoanById(id: string): Promise<Loan | null> {
    return this.loans.find((loan) => loan.id === id) || null
  }

  // Realiza investimento em um empréstimo
  static async investInLoan(
    loanId: string,
    investorId: string,
    investorName: string,
    amount: number,
  ): Promise<boolean> {
    const loan = this.loans.find((l) => l.id === loanId)
    if (!loan) return false

    // Calcula valor disponível para investimento
    const remainingAmount = loan.amount - loan.fundedAmount
    const investmentAmount = Math.min(amount, remainingAmount)

    // Adiciona investidor à lista
    loan.investors.push({
      investorId,
      investorName,
      amount: investmentAmount,
      investedAt: new Date(),
    })

    // Atualiza valores do empréstimo
    loan.fundedAmount += investmentAmount
    loan.fundingProgress = (loan.fundedAmount / loan.amount) * 100

    // Ativa empréstimo se totalmente financiado
    if (loan.fundingProgress >= 100) {
      loan.status = "active"
    }

    return true
  }

  // Gera parcelas do empréstimo
  static async generateInstallments(loanId: string): Promise<LoanInstallment[]> {
    const loan = this.loans.find((l) => l.id === loanId)
    if (!loan) return []

    return LoanModel.generateInstallments(loan)
  }
}
