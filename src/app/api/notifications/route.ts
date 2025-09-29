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

    const notificacoes = await prisma.notificacao.findMany({
      where: { usuarioId: userId },
      orderBy: { criadoEm: 'desc' }
    })

    return NextResponse.json({
      success: true,
      notificacoes
    })

  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
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

    const { notificacaoId } = await request.json()

    if (!notificacaoId) {
      return NextResponse.json(
        { success: false, error: 'ID da notificação é obrigatório' },
        { status: 400 }
      )
    }

    const notificacao = await prisma.notificacao.update({
      where: {
        id: notificacaoId,
        usuarioId: userId
      },
      data: {
        lida: true
      }
    })

    return NextResponse.json({
      success: true,
      notificacao
    })

  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
