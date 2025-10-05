import { type Investment, InvestmentModel, type Portfolio } from "@/models/Investment"
import { LoanController } from "./LoanController"
import { NotificationModel } from "@/models/Notification"

// Controlador responsável por gerenciar investimentos
export class InvestmentController {
  private static investments: Investment[] = []

  // Cria novo investimento
  static async createInvestment(
    investorId: string,
    loanId: string,
    amount: number,
  ): Promise<{ success: boolean; investment?: Investment; error?: string }> {
    try {
      // Verifica se empréstimo existe e está disponível
      const loan = await LoanController.getLoanById(loanId)
      if (!loan) {
        return { success: false, error: "Empréstimo não encontrado" }
      }

      if (loan.status !== "funding" && loan.status !== "pending") {
        return { success: false, error: "Empréstimo não está disponível para investimento" }
      }

      // Verifica valor disponível para investimento
      const remainingAmount = loan.amount - loan.fundedAmount
      if (amount > remainingAmount) {
        return { success: false, error: `Valor máximo disponível: R$ ${remainingAmount.toLocaleString()}` }
      }

      // Cria objeto de investimento
      const investment: Investment = {
        id: Math.random().toString(36).substr(2, 9),
        investorId,
        loanId,
        amount,
        expectedReturn: InvestmentModel.calculateExpectedReturn(amount, loan.interestRate, loan.term),
        actualReturn: 0,
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + loan.term * 30 * 24 * 60 * 60 * 1000), // Aproximado
        monthlyReturns: [],
      }

      this.investments.push(investment)

      // Atualiza empréstimo com investimento
      const investmentSuccess = await LoanController.investInLoan(
        loanId,
        investorId,
        "Investidor", // Seria obtido dos dados do usuário
        amount,
      )

      if (!investmentSuccess) {
        // Remove investimento se atualização do empréstimo falhou
        this.investments = this.investments.filter((inv) => inv.id !== investment.id)
        return { success: false, error: "Erro ao processar investimento" }
      }

      // Cria notificação de investimento realizado
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

  // Busca investimentos de um investidor
  static async getInvestmentsByInvestor(investorId: string): Promise<Investment[]> {
    return this.investments.filter((investment) => investment.investorId === investorId)
  }

  // Busca investimento por ID
  static async getInvestmentById(id: string): Promise<Investment | null> {
    return this.investments.find((investment) => investment.id === id) || null
  }

  // Calcula portfólio do investidor
  static async calculatePortfolio(investorId: string): Promise<Portfolio> {
    const userInvestments = await this.getInvestmentsByInvestor(investorId)
    return InvestmentModel.calculatePortfolio(userInvestments)
  }

  // Processa retorno mensal de investimento
  static async processMonthlyReturn(
    investmentId: string,
    month: number,
    amount: number,
  ): Promise<{ success: boolean; error?: string }> {
    const investment = this.investments.find((inv) => inv.id === investmentId)
    if (!investment) {
      return { success: false, error: "Investimento não encontrado" }
    }

    // Atualiza retorno mensal
    const monthlyReturn = investment.monthlyReturns.find((mr) => mr.month === month)
    if (monthlyReturn) {
      monthlyReturn.receivedAmount = amount
      monthlyReturn.receivedDate = new Date()
      monthlyReturn.status = "received"
    }

    // Atualiza retorno total
    investment.actualReturn += amount

    // Cria notificação de pagamento recebido
    NotificationModel.notifyPaymentReceived(investment.investorId, amount, investment.loanId)

    return { success: true }
  }

  // Busca oportunidades de investimento disponíveis
  static async getAvailableInvestments(): Promise<any[]> {
    // Busca empréstimos disponíveis para investimento
    const availableLoans = await LoanController.getAvailableLoans()
    return availableLoans.map((loan) => ({
      ...loan,
      availableAmount: loan.amount - loan.fundedAmount,
      expectedReturn: InvestmentModel.calculateExpectedReturn(loan.amount, loan.interestRate, loan.term),
    }))
  }
}
