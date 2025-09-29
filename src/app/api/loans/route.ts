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

    const emprestimos = await prisma.emprestimo.findMany({
      where: { tomadorId: userId },
      include: {
        investimento: {
          include: {
            investidor: {
              select: {
                nome: true,
                sobrenome: true
              }
            }
          }
        },
        parcelas: {
          orderBy: { dataVencimento: 'asc' }
        }
      },
      orderBy: { criadoEm: 'desc' }
    })

    return NextResponse.json({
      success: true,
      emprestimos
    })

  } catch (error) {
    console.error('Erro ao buscar empréstimos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const { valorSolicitado, finalidade, prazoMeses, taxaJuros } = await request.json()

    if (!valorSolicitado || !finalidade || !prazoMeses || !taxaJuros) {
      return NextResponse.json(
        { success: false, error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar perfil do tomador para calcular score
    const perfilTomador = await prisma.perfilTomador.findUnique({
      where: { usuarioId: userId }
    })

    const scoreCredito = perfilTomador?.scoreCredito || Math.floor(Math.random() * 200) + 600

    // Criar empréstimo
    const emprestimo = await prisma.emprestimo.create({
      data: {
        tomadorId: userId,
        valorSolicitado: parseFloat(valorSolicitado),
        finalidade,
        prazoMeses: parseInt(prazoMeses),
        taxaJuros: parseFloat(taxaJuros)
      }
    })

    // Atualizar histórico de score
    await prisma.historicoScore.create({
      data: {
        usuarioId: userId,
        score: scoreCredito,
        fonteCalculo: 'solicitacao_emprestimo'
      }
    })

    // Log da ação
    await prisma.logAcao.create({
      data: {
        usuarioId: userId,
        acao: 'criar_emprestimo',
        descricao: `Solicitação de empréstimo de R$ ${valorSolicitado}`,
        ipOrigem: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      }
    })

    return NextResponse.json({
      success: true,
      emprestimo
    })

  } catch (error) {
    console.error('Erro ao criar empréstimo:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
