// Importações necessárias para o sistema de empréstimos
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

// Função GET: Buscar empréstimos de um tomador
export async function GET(request: NextRequest) {
  try {
    // Verificar se o token de autorização foi fornecido
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Token de autorização necessário' },
        { status: 401 }
      )
    }

    // Extrair ID do usuário do token JWT
    const token = authHeader.split(' ')[1]
    const [userId] = Buffer.from(token, 'base64').toString().split(':')

    // Buscar todos os empréstimos do tomador com dados relacionados
    const emprestimos = await prisma.emprestimo.findMany({
      where: { tomadorId: userId }, // Filtrar apenas empréstimos do usuário logado
      include: {
        // Incluir dados do investimento e investidor
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
        // Incluir parcelas ordenadas por data de vencimento
        parcelas: {
          orderBy: { dataVencimento: 'asc' }
        }
      },
      orderBy: { criadoEm: 'desc' } // Ordenar por data de criação (mais recentes primeiro)
    })

    // Retornar lista de empréstimos
    return NextResponse.json({
      success: true,
      emprestimos
    })

  } catch (error) {
    // Log de erro e retorno de erro genérico
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
