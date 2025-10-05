import { NextRequest, NextResponse } from 'next/server'
import { Client } from 'pg'

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

    const client = new Client({
      connectionString: "postgresql://postgres.brkpqghnsaydripywndf:bbgnexpeer@aws-1-us-east-2.pooler.supabase.com:5432/postgres",
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000
    })
    await client.connect()

    const { rows } = await client.query(
      `SELECT 
         id,
         email,
         nome,
         sobrenome,
         cpf,
         telefone,
         tipo_perfil AS "tipoPerfil",
         status_kyc AS "statusKyc",
         criado_em   AS "criadoEm"
       FROM usuarios
       WHERE id = $1
       LIMIT 1`,
      [userId]
    )
    const user = rows[0]

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    await client.end()

    return NextResponse.json({ success: true, user })

  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
