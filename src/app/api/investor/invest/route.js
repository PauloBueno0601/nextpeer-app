import { NextResponse } from 'next/server'
import { InvestmentController } from '@/controllers/InvestmentController'

export async function POST(request) {
  try {
    const { investorId, loanId, amount } = await request.json()
    
    const result = await InvestmentController.createInvestment(investorId, loanId, amount)
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}
