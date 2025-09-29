import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const [userId] = Buffer.from(token, 'base64').toString().split(':')

    // Buscar empréstimos disponíveis para investimento
    const oportunidades = await prisma.emprestimo.findMany({
      where: {
        status: 'PENDENTE',
        tomador: {
          tipoPerfil: 'TOMADOR'
        }
      },
      include: {
        tomador: {
          select: {
            nome: true,
            sobrenome: true,
            cpf: true
          }
        },
        investimento: {
          where: {
            investidorId: userId
          }
        }
      },
      orderBy: { criadoEm: 'desc' }
    })

    // Filtrar oportunidades que o investidor ainda não investiu
    const oportunidadesDisponiveis = oportunidades.filter(emprestimo => 
      emprestimo.investimento === null
    )

    return NextResponse.json({
      success: true,
      oportunidades: oportunidadesDisponiveis
    })

  } catch (error) {
    console.error('Erro ao buscar oportunidades:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
