import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar usuário no banco
    const user = await prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        senhaHash: true,
        nome: true,
        sobrenome: true,
        cpf: true,
        telefone: true,
        tipoPerfil: true,
        statusKyc: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.senhaHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Remover senha da resposta e formatar dados
    const { senhaHash: _, ...userWithoutPassword } = user

    // Log da ação
    await prisma.logAcao.create({
      data: {
        usuarioId: user.id,
        acao: 'login',
        descricao: 'Usuário fez login no sistema',
        ipOrigem: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        sobrenome: user.sobrenome,
        cpf: user.cpf,
        telefone: user.telefone,
        tipoPerfil: user.tipoPerfil,
        statusKyc: user.statusKyc
      },
      token: Buffer.from(`${user.id}:${Date.now()}`).toString('base64')
    })

  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}