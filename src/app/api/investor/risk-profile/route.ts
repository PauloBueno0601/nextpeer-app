import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

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

    const { perfilRisco, rendaMensal, patrimonioTotal, limiteInvestimento } = await request.json()

    if (!perfilRisco) {
      return NextResponse.json(
        { success: false, error: 'Perfil de risco é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o usuário é um investidor
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { tipoPerfil: true }
    })

    if (!usuario || usuario.tipoPerfil !== 'INVESTIDOR') {
      return NextResponse.json(
        { success: false, error: 'Usuário não é um investidor' },
        { status: 400 }
      )
    }

    // Atualizar ou criar perfil do investidor
    const perfilInvestidor = await prisma.perfilInvestidor.upsert({
      where: { usuarioId: userId },
      update: {
        perfilRisco: perfilRisco as 'CONSERVADOR' | 'MODERADO' | 'AGRESSIVO',
        rendaMensal: rendaMensal ? parseFloat(rendaMensal) : null,
        patrimonioTotal: patrimonioTotal ? parseFloat(patrimonioTotal) : null,
        limiteInvestimento: limiteInvestimento ? parseFloat(limiteInvestimento) : null
      },
      create: {
        usuarioId: userId,
        perfilRisco: perfilRisco as 'CONSERVADOR' | 'MODERADO' | 'AGRESSIVO',
        rendaMensal: rendaMensal ? parseFloat(rendaMensal) : null,
        patrimonioTotal: patrimonioTotal ? parseFloat(patrimonioTotal) : null,
        limiteInvestimento: limiteInvestimento ? parseFloat(limiteInvestimento) : null
      }
    })

    // Log da ação
    await prisma.logAcao.create({
      data: {
        usuarioId: userId,
        acao: 'definir_perfil_risco',
        descricao: `Perfil de risco definido como ${perfilRisco}`,
        ipOrigem: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      }
    })

    return NextResponse.json({
      success: true,
      perfilInvestidor
    })

  } catch (error) {
    console.error('Erro ao salvar perfil de risco:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

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

    const perfilInvestidor = await prisma.perfilInvestidor.findUnique({
      where: { usuarioId: userId }
    })

    return NextResponse.json({
      success: true,
      perfilInvestidor
    })

  } catch (error) {
    console.error('Erro ao buscar perfil de risco:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

