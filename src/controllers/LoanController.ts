import { type Loan, LoanModel, type LoanInstallment } from "@/models/Loan"
import type { BorrowerProfile } from "@/models/User"

export class LoanController {
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

  static async createLoan(borrowerProfile: BorrowerProfile): Promise<Loan> {
    const loan: Loan = {
      id: Math.random().toString(36).substr(2, 9),
      borrowerId: borrowerProfile.id,
      borrowerName: borrowerProfile.name,
      amount: borrowerProfile.requestedAmount,
      interestRate: 2.5, // Would be calculated based on risk
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

  static async getLoansByBorrower(borrowerId: string): Promise<Loan[]> {
    return this.loans.filter((loan) => loan.borrowerId === borrowerId)
  }

  static async getAvailableLoans(): Promise<Loan[]> {
    return this.loans.filter((loan) => loan.status === "funding" || loan.status === "pending")
  }

  static async getLoanById(id: string): Promise<Loan | null> {
    return this.loans.find((loan) => loan.id === id) || null
  }

  static async investInLoan(
    loanId: string,
    investorId: string,
    investorName: string,
    amount: number,
  ): Promise<boolean> {
    const loan = this.loans.find((l) => l.id === loanId)
    if (!loan) return false

    const remainingAmount = loan.amount - loan.fundedAmount
    const investmentAmount = Math.min(amount, remainingAmount)

    loan.investors.push({
      investorId,
      investorName,
      amount: investmentAmount,
      investedAt: new Date(),
    })

    loan.fundedAmount += investmentAmount
    loan.fundingProgress = (loan.fundedAmount / loan.amount) * 100

    if (loan.fundingProgress >= 100) {
      loan.status = "active"
    }

    return true
  }

  static async generateInstallments(loanId: string): Promise<LoanInstallment[]> {
    const loan = this.loans.find((l) => l.id === loanId)
    if (!loan) return []

    return LoanModel.generateInstallments(loan)
  }
}
