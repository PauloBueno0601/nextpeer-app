const { Client } = require('pg')

async function checkCPFConstraint() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('supabase.com') ? { rejectUnauthorized: false } : undefined
  })
  
  try {
    await client.connect()
    console.log('🔗 Conectado ao banco')
    
    // Verificar estrutura da tabela usuarios
    const result = await client.query(`
      SELECT column_name, is_nullable, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'usuarios' 
      AND column_name IN ('cpf', 'cnpj', 'razao_social', 'nome_fantasia', 'tipo_pessoa')
      ORDER BY column_name
    `)
    
    console.log('📊 Estrutura da tabela usuarios:')
    result.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`)
    })
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  } finally {
    await client.end()
  }
}

checkCPFConstraint()
