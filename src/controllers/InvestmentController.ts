import { type Investment, InvestmentModel, type Portfolio } from "@/models/Investment"
import { LoanController } from "./LoanController"
import { NotificationModel } from "@/models/Notification"

export class InvestmentController {
  private static investments: Investment[] = []

  static async createInvestment(
    investorId: string,
    loanId: string,
    amount: number,
  ): Promise<{ success: boolean; investment?: Investment; error?: string }> {
    try {
      // Verify loan exists and is available for investment
      const loan = await LoanController.getLoanById(loanId)
      if (!loan) {
        return { success: false, error: "Empréstimo não encontrado" }
      }

      if (loan.status !== "funding" && loan.status !== "pending") {
        return { success: false, error: "Empréstimo não está disponível para investimento" }
      }

      const remainingAmount = loan.amount - loan.fundedAmount
      if (amount > remainingAmount) {
        return { success: false, error: `Valor máximo disponível: R$ ${remainingAmount.toLocaleString()}` }
      }

      // Create investment
      const investment: Investment = {
        id: Math.random().toString(36).substr(2, 9),
        investorId,
        loanId,
        amount,
        expectedReturn: InvestmentModel.calculateExpectedReturn(amount, loan.interestRate, loan.term),
        actualReturn: 0,
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + loan.term * 30 * 24 * 60 * 60 * 1000), // Approximate
        monthlyReturns: [],
      }

      this.investments.push(investment)

      // Update loan with investment
      const investmentSuccess = await LoanController.investInLoan(
        loanId,
        investorId,
        "Investidor", // Would get from user data
        amount,
      )

      if (!investmentSuccess) {
        // Remove investment if loan update failed
        this.investments = this.investments.filter((inv) => inv.id !== investment.id)
        return { success: false, error: "Erro ao processar investimento" }
      }

      // Create notification for successful investment
      NotificationModel.createNotification(
        investorId,
        "investment_opportunity",
        "Investimento Realizado",
        `Seu investimento de R$ ${amount.toLocaleString()} foi processado com sucesso.`,
        { investmentId: investment.id, loanId, amount },
      )

      return { success: true, investment }
    } catch (error) {
      return { success: false, error: "Erro interno do servidor" }
    }
  }

  static async getInvestmentsByInvestor(investorId: string): Promise<Investment[]> {
    return this.investments.filter((investment) => investment.investorId === investorId)
  }

  static async getInvestmentById(id: string): Promise<Investment | null> {
    return this.investments.find((investment) => investment.id === id) || null
  }

  static async calculatePortfolio(investorId: string): Promise<Portfolio> {
    const userInvestments = await this.getInvestmentsByInvestor(investorId)
    return InvestmentModel.calculatePortfolio(userInvestments)
  }

  static async processMonthlyReturn(
    investmentId: string,
    month: number,
    amount: number,
  ): Promise<{ success: boolean; error?: string }> {
    const investment = this.investments.find((inv) => inv.id === investmentId)
    if (!investment) {
      return { success: false, error: "Investimento não encontrado" }
    }

    // Update monthly return
    const monthlyReturn = investment.monthlyReturns.find((mr) => mr.month === month)
    if (monthlyReturn) {
      monthlyReturn.receivedAmount = amount
      monthlyReturn.receivedDate = new Date()
      monthlyReturn.status = "received"
    }

    // Update actual return
    investment.actualReturn += amount

    // Create notification
    NotificationModel.notifyPaymentReceived(investment.investorId, amount, investment.loanId)

    return { success: true }
  }

  static async getAvailableInvestments(): Promise<any[]> {
    // Get loans available for investment
    const availableLoans = await LoanController.getAvailableLoans()
    return availableLoans.map((loan) => ({
      ...loan,
      availableAmount: loan.amount - loan.fundedAmount,
      expectedReturn: InvestmentModel.calculateExpectedReturn(loan.amount, loan.interestRate, loan.term),
    }))
  }
}
