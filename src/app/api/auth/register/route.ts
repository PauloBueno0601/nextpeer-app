import { NextRequest, NextResponse } from 'next/server'
import { AuthController } from '@/controllers/AuthController'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const result = await AuthController.signup(body)
    
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
