const { Client } = require('pg')
const { URL } = require('url')
require('dotenv').config()
const bcrypt = require('bcryptjs')

function getPgConfig() {
  const raw = process.env.DATABASE_URL
  if (!raw) throw new Error('DATABASE_URL não definido')

  const ssl = raw.includes('supabase.com') || raw.includes('pooler.supabase.com')
    ? { rejectUnauthorized: false }
    : undefined

  return {
    connectionString: raw,
    ssl,
  }
}

async function run() {
  const client = new Client(getPgConfig())
  await client.connect()

  try {
    console.log('Iniciando seed no PostgreSQL (Supabase)...')

    await client.query('BEGIN')
    await client.query('DELETE FROM repasses')
    await client.query('DELETE FROM parcelas')
    await client.query('DELETE FROM contratos_ccb')
    await client.query('DELETE FROM investimentos')
    await client.query('DELETE FROM emprestimos')
    await client.query('DELETE FROM notificacoes')
    await client.query('DELETE FROM perfil_investidor')
    await client.query('DELETE FROM perfil_tomador')
    await client.query('DELETE FROM historico_scores')
    await client.query('DELETE FROM logs_acoes')
    await client.query('DELETE FROM usuarios')
    await client.query('COMMIT')

    const hashedPassword = await bcrypt.hash('123456', 10)

    const insertUsuario = `
      INSERT INTO usuarios (id, email, senha_hash, cpf, nome, sobrenome, telefone, tipo_perfil, status_kyc, criado_em)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, NOW())
      RETURNING id
    `

    const users = [
      { id: 'u_ana', email: 'ana@nexpeer.com', senha: hashedPassword, cpf: '11111111111', nome: 'Ana', sobrenome: 'Silva', tel: '11999990001', tipo: 'TOMADOR' },
      { id: 'u_carlos', email: 'carlos@nexpeer.com', senha: hashedPassword, cpf: '22222222222', nome: 'Carlos', sobrenome: 'Souza', tel: '11999990002', tipo: 'TOMADOR' },
      { id: 'u_maria', email: 'maria@nexpeer.com', senha: hashedPassword, cpf: '33333333333', nome: 'Maria', sobrenome: 'Oliveira', tel: '11999990003', tipo: 'INVESTIDOR' },
      { id: 'u_joao', email: 'joao@nexpeer.com', senha: hashedPassword, cpf: '44444444444', nome: 'João', sobrenome: 'Pereira', tel: '11999990004', tipo: 'INVESTIDOR' },
    ]

    for (const u of users) {
      await client.query(insertUsuario, [u.id, u.email, u.senha, u.cpf, u.nome, u.sobrenome, u.tel, u.tipo, 'APROVADO'])
    }

    await client.query(`INSERT INTO perfil_tomador (usuario_id, score_credito, limite_credito, criado_em) VALUES
      ('u_ana', 720, 10000.00, NOW()),
      ('u_carlos', 680, 8000.00, NOW())
    `)

    await client.query(`INSERT INTO perfil_investidor (usuario_id, renda_mensal, patrimonio_total, perfil_risco, limite_investimento, criado_em) VALUES
      ('u_maria', 12000.00, 150000.00, 'MODERADO', 50000.00, NOW()),
      ('u_joao', 8000.00, 90000.00, 'CONSERVADOR', 30000.00, NOW())
    `)

    await client.query(`INSERT INTO emprestimos (id, tomador_id, status, valor_solicitado, valor_aprovado, taxa_juros, prazo_meses, finalidade, criado_em)
      VALUES ('emp_1', 'u_ana', 'FINANCIADO', 5000.00, 5000.00, 0.02, 12, 'Reforma da loja', NOW()),
             ('emp_2', 'u_carlos', 'PENDENTE', 8000.00, NULL, 0.025, 12, 'Capital de giro', NOW())
    `)

    await client.query(`INSERT INTO investimentos (id, emprestimo_id, investidor_id, valor_investido, status, criado_em)
      VALUES ('inv_1', 'emp_1', 'u_maria', 5000.00, 'ATIVO', NOW())
    `)

    for (let i = 1; i <= 12; i++) {
      await client.query(
        `INSERT INTO parcelas (id, emprestimo_id, data_vencimento, valor_parcela, status, criado_em)
         VALUES ($1, 'emp_1', NOW() + INTERVAL '${i} month', 506.90, $2, NOW())`,
        [`parc_${i}`, i === 1 ? 'PAGO' : 'PENDENTE']
      )
    }

    await client.query(`INSERT INTO notificacoes (id, usuario_id, titulo, mensagem, lida, tipo, criado_em)
      VALUES ('notif_1', 'u_ana', 'Empréstimo Aprovado', 'Seu empréstimo foi financiado', false, 'EMPRESTIMO_FINANCIADO', NOW()),
             ('notif_2', 'u_maria', 'Pagamento Recebido', 'Você recebeu um repasse', false, 'PAGAMENTO_RECEBIDO', NOW())
    `)

    const { rows: userRows } = await client.query('SELECT COUNT(*)::int AS c FROM usuarios')
    const { rows: loanRows } = await client.query('SELECT COUNT(*)::int AS c FROM emprestimos')

    console.log('Seed concluído com sucesso no PostgreSQL (Supabase).')
    console.log('Usuarios:', userRows[0]?.c, ' Emprestimos:', loanRows[0]?.c)
  } catch (e) {
    console.error('Erro no seed:', e)
    try { await client.query('ROLLBACK') } catch {}
  } finally {
    await client.end()
  }
}

run()
