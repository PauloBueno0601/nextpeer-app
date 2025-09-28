import { NextRequest, NextResponse } from 'next/server'
import { AuthController } from '@/controllers/AuthController'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const signupData = {
      email: body.email,
      password: body.password,
      name: body.name,
      cpf: body.cpf,
      phone: body.phone,
      birthDate: body.birthDate,
      profileType: "INVESTOR" as const
    }
    
    const result = await AuthController.signup(signupData)
    
    return NextResponse.json({
      success: true,
      user: result.user,
      token: result.token
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
