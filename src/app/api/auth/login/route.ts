import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { Client } from 'pg'

// Rota de login - autentica usuário no sistema
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validação de campos obrigatórios
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Conecta ao PostgreSQL (Supabase) diretamente
    const client = new Client({
      connectionString: "postgresql://postgres.brkpqghnsaydripywndf:bbgnexpeer@aws-1-us-east-2.pooler.supabase.com:5432/postgres",
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000
    })
    await client.connect()

    // Busca usuário por email
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

    // Verifica se usuário existe
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Verifica senha usando bcrypt
    const isValidPassword = await bcrypt.compare(password, user.senhaHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Remove senha da resposta por segurança
    const { senhaHash: _, ...userWithoutPassword } = user

    // Registra log de login
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

    await client.end()

    // Retorna dados do usuário e token de autenticação
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