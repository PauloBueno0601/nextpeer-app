// Importações necessárias para o sistema de investimentos
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

// Função GET: Buscar investimentos de um investidor
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

    // Buscar todos os investimentos do investidor com dados relacionados
    const investimentos = await prisma.investimento.findMany({
      where: { investidorId: userId }, // Filtrar apenas investimentos do usuário logado
      include: {
        emprestimo: {
          include: {
            tomador: {
              select: {
                nome: true,
                sobrenome: true
              }
            }
          }
        }
      },
      orderBy: { criadoEm: 'desc' } // Ordenar por data de criação (mais recentes primeiro)
    })

    // Retornar lista de investimentos
    return NextResponse.json({
      success: true,
      investimentos
    })

  } catch (error) {
    // Log de erro e retorno de erro genérico
    console.error('Erro ao buscar investimentos:', error)
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

    const { emprestimoId, valorInvestido } = await request.json()

    if (!emprestimoId || !valorInvestido) {
      return NextResponse.json(
        { success: false, error: 'ID do empréstimo e valor são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o empréstimo existe e está disponível
    const emprestimo = await prisma.emprestimo.findUnique({
      where: { id: emprestimoId },
      include: {
        investimento: true
      }
    })

    if (!emprestimo) {
      return NextResponse.json(
        { success: false, error: 'Empréstimo não encontrado' },
        { status: 404 }
      )
    }

    if (emprestimo.status !== 'PENDENTE') {
      return NextResponse.json(
        { success: false, error: 'Empréstimo não está disponível para investimento' },
        { status: 400 }
      )
    }

    // Verificar se o investidor já investiu neste empréstimo
    const investimentoExistente = await prisma.investimento.findFirst({
      where: {
        investidorId: userId,
        emprestimoId: emprestimoId
      }
    })

    if (investimentoExistente) {
      return NextResponse.json(
        { success: false, error: 'Você já investiu neste empréstimo' },
        { status: 400 }
      )
    }

    // Criar investimento
    const investimento = await prisma.investimento.create({
      data: {
        investidorId: userId,
        emprestimoId,
        valorInvestido: parseFloat(valorInvestido)
      }
    })

    // Atualizar status do empréstimo para financiado
    await prisma.emprestimo.update({
      where: { id: emprestimoId },
      data: { 
        status: 'FINANCIADO',
        valorAprovado: parseFloat(valorInvestido),
        financiadoEm: new Date()
      }
    })

    // Criar notificação para o tomador
    await prisma.notificacao.create({
      data: {
        usuarioId: emprestimo.tomadorId,
        titulo: 'Empréstimo Financiado!',
        mensagem: `Seu empréstimo de R$ ${valorInvestido} foi financiado e está disponível.`,
        tipo: 'EMPRESTIMO_FINANCIADO',
        linkRelacionado: '/dashboard'
      }
    })

    // Criar notificação para o investidor
    await prisma.notificacao.create({
      data: {
        usuarioId: userId,
        titulo: 'Investimento Realizado!',
        mensagem: `Seu investimento de R$ ${valorInvestido} foi realizado com sucesso.`,
        tipo: 'GERAL',
        linkRelacionado: '/investor/dashboard'
      }
    })

    // Log da ação
    await prisma.logAcao.create({
      data: {
        usuarioId: userId,
        acao: 'realizar_investimento',
        descricao: `Investimento de R$ ${valorInvestido} no empréstimo ${emprestimoId}`,
        ipOrigem: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      }
    })

    return NextResponse.json({
      success: true,
      investimento
    })

  } catch (error) {
    console.error('Erro ao criar investimento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
