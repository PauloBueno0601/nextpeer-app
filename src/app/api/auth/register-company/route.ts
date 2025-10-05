import { NextRequest, NextResponse } from 'next/server'

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

    // Validação de CPF (formato básico)
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    if (!cpfRegex.test(cpfRepresentante)) {
      return NextResponse.json({ 
        success: false, 
        error: 'CPF deve estar no formato 000.000.000-00' 
      }, { status: 400 })
    }

    // Validação de senha
    if (senha.length < 6) {
      return NextResponse.json({ 
        success: false, 
        error: 'A senha deve ter pelo menos 6 caracteres' 
      }, { status: 400 })
    }

    // Simular criação de usuário (sem banco de dados)
    const usuario = {
      id: `empresa_${Date.now()}`,
      email,
      cnpj,
      nome: razaoSocial,
      razaoSocial,
      nomeFantasia,
      telefone,
      tipoPerfil: tipoPerfil || 'INVESTOR',
      tipoPessoa: tipoPessoa || 'JURIDICA',
      statusKyc: 'PENDENTE'
    }

    console.log('Empresa cadastrada:', usuario)

    return NextResponse.json({ 
      success: true, 
      message: 'Conta empresa criada com sucesso',
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        tipoPerfil: usuario.tipoPerfil,
        tipoPessoa: usuario.tipoPessoa
      }
    })

  } catch (error) {
    console.error('Erro ao criar conta empresa:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}