import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import bcrypt from 'bcryptjs'

// Rota de registro - cria novo usuário no sistema
export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, cpf, phone, profileType } = await request.json()

    // Validação de campos obrigatórios
    if (!firstName || !lastName || !email || !password || !cpf || !phone || !profileType) {
      return NextResponse.json(
        { success: false, error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Validação de senha
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verifica se email já existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Verifica se CPF já existe
    const existingCPF = await prisma.usuario.findUnique({
      where: { cpf }
    })

    if (existingCPF) {
      return NextResponse.json(
        { success: false, error: 'CPF já cadastrado' },
        { status: 400 }
      )
    }

    // Criptografa senha com bcrypt
    const hashedPassword = await bcrypt.hash(password, 12)

    // Cria usuário no banco de dados
    const user = await prisma.usuario.create({
      data: {
        nome: firstName,
        sobrenome: lastName,
        email,
        senhaHash: hashedPassword,
        cpf,
        telefone: phone,
        tipoPerfil: profileType
      },
      select: {
        id: true,
        email: true,
        nome: true,
        sobrenome: true,
        cpf: true,
        telefone: true,
        tipoPerfil: true,
        statusKyc: true,
        criadoEm: true
      }
    })

    // Cria perfil específico baseado no tipo de usuário
    if (profileType === 'TOMADOR') {
      await prisma.perfilTomador.create({
        data: {
          usuarioId: user.id,
          scoreCredito: Math.floor(Math.random() * 200) + 600, // Score inicial aleatório
          limiteCredito: 50000 // Limite inicial
        }
      })
    } else {
      await prisma.perfilInvestidor.create({
        data: {
          usuarioId: user.id,
          perfilRisco: 'MODERADO' // Perfil inicial moderado
        }
      })
    }

    // Registra log de registro
    await prisma.logAcao.create({
      data: {
        usuarioId: user.id,
        acao: 'registro',
        descricao: 'Usuário se registrou no sistema',
        ipOrigem: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      }
    })

    // Retorna dados do usuário criado e token
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
    console.error('Erro no registro:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}