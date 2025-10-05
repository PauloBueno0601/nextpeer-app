// Interface para empréstimo
export interface Loan {
  id: string
  borrowerId: string
  borrowerName: string
  amount: number
  interestRate: number
  term: number // meses
  purpose: string
  status: "pending" | "funding" | "active" | "completed" | "defaulted"
  creditScore: number
  monthlyIncome: number
  profession: string
  fundingProgress: number // percentual
  fundedAmount: number
  investors: LoanInvestor[]
  createdAt: Date
  updatedAt: Date
}

// Interface para investidor em empréstimo
export interface LoanInvestor {
  investorId: string
  investorName: string
  amount: number
  investedAt: Date
}

// Interface para parcela de empréstimo
export interface LoanInstallment {
  id: string
  loanId: string
  installmentNumber: number
  amount: number
  dueDate: Date
  paidDate?: Date
  status: "pending" | "paid" | "overdue"
}

// Classe modelo para operações com empréstimos
export class LoanModel {
  // Calcula valor da parcela mensal
  static calculateMonthlyPayment(amount: number, rate: number, term: number): number {
    const monthlyRate = rate / 100 / 12
    return (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)
  }

  // Gera parcelas do empréstimo
  static generateInstallments(loan: Loan): LoanInstallment[] {
    const monthlyPayment = this.calculateMonthlyPayment(loan.amount, loan.interestRate, loan.term)
    const installments: LoanInstallment[] = []

    for (let i = 1; i <= loan.term; i++) {
      const dueDate = new Date()
      dueDate.setMonth(dueDate.getMonth() + i)

      installments.push({
        id: `${loan.id}-${i}`,
        loanId: loan.id,
        installmentNumber: i,
        amount: monthlyPayment,
        dueDate,
        status: "pending",
      })
    }

    return installments
  }

  // Calcula nível de risco do empréstimo
  static calculateRisk(creditScore: number, monthlyIncome: number, requestedAmount: number): "low" | "medium" | "high" {
    const incomeRatio = requestedAmount / monthlyIncome

    if (creditScore >= 700 && incomeRatio <= 5) return "low"
    if (creditScore >= 600 && incomeRatio <= 8) return "medium"
    return "high"
  }
}
