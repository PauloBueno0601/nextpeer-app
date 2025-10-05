const { Client } = require('pg')

async function executeFix() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('supabase.com') ? { rejectUnauthorized: false } : undefined
  })
  
  try {
    await client.connect()
    console.log('🔗 Conectado ao banco')
    
    // Ler e executar o SQL
    const fs = require('fs')
    const sql = fs.readFileSync('fix-cpf-constraint.sql', 'utf8')
    
    await client.query(sql)
    console.log('✅ Campo CPF agora é nullable')
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  } finally {
    await client.end()
  }
}

executeFix()
