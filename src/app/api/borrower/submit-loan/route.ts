import { NextRequest, NextResponse } from 'next/server'
import { LoanController } from '@/controllers/LoanController'
import type { BorrowerProfile } from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const borrowerProfile: BorrowerProfile = {
      id: body.userId,
      name: body.name,
      email: body.email,
      profileType: "BORROWER",
      personType: "FISICA", // Adicionando propriedade obrigatória
      cpf: body.cpf,
      phone: body.phone,
      birthDate: body.birthDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      creditScore: body.creditScore,
      monthlyIncome: body.monthlyIncome,
      profession: body.profession,
      employmentStatus: body.employmentStatus,
      requestedAmount: body.requestedAmount,
      loanPurpose: body.loanPurpose,
      hasActiveLoans: body.hasActiveLoans
    }
    
    const loan = await LoanController.createLoan(borrowerProfile)
    
    return NextResponse.json({
      success: true,
      loan
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor' 
      },
      { status: 400 }
    )
  }
}
