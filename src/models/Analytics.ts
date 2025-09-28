export interface DashboardMetrics {
  userId: string
  userType: "borrower" | "investor"
  totalAmount: number
  activeCount: number
  completedCount: number
  averageReturn?: number
  creditScore?: number
  riskProfile?: string
  lastUpdated: Date
}

export interface MarketMetrics {
  totalLoansOriginated: number
  totalAmountFunded: number
  averageInterestRate: number
  defaultRate: number
  activeLoans: number
  totalInvestors: number
  totalBorrowers: number
}

export class AnalyticsModel {
  static calculateBorrowerMetrics(userId: string, loans: any[]): DashboardMetrics {
    const userLoans = loans.filter((loan) => loan.borrowerId === userId)
    const totalAmount = userLoans.reduce((sum, loan) => sum + loan.amount, 0)
    const activeCount = userLoans.filter((loan) => loan.status === "active").length
    const completedCount = userLoans.filter((loan) => loan.status === "completed").length

    return {
      userId,
      userType: "borrower",
      totalAmount,
      activeCount,
      completedCount,
      lastUpdated: new Date(),
    }
  }

  static calculateInvestorMetrics(userId: string, investments: any[]): DashboardMetrics {
    const userInvestments = investments.filter((inv) => inv.investorId === userId)
    const totalAmount = userInvestments.reduce((sum, inv) => sum + inv.amount, 0)
    const activeCount = userInvestments.filter((inv) => inv.status === "active").length
    const completedCount = userInvestments.filter((inv) => inv.status === "completed").length
    const averageReturn = userInvestments.reduce((sum, inv) => sum + inv.actualReturn, 0) / userInvestments.length || 0

    return {
      userId,
      userType: "investor",
      totalAmount,
      activeCount,
      completedCount,
      averageReturn,
      lastUpdated: new Date(),
    }
  }

  static calculateMarketMetrics(loans: any[], users: any[]): MarketMetrics {
    const totalLoansOriginated = loans.length
    const totalAmountFunded = loans.reduce((sum, loan) => sum + loan.fundedAmount, 0)
    const averageInterestRate = loans.reduce((sum, loan) => sum + loan.interestRate, 0) / loans.length || 0
    const defaultRate = (loans.filter((loan) => loan.status === "defaulted").length / loans.length) * 100 || 0
    const activeLoans = loans.filter((loan) => loan.status === "active").length
    const totalInvestors = users.filter((user) => user.type === "investor").length
    const totalBorrowers = users.filter((user) => user.type === "borrower").length

    return {
      totalLoansOriginated,
      totalAmountFunded,
      averageInterestRate,
      defaultRate,
      activeLoans,
      totalInvestors,
      totalBorrowers,
    }
  }
}
