// Importações necessárias para o sistema de autenticação
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { Client } from 'pg'

// Função principal para processar login de usuários
export async function POST(request: NextRequest) {
  try {
    // Extrair email e senha do corpo da requisição
    const { email, password } = await request.json()

    // Validar se email e senha foram fornecidos
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Conectar diretamente ao banco PostgreSQL (Supabase)
    // Evita dependência do Prisma Client para melhor performance
    const client = new Client({
      connectionString: "postgresql://postgres.brkpqghnsaydripywndf:bbgnexpeer@aws-1-us-east-2.pooler.supabase.com:5432/postgres",
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000
    })
    await client.connect()

    // Buscar usuário no banco de dados pelo email
    const { rows } = await client.query(
      `SELECT 
         id,
         email,
         senha_hash AS "senhaHash",
         nome,
         sobrenome,
         cpf,
         telefone,
         tipo_perfil AS "tipoPerfil",
         status_kyc AS "statusKyc"
       FROM usuarios
       WHERE email = $1
       LIMIT 1`,
      [email]
    )
    const user = rows[0]

    // Verificar se usuário existe
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Verificar se a senha fornecida confere com a senha criptografada no banco
    const isValidPassword = await bcrypt.compare(password, user.senhaHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Remover senha da resposta por segurança
    const { senhaHash: _, ...userWithoutPassword } = user

    // Registrar log de login para auditoria
    try {
      await client.query(
        `INSERT INTO logs_acoes (id, usuario_id, acao, descricao, ip_origem, criado_em)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())`,
        [
          user.id,
          'login',
          'Usuário fez login no sistema',
          request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
        ]
      )
    } catch {}

    // Fechar conexão com o banco
    await client.end()

    // Retornar dados do usuário e token de autenticação
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
      // Gerar token JWT simples usando base64
      token: Buffer.from(`${user.id}:${Date.now()}`).toString('base64')
    })

  } catch (error) {
    // Log de erro e retorno de erro genérico por segurança
    console.error('Erro no login:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}