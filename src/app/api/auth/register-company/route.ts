import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      razaoSocial,
      nomeFantasia,
      cnpj,
      email,
      telefone,
      nomeRepresentante,
      sobrenomeRepresentante,
      cpfRepresentante,
      cargoRepresentante,
      senha,
      tipoPerfil,
      tipoPessoa
    } = body

    // Validações básicas
    if (!razaoSocial || !nomeFantasia || !cnpj || !email || !nomeRepresentante || !cpfRepresentante || !senha) {
      return NextResponse.json({ 
        success: false, 
        error: 'Todos os campos obrigatórios devem ser preenchidos' 
      }, { status: 400 })
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        success: false, 
        error: 'E-mail inválido' 
      }, { status: 400 })
    }

    // Validação de CNPJ (formato básico)
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
    if (!cnpjRegex.test(cnpj)) {
      return NextResponse.json({ 
        success: false, 
        error: 'CNPJ deve estar no formato 00.000.000/0000-00' 
      }, { status: 400 })
    }

    // Validação de CPF (aceita formato ou apenas números)
    const cpfLimpo = cpfRepresentante.replace(/\D/g, '')
    if (cpfLimpo.length !== 11) {
      return NextResponse.json({ 
        success: false, 
        error: 'CPF deve ter 11 dígitos' 
      }, { status: 400 })
    }

    // Validação de senha
    if (senha.length < 6) {
      return NextResponse.json({ 
        success: false, 
        error: 'A senha deve ter pelo menos 6 caracteres' 
      }, { status: 400 })
    }

    // Verificar se email já existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Verificar se CNPJ já existe
    const existingCNPJ = await prisma.usuario.findUnique({
      where: { cnpj: cnpj }
    })

    if (existingCNPJ) {
      return NextResponse.json(
        { success: false, error: 'CNPJ já cadastrado' },
        { status: 400 }
      )
    }

    // Verificar se CPF do representante já existe
    const existingCPF = await prisma.usuario.findUnique({
      where: { cpf: cpfLimpo }
    })

    if (existingCPF) {
      return NextResponse.json(
        { success: false, error: 'CPF do representante já cadastrado' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 12)

    // Criar usuário empresa
    const user = await prisma.usuario.create({
      data: {
        nome: razaoSocial,
        sobrenome: nomeRepresentante, // Sobrenome obrigatório
        email,
        senhaHash: hashedPassword,
        cpf: cpfLimpo, // CPF do representante obrigatório (sem formatação)
        cnpj,
        razaoSocial,
        nomeFantasia,
        telefone,
        tipoPerfil: tipoPerfil || 'INVESTOR',
        tipoPessoa: 'JURIDICA'
      },
      select: {
        id: true,
        email: true,
        nome: true,
        cnpj: true,
        razaoSocial: true,
        nomeFantasia: true,
        telefone: true,
        tipoPerfil: true,
        tipoPessoa: true,
        statusKyc: true,
        criadoEm: true
      }
    })

    // Criar perfil específico baseado no tipo
    if (tipoPerfil === 'TOMADOR') {
      await prisma.perfilTomador.create({
        data: {
          usuarioId: user.id,
          scoreCredito: Math.floor(Math.random() * 200) + 600,
          limiteCredito: 100000 // Limite maior para empresas
        }
      })
    } else {
      await prisma.perfilInvestidor.create({
        data: {
          usuarioId: user.id,
          perfilRisco: 'MODERADO'
        }
      })
    }

    // Log da ação
    await prisma.logAcao.create({
      data: {
        usuarioId: user.id,
        acao: 'registro_empresa',
        descricao: 'Empresa se registrou no sistema',
        ipOrigem: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        cnpj: user.cnpj,
        razaoSocial: user.razaoSocial,
        nomeFantasia: user.nomeFantasia,
        telefone: user.telefone,
        tipoPerfil: user.tipoPerfil,
        tipoPessoa: user.tipoPessoa,
        statusKyc: user.statusKyc
      },
      token: Buffer.from(`${user.id}:${Date.now()}`).toString('base64')
    })

  } catch (error) {
    console.error('Erro ao criar conta empresa:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}