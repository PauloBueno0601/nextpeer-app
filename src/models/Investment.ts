export interface Investment {
  id: string
  investorId: string
  loanId: string
  amount: number
  expectedReturn: number
  actualReturn: number
  status: "active" | "completed" | "defaulted"
  startDate: Date
  endDate: Date
  monthlyReturns: MonthlyReturn[]
}

export interface MonthlyReturn {
  month: number
  expectedAmount: number
  receivedAmount: number
  receivedDate?: Date
  status: "pending" | "received" | "late"
}

export interface Portfolio {
  investorId: string
  totalInvested: number
  totalReturns: number
  activeInvestments: number
  completedInvestments: number
  defaultedInvestments: number
  averageReturn: number
  riskDistribution: {
    low: number
    medium: number
    high: number
  }
}

export class InvestmentModel {
  static calculateExpectedReturn(amount: number, rate: number, term: number): number {
    return amount * Math.pow(1 + rate / 100 / 12, term) - amount
  }

  static calculatePortfolio(investments: Investment[]): Portfolio {
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
    const totalReturns = investments.reduce((sum, inv) => sum + inv.actualReturn, 0)

    return {
      investorId: investments[0]?.investorId || "",
      totalInvested,
      totalReturns,
      activeInvestments: investments.filter((inv) => inv.status === "active").length,
      completedInvestments: investments.filter((inv) => inv.status === "completed").length,
      defaultedInvestments: investments.filter((inv) => inv.status === "defaulted").length,
      averageReturn: totalReturns / investments.length || 0,
      riskDistribution: {
        low: 0, // Would be calculated based on loan risk
        medium: 0,
        high: 0,
      },
    }
  }
}
